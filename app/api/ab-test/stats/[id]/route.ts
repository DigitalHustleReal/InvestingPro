/**
 * A/B Test Stats API
 * 
 * GET /api/ab-test/stats/[id]
 * Returns detailed statistics for an A/B test
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateStatisticalSignificance } from '@/lib/analytics/ab-testing';

type AbTestEvent = { variant_id: string; event_type: string; created_at?: string };

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        
        // Get test details
        const { data: test, error: testError } = await supabase
            .from('ab_tests')
            .select('*')
            .eq('id', id)
            .single();
        
        if (testError || !test) {
            return NextResponse.json(
                { error: 'Test not found' },
                { status: 404 }
            );
        }
        
        // Get all events for this test
        const { data: events, error: eventsError } = await supabase
            .from('ab_test_events')
            .select('variant_id, event_type, created_at')
            .eq('test_id', id);
        
        if (eventsError) {
            return NextResponse.json(
                { error: 'Failed to fetch events' },
                { status: 500 }
            );
        }
        
        // Calculate stats per variant
        const variantStats: Record<string, { 
            impressions: number; 
            conversions: number;
            ctr: number;
        }> = {};
        
        // Initialize with all variants from test
        (test.variants as any[]).forEach((variant: any) => {
            variantStats[variant.id] = { impressions: 0, conversions: 0, ctr: 0 };
        });
        
        // Count events
        (events || []).forEach((event: AbTestEvent) => {
            if (!variantStats[event.variant_id]) {
                variantStats[event.variant_id] = { impressions: 0, conversions: 0, ctr: 0 };
            }
            if (event.event_type === 'impression') {
                variantStats[event.variant_id].impressions++;
            } else if (event.event_type === 'conversion') {
                variantStats[event.variant_id].conversions++;
            }
        });
        
        // Calculate CTR and find winner
        const variantIds = Object.keys(variantStats);
        variantIds.forEach(variantId => {
            const stats = variantStats[variantId];
            stats.ctr = stats.impressions > 0 
                ? (stats.conversions / stats.impressions) * 100 
                : 0;
        });
        
        // Calculate statistical significance if we have 2 variants
        let confidence = 0;
        let winner: string | null = null;
        
        if (variantIds.length >= 2) {
            const [variantA, variantB] = variantIds;
            const statsA = variantStats[variantA];
            const statsB = variantStats[variantB];
            
            if (statsA.impressions >= 100 && statsB.impressions >= 100) {
                confidence = calculateStatisticalSignificance(
                    { impressions: statsA.impressions, conversions: statsA.conversions },
                    { impressions: statsB.impressions, conversions: statsB.conversions }
                );
                
                // Determine winner if confidence > 95%
                if (confidence >= 95) {
                    winner = statsA.ctr > statsB.ctr ? variantA : variantB;
                }
            }
        }
        
        // Calculate timeline data (last 7 days)
        const now = new Date();
        const timeline: { date: string; impressions: number; conversions: number }[] = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayEvents = (events || []).filter((e: AbTestEvent) => 
                e.created_at?.startsWith(dateStr)
            );
            
            timeline.push({
                date: dateStr,
                impressions: dayEvents.filter((e: AbTestEvent) => e.event_type === 'impression').length,
                conversions: dayEvents.filter((e: AbTestEvent) => e.event_type === 'conversion').length,
            });
        }
        
        return NextResponse.json({
            test: {
                id: test.id,
                name: test.name,
                status: test.status,
                element: test.element,
                trafficSplit: test.traffic_split,
                variants: test.variants,
            },
            stats: {
                variants: Object.entries(variantStats).map(([id, stats]) => ({
                    id,
                    name: (test.variants as any[]).find((v: any) => v.id === id)?.name || id,
                    ...stats,
                })),
                totalImpressions: Object.values(variantStats).reduce((sum, s) => sum + s.impressions, 0),
                totalConversions: Object.values(variantStats).reduce((sum, s) => sum + s.conversions, 0),
                confidence,
                winner,
                isStatisticallySignificant: confidence >= 95,
            },
            timeline,
        });
        
    } catch (error) {
        console.error('Error fetching A/B test stats:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
