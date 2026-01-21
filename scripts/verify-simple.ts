
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';

async function verify() {
    console.log('--- CHECKING DATABASE ---');
    const supabase = createServiceClient();
    
    // Fetch last 3 cards
    const { data: cards } = await supabase
        .from('credit_cards')
        .select('*')
        .limit(3)
        .order('created_at', { ascending: false });

    if (cards) {
        cards.forEach(c => {
            console.log(`CARD: ${c.name}`);
            console.log(`BANK: ${c.bank}`);
            console.log(`FEE: Annual: ${c.annual_fee} | Joining: ${c.joining_fee}`);
            console.log('---');
        });
    } else {
        console.log("No data found.");
    }
}
verify();
