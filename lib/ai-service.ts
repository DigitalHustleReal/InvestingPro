/**
 * AI Service with Multi-Provider Fallback
 * Supports: Gemini, OpenAI, Anthropic (Claude)
 * NO MOCK DATA - Real AI only
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from './logger';

interface AIProvider {
    name: string;
    generate: (prompt: string) => Promise<string>;
    isAvailable: () => boolean;
}

class AIService {
    private providers: AIProvider[] = [];
    private currentProviderIndex = 0;

    constructor() {
        this.initializeProviders();
    }

    /**
     * Initialize all available AI providers
     */
    private initializeProviders() {
        // Provider 1: Google Gemini
        if (process.env.GOOGLE_GEMINI_API_KEY) {
            const gemini = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
            this.providers.push({
                name: 'Gemini',
                isAvailable: () => !!process.env.GOOGLE_GEMINI_API_KEY,
                generate: async (prompt: string) => {
                    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
                    const result = await model.generateContent(prompt);
                    return result.response.text();
                }
            });
        }

        // Provider 2: OpenAI (GPT-4)
        if (process.env.OPENAI_API_KEY) {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            this.providers.push({
                name: 'OpenAI',
                isAvailable: () => !!process.env.OPENAI_API_KEY,
                generate: async (prompt: string) => {
                    const completion = await openai.chat.completions.create({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7,
                        max_tokens: 2000
                    });
                    return completion.choices[0]?.message?.content || '';
                }
            });
        }

        // Provider 3: Anthropic (Claude)
        if (process.env.ANTHROPIC_API_KEY) {
            const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
            this.providers.push({
                name: 'Claude',
                isAvailable: () => !!process.env.ANTHROPIC_API_KEY,
                generate: async (prompt: string) => {
                    const message = await anthropic.messages.create({
                        model: 'claude-3-haiku-20240307',
                        max_tokens: 2000,
                        messages: [{ role: 'user', content: prompt }]
                    });
                    
                    const content = message.content[0];
                    return content.type === 'text' ? content.text : '';
                }
            });
        }

        if (this.providers.length === 0) {
            logger.error('NO AI PROVIDERS CONFIGURED! Add at least one API key.');
            throw new Error('AI Service requires at least one provider. Check your .env.local file.');
        }

        logger.info(`AI Service initialized with ${this.providers.length} provider(s): ${this.providers.map(p => p.name).join(', ')}`);
    }

    /**
     * Generate content with automatic fallback
     */
    async generate(prompt: string, options?: {
        format?: 'text' | 'json';
        maxRetries?: number;
    }): Promise<string> {
        const { format = 'text', maxRetries = 3 } = options || {};
        
        let lastError: Error | null = null;
        let attemptedProviders: string[] = [];

        // Try each provider in sequence
        for (let i = 0; i < this.providers.length; i++) {
            const provider = this.providers[this.currentProviderIndex];
            
            if (!provider.isAvailable()) {
                this.moveToNextProvider();
                continue;
            }

            try {
                logger.info(`Attempting generation with ${provider.name}...`);
                attemptedProviders.push(provider.name);
                
                const result = await provider.generate(prompt);
                
                // Validate JSON if required
                if (format === 'json') {
                    JSON.parse(result); // Will throw if invalid
                }
                
                logger.info(`✅ Successfully generated with ${provider.name}`);
                return result;
                
            } catch (error: any) {
                lastError = error;
                logger.warn(`❌ ${provider.name} failed:`, error.message);
                
                // Move to next provider
                this.moveToNextProvider();
            }
        }

        // All providers failed
        const errorMsg = `All AI providers failed. Attempted: ${attemptedProviders.join(', ')}. Last error: ${lastError?.message}`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

    /**
     * Generate JSON with validation
     */
    async generateJSON<T = any>(prompt: string): Promise<T> {
        const result = await this.generate(prompt, { format: 'json' });
        
        // Extract JSON from markdown code blocks if present
        const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/) || 
                         result.match(/```\s*([\s\S]*?)\s*```/) ||
                         result.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }
        
        return JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    }

    /**
     * Generate product data
     */
    async generateProduct(name: string, category: string) {
        const prompt = `
Generate realistic 2026 financial product data for "${name}" in India.
Category: ${category}

Return ONLY valid JSON:
{
  "name": "Official Product Name",
  "provider_name": "Company Name",
  "description": "2-sentence value proposition",
  "rating": 4.5,
  "features": {
    "key1": "value1",
    "key2": "value2"
  },
  "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4"],
  "cons": ["Con 1", "Con 2", "Con 3"],
  "official_link": "https://example.com"
}

Use real market data. Be specific and accurate.
`;

        return this.generateJSON(prompt);
    }

    /**
     * Generate article content
     */
    async generateArticle(topic: string, keywords: string[]) {
        const prompt = `
Write a comprehensive SEO-optimized article about: ${topic}

Target keywords: ${keywords.join(', ')}

Return ONLY valid JSON:
{
  "title": "Compelling SEO title",
  "meta_description": "155-char description",
  "content": "Full markdown article (1500+ words)",
  "headings": ["H2 heading 1", "H2 heading 2", ...],
  "internal_links": [
    {"anchor": "text", "url": "/target"}
  ],
  "faq": [
    {"q": "Question?", "a": "Answer"}
  ]
}
`;

        return this.generateJSON(prompt);
    }

    /**
     * Rotate to next provider
     */
    private moveToNextProvider() {
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
    }

    /**
     * Get service status
     */
    getStatus() {
        return {
            totalProviders: this.providers.length,
            activeProviders: this.providers.filter(p => p.isAvailable()).map(p => p.name),
            currentProvider: this.providers[this.currentProviderIndex]?.name
        };
    }
}

// Export singleton
export const aiService = new AIService();

/**
 * Example Usage:
 * 
 * // Generate text
 * const text = await aiService.generate('Write about...');
 * 
 * // Generate JSON
 * const data = await aiService.generateJSON('Return JSON...');
 * 
 * // Generate product
 * const product = await aiService.generateProduct('HDFC Regalia', 'credit_card');
 * 
 * // Generate article
 * const article = await aiService.generateArticle('Best Credit Cards', ['credit cards', 'rewards']);
 * 
 * // Check status
 * console.log(aiService.getStatus());
 */
