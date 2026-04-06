import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { logger } from "@/lib/logger";

export const maxDuration = 60;

/**
 * POST /api/admin/images/generate
 * Generate an image using DALL-E 3
 *
 * Body: { prompt: string, style?: "featured" | "inline" | "infographic", size?: "1024x1024" | "1792x1024" }
 * Returns: { url: string, alt: string, revised_prompt: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Image generation requires OPENAI_API_KEY. Add it to environment variables.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { prompt, style = "featured", size = "1792x1024" } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Build style-specific prompt
    const stylePrompts: Record<string, string> = {
      featured: `Professional, clean financial blog featured image. Modern flat illustration style with green and white color scheme. No text overlay. Topic: ${prompt}`,
      inline: `Simple, clean illustration for a finance article section. Minimal style, white background, green accents. Topic: ${prompt}`,
      infographic: `Clean data visualization infographic style. Modern, minimal, green and dark theme. Professional financial data presentation. Topic: ${prompt}`,
    };

    const enhancedPrompt = stylePrompts[style] || stylePrompts.featured;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: size as "1024x1024" | "1792x1024",
      quality: "standard",
    });

    const imageData = response.data?.[0];
    if (!imageData?.url) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 },
      );
    }

    logger.info(`Image generated: ${style}, prompt: ${prompt.slice(0, 50)}...`);

    return NextResponse.json({
      url: imageData.url,
      alt: prompt,
      revised_prompt: imageData.revised_prompt || prompt,
    });
  } catch (error) {
    logger.error("Image generation failed", error as Error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Image generation failed",
      },
      { status: 500 },
    );
  }
}
