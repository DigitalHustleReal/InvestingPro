import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * GET /api/social-media/accounts
 * List all social media accounts
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('social_media_accounts')
            .select('*')
            .order('platform', { ascending: true })
            .catch(() => ({ data: [], error: null }));

        if (error || !data) {
            return NextResponse.json({
                success: true,
                accounts: [],
                message: 'Social media accounts table not found. Run migration to create table.'
            });
        }

        return NextResponse.json({
            success: true,
            accounts: data
        });
    } catch (error: any) {
        logger.error('Failed to fetch social media accounts', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch accounts' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/social-media/accounts
 * Add a new social media account
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const accountData = await request.json();

        const { data, error } = await supabase
            .from('social_media_accounts')
            .insert([accountData])
            .select()
            .single()
            .catch(() => ({ data: null, error: { message: 'Table not found' } }));

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message || 'Failed to create account' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            account: data
        });
    } catch (error: any) {
        logger.error('Failed to create social media account', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create account' },
            { status: 500 }
        );
    }
}








