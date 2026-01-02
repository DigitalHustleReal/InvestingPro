import { NextRequest, NextResponse } from 'next/server';

/**
 * 🤖 AUTOMATED CONTENT GENERATION API
 * 
 * POST /api/generate-articles
 * 
 * Body:
 * {
 *   "count": 10,           // Number of articles to generate
 *   "phase": "mvl",        // Optional: mvl, month1, month2
 *   "topics": ["..."]      // Optional: Custom topics
 * }
 * 
 * Returns real-time progress via streaming response
 */

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max per request

// Load env at module level
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { count = 10, phase = 'mvl', topics = null } = body;

        // Lazy import to ensure env is loaded
        const { generateArticleCore } = await import('@/lib/automation/article-generator');
        const { getCurrentAuthority } = await import('@/lib/analytics/authority-tracker');

        // Get current authority
        const authority = await getCurrentAuthority();

        // Article topics to generate
        let articleTopics: string[] = [];

        if (topics && Array.isArray(topics)) {
            articleTopics = topics.slice(0, count);
        } else {
            // Use predefined topics from master plan
            const TOPICS = {
                mvl: [
                    'What is SIP - Complete Guide for 2026',
                    'How to Start Investing in Mutual Funds India',
                    'Best Mutual Funds for Beginners 2026',
                    'SIP vs Lump Sum Investment - Which is Better',
                    'How to Choose the Right Mutual Funds',
                    'Mutual Fund Categories Explained Simply',
                    'What is NAV in Mutual Funds - Complete Guide',
                    'How to Read Mutual Fund Fact Sheet',
                    'Tax on Mutual Funds India - Complete Guide 2026',
                    'ELSS Funds - Tax Saving Mutual Funds Explained',
                ],
                month1: [
                    'Best Credit Cards in India 2026',
                    'How to Choose a Credit Card - Complete Guide',
                    'Credit Card Rewards Programs Explained',
                    'How to Improve Credit Score Fast',
                ],
                month2: [
                    'Multi Cap Funds - Best Options 2026',
                    'Small Cap Funds - High Risk High Returns',
                ]
            };

            const phaseTopics = TOPICS[phase as keyof typeof TOPICS] || TOPICS.mvl;
            articleTopics = phaseTopics.slice(0, count);
        }

        // Create a streaming response for progress updates
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Send initial status
                    const initialData = {
                        status: 'started',
                        total: articleTopics.length,
                        authority: authority.domainAuthority,
                        phase
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`));

                    let successCount = 0;
                    let failCount = 0;

                    // Generate articles
                    for (let i = 0; i < articleTopics.length; i++) {
                        const topic = articleTopics[i];

                        // Send progress update
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            status: 'generating',
                            current: i + 1,
                            total: articleTopics.length,
                            topic
                        })}\n\n`));

                        try {
                            // Generate article
                            const result = await generateArticleCore(topic, (msg) => {
                                // Send log messages
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                                    status: 'log',
                                    message: msg
                                })}\n\n`));
                            });

                            if (result.success) {
                                successCount++;
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                                    status: 'success',
                                    topic,
                                    url: result.url,
                                    current: i + 1,
                                    total: articleTopics.length
                                })}\n\n`));
                            } else {
                                failCount++;
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                                    status: 'error',
                                    topic,
                                    error: result.error,
                                    current: i + 1,
                                    total: articleTopics.length
                                })}\n\n`));
                            }

                            // Small delay between articles (30 seconds instead of 2 minutes for admin)
                            if (i < articleTopics.length - 1) {
                                await new Promise(resolve => setTimeout(resolve, 30000));
                            }

                        } catch (error: any) {
                            failCount++;
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                                status: 'error',
                                topic,
                                error: error.message,
                                current: i + 1,
                                total: articleTopics.length
                            })}\n\n`));
                        }
                    }

                    // Send completion
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        status: 'complete',
                        total: articleTopics.length,
                        success: successCount,
                        failed: failCount
                    })}\n\n`));

                    controller.close();

                } catch (error: any) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        status: 'fatal_error',
                        error: error.message
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

// Also support GET for simple trigger
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const count = parseInt(searchParams.get('count') || '5');
    const phase = searchParams.get('phase') || 'mvl';

    // Redirect to POST with default params
    return POST(new NextRequest(req.url, {
        method: 'POST',
        body: JSON.stringify({ count, phase })
    }));
}
