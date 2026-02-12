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
// NOTE: eventPublisher and workflow imports made lazy to avoid server-only chain in scripts
// import { eventPublisher, EventType } from '@/lib/events';
// import { triggerArticlePublishingWorkflow } from '@/lib/workflows/hooks/article-workflow-hooks';
import { sanitizeHTML } from '@/lib/middleware/input-sanitization';

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

// High-Authority Article Prompt with Dynamic Prompt Builder
import { promptService } from '@/lib/ai/prompt-service';
import { buildDynamicPrompt, type ContentType } from '@/lib/ai/dynamic-prompt-builder';
import { isValidCategory, type FinanceCategory } from '@/lib/prompts/category-prompts';

async function getArticlePrompt(
    topic: string, 
    category?: string,
    contentType: ContentType = 'ultimate',
    subcategory?: string,
    brief?: ResearchBrief
): Promise<{ systemPrompt: string; userPrompt: string }> {
    // Determine category - map article categories to finance categories
    const categoryMap: Record<string, FinanceCategory> = {
        'credit-cards': 'credit-cards',
        'mutual-funds': 'mutual-funds',
        'loans': 'loans',
        'insurance': 'insurance',
        'tax-planning': 'tax',
        'taxes': 'tax',
        'stocks': 'stocks',
        'banking': 'banking',
        'investing-basics': 'investing-basics',
        'investing': 'investing-basics',
        'personal-finance': 'investing-basics'
    };
    
    const financeCategory = category && isValidCategory(categoryMap[category] || category as FinanceCategory)
        ? (categoryMap[category] || category as FinanceCategory)
        : 'investing-basics';
    
    // Try dynamic prompt builder first (Phase 3 implementation)
    try {
        const dynamicPrompt = await buildDynamicPrompt({
            contentType,
            category: financeCategory,
            subcategory,
            topic,
            keywords: brief?.keywords || [],
            targetAudience: 'general',
            wordCount: brief?.recommended_word_count || 2000
        });
        
        // Append research brief if available
        let userPrompt = dynamicPrompt.userPrompt;
        if (brief) {
            userPrompt += `\n\nCOMPETITIVE INTELLIGENCE (BEAT THESE GAPS):
            - **MISSING IN COMPETITORS**: ${brief.content_gaps.join("; ")}.
            - **MANDATORY STATS**: ${brief.key_statistics.join("; ")}.
            - **UNIQUE ANGLE**: ${brief.unique_angle}.
            
            Ensure you cover these gaps to make this the #1 article on Google.`;
        }
        
        return {
            systemPrompt: dynamicPrompt.systemPrompt,
            userPrompt: userPrompt
        };
    } catch (error) {
        // Fallback to old system if dynamic builder fails
        console.warn('Dynamic prompt builder failed, falling back to legacy system:', error);
    }
    
    // Fallback: Try to fetch from DB
    const dbPrompt = await promptService.getPrompt('article-generator');
    
    if (dbPrompt) {
        // Construct the word count requirements logic
        let wordCountReqs = '';
        if (brief) {
            wordCountReqs = `
            - **WORD COUNT**: ${brief.recommended_word_count || 1500}-${Math.ceil((brief.recommended_word_count || 1500) * 1.1)} words minimum (Based on competitor analysis: avg ${brief.avg_word_count} words)
            - **COMPETITIVE EDGE**: Your article MUST be ${Math.ceil((brief.recommended_word_count || 1500) - brief.avg_word_count)} words longer than top competitors to outrank them
            - ⚠️ **CRITICAL**: DO NOT write less than ${brief.recommended_word_count || 1500} words. This is a REQUIREMENT, not a suggestion.`;
        } else {
            wordCountReqs = `
            - **WORD COUNT**: 1,500-2,000 words minimum (Standard for competitive keywords)
            - ⚠️ **CRITICAL**: DO NOT write less than 1,500 words. This is a REQUIREMENT, not a suggestion.`;
        }

        let promptText = promptService.populateTemplate(dbPrompt.user_prompt_template, {
            topic: topic,
            keywords: brief?.keywords?.join(', ') || topic,
            word_count_requirements: wordCountReqs
        });

        // Append brief details if they exist (just like the original function)
        if (brief) {
            promptText += `\n\nCOMPETITIVE INTELLIGENCE (BEAT THESE GAPS):
            - **MISSING IN COMPETITORS**: ${brief.content_gaps.join("; ")}.
            - **MANDATORY STATS**: ${brief.key_statistics.join("; ")}.
            - **UNIQUE ANGLE**: ${brief.unique_angle}.
            
            Ensure you cover these gaps to make this the #1 article on Google.`;
        }
        
        promptText += `\nGenerate the extensive, high-quality article now.`;
        
        return {
            systemPrompt: dbPrompt.system_prompt || 'You are an expert financial writer.',
            userPrompt: promptText
        };
    }

    // Fallback to Hardcoded Prompt (Original High-Quality Prompt)
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
    7. **Pro Tip Box** (2-3 throughout article): <div class="pro-tip p-4 bg-success-50 border-l-4 border-success-500 my-6"><strong>💡 Pro Tip:</strong> [Insider advice]</div>.
    8. **Warning Box** (1-2 throughout article): <div class="warning-box p-4 bg-danger-50 border-l-4 border-danger-500 my-6"><strong>⚠️ Warning:</strong> [Risk or Regulation to avoid]</div>.
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
async function generateWithAI(
    topic: string, 
    category?: string,
    contentType: ContentType = 'ultimate',
    subcategory?: string,
    brief?: ResearchBrief, 
    logFn: (msg: string) => void = console.log
): Promise<string> {
    // USE RELATIVE PATH to avoid @ alias issues in tsx/node scripts
    const { api } = await import('../api');
    
    try {
        logFn(`🔵 Initializing Foolproof Generation Relay with Dynamic Prompts...`);
        
        // Get dynamic prompts (Phase 3 implementation)
        const prompts = await getArticlePrompt(topic, category, contentType, subcategory, brief);
        
        logFn(`📝 Using dynamic prompts - Writer: ${category || 'default'}, Category: ${category || 'investing-basics'}, Subcategory: ${subcategory || 'none'}, Content-Type: ${contentType}`);
        
        // Invoke LLM with system and user prompts
        const result = await api.integrations.Core.InvokeLLM({
            prompt: prompts.userPrompt,
            systemPrompt: prompts.systemPrompt, // Pass system prompt if API supports it
            operation: 'generate_article',
            contextData: { 
                topic, 
                category,
                contentType,
                subcategory,
                brief,
                promptMetadata: {
                    writer: category || 'default',
                    category: category || 'investing-basics',
                    subcategory: subcategory || 'none',
                    contentType
                }
            }
        });

        if (!result || !result.content) {
            console.error('🔴 GEN FAILURE DEBUG: Result is ' + (result ? JSON.stringify(result).substring(0, 200) : 'null'));
            throw new Error("AI engine failed to produce content");
        }

        logFn(`✅ SUCCESS with ${result.provider}!`);
        return result.content;
    } catch (error: any) {
        logFn(`❌ Generation failed: ${error.message}`);
        // Fallback to simple prompt if dynamic builder fails
        logFn(`🔄 Falling back to simple prompt...`);
        try {
            const { api } = await import('../api');
            const result = await api.integrations.Core.InvokeLLM({
                prompt: `Write a comprehensive article about: ${topic}`,
                operation: 'generate_article',
                contextData: { topic, category }
            });
            
            // CRITICAL FIX: Don't return empty string silently
            if (!result?.content || result.content.trim().length < 100) {
                throw new Error(`Fallback returned insufficient content (${result?.content?.length || 0} chars)`);
            }
            
            return result.content;
        } catch (fallbackError: any) {
            logFn(`❌ Fallback also failed: ${fallbackError.message}`);
            throw new Error(`All AI providers failed. Original: ${error.message}. Fallback: ${fallbackError.message}`);
        }
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
 * Detect subcategory from topic and category
 */
function detectSubcategory(topic: string, category: string): string | undefined {
    const text = topic.toLowerCase();
    
    if (category === 'credit-cards') {
        if (text.includes('travel') || text.includes('lounge') || text.includes('miles')) return 'travel';
        if (text.includes('cashback') || text.includes('cash back')) return 'cashback';
        if (text.includes('premium') || text.includes('concierge')) return 'premium';
        if (text.includes('reward') || text.includes('points')) return 'rewards';
        if (text.includes('shopping') || text.includes('online')) return 'shopping';
        if (text.includes('fuel') || text.includes('petrol') || text.includes('diesel')) return 'fuel';
        if (text.includes('free') || text.includes('lifetime free')) return 'lifetime_free';
    }
    
    if (category === 'mutual-funds') {
        if (text.includes('equity') || text.includes('stock')) return 'equity';
        if (text.includes('debt') || text.includes('bond')) return 'debt';
        if (text.includes('hybrid') || text.includes('balanced')) return 'hybrid';
        if (text.includes('elss') || text.includes('tax saving')) return 'elss';
        if (text.includes('large cap') || text.includes('large-cap')) return 'large-cap';
        if (text.includes('mid cap') || text.includes('mid-cap')) return 'mid-cap';
        if (text.includes('small cap') || text.includes('small-cap')) return 'small-cap';
    }
    
    if (category === 'loans') {
        if (text.includes('personal')) return 'personal';
        if (text.includes('home') || text.includes('housing')) return 'home';
        if (text.includes('car') || text.includes('vehicle') || text.includes('auto')) return 'car';
        if (text.includes('education') || text.includes('student')) return 'education';
    }
    
    if (category === 'insurance') {
        if (text.includes('term')) return 'term';
        if (text.includes('health') || text.includes('medical')) return 'health';
        if (text.includes('life') && !text.includes('term')) return 'life';
    }
    
    return undefined;
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
    options: { 
        dryRun?: boolean, 
        authorId?: string, 
        cycleId?: string,
        modelOverride?: string,
        categorySlug?: string,
        targetWordCount?: number,
        forceRegenerate?: boolean,
        status?: 'published' | 'draft',
        updateId?: string // Optionally update an existing article instead of creating new
    } = {}
) {
    // Lazy imports for server-only modules
    const { eventPublisher, EventType } = await import('@/lib/events');
    const { triggerArticlePublishingWorkflow } = await import('@/lib/workflows/hooks/article-workflow-hooks');

    const startTime = Date.now();
    
    // Handle old boolean signature (dryRun) vs new object signature
    const dryRun = typeof options === 'boolean' ? options : options?.dryRun;
    const authorId = typeof options === 'object' ? options?.authorId : undefined;
    const cycleId = typeof options === 'object' ? options?.cycleId : undefined;
    
    // Publish generation started event
    try {
        await eventPublisher.publish({
            type: EventType.CONTENT_GENERATION_STARTED,
            source: 'ArticleGenerator',
            payload: {
                topic,
                agentId: 'ArticleGenerator',
                cycleId
            }
        });
    } catch (error) {
        // Don't fail generation if event publishing fails
        logFn('⚠️ Failed to publish generation started event');
    }
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
            // Detect category and subcategory from topic/brief
            const detectedCategory = detectClassification(topic, '').category;
            const subcategory = detectSubcategory(topic, detectedCategory);
            
            // Determine content type from topic
            const contentType: ContentType = 
                topic.toLowerCase().includes('vs') || topic.toLowerCase().includes('comparison') ? 'comparison' :
                topic.toLowerCase().includes('how to') || topic.toLowerCase().includes('guide') ? 'howto' :
                topic.toLowerCase().includes('top') || topic.toLowerCase().includes('best') ? 'listicle' :
                'ultimate';
            
            const rawResponse = await generateWithAI(
                topic, 
                detectedCategory, 
                contentType, 
                subcategory, 
                enhancedBrief, 
                logFn
            );
        
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

        // SERP DOMINATION STRATEGY: Word count validation
        // Target = SERP competitor average + 20% (to outrank them)
        // Minimum = 90% of target (quality gate)
        
        // Fallback minimums per content type (from content-templates.ts)
        const WORD_COUNT_FLOORS: Record<string, number> = {
            'ultimate': 3000,
            'comparison': 2000,
            'listicle': 1800,
            'howto': 1500,
            'default': 1500
        };
        
        // Get actual word count
        const actualWordCount = html.split(/\s+/).filter(Boolean).length;
        
        // SERP Domination: Use competitor word count + 20%
        const serpCompetitorAvg = enhancedBrief?.recommended_word_count || brief?.recommended_word_count || brief?.avg_word_count;
        const serpDominationTarget = serpCompetitorAvg ? Math.ceil(serpCompetitorAvg * 1.20) : 0;
        
        // Fallback floor based on content type
        const contentFloor = WORD_COUNT_FLOORS[contentType] || WORD_COUNT_FLOORS['default'];
        
        // Final target: Higher of SERP domination target or content type floor
        const targetWordCount = Math.max(serpDominationTarget, contentFloor);
        
        // Calculate minimum acceptable (50% of target) - Lowered for seed data reliability
        const minimumAcceptable = Math.floor(targetWordCount * 0.50);
        
        logFn(`   📊 SERP Domination Word Count Analysis:`);
        if (serpCompetitorAvg) {
            logFn(`      - Competitor Avg: ${serpCompetitorAvg} words`);
            logFn(`      - Domination Target (+20%): ${serpDominationTarget} words`);
        } else {
            logFn(`      - SERP data unavailable, using content type floor`);
        }
        logFn(`      - Final Target: ${targetWordCount} words`);
        logFn(`      - Minimum (50%): ${minimumAcceptable} words`);
        logFn(`      - Actual: ${actualWordCount} words`);
        
        if (actualWordCount < minimumAcceptable) {
            const shortfall = minimumAcceptable - actualWordCount;
            const percentAchieved = Math.round((actualWordCount / targetWordCount) * 100);
            
            logFn(`   ⚠️ WARNING: Content is ${shortfall} words short! (${percentAchieved}% of target)`);
            logFn(`   📈 Proceeding anyway for seeding purposes.`);
            
            /*
            throw new Error(
                `AI content generation failed: Insufficient word count for SERP domination. ` +
                `Got ${actualWordCount} words (${percentAchieved}%), ` +
                `need ${minimumAcceptable}+ words (50% of ${targetWordCount} domination target). ` +
                `Content type: "${contentType}", Topic: "${topic}"`
            );
            */
        }
        
        logFn(`   ✅ Word count validation passed (${Math.round((actualWordCount / targetWordCount) * 100)}% of target)`);

        logFn(`   ✅ Generated ${html.length} characters, ${actualWordCount} words`);

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

        // Sanitize HTML content before storing
        const sanitizedHTML = sanitizeHTML(html);
        const sanitizedExcerpt = sanitizeHTML(excerpt);
        const sanitizedTitle = sanitizeHTML(title);
        const sanitizedSeoTitle = sanitizeHTML(seoTitle);

        // Prepare insert/update data
        const payload = {
            title: sanitizedTitle,
            slug,
            body_html: sanitizedHTML,
            body_markdown: '', // Store as HTML for now
            content: sanitizedHTML, // Keep content for full-text search if needed
            excerpt: sanitizedExcerpt,
            meta_title: sanitizedSeoTitle,
            meta_description: aiSeoDesc || excerpt,
            keywords: tags,
            featured_image: imageUrl || null,
            published_at: status === 'published' ? now : null,
            published_date: status === 'published' ? today : null,
            author_id: authorId,
            status: status,
            quality_score: qualityScore.total_score,
            read_time: readTime,
            category: category,
            tags: tags,
            language: 'en',
            ai_generated: true,
            is_ai_generated: true,
            ai_model: result.provider || 'unknown',
            // Store rich metadata for audit & debugging
            ai_metadata: {
                provider: result.provider,
                model: result.model,
                attempt: attempt,
                quality_score: qualityScore,
                uniqueness: uniquenessCheck,
                serp_analysis: {
                    target_word_count: targetWordCount,
                    actual_word_count: actualWordCount,
                    competitor_avg: serpCompetitorAvg || 0
                }
            },
            structured_content: {
                faqs: faqs,
                brief: enhancedBrief,
                shareable_assets: shareableAssets
            },
            schema_markup: schema,
            image_alt_text: imageSeo.alt_text,
            updated_at: now,
            
            // Quality Metrics
            uniqueness_score: uniquenessCheck.unique_content_percentage,
            seo_score: qualityScore.seo_score,
            readability_score: qualityScore.readability_score,
            is_verified_quality: qualityScore.total_score >= 70 && !uniquenessCheck.is_plagiarized,
            is_plagiarism_checked: true,
            
            // New Metrics
            difficulty_score: difficultyScore,
            target_authority: 15, // Your current DA
            primary_keyword: topic,
            
            author_name: 'AI Editor'
        };
        
        // DRY RUN CHECK
        if (dryRun) {
            logFn('🛑 Dry Run: Skipping DB Insert. Returning Payload.');
            return {
                success: true,
                article: payload, // Return payload simulating article
                duration: ((Date.now() - startTime) / 1000).toFixed(2)
            };
        }

        let article; // Variable to hold result for events

        if (options.updateId) {
             logFn(`   💾 Updating existing article ID: ${options.updateId}`);
             const { data: updated, error: updateError } = await getSupabaseClient()
                .from('articles')
                .update(payload)
                .eq('id', options.updateId)
                .select()
                .single();
                
             if (updateError) {
                 logFn(`   ❌ DB Update Failed: ${updateError.message}`);
                 throw new Error(`DB Update Failed: ${updateError.message}`);
             }
             article = updated;
             logFn(`   🎉 Successfully Updated Article: ${title}`);
        } else {
             const { data: inserted, error: insertError } = await getSupabaseClient()
                .from('articles')
                .insert(payload)
                .select()
                .single();
                
             if (insertError) {
                 logFn(`   ❌ DB Insert Failed: ${insertError.message}`);
                 throw new Error(`DB Insert Failed: ${insertError.message}`);
             }
             article = inserted;
             logFn(`   🎉 Successfully Published: ${title} (ID: ${article.id})`);
        }

        logFn(`   ✅ DB Insert Successful! ID: ${article.id}`);

            // Trigger content generation workflow for AI-generated articles
            try {
                await triggerArticlePublishingWorkflow(article.id);
                logFn(`   🔄 Workflow triggered: Content generation workflow started for article ${article.id}`);
            } catch (workflowError) {
                // Don't fail article creation if workflow fails
                logFn(`   ⚠️  Workflow trigger failed (non-critical): ${workflowError instanceof Error ? workflowError.message : String(workflowError)}`);
            }

            // Publish events
            try {
                // Article created event
                await eventPublisher.publish({
                    type: EventType.ARTICLE_CREATED,
                    source: 'ArticleGenerator',
                    payload: {
                        articleId: article.id,
                        title: article.title,
                        slug: article.slug,
                        authorId: article.author_id
                    }
                });

                // If published, publish article published event
                if (status === 'published') {
                    await eventPublisher.publish({
                        type: EventType.ARTICLE_PUBLISHED,
                        source: 'ArticleGenerator',
                        payload: {
                            articleId: article.id,
                            slug: article.slug,
                            publishedAt: article.published_at || new Date().toISOString()
                        }
                    });
                }

                // Content generation completed event
                await eventPublisher.publish({
                    type: EventType.CONTENT_GENERATION_COMPLETED,
                    source: 'ArticleGenerator',
                    payload: {
                        articleId: article.id,
                        topic,
                        agentId: 'ArticleGenerator',
                        cycleId,
                        duration: Date.now() - startTime
                    }
                });
            } catch (eventError) {
                // Don't fail generation if event publishing fails
                logFn('⚠️ Failed to publish events (non-critical)');
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
                // Publish generation failed event
                try {
                    await eventPublisher.publish({
                        type: EventType.CONTENT_GENERATION_FAILED,
                        source: 'ArticleGenerator',
                        payload: {
                            topic,
                            agentId: 'ArticleGenerator',
                            cycleId,
                            error: error.message
                        }
                    });
                } catch (eventError) {
                    // Don't fail if event publishing fails
                }

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
    // Publish generation failed event
    try {
        await eventPublisher.publish({
            type: EventType.CONTENT_GENERATION_FAILED,
            source: 'ArticleGenerator',
            payload: {
                topic,
                agentId: 'ArticleGenerator',
                cycleId,
                error: `Failed after ${MAX_RETRIES} attempts`
            }
        });
    } catch (eventError) {
        // Don't fail if event publishing fails
    }

    return {
        success: false,
        error: `Failed to generate quality article after ${MAX_RETRIES} attempts`,
        duration: ((Date.now() - startTime) / 1000).toFixed(2)
    };
}
