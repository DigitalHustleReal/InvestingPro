import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchRAGContext } from "@/lib/ai/rag-context";
import { buildRAGPrompt } from "@/lib/ai/rag-prompt-builder";
import { aiService } from "@/lib/ai-service";
import { logger } from "@/lib/logger";

export const maxDuration = 120;

/**
 * POST /api/admin/generate-with-rag
 * Generate article content using RAG (real product data from DB)
 *
 * Body: { topic: string, category?: string, template?: string }
 * Returns: { content: string, context: { productCount, calculators, relatedArticles } }
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

    const body = await request.json();
    const { topic, category, template } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Step 1: Fetch RAG context (real product data)
    const ragContext = await fetchRAGContext(topic, category);

    logger.info(
      `RAG context: ${ragContext.products.length} products, ${ragContext.calculatorLinks.length} calculators, ${ragContext.relatedArticles.length} articles`,
    );

    // Step 2: Build enhanced prompt
    const prompt = buildRAGPrompt(topic, ragContext, template);

    // Step 3: Generate with AI
    const content = await aiService.generate(prompt, {
      operation: "generate",
      tier: "precision",
    });

    return NextResponse.json({
      content,
      context: {
        productCount: ragContext.products.length,
        calculators: ragContext.calculatorLinks.map((c) => c.name),
        relatedArticles: ragContext.relatedArticles.length,
      },
    });
  } catch (error) {
    logger.error("RAG generation failed", error as Error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 },
    );
  }
}
