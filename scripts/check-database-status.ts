import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';

async function checkDatabase() {
  const supabase = createServiceClient();
  
  console.log('\n📊 DATABASE STATUS CHECK\n');
  console.log('='.repeat(60));
  
  // Get counts
  const { count: total } = await supabase
    .from('credit_cards')
    .select('*', { count: 'exact', head: true });
  
  const { count: withDesc } = await supabase
    .from('credit_cards')
    .select('*', { count: 'exact', head: true })
    .not('description', 'is', null);
  
  const { count: withoutDesc } = await supabase
    .from('credit_cards')
    .select('*', { count: 'exact', head: true })
    .is('description', null);
  
  console.log(`Total Credit Cards: ${total}`);
  console.log(`With Descriptions: ${withDesc}`);
  console.log(`Without Descriptions: ${withoutDesc}`);
  console.log('');
  
  // Get samples
  const { data: samples } = await supabase
    .from('credit_cards')
    .select('name, description')
    .limit(5);
  
  console.log('Sample Cards:');
  console.log('─'.repeat(60));
  samples?.forEach((card, idx) => {
    console.log(`\n${idx + 1}. ${card.name}`);
    if (card.description) {
      console.log(`   Description: ${card.description.substring(0, 80)}...`);
      console.log(`   Length: ${card.description.split(' ').length} words`);
    } else {
      console.log(`   Description: MISSING ❌`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Check Complete!\n`);
  
  if (withoutDesc === 0) {
    console.log('💡 All cards have descriptions. Consider:');
    console.log('   1. Check other product categories (loans, insurance)');
    console.log('   2. Generate comparison articles');
    console.log('   3. Audit description quality\n');
  } else {
    console.log(`🎯 Next: Generate descriptions for ${withoutDesc} cards\n`);
  }
}

checkDatabase().catch(console.error);
