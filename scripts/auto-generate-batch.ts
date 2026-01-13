
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

// Helper: Get Prompt
function getArticlePrompt(topic: Topic): string {
     return `You are a financial content writer for InvestingPro, India's leading financial comparison platform.

Write a comprehensive, SEO-optimized article on: "${topic.title}"

REQUIREMENTS:
1. Target Audience: ${topic.target_audience}
2. Keywords to include: ${topic.keywords}
3. Length: 1500+ words (Comprehensive Guide)
4. Tone: Professional yet approachable, helpful, non-promotional
5. Format: CLEAN HTML ONLY with PROFESSIONAL COMPONENTS

FORMATTING RULES (CRITICAL):
- Use ONLY these HTML tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, blockquote, <hr>, <div>
- NO <h1> tags (title is separate)
- NO Markdown symbols
- Start with <h2>Introduction</h2>
- Include 6-8 <h2> sections
- Use <h3> for sub-sections
- Include at least 3-4 <ul> lists
- Add 1-2 <blockquote> with expert tips
- End with <h2>Conclusion</h2>

PROFESSIONAL COMPONENTS (MUST INCLUDE):
1. KEY TAKEAWAYS BOX (RIGHT AFTER Introduction)
2. PRO TIP CALLOUT (1-2 times)
3. VISUAL GRAPHICS (progress bars, comparison sliders, or metric cards) using clean HTML/Tailwind classes.

Generate ONLY the clean article content HTML now.`;
}

// AI Providers
async function tryGemini(topic: Topic): Promise<string> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not found');
    
    // Using GoogleGenAI SDK format (v0.1.0+) which might function differently than v1
    // Adjusting to common pattern for @google/generative-ai if that's what's installed or @google/genai
    // The previous script used @google/genai. Let's assume standard google-generative-ai pattern if the other fails, 
    // but the import said @google/genai.
    const ai = new GoogleGenAI({ apiKey }); 
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp", // Trying a reliable model name, or fallback to gemini-1.5-flash
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
    console.log('🚀 Starting Batch Article Generation...');
    
    const topicsPath = path.join(process.cwd(), 'scripts/data/topics.json');
    if (!fs.existsSync(topicsPath)) {
        console.error('❌ Topic list not found');
        return;
    }
    
    const topics: Topic[] = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));
    console.log(`📋 Found ${topics.length} topics`);
    
    let generated = 0;
    
    for (const topic of topics) {
        try {
            // Check existence
            const slug = createSlug(topic.title);
            const { data: existing } = await supabase.from('articles').select('id').eq('slug', slug).single();
            if (existing) {
                console.log(`⏩ Skipping "${topic.title}" (Already exists)`);
                continue;
            }
            
            console.log(`📝 Generating "${topic.title}"...`);
            
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
            content = content.replace(/^```html/, '').replace(/```$/, '').trim();
            
            // Generate Metadata
            const metaDesc = await generateMeta(topic, content);
            const readTime = calculateReadingTime(content);
            
            // Save to DB
             const articleData = {
                title: topic.title,
                slug,
                excerpt: metaDesc,
                category: topic.category,
                body_html: content,
                meta_title: `${topic.title} | InvestingPro`,
                meta_description: metaDesc,
                status: 'published',
                published_at: new Date().toISOString(),
                published_date: new Date().toISOString().split('T')[0],
                content_type: 'article',
                read_time: readTime,
                 // Add word_count if column exists, otherwise it might error if strict. 
                 // Previous scripts suggested it doesn't exist, so omitting.
            };
            
            const { error: insertError } = await supabase.from('articles').insert([articleData]);
            
            if (insertError) throw insertError;
            
            console.log(`✅ Saved "${topic.title}" using ${provider}`);
            generated++;
            
            // Wait 2s to be nice to APIs
            await new Promise(r => setTimeout(r, 2000));
            
        } catch (err: any) {
            console.error(`❌ Error processing "${topic.title}":`, err.message);
        }
    }
    
    console.log(`\n🎉 Batch Complete! Generated ${generated} new articles.`);
}

main();
