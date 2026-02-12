import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function purgeTestData() {
  console.log('Purging test articles...');
  
  const { data, error } = await supabase
    .from('articles')
    .delete()
    .ilike('title', 'Verify Manual Article%');

  if (error) {
    console.error('Error purging articles:', error);
  } else {
    console.log('Successfully purged test articles.');
  }

  // Also purge common test slugs
  const { error: slugError } = await supabase
    .from('articles')
    .delete()
    .in('slug', ['test-article', 'manual-test-v1', 'manual-test-v2']);

  if (slugError) {
    console.error('Error purging slugs:', slugError);
  } else {
    console.log('Successfully purged test slugs.');
  }
}

purgeTestData().catch(console.error);
