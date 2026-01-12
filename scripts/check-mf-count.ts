
import { createServiceClient } from '../lib/supabase/service';

const supabase = createServiceClient();

async function checkCount() {
  const { count, error } = await supabase
    .from('mutual_funds')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting MF:', error.message);
  } else {
    console.log(`Total Mutual Funds in DB: ${count}`);
  }
}

checkCount();
