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
    
    **CONTENT DEPTH REQUIREMENTS (CRITICAL FOR SEO):**${brief ? `
    - **WORD COUNT**: ${brief.recommended_word_count || 1500}-${Math.ceil((brief.recommended_word_count || 1500) * 1.1)} words minimum (Based on competitor analysis: avg ${brief.avg_word_count} words)
    - **COMPETITIVE EDGE**: Your article MUST be ${Math.ceil((brief.recommended_word_count || 1500) - brief.avg_word_count)} words longer than top competitors to outrank them
    - ⚠️ **CRITICAL**: DO NOT write less than ${brief.recommended_word_count || 1500} words. This is a REQUIREMENT, not a suggestion.` : `
    - **WORD COUNT**: 1,500-2,000 words minimum (Standard for competitive keywords)
    - ⚠️ **CRITICAL**: DO NOT write less than 1,500 words. This is a REQUIREMENT, not a suggestion.`}
    - **SECTIONS**: 8-10 H2 sections with subsections (H3)
    - **TABLES**: Minimum 3-4 detailed comparison/data tables
    - **EXAMPLES**: 8-10 real-world examples with specific numbers
    - **EXTERNAL LINKS**: Link to 2-3 authoritative sources (RBI.org.in, SEBI.gov.in, AMFI.in, NSE/BSE)
    - **INTERNAL DEPTH**: Each section should have 200-250 words minimum (calculate: 8 sections × 200 words = 1,600+ words)
    
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
    2. **Viral Intro** (150-200 words): 
       - Start with a Hook (Problem/Stat).
       - Agitate the pain point.
       - Tease the solution (The "Open Loop").
    3. **"Quick Verdict" Box**: <div class="quick-verdict p-4 bg-blue-50 border-l-4 border-blue-500 my-6"><strong>⚡ Quick Verdict:</strong> [2-sentence summary for busy readers]</div>.
    4. **Deep Dive Content** (8-10 H2 sections, each 200-250 words): 
       - Use **PAS Framework** for each section
       - Include subsections (H3) for depth
       - Add specific examples with numbers in each section
    5. **Data Visualization**: Include at least 3-4 HTML <table> elements:
       - Comparison tables (e.g., SIP vs Lumpsum)
       - Fee/Cost structure tables
       - Returns scenario tables (5-year, 10-year, 20-year)
       - Fund/Product comparison tables
    6. **Checklist/Steps**: Use <ul> or <ol> with <strong>bold</strong> lead-ins.
    7. **Pro Tip Box** (2-3 throughout article): <div class="pro-tip p-4 bg-green-50 border-l-4 border-green-500 my-6"><strong>💡 Pro Tip:</strong> [Insider advice]</div>.
    8. **Warning Box** (1-2 throughout article): <div class="warning-box p-4 bg-red-50 border-l-4 border-red-500 my-6"><strong>⚠️ Warning:</strong> [Risk or Regulation to avoid]</div>.
    9. **FAQ Section** (8-10 questions): People actually ask (Use Schema.org style answers) with detailed responses.
    10. **External Authority Links**: Link to 2-3 official sources:
        - RBI circulars: <a href="https://rbi.org.in/...">RBI Source</a>
        - SEBI guidelines: <a href="https://sebi.gov.in/...">SEBI Guidelines</a>
        - AMFI data: <a href="https://amfiindia.com/...">AMFI Data</a>
    11. **Conclusion** (100-150 words): Don't summarize. Give a "Next Step" or Actionable Advice.

    FORMATTING RULES:
    - Return a VALID JSON Object: 
      { 
        "title": "Final Viral Title",
        "seo_title": "SEO Optimized Title (50-60 chars) - Must include keyword",
        "seo_description": "Compelling meta description (150-160 chars) designed for high CTR.",
        "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
        "content": "<h1>Title...</h1>...",
        "image_keywords": "SPECIFIC visual description for stock photo search. Example: 'indian woman checking mutual fund returns on mobile phone' or 'business growth chart rupee symbol rising'. NOT generic like 'abstract finance'."
      }
    - Use <table> for data (minimum 3-4 tables).
    - Use <strong> for emphasis (don't overdo it).
    - Ensure all monetary values use the Indian Rupee symbol (₹).
    - Keep paragraphs short (2-3 sentences max).${brief ? `
    - **TARGET WORD COUNT**: ${brief.recommended_word_count}+ words (This beats top ${brief.top_results.length} competitors averaging ${brief.avg_word_count} words)
    - ⚠️ VERIFY: Count words in your content section. If under ${brief.recommended_word_count}, ADD MORE sections/examples/tables until target is met.` : `
    - **TARGET WORD COUNT**: 1,500-2,000 words total
    - ⚠️ VERIFY: Count words in your content section. If under 1,500, ADD MORE sections/examples/tables until target is met.`}
    
    **BEFORE RETURNING**: Mentally count your sections and ensure you have:
    - At least 8-10 H2 sections
    - Each section has 200+ words
    - Total content is 1,500+ words
    - If not, EXPAND the content by adding more examples, tables, and detailed explanations.
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
    const { api } = await import('../api');
    
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

/**
 * Enhance research brief for uniqueness on retry attempts
 */
function enhanceForUniqueness(brief: ResearchBrief | undefined, attempt: number): ResearchBrief | undefined {
    if (!brief) return brief;

    const uniquenessPrompts = [
        "Focus on UNCOMMON examples and lesser-known insights",
        "Use ORIGINAL analogies and fresh perspectives",
        "Include UNIQUE data points not commonly cited",
    ];

    return {
        ...brief,
        unique_angle: `${brief.unique_angle}. ${uniquenessPrompts[attempt - 2] || uniquenessPrompts[2]}. CRITICAL: Avoid copying existing content structures.`,
        content_gaps: [
            ...brief.content_gaps,
            `Distinctive perspective (Attempt ${attempt})`,
        ],
    };
}

// Generate Article Function with Auto-Correction
// Core generation logic
export async function generateArticleCore(
    topic: string, 
    logFn: (msg: string) => void = console.log,
    options: { dryRun?: boolean; authorId?: string } | boolean = false // Backwards compatibility for boolean
): Promise<{ success: boolean; article?: any; error?: string; duration?: string; url?: string }> {
    const startTime = Date.now();
    
    // Handle old boolean signature (dryRun) vs new object signature
    const dryRun = typeof options === 'boolean' ? options : options?.dryRun;
    const authorId = typeof options === 'object' ? options?.authorId : undefined;
    // ============================================================================
    // STEP 0: CHECK FOR DUPLICATES FIRST (Prevents wasted API calls)
    // ============================================================================
    logFn('\n🔍 Checking for duplicate content...');
    
    try {
        const { checkForDuplicates } = await import('../quality/duplicate-detector');
        const category = 'mutual-funds'; // TODO: Pass as parameter
        const keywords = topic.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        
        const dupCheck = await checkForDuplicates(topic, keywords, category);
        
        if (dupCheck.recommendation === 'BLOCK') {
            logFn(`\n❌ BLOCKED: ${dupCheck.reason}`);
            if (dupCheck.similar_articles.length > 0) {
                logFn(`   Similar article: "${dupCheck.similar_articles[0].title}"`);
                logFn(`   Keyword overlap: ${dupCheck.keyword_overlap.toFixed(1)}%`);
            }
            logFn(`\n💡 Suggestion: Try a different angle or topic.\n`);
            throw new Error(`Duplicate content detected: ${dupCheck.reason}`);
        } else if (dupCheck.recommendation === 'WARN') {
            logFn(`⚠️  Warning: ${dupCheck.reason}`);
            logFn(`   Proceeding but ensure unique angle...`);
        } else {
            logFn(`✅ Content is unique - proceeding with generation`);
        }
    } catch (error: any) {
        if (error.message.includes('Duplicate content detected')) {
            throw error; // Re-throw if it's our duplicate error
        }
        // If duplicate-detector.ts doesn't exist yet, just log and continue
        logFn(`⚠️  Duplicate check failed: ${error.message}`);
        logFn(`   Proceeding with generation anyway...`);
    }
    
    // ============================================================================
    // GOOGLE-ALIGNED QUALITY THRESHOLDS (Updated from arbitrary values)
    // ============================================================================
    const MAX_RETRIES = 3;
    const QUALITY_THRESHOLD = 60;  // FIXED: Lowered from 70 - more realistic for financial content
    const PLAGIARISM_THRESHOLD = 30; // FIXED: Lowered from 50 - Google allows 15-30% for citations

    // Retry loop for auto-correction
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            if (attempt > 1) {
                logFn(`\n🔄 RETRY ATTEMPT ${attempt}/${MAX_RETRIES} - Regenerating for better quality/uniqueness...`);
            }

            // 0. Deep Research
            logFn('0️⃣ Performing Deep Research (SERP Analysis)...');
            let brief: ResearchBrief | undefined;
            let difficultyScore = 50; // Default medium difficulty
            try {
                // FIXED: Call serpAnalyzer directly (not .analyzeCompetitors)
                brief = await serpAnalyzer(topic);
                logFn(`   ✅ Identified ${brief.content_gaps.length} Content Gaps`);
                logFn(`   📊 Competitor Avg: ${brief.avg_word_count} words`);
                logFn(`   🎯 Target Word Count: ${brief.recommended_word_count}+ words`);
            
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

            // 1. Generate Content (with uniqueness enhancement on retries)
            logFn('1️⃣ Generating article with AI...');
            const enhancedBrief = attempt > 1 ? enhanceForUniqueness(brief, attempt) : brief;
            const rawResponse = await generateWithAI(topic, enhancedBrief, logFn);
        
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
        
        // Detailed quality analysis (FIXED: Added await)
        const qualityScore = await analyzeContentQuality(html, topic);
        logFn(`   📊 Quality Score: ${qualityScore.total_score}/100 (${qualityScore.grade})`);
        
        // Plagiarism check (FIXED: Corrected function call)
        const uniquenessCheck = await checkPlagiarism(html);
        logFn(`   🔍 Uniqueness: ${uniquenessCheck.unique_content_percentage}%`);

            // Quality gates with auto-correction logic
            const qualityFailed = qualityScore.total_score < QUALITY_THRESHOLD;
            const plagiarismFailed = uniquenessCheck.is_plagiarized && uniquenessCheck.similarity_percentage > PLAGIARISM_THRESHOLD;

            if (qualityFailed) {
                logFn(`   ⚠️ WARNING: Quality score below threshold (${qualityScore.total_score}/${QUALITY_THRESHOLD}).`);
            }
            if (plagiarismFailed) {
                logFn(`   ⚠️ WARNING: High plagiarism detected (${uniquenessCheck.similarity_percentage}% similarity).`);
            }

            // Auto-correction: Retry if quality or plagiarism failed and we have retries left
            if ((qualityFailed || plagiarismFailed) && attempt < MAX_RETRIES) {
                logFn(`   🔄 Auto-correction triggered. Regenerating article (attempt ${attempt + 1}/${MAX_RETRIES})...`);
                continue; // Skip to next iteration (retry)
            }

            // If we've exhausted retries, log final warning
            if ((qualityFailed || plagiarismFailed) && attempt === MAX_RETRIES) {
                logFn(`   🚨 FINAL WARNING: Quality/plagiarism issues remain after ${MAX_RETRIES} attempts.`);
                logFn(`   📝 Article will be saved as DRAFT for manual review.`);
            }

        // Image SEO (FIXED: Pass imageUrl instead of title)
        const imageSeo = await generateImageAltText(imageUrl, { 
            context: `${topic} - ${category || 'finance'}`,
            keyword: topic.split(' ').slice(0, 3).join(' ') // Use first 3 words as keyword
        });
        logFn(`   🖼️ Alt Text: "${imageSeo.alt_text}"`);

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


            // 6. Publishing Decision
            logFn('6️⃣ Publishing to database...');
            
            // Determine status based on quality/plagiarism
            const status = (qualityFailed || plagiarismFailed) ? 'draft' : 'published';
            const statusReason = qualityFailed 
                ? `Low quality score (${qualityScore.total_score}/${QUALITY_THRESHOLD})`
                : plagiarismFailed
                ? `High plagiarism (${uniquenessCheck.similarity_percentage}%)`
                : 'Passed quality checks';

            if (status === 'draft') {
                logFn(`   📝 Saving as DRAFT (${statusReason}) for manual review`);
            }
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
        const insertPayload = {
            title,
            slug,
            body_html: html,
            body_markdown: '', // Store as HTML for now
            content: html, // Keep content for full-text search if needed
            excerpt,
            meta_title: seoTitle,
            meta_description: excerpt,
            seo_title: seoTitle,
            seo_description: excerpt,
            category,
            tags,
            status, // 'draft' or 'published' based on quality
            read_time: readTime,
            featured_image: imageUrl,
            
            // Quality Metrics (FIXED: Using correct property names)
            quality_score: qualityScore.total_score,
            uniqueness_score: uniquenessCheck.unique_content_percentage,
            seo_score: qualityScore.seo_score,
            readability_score: qualityScore.readability_score,
            image_alt_text: imageSeo.alt_text,
            is_verified_quality: qualityScore.total_score >= 70 && !uniquenessCheck.is_plagiarized,
            is_plagiarism_checked: true,
            
            // AI SEO & Assets
            schema_markup: schema,
            shareable_assets: shareableAssets,

            // NEW: Keyword difficulty tracking
            difficulty_score: difficultyScore,
            target_authority: 15, // Your current DA
            primary_keyword: topic,
            
            published_at: now,
            published_date: today,
            
            ai_generated: true,
            author_name: 'AI Editor',
        };

        // Only add author_id if we found one
        if (authorId) {
            (insertPayload as any).author_id = authorId;
        }
        
        // DRY RUN CHECK
        if (dryRun) {
            logFn('🛑 Dry Run: Skipping DB Insert. Returning Payload.');
            return {
                success: true,
                article: insertPayload,
                duration: ((Date.now() - startTime) / 1000).toFixed(2)
            };
        }

        const { data: article, error } = await getSupabaseClient()
            .from('articles')
            .insert(insertPayload)
            .select()
            .single();

        if (error) {
            throw new Error(`Database error: ${error.message} (Detail: ${error?.details || ''})`);
        }

            // Log completion
            const statusIcon = status === 'published' ? '✅' : '📝';
            logFn(`   ${statusIcon} ${status.toUpperCase()} SUCCESSFULLY!`);
            logFn(`   ✅ Success! Article URL: /articles/${slug}`);
            
            // Break out of retry loop on success
            return {
                success: true,
                article: article,
                duration: ((Date.now() - startTime) / 1000).toFixed(2),
                url: `/articles/${slug}`
            };

        } catch (error: any) {
            logFn(`   ❌ Generation failed (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`);
            
            if (attempt === MAX_RETRIES) {
                // Re-throw on final attempt
                return {
                    success: false,
                    error: error.message,
                    duration: ((Date.now() - startTime) / 1000).toFixed(2)
                };
            }
            
            // Continue to next attempt
            logFn(`   🔄 Retrying...`);
        }
    }

    // If we get here, all retries failed (shouldn't happen but just in case)
    return {
        success: false,
        error: `Failed to generate quality article after ${MAX_RETRIES} attempts`,
        duration: ((Date.now() - startTime) / 1000).toFixed(2)
    };
}
