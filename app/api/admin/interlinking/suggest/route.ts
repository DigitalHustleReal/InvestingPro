import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  findRelatedArticles,
  findLinkOpportunities,
} from "@/lib/automation/auto-interlinking";
import OpenAI from "openai";
import { logger } from "@/lib/logger";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const { articleId, content, category, title } = await req.json();

    if (!articleId || !content) {
      return NextResponse.json(
        { error: "Article ID and content are required" },
        { status: 400 },
      );
    }

    // 1. Find related articles using our keyword logic
    const relatedArticles = await findRelatedArticles(articleId, {
      maxResults: 15,
      minRelevance: 0.2,
      category,
    });

    if (relatedArticles.length === 0) {
      return NextResponse.json({
        suggestions: [],
        message: "No related articles found",
      });
    }

    // 2. Use OpenAI to find semantic link opportunities
    // We provide the list of candidate articles and the current content
    const candidates = relatedArticles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
    }));

    const systemPrompt = `You are an SEO expert specializing in internal linking for a financial website.
Your task is to analyze the provided article content and suggest contextually relevant internal links to other articles from a provided list of candidates.

Rules:
1. Suggest exactly where to place the link in the text.
2. Provide the anchor text (existing words in the content).
3. Do not suggest more than 5-7 links in total.
4. Ensure links are spread out naturally.
5. Prioritize relevance and high-value internal linking for SEO.

Return a JSON array of suggestions:
[{
  "articleId": "id",
  "title": "Related Article Title",
  "slug": "related-article-slug",
  "anchorText": "exact words from content",
  "context": "surrounding text for reference",
  "relevanceReason": "Short explanation why this link adds value"
}]`;

    const userPrompt = `Current Article Title: ${title}
Candidate Articles:
${JSON.stringify(candidates, null, 2)}

Article Content:
${content.substring(0, 15000)} // Truncate if too long
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(
      response.choices[0].message.content || '{"suggestions": []}',
    );
    const suggestions = result.suggestions || [];

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    logger.error("Failed to suggest interlinks", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
