
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';

async function count() {
    const supabase = createServiceClient();
    const { count, error } = await supabase.from('credit_cards').select('*', { count: 'exact', head: true });
    if (error) console.error(error);
    else console.log(`Total Cards: ${count}`);
}
count();
