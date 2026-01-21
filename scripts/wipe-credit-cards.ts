
import { createServiceClient } from '@/lib/supabase/service';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function wipe() {
    console.log('🗑️ Wiping credit_cards table...');
    const supabase = createServiceClient();
    const { error: deletionError } = await supabase
        .from('credit_cards')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a always-true condition for safety in some SQL configs, or just delete all)
    
    // Actually .delete().neq('id', '0') is safer way to say "delete all" in Supabase js if no filter provided
    
    if (deletionError) {
        console.error('Error wiping:', deletionError);
    } else {
        console.log('✅ Table wiped successfully.');
    }
}
wipe();
