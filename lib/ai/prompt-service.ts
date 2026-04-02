
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

// Types for Prompt
export interface Prompt {
    id: string;
    name: string;
    slug: string;
    system_prompt?: string;
    user_prompt_template: string;
    preferred_model: string;
    temperature: number;
    output_format: 'text' | 'json' | 'markdown';
    json_schema?: any;
    version: number;
}

export interface PromptVariables {
    [key: string]: string | number;
}

// Simple in-memory cache
interface CacheEntry {
    prompt: Prompt;
    expiresAt: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class PromptService {
    private supabaseClient: ReturnType<typeof createClient> | null = null;
    private cache: Map<string, CacheEntry> = new Map();

    constructor() {
        // Initialization moved to getSupabase()
    }

    private getSupabase() {
        if (!this.supabaseClient) {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
            
            if (!url || !key) {
                logger.warn('⚠️ PromptService: Supabase credentials missing');
                // We don't throw here to allow non-DB dependent methods to work, 
                // but createClient might fail or be useless.
            }
            this.supabaseClient = createClient(url, key);
        }
        return this.supabaseClient;
    }

    /**
     * Get a prompt by slug, using cache if available
     */
    async getPrompt(slug: string): Promise<Prompt | null> {
        // Check cache
        const cached = this.cache.get(slug);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.prompt;
        }

        // Fetch from DB
        const { data, error } = await this.getSupabase()
            .from('prompts')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) {
            // logger.warn(`Note: Prompt '${slug}' not found in DB, using fallback.`);
            return null;
        }

        if (data) {
            this.cache.set(slug, {
                prompt: data as Prompt,
                expiresAt: Date.now() + CACHE_TTL
            });
            
            // Async update usage count (fire and forget)
            this.recordUsage(slug).catch(console.error);
            
            return data as Prompt;
        }

        return null;
    }

    /**
     * Populate a prompt template with variables
     */
    populateTemplate(template: string, variables: PromptVariables): string {
        let result = template;
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, String(value));
        }
        return result;
    }

    /**
     * Record usage of a prompt
     */
    private async recordUsage(slug: string) {
        await (this.getSupabase()!.rpc as any)('get_prompt', { prompt_slug: slug });
    }
}

export const promptService = new PromptService();
