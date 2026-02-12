import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixStorage() {
    console.log('Fixing storage policies...');
    
    const policies = [
        {
            name: 'Public Access',
            sql: "CREATE POLICY \"Public Access\" ON storage.objects FOR SELECT USING (bucket_id = 'media');"
        },
        {
            name: 'Authenticated Upload',
            sql: "CREATE POLICY \"Authenticated Upload\" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');"
        },
        {
            name: 'Authenticated Update',
            sql: "CREATE POLICY \"Authenticated Update\" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');"
        },
        {
            name: 'Authenticated Delete',
            sql: "CREATE POLICY \"Authenticated Delete\" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');"
        }
    ];

    for (const p of policies) {
        console.log(`Applying policy: ${p.name}...`);
        const wrapper = `
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies 
                    WHERE polname = '${p.name}' 
                    AND tablename = 'objects' 
                    AND schemaname = 'storage'
                ) THEN 
                    ${p.sql}
                END IF; 
            END $$;
        `;
        
        const { error } = await supabase.rpc('exec_sql', { sql_string: wrapper });
        if (error) {
            console.error(`Failed to apply ${p.name}:`, error.message);
        } else {
            console.log(`Policy ${p.name} applied or already exists.`);
        }
    }
    
    console.log('Storage policy fix complete.');
}

fixStorage().catch(console.error);
