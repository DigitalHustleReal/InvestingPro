import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/auth/require-admin-api';
import { affiliateService } from '@/lib/monetization/affiliate-service';
import { logger } from '@/lib/logger';

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

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'stats';
        const partnerId = searchParams.get('partnerId') || undefined;

        switch (type) {
            case 'stats':
                const stats = await affiliateService.getStats();
                return NextResponse.json(stats);

            case 'partners':
                const partners = await affiliateService.getPartners();
                return NextResponse.json({ partners });

            case 'links':
                const links = await affiliateService.getLinks(partnerId);
                return NextResponse.json({ links });

            case 'contextual':
                const category = searchParams.get('category') || 'mutual-funds';
                const limit = parseInt(searchParams.get('limit') || '3');
                const contextualLinks = await affiliateService.getContextualLinks(category, limit);
                return NextResponse.json({ links: contextualLinks });

            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

    } catch (error) {
        logger.error('Affiliate API error', error as Error);
        return NextResponse.json({ error: 'Failed to fetch affiliate data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
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

        const body = await req.json();
        const { action, ...data } = body;

        switch (action) {
            case 'create_link':
                const { partnerId, name, destinationUrl, campaign, placement } = data;
                
                if (!partnerId || !name || !destinationUrl) {
                    return NextResponse.json(
                        { error: 'Missing required fields' },
                        { status: 400 }
                    );
                }

                const link = await affiliateService.createLink({
                    partnerId,
                    name,
                    destinationUrl,
                    campaign,
                    placement
                });

                if (!link) {
                    return NextResponse.json(
                        { error: 'Failed to create link' },
                        { status: 500 }
                    );
                }

                return NextResponse.json({ link });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

    } catch (error) {
        logger.error('Affiliate API POST error', error as Error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
