import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/pipeline/metrics
 * Returns aggregated metrics for the pipeline monitoring dashboard
 */
export async function GET(request: NextRequest) {
    try {
        // TODO: Replace with actual database queries
        // For now, return mock data for demonstration
        
        const metrics = {
            avgSeoScore: 92,
            avgReadabilityScore: 85,
            avgQualityScore: 88,
            estimatedRevenue: 8400,
            totalArticlesToday: 12,
            totalKeywordsTracked: 147,
            affiliateLinksAdded: 24,
            avgClickRate: 2.8,
            
            // SEO breakdown
            seoMetrics: {
                metaOptimization: 92,
                keywordDensity: 88,
                internalLinks: 95,
                schemaMarkup: 90
            },
            
            // Quality breakdown
            qualityMetrics: {
                readability: 85,
                originality: 94,
                depth: 88,
                accuracy: 91
            },
            
            // Trending topics
            trendingTopics: [
                { topic: 'Best Credit Cards 2026', searches: 12500 },
                { topic: 'SBI Home Loan Rates', searches: 9800 },
                { topic: 'Tax Saving Mutual Funds', searches: 8200 }
            ],
            
            // Performance over time
            dailyPerformance: [
                { date: '2026-01-10', articles: 8, seoScore: 89 },
                { date: '2026-01-11', articles: 10, seoScore: 90 },
                { date: '2026-01-12', articles: 12, seoScore: 91 },
                { date: '2026-01-13', articles: 15, seoScore: 92 },
                { date: '2026-01-14', articles: 11, seoScore: 93 },
                { date: '2026-01-15', articles: 13, seoScore: 92 },
                { date: '2026-01-16', articles: 12, seoScore: 92 }
            ]
        };

        return NextResponse.json(metrics);
    } catch (error: any) {
        console.error('Error fetching pipeline metrics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pipeline metrics' },
            { status: 500 }
        );
    }
}
