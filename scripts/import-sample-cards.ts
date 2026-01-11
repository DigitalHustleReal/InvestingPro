import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createServiceClient } from '../lib/supabase/service';
import fs from 'fs';
import path from 'path';

async function importCreditCards() {
  const supabase = createServiceClient();
  
  const filePath = path.join(process.cwd(), 'sample-credit-cards.json');
  
  console.log('\n🚀 CREDIT CARD IMPORT\n');
  console.log('='.repeat(60));
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found: sample-credit-cards.json');
    console.log('Looking for file at:', filePath);
    return;
  }
  
  console.log('📦 Reading credit cards...');
  const cards = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  console.log(`Found ${cards.length} credit cards\n`);
  
  let success = 0;
  let failed = 0;
  
  for (const card of cards) {
    // Add required fields
    const cardData = {
      ...card,
      slug: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log(`Importing: ${card.name}...`);
    
    const { error } = await supabase
      .from('credit_cards')
      .insert(cardData);
    
    if (error) {
      console.log(`  ❌ Failed: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✅ Imported`);
      success++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(60) + '\n');
  
  if (success > 0) {
    console.log('🎯 Next: Generate descriptions for these cards');
    console.log('   Run: npx tsx scripts/generate-cards-with-quality.ts\n');
  }
}

importCreditCards().catch(console.error);
