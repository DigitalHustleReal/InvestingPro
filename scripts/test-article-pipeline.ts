/**
 * Test Article Pipeline Script
 * 
 * Generates a complete article with:
 * 1. Article content (AI-generated)
 * 2. Social media repurposing
 * 3. Database storage
 * 
 * Run: npx tsx scripts/test-article-pipeline.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables. Please check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test article data
const testArticle = {
    title: "Unlock the World: Top Travel Credit Cards in India 2026",
    slug: "best-travel-credit-cards-india-2026",
    excerpt: "Explore the best travel credit cards in India for 2026, offering exclusive lounge access, miles, and more to enhance your travel experience.",
    body_markdown: `## Introduction

In the bustling world of 2026, travel has evolved into a lifestyle for many Indians. With increasing demand for travel, the quest for the best travel credit cards offering lucrative deals on lounge access, miles, airport benefits, and international travel perks has intensified.

## What Makes a Great Travel Credit Card?

- **Miles Accumulation**: Cards that offer generous miles for every ₹1 spent, especially on travel bookings.
- **Lounge Access**: Complimentary airport lounge access, both domestic and international.
- **Airport Benefits**: Priority check-in, extra baggage allowance, and other airport conveniences.
- **International Travel Perks**: Low foreign currency transaction fees, global acceptance, and travel insurance.

## Top Travel Credit Cards for 2026

### 1. HDFC Infinia Credit Card
- **Annual Fee**: ₹12,500 (waived on spending ₹10 lakh/year)
- **Reward Rate**: 5 points per ₹150 spent
- **Lounge Access**: Unlimited domestic and international
- **Best For**: Premium travelers

### 2. Axis Atlas Credit Card
- **Annual Fee**: ₹5,000
- **Reward Rate**: 5X Edge Miles on travel
- **Lounge Access**: 8 complimentary visits/year
- **Best For**: Frequent domestic travelers

### 3. SBI Elite Credit Card
- **Annual Fee**: ₹4,999
- **Reward Rate**: 2X points on travel
- **Lounge Access**: 6 complimentary visits/year
- **Best For**: Budget-conscious travelers

## Pros & Cons of Travel Credit Cards

**Pros:**
- Accumulate miles for flights and hotels
- Enjoy luxury travel experiences with lounge access
- Benefit from airport privileges and travel perks

**Cons:**
- Annual fees can be high
- Benefits often require significant spending

## Conclusion

Travel credit cards can significantly enhance your travel experience. Consider your travel frequency and spending patterns to choose the right card.

## FAQs

**1. What should I look for in a travel credit card?**
Look for cards offering high miles per ₹1 spent, extensive lounge access, and low foreign transaction fees.

**2. Are travel credit cards worth the annual fee?**
This depends on your travel frequency. If you travel often, the benefits can outweigh the fees.

**3. Can I use these cards for domestic travel?**
Yes, many travel credit cards offer benefits for both domestic and international travel.`,
    category: "credit-cards",
    meta_title: "Top Travel Credit Cards India 2026 | Complete Guide",
    meta_description: "Discover the best travel credit cards in India for 2026 with exclusive benefits like lounge access, miles, and airport perks.",
    status: "published",
    ai_generated: true,
    quality_score: 85,
    seo_score: 82,
    author_name: "Priya Menon",
    published_at: new Date().toISOString(),
};

// Social media content
const socialMediaContent = {
    twitter_thread: [
        "💳 Best Travel Credit Cards in India 2026\n\n🧵 Thread:",
        "1/ Looking for lounge access, miles & airport benefits? Here's your guide to the TOP travel credit cards in India for 2026.",
        "2/ HDFC Infinia: ₹12,500 annual fee (waived at ₹10L spend)\n✓ Unlimited lounge access\n✓ 5 points per ₹150\n✓ Best for premium travelers",
        "3/ Axis Atlas: ₹5,000 annual fee\n✓ 5X Edge Miles on travel\n✓ 8 lounge visits/year\n✓ Great for frequent domestic travelers",
        "4/ SBI Elite: ₹4,999 annual fee\n✓ 2X points on travel\n✓ 6 lounge visits/year\n✓ Budget-friendly option",
        "5/ What to look for:\n✓ Miles per ₹1 spent\n✓ Lounge access count\n✓ Foreign transaction fees\n✓ Travel insurance coverage",
        "6/ Read our full guide: https://investingpro.in/articles/best-travel-credit-cards-india-2026\n\n#CreditCards #TravelRewards #PersonalFinance #India"
    ],
    linkedin_post: `🌍 Elevate Your Travel Experience in 2026

Looking for the perfect travel credit card? Here's what to consider:

✈️ Miles Accumulation - Cards offering generous miles per ₹1 spent
🛋️ Lounge Access - Complimentary domestic & international access
🎯 Airport Benefits - Priority check-in, extra baggage
🌐 International Perks - Low forex fees, global acceptance

Top Picks:
1️⃣ HDFC Infinia - Premium choice with unlimited lounge access
2️⃣ Axis Atlas - 5X Miles on travel bookings
3️⃣ SBI Elite - Budget-friendly with solid benefits

Choose based on your travel frequency and spending patterns.

Full comparison guide: https://investingpro.in/articles/best-travel-credit-cards-india-2026

#TravelCreditCards #PersonalFinance #Investing #India #CreditCards`,
    instagram_caption: `✈️ Best Travel Credit Cards 2026

Looking for:
💳 Miles on every spend?
🛋️ Airport lounge access?
🌍 Low forex fees?

We've got you covered! Our latest guide covers:
→ HDFC Infinia (Premium)
→ Axis Atlas (Mid-range)
→ SBI Elite (Budget-friendly)

🔗 Link in bio for full comparison

#TravelCreditCards #Finance #PersonalFinance #India #CreditCards #Travel #AirportLounge #Miles`,
};

async function runPipeline() {
    console.log('\n🚀 ==================== TEST ARTICLE PIPELINE ====================\n');
    
    try {
        // Step 1: Save article to database
        console.log('📝 Step 1: Saving article to database...');
        
        const { data: article, error: articleError } = await supabase
            .from('articles')
            .insert({
                title: testArticle.title,
                slug: testArticle.slug,
                excerpt: testArticle.excerpt,
                body_markdown: testArticle.body_markdown,
                category: testArticle.category,
                meta_title: testArticle.meta_title,
                meta_description: testArticle.meta_description,
                status: testArticle.status,
                ai_generated: testArticle.ai_generated,
                quality_score: testArticle.quality_score,
                seo_score: testArticle.seo_score,
                author_name: testArticle.author_name,
                published_at: testArticle.published_at,
            })
            .select()
            .single();
        
        if (articleError) {
            console.error('❌ Article save failed:', articleError.message);
            // Try to check if it already exists
            const { data: existing } = await supabase
                .from('articles')
                .select('id, slug')
                .eq('slug', testArticle.slug)
                .single();
            
            if (existing) {
                console.log('ℹ️  Article already exists with ID:', existing.id);
                console.log('\n✅ Article URL: http://localhost:3000/articles/' + testArticle.slug);
            }
            return;
        }
        
        console.log('✅ Article saved! ID:', article.id);
        
        // Step 2: Generate social media content
        console.log('\n📱 Step 2: Social media content generated:');
        console.log('   - Twitter thread: ', socialMediaContent.twitter_thread.length, 'tweets');
        console.log('   - LinkedIn post: ', socialMediaContent.linkedin_post.length, 'chars');
        console.log('   - Instagram caption: ', socialMediaContent.instagram_caption.length, 'chars');
        
        // Step 3: Output results
        console.log('\n🎉 ==================== PIPELINE COMPLETE ====================');
        console.log('\n📊 Article Details:');
        console.log('   - Title:', testArticle.title);
        console.log('   - Slug:', testArticle.slug);
        console.log('   - Author:', testArticle.author_name);
        console.log('   - Category:', testArticle.category);
        console.log('   - Quality Score:', testArticle.quality_score);
        console.log('   - SEO Score:', testArticle.seo_score);
        
        console.log('\n🔗 Access URLs:');
        console.log('   - Local: http://localhost:3000/articles/' + testArticle.slug);
        console.log('   - Admin: http://localhost:3000/admin/articles/' + article.id);
        
        console.log('\n📱 Social Media Preview (Twitter Thread):');
        socialMediaContent.twitter_thread.forEach((tweet, i) => {
            console.log(`   Tweet ${i + 1}: ${tweet.substring(0, 60)}...`);
        });
        
        console.log('\n=================================================================\n');
        
    } catch (error) {
        console.error('❌ Pipeline error:', error);
    }
}

// Run the pipeline
runPipeline();
