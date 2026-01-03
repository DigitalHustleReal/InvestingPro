
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const POSTS = [
    {
        title: "Best Credit Cards in India 2026",
        slug: "best-credit-cards-india-2026",
        content: `
            <h2>The Ultimate Guide to Credit Cards in 2026</h2>
            <p>Choosing the right credit card can save you lakhs in travel and shopping. Here are our top picks.</p>
        `,
        excerpt: "Comprehensive guide to the highest rewarding credit cards available in India for 2026.",
        published_at: new Date().toISOString(),
        published_date: new Date().toISOString(),
        status: 'published',
        feature_image: "https://placehold.co/800x400/indigo/white?text=Best+Cards+2026",
        category: 'credit-cards'
    },
    {
        title: "Mutual Funds vs Fixed Deposits: Where to Invest?",
        slug: "mutual-funds-vs-fd-comparison",
        content: `
            <h2>High Returns vs Safety</h2>
            <p>The eternal debate: ensure your capital with FDs or aim for inflation-beating returns with Mutual Funds.</p>
        `,
        excerpt: "A data-driven comparison of risk, returns, and liquidity between MFs and FDs.",
        published_at: new Date().toISOString(),
        published_date: new Date().toISOString(),
        status: 'published',
        feature_image: "https://placehold.co/800x400/emerald/white?text=MF+vs+FD",
        category: 'mutual-funds'
    },
    {
        title: "Understanding Personal Loan Interest Rates",
        slug: "personal-loan-interest-rates-guide",
        content: `
            <h2>How Banks Decide Your Rate</h2>
            <p>The eternal debate: ensure your capital with FDs or aim for inflation-beating returns with Mutual Funds.</p>
        `,
        excerpt: "Don't overpay for your loan. Learn how to negotiate the best interest rate.",
        published_at: new Date().toISOString(),
        published_date: new Date().toISOString(),
        status: 'published',
        feature_image: "https://placehold.co/800x400/amber/white?text=Loan+Rates",
        category: 'investing-basics'
    }
];

async function seedPosts() {
    console.log('🚀 Seeding ARTICLES with published_date...');
    const table = 'articles';

    for (const post of POSTS) {
        const postData = { ...post, featured_image: post.feature_image };
        delete (postData as any).feature_image;

        const { error: insertError } = await supabase.from(table).upsert(postData, { onConflict: 'slug' });
        
        if (insertError) {
             console.error(`❌ Failed to insert ${post.title}:`, insertError.message);
        } else {
            console.log(`✅ Seeded Article: ${post.title}`);
        }
    }
    console.log('✨ Article Seeding Complete!');
}

seedPosts();
