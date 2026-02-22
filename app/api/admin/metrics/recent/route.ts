
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { metricsStore } from '@/lib/metrics/store';

export async function GET(req: NextRequest) {
    try {
        // Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');

        const logs = metricsStore.getRecentLogs(limit);
        
        return NextResponse.json({
            success: true,
            metrics: logs
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to retrieve recent metrics' },
            { status: 500 }
        );
    }
}
