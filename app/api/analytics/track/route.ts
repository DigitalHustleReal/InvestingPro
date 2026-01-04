import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * Analytics Event Tracking API
 * POST /api/analytics/track
 */
export async function POST(request: NextRequest) {
    try {
        const event = await request.json();
        const supabase = createServiceClient();

        // Store event in analytics table
        const { error } = await supabase
            .from('analytics_events')
            .insert({
                event_name: event.event,
                properties: event.properties || {},
                timestamp: event.timestamp || new Date().toISOString(),
                user_agent: request.headers.get('user-agent'),
                ip_address: request.headers.get('x-forwarded-for') || 
                           request.headers.get('x-real-ip') || 
                           'unknown'
            });

        if (error) {
            console.error('Analytics insert error:', error);
            // Don't return error to client - fail silently
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json({ success: false }, { status: 200 }); // Return 200 anyway
    }
}

/**
 * Get Analytics Stats
 * GET /api/analytics/stats?period=today|week|month
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'today';
        const supabase = createServiceClient();

        // Calculate date range
        const now = new Date();
        let startDate = new Date();
        
        switch (period) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setDate(now.getDate() - 30);
                break;
        }

        // Get event counts
        const { data: events, error } = await supabase
            .from('analytics_events')
            .select('event_name, properties, timestamp')
            .gte('timestamp', startDate.toISOString());

        if (error) throw error;

        // Aggregate stats
        const stats = {
            total_events: events?.length || 0,
            page_views: events?.filter(e => e.event_name === 'page_view').length || 0,
            product_views: events?.filter(e => e.event_name === 'product_view').length || 0,
            comparisons: events?.filter(e => e.event_name === 'comparison_started').length || 0,
            affiliate_clicks: events?.filter(e => e.event_name === 'affiliate_click').length || 0,
            searches: events?.filter(e => e.event_name === 'search').length || 0,
            top_products: getTopProducts(events || []),
            top_categories: getTopCategories(events || []),
            conversion_rate: calculateConversionRate(events || [])
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Analytics stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

function getTopProducts(events: any[]): Array<{ name: string; views: number }> {
    const productViews: Record<string, number> = {};
    
    events
        .filter(e => e.event_name === 'product_view')
        .forEach(e => {
            const name = e.properties?.product_name || 'Unknown';
            productViews[name] = (productViews[name] || 0) + 1;
        });

    return Object.entries(productViews)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, views]) => ({ name, views }));
}

function getTopCategories(events: any[]): Array<{ category: string; views: number }> {
    const categoryViews: Record<string, number> = {};
    
    events
        .filter(e => e.event_name === 'product_view' || e.event_name === 'page_view')
        .forEach(e => {
            const category = e.properties?.category || 'Unknown';
            categoryViews[category] = (categoryViews[category] || 0) + 1;
        });

    return Object.entries(categoryViews)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category, views]) => ({ category, views }));
}

function calculateConversionRate(events: any[]): number {
    const views = events.filter(e => e.event_name === 'product_view').length;
    const clicks = events.filter(e => e.event_name === 'affiliate_click').length;
    
    if (views === 0) return 0;
    return Math.round((clicks / views) * 100 * 10) / 10; // Round to 1 decimal
}
