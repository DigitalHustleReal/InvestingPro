/**
 * AI Service with Multi-Provider Fallback
 * Supports: Gemini, OpenAI, Anthropic (Claude)
 * NO MOCK DATA - Real AI only
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Mistral } from '@mistralai/mistralai';
import Groq from 'groq-sdk';
import { logger } from './logger';

interface AIProvider {
    name: string;
    generate: (prompt: string) => Promise<string>;
    isAvailable: () => boolean;
}

class AIService {
    private providers: AIProvider[] = [];
    private currentProviderIndex = 0;
    private initialized = false;

    constructor() {
        // Initialization moved to lazy load
    }

    private ensureInitialized() {
        if (this.initialized) return;
        this.initializeProviders();
        this.initialized = true;
    }

    /**
     * Initialize all available AI providers
     */
    private initializeProviders() {
        // Provider 1: Google Gemini - TEMPORARILY DISABLED (404 errors)
        // TODO: Investigate SDK version mismatch with model names
        /*
        if (process.env.GOOGLE_GEMINI_API_KEY) {
            const gemini = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
            this.providers.push({
                name: 'Gemini',
                isAvailable: () => !!process.env.GOOGLE_GEMINI_API_KEY,
                generate: async (prompt: string) => {
                    const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
                    const result = await model.generateContent(prompt);
                    return result.response.text();
                }
            });
        }
        */

        // Provider 2: Groq (Ultra Fast - Llama3/Mixtral)
        if (process.env.GROQ_API_KEY) {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
            this.providers.push({
                name: 'Groq',
                isAvailable: () => !!process.env.GROQ_API_KEY,
                generate: async (prompt: string) => {
                    const completion = await groq.chat.completions.create({
                        messages: [{ role: 'user', content: prompt }],
                        model: 'llama-3.1-8b-instant',
                        temperature: 0.7,
                    });
                    return completion.choices[0]?.message?.content || '';
                }
            });
        }

        // Provider 3: Mistral (Stable European Provider)
        if (process.env.MISTRAL_API_KEY) {
            const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
            this.providers.push({
                name: 'Mistral',
                isAvailable: () => !!process.env.MISTRAL_API_KEY,
                generate: async (prompt: string) => {
                    const result = await mistral.chat.complete({
                        model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
                        messages: [{ role: 'user', content: prompt }],
                    });
                    return (result.choices?.[0]?.message?.content as string) || '';
                }
            });
        }

        // Provider 4: OpenAI (Industry Standard)
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

        // Provider 5: Anthropic (Claude-3)
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
        this.ensureInitialized();
        const { format = 'text', maxRetries = 3 } = options || {};
        
        // Enforce JSON structure in prompt if requested
        let finalPrompt = prompt;
        if (format === 'json') {
            finalPrompt += `\n\nCRITICAL INSTRUCTION: Return ONLY valid JSON. Do not use Markdown code blocks (no \`\`\`json). Do not add any conversational text. Start with { and end with }.`;
        }
        
        let lastError: Error | null = null;
        const attemptedProviders: string[] = [];

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
                
                const result = await provider.generate(finalPrompt);
                
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
        this.ensureInitialized();
        const result = await this.generate(prompt, { format: 'json' });
        
        let jsonContent = result.trim();
        
        // 1. Try to extract from ```json ... ```
        const jsonBlockMatch = result.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonBlockMatch) {
            jsonContent = jsonBlockMatch[1];
        } else {
            // 2. Try to extract from ``` ... ```
            const codeBlockMatch = result.match(/```\s*([\s\S]*?)\s*```/);
            if (codeBlockMatch) {
                jsonContent = codeBlockMatch[1];
            } else {
                // 3. Try to find the first { and last }
                const firstBrace = result.indexOf('{');
                const lastBrace = result.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    jsonContent = result.substring(firstBrace, lastBrace + 1);
                }
            }
        }
        
        try {
            return JSON.parse(jsonContent.trim());
        } catch (error: any) {
            logger.error('JSON Parse Error', error, { content: jsonContent });
            throw new Error(`Failed to parse AI response as JSON: ${error.message}`);
        }
    }

    /**
     * Generate product data using database prompts
     */
    async generateProduct(name: string, category: string) {
        // Try to get prompt from database, fallback to hardcoded
        let prompt: string;
        
        try {
            const { getPromptWithFallback } = await import('@/lib/ai/prompts-service');
            prompt = await getPromptWithFallback('product-generator', {
                product_name: name,
                category: category,
            });
        } catch {
            // Fallback to hardcoded prompt
            prompt = `
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
        }

        return this.generateJSON(prompt);
    }

    /**
     * Generate article content using database prompts
     * Enhanced with intent detection and author personas
     */
    async generateArticle(topic: string, keywords: string[], category?: string) {
        // Try to get prompt from database, fallback to hardcoded
        let prompt: string;
        let systemPrompt: string = '';
        
        try {
            // Import content schema for intent detection
            const { detectIntent, CATEGORY_CONFIGS } = await import('@/lib/content/content-schema');
            const { getAuthorForCategory, getAuthorSystemPrompt } = await import('@/lib/content/author-personas');
            
            // Detect intent from topic
            const intentSignals = detectIntent(topic);
            
            // Get author for category (if provided)
            if (category && category in CATEGORY_CONFIGS) {
                const author = getAuthorForCategory(category as any);
                systemPrompt = getAuthorSystemPrompt(author.id);
            }
            
            const { getPromptWithFallback } = await import('@/lib/ai/prompts-service');
            prompt = await getPromptWithFallback('article-generator', {
                topic: topic,
                keywords: keywords.join(', '),
                intent: intentSignals.intent,
                content_type: intentSignals.suggestedContentType,
                tone: intentSignals.suggestedTone,
            });
        } catch {
            // Fallback to hardcoded prompt
            prompt = `
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
        }

        // If we have a system prompt from author, prepend it
        const fullPrompt = systemPrompt 
            ? `${systemPrompt}\n\n---\n\n${prompt}`
            : prompt;

        return this.generateJSON(fullPrompt);
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
        this.ensureInitialized();
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
