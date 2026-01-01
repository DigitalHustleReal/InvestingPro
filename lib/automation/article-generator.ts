import { GoogleGenAI } from "@google/genai";
import Groq from 'groq-sdk';
import { Mistral } from '@mistralai/mistralai';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { serpAnalyzer, ResearchBrief } from '@/lib/research/serp-analyzer';

/**
 * CORE ARTICLE GENERATION LOGIC
 * Refactored for use in both CLI and Admin UI
 */

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// High-Authority Article Prompt
function getArticlePrompt(topic: string, brief?: ResearchBrief): string {
    let prompt = `
    ROLE: You are a Senior Financial Analyst and Editor at InvestingPro (India's leading financial authority). 
    Your tone is authoritative, engaging, and deeply analytical. You write for humans, not search engines.
    
    GOAL: Write a high-quality, "Category-Defining" article about: "${topic}".

    STYLE GUIDELINES (CRITICAL):
    - **LOCALIZATION**: Write in **Indian English** (e.g., 'colour', 'centre', 'analyse').
    - **NUMBERING**: Use **Lakhs and Crores** strictly (e.g., "1.5 Lakh", "10 Crore"). NEVER use "Millions" or "Billions".
    - **CONTEXT**: Reference Indian specific entities (RBI, SEBI, Nifty 50, Sensex, Section 80C).
    - **NO AI CLICHÉS**: Do not use "unveil", "delve", "realm", "bustling", "landscape".
    - **Hook the Reader**: Start with a compelling fact, story, or contrarian questions. DO NOT start with "In this article...".
    - **Human Voice**: Use "We", "Our analysis", and varied sentence structures. 
    - **Data-First**: Always back claims with approximate numbers (e.g., "Returns have averaged ~12%...").

    STRUCTURE REQUIREMENTS:
    1. **H1 Title**: engaging and SEO-rich (Indian context).
    2. **Hook Intro**: 2-3 paragraphs that grab attention immediately.
    3. **Key Takeaways Box**: <div class="key-takeaways">...</div> (3-5 bullet points with checkmarks).
    4. **Deep Dive Content**: multiple H2 and H3 sections.
    5. **Data Table**: Include at least one HTML <table> comparing options, rates, or pros/cons.
    6. **Pro Tip Box**: <div class="pro-tip">...</div> (Insider advice for Indian investors).
    7. **Warning Box**: <div class="warning-box">...</div> (Risks/Regulations to avoid).
    8. **FAQ Section**: 3-4 common questions unique to Indian users.

    FORMATTING PROMPT:
    - Return ONLY raw HTML inside the response.
    - Use <table> for data.
    - Use <strong> for emphasis.
    - Ensure all monetary values use the Indian Rupee symbol (₹).
    `;

    if (brief) {
        prompt += `
        \nCOMPETITIVE INTELLIGENCE (BEAT THESE GAPS):
        - **MISSING IN COMPETITORS**: ${brief.content_gaps.join("; ")}.
        - **MANDATORY STATS**: ${brief.key_statistics.join("; ")}.
        - **UNIQUE ANGLE**: ${brief.unique_angle}.
        
        Ensure you cover these gaps to make this the #1 article on Google.
        `;
    }

    prompt += `\nGenerate the article now.`;
    return prompt;
}

// AI Generation with failover
async function generateWithAI(topic: string, brief?: ResearchBrief, logFn: (msg: string) => void = console.log): Promise<string> {
    const providers = [
        { name: 'Gemini', fn: async () => {
            const ai = new GoogleGenAI({});
            // Hack for local env if needed, but in Next.js process.env works
           // process.env.GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY; 
            const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
             if (!apiKey) throw new Error("Missing Gemini API Key");
            
            // Re-instantiate with key if needed, or rely on env
            // The GoogleGenAI constructor doesn't take empty object for auth usually, it takes key.
            // Let's assume the previous script worked, but usually it's new GoogleGenAI(key)
            // Checking previous script: new GoogleGenAI({}); ... process.env.GEMINI_API_KEY = ...
            // That was a bit weird. Let's do it properly.
            const genAI = new GoogleGenAI({ apiKey });
            
            const response = await genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: getArticlePrompt(topic, brief),
            });
            return response.text; // Updated from previous script which used .text() or similar? 
            // Previous script: response.text. Wait, GoogleGenAI v1 is response.response.text().
            // But the previous script import was "@google/genai" which is the new SDK?? 
            // Let's stick to EXACTLY what worked in the script if possible.
            // Script line 78: const response = await ai.models.generateContent(...) 
            // line 82: return response.text;
            // Okay, I will trust the previous script's usage.
        }},
        { name: 'Mistral', fn: async () => {
            const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
            const response = await client.chat.complete({
                model: 'mistral-small-latest',
                messages: [{ role: 'user', content: getArticlePrompt(topic, brief) }],
            });
            return (response.choices?.[0]?.message?.content as string) || '';
        }},
        { name: 'OpenAI', fn: async () => {
            const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const completion = await client.chat.completions.create({
                messages: [{ role: 'user', content: getArticlePrompt(topic, brief) }],
                model: 'gpt-4o-mini',
                temperature: 0.7,
                max_tokens: 4000,
            });
            return (completion.choices[0]?.message?.content as string) || '';
        }},
        { name: 'Groq', fn: async () => {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: getArticlePrompt(topic, brief) }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 4000,
            });
            return (completion.choices[0]?.message?.content as string) || '';
        }},
    ];

    for (const provider of providers) {
        try {
            logFn(`🔵 Trying ${provider.name}...`);
            const content = await provider.fn();
            if(!content || content.length < 100) throw new Error("Empty response");
            logFn(`✅ SUCCESS with ${provider.name}!`);
            return content;
        } catch (error: any) {
            logFn(`❌ ${provider.name} failed: ${error.message}`);
        }
    }

    throw new Error('All AI providers failed');
}

// Category Detection
function detectClassification(title: string, content: string): { category: string; tags: string[] } {
    const text = (title + ' ' + content).toLowerCase();
    const tags: string[] = [];
    
    // Default to 'investing-basics' (Valid DB Category)
    let category = 'investing-basics';

    // Map keywords to Valid DB Categories
    if (text.includes('mutual fund') || text.includes('sip') || text.includes('nav')) {
        category = 'mutual-funds';
        tags.push('investing');
    } else if (text.includes('stock') || text.includes('ipo') || text.includes('share market') || text.includes('equity')) {
        category = 'stocks';
        tags.push('investing');
    } else if (text.includes('credit card') || text.includes('cashback') || text.includes('rewards')) {
        category = 'credit-cards';
        tags.push('banking');
    } else if (text.includes('loan') || text.includes('emi') || text.includes('borrow')) {
        category = 'loans';
        tags.push('banking');
    } else if (text.includes('insurance') || text.includes('policy') || text.includes('term plan')) {
        category = 'insurance';
        tags.push('insurance');
    } else if (text.includes('tax') || text.includes('80c') || text.includes('itr')) {
        category = 'tax-planning';
        tags.push('tax');
    } else if (text.includes('retire') || text.includes('pension') || text.includes('nps') || text.includes('ppf')) {
        category = 'retirement';
        tags.push('retirement');
    }

    // Add general tags
    if (text.includes('guide')) tags.push('guide');
    if (text.includes('2026')) tags.push('2026');
    if (text.includes('money')) tags.push('personal-finance');

    return { category, tags };
}

// Generate Article Function
export async function generateArticleCore(topic: string, logFn: (msg: string) => void = console.log) {
    const startTime = Date.now();

    try {
        // 0. Deep Research
        logFn('0️⃣ Performing Deep Research (SERP Analysis)...');
        let brief: ResearchBrief | undefined;
        try {
            brief = await serpAnalyzer.analyzeCompetitors(topic);
            logFn(`   ✅ Identified ${brief.content_gaps.length} Content Gaps`);
        } catch (e) {
            logFn('   ⚠️ Research failed, proceeding with standard generation.');
        }

        // 1. Generate Content
        logFn('1️⃣ Generating article with AI...');
        const html = await generateWithAI(topic, brief, logFn);
        logFn(`   ✅ Generated ${html.length} characters`);

        // 2. Extract Metadata
        logFn('2️⃣ Extracting SEO metadata...');
        const $ = cheerio.load(html);
        const h1 = $('h1').first().text().trim();
        const firstPara = $('p').first().text().trim();
        const title = h1 || topic;
        const slug = slugify(title, { lower: true, strict: true }) || 'article-' + Date.now();
        const excerpt = firstPara.substring(0, 160) || 'Financial guide';
        
        logFn(`   ✅ Title: ${title}`);
        logFn(`   ✅ Slug: ${slug}`);

        // 3. Read Time
        const words = $.text().split(/\s+/).length;
        const readTime = Math.ceil(words / 200);
        logFn(`   ✅ Read time: ${readTime} minutes`);

        // 4. Classification
        logFn('4️⃣ Detecting classification...');
        const { category, tags } = detectClassification(title, html);
        logFn(`   ✅ Category: ${category}`);
        logFn(`   ✅ Tags: ${tags.join(', ')}`);

        // 5. Image Generation
        logFn('5️⃣ Generating featured image...');
        const imagePrompt = `professional cinematic photo of ${title.replace(/[^a-zA-Z0-9 ]/g, '')}, financial context, 8k, highly detailed, realistic`;
        const encodedPrompt = encodeURIComponent(imagePrompt);
        const randomSeed = Math.floor(Math.random() * 10000);
        const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1280&height=720&seed=${randomSeed}&model=flux`;
        logFn(`   ✅ Image: ${imageUrl}`);

        // 6. DB Insert
        logFn('6️⃣ Publishing to database...');
        const now = new Date().toISOString();
        const today = now.split('T')[0];

        // Fetch a valid author ID (System Admin)
        let authorId = null;
        try {
            // Try to get the first user from auth.users using Admin API
            const { data: { users }, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
            if (users && users.length > 0) {
                authorId = users[0].id;
                logFn(`   👤 Assigned Author ID: ${authorId} (Admin)`);
            } else {
                 logFn('   ⚠️ No users found. Attempting to publish without Author ID.');
            }
        } catch (e) {
            logFn('   ⚠️ Could not fetch users. Defaulting to null author.');
        }

        // Prepare insert data
        const insertPayload: any = {
            title: title,
            slug: slug,
            excerpt: excerpt,
            
            body_html: html,
            body_markdown: html,
            content: html,
            
            meta_title: title.substring(0, 60),
            meta_description: excerpt,
            seo_title: title,
            seo_description: excerpt,

            category: category,
            tags: tags,
            read_time: readTime,
            featured_image: imageUrl,
            
            status: 'review', // HUMAN GATE: Requires approval
            published_at: now,
            published_date: today,
            
            ai_generated: true,
            author_name: 'AI Editor',
        };

        // Only add author_id if we found one, otherwise leave it undefined (to try NULL or Default)
        if (authorId) {
            insertPayload.author_id = authorId;
        }

        const { data: article, error } = await supabase
            .from('articles')
            .insert(insertPayload)
            .select()
            .single();

        if (error) {
            throw new Error(`Database error: ${error.message} (Detail: ${error.details || ''})`);
        }

        logFn('✅ PUBLISHED SUCCESSFULLY!');
        
        return {
            success: true,
            article: article,
            duration: ((Date.now() - startTime) / 1000).toFixed(2),
            url: `/articles/${slug}`
        };

    } catch (error: any) {
        logFn(`💥 ERROR: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}
