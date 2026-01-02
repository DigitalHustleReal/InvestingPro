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

function reportFailure(name: string, error: string) {
    const health = providerHealth[name];
    health.failureCount++;
    health.lastError = error;
    health.lastFailureTime = Date.now();
    
    if (health.failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
        health.status = 'degraded';
        logger.error(`CIRCUIT BREAKER: Provider ${name} marked as DEGRADED due to repeated failures.`, new Error(error));
    }
}

function reportSuccess(name: string) {
    const health = providerHealth[name];
    health.failureCount = 0;
    health.status = 'healthy';
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

                // 1. Try Google Gemini (Primary)
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
                                    temperature: 0.3,
                                    response_mime_type: "application/json"
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

                // 2. Try OpenAI
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
                            max_tokens: 2000
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
                // Mock upload for now
                await new Promise(resolve => setTimeout(resolve, 1000));
                return {
                    file_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop`
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
            list: async () => {
                const { data } = await supabase.from('products').select('*').eq('category', 'mutual_fund');
                return data || [];
            },
            filter: async (filters: any) => {
               // ... simplified
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
             list: async () => { return []; }
        },
        FixedDeposit: {
             list: async () => { return []; }
        },
        Insurance: {
             list: async () => { return []; }
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
