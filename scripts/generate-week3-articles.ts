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

// Helper: Get Prompt (Updated for 2000+ words requirement)
function getArticlePrompt(topic: Topic): string {
     return `You are a financial content writer for InvestingPro, India's leading financial comparison platform.

Write a comprehensive, SEO-optimized, decision-focused article on: "${topic.title}"

REQUIREMENTS:
1. Target Audience: ${topic.target_audience}
2. Keywords to include: ${topic.keywords}
3. Length: 2000+ words (Comprehensive, in-depth guide)
4. Tone: Professional yet approachable, helpful, non-promotional, decision-focused
5. Format: CLEAN HTML ONLY with PROFESSIONAL COMPONENTS
6. Focus: Help readers make informed decisions, include comparisons, pros/cons, recommendations

FORMATTING RULES (CRITICAL):
- Use ONLY these HTML tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <hr>, <div>, <table>, <thead>, <tbody>, <tr>, <th>, <td>
- NO <h1> tags (title is separate)
- NO Markdown symbols
- Start with <h2>Introduction</h2>
- Include 8-10 <h2> sections for comprehensive coverage
- Use <h3> for sub-sections
- Include at least 5-6 <ul> lists
- Add 2-3 <blockquote> with expert tips
- Include 1-2 comparison tables where relevant
- End with <h2>Conclusion</h2> with actionable next steps

PROFESSIONAL COMPONENTS (MUST INCLUDE):
1. KEY TAKEAWAYS BOX (RIGHT AFTER Introduction) - 4-5 bullet points
2. PRO TIP CALLOUTS (2-3 times throughout)
3. COMPARISON TABLES (where applicable - e.g., comparing products, features, fees)
4. VISUAL ELEMENTS using clean HTML/Tailwind classes (progress bars, comparison sliders, metric cards)

CONTENT STRUCTURE (2000+ words):
- Introduction (200 words): Hook, problem statement, what readers will learn
- Key Takeaways (100 words)
- Understanding the Basics (300 words)
- Key Features/Benefits (300 words)
- Detailed Comparison/Analysis (400 words)
- Pros and Cons (200 words)
- Who Should Consider This (200 words)
- How to Choose/Apply (300 words)
- Common Mistakes to Avoid (200 words)
- Conclusion with Action Items (200 words)

SEO OPTIMIZATION:
- Naturally integrate keywords throughout
- Use long-tail variations
- Focus on search intent: "best", "compare", "how to choose", "which is better"
- Include Indian context: ₹ currency, Indian regulations, Indian banks/AMCs

Generate ONLY the clean article content HTML now (2000+ words, no markdown):`;
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
            const { data: existing } = await supabase.from('articles').select('id').eq('slug', slug).single();
            if (existing) {
                console.log(`⏩ Skipping "${topic.title}" (Already exists)`);
                skipped++;
                continue;
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
