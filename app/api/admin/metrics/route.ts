
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/auth/require-admin-api';
import { metricsStore } from '@/lib/metrics/store';

export async function GET(req: NextRequest) {
    try {
        // Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Admin role verification
        const { data: adminRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (adminRole?.role !== 'admin') {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();
            if (profile?.role !== 'admin') {
                return NextResponse.json(
                    { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
                    { status: 403 }
                );
            }
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
