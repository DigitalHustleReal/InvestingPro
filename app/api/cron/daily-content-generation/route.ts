/**
 * Daily Content Generation Cron Job
 * Generates 5 keyword-targeted articles per day
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/daily-content-generation",
 *     "schedule": "0 6 * * *" // 6 AM IST daily
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

// Verify cron secret (for Vercel Cron Jobs)
function verifyCronSecret(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret) {
        return true; // Allow if no secret configured (for local development)
    }

    return authHeader === `Bearer ${cronSecret}`;
}

// Keyword research topics (priority: Credit Cards + Mutual Funds)
const DAILY_TOPICS = [
    // Credit Cards (60% priority)
    { category: 'credit-cards', topic: 'Best Credit Card for Online Shopping in India 2026', keywords: ['credit card online shopping', 'cashback credit card', 'ecommerce credit card'] },
    { category: 'credit-cards', topic: 'Best Travel Credit Card with Lounge Access India 2026', keywords: ['travel credit card', 'airport lounge access', 'air miles credit card'] },
    { category: 'credit-cards', topic: 'Best Credit Card for Fuel Expenses in India 2026', keywords: ['fuel credit card', 'petrol credit card', 'fuel cashback'] },
    
    // Mutual Funds (40% priority)
    { category: 'mutual-funds', topic: 'Best SIP for ₹5000 Per Month - Long-Term Investment Guide 2026', keywords: ['sip 5000', 'monthly sip', 'long term investment'] },
    { category: 'mutual-funds', topic: 'Best ELSS Tax Saving Mutual Funds - Section 80C Benefits 2026', keywords: ['elss mutual funds', 'tax saving', 'section 80c'] },
];

// Rotate through topics (use date to determine which topics to generate today)
function getTopicsForToday(): typeof DAILY_TOPICS {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Generate 5 articles per day, rotating through topics
    const topicsToGenerate: typeof DAILY_TOPICS = [];
    for (let i = 0; i < 5; i++) {
        const topicIndex = (dayOfYear * 5 + i) % DAILY_TOPICS.length;
        topicsToGenerate.push(DAILY_TOPICS[topicIndex]);
    }
    
    return topicsToGenerate;
}

export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        if (!verifyCronSecret(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        logger.info('Daily content generation started');

        const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // Get topics for today
        const topics = getTopicsForToday();
        logger.info(`Generating ${topics.length} articles for today`, { topics: topics.map(t => t.topic) });

        // Queue article generation jobs
        const jobIds: string[] = [];
        const results: Array<{ topic: string; success: boolean; jobId?: string; error?: string }> = [];

        for (const topicData of topics) {
            try {
                // Call article generation API
                const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/articles/generate-comprehensive`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Use service role key for internal API calls
                        'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
                    },
                    body: JSON.stringify({
                        topic: topicData.topic,
                        category: topicData.category,
                        targetKeywords: topicData.keywords,
                        wordCount: 2000, // Target 2000+ words
                        contentLength: 'comprehensive',
                        autoPublish: false // Don't auto-publish, require manual review first
                    })
                });

                if (!response.ok) {
                    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
                    throw new Error(error.error || `HTTP ${response.status}`);
                }

                const result = await response.json();
                jobIds.push(result.jobId || result.id);
                results.push({
                    topic: topicData.topic,
                    success: true,
                    jobId: result.jobId || result.id
                });

                logger.info(`Queued article generation`, { topic: topicData.topic, jobId: result.jobId });

            } catch (error: any) {
                logger.error(`Failed to queue article generation`, error, { topic: topicData.topic });
                results.push({
                    topic: topicData.topic,
                    success: false,
                    error: error.message
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            success: true,
            message: `Queued ${successCount} article(s) for generation`,
            generated: successCount,
            failed: failureCount,
            jobIds,
            results,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        logger.error('Error in daily content generation cron', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate daily content',
                message: error.message
            },
            { status: 500 }
        );
    }
}
