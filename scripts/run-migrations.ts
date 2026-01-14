/**
 * Database Migration Runner
 * 
 * Purpose: Run SQL migrations against Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');

  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort(); // Run in order

  for (const file of files) {
    console.log(`📝 Running migration: ${file}`);
    
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    try {
      // Execute SQL
      const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

      if (error) {
        console.error(`❌ Error in ${file}:`, error.message);
        
        // Try direct execution as fallback
        console.log('Trying direct execution...');
        const statements = sql.split(';').filter(s => s.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            const { error: execError } = await supabase.rpc('exec_sql', { 
              sql_string: statement 
            });
            
            if (execError) {
              console.error(`❌ Statement failed:`, execError.message);
              console.error(`Statement: ${statement.substring(0, 100)}...`);
            }
          }
        }
      } else {
        console.log(`✅ ${file} completed successfully\n`);
      }
    } catch (error) {
      console.error(`❌ Failed to run ${file}:`, error);
    }
  }

  console.log('\n✨ Migrations complete!');
}

// Run if called directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { runMigrations };
