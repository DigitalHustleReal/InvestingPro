import { createServiceClient } from '../lib/supabase/service';
import { AffiliateManager } from '../lib/marketing/service';
import { CuelinksAdapter } from '../lib/marketing/adapters/cuelinks';
import slugify from 'slugify';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function syncProducts() {
  const supabase = createServiceClient();
  
  // 1. Init Manager
  const manager = new AffiliateManager();
  
  // 2. Register Adapters
  // In production, get API key from env
  manager.registerAdapter(new CuelinksAdapter(process.env.CUELINKS_API_KEY));
  
  console.log('🚀 Starting Affiliate Sync...');
  
  // 3. Fetch Data
  const categories = ['credit_card', 'loan'];
  
  for (const cat of categories) {
    console.log(`\n📂 Processing category: ${cat}`);
    const offers = await manager.fetchAllProducts(cat);
    console.log(`Found ${offers.length} offers`);
    
    // 4. Upsert to DB
    for (const offer of offers) {
        // Generate a clean slug
        const slug = slugify(offer.name, { lower: true, strict: true });
        
        const payload = {
            name: offer.name,
            slug: slug,
            category: offer.category,
            provider_name: offer.merchant,
            official_link: offer.url, // Storing affiliate link in official_link column (fallback)
            description: offer.description,
            image_url: offer.imageUrl,
            
            // Mark as API-sourced
            verification_status: 'api_sourced',
            verification_notes: JSON.stringify({
                source: 'cuelinks',
                payout: offer.payout,
                external_id: offer.id,
                synced_at: new Date().toISOString()
            }),
            
            updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase
            .from('products')
            .upsert(payload, { onConflict: 'slug' });
            
        if (error) {
            console.error(`❌ Failed to sync ${offer.name}:`, error.message);
        } else {
            console.log(`✅ Synced: ${offer.name}`);
        }
    }
  }
  
  console.log('\n🏁 Sync Complete.');
}

syncProducts().catch(console.error);
