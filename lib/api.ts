import { createClient } from "@/lib/supabase/client";
import OpenAI from "openai";
import { logger } from "@/lib/logger";
import {
    validateAIContent,
    calculateConfidence,
    createChangeLog,
    generateSystemPrompt,
    type AIDataSource,
    type AIConfidence,
    type AIContentMetadata,
    ALLOWED_AI_OPERATIONS,
    FORBIDDEN_AI_OPERATIONS
} from "@/lib/ai/constraints";

const supabase = createClient();

// Initialize OpenAI client
const openai = typeof window === 'undefined' && process.env.OPENAI_API_KEY 
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    : null;

/**
 * InvestingPro Unified API Service
 * 
 * IMPORTANT: This is NOT an AI content generator.
 * This is an authoritative financial comparison and ranking engine.
 * 
 * AI is a SUPPORT TOOL ONLY, used for:
 * - Drafting summaries from verified data (human review required)
 * - FAQ extraction from source documents (human review required)
 * - Metadata generation (human review required)
 * 
 * All AI outputs MUST:
 * - Use RAG (retrieval from scraped data)
 * - Include citations
 * - Be human-reviewable before publish
 * - Use informational language only (no financial advice)
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
             * 
             * This is NOT for bulk content generation.
             * 
             * AI MAY:
             * - Summarize factual data
             * - Explain formulas
             * - Generate FAQs from content
             * - Generate metadata
             * 
             * AI MAY NOT:
             * - Recommend products
             * - Rank products
             * - Use subjective language
             */
            InvokeLLM: async ({ 
                prompt, 
                contextData, 
                citations,
                operation = 'general',
                dataSources = []
            }: { 
                prompt: string;
                contextData?: any; // Verified data to base draft on
                citations?: string[]; // Source URLs for citations
                operation?: string; // AI operation type (must be in ALLOWED_AI_OPERATIONS)
                dataSources?: AIDataSource[]; // Data sources used
            }) => {
                try {
                    // Validate operation - must be in ALLOWED and not in FORBIDDEN
                    if (FORBIDDEN_AI_OPERATIONS.includes(operation)) {
                        throw new Error(`Operation "${operation}" is forbidden. Allowed operations: ${ALLOWED_AI_OPERATIONS.join(', ')}`);
                    }
                    if (!ALLOWED_AI_OPERATIONS.includes(operation) && operation !== 'general') {
                        throw new Error(`Operation "${operation}" is not in the allowed list. Allowed operations: ${ALLOWED_AI_OPERATIONS.join(', ')}`);
                    }
                    
                    // Use real OpenAI API if available, otherwise fallback to mock
                    if (!openai) {
                        logger.warn("OpenAI API key not configured, using mock response");
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        
                        const confidence = calculateConfidence(dataSources);
                        const changeLog = [createChangeLog('created', ['Initial draft created'], 'ai')];
                        
                        return {
                            title: "Draft Summary",
                            content: "This is a draft generated from verified data. Human review required before publication.",
                            seo_title: "Draft - InvestingPro",
                            seo_description: "Draft content - review required",
                            read_time: 3,
                            is_draft: true,
                            requires_review: true,
                            citations: citations || [],
                            ai_metadata: {
                                data_sources: dataSources,
                                confidence,
                                change_log: changeLog,
                                generated_at: new Date().toISOString(),
                                generated_by: 'ai',
                                requires_review: true,
                                review_status: 'pending',
                                forbidden_phrases_found: [],
                                allowed_operations: [operation]
                            } as AIContentMetadata
                        };
                    }

                    // Generate system prompt with strict constraints
                    const systemPrompt = generateSystemPrompt(operation);

                    // Include context data in prompt if provided
                    const enhancedPrompt = contextData 
                        ? `${prompt}\n\nVerified Data:\n${JSON.stringify(contextData, null, 2)}\n\nGenerate a draft summary based ONLY on this verified data. Include data sources and confidence levels.`
                        : prompt;

                    const response = await openai.chat.completions.create({
                        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                        messages: [
                            {
                                role: "system",
                                content: systemPrompt
                            },
                            {
                                role: "user",
                                content: enhancedPrompt
                            }
                        ],
                        response_format: { type: "json_object" },
                        temperature: 0.3, // Lower temperature for more factual output
                        max_tokens: 2000
                    });

                    const content = response.choices[0]?.message?.content;
                    if (!content) {
                        throw new Error("No content in OpenAI response");
                    }

                    const parsed = JSON.parse(content);
                    
                    // Validate AI output - strict enforcement
                    const validation = validateAIContent(parsed.content || '', operation);
                    if (!validation.valid) {
                        logger.error('AI content validation failed - forbidden phrases detected', new Error('AI validation failed'), { 
                            errors: validation.errors,
                            forbidden_phrases: validation.forbidden_phrases_found,
                            operation 
                        });
                        // Mark content as requiring revision if forbidden phrases found
                        if (validation.forbidden_phrases_found.length > 0) {
                            parsed.requires_revision = true;
                            parsed.validation_warnings = validation.errors;
                        }
                    }
                    
                    // Calculate read time (average reading speed: 200 words/min)
                    const wordCount = parsed.content?.split(/\s+/).length || 0;
                    parsed.read_time = Math.max(1, Math.ceil(wordCount / 200));
                    
                    // Calculate confidence from data sources
                    const confidence = calculateConfidence(dataSources);
                    
                    // Create change log
                    const changeLog = [createChangeLog('created', [
                        'AI draft generated',
                        `Operation: ${operation}`,
                        validation.forbidden_phrases_found.length > 0 
                            ? `Warning: ${validation.forbidden_phrases_found.length} forbidden phrase(s) found`
                            : 'Content validated successfully'
                    ], 'ai')];
                    
                    // Build AI metadata
                    const aiMetadata: AIContentMetadata = {
                        data_sources: dataSources.length > 0 ? dataSources : [{
                            source_type: 'supabase',
                            source_name: 'Supabase Database',
                            last_verified: new Date().toISOString(),
                            confidence: 0.7
                        }],
                        confidence,
                        change_log: changeLog,
                        generated_at: new Date().toISOString(),
                        generated_by: 'ai',
                        requires_review: true,
                        review_status: 'pending',
                        forbidden_phrases_found: validation.forbidden_phrases_found,
                        allowed_operations: [operation]
                    };
                    
                    // Mark as draft requiring review
                    parsed.is_draft = true;
                    parsed.requires_review = true;
                    parsed.citations = citations || parsed.citations || [];
                    parsed.generated_at = new Date().toISOString();
                    parsed.ai_metadata = aiMetadata;

                    return parsed;
                } catch (error: any) {
                    logger.error("AI Draft Generation Error", error as Error);
                    
                    // Create error metadata
                    const confidence = calculateConfidence(dataSources);
                    const changeLog = [createChangeLog('created', [
                        'Error during AI generation',
                        `Error: ${error.message}`
                    ], 'ai')];
                    
                    // Fallback to mock on error
                    return {
                        title: "Draft Summary",
                        content: "Error generating draft. Please create content manually.",
                        seo_title: "Draft - InvestingPro",
                        seo_description: "Draft content - review required",
                        read_time: 3,
                        is_draft: true,
                        requires_review: true,
                        citations: citations || [],
                        error: error.message,
                        ai_metadata: {
                            data_sources: dataSources,
                            confidence,
                            change_log: changeLog,
                            generated_at: new Date().toISOString(),
                            generated_by: 'ai',
                            requires_review: true,
                            review_status: 'pending',
                            forbidden_phrases_found: [],
                            allowed_operations: [operation]
                        } as AIContentMetadata
                    };
                }
            },
            UploadFile: async ({ file }: { file: File }) => {
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
                const { data, error } = await query;
                if (error) return [];
                return data;
            },
            getBySlug: async (slug: string) => {
                const { data, error } = await supabase.from('assets').select('*').eq('slug', slug).single();
                if (error) return null;
                return data;
            },
            search: async (term: string) => {
                const { data, error } = await supabase.from('assets').select('*').ilike('name', `%${term}%`).limit(10);
                if (error) return [];
                return data;
            }
        },
        Article: {
            list: async (order?: string, limit?: number) => {
                let query = supabase.from('articles').select('*');
                if (order === '-created_date' || order === '-published_date') query = query.order('created_at', { ascending: false });
                if (limit) query = query.limit(limit);
                const { data, error } = await query;
                if (error) return [];
                return data || [];
            },
            filter: async (filters: any) => {
                let query = supabase.from('articles').select('*');
                Object.entries(filters).forEach(([key, value]) => { query = query.eq(key, value); });
                const { data, error } = await query;
                if (error) return [];
                return data || [];
            },
            update: async (id: string, data: any) => {
                const { error } = await supabase.from('articles').update(data).eq('id', id);
                return !error;
            },
            create: async (data: any) => {
                const { error } = await supabase.from('articles').insert([data]);
                return !error;
            }
        },
        MutualFund: {
            list: async () => {
                try {
                    // Try Universal Asset Model first
                    const { data: uamData, error: uamError } = await supabase
                        .from('assets')
                        .select('*')
                        .eq('category', 'mutual_funds');
                    
                    if (!uamError && uamData && uamData.length > 0) {
                        return uamData.map(asset => ({
                            id: asset.id,
                            name: asset.name,
                            fund_house: asset.provider,
                            category: asset.vertical_slug,
                            ...asset.metadata
                        }));
                    }

                    // Fallback to products table (without join to avoid 400 errors)
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .eq('product_type', 'mutual_fund')
                        .eq('is_active', true);
                    
                    if (error || !data || data.length === 0) return [];
                    
                    // Transform to expected format
                    return data.map((product: any) => ({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        fund_house: product.provider,
                        category: product.category || '',
                        ...product
                    }));
                } catch (error) {
                    return [];
                }
            },
            filter: async (filters: any) => {
                try {
                    // Try Universal Asset Model first - only use category filter, ignore is_active
                    let query = supabase.from('assets').select('*').eq('category', 'mutual_funds');
                    
                    // Only apply safe filters (exclude is_active as assets table might not have it)
                    const safeFilters = { ...filters };
                    delete safeFilters.is_active;
                    
                    Object.entries(safeFilters).forEach(([key, value]) => { 
                        if (value !== undefined && value !== null) {
                            query = query.eq(key, value); 
                        }
                    });
                    
                    const { data: uamData, error: uamError } = await query;
                    if (!uamError && uamData && uamData.length > 0) {
                        return uamData.map(asset => ({
                            id: asset.id,
                            name: asset.name,
                            fund_house: asset.provider,
                            category: asset.vertical_slug,
                            ...asset.metadata
                        }));
                    }
                    
                    // Fallback to products table (without join to avoid 400 errors)
                    let productsQuery = supabase
                        .from('products')
                        .select('*')
                        .eq('product_type', 'mutual_fund');
                    
                    // Only apply is_active if it exists in filters
                    if (filters.is_active !== undefined) {
                        productsQuery = productsQuery.eq('is_active', filters.is_active);
                    }
                    
                    Object.entries(filters).forEach(([key, value]) => { 
                        if (key !== 'is_active' && value !== undefined && value !== null) {
                            productsQuery = productsQuery.eq(key, value);
                        }
                    });
                    
                    const { data, error } = await productsQuery;
                    if (error || !data || data.length === 0) return [];
                    
                    return data.map((product: any) => ({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        fund_house: product.provider,
                        ...product
                    }));
                } catch (error) {
                    // Silently return empty array if query fails
                    return [];
                }
            }
        },
        CreditCard: {
            list: async () => {
                try {
                    // Try Universal Asset Model first
                    const { data: uamData, error: uamError } = await supabase
                        .from('assets')
                        .select('*')
                        .eq('category', 'credit_cards');
                    
                    if (!uamError && uamData && uamData.length > 0) {
                        return uamData.map(asset => ({
                            id: asset.id,
                            name: asset.name,
                            bank: asset.provider,
                            ...asset.metadata
                        }));
                    }

                    // Fallback to products table (without join to avoid 400 errors)
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .eq('product_type', 'credit_card')
                        .eq('is_active', true);
                    
                    if (error || !data || data.length === 0) return [];
                    
                    return data.map((product: any) => ({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        provider: product.provider,
                        bank: product.provider,
                        ...product
                    }));
                } catch (error) {
                    return [];
                }
            },
            filter: async (filters: any) => {
                try {
                    // Try Universal Asset Model first - only use category filter, ignore is_active
                    let query = supabase.from('assets').select('*').eq('category', 'credit_cards');
                    
                    // Only apply safe filters (exclude is_active as assets table might not have it)
                    const safeFilters = { ...filters };
                    delete safeFilters.is_active;
                    
                    Object.entries(safeFilters).forEach(([key, value]) => { 
                        if (value !== undefined && value !== null) {
                            query = query.eq(key, value); 
                        }
                    });
                    
                    const { data: uamData, error: uamError } = await query;
                    if (!uamError && uamData && uamData.length > 0) {
                        return uamData.map(asset => ({
                            id: asset.id,
                            name: asset.name,
                            provider: asset.provider,
                            bank: asset.provider,
                            ...asset.metadata
                        }));
                    }
                    
                    // Fallback to products table (without join to avoid 400 errors)
                    let productsQuery = supabase
                        .from('products')
                        .select('*')
                        .eq('product_type', 'credit_card');
                    
                    // Only apply is_active if it exists in filters
                    if (filters.is_active !== undefined) {
                        productsQuery = productsQuery.eq('is_active', filters.is_active);
                    }
                    
                    Object.entries(filters).forEach(([key, value]) => { 
                        if (key !== 'is_active' && value !== undefined && value !== null) {
                            productsQuery = productsQuery.eq(key, value);
                        }
                    });
                    
                    const { data, error } = await productsQuery;
                    if (error || !data || data.length === 0) return [];
                    
                    return data.map((product: any) => ({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        provider: product.provider,
                        bank: product.provider,
                        ...product
                    }));
                } catch (error) {
                    // Silently return empty array if query fails
                    return [];
                }
            }
        },
        Loan: {
            list: async () => {
                const { data: uamData } = await supabase.from('assets').select('*').eq('category', 'loans');
                if (uamData && uamData.length > 0) return uamData;

                const { data, error } = await supabase
                    .from('products')
                    .select('*, personal_loans(*)')
                    .eq('product_type', 'personal_loan')
                    .eq('is_active', true);
                
                if (error || !data || data.length === 0) return [];
                
                return data.map((product: any) => ({
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    provider: product.provider,
                    ...product.personal_loans
                }));
            }
        },
        FixedDeposit: {
            list: async () => {
                const { data: uamData } = await supabase.from('assets').select('*').eq('category', 'fixed_deposits');
                if (uamData && uamData.length > 0) return uamData;

                // Get FD rates from live_rates table
                const { data, error } = await supabase
                    .from('live_rates')
                    .select('*')
                    .eq('rate_type', 'fd')
                    .order('scraped_at', { ascending: false });
                
                if (error || !data || data.length === 0) return [];
                return data;
            }
        },
        Insurance: {
            list: async () => {
                const { data: uamData } = await supabase.from('assets').select('*').eq('category', 'insurance');
                if (uamData && uamData.length > 0) return uamData;

                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('product_type', 'insurance')
                    .eq('is_active', true);
                
                if (error || !data || data.length === 0) return [];
                return data;
            }
        },
        AdPlacement: {
            list: async () => {
                const { data, error } = await supabase.from('ad_placements').select('*');
                if (error) return [];
                return data || [];
            },
            filter: async (params: any) => {
                let query = supabase.from('ad_placements').select('*');
                Object.entries(params).forEach(([key, value]) => { query = query.eq(key, value); });
                const { data, error } = await query;
                if (error) return [];
                return data || [];
            },
            update: async (id: string, data: any) => {
                const { error } = await supabase.from('ad_placements').update(data).eq('id', id);
                return !error;
            }
        },
        Review: {
            list: async (order?: string, limit?: number) => {
                let query = supabase.from('reviews').select('*');
                if (order === '-created_date') query = query.order('created_at', { ascending: false });
                if (limit) query = query.limit(limit);
                const { data, error } = await query;
                if (error) return [];
                return data || [];
            },
            filter: async (filters: any) => {
                let query = supabase.from('reviews').select('*');
                Object.entries(filters).forEach(([key, value]) => { query = query.eq(key, value); });
                const { data, error } = await query;
                if (error) return [];
                return data || [];
            },
            create: async (data: any) => {
                const { error } = await supabase.from('reviews').insert([data]);
                return !error;
            },
            update: async (id: string, data: any) => {
                const { error } = await supabase.from('reviews').update(data).eq('id', id);
                return !error;
            }
        },
        AffiliateProduct: {
            list: async (order?: string, limit?: number) => {
                let query = supabase.from('affiliate_products').select('*');
                if (order === '-clicks') query = query.order('clicks', { ascending: false });
                if (limit) query = query.limit(limit);
                const { data, error } = await query;
                if (error) return [];
                return data || [];
            },
            filter: async (filters: any) => {
                let query = supabase.from('affiliate_products').select('*');
                Object.entries(filters).forEach(([key, value]) => { query = query.eq(key, value); });
                const { data, error } = await query;
                if (error) return [];
                return data || [];
            },
            update: async (id: string, data: any) => {
                const { error } = await supabase.from('affiliate_products').update(data).eq('id', id);
                return !error;
            }
        },
        AffiliateClick: {
            create: async (data: any) => {
                const { data: inserted, error } = await supabase
                    .from('affiliate_clicks')
                    .insert([data])
                    .select()
                    .single();
                if (error || !inserted) return null;
                return inserted;
            },
            update: async (id: string, data: any) => {
                const { data: updated, error } = await supabase
                    .from('affiliate_clicks')
                    .update(data)
                    .eq('id', id)
                    .select()
                    .single();
                if (error || !updated) return null;
                return updated;
            },
            filter: async (filters: any) => {
                let query = supabase.from('affiliate_clicks').select('*');
                Object.entries(filters).forEach(([key, value]) => { 
                    query = query.eq(key, value); 
                });
                const { data, error } = await query;
                if (error || !data) return [];
                return data;
            }
        },
        Broker: {
            list: async () => {
                try {
                    // Try assets table first (Universal Asset Model) - only use category filter
                    const { data: uamData, error: uamError } = await supabase
                        .from('assets')
                        .select('*')
                        .eq('category', 'brokers');
                    
                    if (!uamError && uamData && uamData.length > 0) {
                        return uamData.map(asset => ({
                            id: asset.id,
                            name: asset.name,
                            provider: asset.provider,
                            ...asset.metadata
                        }));
                    }
                    
                    // Fallback to brokers table
                    const { data, error } = await supabase.from('brokers').select('*');
                    if (error || !data || data.length === 0) return [];
                    return data;
                } catch (error) {
                    // Silently return empty array if table doesn't exist
                    return [];
                }
            },
            filter: async (filters: any) => {
                try {
                    // Try assets table first - only filter by category, ignore other filters that might not exist
                    let query = supabase.from('assets').select('*').eq('category', 'brokers');
                    
                    // Only apply filters that are safe (exclude is_active if assets table doesn't have it)
                    const safeFilters = { ...filters };
                    delete safeFilters.is_active; // Remove is_active as assets table might not have it
                    
                    Object.entries(safeFilters).forEach(([key, value]) => { 
                        if (value !== undefined && value !== null) {
                            query = query.eq(key, value); 
                        }
                    });
                    
                    const { data: uamData, error: uamError } = await query;
                    if (!uamError && uamData && uamData.length > 0) {
                        return uamData.map(asset => ({
                            id: asset.id,
                            name: asset.name,
                            provider: asset.provider,
                            ...asset.metadata
                        }));
                    }
                    
                    // Fallback to brokers table
                    let brokerQuery = supabase.from('brokers').select('*');
                    Object.entries(filters).forEach(([key, value]) => { 
                        if (value !== undefined && value !== null) {
                            brokerQuery = brokerQuery.eq(key, value); 
                        }
                    });
                    const { data, error } = await brokerQuery;
                    if (error || !data || data.length === 0) {
                        return [];
                    }
                    return data;
                } catch (error) {
                    // Silently return empty array if table doesn't exist
                    return [];
                }
            }
        },
        IPO: {
            list: async () => {
                const { data, error } = await supabase.from('ipos').select('*');
                if (error || !data || data.length === 0) return [];
                return data;
            }
        },
        Portfolio: {
            list: async () => {
                // Modified to join with assets
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*, assets(*)');

                if (error || !data || data.length === 0) return [];
                return data;
            },
            create: async (data: any) => {
                const { error } = await supabase.from('portfolios').insert([data]);
                return !error;
            },
            delete: async (id: string) => {
                const { error } = await supabase.from('portfolios').delete().eq('id', id);
                return !error;
            }
        },
        Glossary: {
            list: async (category?: string, limit?: number) => {
                let query = supabase.from('glossary_terms').select('*').eq('status', 'published');
                if (category) query = query.eq('category', category);
                if (limit) query = query.limit(limit);
                query = query.order('term', { ascending: true });
                const { data, error } = await query;
                if (error) return [];
                return data || [];
            },
            getBySlug: async (slug: string) => {
                const { data, error } = await supabase
                    .from('glossary_terms')
                    .select('*')
                    .eq('slug', slug)
                    .eq('status', 'published')
                    .single();
                if (error) return null;
                return data;
            },
            search: async (term: string) => {
                const { data, error } = await supabase
                    .from('glossary_terms')
                    .select('*')
                    .eq('status', 'published')
                    .or(`term.ilike.%${term}%,full_form.ilike.%${term}%,definition.ilike.%${term}%`)
                    .limit(20);
                if (error) return [];
                return data || [];
            },
            getByCategory: async (category: string) => {
                const { data, error } = await supabase
                    .from('glossary_terms')
                    .select('*')
                    .eq('category', category)
                    .eq('status', 'published')
                    .order('term', { ascending: true });
                if (error) return [];
                return data || [];
            },
            create: async (data: any) => {
                const { error } = await supabase.from('glossary_terms').insert([data]);
                if (error) {
                    logger.error('Error creating glossary term', error as Error);
                    return null;
                }
                return data;
            },
            update: async (id: string, data: any) => {
                const { error } = await supabase.from('glossary_terms').update(data).eq('id', id);
                return !error;
            },
            getAllCategories: async () => {
                const { data, error } = await supabase
                    .from('glossary_terms')
                    .select('category')
                    .eq('status', 'published');
                if (error) return [];
                const categories = [...new Set(data?.map((d: any) => d.category) || [])];
                return categories.sort();
            }
        }
    },
    auth: {
        me: async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) return null;
            return {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                onboarding_completed: user.user_metadata?.onboarding_completed || false,
                financial_profile: user.user_metadata?.financial_profile || {},
                risk_profile: user.user_metadata?.risk_profile || null,
                risk_score: user.user_metadata?.risk_score || null,
                bio: user.user_metadata?.bio || '',
                profile_picture: user.user_metadata?.profile_picture || '',
                points: user.user_metadata?.points || 0,
                level: user.user_metadata?.level || 'Beginner',
                badges: user.user_metadata?.badges || [],
                expertise: user.user_metadata?.expertise || []
            };
        },
        updateMe: async (data: any) => {
            const { error } = await supabase.auth.updateUser({ data });
            return !error;
        }
    }
};
