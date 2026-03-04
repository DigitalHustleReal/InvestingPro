import { createClient } from "@/lib/supabase/client";
import { logger } from '@/lib/logger';
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || '30d';
        
        const supabase = createClient();

        // 1. Get total keyword count
        const { count: totalKeywords, error: countError } = await supabase
            .from('keyword_data_cache')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        // 2. Get active keywords (keywords with search volume > 0 or verified)
        const { count: activeKeywords, error: activeError } = await supabase
            .from('keyword_data_cache')
            .select('*', { count: 'exact', head: true })
            .gt('search_volume', 0);

        if (activeError) throw activeError;

        // 3. Get trending keywords (top by volume)
        const { data: trendingKeywords, error: trendingError } = await supabase
            .from('keyword_data_cache')
            .select('keyword, search_volume, difficulty')
            .order('search_volume', { ascending: false })
            .limit(10);

        if (trendingError) throw trendingError;

        return NextResponse.json({
            totalKeywords: totalKeywords || 0,
            activeKeywords: activeKeywords || 0,
            trendingKeywords: trendingKeywords || [],
            timeRange
        });
    } catch (error: any) {
        logger.error('Error fetching keyword stats:', error);
        return NextResponse.json({ 
            totalKeywords: 0, 
            activeKeywords: 0, 
            trendingKeywords: [],
            error: error.message 
        }, { status: 500 });
    }
}
