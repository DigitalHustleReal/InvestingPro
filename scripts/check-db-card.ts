
import { createServiceClient } from '../lib/supabase/service';

const supabase = createServiceClient();

async function checkCard(namePart: string) {
  const { data, error } = await supabase
    .from('credit_cards')
    .select('id, name')
    .ilike('name', `%${namePart}%`);
    
  if (error) {
      console.error(error);
      return;
  }
  console.log('Matches:', data);
}

const name = process.argv[2] || 'Regalia';
checkCard(name);
