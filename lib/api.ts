import { createClient } from "@/lib/supabase/client";
// Lazy import articleService to avoid server/client boundary issues
// It's only used in article methods, not at module level
import OpenAI from "openai";
import Groq from "groq-sdk";
import { Mistral } from "@mistralai/mistralai";
import { logger } from "@/lib/logger";
import {
    validateAIContent,
    calculateConfidence,
    generateSystemPrompt,
    type AIDataSource,
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
        logger.warn('Failed to sync AI health from DB', { error: e });
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
        try {
            await supabase.from('ai_provider_health').upsert({
                provider_name: name,
                status: health.status,
                last_error: error,
                last_failure_time: new Date(health.lastFailureTime).toISOString(),
                failure_count: health.failureCount,
                updated_at: new Date().toISOString()
            });
        } catch (dbError) {
             // Ignore DB errors (table might be missing), rely on in-memory health
             logger.warn('Failed to persist AI health to DB', { error: dbError });
        }
    }
}

async function reportSuccess(name: string) {
    const health = providerHealth[name];
    const wasDegraded = health.status !== 'healthy';
    health.failureCount = 0;
    health.status = 'healthy';

    // Persist to DB if state changed
    if (wasDegraded && typeof window === 'undefined') {
        try {
            await supabase.from('ai_provider_health').upsert({
                provider_name: name,
                status: 'healthy',
                failure_count: 0,
                updated_at: new Date().toISOString()
            });
        } catch (dbError) {
             logger.warn('Failed to persist AI health to DB', { error: dbError });
        }
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
        updateMe: async (updates: any) => {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');
            
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
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
                systemPrompt: customSystemPrompt,
                contextData, 
                citations,
                operation = 'general',
                dataSources = []
            }: { 
                prompt: string;
                systemPrompt?: string;
                contextData?: any; 
                citations?: string[]; 
                operation?: string;
                dataSources?: AIDataSource[];
            }) => {
                if (FORBIDDEN_AI_OPERATIONS.includes(operation)) {
                    throw new Error(`Operation "${operation}" is forbidden.`);
                }
                // Use custom system prompt if provided (from dynamic prompt builder), otherwise generate default
                const finalSystemPrompt = customSystemPrompt || generateSystemPrompt(operation);
                const enhancedPrompt = contextData 
                    ? `${prompt}\n\nVerified Data:\n${JSON.stringify(contextData, null, 2)}`
                    : prompt;

                // Sync health from DB once at start of operation
                await syncHealthFromDB();

                // 1. Try OpenAI (PRIMARY - User has $10 credit)
                // Note: Health check disabled to force retry after quota fix
                if (openai /* && checkHealth('openai') */) {
                    try {
                        const response = await openai.chat.completions.create({
                            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                            messages: [
                                { role: "system", content: finalSystemPrompt + " You must response in JSON." },
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
                            let contentToValidate = parsed.content || '';
                            if (typeof contentToValidate !== 'string') {
                                logger.warn('OpenAI returned object/array for content, stringifying');
                                contentToValidate = JSON.stringify(contentToValidate);
                            }
                            const validation = validateAIContent(contentToValidate, operation);
                            const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
                            const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
                            return { 
                                ...parsed, 
                                validation_warnings: validation.errors, 
                                is_draft: true, 
                                provider: 'openai',
                                model,
                                usage: {
                                    input_tokens: usage.prompt_tokens || 0,
                                    output_tokens: usage.completion_tokens || 0,
                                    total_tokens: usage.total_tokens || 0
                                }
                            };
                        } else {
                            logger.error('OPENAI NULL CONTENT', new Error(`Finish reason: ${response.choices[0]?.finish_reason}`));
                        }
                    } catch (error: any) {
                        logger.error('OPENAI FAILURE', error, {
                            status: error.response?.status,
                            code: error.code,
                            type: error.type
                        });
                        reportFailure('openai', error.message);
                    }
                } else {
                    logger.debug('OpenAI skipped', { openai_exists: !!openai });
                }

                // 2. Try Google Gemini (Fallback)
                const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
                if (geminiKey && checkHealth('gemini')) {
                    try {
                        const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";
                        // Use fetch with timeout to prevent hanging connections
                        const { fetchWithTimeout } = await import('@/lib/utils/fetch-with-timeout');
                        const geminiResponse = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${geminiKey}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            timeout: 60000, // 60s timeout for AI requests
                            body: JSON.stringify({
                                contents: [{ 
                                    role: 'user', 
                                    parts: [{ text: `${finalSystemPrompt}\n\n${enhancedPrompt}` }] 
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
                                const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
                                // Gemini usage is in data.usageMetadata
                                const usageMetadata = data.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0 };
                                return { 
                                    ...parsed, 
                                    validation_warnings: validation.errors, 
                                    is_draft: true, 
                                    provider: 'gemini',
                                    model: modelName,
                                    content: parsed.content || cleanText,
                                    usage: {
                                        input_tokens: usageMetadata.promptTokenCount || 0,
                                        output_tokens: usageMetadata.candidatesTokenCount || 0,
                                        total_tokens: usageMetadata.totalTokenCount || 0
                                    }
                                };
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
                                { role: "system", content: finalSystemPrompt },
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
                            const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
                            return { 
                                ...parsed, 
                                is_draft: true, 
                                provider: 'groq',
                                model: "llama-3.3-70b-versatile",
                                usage: {
                                    input_tokens: usage.prompt_tokens || 0,
                                    output_tokens: usage.completion_tokens || 0,
                                    total_tokens: usage.total_tokens || 0
                                }
                            };
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
                                { role: "system", content: finalSystemPrompt },
                                { role: "user", content: enhancedPrompt }
                            ],
                            responseFormat: { type: "json_object" }
                        });

                        const content = response.choices?.[0]?.message?.content;
                        if (typeof content === 'string') {
                            const parsed = extractJSON(content);
                            reportSuccess('mistral');
                            // Mistral usage is in response.usage or (response as any).usage
                            const usage = (response as any).usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
                            return { 
                                ...parsed, 
                                is_draft: true, 
                                provider: 'mistral',
                                model: "mistral-small-latest",
                                usage: {
                                    input_tokens: usage.prompt_tokens || 0,
                                    output_tokens: usage.completion_tokens || 0,
                                    total_tokens: usage.total_tokens || 0
                                }
                            };
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
                
                // Check if it's an image file
                const isImage = file.type.startsWith('image/');
                let fileToUpload = file;
                let fileExt = file.name.split('.').pop() || 'jpg';
                let mimeType = file.type;

                // Auto-optimize images: Route through optimized upload API (server-side)
                if (isImage) {
                    try {
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        const response = await fetch('/api/admin/images/upload', {
                            method: 'POST',
                            body: formData
                        });
                        
                        if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.error || error.message || 'Upload failed');
                        }
                        
                        const data = await response.json();
                        return {
                            file_url: data.file_url,
                            file_path: data.file_path,
                            file_name: data.file_name,
                            optimized: data.optimized,
                            original_size: data.original_size,
                            optimized_size: data.optimized_size,
                            savings_percent: data.savings_percent
                        };
                    } catch (optimizeError) {
                        // If optimized upload fails, fall back to direct upload (no optimization)
                        logger.warn('Optimized upload failed, using direct upload', optimizeError as Error);
                        // Continue with original file upload below
                    }
                }
                
                // 1. Generate unique file name
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
                const filePath = `uploads/${fileName}`;

                // 2. Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('media')
                    .upload(filePath, fileToUpload, {
                        cacheControl: '31536000', // 1 year
                        upsert: false,
                        contentType: mimeType
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
                        mime_type: mimeType,
                        file_size: fileToUpload.size,
                        folder: 'uploads',
                        uploaded_by: user?.id || null
                    });
                } catch (dbError) {
                    // Log but don't fail the upload just because DB registration failed
                    logger.warn('Media registered in Storage but failed to record in DB table.');
                }

                return {
                    file_url: publicUrl,
                    file_path: filePath,
                    file_name: fileName,
                    optimized: isImage && fileToUpload !== file,
                    original_size: file.size,
                    optimized_size: fileToUpload.size
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
                const supabase = getSupabaseClient();
                let query = supabase.from('assets').select('*');
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
        
        // REFACTORED: Uses Supabase client directly (client-safe) and API routes for writes
        // This avoids importing server-only articleService in client components
        Article: {
            list: async (order?: string, limit?: number) => {
                // Use Supabase client directly - safe for client components
                const supabase = getSupabaseClient();
                let query = supabase
                    .from('articles')
                    .select('*')
                    .eq('status', 'published');
                
                if (order) {
                    const [field, direction] = order.startsWith('-') 
                        ? [order.slice(1), 'desc'] 
                        : [order, 'asc'];
                    query = query.order(field, { ascending: direction === 'asc' });
                } else {
                    query = query.order('created_at', { ascending: false });
                }
                
                if (limit) {
                    query = query.limit(limit);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                return data || [];
            },
            getById: async (id: string) => {
                // Use Supabase client directly - safe for client components
                const supabase = getSupabaseClient();
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error) throw error;
                return data;
            },
            getBySlug: async (slug: string) => {
                // Use Supabase client directly - safe for client components
                const supabase = getSupabaseClient();
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('slug', slug)
                    .single();
                if (error) throw error;
                return data;
            },
            filter: async (filters: any) => {
                // Use direct Supabase query for client-side filtering (no server-only imports)
                const supabase = getSupabaseClient();
                let query = supabase.from('articles').select('*');
                Object.entries(filters).forEach(([key, value]) => { 
                    if (value !== undefined && value !== null) query = query.eq(key, value);
                });
                const { data, error } = await query;
                if (error) throw error;
                return data || [];
            },
            // UNIFIED: Use API routes for writes (requires server-side processing)
            update: async (id: string, data: any) => {
                // Call API route for updates (server-side only operations)
                const { fetchWithTimeout } = await import('@/lib/utils/fetch-with-timeout');
                const response = await fetchWithTimeout(`/api/articles/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000, // 30s timeout
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Failed to update article' }));
                    throw new Error(error.message || 'Failed to update article');
                }
                return await response.json();
            },
            // UNIFIED: Use API routes for creation (requires server-side processing)
            create: async (data: any) => {
                // Call API route for creation (server-side only operations)
                const { fetchWithTimeout } = await import('@/lib/utils/fetch-with-timeout');
                const response = await fetchWithTimeout('/api/articles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000, // 30s timeout
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Failed to create article' }));
                    throw new Error(error.message || 'Failed to create article');
                }
                return await response.json();
            }
        },

        // Legacy entities (to be refactored in Phase 3/4)
        MutualFund: {
            list: async (options: { 
                page?: number; 
                limit?: number; 
                categoryType?: string;
                subCategory?: string; // Mapped to 'category' in new schema if needed, or ignored if categoryType is used.
                sortBy?: string;
                searchTerm?: string;
            } = {}) => {
                const { page = 1, limit = 10, categoryType, sortBy, searchTerm } = options;
                const from = (page - 1) * limit;
                const to = from + limit - 1;

                let query = supabase
                    .from('mutual_funds')
                    .select('*', { count: 'exact' });
                
                // Flexible Category Filter
                if (categoryType && categoryType !== 'All') {
                    // Map "Equity" generic filter to specific categories if needed, or just match exactly if UI sends specific ones.
                    if (categoryType === 'Equity') {
                        query = query.in('category', ['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'ELSS']);
                    } else if (categoryType === 'Debt') {
                        query = query.eq('category', 'Debt');
                    } else if (categoryType === 'Hybrid') {
                         query = query.eq('category', 'Hybrid');
                    } else if (categoryType === 'Index') {
                        query = query.eq('category', 'Index Fund');
                    } else {
                        // Specific match
                         query = query.eq('category', categoryType);
                    }
                }

                if (searchTerm) {
                    query = query.or(`name.ilike.%${searchTerm}%,fund_house.ilike.%${searchTerm}%`);
                }

                if (sortBy) {
                    const [column, order] = sortBy.split(':');
                    const isAscending = order === 'asc';
                    
                    // Direct column sorting
                    if (['returns_1y', 'returns_3y', 'returns_5y', 'rating', 'expense_ratio'].includes(column)) {
                        query = query.order(column, { ascending: isAscending, nullsFirst: false });
                    } else {
                        query = query.order(column, { ascending: isAscending });
                    }
                } else {
                    query = query.order('returns_3y', { ascending: false }); // Default
                }

                const { data, count, error } = await query.range(from, to);
                
                if (error) {
                    logger.error('Error fetching mutual funds from Supabase', error);
                    return { data: [], count: 0 };
                }

                // Map to UI Structure (compatible with RichProduct / Frontend expectations)
                const mappedData = (data || []).map((p: any) => ({
                    id: p.id || p.slug || 'unknown',
                    slug: p.slug,
                    name: p.name,
                    category: 'mutual_fund', 
                    type: p.category, 
                    aum: p.aum || 'N/A',
                    
                    // camelCase for types/index.ts and scoring engine
                    returns1Y: Number(p.returns_1y || 0),
                    returns3Y: Number(p.returns_3y || 0),
                    returns5Y: Number(p.returns_5y || 0),
                    rating: Number(p.rating || 0),
                    riskLevel: (p.risk || 'Moderate').toLowerCase(), 
                    expenseRatio: Number(p.expense_ratio || 0),
                    minInvestment: p.min_investment ? `₹${p.min_investment}` : '₹500',

                    fundHouse: p.fund_house,
                    providerName: p.fund_house,
                    provider: p.fund_house,
                    description: p.description,
                    applyLink: '#', // Added fallback
                    
                    // Highlights for ProductCard (Must be Array)
                    features: [
                        `3Y Returns: ${p.returns_3y}%`,
                        `Expense Ratio: ${p.expense_ratio}%`,
                        `Risk Level: ${p.risk}`
                    ]
                }));

                return { data: mappedData, count: count || 0 };
            },
            getById: async (id: string) => {
                const supabase = getSupabaseClient();
                // Support fetching by UUID or Slug
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
                
                let query = supabase.from('mutual_funds').select('*');
                if (isUuid) query = query.eq('id', id);
                else query = query.eq('slug', id); // Try slug

                const { data, error } = await query.single();

                if (error || !data) return undefined;

                const p = data;
                
                // Normalize to UI structure
                return {
                    id: p.id,
                    slug: p.slug,
                    name: p.name,
                    category: 'mutual_fund',
                    type: p.category,
                    aum: p.aum || 'N/A',
                    
                    // camelCase normalization
                    returns1Y: Number(p.returns_1y || 0),
                    returns3Y: Number(p.returns_3y || 0),
                    returns5Y: Number(p.returns_5y || 0),
                    rating: Number(p.rating || 0),
                    riskLevel: (p.risk || 'Moderate').toLowerCase(),
                    expenseRatio: Number(p.expense_ratio || 0),
                    minInvestment: p.min_investment ? `₹${p.min_investment}` : '₹500',

                    fundHouse: p.fund_house,
                    providerName: p.fund_house,
                    provider: p.fund_house,
                    description: p.description,
                    
                    // Comparison/Rich Features
                    features: {
                        'Expense Ratio': `${p.expense_ratio}%`,
                        'Risk': p.risk,
                        '1Y Returns': `${p.returns_1y}%`,
                        '3Y Returns': `${p.returns_3y}%`,
                        'Min SIP': p.min_investment ? `₹${p.min_investment}` : '₹500'
                    }
                };
            },
            filter: async (filters: any) => {
               // ... kept for compatibility but the list() method is now preferred
               return [];
            }
        },


        CreditCard: {
             list: async () => {
                const { data, error } = await supabase.from('credit_cards').select('*');
                
                if (error) {
                    console.error('Error fetching credit cards:', error);
                    return [];
                }

                // Map to Generic Asset format expected by UI
                return (data || []).map((card: any) => ({
                    id: card.id || card.slug || 'unknown',
                    slug: card.slug,
                    name: card.name,
                    category: 'credit_card', // ADDED: Critical for filtering & ProductCard links
                    provider: card.bank,
                    provider_name: card.bank,
                    image_url: card.image_url,
                    description: card.description || '',
                    rating: Number(card.rating) || 4.5,
                    reviewsCount: 0,
                    applyLink: card.apply_link || card.source_url || '#', // Added fallback
                    
                    // Structured data for scorers
                    joiningFee: card.joining_fee,
                    annualFee: card.annual_fee,
                    rewardRate: card.rewards?.[0] || '1%',
                    loungeAccess: card.lounge_access || 'Nil',
                    type: card.type || 'rewards',
                    
                    // Highlights for ProductCard (Must be Array)
                    features: card.pros || [], 
                    pros: card.pros || [],
                    cons: card.cons || [],
                    updated_at: card.updated_at
                }));
            },
            getById: async (id: string) => {
                const { data, error } = await supabase.from('credit_cards').select('*').eq('id', id).single();
                if (error || !data) return null;
                
                const card = data;
                return {
                    id: card.id,
                    slug: card.slug,
                    name: card.name,
                    category: 'credit_card',
                    provider: card.bank,
                    provider_name: card.bank,
                    image_url: card.image_url,
                    description: card.description || '',
                    rating: Number(card.rating) || 4.5,
                    applyLink: card.apply_link || card.source_url || '#',
                    // Structured data 
                    joiningFee: card.joining_fee,
                    annualFee: card.annual_fee,
                    rewardRate: card.rewards?.[0] || '1%',
                    loungeAccess: card.lounge_access || 'Nil',
                    type: card.type || 'rewards',
                    features: card.pros || [],
                };
            },
            filter: async (filters: any) => { 
                // Basic filtering support can be added here if needed
                return []; 
            }
        },
        Loan: {
             list: async () => {
                const { data } = await supabase.from('loans').select('*');
                
                // Map to Generic Asset/UI format
                return (data || []).map((l: any) => ({
                    id: l.id,
                    slug: l.slug,
                    name: l.name,
                    category: 'loan',
                    provider: l.bank_name,
                    provider_name: l.bank_name,
                    description: l.description || '',
                    rating: 4.0,
                    reviewsCount: 0,
                    applyLink: l.apply_link || '#',

                    // Structured data for scorers
                    loanType: l.type,
                    interestRateMin: l.interest_rate_min,
                    interestRateMax: l.interest_rate_max,
                    maxTenureMonths: l.max_tenure_months,
                    maxAmount: l.max_amount,
                    processingFee: l.processing_fee,

                    // Highlights for ProductCard (Must be Array)
                    features: [
                        `Interest starts at ${l.interest_rate_min}%`,
                        `Tenure up to ${l.max_tenure_months/12} years`,
                        `Processing Fee: ${l.processing_fee}`
                    ],
                    url: l.apply_link || '#'
                }));
            },
            getById: async (id: string) => {
                const { data, error } = await supabase.from('loans').select('*').eq('id', id).single();
                if (error || !data) return null;
                
                const l = data;
                return {
                    id: l.id,
                    slug: l.slug,
                    name: l.name,
                    category: 'loan',
                    provider: l.bank_name,
                    provider_name: l.bank_name,
                    description: l.description || '',
                    rating: 4.0,
                    reviewsCount: 0,
                    applyLink: l.apply_link || '#',

                    // Structured data for scorers
                    loanType: l.type,
                    interestRateMin: l.interest_rate_min,
                    interestRateMax: l.interest_rate_max,
                    maxTenureMonths: l.max_tenure_months,
                    maxAmount: l.max_amount,
                    processingFee: l.processing_fee,
                    
                    features: [
                        `Interest starts at ${l.interest_rate_min}%`,
                        `Tenure up to ${l.max_tenure_months/12} years`,
                        `Processing Fee: ${l.processing_fee}`
                    ]
                };
            }
        },
        FixedDeposit: {
             list: async () => {
                // Return mock FD data until database is seeded
                return [
                    {
                        bank: "HDFC Bank",
                        type: "Bank",
                        logo: "H",
                        color: "from-blue-600 to-blue-700",
                        rates: { "1 Year": 7.00, "2 Years": 7.10, "3 Years": 7.25, "5 Years": 7.40 },
                        seniorCitizenBonus: 0.50,
                        minDeposit: "₹5,000",
                        featured: true
                    },
                    {
                        bank: "SBI",
                        type: "Bank",
                        logo: "S",
                        color: "from-primary-600 to-primary-700",
                        rates: { "1 Year": 6.80, "2 Years": 7.00, "3 Years": 7.10, "5 Years": 7.50 },
                        seniorCitizenBonus: 0.50,
                        minDeposit: "₹1,000",
                        featured: false
                    },
                    {
                        bank: "ICICI Bank",
                        type: "Bank",
                        logo: "I",
                        color: "from-orange-600 to-orange-700",
                        rates: { "1 Year": 7.00, "2 Years": 7.10, "3 Years": 7.25, "5 Years": 7.50 },
                        seniorCitizenBonus: 0.50,
                        minDeposit: "₹10,000",
                        featured: false
                    },
                    {
                        bank: "Bajaj Finance",
                        type: "NBFC",
                        logo: "B",
                        color: "from-accent-600 to-accent-700",
                        rates: { "1 Year": 8.10, "2 Years": 8.25, "3 Years": 8.35, "5 Years": 8.50 },
                        seniorCitizenBonus: 0.25,
                        minDeposit: "₹15,000",
                        featured: true
                    },
                    {
                        bank: "Mahindra Finance",
                        type: "NBFC",
                        logo: "M",
                        color: "from-danger-600 to-danger-700",
                        rates: { "1 Year": 7.75, "2 Years": 8.00, "3 Years": 8.15, "5 Years": 8.30 },
                        seniorCitizenBonus: 0.25,
                        minDeposit: "₹10,000",
                        featured: false
                    }
                ];
            }
        },
        Insurance: {
             list: async () => {
                const { data } = await supabase.from('insurance').select('*');
                
                return (data || []).map((i: any) => ({
                    id: i.id,
                    slug: i.slug,
                    name: i.name,
                    provider: i.provider_name,
                    provider_name: i.provider_name,
                    type: i.type,
                    cover: i.cover_amount,
                    premium: i.min_premium,
                    claim_ratio: i.claim_settlement_ratio,
                    features: i.features || {}
                }));
            },
            getById: async (id: string) => {
                const { data, error } = await supabase.from('insurance').select('*').eq('id', id).single();
                if (error || !data) return null;
                
                const i = data;
                return {
                    id: i.id,
                    slug: i.slug,
                    name: i.name,
                    provider: i.provider_name,
                    provider_name: i.provider_name,
                    type: i.type,
                    cover: i.cover_amount,
                    premium: i.min_premium,
                    claim_ratio: i.claim_settlement_ratio,
                    features: i.features || {},
                    applyLink: i.apply_link || '#' 
                };
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
            },
            getByCategory: async (category: string) => {
                try {
                    const { data } = await supabase.from('glossary_terms').select('*')
                        .eq('category', category)
                        .order('term', { ascending: true });
                    return data || [];
                } catch (error) {
                    console.error('Error fetching glossary by category:', error);
                    return [];
                }
            }
        },
        AdPlacement: {
             list: async () => { return []; },
             filter: async (p:any) => { return []; },
             update: async (id:string, d:any) => { return true; }
        },
        reviews: {
            list: async (productSlug: string) => {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*, user:user_id(email)')
                    .eq('product_slug', productSlug)
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.error("Error fetching reviews", error);
                    return [];
                }
                return data || [];
            },
            filter: async (filters: any) => {
                let query = supabase
                    .from('reviews')
                    .select('*, user:user_id(email)');
                
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        query = query.eq(key, value);
                    }
                });
                
                const { data, error } = await query.order('created_at', { ascending: false });
                
                if (error) {
                    console.error("Error filtering reviews", error);
                    return [];
                }
                return data || [];
            },
            create: async (review: {
                product_slug: string;
                product_type: string;
                rating: number;
                title: string;
                content: string;
                user_id: string;
            }) => {
                const { data, error } = await supabase
                    .from('reviews')
                    .insert([review])
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            },
            getStats: async (productSlug: string) => {
                 const { data, error } = await supabase
                    .from('reviews')
                    .select('rating')
                    .eq('product_slug', productSlug);
                
                if (error || !data || data.length === 0) return { average: 0, count: 0 };
                
                const sum = data.reduce((acc: number, curr: any) => acc + curr.rating, 0);
                return {
                    average: parseFloat((sum / data.length).toFixed(1)),
                    count: data.length
                };
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
