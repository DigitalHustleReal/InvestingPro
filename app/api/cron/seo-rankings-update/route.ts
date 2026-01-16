/**
 * SEO Rankings Update Cron Job
 * Automatically tracks keyword rankings for target keywords
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/seo-rankings-update",
 *     "schedule": "0 8 * * *" // Daily at 8 AM
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackMultipleKeywords, getAllTrackedKeywords } from '@/lib/seo/serp-tracker';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Verify cron secret (for Vercel Cron Jobs)
function verifyCronSecret(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret) {
        return true; // Allow if no secret configured (for local development)
    }

    return authHeader === `Bearer ${cronSecret}`;
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

        logger.info('SEO rankings update started');

        // Get target keywords from environment or database
        const targetKeywords = process.env.SEO_TARGET_KEYWORDS
            ? process.env.SEO_TARGET_KEYWORDS.split(',').map(k => k.trim()).filter(Boolean)
            : [];

        // Or get keywords from articles (top keywords from published articles)
        let keywordsToTrack = targetKeywords;

        if (keywordsToTrack.length === 0) {
            // Get top keywords from articles
            const { data: articles } = await supabase
                .from('articles')
                .select('title, tags')
                .eq('status', 'published')
                .limit(50);

            // Extract keywords from titles (simple extraction)
            const extractedKeywords = new Set<string>();
            articles?.forEach(article => {
                // Extract main keywords from title (first 3-4 words)
                const titleWords = article.title.split(' ').slice(0, 4);
                if (titleWords.length >= 2) {
                    extractedKeywords.add(titleWords.join(' ').toLowerCase());
                }
            });

            keywordsToTrack = Array.from(extractedKeywords).slice(0, 20); // Limit to 20 keywords
        }

        if (keywordsToTrack.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No keywords to track',
                tracked: 0,
                keywords: []
            });
        }

        // Track all keywords
        const results = await trackMultipleKeywords(keywordsToTrack);

        const upKeywords = results.filter(r => r.trend === 'up');
        const downKeywords = results.filter(r => r.trend === 'down');
        const newKeywords = results.filter(r => r.trend === 'new');
        const lostKeywords = results.filter(r => r.trend === 'lost');

        logger.info('SEO rankings update complete', {
            total: results.length,
            up: upKeywords.length,
            down: downKeywords.length,
            new: newKeywords.length,
            lost: lostKeywords.length
        });

        return NextResponse.json({
            success: true,
            message: `Tracked ${results.length} keywords`,
            tracked: results.length,
            results: {
                up: upKeywords.length,
                down: downKeywords.length,
                new: newKeywords.length,
                lost: lostKeywords.length,
                stable: results.filter(r => r.trend === 'stable').length
            },
            keywords: results,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        logger.error('Error in SEO rankings update cron', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update SEO rankings',
                message: error.message
            },
            { status: 500 }
        );
    }
}
