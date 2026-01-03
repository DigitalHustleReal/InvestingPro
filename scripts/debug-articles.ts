
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Test with ANON KEY (Client side simulation)
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Test with SERVICE ROLE (Admin)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
    console.log('Running Check...');
    const { data: adminData } = await supabaseAdmin.from('articles').select('*');
    console.log(`Admin Count: ${adminData?.length || 0}`);

    const { data: publicData, error: publicError } = await supabaseAnon.from('articles').select('*');
    if (publicError) console.log(`Public Error: ${publicError.message}`);
    else console.log(`Public Count: ${publicData?.length || 0}`);
}

check();
