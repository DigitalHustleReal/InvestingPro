
import { createServiceClient } from '../lib/supabase/service';

const supabase = createServiceClient();

async function checkSchema() {
  const { data, error } = await supabase
    .from('reviews')
    .select('category, pros, cons')
    .limit(1);
    
  if (error) {
    console.log('Error (likely missing columns):', error.message);
  } else {
    console.log('Columns exist. Data:', data);
  }
}

checkSchema();
