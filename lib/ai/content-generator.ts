import { aiService } from '@/lib/ai-service';
import { logger } from '@/lib/logger';
import { createServiceClient } from '@/lib/supabase/service';

interface GlossaryTerm {
    term: string;
    slug: string;
    category: string;
    definition: string;
    detailedExplanation: string;
    example: string;
    relatedTerms: string[];
    searchKeywords: string[];
}

export class AIContentGenerator {
    private _supabase: any = null;

    private get supabase() {
        if (!this._supabase) {
            this._supabase = createServiceClient();
        }
        return this._supabase;
    }

    async generateGlossaryTerm(term: string, category: string): Promise<GlossaryTerm> {
        logger.info(`🔍 [AI] Requesting definition for: ${term}...`);
        const prompt = `You are a financial expert writing glossary definitions for an Indian financial platform.
Generate a comprehensive glossary entry for the term: "${term}"
Category: ${category}
Return JSON: { "term": "${term}", "definition": "...", "detailedExplanation": "...", "example": "...", "relatedTerms": [], "searchKeywords": [] }`;

        try {
            const parsed = await aiService.generateJSON(prompt);
            const slug = term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

            logger.info(`✨ [AI] Received response for: ${term}`);
            return {
                term: parsed.term || term,
                slug,
                category,
                definition: parsed.definition,
                detailedExplanation: parsed.detailedExplanation,
                example: parsed.example,
                relatedTerms: parsed.relatedTerms || [],
                searchKeywords: parsed.searchKeywords || []
            };
        } catch (error: any) {
            logger.error(`❌ [AI] Generation failed for ${term}:`, error.message);
            throw error;
        }
    }

    async batchGenerateGlossary(terms: string[], category: string, batchSize: number = 3): Promise<void> {
        logger.info(`🚀 [BATCH] Starting ${terms.length} terms for ${category}`);
        
        for (let i = 0; i < terms.length; i += batchSize) {
            const batch = terms.slice(i, i + batchSize);
            logger.info(`📦 [BATCH] Processing ${i + 1}-${Math.min(i + batchSize, terms.length)}: ${batch.join(', ')}`);
            
            // Sequential processing within batch to avoid flooding and better tracking
            for (const term of batch) {
                try {
                    const data = await this.generateGlossaryTerm(term, category);
                    
                    logger.info(`💾 [DB] Inserting: ${term}...`);
                    const { error } = await this.supabase
                        .from('glossary_terms')
                        .insert({
                            term: data.term,
                            slug: data.slug,
                            category,
                            definition: data.definition,
                            detailed_explanation: data.detailedExplanation,
                            example: data.example,
                            related_terms: data.relatedTerms,
                            search_keywords: data.searchKeywords,
                            ai_generated: true,
                            ai_model: 'multi-fallback'
                        });

                    if (error) {
                        logger.error(`❌ [DB] Insert error for ${term}:`, JSON.stringify(error, null, 2));
                    } else {
                        logger.info(`✅ [SUCCESS] Term saved: ${term}`);
                    }
                } catch (err: any) {
                    logger.error(`💥 [ERROR] Full failure for ${term}:`, err.message);
                }
            }

            if (i + batchSize < terms.length) {
                logger.info('⏳ [COOLDOWN] Waiting 3 seconds before next batch...');
                await new Promise(r => setTimeout(r, 3000));
            }
        }
    }

    async getGenerationStats() {
        const { count: glossaryCount } = await this.supabase.from('glossary_terms').select('*', { count: 'exact', head: true });
        const { count: blogCount } = await this.supabase.from('blog_posts').select('*', { count: 'exact', head: true });
        const { count: queueCount } = await this.supabase.from('content_generation_queue').select('*', { count: 'exact', head: true });
        
        return { 
            glossaryTerms: glossaryCount || 0,
            blogPosts: blogCount || 0,
            pendingTasks: queueCount || 0
        };
    }
}

export const aiContentGenerator = new AIContentGenerator();
