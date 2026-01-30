import { createServiceClient } from '../lib/supabase/service';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debugTestimonials() {
    const supabase = createServiceClient();
    console.log('--- Debugging Testimonials ---');
    const { data, error } = await supabase.from('testimonials').select('*').limit(1);
    
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success. Row count:', data.length);
        if (data.length > 0) {
            console.log('Columns:', Object.keys(data[0]));
        } else {
            console.log('Table is empty.');
        }
    }
}

debugTestimonials();
