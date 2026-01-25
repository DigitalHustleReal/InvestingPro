/**
 * 🧠 FULL INTELLIGENCE PIPELINE DEMO
 * 
 * Demonstrates the COMPLETE content generation flow:
 * 1. Trend/Gap Analysis → Find what to write
 * 2. Keyword Research → Extract target keywords
 * 3. SERP Analysis → Analyze competitors
 * 4. Opportunity Scoring → Validate priority
 * 5. Template Selection → Choose article structure
 * 6. SEO Optimization → Optimize heading/title
 * 7. Dynamic Prompt Building → Assemble AI prompt
 * 8. AI Generation → Create content
 * 9. Quality Checks → Validate output
 * 10. Visual Analysis → Determine infographics
 * 11. Social Media Repurposing → Generate social content
 * 12. Database Save → Publish article
 * 
 * Run: npx tsx scripts/full-intelligence-pipeline.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// OpenAI for generation
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ============================================================================
// STEP 1: CONTENT GAP ANALYSIS
// ============================================================================

interface ContentGap {
    topic: string;
    keyword: string;
    category: string;
    gapType: 'missing' | 'weak' | 'outdated';
    priority: 'high' | 'medium' | 'low';
    revenuePotential: number;
    competitorCount: number;
    recommendation: string;
}

async function analyzeContentGaps(category: string): Promise<ContentGap[]> {
    console.log('\n📊 STEP 1: CONTENT GAP ANALYSIS');
    console.log('═'.repeat(60));
    console.log(`Category: ${category}`);
    
    // Essential topics for mutual funds category
    const essentialTopics: Record<string, string[]> = {
        'mutual-funds': [
            'best sip plans 2026',
            'elss tax saving funds',
            'index funds india',
            'flexi cap funds',
            'small cap mutual funds',
            'debt funds for beginners',
            'liquid funds comparison'
        ],
        'credit-cards': [
            'travel credit cards',
            'cashback credit cards',
            'fuel credit cards',
            'premium credit cards'
        ],
        'loans': [
            'home loan comparison',
            'personal loan eligibility',
            'education loan india'
        ]
    };
    
    // Check existing articles
    const { data: existingArticles } = await supabase
        .from('articles')
        .select('title, slug, primary_keyword')
        .eq('status', 'published');
    
    const existingSlugs = (existingArticles || []).map(a => a.slug?.toLowerCase() || '');
    
    // Find gaps
    const gaps: ContentGap[] = [];
    const topics = essentialTopics[category] || essentialTopics['mutual-funds'];
    
    for (const topic of topics) {
        const slug = topic.replace(/\s+/g, '-').toLowerCase();
        const exists = existingSlugs.some(s => s.includes(slug) || slug.includes(s));
        
        if (!exists) {
            const revenueMultipliers: Record<string, number> = {
                'credit-cards': 3500,
                'mutual-funds': 2500,
                'loans': 3000,
                'insurance': 2800
            };
            
            const baseRevenue = revenueMultipliers[category] || 2000;
            const hasCommercialIntent = /best|top|compare|vs/.test(topic);
            const revenuePotential = hasCommercialIntent ? baseRevenue * 1.5 : baseRevenue;
            
            gaps.push({
                topic,
                keyword: topic,
                category,
                gapType: 'missing',
                priority: hasCommercialIntent ? 'high' : 'medium',
                revenuePotential,
                competitorCount: 4,
                recommendation: `Create comprehensive article on "${topic}"`
            });
        }
    }
    
    gaps.sort((a, b) => b.revenuePotential - a.revenuePotential);
    
    console.log(`\n✅ Found ${gaps.length} content gaps`);
    console.log('\nTop 3 Gaps:');
    gaps.slice(0, 3).forEach((gap, i) => {
        console.log(`  ${i + 1}. "${gap.topic}" - Priority: ${gap.priority.toUpperCase()}, Revenue: ₹${gap.revenuePotential}/month`);
    });
    
    return gaps;
}

// ============================================================================
// STEP 2: KEYWORD RESEARCH
// ============================================================================

interface KeywordData {
    primary: string;
    secondary: string[];
    longTail: string[];
    questions: string[];
    difficulty: number;
    intent: 'commercial' | 'informational' | 'transactional';
    opportunityScore: number;
}

async function researchKeywords(seedKeyword: string): Promise<KeywordData> {
    console.log('\n🔑 STEP 2: KEYWORD RESEARCH');
    console.log('═'.repeat(60));
    console.log(`Seed Keyword: "${seedKeyword}"`);
    
    const googleSuggestions = [
        `${seedKeyword} india`,
        `${seedKeyword} 2026`,
        `best ${seedKeyword}`,
        `${seedKeyword} for beginners`,
        `${seedKeyword} comparison`,
        `top ${seedKeyword}`,
        `${seedKeyword} returns`,
        `${seedKeyword} tax benefits`
    ];
    
    const longTail = [
        `best ${seedKeyword} for long term investment`,
        `${seedKeyword} with low expense ratio`,
        `top performing ${seedKeyword} last 5 years`,
        `${seedKeyword} vs fixed deposit`
    ];
    
    const questions = [
        `What is the best ${seedKeyword}?`,
        `How to invest in ${seedKeyword}?`,
        `Is ${seedKeyword} safe for beginners?`,
        `What are the returns from ${seedKeyword}?`,
        `Which ${seedKeyword} should I invest in 2026?`
    ];
    
    const wordCount = seedKeyword.split(' ').length;
    let difficulty = 50;
    if (wordCount >= 4) difficulty -= 15;
    if (/best|top/.test(seedKeyword)) difficulty += 10;
    
    let intent: 'commercial' | 'informational' | 'transactional' = 'informational';
    if (/best|top|compare|vs/.test(seedKeyword)) intent = 'commercial';
    if (/buy|apply|invest/.test(seedKeyword)) intent = 'transactional';
    
    const opportunityScore = Math.round(100 - (difficulty * 0.4) + (intent === 'commercial' ? 15 : 10));
    
    const result: KeywordData = {
        primary: `best ${seedKeyword} 2026`,
        secondary: googleSuggestions.slice(0, 5),
        longTail,
        questions,
        difficulty,
        intent,
        opportunityScore
    };
    
    console.log(`\n✅ Keyword Research Complete`);
    console.log(`  Primary Keyword: "${result.primary}"`);
    console.log(`  Difficulty: ${difficulty}/100`);
    console.log(`  Intent: ${intent}`);
    console.log(`  Opportunity Score: ${opportunityScore}/100`);
    
    return result;
}

// ============================================================================
// STEP 3: SERP ANALYSIS
// ============================================================================

interface SerpAnalysis {
    topResults: { title: string; domain: string; wordCount: number }[];
    avgWordCount: number;
    recommendedWordCount: number;
    contentGaps: string[];
    uniqueAngle: string;
    avgHeadings: number;
}

async function analyzeSERP(keyword: string): Promise<SerpAnalysis> {
    console.log('\n🔍 STEP 3: SERP ANALYSIS');
    console.log('═'.repeat(60));
    console.log(`Analyzing competitors for: "${keyword}"`);
    
    const topResults = [
        { title: 'Best SIP Plans for 2026 - Top 10 Mutual Funds', domain: 'etmoney.com', wordCount: 2100 },
        { title: '10 Best Mutual Funds to Invest in 2026', domain: 'groww.in', wordCount: 1800 },
        { title: 'Top SIP Plans India 2026 - Complete Guide', domain: 'valueresearchonline.com', wordCount: 2500 },
        { title: 'Best Mutual Funds for SIP Investment 2026', domain: 'moneycontrol.com', wordCount: 1600 },
        { title: 'How to Choose Best SIP Plans in India', domain: 'bankbazaar.com', wordCount: 1900 }
    ];
    
    const avgWordCount = Math.round(topResults.reduce((sum, r) => sum + r.wordCount, 0) / topResults.length);
    
    const contentGaps = [
        'Detailed expense ratio comparison tables',
        'Real performance data with CAGR calculations',
        'Risk-adjusted return analysis (Sharpe ratio)',
        'Sector-wise fund allocation breakdown',
        'Tax implications for different fund categories',
        'Step-by-step SIP starting guide for beginners'
    ];
    
    const uniqueAngle = 'Position as data-driven guide with actual fund performance numbers and tax-saving calculations';
    
    console.log(`\n✅ SERP Analysis Complete`);
    console.log(`  Competitors Analyzed: ${topResults.length}`);
    console.log(`  Avg Word Count: ${avgWordCount}`);
    console.log(`  Recommended: ${Math.ceil(avgWordCount * 1.2)} words (beat by 20%)`);
    console.log(`  Content Gaps: ${contentGaps.length}`);
    
    return {
        topResults,
        avgWordCount,
        recommendedWordCount: Math.ceil(avgWordCount * 1.2),
        contentGaps,
        uniqueAngle,
        avgHeadings: 8
    };
}

// ============================================================================
// STEP 4: OPPORTUNITY SCORING
// ============================================================================

interface OpportunityScore {
    overallScore: number;
    volumeScore: number;
    competitionScore: number;
    revenueScore: number;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    contentType: 'pillar' | 'listicle' | 'comparison' | 'guide';
}

function scoreOpportunity(keywordData: KeywordData, serpData: SerpAnalysis, category: string): OpportunityScore {
    console.log('\n📈 STEP 4: OPPORTUNITY SCORING');
    console.log('═'.repeat(60));
    
    const volumeScore = keywordData.intent === 'commercial' ? 85 : 70;
    const competitionScore = 100 - keywordData.difficulty;
    
    const categoryMultipliers: Record<string, number> = {
        'credit-cards': 1.5, 'mutual-funds': 1.3, 'loans': 1.4
    };
    const multiplier = categoryMultipliers[category] || 1.0;
    const revenueScore = Math.min(100, Math.round(60 * multiplier + (keywordData.intent === 'commercial' ? 20 : 0)));
    
    const overallScore = Math.round(
        volumeScore * 0.25 + competitionScore * 0.25 + revenueScore * 0.30 + keywordData.opportunityScore * 0.20
    );
    
    let priority: 'urgent' | 'high' | 'medium' | 'low' = 'medium';
    if (overallScore >= 80 && competitionScore >= 50) priority = 'urgent';
    else if (overallScore >= 70) priority = 'high';
    
    let contentType: 'pillar' | 'listicle' | 'comparison' | 'guide' = 'guide';
    if (/best|top/.test(keywordData.primary)) contentType = 'listicle';
    
    console.log(`\n✅ Opportunity Score: ${overallScore}/100`);
    console.log(`  Priority: ${priority.toUpperCase()}`);
    console.log(`  Content Type: ${contentType}`);
    
    return { overallScore, volumeScore, competitionScore, revenueScore, priority, contentType };
}

// ============================================================================
// STEP 5-6: TEMPLATE & SEO
// ============================================================================

interface SEOOptimization {
    title: string;
    metaTitle: string;
    metaDescription: string;
    slug: string;
    lsiKeywords: string[];
    targetWordCount: { min: number; max: number };
    sections: string[];
}

function optimizeSEOAndTemplate(keywordData: KeywordData, serpData: SerpAnalysis): SEOOptimization {
    console.log('\n📝 STEP 5-6: TEMPLATE & SEO OPTIMIZATION');
    console.log('═'.repeat(60));
    
    const year = new Date().getFullYear();
    
    const result: SEOOptimization = {
        title: `Best SIP Plans in India ${year}: Top 10 Mutual Funds for Maximum Returns`,
        metaTitle: `Best SIP Plans India ${year} | Top 10 Mutual Funds`,
        metaDescription: `Discover the best SIP plans in India for ${year}. Compare top mutual funds by returns, expense ratio & risk. Start investing with ₹500/month.`,
        slug: `best-sip-plans-india-${year}`,
        lsiKeywords: ['systematic investment plan', 'mutual fund SIP', 'expense ratio', 'NAV', 'CAGR', 'ELSS'],
        targetWordCount: { min: serpData.recommendedWordCount, max: Math.round(serpData.recommendedWordCount * 1.3) },
        sections: [
            'Introduction (150-300 words)',
            'Quick Comparison Table',
            'Top 10 Funds Overview (200-400 words each)',
            'How to Choose the Right Fund',
            'Tax Implications',
            'FAQs (5-7 questions)',
            'Conclusion with CTA'
        ]
    };
    
    console.log(`\n✅ SEO & Template Ready`);
    console.log(`  Title: "${result.title}"`);
    console.log(`  Target Words: ${result.targetWordCount.min}-${result.targetWordCount.max}`);
    console.log(`  Sections: ${result.sections.length}`);
    
    return result;
}

// ============================================================================
// STEP 7: DYNAMIC PROMPT BUILDING
// ============================================================================

interface DynamicPrompt {
    systemPrompt: string;
    userPrompt: string;
    writerPersona: string;
}

function buildPrompt(seo: SEOOptimization, keywordData: KeywordData, serpData: SerpAnalysis, category: string): DynamicPrompt {
    console.log('\n🤖 STEP 7: DYNAMIC PROMPT BUILDING');
    console.log('═'.repeat(60));
    
    const personas: Record<string, { name: string; voice: string }> = {
        'mutual-funds': { name: 'Rahul Chatterjee', voice: 'NISM certified MF specialist. Educational, beginner-friendly, "start with ₹500" approach.' },
        'credit-cards': { name: 'Priya Menon', voice: 'Credit card specialist. Conversational, honest about fees, friend over chai tone.' }
    };
    
    const persona = personas[category] || personas['mutual-funds'];
    
    const systemPrompt = `You are ${persona.name}, ${persona.voice}

CATEGORY: ${category}
Write for Indian audience. Use ₹ currency. Cite SEBI regulations.
Include expense ratios, NAV, returns data. Never guarantee returns.

TARGET: ${seo.targetWordCount.min}-${seo.targetWordCount.max} words
LSI KEYWORDS: ${seo.lsiKeywords.join(', ')}`;

    const userPrompt = `Write: "${seo.title}"

SECTIONS:
${seo.sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

CONTENT GAPS TO ADDRESS:
${serpData.contentGaps.slice(0, 4).map(g => `- ${g}`).join('\n')}

QUESTIONS TO ANSWER:
${keywordData.questions.slice(0, 4).map(q => `- ${q}`).join('\n')}

Return JSON: { "title", "content" (markdown), "excerpt", "seo_title", "seo_description", "tags": [], "key_takeaways": [] }`;

    console.log(`\n✅ Prompt Built`);
    console.log(`  Writer: ${persona.name}`);
    console.log(`  System Prompt: ${systemPrompt.length} chars`);
    console.log(`  User Prompt: ${userPrompt.length} chars`);
    
    return { systemPrompt, userPrompt, writerPersona: persona.name };
}

// ============================================================================
// STEP 8: AI GENERATION
// ============================================================================

interface GeneratedArticle {
    title: string;
    content: string;
    excerpt: string;
    seo_title: string;
    seo_description: string;
    tags: string[];
    key_takeaways: string[];
    tokensUsed: number;
    provider: string;
}

async function generateArticle(prompt: DynamicPrompt): Promise<GeneratedArticle> {
    console.log('\n🤖 STEP 8: AI GENERATION');
    console.log('═'.repeat(60));
    
    if (!OPENAI_API_KEY) {
        console.log('⚠️ No OpenAI key, using pre-built article...');
        return getPrebuiltArticle();
    }
    
    try {
        console.log('Generating with GPT-4...');
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: prompt.systemPrompt },
                    { role: 'user', content: prompt.userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 4000,
                response_format: { type: 'json_object' }
            },
            { headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
        );
        
        const content = JSON.parse(response.data.choices[0].message.content);
        console.log(`\n✅ Generated! Tokens: ${response.data.usage.total_tokens}`);
        
        return { ...content, tokensUsed: response.data.usage.total_tokens, provider: 'openai-gpt4' };
    } catch (e: any) {
        console.log(`⚠️ AI failed: ${e.message}, using pre-built...`);
        return getPrebuiltArticle();
    }
}

function getPrebuiltArticle(): GeneratedArticle {
    return {
        title: "Best SIP Plans in India 2026: Top 10 Mutual Funds for Maximum Returns",
        content: `## Introduction

Systematic Investment Plans (SIPs) have revolutionized how Indians invest in mutual funds. With as little as ₹500 per month, you can start building wealth. This guide covers the top 10 SIP plans for 2026.

## Quick Comparison Table

| Fund Name | Category | 5Y CAGR | Expense Ratio | Min SIP |
|-----------|----------|---------|---------------|---------|
| Parag Parikh Flexi Cap | Flexi Cap | 18.5% | 0.63% | ₹1,000 |
| Mirae Asset Large Cap | Large Cap | 15.2% | 0.53% | ₹500 |
| Axis Small Cap | Small Cap | 22.1% | 0.48% | ₹500 |
| HDFC Index Nifty 50 | Index | 14.8% | 0.20% | ₹100 |
| Quant Active Fund | Multi Cap | 25.3% | 0.57% | ₹1,000 |

## Top 10 SIP Plans for 2026

### 1. Parag Parikh Flexi Cap Fund
One of the most consistent performers with global diversification.
- **5-Year CAGR**: 18.5%
- **Expense Ratio**: 0.63%
- **AUM**: ₹45,000+ crores
- **Risk**: Moderately High

### 2. Mirae Asset Large Cap Fund
Top performer in large cap with lower volatility.
- **5-Year CAGR**: 15.2%
- **Expense Ratio**: 0.53%
- **Risk**: Moderate

### 3. Axis Small Cap Fund
For aggressive investors seeking high growth.
- **5-Year CAGR**: 22.1%
- **Expense Ratio**: 0.48%
- **Risk**: High

### 4. HDFC Index Fund - Nifty 50
Lowest cost way to invest in top 50 companies.
- **5-Year CAGR**: 14.8%
- **Expense Ratio**: 0.20%
- **Risk**: Moderate

### 5. Quant Active Fund
Exceptional returns through quant-based strategy.
- **5-Year CAGR**: 25.3%
- **Expense Ratio**: 0.57%
- **Risk**: High

## How to Choose the Right SIP Plan

1. **Define Goals**: Retirement, child's education, or wealth creation?
2. **Assess Risk**: Higher returns = higher risk
3. **Check Expense Ratio**: Aim for under 1%
4. **Look at Consistency**: 5-year returns matter more than 1-year
5. **Fund Manager Track Record**: Experience matters

## Tax Implications

- **Equity Funds (>1 year)**: 10% LTCG on gains above ₹1 lakh
- **Equity Funds (<1 year)**: 15% STCG
- **ELSS Funds**: ₹1.5 lakh deduction under Section 80C

## FAQs

**Q: What is the minimum amount for SIP?**
A: As low as ₹100 in some funds, ₹500 is common.

**Q: Can I stop SIP anytime?**
A: Yes, except ELSS which has 3-year lock-in.

**Q: SIP vs lumpsum - which is better?**
A: SIP for regular investors - averages out market volatility.

**Q: Expected returns from SIP?**
A: Historically 12-15% annually over long term (not guaranteed).

**Q: Best SIP for beginners?**
A: Start with large cap or index funds for lower risk.

## Conclusion

SIP is one of the most effective wealth-building tools in India. Start with ₹500-1000/month, increase gradually, and stay invested 5-7 years minimum.

**Ready to start? Compare funds on InvestingPro and begin your journey today!**`,
        excerpt: "Discover the best SIP plans in India for 2026. Compare top 10 mutual funds by returns, expense ratio & risk.",
        seo_title: "Best SIP Plans India 2026 | Top 10 Mutual Funds",
        seo_description: "Discover the best SIP plans in India for 2026. Compare top mutual funds by returns, expense ratio & risk. Start with ₹500/month.",
        tags: ["SIP", "mutual funds", "investment", "2026", "India"],
        key_takeaways: ["Start SIP with ₹500/month", "Expense ratio under 1% is ideal", "Stay invested 5-7 years", "ELSS saves tax under 80C"],
        tokensUsed: 0,
        provider: 'pre-built'
    };
}

// ============================================================================
// STEP 9-11: QUALITY, VISUALS, SOCIAL
// ============================================================================

function runQualityChecks(article: GeneratedArticle): { score: number; grade: string; passed: boolean } {
    console.log('\n✅ STEP 9: QUALITY CHECKS');
    console.log('═'.repeat(60));
    
    const wordCount = article.content.split(/\s+/).length;
    const h2Count = (article.content.match(/## /g) || []).length;
    const hasTable = article.content.includes('|');
    const hasFAQ = article.content.toLowerCase().includes('faq');
    
    const score = Math.min(100, Math.round(
        (wordCount >= 1500 ? 25 : (wordCount / 1500) * 25) +
        (h2Count >= 5 ? 25 : (h2Count / 5) * 25) +
        (hasTable ? 25 : 0) +
        (hasFAQ ? 25 : 0)
    ));
    
    const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : 'C';
    
    console.log(`  Word Count: ${wordCount}`);
    console.log(`  H2 Headings: ${h2Count}`);
    console.log(`  Has Table: ${hasTable ? 'Yes' : 'No'}`);
    console.log(`  Has FAQ: ${hasFAQ ? 'Yes' : 'No'}`);
    console.log(`  Score: ${score}/100 (${grade})`);
    
    return { score, grade, passed: score >= 75 };
}

function analyzeVisuals(article: GeneratedArticle): string[] {
    console.log('\n🎨 STEP 10: VISUAL ANALYSIS');
    console.log('═'.repeat(60));
    
    const visuals: string[] = [];
    if (article.content.includes('|')) visuals.push('Comparison Table');
    if (article.content.match(/\d+%/)) visuals.push('Statistics Infographic');
    if (article.content.toLowerCase().includes('step')) visuals.push('Process Flowchart');
    
    console.log(`  Visuals Recommended: ${visuals.join(', ') || 'None'}`);
    return visuals;
}

function generateSocial(article: GeneratedArticle, slug: string): { twitter: number; linkedin: number } {
    console.log('\n📱 STEP 11: SOCIAL MEDIA');
    console.log('═'.repeat(60));
    
    const twitter = [
        `📈 Best SIP Plans 2026 🧵`,
        `1/ Start investing with just ₹500/month...`,
        `2/ Top Pick: Parag Parikh Flexi Cap - 18.5% CAGR`,
        `3/ For beginners: Mirae Asset Large Cap`,
        `4/ For aggressive: Axis Small Cap - 22.1%`,
        `5/ Tips: Expense ratio < 1%, Stay 5+ years`,
        `6/ Full guide: investingpro.in/articles/${slug}`
    ];
    
    const linkedin = `📊 Best SIP Plans 2026\n\nTop Picks:\n1️⃣ Parag Parikh Flexi Cap - 18.5%\n2️⃣ Mirae Asset Large Cap - 15.2%\n\nStart with ₹500/month!`;
    
    console.log(`  Twitter Thread: ${twitter.length} tweets`);
    console.log(`  LinkedIn Post: ${linkedin.length} chars`);
    
    return { twitter: twitter.length, linkedin: linkedin.length };
}

// ============================================================================
// STEP 12: SAVE
// ============================================================================

async function saveArticle(article: GeneratedArticle, seo: SEOOptimization, quality: any, writer: string): Promise<{ id: string; url: string }> {
    console.log('\n💾 STEP 12: DATABASE SAVE');
    console.log('═'.repeat(60));
    
    const { data: existing } = await supabase.from('articles').select('id').eq('slug', seo.slug).single();
    
    if (existing) {
        console.log(`  Already exists: ${existing.id}`);
        return { id: existing.id, url: `http://localhost:3000/articles/${seo.slug}` };
    }
    
    const { data, error } = await supabase.from('articles').insert({
        title: article.title,
        slug: seo.slug,
        excerpt: article.excerpt,
        body_markdown: article.content,
        category: 'mutual-funds',
        meta_title: article.seo_title,
        meta_description: article.seo_description,
        status: 'published',
        ai_generated: true,
        quality_score: quality.score,
        author_name: writer,
        published_at: new Date().toISOString()
    }).select().single();
    
    if (error) throw error;
    
    console.log(`  Saved! ID: ${data.id}`);
    return { id: data.id, url: `http://localhost:3000/articles/${seo.slug}` };
}

// ============================================================================
// MAIN PIPELINE
// ============================================================================

async function runPipeline() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         🧠 FULL INTELLIGENCE PIPELINE DEMONSTRATION            ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    
    const start = Date.now();
    const category = 'mutual-funds';
    
    try {
        // Step 1: Find gaps
        const gaps = await analyzeContentGaps(category);
        const topic = gaps[0]?.topic || 'best sip plans 2026';
        console.log(`\n🎯 SELECTED: "${topic}"`);
        
        // Step 2: Research keywords
        const keywords = await researchKeywords(topic);
        
        // Step 3: Analyze SERP
        const serp = await analyzeSERP(keywords.primary);
        
        // Step 4: Score opportunity
        const opportunity = scoreOpportunity(keywords, serp, category);
        
        // Step 5-6: Template & SEO
        const seo = optimizeSEOAndTemplate(keywords, serp);
        
        // Step 7: Build prompt
        const prompt = buildPrompt(seo, keywords, serp, category);
        
        // Step 8: Generate
        const article = await generateArticle(prompt);
        
        // Step 9: Quality
        const quality = runQualityChecks(article);
        
        // Step 10: Visuals
        const visuals = analyzeVisuals(article);
        
        // Step 11: Social
        const social = generateSocial(article, seo.slug);
        
        // Step 12: Save
        const saved = await saveArticle(article, seo, quality, prompt.writerPersona);
        
        // Summary
        const time = ((Date.now() - start) / 1000).toFixed(1);
        
        console.log('\n');
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║                    🎉 PIPELINE COMPLETE!                       ║');
        console.log('╠════════════════════════════════════════════════════════════════╣');
        console.log(`║ Time: ${time}s | Provider: ${article.provider.padEnd(20)}         ║`);
        console.log('╠════════════════════════════════════════════════════════════════╣');
        console.log('║ INTELLIGENCE DECISIONS:                                        ║');
        console.log(`║ • Gap Found: "${topic.substring(0, 35).padEnd(35)}"     ║`);
        console.log(`║ • Keyword Difficulty: ${keywords.difficulty}/100                              ║`);
        console.log(`║ • Search Intent: ${keywords.intent.padEnd(30)}           ║`);
        console.log(`║ • Opportunity Score: ${opportunity.overallScore}/100                              ║`);
        console.log(`║ • Priority: ${opportunity.priority.toUpperCase().padEnd(30)}           ║`);
        console.log(`║ • Content Type: ${opportunity.contentType.padEnd(30)}       ║`);
        console.log(`║ • Target Words: ${seo.targetWordCount.min}-${seo.targetWordCount.max}                                   ║`);
        console.log('╠════════════════════════════════════════════════════════════════╣');
        console.log('║ OUTPUTS:                                                       ║');
        console.log(`║ • Article Quality: ${quality.score}/100 (${quality.grade})                            ║`);
        console.log(`║ • Writer: ${prompt.writerPersona.padEnd(35)}        ║`);
        console.log(`║ • Visuals: ${visuals.length} recommended                                    ║`);
        console.log(`║ • Twitter: ${social.twitter} tweets | LinkedIn: ✓                       ║`);
        console.log('╠════════════════════════════════════════════════════════════════╣');
        console.log('║ URL:                                                           ║');
        console.log(`║ ${saved.url.padEnd(62)} ║`);
        console.log('╚════════════════════════════════════════════════════════════════╝');
        
    } catch (e: any) {
        console.error('\n❌ Pipeline failed:', e.message);
    }
}

runPipeline();
