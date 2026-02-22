
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
    console.error('JSON_OUTPUT_start');
    console.error(JSON.stringify({ error }));
    console.error('JSON_OUTPUT_end');
    return;
  }

  if (data && data.length > 0) {
    console.log('JSON_OUTPUT_start');
    console.log(JSON.stringify({ keys: Object.keys(data[0]) }));
    console.log('JSON_OUTPUT_end');
  } else {
    console.log('JSON_OUTPUT_start');
    console.log(JSON.stringify({ message: "No authors found" }));
    console.log('JSON_OUTPUT_end');
  }
}

inspectAuthors();
