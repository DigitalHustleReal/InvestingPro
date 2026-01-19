/**
 * Categories API Endpoint
 * 
 * Admin-only endpoints for category management
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { withZodValidation } from '@/lib/middleware/zod-validation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const createCategorySchema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    description: z.string().max(500).optional(),
});

// GET /api/admin/categories - List categories
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
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: data || [],
        });
    }, 'categories-list')
);

// POST /api/admin/categories - Create category
export const POST = withErrorHandler(
    withTracing(
        withZodValidation({
            body: createCategorySchema,
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
                .from('categories')
                .insert({
                    name: body.name,
                    slug,
                    description: body.description,
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
        'categories-create'
    )
);
