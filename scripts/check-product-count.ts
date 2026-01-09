import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';

async function countProducts() {
    const supabase = createServiceClient();
    
    // Count total products
    const { count: total, error: totalError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    if (totalError) {
        console.error('Error counting products:', totalError);
        return;
    }

    console.log(`\n📊 Total Products Seeded: ${total}`);

    // Count by category
    const { data: products, error: dataError } = await supabase
        .from('products')
        .select('category');

    if (dataError) {
         console.error('Error getting product details:', dataError);
         return;
    }

    const byCategory = products.reduce((acc: any, curr: any) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
    }, {});

    console.log('📈 Breakdown by Category:');
    console.table(byCategory);
}

countProducts().catch(console.error);
