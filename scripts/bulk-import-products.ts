
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function bulkImport() {
    const filePath = path.join(process.cwd(), 'products.json');
    
    if (!fs.existsSync(filePath)) {
        console.error('❌ File not found: products.json');
        console.log('Please place a products.json file in the root directory.');
        console.log('Format: Array of objects matching the products table structure.');
        process.exit(1);
    }

    console.log('📦 Reading products.json...');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    let products;
    
    try {
        products = JSON.parse(rawData);
    } catch (e) {
        console.error('❌ Invalid JSON format.');
        process.exit(1);
    }

    if (!Array.isArray(products) || products.length === 0) {
        console.error('❌ Data must be an array of product objects.');
        process.exit(1);
    }

    console.log(`🚀 Found ${products.length} products. Starting import...`);

    // Process in batches of 50
    const BATCH_SIZE = 50;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
        const batch = products.slice(i, i + BATCH_SIZE).map(p => ({
            ...p,
            slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('products')
            .upsert(batch, { onConflict: 'slug' });

        if (error) {
            console.error(`❌ Batch failed (${i} - ${i + BATCH_SIZE}):`, error.message);
            failCount += batch.length;
        } else {
            console.log(`✅ Imported batch ${i / BATCH_SIZE + 1}`);
            successCount += batch.length;
        }
    }

    console.log('\n🎉 Import Summary:');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
}

bulkImport().catch(console.error);
