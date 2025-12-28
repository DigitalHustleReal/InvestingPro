import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * GET /api/scraper/trending
 * Get trending keywords and topics
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Get trending keywords from database (if we have a trends table)
        // For now, return mock data structure that can be replaced with real data
        const trending = [
            { keyword: 'SIP Calculator', change: +15.2, volume: 12400, trend: 'up' },
            { keyword: 'Mutual Funds', change: +8.7, volume: 8900, trend: 'up' },
            { keyword: 'Credit Cards', change: -3.2, volume: 5600, trend: 'down' },
            { keyword: 'Tax Saving', change: +22.1, volume: 15200, trend: 'up' },
            { keyword: 'FD Rates', change: +5.4, volume: 7800, trend: 'up' },
            { keyword: 'ELSS Funds', change: +12.3, volume: 10200, trend: 'up' },
            { keyword: 'Home Loan EMI', change: +6.8, volume: 9200, trend: 'up' },
            { keyword: 'PPF Interest Rate', change: +4.2, volume: 6800, trend: 'up' }
        ];

        return NextResponse.json({
            success: true,
            topics: trending,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        logger.error('Failed to fetch trending data', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch trending data' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/scraper/trending
 * Trigger trending data collection/scraping
 */
export async function POST(request: NextRequest) {
    try {
        // In the future, this could trigger a scraper to collect trending data
        // For now, return the same data as GET
        const response = await GET(request);
        return response;
    } catch (error: any) {
        logger.error('Failed to scrape trending data', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to scrape trending data' },
            { status: 500 }
        );
    }
}








