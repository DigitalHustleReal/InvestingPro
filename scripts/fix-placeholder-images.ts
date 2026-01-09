/**
 * Fix Placeholder Images Script
 * 
 * Replaces broken via.placeholder.com URLs with local SVG defaults
 * Usage: npx tsx scripts/fix-placeholder-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPlaceholderImages() {
    console.log('🔧 Fixing placeholder images...\n');

    // Update products with broken via.placeholder URLs
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, provider_name, category, image_url')
        .like('image_url', '%via.placeholder%');

    if (fetchError) {
        console.error('❌ Error fetching products:', fetchError);
        return;
    }

    console.log(`📊 Found ${products?.length || 0} products with placeholder images\n`);

    if (!products || products.length === 0) {
        console.log('✅ No placeholder images to fix!');
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
        // Determine default image based on category
        let defaultImage = '/images/defaults/credit-card-default.svg';
        
        if (product.category?.includes('loan')) {
            defaultImage = '/images/defaults/loan-default.svg';
        } else if (product.category?.includes('invest')) {
            defaultImage = '/images/defaults/investment-default.svg';
        } else if (product.category?.includes('insurance')) {
            defaultImage = '/images/defaults/insurance-default.svg';
        }

        const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: defaultImage })
            .eq('id', product.id);

        if (updateError) {
            console.error(`❌ Failed to update ${product.provider_name}:`, updateError.message);
            failCount++;
        } else {
            console.log(`✅ Updated ${product.provider_name} → ${defaultImage}`);
            successCount++;
        }
    }

    console.log(`\n📈 Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`\n🎉 Done! Placeholder images replaced with local SVGs.`);
}

fixPlaceholderImages().catch(console.error);
