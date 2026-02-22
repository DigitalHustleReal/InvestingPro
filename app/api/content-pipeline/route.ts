import { NextRequest, NextResponse } from 'next/server';
import { runContentPipeline, type PipelineMode, type PipelineEvent } from '@/lib/automation/content-pipeline';

/**
 * 🧠 INTELLIGENT CONTENT PIPELINE API
 * 
 * POST /api/content-pipeline
 * 
 * Body:
 * {
 *   "count": 3,               // Number of articles to generate
 *   "mode": "auto",           // "auto" | "trending" | "keyword"
 *   "category": "loans",      // Optional category filter
 *   "seedKeyword": "...",     // Required for mode="keyword"
 * }
 * 
 * Returns SSE (Server-Sent Events) stream with pipeline progress
 */

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max

// Load env at module level
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            count = 3,
            mode = 'auto',
            category = undefined,
            seedKeyword = undefined,
            authorId = undefined,
            authorName = undefined,
            maxKeywordDifficulty = 50,
            minOpportunityScore = 40
        } = body;

        // Validate mode
        if (!['auto', 'trending', 'keyword'].includes(mode)) {
            return NextResponse.json(
                { error: `Invalid mode: ${mode}. Must be "auto", "trending", or "keyword".` },
                { status: 400 }
            );
        }

        // Keyword mode requires seedKeyword
        if (mode === 'keyword' && !seedKeyword) {
            return NextResponse.json(
                { error: 'seedKeyword is required when mode is "keyword".' },
                { status: 400 }
            );
        }

        // Create SSE stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // 1. Initialize Pipeline Logger
                    const { PipelineLogger } = await import('@/lib/pipeline-logger');
                    const pipelineLogger = new PipelineLogger('content_factory');
                    const runId = await pipelineLogger.start({
                        count,
                        mode,
                        category,
                        seedKeyword,
                        authorId
                    });

                    // Emit function sends SSE events
                    const emit = (event: PipelineEvent) => {
                        try {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                        } catch {
                            // Stream may be closed
                        }
                    };

                    // Run the pipeline
                    const result = await runContentPipeline({
                        count,
                        mode: mode as PipelineMode,
                        category,
                        seedKeyword,
                        authorId,
                        authorName,
                        maxKeywordDifficulty,
                        minOpportunityScore,
                        runId // Pass the newly created runId
                    }, emit);

                    // Update pipeline logger status
                    if (result.success) {
                        await pipelineLogger.complete(result);
                    } else {
                        await pipelineLogger.fail(new Error(result.errors.join('; ')));
                    }

                    // Send final result
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        stage: 'result',
                        message: 'Pipeline finished',
                        data: result,
                        timestamp: new Date().toISOString()
                    })}\n\n`));

                    controller.close();
                } catch (error: any) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        stage: 'error',
                        message: error.message || 'Pipeline failed',
                        timestamp: new Date().toISOString()
                    })}\n\n`));
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
