import { createServiceClient } from '@/lib/supabase/service';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Requires node-fetch or use undici if on Node 18+

dotenv.config({ path: '.env.local' });

async function mirrorAssets() {
    const supabase = createServiceClient();
    console.log('🖼️ Starting Asset Mirroring to Supabase Storage...');

    // 1. Find all products with external images
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, image_url')
        .not('image_url', 'is', null)
        .not('image_url', 'ilike', '%supabase%'); // Skip already mirrored

    if (error) {
        console.error('Failed to fetch products:', error);
        return;
    }

    console.log(`🔍 Found ${products.length} products with external assets.`);

    for (const product of products) {
        try {
            console.log(`⬇️ Mirroring: ${product.name}...`);
            
            // Download
            const response = await fetch(product.image_url);
            if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
            
            const buffer = await response.arrayBuffer();
            const contentType = response.headers.get('content-type') || 'image/jpeg';
            const ext = contentType.split('/')[1] || 'jpg';
            const fileName = `mirrored/${product.id}.${ext}`;

            // Upload to Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('media')
                .upload(fileName, buffer, {
                    contentType,
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(fileName);

            // Update Product
            const { error: updateError } = await supabase
                .from('products')
                .update({ image_url: publicUrl })
                .eq('id', product.id);

            if (updateError) throw updateError;

            console.log(`✅ Success: ${product.name} -> ${fileName}`);
        } catch (e: any) {
            console.error(`❌ Failed mirroring ${product.name}:`, e.message);
        }
    }

    console.log('\n🏁 Mirroring Complete.');
}

mirrorAssets().catch(console.error);
