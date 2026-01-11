
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';

async function testInsert() {
  const supabase = createServiceClient();
  
  console.log('Testing insert into credit_cards...');
  
  const testCard = {
    name: 'Test Card ' + Date.now(),
    issuer: 'Test Bank',
    slug: 'test-card-' + Date.now(),
    source: 'Test',
    source_url: 'http://test.com'
  };
  
  const { data, error } = await supabase.from('credit_cards').insert(testCard).select();
  
  if (error) {
    console.error('Insert Error:', error);
  } else {
    console.log('Insert Success:', data);
    
    // Clean up
    await supabase.from('credit_cards').delete().eq('id', data[0].id);
    console.log('Cleaned up test card');
  }
}

testInsert();
