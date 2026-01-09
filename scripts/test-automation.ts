/**
 * Test Automation - Add Product with Auto Image Generation
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testAutomation() {
  console.log('\n🧪 Testing Product Image Automation\n');
  console.log('═'.repeat(60));
  
  // 1. Add test product
  console.log('\n📦 Step 1: Adding test product...');
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: 'Test Auto Image ' + new Date().getTime(),
      provider_name: 'HDFC',
      category: 'credit-cards',
      slug: 'test-auto-' + Date.now(),
      description: 'Test product for automation',
      image_url: null, // Will be auto-generated
      is_active: false // Mark as test
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Failed to add product:', error);
    return;
  }
  
  console.log(`✅ Product added:`);
  console.log(`   ID: ${product.id}`);
  console.log(`   Name: ${product.name}`);
  console.log(`   Slug: ${product.slug}`);
  
  // 2. Trigger automatic image generation
  console.log('\n🎨 Step 2: Triggering automatic image generation...');
  try {
    const response = await fetch('http://localhost:3000/api/products/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id })
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ API call successful:');
    console.log(`   Image URL: ${result.imageUrl}`);
    console.log(`   Cost: $${result.cost}`);
    
  } catch (error: any) {
    console.error('❌ API call failed:', error.message);
    console.log('\n⚠️  Make sure dev server is running: npm run dev');
    return;
  }
  
  // 3. Wait a bit for image to save
  console.log('\n⏳ Step 3: Waiting for image to save...');
  await new Promise(r => setTimeout(r, 3000));
  
  // 4. Verify image was added
  console.log('\n✅ Step 4: Verifying image was added...');
  const { data: updated } = await supabase
    .from('products')
    .select('image_url')
    .eq('id', product.id)
    .single();
  
  if (updated?.image_url && !updated.image_url.includes('default')) {
    console.log('✅ SUCCESS! Image auto-generated:');
    console.log(`   ${updated.image_url}`);
    console.log('\n🎉 Automation is working perfectly!');
  } else {
    console.log('❌ FAILED - No image generated');
    console.log('   Check logs above for errors');
  }
  
  // 5. Cleanup
  console.log('\n🧹 Step 5: Cleaning up test product...');
  await supabase
    .from('products')
    .delete()
    .eq('id', product.id);
  console.log('✅ Test product deleted');
  
  console.log('\n' + '═'.repeat(60));
  console.log('Test complete!\n');
}

testAutomation().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
