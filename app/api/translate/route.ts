/**
 * AI Translation API
 * Translates articles into Indian regional languages using GPT-4
 * Creates a new draft article with the translated content
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { requireAuthApi } from "@/lib/auth/require-auth-api";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Language Map
const LANGUAGES: Record<string, string> = {
  hi: "Hindi",
  te: "Telugu",
  mr: "Marathi",
  ta: "Tamil",
  bn: "Bengali",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
};

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAuthApi();
    if (authError) return authError;

    const { articleId, targetLang } = await request.json();

    if (!articleId || !targetLang) {
      return NextResponse.json(
        { error: "Article ID and Target Language required" },
        { status: 400 },
      );
    }

    const langName = LANGUAGES[targetLang] || targetLang;

    // 1. Fetch Original Article
    const { data: article, error: fetchError } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .single();

    if (fetchError || !article) {
      throw new Error("Article not found");
    }

    logger.info(`🌐 Translating "${article.title}" to ${langName}...`);

    // 2. Translate Content using GPT-4
    // We do this in one pass for context, requesting JSON output
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional financial translator. Translate the following article content from English to ${langName}.
                    
                    Guidelines:
                    - Maintain professional financial tone.
                    - Keep all Markdown formatting (headings, bold, lists) exactly as is.
                    - Translate Title, Excerpt, and Body.
                    - Do NOT translate technical terms that are commonly used in English (like "SIP", "Nifty", "Sensex") if appropriate, or provide the native term.
                    - Ensure the output is natural and grammatically correct in ${langName}.
                    
                    Return JSON:
                    {
                        "title": "Translated Title",
                        "excerpt": "Translated Excerpt",
                        "body": "Translated Markdown Body"
                    }`,
        },
        {
          role: "user",
          content: `
                    Title: ${article.title}
                    Excerpt: ${article.excerpt}
                    Body: ${article.body_markdown}
                    `,
        },
      ],
      temperature: 0.3, // Lower temperature for more accurate translation
    });

    const rawContent = completion.choices[0].message.content;
    let translatedData;

    try {
      translatedData = JSON.parse(rawContent || "{}");
    } catch (e) {
      logger.error("Translation JSON parse error", e);
      throw new Error("Failed to parse translation response");
    }

    if (!translatedData.title || !translatedData.body) {
      throw new Error("Incomplete translation received");
    }

    // 3. Create New Auto-Saved Draft
    // We append language to slug to avoid collision
    const newSlug = `${article.slug}-${targetLang}-${Date.now()}`;

    const { data: newArticle, error: saveError } = await supabase
      .from("articles")
      .insert({
        title: translatedData.title,
        slug: newSlug,
        body_markdown: translatedData.body,
        excerpt: translatedData.excerpt,
        category: article.category, // Keep same category
        featured_image: article.featured_image, // Keep same image
        author_id: article.author_id, // Keep same author
        status: "draft", // Always draft first
        tags: [...(article.tags || []), langName.toLowerCase()],
        seo_title: translatedData.title, // Default to translated title
        seo_description: translatedData.excerpt, // Default to translated excerpt
      })
      .select()
      .single();

    if (saveError) throw saveError;

    logger.info(`✅ Translation Complete: ${newArticle.id}`);

    return NextResponse.json({
      success: true,
      originalId: articleId,
      translatedArticleId: newArticle.id,
      language: langName,
      message: `Successfully translated to ${langName}`,
    });
  } catch (error: any) {
    logger.error("Translation error:", error);
    return NextResponse.json(
      {
        error: error.message || "Translation failed",
      },
      { status: 500 },
    );
  }
}
