
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

        const snapshot = metricsStore.getSnapshot();
        
        return NextResponse.json({
            success: true,
            metrics: snapshot
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to retrieve metrics' },
            { status: 500 }
        );
    }
}
