
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';

async function test() {
    console.log('Testing insert...');
    const supabase = createServiceClient();
    const { error } = await supabase.from('credit_cards').upsert({
        slug: 'test-card-1',
        name: 'Test Card',
        bank: 'Test Bank',
        annual_fee: 0,
        joining_fee: 0,
        type: 'Rewards',
        description: 'Test description',
        rating: 4.5,
        rewards: ['feature 1'],
        pros: ['pro 1']
    }, { onConflict: 'slug' });

    if (error) {
        console.error('❌ Insert failed:', error.message);
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Insert succeeded');
    }
}
test();
