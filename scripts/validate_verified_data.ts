
import { createServiceClient } from '@/lib/supabase/service';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function validate() {
  console.log("🔍 Validating Verified Data...");
  const sb = createServiceClient();
  let products;
  
  // First try with tags
  const { data: dataWithTags, error: errorWithTags } = await sb
    .from('products')
    .select('name, category, tags, features, verification_status, verification_notes')
    .eq('verification_status', 'verified');

  if (errorWithTags) {
     if (errorWithTags.message.includes('does not exist')) {
         console.warn("⚠️ 'tags' column missing in DB. Retrying verification without tags...");
         const { data: dataWithoutTags, error: errorWithoutTags } = await sb
            .from('products')
            .select('name, category, features, verification_status, verification_notes')
            .eq('verification_status', 'verified');
         
         if (errorWithoutTags) {
             console.error("❌ DB Error (retry):", errorWithoutTags.message);
             process.exit(1);
         }
         products = dataWithoutTags;
     } else {
         console.error("❌ DB Error:", errorWithTags.message);
         process.exit(1);
     }
  } else {
      products = dataWithTags;
  }

  if (!products || products.length === 0) {
    console.error("❌ No verified products found!");
    process.exit(0);
  }

  console.log(`✅ Found ${products.length} verified products.`);

  // Group by category
  const breakdown: Record<string, number> = {};
  products.forEach(p => {
     breakdown[p.category] = (breakdown[p.category] || 0) + 1;
  });
  console.table(breakdown);

  // Check tags
  const validTags = products.every(p => Array.isArray(p.tags) && p.tags.length > 0);
  if (!validTags) {
     console.log("⚠️ Some products match missing tags:");
     products.filter(p => !p.tags || p.tags.length === 0).forEach(p => console.log(`   - ${p.name}`));
  } else {
     console.log("✅ All verified products have tags.");
  }

  // Check features type
  const badFeatures = products.filter(p => Array.isArray(p.features));
  if (badFeatures.length > 0) {
     console.warn(`⚠️ ${badFeatures.length} products have Array features (expected Object map). Frontend might show 'Free' fees.`);
     console.log(`Example: ${badFeatures[0].name}`);
  } else {
     console.log("✅ All features are Objects (or null).");
  }
}

validate().catch(console.error);
