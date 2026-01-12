import { createServiceClient } from '../lib/supabase/service';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verify() {
    const supabase = createServiceClient();
    
    // 1. Get Count
    const { count, error } = await supabase
        .from('mutual_funds')
        .select('*', { count: 'exact', head: true });
        
    if (error) {
        console.error('Check failed:', error.message);
        return;
    } 
    console.log(`\n✅ Mutual Funds in DB: ${count}`);

    // 2. Get Sample
    const { data: sample } = await supabase
        .from('mutual_funds')
        .select('name, category, nav, returns_1y, returns_3y')
        .limit(3);

    if (sample && sample.length > 0) {
        console.log('\n📊 Sample Data:');
        console.table(sample);
    } else {
        console.log('⚠️ No data found to sample.');
    }
}

verify().catch(console.error);
