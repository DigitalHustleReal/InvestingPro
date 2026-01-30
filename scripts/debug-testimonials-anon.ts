import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debugAnonTestimonials() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    console.log('--- Debugging Testimonials (Anon Role) ---');
    console.log('URL:', supabaseUrl);
    // Don't log the full key, just first few chars
    console.log('Anon Key:', supabaseAnonKey.substring(0, 10) + '...');

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Attempt 1: Fetch testimonials
    console.log('\nFetching testimonials...');
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .limit(3);
    
    if (error) {
        console.error('❌ Error (Anon):', error);
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
    } else {
        console.log('✅ Success (Anon). Row count:', data.length);
    }
}

debugAnonTestimonials().catch(console.error);
