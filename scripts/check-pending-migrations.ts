import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkMigrations() {
    console.log('Checking for migration tracking tables...');
    
    try {
        // Check in supabase_migrations.schema_migrations (Supabase CLI default)
        const { data: schemaMigrations, error: smError } = await supabase.rpc('exec_sql_query', {
            sql_query: "SELECT version FROM supabase_migrations.schema_migrations ORDER BY version DESC"
        });

        if (schemaMigrations && !smError) {
            console.log('Found supabase_migrations.schema_migrations table.');
            console.log('Applied versions:', (schemaMigrations as any[]).slice(0, 5).map((m: any) => m.version));
            
            // List local migration files
            const migrationsDir = 'supabase/migrations';
            if (fs.existsSync(migrationsDir)) {
                const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
                console.log(`Total local migrations found: ${files.length}`);
                
                const appliedVersions = new Set((schemaMigrations as any[]).map((m: any) => m.version));
                const pending = files.filter(f => {
                    const versionMatch = f.match(/^\d+/);
                    if (!versionMatch) return false;
                    const version = versionMatch[0];
                    return !appliedVersions.has(version);
                });
                
                console.log(`Pending migrations (not in schema_migrations): ${pending.length}`);
                if (pending.length > 0) {
                    console.log('Pending files:', pending);
                }
            }
        } else {
            console.log('supabase_migrations.schema_migrations NOT found or inaccessible.');
            if (smError) console.log('Error:', smError.message);
        }
    } catch (e) {
        console.log('Error executing check:', e);
    }
}

checkMigrations();
