
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';
import fs from 'fs';
import path from 'path';

interface CreditCard {
  name: string;
  issuer: string;
  card_type?: string;
  annual_fee?: number;
  joining_fee?: number;
  features?: string[];
  best_for?: string;
  rating?: number;
  source: string;
  source_url: string;
  image_url?: string;
}

async function importJson() {
  console.log('📦 Importing Finology JSON backup...');
  
  const jsonPath = path.join(process.cwd(), 'credit_cards_backup.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ No backup file found!');
    return;
  }
  
  const rawCards = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`found ${rawCards.length} raw cards`);
  
  // Deduplicate
  const uniqueCards = new Map();
  for (const card of rawCards) {
    const slug = card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!uniqueCards.has(slug)) {
      uniqueCards.set(slug, { ...card, slug });
    }
  }
  
  const cardsToInsert = Array.from(uniqueCards.values());
  console.log(`✨ Deduplicated to ${cardsToInsert.length} unique cards`);
  
  const supabase = createServiceClient();
  
  let success = 0;
  let failed = 0;
  
  for (const card of cardsToInsert) {
    // Map to DB Schema
    // Schema: bank, type, annual_fee (text), joining_fee (text)
    
    let type = 'Rewards'; // Default
    const t = card.card_type || '';
    if (t.includes('Premium')) type = 'Premium';
    else if (t.includes('Travel')) type = 'Travel';
    else if (t.includes('Fuel')) type = 'Fuel';
    else if (t.includes('Shopping')) type = 'Shopping';
    else if (t.includes('Cashback')) type = 'Cashback';
    
    // Generate a clean description if missing (placeholder)
    const { error } = await supabase.from('credit_cards').upsert({
      slug: card.slug,
      name: card.name,
      bank: card.issuer, // Map issuer -> bank
      type: type, // Map card_type -> type
      annual_fee: card.annual_fee || 0, // Pass number
      joining_fee: card.joining_fee || 0, // Pass number
      pros: card.features || [],
      rewards: [], // Initialize empty
      rating: card.rating || 4.5,
      image_url: card.image_url,
      // min_income: 'Check eligibility', // Column missing in DB
      // interest_rate: '3.6% per month', // Column missing in DB
      updated_at: new Date().toISOString()
    }, { onConflict: 'slug' });
    
    if (error) {
      console.log(`❌ Failed ${card.name}: ${error.message}`);
      failed++;
    } else {
      console.log(`✅ Saved ${card.name}`);
      success++;
    }
  }
  
  console.log(`\nImport Complete: ${success} saved, ${failed} failed`);
}

importJson().catch(console.error);
