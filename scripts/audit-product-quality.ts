import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function auditProducts() {
  console.log('🔍 PRODUCT SUITABILITY AUDIT\n');
  console.log('═'.repeat(80));
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`\n📊 Total Products: ${products.length}\n`);
  
  // Quality checks
  const issues = {
    testProducts: [],
    missingImages: [],
    placeholderImages: [],
    missingDescriptions: [],
    lowRatings: [],
    inactive: [],
    missingProviders: [],
    total: 0
  };
  
  products.forEach((p, i) => {
    // Check for test products
    if (p.name.toLowerCase().includes('test') || p.slug.includes('test')) {
      issues.testProducts.push(p.name);
    }
    
    // Check images
    if (!p.image_url) {
      issues.missingImages.push(p.name);
    } else if (p.image_url.includes('placeholder') || p.image_url.includes('default')) {
      issues.placeholderImages.push(p.name);
    }
    
    // Check descriptions
    if (!p.description || p.description.length < 50) {
      issues.missingDescriptions.push(p.name);
    }
    
    // Check ratings
    if (!p.rating || p.rating < 3) {
      issues.lowRatings.push(`${p.name} (${p.rating || 'N/A'})`);
    }
    
    // Check active status
    if (!p.is_active) {
      issues.inactive.push(p.name);
    }
    
    // Check provider
    if (!p.provider_name) {
      issues.missingProviders.push(p.name);
    }
  });
  
  // Print summary
  console.log('🚨 ISSUES FOUND:\n');
  
  if (issues.testProducts.length > 0) {
    console.log(`❌ Test Products (${issues.testProducts.length}):`);
    issues.testProducts.forEach(name => console.log(`   - ${name}`));
    console.log('');
  }
  
  if (issues.missingImages.length > 0) {
    console.log(`🖼️  Missing Images (${issues.missingImages.length}):`);
    issues.missingImages.forEach(name => console.log(`   - ${name}`));
    console.log('');
  }
  
  if (issues.placeholderImages.length > 0) {
    console.log(`🎨 Placeholder Images (${issues.placeholderImages.length}):`);
    issues.placeholderImages.forEach(name => console.log(`   - ${name}`));
    console.log('');
  }
  
  if (issues.missingDescriptions.length > 0) {
    console.log(`📝 Poor Descriptions (${issues.missingDescriptions.length}):`);
    issues.missingDescriptions.forEach(name => console.log(`   - ${name}`));
    console.log('');
  }
  
  if (issues.lowRatings.length > 0) {
    console.log(`⭐ Low Ratings (${issues.lowRatings.length}):`);
    issues.lowRatings.forEach(name => console.log(`   - ${name}`));
    console.log('');
  }
  
  if (issues.inactive.length > 0) {
    console.log(`😴 Inactive Products (${issues.inactive.length}):`);
    issues.inactive.forEach(name => console.log(`   - ${name}`));
    console.log('');
  }
  
  if (issues.missingProviders.length > 0) {
    console.log(`🏢 Missing Providers (${issues.missingProviders.length}):`);
    issues.missingProviders.forEach(name => console.log(`   - ${name}`));
    console.log('');
  }
  
  const totalIssues = issues.testProducts.length + 
                      issues.missingImages.length + 
                      issues.placeholderImages.length +
                      issues.missingDescriptions.length +
                      issues.lowRatings.length +
                      issues.inactive.length +
                      issues.missingProviders.length;
  
  console.log('═'.repeat(80));
  console.log(`\n📈 SUMMARY:`);
  console.log(`   Total Products: ${products.length}`);
  console.log(`   Total Issues: ${totalIssues}`);
  console.log(`   Quality Score: ${Math.round((1 - totalIssues/(products.length * 7)) * 100)}%`);
  
  if (totalIssues === 0) {
    console.log('\n✅ ALL PRODUCTS ARE SUITABLE!\n');
  } else {
    console.log(`\n⚠️  ${totalIssues} issues need attention\n`);
  }
  
  // Category breakdown
  console.log('\n📊 BY CATEGORY:\n');
  const byCategory = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });
  
  console.log('\n');
}

auditProducts();
