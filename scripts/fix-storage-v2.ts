import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixStorage() {
    console.log('Fixing storage policies (v2)...');
    
    // We use a simpler block that drops and recreates
    const sql = `
        -- Ensure policies exist for the 'media' bucket
        
        -- 1. SELECT (Public Read)
        DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
        CREATE POLICY "Public Read Access" ON storage.objects
            FOR SELECT USING (bucket_id = 'media');

        -- 2. INSERT (Authenticated Upload)
        DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
        CREATE POLICY "Authenticated Upload Access" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

        -- 3. UPDATE (Authenticated Update)
        DROP POLICY IF EXISTS "Authenticated Update Access" ON storage.objects;
        CREATE POLICY "Authenticated Update Access" ON storage.objects
            FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

        -- 4. DELETE (Authenticated Delete)
        DROP POLICY IF EXISTS "Authenticated Delete Access" ON storage.objects;
        CREATE POLICY "Authenticated Delete Access" ON storage.objects
            FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
    `;

    const { error } = await supabase.rpc('exec_sql', { sql_string: sql });
    
    if (error) {
        console.error('Failed to apply storage policies:', error.message);
    } else {
        console.log('Storage policies applied successfully.');
    }
    
    console.log('Storage policy fix complete.');
}

fixStorage().catch(console.error);
