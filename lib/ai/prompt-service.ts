
import { createClient } from '@supabase/supabase-js';

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
    private supabase;
    private cache: Map<string, CacheEntry> = new Map();

    constructor() {
        // Initialize Supabase client
        // We use process.env directly here to work in Node scripts and Next.js
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        
        if (!url || !key) {
            console.warn('⚠️ PromptService: Supabase credentials missing');
        }
        
        this.supabase = createClient(url, key);
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
        const { data, error } = await this.supabase
            .from('prompts')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) {
            console.error(`Error fetching prompt '${slug}':`, error.message);
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
        // We can call the stored procedure if available, or just update directly
        // The migration created a function get_prompt that updates usage, but we are querying directly for simplicity first
        // Let's trying calling the DB update
        await this.supabase.rpc('get_prompt', { prompt_slug: slug });
    }
}

export const promptService = new PromptService();
