/**
 * Tags API Endpoint
 * 
 * Admin-only endpoints for tag management
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { withZodValidation } from '@/lib/middleware/zod-validation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const createTagSchema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
});

// GET /api/admin/tags - List tags
export const GET = withErrorHandler(
    withTracing(async (request: NextRequest) => {
        const supabase = await createClient();
        
        // Check admin access
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
                { status: 401 }
            );
        }

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json(
                { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
                { status: 403 }
            );
        }

        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: data || [],
        });
    }, 'tags-list')
);

// POST /api/admin/tags - Create tag
export const POST = withErrorHandler(
    withTracing(
        withZodValidation({
            body: createTagSchema,
        })(async (request: NextRequest, context: any) => {
            const body = context.body;
            const supabase = await createClient();
            
            // Check admin access
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return NextResponse.json(
                    { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
                    { status: 401 }
                );
            }

            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'admin') {
                return NextResponse.json(
                    { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
                    { status: 403 }
                );
            }

            // Generate slug if not provided
            const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-');

            const { data, error } = await supabase
                .from('tags')
                .insert({
                    name: body.name,
                    slug,
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            return NextResponse.json({
                success: true,
                data,
            }, { status: 201 });
        }),
        'tags-create'
    )
);
