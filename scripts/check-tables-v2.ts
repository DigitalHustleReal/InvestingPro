
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTable(name: string) {
  // console.log(`Checking table: ${name}...`);
  const { data, error } = await supabase.from(name).select('*').limit(1);
  if (error) {
    console.log(`Table '${name}' ERROR: ${error.message}`);
  } else {
    // console.log(`Table '${name}' EXISTS.`);
    if (data && data.length > 0) {
      console.log(`COLUMNS_FOUND_FOR_${name.toUpperCase()}:`, Object.keys(data[0]).join(','));
    } else {
        console.log(`Table '${name}' IS EMPTY.`);
        // Try getting columns from metadata if empty? No, just seed blind if empty.
    }
  }
}

async function run() {
    await checkTable('posts');
    await checkTable('articles');
}

run();
