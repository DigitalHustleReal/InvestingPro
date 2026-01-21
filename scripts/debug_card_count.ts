
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createServiceClient } from '@/lib/supabase/service';

async function main() {
    console.log('--- SCHEMA CHECK ---');
    const supabase = createServiceClient();
    const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error.message);
    } else if (data && data.length > 0) {
        const card = data[0];
        console.log('Available Keys:', Object.keys(card).join(', '));
        console.log('Rating:', card.rating);
        console.log('Features:', JSON.stringify(card.features));
    } else {
        console.log('No data found.');
    }
}
main();
