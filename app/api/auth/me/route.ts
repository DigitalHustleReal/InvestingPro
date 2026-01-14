/**
 * Get Current User Endpoint
 * 
 * Returns current authenticated user information
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = withErrorHandler(
    withTracing(async (request: NextRequest) => {
        const supabase = await createClient();
        
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'AUTH_ERROR',
                        message: error.message,
                        statusCode: 401,
                    },
                },
                { status: 401 }
            );
        }

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Not authenticated',
                        statusCode: 401,
                    },
                },
                { status: 401 }
            );
        }

        // Get user profile if exists
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                ...profile,
            },
        });
    }, 'auth-me')
);
