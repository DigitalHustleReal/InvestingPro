/**
 * SERP-First Content Pipeline API
 *
 * POST: Start pipeline (returns SSE stream)
 * Body: { keyword, category?, authorId?, authorName?, generateImages?, autoDistribute?, style?, keywords? }
 *
 * If `keywords` array is provided, runs batch pipeline for multiple keywords.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  runSerpContentPipeline,
  runBatchSerpPipeline,
  type SerpPipelineEvent,
} from "@/lib/automation/serp-content-pipeline";

export const maxDuration = 300; // 5 minutes max for long pipeline runs
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Auth check
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Auth failed" }, { status: 401 });
  }

  // Parse request
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    keyword,
    keywords,
    category = "personal-finance",
    authorId,
    authorName,
    generateImages = true,
    autoDistribute = false,
    style = "nerdwallet",
  } = body;

  if (!keyword && (!keywords || keywords.length === 0)) {
    return NextResponse.json(
      { error: "keyword or keywords[] required" },
      { status: 400 },
    );
  }

  // SSE streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: SerpPipelineEvent) => {
        try {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch {
          // Stream closed
        }
      };

      try {
        if (keywords && Array.isArray(keywords) && keywords.length > 0) {
          // Batch mode
          const results = await runBatchSerpPipeline(
            keywords,
            {
              category,
              authorId,
              authorName,
              generateImages,
              autoDistribute,
              style,
            },
            emit,
          );

          emit({
            stage: "complete",
            message: `Batch complete: ${results.filter((r) => r.success).length}/${results.length} articles generated`,
            data: {
              results: results.map((r) => ({
                keyword: r.keyword,
                success: r.success,
                articleId: r.article?.id,
                slug: r.article?.slug,
                wordCount: r.article?.wordCount,
              })),
            },
            timestamp: new Date().toISOString(),
          });
        } else {
          // Single keyword mode
          const result = await runSerpContentPipeline(
            {
              keyword,
              category,
              authorId,
              authorName,
              generateImages,
              autoDistribute,
              style,
            },
            emit,
          );

          emit({
            stage: "complete",
            message: result.success
              ? `Done! Article "${result.article?.title}" saved.`
              : "Pipeline completed with errors",
            data: {
              success: result.success,
              article: result.article,
              timings: result.timings,
              errors: result.errors,
            },
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error: any) {
        emit({
          stage: "error",
          message: `Pipeline error: ${error.message}`,
          timestamp: new Date().toISOString(),
        });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/**
 * GET: Check pipeline status / health
 */
export async function GET() {
  return NextResponse.json({
    status: "ready",
    pipeline: "serp-first-content",
    capabilities: [
      "serp_scraping",
      "competitor_analysis",
      "outline_generation",
      "nerdwallet_grade_content",
      "image_generation",
      "auto_distribution",
    ],
    modes: ["single_keyword", "batch_keywords"],
    distribution_channels: ["telegram", "twitter", "linkedin", "email"],
  });
}
