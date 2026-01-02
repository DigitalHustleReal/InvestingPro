import { GoogleGenAI } from "@google/genai";
import Groq from 'groq-sdk';
import { Mistral } from '@mistralai/mistralai';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { serpAnalyzer, ResearchBrief } from '@/lib/research/serp-analyzer';
import { analyzeContentQuality, generateQualityReport } from '@/lib/quality/content-quality-scorer';
import { checkPlagiarism, generatePlagiarismReport } from '@/lib/quality/plagiarism-checker';
import { generateImageAltText } from '@/lib/quality/image-alt-generator';
import { generateArticleSchema, extractFAQsFromContent } from '@/lib/seo/schema-generator';
import { imageService } from '@/lib/images/stock-image-service';

/**
 * CORE ARTICLE GENERATION LOGIC
 * Refactored for use in both CLI and Admin UI
 */

// Lazy Supabase client initialization (allows env vars to load first)
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
    if (!supabaseClient) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!url || !key) {
            throw new Error('Supabase credentials not found. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in .env.local');
        }
        
        supabaseClient = createClient(url, key);
    }
    return supabaseClient;
}

// High-Authority Article Prompt
// High-Authority Article Prompt
function getArticlePrompt(topic: string, brief?: ResearchBrief): string {
    let prompt = `
    ROLE: You are "Vikram Mehta", a Senior Wealth Advisor with 15+ years of experience in the Indian financial markets (SEBI Registered). 
    Your voice is authoritative yet conversational, trusted, and deeply analytical. You simplify complex concepts without dumbing them down.
    You prioritize **User Intent** and **Solution-First** writing.

    GOAL: Write a viral-worthy, "Category-Defining" article about: "${topic}".
    
    FRAMEWORK: Use the **AIDA Model** (Attention, Interest, Desire, Action) + **PAS** (Problem, Agitation, Solution) for sections.

    STYLE GUIDELINES (CRITICAL):
    - **LOCALIZATION**: Write in **Indian English** (e.g., 'colour', 'centre', 'analyse').
    - **NUMBERING**: Use **Lakhs and Crores** strictly (e.g., "1.5 Lakh", "10 Crore"). NEVER use "Millions" or "Billions".
    - **CONTEXT**: Reference Indian specific entities (RBI, SEBI, Nifty 50, Sensex, Section 80C, EPF, PPF).
    - **ANTI-AI CHECK**: DO NOT use words like: "unveil", "delve", "realm", "bustling", "landscape", "tapestry", "digital era", "game-changer".
    - **HOOK THE READER**: Start with a "Pattern Interrupt" (e.g., specific stat, contrarian view, or "Did you know?"). DO NOT start with "In this article..." or "In today's world...".
    - **HUMAN VOICE**: Use "I", "We", ask rhetorical questions, and use short punchy sentences mixed with longer explanatory ones.
    - **DATA-FIRST**: Every claim must be backed by a number or example (e.g., "Returns have averaged ~12% CAGR over 10 years...").

    STRUCTURE REQUIREMENTS (HTML FORMAT):
    1. **H1 Title**: Click-worthy, SEO-rich, under 60 chars.
    2. **Viral Intro**: 
       - Start with a Hook (Problem/Stat).
       - Agitate the pain point.
       - Tease the solution (The "Open Loop").
    3. **"Quick Verdict" Box**: <div class="quick-verdict p-4 bg-blue-50 border-l-4 border-blue-500 my-6"><strong>⚡ Quick Verdict:</strong> [2-sentence summary for busy readers]</div>.
    4. **Deep Dive Content**: multiple H2 and H3 sections. Use **PAS Framework** here.
    5. **Data Visualization**: Include at least 2 HTML <table> elements (Comparison, Fee Structure, or Returns Scenario).
    6. **Checklist/Steps**: Use <ul> or <ol> with <strong>bold</strong> lead-ins.
    7. **Pro Tip Box**: <div class="pro-tip p-4 bg-green-50 border-l-4 border-green-500 my-6"><strong>💡 Pro Tip:</strong> [Insider advice]</div>.
    8. **Warning Box**: <div class="warning-box p-4 bg-red-50 border-l-4 border-red-500 my-6"><strong>⚠️ Warning:</strong> [Risk or Regulation to avoid]</div>.
    9. **FAQ Section**: 4-5 questions people actually ask (Use Schema.org style answers).
    10. **Conclusion**: Don't summarize. Give a "Next Step" or Actionable Advice.

    FORMATTING RULES:
    - Return a VALID JSON Object: 
      { 
        "title": "Final Viral Title",
        "seo_title": "SEO Optimized Title (50-60 chars) - Must include keyword",
        "seo_description": "Compelling meta description (150-160 chars) designed for high CTR.",
        "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
        "content": "<h1>Title...</h1>...",
        "image_keywords": "abstract conceptual visual search term (e.g. 'Abstract Finance Minimal', 'Cinematic Office')"
      }
    - Use <table> for data.
    - Use <strong> for emphasis (don't overdo it).
    - Ensure all monetary values use the Indian Rupee symbol (₹).
    - Keep paragraphs short (2-3 sentences max).
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

    prompt += `\nGenerate the extensive, high-quality article now.`;
    return prompt;
}

// AI Generation with foolproof failover
async function generateWithAI(topic: string, brief?: ResearchBrief, logFn: (msg: string) => void = console.log): Promise<string> {
    // USE RELATIVE PATH to avoid @ alias issues in tsx/node scripts
    const { api } = require('../api');
    
    try {
        logFn(`🔵 Initializing Foolproof Generation Relay...`);
        const result = await api.integrations.Core.InvokeLLM({
            prompt: getArticlePrompt(topic, brief),
            operation: 'generate_article',
            contextData: { topic, brief }
        });

        if (!result || !result.content) {
            throw new Error("AI engine failed to produce content");
        }

        logFn(`✅ SUCCESS with ${result.provider}!`);
        return result.content;
    } catch (error: any) {
        logFn(`❌ Generation failed: ${error.message}`);
        throw error;
    }
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
export async function generateArticleCore(
    topic: string, 
    logFn: (msg: string) => void = console.log,
    dryRun: boolean = false
) {
    const startTime = Date.now();

    try {
        // 0. Deep Research
        logFn('0️⃣ Performing Deep Research (SERP Analysis)...');
        let brief: ResearchBrief | undefined;
        let difficultyScore = 50; // Default medium difficulty
        try {
            brief = await serpAnalyzer.analyzeCompetitors(topic);
            logFn(`   ✅ Identified ${brief.content_gaps.length} Content Gaps`);
            
            // NEW: Score keyword difficulty (graceful fallback)
            try {
                const { scoreKeywordDifficulty } = await import('@/lib/seo/keyword-difficulty-scorer');
                const difficulty = await scoreKeywordDifficulty(topic, { 
                    useRealSERP: true,
                    targetAuthority: 15 // Your current DA (update as you grow)
                });
                difficultyScore = difficulty.difficulty;
                logFn(`   🎯 Keyword Difficulty: ${difficulty.level} (${difficultyScore}/100)`);
                logFn(`   💡 ${difficulty.recommendation}`);
            } catch (diffError) {
                logFn('   ⚠️ Difficulty scoring unavailable, using default.');
            }
        } catch (e) {
            logFn('   ⚠️ Research failed, proceeding with standard generation.');
        }

        // 1. Generate Content
        logFn('1️⃣ Generating article with AI...');
        const rawResponse = await generateWithAI(topic, brief, logFn);
        
        let html = rawResponse;
        let aiImageKeywords = topic; 
        let aiTitle = null;
        let aiSeoTitle = null;
        let aiSeoDesc = null;
        let aiTags: string[] = [];

        try {
             // Attempt to parse JSON
             let cleanJson = rawResponse.trim();
             // Remove markdown fences if present
             cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '');
             
             const parsed = JSON.parse(cleanJson);
             if (parsed.content) {
                 html = parsed.content;
                 if (parsed.image_keywords) aiImageKeywords = parsed.image_keywords;
                 if (parsed.title) aiTitle = parsed.title;
                 if (parsed.seo_title) aiSeoTitle = parsed.seo_title;
                 if (parsed.seo_description) aiSeoDesc = parsed.seo_description;
                 if (parsed.tags && Array.isArray(parsed.tags)) aiTags = parsed.tags;
             }
        } catch (e) {
             logFn('   ⚠️ AI returned raw HTML/Text instead of JSON. Proceeding with raw content.');
        }

        logFn(`   ✅ Generated ${html.length} characters`);

        // 2. Extract Metadata
        logFn('2️⃣ Extracting SEO metadata...');
        const $ = cheerio.load(html);
        const h1 = $('h1').first().text().trim();
        const firstPara = $('p').first().text().trim();
        const title = aiTitle || h1 || topic; // Prefer AI title
        const slug = slugify(title, { lower: true, strict: true }) || 'article-' + Date.now();
        const excerpt = aiSeoDesc || firstPara.substring(0, 160) || 'Financial guide';
        const seoTitle = aiSeoTitle || title.substring(0, 60);
        
        logFn(`   ✅ Title: ${title}`);
        logFn(`   ✅ SEO Desc: ${excerpt}`);
        logFn(`   ✅ Slug: ${slug}`);

        // 3. Read Time
        const words = $.text().split(/\s+/).length;
        const readTime = Math.ceil(words / 200);
        logFn(`   ✅ Read time: ${readTime} minutes`);

        // 4. Classification
        logFn('4️⃣ Detecting classification...');
        // Merge AI tags with detected tags
        const detected = detectClassification(title, html);
        const category = detected.category;
        // Use Set to remove duplicates
        const tags = Array.from(new Set([...detected.tags, ...aiTags]));
        logFn(`   ✅ Category: ${category}`);
        logFn(`   ✅ Tags: ${tags.join(', ')}`);

        // 5. Image Generation
        logFn('5️⃣ Generating featured image...');
        logFn(`   📸 AI Keywords: "${aiImageKeywords}"`);
        // We still pass 'category' as context, but aiImageKeywords is the primary query
        const imageResult = await imageService.getFeaturedImage(aiImageKeywords, category);


        const imageUrl = imageResult.url;
        logFn(`   ✅ Image (${imageResult.source}): ${imageUrl}`);

        // 5b. Quality Verification
        logFn('5️⃣b Verifying content quality...');
        
        // Detailed quality analysis
        const qualityScore = analyzeContentQuality(html, title, topic);
        logFn(`   📊 Quality Score: ${qualityScore.overall}/100 (${qualityScore.grade.toUpperCase()})`);
        
        // Plagiarism check
        const uniquenessCheck = await checkPlagiarism(html, title);
        logFn(`   🔍 Uniqueness: ${uniquenessCheck.uniquenessScore}%`);

        if (!qualityScore.canPublish) {
            logFn(`   ⚠️ WARNING: Quality score below threshold (${qualityScore.overall}). Review recommended.`);
        }
        if (!uniquenessCheck.isUnique) {
            logFn(`   ⚠️ WARNING: Content similarity detected (${uniquenessCheck.similarityScore}%).`);
        }

        // Image SEO
        const imageSeo = generateImageAltText(title, category || 'finance');
        logFn(`   🖼️ Alt Text: "${imageSeo.altText}"`);

        // 5c. AI SEO & Shareable Assets
        const faqs = extractFAQsFromContent(html);
        logFn(`   🤖 Extracted ${faqs.length} FAQs for AI SEO`);
        
        // Calculate date for schema (needed before insert block)
        const schemaDate = new Date().toISOString();
        
        const schema = generateArticleSchema({
            headline: title,
            description: excerpt,
            image: imageUrl,
            datePublished: schemaDate,
            authorName: 'Vikram Mehta',
            url: `https://investingpro.in/articles/${slug}`,
            faq: faqs
        });
        
        // Simulate Shareable Assets
        const shareableAssets = {
            key_takeaways: { type: 'infographic', title: 'Key Takeaways', data_source: 'html-extract' },
            comparison_table: { type: 'data-viz', title: 'Comparison', data_source: 'html-extract' },
            quote_card: { type: 'social-card', title: 'Viral Quote', content: excerpt }
        };


        // 6. DB Insert
        logFn('6️⃣ Publishing to database...');
        const now = new Date().toISOString();
        const today = now.split('T')[0];

        // Fetch a valid author ID (System Admin)
        let authorId = null;
        try {
            // Try to get the first user from auth.users using Admin API
            const { data: { users }, error } = await getSupabaseClient().auth.admin.listUsers({ page: 1, perPage: 1 });
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
            
            meta_title: seoTitle,
            meta_description: excerpt,
            seo_title: seoTitle,
            seo_description: excerpt,

            category: category,
            tags: tags,
            read_time: readTime,
            featured_image: imageUrl,
            
            // Quality Metrics
            quality_score: qualityScore.overall,
            uniqueness_score: uniquenessCheck.uniquenessScore,
            seo_score: qualityScore.seo,
            readability_score: qualityScore.readability,
            image_alt_text: imageSeo.altText,
            is_verified_quality: qualityScore.canPublish,
            is_plagiarism_checked: true,
            
            // AI SEO & Assets
            schema_markup: schema,
            shareable_assets: shareableAssets,

            // NEW: Keyword difficulty tracking
            difficulty_score: difficultyScore,
            target_authority: 15, // Your current DA
            primary_keyword: topic,
            
            status: 'published', // AUTO-PUBLISH for one-click generator
            published_at: now,
            published_date: today,
            
            ai_generated: true,
            author_name: 'AI Editor',
        };

        // Only add author_id if we found one, otherwise leave it undefined (to try NULL or Default)
        if (authorId) {
            insertPayload.author_id = authorId;
        }
        
        // DRY RUN CHECK
        if (dryRun) {
            logFn('🛑 Dry Run: Skipping DB Insert. Returning Payload.');
            return insertPayload;
        }

        const { data: article, error } = await getSupabaseClient()
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
