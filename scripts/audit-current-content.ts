import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';

async function auditCurrentContent() {
    console.log('📊 CURRENT CONTENT AUDIT\n');
    console.log('='.repeat(60));

    const supabase = createServiceClient();

    // Check articles
    const { count: articlesCount, error: articlesError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

    // Check glossary
    const { count: glossaryCount } = await supabase
        .from('glossary_terms')
        .select('*', { count: 'exact', head: true });

    // Check credit cards
    const { count: creditCardsCount } = await supabase
        .from('credit_cards')
        .select('*', { count: 'exact', head: true });

    // Check credit cards with descriptions
    const { count: cardsWithDesc } = await supabase
        .from('credit_cards')
        .select('*', { count: 'exact', head: true })
        .not('description', 'is', null);

    console.log('\n📝 CONTENT COUNTS:');
    console.log('─'.repeat(60));
    console.log(`Articles Published:        ${articlesCount || 0}`);
    console.log(`Glossary Terms:            ${glossaryCount || 0}`);
    console.log(`Credit Cards (Total):      ${creditCardsCount || 0}`);
    console.log(`  - With Descriptions:     ${cardsWithDesc || 0}`);
    console.log(`  - Missing Descriptions:  ${(creditCardsCount || 0) - (cardsWithDesc || 0)}`);

    // Get sample articles for quality check
    const { data: sampleArticles } = await supabase
        .from('articles')
        .select('id, title, content, meta_description, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

    if (sampleArticles && sampleArticles.length > 0) {
        console.log('\n📋 RECENT ARTICLES (Last 5):');
        console.log('─'.repeat(60));
        sampleArticles.forEach((article, idx) => {
            console.log(`\n${idx + 1}. ${article.title}`);
            console.log(`   Status: ${article.status || 'unknown'}`);
            console.log(`   Meta Description: ${article.meta_description ? 'Yes ✓' : 'Missing ✗'}`);
            console.log(`   Content Length: ${article.content?.length || 0} chars`);
            console.log(`   Created: ${new Date(article.created_at).toLocaleDateString()}`);
        });
    }

    // Get sample products
    const { data: sampleProducts } = await supabase
        .from('credit_cards')
        .select('id, name, description, image_url')
        .limit(5);

    if (sampleProducts && sampleProducts.length > 0) {
        console.log('\n💳 SAMPLE PRODUCTS (First 5 Credit Cards):');
        console.log('─'.repeat(60));
        sampleProducts.forEach((product, idx) => {
            console.log(`\n${idx + 1}. ${product.name}`);
            console.log(`   Description: ${product.description ? `${product.description.substring(0, 100)}...` : 'Missing ✗'}`);
            console.log(`   Image: ${product.image_url ? 'Yes ✓' : 'Missing ✗'}`);
        });
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ AUDIT COMPLETE!\n');
    console.log('📌 NEXT STEPS:');
    console.log('  1. Review sample content quality manually');
    console.log('  2. Identify common quality issues');
    console.log('  3. Build quality gates based on findings\n');
}

auditCurrentContent().catch(console.error);
