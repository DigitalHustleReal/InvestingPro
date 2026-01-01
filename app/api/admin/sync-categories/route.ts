import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { NAVIGATION_CONFIG } from '@/lib/navigation/config';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
    try {
        const categories = NAVIGATION_CONFIG.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            description: cat.description
        }));

        // Upsert categories
        const { data, error } = await supabase
            .from('categories')
            .upsert(categories, { onConflict: 'slug' })
            .select();

        if (error) throw error;

        // OPTIONAL: Seed Subcategories if table exists
        // Since we don't know if 'subcategories' table exists, we skip for now.
        // Or we could tag them? 

        return NextResponse.json({ 
            success: true, 
            message: `Synced ${categories.length} categories`,
            data 
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
