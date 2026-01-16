
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using anon key for read-only is fine usually, or use SERVICE_ROLE if RLS blocks

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportToCSV() {
  console.log('🔄 Fetching credit cards...');

  const { data: cards, error } = await supabase
    .from('credit_cards')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching cards:', error);
    return;
  }

  if (!cards || cards.length === 0) {
    console.log('⚠️ No cards found in database.');
    return;
  }

  console.log(`✅ Found ${cards.length} cards. Preparing CSV...`);

  // Define CSV Headers mapping to Canva variables
  const headers = [
    'Card Name',
    'Bank Name',
    'Annual Fee',
    'Reward Rate',
    'Welcome Bonus',
    'Rating',
    'Provider Image URL', // For Canva to potentially import images
    'Apply Link'
  ];

  const rows = cards.map(card => {
    // Format values nicely
    const annualFee = card.annual_fee === 0 ? 'Free' : `₹${card.annual_fee.toLocaleString('en-IN')}`;
    const rewardRate = card.reward_rate ? `${card.reward_rate}%` : 'Varies';
    const rating = card.rating ? card.rating.toFixed(1) : 'N/A';
    
    // Sanitize string fields for CSV (escape quotes)
    const safeString = (str: any) => {
      if (!str) return '';
      return `"${String(str).replace(/"/g, '""')}"`; // Wrap in quotes and escape double quotes
    };

    return [
      safeString(card.name),
      safeString(card.provider_name || card.provider),
      safeString(annualFee),
      safeString(rewardRate),
      safeString(card.welcome_bonus || 'None'),
      safeString(rating),
      safeString(card.image_url),
      safeString(card.apply_link)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const outputPath = path.join(process.cwd(), 'canva_bulk_data.csv');

  fs.writeFileSync(outputPath, csvContent);

  console.log(`🎉 CSV exported successfully to: ${outputPath}`);
  console.log(`\n📋 Next Steps in Canva:`);
  console.log(`1. Upload 'canva_bulk_data.csv' via Apps > Bulk Create`);
  console.log(`2. Connect data fields (Right click element > Connect Data)`);
  console.log(`3. Click Continue > Generate Designs`);
}

exportToCSV().catch(console.error);
