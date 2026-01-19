
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkHealthTable() {
  console.log('Checking ai_provider_health table...');
  const { data, error } = await supabase
    .from('ai_provider_health')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Table check failed:', error.message);
  } else {
    console.log('Table exists!');
  }
}

checkHealthTable();
