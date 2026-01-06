import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function populateBestFor() {
    console.log('📝 Populating best_for values...\n');
    
    const updates = [
        { slug: 'hdfc-regalia-gold', best_for: 'travel-rewards' },
        { slug: 'hdfc-regalia-gold-credit-card', best_for: 'travel-rewards' },
        { slug: 'sbi-card-elite', best_for: 'shopping-rewards' },
        { slug: 'axis-magnus', best_for: 'premium-lifestyle' },
        { slug: 'axis-magnus-credit-card', best_for: 'premium-lifestyle' },
        { slug: 'icici-sapphiro-credit-card', best_for: 'cashback-dining' },
        { slug: 'amazon-pay-icici-credit-card', best_for: 'shopping-rewards' },
        { slug: 'hdfc-moneyback-credit-card', best_for: 'cashback-general' },
        { slug: 'axis-ace-credit-card', best_for: 'fuel-savings' },
        { slug: 'flipkart-axis-bank-credit-card', best_for: 'shopping-rewards' },
    ];
    
    let successCount = 0;
    for (const update of updates) {
        const { error } = await supabase
            .from('products')
            .update({ best_for: update.best_for })
            .eq('slug', update.slug);
            
        if (error) {
            console.log(`  ❌ ${update.slug}: ${error.message}`);
        } else {
            console.log(`  ✅ ${update.slug.padEnd(35)} → ${update.best_for}`);
            successCount++;
        }
    }
    
    console.log(`\n📊 Updated: ${successCount}/${updates.length} products\n`);
    console.log('✨ Done! Now remove the hardcoded mapping from credit-cards/page.tsx\n');
}

populateBestFor()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });
