import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";
import Groq from 'groq-sdk';
import { Mistral } from '@mistralai/mistralai';
import OpenAI from 'openai';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Error: Supabase credentials missing');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Article Topics Type
interface Topic {
    category: string;
    title: string;
    keywords: string;
    target_audience: string;
}

// Helper: Get Prompt (Updated for 2000+ words requirement - STRICT)
function getArticlePrompt(topic: Topic): string {
     return `You are a financial content writer for InvestingPro, India's leading financial comparison platform.

Write a comprehensive, SEO-optimized, decision-focused article on: "${topic.title}"

CRITICAL REQUIREMENTS:
1. Target Audience: ${topic.target_audience}
2. Keywords to include: ${topic.keywords}
3. MINIMUM LENGTH: 2000 WORDS (ABSOLUTELY REQUIRED - this is non-negotiable)
4. Target Length: 2200-2500 words for better SEO and comprehensiveness
5. Tone: Professional yet approachable, helpful, non-promotional, decision-focused
6. Format: CLEAN HTML ONLY with PROFESSIONAL COMPONENTS
7. Focus: Help readers make informed decisions, include comparisons, pros/cons, recommendations

WORD COUNT ENFORCEMENT:
- You MUST generate at least 2000 words
- Count words after HTML tags are removed
- Use detailed explanations, examples, and comprehensive coverage
- Expand each section with specific details, use cases, and real-world scenarios
- Include extensive lists, comparisons, and detailed explanations

FORMATTING RULES (CRITICAL):
- Use ONLY these HTML tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <hr>, <div>, <table>, <thead>, <tbody>, <tr>, <th>, <td>
- NO <h1> tags (title is separate)
- NO Markdown symbols
- Start with <h2>Introduction</h2>
- Include 10-12 <h2> sections for comprehensive coverage (MORE SECTIONS = MORE WORDS)
- Use <h3> for sub-sections (aim for 3-4 sub-sections per main section)
- Include at least 8-10 <ul> lists (detailed bullet points)
- Add 3-4 <blockquote> with expert tips and insights
- Include 2-3 comparison tables where relevant (tables help add content)
- End with <h2>Conclusion</h2> with actionable next steps

PROFESSIONAL COMPONENTS (MUST INCLUDE - Use these EXACT HTML structures):

1. KEY TAKEAWAYS BOX (RIGHT AFTER Introduction) - Use this structure:
<div class="bg-primary-50 border-l-4 border-primary-600 p-6 my-8 rounded-r-lg">
    <h3 class="text-primary-900 font-bold text-lg mb-4">Key Takeaways</h3>
    <ul class="space-y-3 list-none">
        <li class="flex items-start"><span class="text-primary-600 mr-2 font-bold">✓</span> <span>First key point with detailed explanation...</span></li>
        <li class="flex items-start"><span class="text-primary-600 mr-2 font-bold">✓</span> <span>Second key point...</span></li>
        <!-- Continue for 6-7 points -->
    </ul>
</div>

2. PRO TIP CALLOUTS (3-4 times throughout article) - Use this structure:
<div class="bg-secondary-50 border border-secondary-200 p-5 my-6 rounded-lg">
    <div class="flex items-start gap-3">
        <span class="text-secondary-600 font-bold text-xl">💡</span>
        <div>
            <p class="font-bold text-secondary-900 mb-1">Pro Tip:</p>
            <p class="text-secondary-800">Your expert tip or insight here with detailed explanation...</p>
        </div>
    </div>
</div>

3. COMPARISON TABLES (2-3 tables) - Use this structure:
<table class="w-full border-collapse my-8">
    <thead>
        <tr class="bg-slate-100">
            <th class="border border-slate-300 p-3 text-left font-bold">Feature</th>
            <th class="border border-slate-300 p-3 text-left font-bold">Option A</th>
            <th class="border border-slate-300 p-3 text-left font-bold">Option B</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="border border-slate-300 p-3">Feature Name</td>
            <td class="border border-slate-300 p-3">Details for A</td>
            <td class="border border-slate-300 p-3">Details for B</td>
        </tr>
        <!-- More rows -->
    </tbody>
</table>

4. WARNING/CAUTION BOXES - Use this structure:
<div class="bg-accent-50 border-l-4 border-accent-600 p-5 my-6 rounded-r-lg">
    <p class="font-bold text-accent-900 mb-2">⚠️ Important:</p>
    <p class="text-accent-800">Warning or caution message with detailed explanation...</p>
</div>

5. METRIC CARDS (use inline for stats) - Use this structure:
<div class="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 my-8 rounded-xl border border-primary-200">
    <div class="grid grid-cols-2 gap-4">
        <div class="text-center">
            <p class="text-3xl font-bold text-primary-600">68%</p>
            <p class="text-sm text-slate-600">Users prefer this</p>
        </div>
        <div class="text-center">
            <p class="text-3xl font-bold text-secondary-600">₹50K</p>
            <p class="text-sm text-slate-600">Average savings</p>
        </div>
    </div>
</div>

6. FREQUENTLY ASKED QUESTIONS - Use this structure:
<h2>Frequently Asked Questions</h2>
<div class="space-y-6 my-8">
    <div class="border-l-4 border-primary-500 pl-4">
        <h3 class="font-bold text-slate-900 mb-2">What is [topic]?</h3>
        <p class="text-slate-700">Detailed answer with explanation...</p>
    </div>
    <!-- More FAQ items -->
</div>

DETAILED CONTENT STRUCTURE (TARGET: 2200-2500 words):
- Introduction (300-350 words): Hook, problem statement, why this matters, what readers will learn
- Key Takeaways Box (150 words): 6-7 comprehensive bullet points
- Understanding the Basics (400-450 words): Deep dive into fundamentals, definitions, concepts
- Key Features/Benefits (400-450 words): Detailed explanation of all features with examples
- Detailed Comparison/Analysis (500-550 words): Comprehensive comparison with multiple products/options
- Pros and Cons (300 words): Extensive pros and cons with explanations
- Who Should Consider This (250 words): Target audience analysis with scenarios
- How to Choose/Apply (400 words): Step-by-step guide with detailed instructions
- Common Mistakes to Avoid (250 words): Detailed list of mistakes with explanations
- Frequently Asked Questions (200 words): 5-6 questions with detailed answers
- Conclusion with Action Items (250-300 words): Comprehensive summary and next steps

CONTENT EXPANSION TECHNIQUES:
- Use specific examples: "For instance, if you spend ₹20,000 per month on..."
- Include Indian context: Mention Indian banks, AMCs, regulations, tax laws (Section 80C, etc.)
- Add comparison scenarios: "Card A offers 5% cashback while Card B offers 3%, but..."
- Explain why: Don't just state facts, explain the reasoning behind each point
- Use numbers and statistics: "Studies show that 68% of investors prefer..."
- Include real-world use cases: "A 30-year-old earning ₹10LPA should consider..."

SEO OPTIMIZATION:
- Naturally integrate keywords throughout (every 100-150 words)
- Use long-tail variations of keywords
- Focus on search intent: "best", "compare", "how to choose", "which is better", "review"
- Include Indian context: ₹ currency, Indian regulations, Indian banks/AMCs, Indian tax laws
- Use question-based headings: "What is...", "How to...", "Which is best for..."

IMPORTANT: Before finishing, verify your content is AT LEAST 2000 words when HTML tags are removed. If shorter, expand sections with more details, examples, and explanations.

Generate ONLY the clean article content HTML now (MINIMUM 2000 words, target 2200-2500 words, no markdown):`;
}

// AI Providers
async function tryGemini(topic: Topic): Promise<string> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not found');
    
    const ai = new GoogleGenAI({ apiKey }); 
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: 'user', parts: [{ text: getArticlePrompt(topic) }] }],
    }).catch(async () => {
         // Fallback model
         return await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: 'user', parts: [{ text: getArticlePrompt(topic) }] }],
        });
    });

    return response.response.text();
}

async function tryGroq(topic: Topic): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY not found');
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: getArticlePrompt(topic) }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
    });
    return completion.choices[0]?.message?.content || '';
}

async function tryMistral(topic: Topic): Promise<string> {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) throw new Error('MISTRAL_API_KEY not found');
    const client = new Mistral({ apiKey });
    const response = await client.chat.complete({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: getArticlePrompt(topic) }],
    });
    return response.choices?.[0]?.message?.content || '';
}

async function tryOpenAI(topic: Topic): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    // Check if it's the placeholder
    if (!apiKey || apiKey.includes('PqPq')) throw new Error('OPENAI_API_KEY not found or invalid');
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content: getArticlePrompt(topic) }],
        model: 'gpt-4o-mini',
    });
    return completion.choices[0]?.message?.content || '';
}

// Meta Description Generator
async function generateMeta(topic: Topic, content: string): Promise<string> {
    try {
         // Use Groq for speed/cost if available
         if (process.env.GROQ_API_KEY) {
             const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
             const completion = await groq.chat.completions.create({
                 messages: [{ role: 'user', content: `Write a 150 char meta description for article "${topic.title}". Content start: ${content.substring(0, 500)}` }],
                 model: 'llama-3.1-8b-instant',
             });
             return completion.choices[0]?.message?.content?.replace(/["']/g, '') || '';
         }
         return `${topic.title} - Comprehensive guide for ${topic.target_audience}. Learn about ${topic.keywords}.`;
    } catch {
        return `${topic.title} - Comprehensive guide for ${topic.target_audience}. Learn about ${topic.keywords}.`;
    }
}

// Utils
function createSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function calculateReadingTime(html: string): number {
    const words = html.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / 200);
}

// Main Process
async function main() {
    console.log('🚀 Starting Week 3 Article Generation (25 Deep Articles)...');
    
    const topicsPath = path.join(process.cwd(), 'scripts/data/week3_articles.json');
    if (!fs.existsSync(topicsPath)) {
        console.error('❌ Week 3 topic list not found at:', topicsPath);
        return;
    }
    
    const topics: Topic[] = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));
    console.log(`📋 Found ${topics.length} topics for Week 3`);
    
    let generated = 0;
    let skipped = 0;
    
    for (const topic of topics) {
        try {
            // Check existence
            const slug = createSlug(topic.title);
            const { data: existing } = await supabase.from('articles').select('id, content, body_html').eq('slug', slug).single();
            
            // Check if article exists and if word count is below 2000
            if (existing) {
                const existingContent = existing.body_html || existing.content || '';
                const existingWordCount = existingContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
                
                if (existingWordCount < 2000) {
                    console.log(`⚠️  "${topic.title}" exists but only has ${existingWordCount} words (below 2000 target). Regenerating...`);
                    // Delete existing article to regenerate
                    await supabase.from('articles').delete().eq('id', existing.id);
                } else {
                    console.log(`⏩ Skipping "${topic.title}" (Already exists with ${existingWordCount} words)`);
                    skipped++;
                    continue;
                }
            }
            
            console.log(`\n📝 [${generated + skipped + 1}/${topics.length}] Generating "${topic.title}"...`);
            
            // Generate Content with failover
            let content = '';
            let provider = '';
            
            // Try providers
            try { content = await tryGemini(topic); provider = 'Gemini'; }
            catch (e) {
                console.log('   🔸 Gemini failed, trying Groq...');
                try { content = await tryGroq(topic); provider = 'Groq'; }
                catch (e) {
                    console.log('   🔸 Groq failed, trying Mistral...');
                    try { content = await tryMistral(topic); provider = 'Mistral'; }
                    catch (e) {
                        console.log('   🔸 Mistral failed, trying OpenAI...');
                        try { content = await tryOpenAI(topic); provider = 'OpenAI'; }
                        catch (e) {
                            console.error(`❌ All providers failed for "${topic.title}"`);
                            continue;
                        }
                    }
                }
            }
            
            // Clean up content (sometimes models output markdown blocks)
            content = content.replace(/^```html/, '').replace(/```$/, '').replace(/^```/, '').trim();
            
            // Calculate word count
            const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
            
            // Warn if below target (but still save)
            if (wordCount < 2000) {
                console.log(`   ⚠️  WARNING: Article is ${wordCount} words (below 2000 target). Consider regenerating with updated prompt.`);
            } else if (wordCount >= 2000) {
                console.log(`   ✓ Word count OK: ${wordCount} words (meets 2000+ requirement)`);
            }
            
            // Generate Metadata
            const metaDesc = await generateMeta(topic, content);
            const readTime = calculateReadingTime(content);
            
            // Map category (credit-cards -> credit-cards, mutual-funds -> mutual-funds)
            const category = topic.category;
            
            // Save to DB - Using correct schema fields
            const articleData = {
                title: topic.title,
                slug,
                excerpt: metaDesc,
                content: content, // Main content field
                body_html: content, // Also store as HTML
                category: category,
                seo_title: `${topic.title} | InvestingPro`,
                seo_description: metaDesc,
                status: 'published',
                published_date: new Date().toISOString(),
                read_time: readTime,
                ai_generated: true,
                tags: topic.keywords.split(',').map(k => k.trim()),
                author_name: 'InvestingPro Team'
            };
            
            const { error: insertError } = await supabase.from('articles').insert([articleData]);
            
            if (insertError) {
                console.error(`❌ Database error for "${topic.title}":`, insertError.message);
                throw insertError;
            }
            
            console.log(`✅ Saved "${topic.title}" using ${provider} (${wordCount} words, ${readTime} min read)`);
            generated++;
            
            // Wait 3s to be nice to APIs (longer wait for 2000+ word articles)
            await new Promise(r => setTimeout(r, 3000));
            
        } catch (err: any) {
            console.error(`❌ Error processing "${topic.title}":`, err.message);
        }
    }
    
    console.log(`\n🎉 Week 3 Batch Complete!`);
    console.log(`   ✅ Generated: ${generated} new articles`);
    console.log(`   ⏩ Skipped: ${skipped} existing articles`);
    console.log(`   📊 Total: ${topics.length} topics processed`);
}

main().catch(console.error);
