/**
 * Active A/B Test API
 * 
 * GET /api/ab-test/active?element=headline
 * Returns the active A/B test for a given element type
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const element = searchParams.get('element');
        
        if (!element) {
            return NextResponse.json(
                { error: 'element parameter is required' },
                { status: 400 }
            );
        }
        
        const supabase = await createClient();
        
        // Get active test for element
        const { data, error } = await supabase
            .from('ab_tests')
            .select('*')
            .eq('element', element)
            .eq('status', 'running')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error('Error fetching A/B test:', error);
            return NextResponse.json({ test: null });
        }
        
        if (!data) {
            return NextResponse.json({ test: null });
        }
        
        // Transform to client format
        const test = {
            id: data.id,
            name: data.name,
            element: data.element,
            variants: data.variants,
            status: data.status,
            trafficSplit: data.traffic_split,
        };
        
        return NextResponse.json({ test });
        
    } catch (error) {
        console.error('Error in active A/B test:', error);
        return NextResponse.json({ test: null });
    }
}
