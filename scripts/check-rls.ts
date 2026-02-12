import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRLS() {
    console.log('--- CHECKING STORAGE RLS POLICIES ---');

    // Query pg_policies for storage schema
    const { data: policies, error } = await supabase.rpc('exec_sql', {
        sql_string: "SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'"
    });

    if (error) {
        // If exec_sql handles it differently or fails
        console.log('Attempting direct query via REST (might fail if not allowed)...');
        // Let's try to just list the policies via a more standard way if possible, 
        // but storage policies are usually in storage.policies table if configured via dashboard
        
        const { data: storagePolicies, error: spError } = await supabase
            .from('storage.policies') // This might not work via standard API
            .select('*');
            
        if (spError) {
             console.error('Could not query storage policies directly:', spError.message);
             console.log('Trying to use exec_sql with a return value...');
             
             // Let's try to get them via a simple select if exec_sql is available
             // Wait, exec_sql in migration was void. Let's create one that returns json.
        }
    } else {
        console.log('Policies for storage.objects:');
        console.log(JSON.stringify(policies, null, 2));
    }

    // Let's just create a helper to see policies
    const { data: policyData, error: policyError } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT polname, polcmd, polroles, polqual::text, polwithcheck::text FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'"
    }).catch(() => ({ data: null, error: true }));

    if (policyError) {
        console.log('exec_sql_query not found. Checking if we can create it.');
    }

    console.log('\n--- SCAN COMPLETE ---');
}

// Since I have exec_sql (void), I'll just use it to create a query function
async function setupAndCheck() {
    console.log('Setting up diagnostic function...');
    await supabase.rpc('exec_sql', {
        sql_string: `
            CREATE OR REPLACE FUNCTION exec_sql_query(sql_query text)
            RETURNS json
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            DECLARE
                result json;
            BEGIN
                EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
                RETURN result;
            END;
            $$;
            GRANT EXECUTE ON FUNCTION exec_sql_query(text) TO service_role;
        `
    }).catch(e => console.error('Setup failed:', e));

    const { data: results, error } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT polname, polcmd, polroles, polqual::text, polwithcheck::text FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'"
    });

    if (error) {
        console.error('Query failed:', error);
    } else {
        console.log('Storage Policies:');
        console.log(JSON.stringify(results, null, 2));
    }
}

setupAndCheck().catch(console.error);
