import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function auditProducts() {
    console.log('🔍 Auditing Products Table for Category Contamination...\n');

    // Get all products
    const { data: allProducts, error } = await supabase
        .from('products')
        .select('id, name, slug, category, provider_name');

    if (error) {
        console.error('❌ Error:', error.message);
        return;
    }

    // Group by category
    const byCategory: Record<string, any[]> = {};
    allProducts?.forEach(p => {
        const cat = p.category || 'uncategorized';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(p);
    });

    console.log('📊 Products by Category:\n');
    Object.entries(byCategory).forEach(([cat, products]) => {
        console.log(`  ${cat}: ${products.length} products`);
        products.slice(0, 3).forEach(p => {
            console.log(`    - ${p.name} (slug: ${p.slug})`);
        });
        if (products.length > 3) {
            console.log(`    ... and ${products.length - 3} more`);
        }
        console.log('');
    });

    // Check for potential contamination
    console.log('\n🔍 Checking for Contamination Issues:\n');
    
    // Check if credit_card category contains non-credit-card products
    const creditCards = byCategory['credit_card'] || [];
    const suspiciousCards = creditCards.filter(p => {
        const name = (p.name || '').toLowerCase();
        return name.includes('loan') || 
               name.includes('insurance') || 
               name.includes('mutual fund') ||
               name.includes('stock');
    });

    if (suspiciousCards.length > 0) {
        console.log(`❌ CONTAMINATION FOUND in credit_card category:`);
        suspiciousCards.forEach(p => {
            console.log(`   - "${p.name}" (ID: ${p.id})`);
        });
    } else {
        console.log(`✅ No contamination in credit_card category`);
    }

    console.log(`\n📋 Summary:`);
    console.log(`   Total Products: ${allProducts?.length || 0}`);
    console.log(`   Categories: ${Object.keys(byCategory).length}`);
    console.log(`   Credit Cards: ${creditCards.length}`);
}

auditProducts().catch(console.error);
