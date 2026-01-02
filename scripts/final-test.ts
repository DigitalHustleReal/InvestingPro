
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debug() {
    const { data: pOld, error: eOld } = await supabase.from('products').insert({
        slug: 'legacy-test-' + Date.now(),
        name: 'Legacy Test',
        product_type: 'credit_card',
        provider: 'HDFC'
    }).select();
    console.log('Legacy Insert:', pOld, eOld?.message);

    const { data: pNew, error: eNew } = await supabase.from('products').insert({
        slug: 'modern-test-' + Date.now(),
        name: 'Modern Test',
        category: 'credit_card',
        provider_name: 'HDFC'
    }).select();
     console.log('Modern Insert:', pNew, eNew?.message);
}

debug();
