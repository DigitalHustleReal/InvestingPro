
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';

async function verify() {
    console.log('🕵️ Verifying Data Quality...');
    const supabase = createServiceClient();
    
    // Fetch last 5 cards
    const { data: cards, error } = await supabase
        .from('credit_cards')
        .select('name, bank, annual_fee, joining_fee, rewards, apply_link')
        .limit(5)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Error fetching data:', error.message);
        return;
    }

    if (!cards || cards.length === 0) {
        console.log('⚠️ No cards found in database.');
        return;
    }

    console.log(`✅ Found ${cards.length} recent cards:\n`);
    cards.forEach((card, i) => {
        console.log(`[${i+1}] ${card.name} (${card.bank})`);
        console.log(`    💰 Fees: Annual ₹${card.annual_fee} | Joining ₹${card.joining_fee}`);
        console.log(`    🎁 Rewards: ${JSON.stringify(card.rewards)}`);
        console.log(`    🔗 Link: ${card.apply_link}`);
        console.log('--------------------------------------------------');
    });
}
verify();
