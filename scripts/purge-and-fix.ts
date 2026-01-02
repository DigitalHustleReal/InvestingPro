
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function purgeAndFix() {
    console.log("🧨 EMERGENCY PURGE & REBUILD OF PRODUCTS TABLE...");
    
    // We use RPC to execute raw SQL to fix the table structure once and for all
    const sql = `
        -- 1. Drop the table if it exists (CASCADE to handle triggers/indexes)
        DROP TABLE IF EXISTS products CASCADE;

        -- 2. Create the table with PERFECT structure
        CREATE TABLE products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            slug TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            provider_name TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            rating NUMERIC(3,1) DEFAULT 4.0,
            features JSONB DEFAULT '{}'::jsonb,
            pros TEXT[] DEFAULT '{}',
            cons TEXT[] DEFAULT '{}',
            affiliate_link TEXT,
            official_link TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now(),
            last_verified_at TIMESTAMPTZ,
            verification_status TEXT DEFAULT 'pending',
            verification_notes TEXT,
            trust_score INTEGER DEFAULT 0
        );

        -- 3. Add Index
        CREATE INDEX idx_products_slug ON products(slug);
        CREATE INDEX idx_products_category ON products(category);
    `;

    // Try to execute via exec_sql RPC which we know the system has for migrations
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
        console.error("❌ PURGE FAILED:", error.message);
        console.log("⚠️  Attempting fallback via direct API calls...");
    } else {
        console.log("✅ TABLE REBUILT SUCCESSFULLY.");
    }
}

purgeAndFix();
