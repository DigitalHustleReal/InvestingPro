
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkImages() {
  console.log('Starting checkImages...');
  const { data, error } = await supabase.from('articles').select('title, featured_image').limit(20);
  if (error) {
    console.error('Supabase Error:', error);
  } else if (!data || data.length === 0) {
    console.log('No articles found in the database.');
  } else {
    console.log(`Found ${data.length} articles:`);
    console.log(JSON.stringify(data, null, 2));
  }
  process.exit(0);
}

checkImages();
