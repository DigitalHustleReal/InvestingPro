
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data, error } = await supabase.from('credit_cards').select('*').limit(1).single();
  if (error) {
    console.error('Error fetching credit card:', error);
    return;
  }
  const fs = require('fs');
  fs.writeFileSync('credit_card_sample.json', JSON.stringify(data, null, 2));
  console.log('Wrote sample to credit_card_sample.json');
}

inspect();
