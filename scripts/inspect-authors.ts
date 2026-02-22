
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

async function inspectAuthors() {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching authors:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]).join(', '));
  } else {
    console.log('No authors found.');
  }
}

inspectAuthors();
