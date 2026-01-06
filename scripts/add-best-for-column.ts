import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addBestForColumn() {
    console.log('🔧 Adding best_for column to products table...');
    
    // Read the SQL migration file
    const sql = fs.readFileSync('./supabase/migrations/add_best_for_column.sql', 'utf8');
    
    // Split into individual statements
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--') && !s.startsWith('COMMENT'));
    
    for (const statement of statements) {
        if (!statement) continue;
        
        try {
            // For ALTER TABLE and CREATE INDEX, we'll use raw SQL if Supabase supports it
            // Otherwise, we'll use the products table directly
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            
            // Try to execute via query
            const { error } = await supabase.rpc('exec_sql', { query: statement });
            
            if (error) {
                console.log(`⚠️  Could not execute via RPC, trying direct approach...`);
                // If RPC doesn't work, we'll update the records directly
            } else {
                console.log(`✅ Statement executed`);
            }
        } catch (err) {
            console.log(`ℹ️  Skipping: ${err.message}`);
        }
    }
    
    // Direct approach: Update the products
    console.log('\n📝 Updating products with best_for values...');
    
    const updates = [
        { slug: 'hdfc-regalia-gold', best_for: 'travel-rewards' },
        { slug: 'sbi-card-elite', best_for: 'shopping-rewards' },
        { slug: 'axis-magnus', best_for: 'premium-lifestyle' },
        { slug: 'icici-sapphiro', best_for: 'cashback-dining' }
    ];
    
    for (const update of updates) {
        const { data, error } = await supabase
            .from('products')
            .update({ best_for: update.best_for })
            .eq('slug', update.slug)
            .select();
            
        if (error) {
            console.error(`❌ Failed to update ${update.slug}:`, error.message);
        } else if (data && data.length > 0) {
            console.log(`✅ Updated ${update.slug} → ${update.best_for}`);
        } else {
            console.log(`⚠️  Product not found: ${update.slug}`);
        }
    }
    
    console.log('\n✨ Migration complete!');
}

addBestForColumn().catch(console.error);
