/**
 * Batch Creation API
 * Accepts keywords and config to create a new content batch
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { name, keywords, config } = await request.json();

        if (!name || !keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return NextResponse.json({ 
                error: 'Invalid request. Need name and keywords array' 
            }, { status: 400 });
        }

        console.log(`📦 Creating batch "${name}" with ${keywords.length} keywords`);

        // 1. Create the Batch record
        const { data: batch, error: batchError } = await supabase
            .from('content_batches')
            .insert({
                name,
                total_items: keywords.length,
                config,
                status: 'pending'
            })
            .select()
            .single();

        if (batchError) throw batchError;

        // 2. Create Batch Items
        const items = keywords.map(keyword => ({
            batch_id: batch.id,
            keyword: keyword.trim(),
            status: 'pending'
        }));

        const { error: itemsError } = await supabase
            .from('batch_items')
            .insert(items);

        if (itemsError) throw itemsError;

        return NextResponse.json({
            success: true,
            batchId: batch.id,
            message: `Batch "${name}" created with ${keywords.length} items`
        });

    } catch (error: any) {
        console.error('Batch creation error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to create batch'
        }, { status: 500 });
    }
}
