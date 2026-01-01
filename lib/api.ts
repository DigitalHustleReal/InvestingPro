import { createClient } from "@/lib/supabase/client";
import { articleService } from "@/lib/cms/article-service";
import OpenAI from "openai";
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

// Initialize OpenAI client
const openai = typeof window === 'undefined' && process.env.OPENAI_API_KEY 
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    : null;

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
                try {
                    if (FORBIDDEN_AI_OPERATIONS.includes(operation)) {
                        throw new Error(`Operation "${operation}" is forbidden.`);
                    }
                    
                    const systemPrompt = generateSystemPrompt(operation);
                    const enhancedPrompt = contextData 
                        ? `${prompt}\n\nVerified Data:\n${JSON.stringify(contextData, null, 2)}`
                        : prompt;

                    // 1. Try Google Gemini if key is provided
                    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
                    if (geminiKey) {
                        try {
                            const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contents: [{ 
                                        role: 'user', 
                                        parts: [{ text: `${systemPrompt}\n\n${enhancedPrompt}` }] 
                                    }],
                                    generationConfig: {
                                        temperature: 0.3,
                                        responseMimeType: "application/json"
                                    }
                                })
                            });

                            if (geminiResponse.ok) {
                                const data = await geminiResponse.json();
                                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                                if (text) {
                                    const parsed = JSON.parse(text);
                                    const validation = validateAIContent(parsed.content || '', operation);
                                    return { ...parsed, validation_warnings: validation.errors, is_draft: true, provider: 'gemini' };
                                }
                            }
                        } catch (e) {
                            logger.error("Gemini Fallback Error", e as Error);
                        }
                    }

                    // 2. Fallback to OpenAI
                    if (!openai) {
                        const confidence = calculateConfidence(dataSources);
                        return {
                            title: "Draft Summary",
                            content: "This is a draft generated from verified data. Human review required.",
                            confidence,
                            is_draft: true,
                            provider: 'mock'
                        };
                    }

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
                    if (!content) throw new Error("No content in OpenAI response");

                    const parsed = JSON.parse(content);
                    const validation = validateAIContent(parsed.content || '', operation);
                    
                    return {
                        ...parsed,
                        validation_warnings: validation.errors,
                        is_draft: true,
                        provider: 'openai'
                    };

                } catch (error: any) {
                    logger.error("AI Draft Generation Error", error);
                    throw error;
                }
            },
            UploadFile: async ({ file }: { file: File }) => {
                // Mock upload for now
                await new Promise(resolve => setTimeout(resolve, 1000));
                return {
                    file_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop`
                };
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
                const { data } = await supabase.from('products').select('*').eq('product_type', 'mutual_fund');
                return data || [];
            },
            filter: async (filters: any) => {
               // ... simplified
               return [];
            }
        },
        CreditCard: {
             list: async () => {
                const { data } = await supabase.from('products').select('*').eq('product_type', 'credit_card');
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
                let query = supabase.from('affiliate_products').select('*'); // Assuming table name
                if (order) {
                    const ascending = !order.startsWith('-');
                    const col = order.replace('-', '');
                    // Handle case where order is unknown or table doesn't have it, but for now trusting caller
                    query = query.order(col, { ascending });
                }
                if (limit) query = query.limit(limit);
                const { data } = await query;
                return data || [];
             },
             filter: async (filters: any) => {
                 const supabase = getSupabaseClient();
                 let query = supabase.from('affiliate_products').select('*');
                 Object.entries(filters).forEach(([key, value]) => {
                     if (value !== undefined) query = query.eq(key, value);
                 });
                 const { data } = await query;
                 return data || [];
             },
             update: async (id: string, data: any) => { 
                 const supabase = getSupabaseClient();
                 const { error } = await supabase.from('affiliate_products').update(data).eq('id', id);
                 return !error;
             }
        },
        AffiliateClick: {
            create: async () => { return null; },
            update: async () => { return null; }
        }
    }
};
