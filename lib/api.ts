import { createClient } from "@/lib/supabase/client";
import { articleService } from "@/lib/cms/article-service";
import OpenAI from "openai";
import Groq from "groq-sdk";
import { Mistral } from "@mistralai/mistralai";
import { logger } from "@/lib/logger";
import {
    validateAIContent,
    calculateConfidence,
    createChangeLog,
    generateSystemPrompt,
    type AIDataSource,
    type AIContentMetadata,
    ALLOWED_AI_OPERATIONS,
    FORBIDDEN_AI_OPERATIONS
} from "@/lib/ai/constraints";

// Helper to get a fresh Supabase client with current session
function getSupabaseClient() {
    return createClient();
}

const supabase = getSupabaseClient(); // Helper for non-service entities

// Initialize AI providers
const openai = typeof window === 'undefined' && process.env.OPENAI_API_KEY 
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

const groq = typeof window === 'undefined' && process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

const mistral = typeof window === 'undefined' && process.env.MISTRAL_API_KEY
    ? new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
    : null;

// FOOLPROOF AI ENGINE: Circuit Breaker & Health Tracking
interface ProviderHealth {
    status: 'healthy' | 'degraded' | 'failing';
    lastError?: string;
    lastFailureTime?: number;
    failureCount: number;
}

const providerHealth: Record<string, ProviderHealth> = {
    gemini: { status: 'healthy', failureCount: 0 },
    openai: { status: 'healthy', failureCount: 0 },
    groq: { status: 'healthy', failureCount: 0 },
    mistral: { status: 'healthy', failureCount: 0 }
};

const CIRCUIT_BREAKER_THRESHOLD = 3;
const COOLDOWN_PERIOD = 10 * 60 * 1000; // 10 minutes

// Auto-correction thresholds
const MAX_RETRIES = 3;
const QUALITY_THRESHOLD = 70; // Minimum quality score
const PLAGIARISM_THRESHOLD = 50; // FIXED: Increased from 30% - more realistic for financial contents

// Local cache to avoid DB hits on every check
let lastHealthSync = 0;
const HEALTH_SYNC_INTERVAL = 30 * 1000; // 30 seconds

async function syncHealthFromDB() {
    if (typeof window !== 'undefined') return; // Only on server
    if (Date.now() - lastHealthSync < HEALTH_SYNC_INTERVAL) return;

    try {
        const { data, error } = await supabase
            .from('ai_provider_health')
            .select('*');

        if (data && !error) {
            data.forEach((p: any) => {
                providerHealth[p.provider_name] = {
                    status: p.status as any,
                    failureCount: p.failure_count,
                    lastError: p.last_error,
                    lastFailureTime: p.last_failure_time ? new Date(p.last_failure_time).getTime() : undefined
                };
            });
            lastHealthSync = Date.now();
        }
    } catch (e) {
        console.warn('Failed to sync AI health from DB:', e);
    }
}

function checkHealth(name: string): boolean {
    const health = providerHealth[name];
    if (health.status === 'healthy') return true;
    
    // Check if cooldown period is over
    if (health.lastFailureTime && Date.now() - health.lastFailureTime > COOLDOWN_PERIOD) {
        health.status = 'healthy';
        health.failureCount = 0;
        return true;
    }
    return false;
}

async function reportFailure(name: string, error: string) {
    const health = providerHealth[name];
    health.failureCount++;
    health.lastError = error;
    health.lastFailureTime = Date.now();
    
    if (health.failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
        health.status = 'degraded';
        logger.error(`CIRCUIT BREAKER: Provider ${name} marked as DEGRADED due to repeated failures.`, new Error(error));
    }

    // Persist to DB
    if (typeof window === 'undefined') {
        await supabase.from('ai_provider_health').upsert({
            provider_name: name,
            status: health.status,
            last_error: error,
            last_failure_time: new Date(health.lastFailureTime).toISOString(),
            failure_count: health.failureCount,
            updated_at: new Date().toISOString()
        });
    }
}

async function reportSuccess(name: string) {
    const health = providerHealth[name];
    const wasDegraded = health.status !== 'healthy';
    health.failureCount = 0;
    health.status = 'healthy';

    // Persist to DB if state changed
    if (wasDegraded && typeof window === 'undefined') {
        await supabase.from('ai_provider_health').upsert({
            provider_name: name,
            status: 'healthy',
            failure_count: 0,
            updated_at: new Date().toISOString()
        });
    }
}

/**
 * Deep extraction for JSON if parsing fails
 */
function extractJSON(text: string): any {
    try {
        return JSON.parse(text);
    } catch (e) {
        // Try to find JSON block
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (e2) {
                // Last ditch: try to fix common JSON errors (like trailing commas)
                const fixed = match[0].replace(/,\s*\}/g, '}').replace(/,\s*\]/g, ']');
                try {
                    return JSON.parse(fixed);
                } catch (e3) {
                    throw new Error("Could not extract valid JSON from AI response");
                }
            }
        }
        throw e;
    }
}

/**
 * InvestingPro Unified API Service
 * 
 * CENTRALIZED FACADE for all domain services.
 * 
 * ARCHITECTURE NOTE:
 * This file is a WRAPPER. It delegates actual business logic to:
 * - lib/cms/article-service.ts (Content)
 * - lib/pipeline/* (Automation)
 * 
 * DO NOT write raw logic here. Delegate.
 */
export const api = {
    auth: {
        me: async () => {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;
            
            // Fetch public profile data
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
                
            return profile ? { ...user, ...profile } : user;
        },
        signOut: async () => {
            const supabase = getSupabaseClient();
            return await supabase.auth.signOut();
        }
    },
    integrations: {
        Core: {
            /**
             * AI Support Tool - Draft Generation Only
             * 
             * STRICT LIMITATIONS:
             * - Only for drafting summaries from verified data
             * - Must include citations to source data
             * - Human review is MANDATORY before publication
             * - NO financial advice or recommendations
             * - Informational language only
             */
            InvokeLLM: async ({ 
                prompt, 
                contextData, 
                citations,
                operation = 'general',
                dataSources = []
            }: { 
                prompt: string;
                contextData?: any; 
                citations?: string[]; 
                operation?: string;
                dataSources?: AIDataSource[];
            }) => {
                if (FORBIDDEN_AI_OPERATIONS.includes(operation)) {
                    throw new Error(`Operation "${operation}" is forbidden.`);
                }
                const systemPrompt = generateSystemPrompt(operation);
                const enhancedPrompt = contextData 
                    ? `${prompt}\n\nVerified Data:\n${JSON.stringify(contextData, null, 2)}`
                    : prompt;

                // Sync health from DB once at start of operation
                await syncHealthFromDB();

                // 1. Try OpenAI (PRIMARY - User has $10 credit)
                if (openai && checkHealth('openai')) {
                    try {
                        const response = await openai.chat.completions.create({
                            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: enhancedPrompt }
                            ],
                            response_format: { type: "json_object" },
                            temperature: 0.3,
                            max_tokens: 4000  // FIXED: Increased from 2000 to allow 2,500-3,000 word articles
                        });

                        const content = response.choices[0]?.message?.content;
                        if (content) {
                            const parsed = extractJSON(content);
                            reportSuccess('openai');
                            const validation = validateAIContent(parsed.content || '', operation);
                            return { ...parsed, validation_warnings: validation.errors, is_draft: true, provider: 'openai' };
                        }
                    } catch (error: any) {
                        reportFailure('openai', error.message);
                    }
                }

                // 2. Try Google Gemini (Fallback)
                const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
                if (geminiKey && checkHealth('gemini')) {
                    try {
                        const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
                        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${geminiKey}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{ 
                                    role: 'user', 
                                    parts: [{ text: `${systemPrompt}\n\n${enhancedPrompt}` }] 
                                }],
                                generationConfig: { 
                                    temperature: 0.3
                                    // FIXED: Removed response_mime_type - causing compatibility issues
                                }
                            })
                        });

                        if (geminiResponse.ok) {
                            const data = await geminiResponse.json();
                            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {
                                let cleanText = text.trim();
                                if (cleanText.startsWith('```')) {
                                    cleanText = cleanText.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
                                }
                                const parsed = extractJSON(cleanText);
                                reportSuccess('gemini');
                                const validation = validateAIContent(parsed.content || '', operation);
                                return { ...parsed, validation_warnings: validation.errors, is_draft: true, provider: 'gemini', content: parsed.content || cleanText };
                            }
                        } else {
                            const errorData = await geminiResponse.json();
                            reportFailure('gemini', errorData.error?.message || 'Unknown Error');
                        }
                    } catch (e: any) {
                        reportFailure('gemini', e.message);
                    }
                }

                // 3. Try Groq (Llama 3)
                if (groq && checkHealth('groq')) {
                    try {
                        const completion = await groq.chat.completions.create({
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: enhancedPrompt }
                            ],
                            model: "llama-3.3-70b-versatile",
                            temperature: 0.3,
                            max_tokens: 2000,
                            response_format: { type: "json_object" }
                        });

                        const content = completion.choices[0]?.message?.content;
                        if (content) {
                            const parsed = extractJSON(content);
                            reportSuccess('groq');
                            return { ...parsed, is_draft: true, provider: 'groq' };
                        }
                    } catch (error: any) {
                        reportFailure('groq', error.message);
                    }
                }

                // 4. Try Mistral
                if (mistral && checkHealth('mistral')) {
                    try {
                        const response = await mistral.chat.complete({
                            model: "mistral-small-latest",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: enhancedPrompt }
                            ],
                            responseFormat: { type: "json_object" }
                        });

                        const content = response.choices?.[0]?.message?.content;
                        if (typeof content === 'string') {
                            const parsed = extractJSON(content);
                            reportSuccess('mistral');
                            return { ...parsed, is_draft: true, provider: 'mistral' };
                        }
                    } catch (error: any) {
                        reportFailure('mistral', error.message);
                    }
                }

                // FINAL FOOLPROOF SAFETY: If everything fails, return a High-Quality HUMAN-READY outline
                // This prevents the "Nothing happened" experience
                const confidence = calculateConfidence(dataSources);
                return {
                    title: `Outline: ${enhancedPrompt.substring(0, 50)}...`,
                    content: `
# AI Generation Status: Offline
**The system is currently and safely in Failover Mode.** 

The AI was unable to reach a provider, so we've generated this professional outline for you to begin your work:

## 1. Introduction
- Define the core problem for Indian investors.
- Current market context (2026).

## 2. Key Strategies
- [Insert Key Strategy 1]
- [Insert Key Strategy 2]
- [Insert Analysis]

## 3. Comparison Table
| Feature | Option A | Option B |
|---------|----------|----------|
| Returns | TBD      | TBD      |
| Risk    | TBD      | TBD      |

## 4. Conclusion & Steps
- Summary of findings.
- Next steps for the reader.

---
*Note: This is a generated wireframe because all 4 AI providers are currently experiencing technical difficulties or rate limits.*
                    `,
                    confidence,
                    is_draft: true,
                    provider: 'failover-outline'
                };
            },
            UploadFile: async ({ file }: { file: File }) => {
                const supabase = getSupabaseClient();
                
                // 1. Generate unique file name
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
                const filePath = `uploads/${fileName}`;

                // 2. Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('media')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    logger.error(`Supabase Storage Upload Error: ${uploadError.message}`, uploadError);
                    throw new Error(`Upload failed: ${uploadError.message}`);
                }

                // 3. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('media')
                    .getPublicUrl(filePath);

                // 4. Register in public.media table for gallery management
                try {
                    // Get current user if possible
                    const { data: { user } } = await supabase.auth.getUser();
                    
                    await supabase.from('media').insert({
                        filename: fileName,
                        original_filename: file.name,
                        file_path: filePath,
                        public_url: publicUrl,
                        mime_type: file.type,
                        file_size: file.size,
                        folder: 'uploads',
                        uploaded_by: user?.id || null
                    });
                } catch (dbError) {
                    // Log but don't fail the upload just because DB registration failed
                    logger.warn('Media registered in Storage but failed to record in DB table.');
                }

                return {
                    file_url: publicUrl,
                    file_path: filePath
                };
            },

            getAIHealth: () => {
                return providerHealth;
            }
        }
    },
    entities: {
        Assets: {
            list: async (category?: string) => {
                let query = supabase.from('assets').select('*');
                if (category) query = query.eq('category', category);
                const { data } = await query;
                return data || [];
            },
            getBySlug: async (slug: string) => {
                const { data } = await supabase.from('assets').select('*').eq('slug', slug).single();
                return data;
            },
            search: async (term: string) => {
                const { data } = await supabase.from('assets').select('*').ilike('name', `%${term}%`).limit(10);
                return data || [];
            }
        },
        
        // REFACTORED: Delegates to ArticleService
        Article: {
            list: async (order?: string, limit?: number) => {
                // Maps to service method
                return await articleService.listArticles(limit);
            },
            getById: async (id: string) => {
                return await articleService.getById(id);
            },
            getBySlug: async (slug: string) => {
                return await articleService.getBySlug(slug);
            },
            filter: async (filters: any) => {
                // Basic implementation wrapping the service or direct query if service lacks granular filter
                // Ideally ArticleService should support filters. For now, we fallback to direct query ONLY for complex filters
                // BUT we ensure we normalize the output
                const supabase = getSupabaseClient();
                let query = supabase.from('articles').select('*');
                Object.entries(filters).forEach(([key, value]) => { 
                    if (value !== undefined && value !== null) query = query.eq(key, value);
                });
                const { data } = await query;
                return data || [];
            },
            // UNIFIED: Use Service for updates
            update: async (id: string, data: any) => {
                // Separate metadata from content
                const { body_markdown, body_html, content, ...metadata } = data;
                
                // If content is present, use it. Otherwise just metadata.
                const articleContent = {
                    body_markdown: body_markdown || content || '',
                    body_html: body_html || '',
                    content: content || ''
                };

                if (data.status === 'published') {
                    return await articleService.publishArticle(id, articleContent, metadata);
                } else {
                    return await articleService.saveArticle(id, articleContent, metadata);
                }
            },
            // UNIFIED: Use Service for creation
            create: async (data: any) => {
                 const { body_markdown, body_html, content, ...metadata } = data;
                 const articleContent = {
                    body_markdown: body_markdown || content || '',
                    body_html: body_html || '',
                    content: content || ''
                };
                return await articleService.createArticle(articleContent, metadata);
            }
        },

        // Legacy entities (to be refactored in Phase 3/4)
        MutualFund: {
            list: async (options: { 
                page?: number; 
                limit?: number; 
                categoryType?: string;
                subCategory?: string;
                sortBy?: string;
                searchTerm?: string;
            } = {}) => {
                const { page = 1, limit = 10, categoryType, subCategory, sortBy, searchTerm } = options;
                const from = (page - 1) * limit;
                const to = from + limit - 1;

                let query = supabase
                    .from('products')
                    .select('*', { count: 'exact' })
                    .eq('category', 'mutual_fund');
                
                if (categoryType && categoryType !== 'All') {
                    query = query.filter('features->>category', 'eq', categoryType);
                }

                if (subCategory && subCategory !== 'All') {
                    query = query.filter('features->>sub_category', 'eq', subCategory);
                }

                if (searchTerm) {
                    query = query.ilike('name', `%${searchTerm}%`);
                }

                if (sortBy) {
                    const [column, order] = sortBy.split(':');
                    const isAscending = order === 'asc';
                    
                    if (column.startsWith('returns_')) {
                        // Cast JSONB property to float for correct numeric sorting
                        query = query.order(`features->>${column}`, { ascending: isAscending });
                    } else {
                        query = query.order(column, { ascending: isAscending });
                    }
                } else {
                    query = query.order('rating', { ascending: false });
                }

                const { data, count, error } = await query.range(from, to);
                
                if (error) {
                    logger.error('Error fetching mutual funds from Supabase', error);
                    return { data: [], count: 0 };
                }

                return { data: data || [], count: count || 0 };
            },
            getById: async (id: string) => {
                const supabase = getSupabaseClient();
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !data) return undefined;

                const p = data;
                const f = p.features || {};
                
                // Normalize to UI structure
                return {
                    id: p.slug || p.id,
                    name: p.name,
                    category: f.sub_category || 'Large Cap',
                    type: f.category || 'Equity',
                    aum: f.aum_crores ? `₹${f.aum_crores} Cr` : 'N/A',
                    returns_1y: parseFloat(f.returns_1y || '0'),
                    returns_3y: parseFloat(f.returns_3y || '0'),
                    returns_5y: parseFloat(f.returns_5y || '0'),
                    rating: p.rating || 4,
                    risk: f.risk_level || 'Moderate',
                    expense_ratio: parseFloat(f.expense_ratio || '0'),
                    min_investment: f.min_sip ? `₹${f.min_sip}` : '₹500',
                    fund_house: p.provider_name,
                    provider: p.provider_name,
                    risk_level: f.risk_level || 'moderate'
                };
            },
            filter: async (filters: any) => {
               // ... kept for compatibility but the list() method is now preferred
               return [];
            }
        },


        CreditCard: {
             list: async () => {
                const { data } = await supabase.from('products').select('*').eq('category', 'credit_card');
                return data || [];
            },
            filter: async (filters: any) => { return []; }
        },
        Loan: {
             list: async () => {
                const { data } = await supabase.from('products').select('*').eq('category', 'loan');
                return data || [];
            }
        },
        FixedDeposit: {
             list: async () => { return []; } // FDs usually not in products yet
        },
        Insurance: {
             list: async () => {
                const { data } = await supabase.from('products').select('*').eq('category', 'insurance');
                return data || [];
            }
        },
        Glossary: {
            list: async () => {
                const { data } = await supabase.from('glossary_terms').select('*').order('term', { ascending: true });
                return data || [];
            },
            search: async (term: string) => {
                const { data } = await supabase.from('glossary_terms').select('*')
                    .or(`term.ilike.%${term}%,definition.ilike.%${term}%`)
                    .order('term', { ascending: true });
                return data || [];
            }
        },
        AdPlacement: {
             list: async () => { return []; },
             filter: async (p:any) => { return []; },
             update: async (id:string, d:any) => { return true; }
        },
        Review: {
             list: async (order?: string, limit?: number) => { 
                const supabase = getSupabaseClient();
                let query = supabase.from('reviews').select('*');
                if (order) {
                    const ascending = !order.startsWith('-');
                    const col = order.replace('-', '');
                    query = query.order(col, { ascending });
                }
                if (limit) query = query.limit(limit);
                const { data } = await query;
                return data || [];
             },
             filter: async (filters: any) => { 
                const supabase = getSupabaseClient();
                 let query = supabase.from('reviews').select('*');
                 Object.entries(filters).forEach(([key, value]) => {
                     if (value !== undefined) query = query.eq(key, value);
                 });
                 const { data } = await query;
                 return data || [];
             },
             create: async (data: any) => { 
                 const supabase = getSupabaseClient();
                 const { data: res, error } = await supabase.from('reviews').insert(data).select().single();
                 if (error) throw error;
                 return res;
             },
             update: async (id: string, data: any) => {
                 const supabase = getSupabaseClient();
                 const { error } = await supabase.from('reviews').update(data).eq('id', id);
                 return !error;
             }
        },
        AffiliateProduct: {
              list: async (order?: string, limit?: number) => { 
                 const supabase = getSupabaseClient();
                 let query = supabase.from('products').select('*'); 
                 if (order) {
                     const ascending = !order.startsWith('-');
                     const col = order.replace('-', '');
                     query = query.order(col, { ascending });
                 }
                 if (limit) query = query.limit(limit);
                 const { data } = await query;
                 return data || [];
              },
              filter: async (filters: any) => {
                  const supabase = getSupabaseClient();
                  let query = supabase.from('products').select('*');
                  Object.entries(filters).forEach(([key, value]) => {
                      if (value !== undefined) query = query.eq(key, value);
                  });
                  const { data } = await query;
                  return data || [];
              },
              update: async (id: string, data: any) => { 
                  const supabase = getSupabaseClient();
                  const { error } = await supabase.from('products').update(data).eq('id', id);
                  return !error;
              }
        },
        AffiliateClick: {
            create: async () => { return null; },
            update: async () => { return null; }
        }
    }
};
