import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
    const triedNames = ['exec_sql', 'execute_sql', 'run_sql', 'admin_exec_sql'];
    const triedParams = ['sql', 'query', '_sql', 'p_sql'];

    console.log('--- Probing for SQL execution RPC ---');

    for (const name of triedNames) {
        for (const param of triedParams) {
            try {
                const { error, data } = await supabase.rpc(name, { [param]: 'SELECT 1' });
                if (error) {
                    if (error.message.includes('Could not find the function')) {
                        // Keep trying
                    } else {
                        console.log(`Potential match found: ${name}(${param}), but failed with: ${error.message}`);
                    }
                } else {
                    console.log(`✅ FOUND! rpc('${name}', { ${param}: '...' }) works!`);
                    return;
                }
            } catch (e) {
                // ignore
            }
        }
    }
    console.log('No SQL RPC found.');
}

run().catch(console.error);
