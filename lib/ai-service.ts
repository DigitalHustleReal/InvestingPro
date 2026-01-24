/**
 * AI Service with Multi-Provider Fallback
 * Supports: Gemini, OpenAI, Anthropic (Claude)
 * NO MOCK DATA - Real AI only
 * 
 * Features:
 * - Circuit breaker per provider (prevents cascade failures)
 * - Retry with exponential backoff
 * - Cost tracking and budget enforcement
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Mistral } from '@mistralai/mistralai';
import Groq from 'groq-sdk';
import { logger } from './logger';
import { CircuitBreaker, retry } from './utils/retry';
import { calculateCostFromTokens, logAICost } from './ai/cost-tracker';
import { BudgetGovernorAgent, BudgetStatus } from './agents/budget-governor-agent';

// Enhanced response with token tracking
interface AIResponse {
    content: string;
    inputTokens: number;
    outputTokens: number;
    provider: string;
    model: string;
}

interface AIProvider {
    name: string;
    model: string;
    generate: (prompt: string) => Promise<AIResponse>;
    isAvailable: () => boolean;
}

class AIService {
    private providers: AIProvider[] = [];
    private currentProviderIndex = 0;
    private initialized = false;
    
    // Circuit breakers per provider (prevents cascade failures)
    private circuitBreakers: Map<string, CircuitBreaker> = new Map();
    
    // Budget governor for cost enforcement
    private budgetGovernor: BudgetGovernorAgent;
    
    // Track if budget checking is enabled
    private budgetCheckEnabled = true;

    constructor() {
        // Initialization moved to lazy load
        this.budgetGovernor = new BudgetGovernorAgent();
    }

    private ensureInitialized() {
        if (this.initialized) return;
        this.initializeProviders();
        this.initialized = true;
    }
    
    /**
     * Get or create circuit breaker for a provider
     */
    private getCircuitBreaker(providerName: string): CircuitBreaker {
        if (!this.circuitBreakers.has(providerName)) {
            // 5 failures opens circuit, 60 second timeout
            this.circuitBreakers.set(providerName, new CircuitBreaker(5, 60000));
        }
        return this.circuitBreakers.get(providerName)!;
    }

    /**
     * Initialize all available AI providers
     * Each provider returns AIResponse with token tracking
     */
    private initializeProviders() {
        // Provider 1: Google Gemini - TEMPORARILY DISABLED (404 errors)
        // TODO: Investigate SDK version mismatch with model names
        /*
        if (process.env.GOOGLE_GEMINI_API_KEY) {
            const gemini = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
            this.providers.push({
                name: 'Gemini',
                model: 'gemini-pro',
                isAvailable: () => !!process.env.GOOGLE_GEMINI_API_KEY,
                generate: async (prompt: string) => {
                    const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
                    const result = await model.generateContent(prompt);
                    const response = result.response;
                    return {
                        content: response.text(),
                        inputTokens: response.usageMetadata?.promptTokenCount || 0,
                        outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
                        provider: 'google',
                        model: 'gemini-pro'
                    };
                }
            });
        }
        */

        // Provider 2: Groq (Ultra Fast - Llama3/Mixtral)
        if (process.env.GROQ_API_KEY) {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
            const modelName = 'llama-3.1-8b-instant';
            this.providers.push({
                name: 'Groq',
                model: modelName,
                isAvailable: () => !!process.env.GROQ_API_KEY,
                generate: async (prompt: string): Promise<AIResponse> => {
                    const completion = await groq.chat.completions.create({
                        messages: [{ role: 'user', content: prompt }],
                        model: modelName,
                        temperature: 0.7,
                    });
                    return {
                        content: completion.choices[0]?.message?.content || '',
                        inputTokens: completion.usage?.prompt_tokens || 0,
                        outputTokens: completion.usage?.completion_tokens || 0,
                        provider: 'groq',
                        model: modelName
                    };
                }
            });
        }

        // Provider 3: Mistral (Stable European Provider)
        if (process.env.MISTRAL_API_KEY) {
            const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
            const modelName = process.env.MISTRAL_MODEL || 'mistral-small-latest';
            this.providers.push({
                name: 'Mistral',
                model: modelName,
                isAvailable: () => !!process.env.MISTRAL_API_KEY,
                generate: async (prompt: string): Promise<AIResponse> => {
                    const result = await mistral.chat.complete({
                        model: modelName,
                        messages: [{ role: 'user', content: prompt }],
                    });
                    return {
                        content: (result.choices?.[0]?.message?.content as string) || '',
                        inputTokens: result.usage?.promptTokens || 0,
                        outputTokens: result.usage?.completionTokens || 0,
                        provider: 'mistral',
                        model: modelName
                    };
                }
            });
        }

        // Provider 4: OpenAI (Industry Standard)
        if (process.env.OPENAI_API_KEY) {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const modelName = 'gpt-4o-mini';
            this.providers.push({
                name: 'OpenAI',
                model: modelName,
                isAvailable: () => !!process.env.OPENAI_API_KEY,
                generate: async (prompt: string): Promise<AIResponse> => {
                    const completion = await openai.chat.completions.create({
                        model: modelName,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7,
                        max_tokens: 2000
                    });
                    return {
                        content: completion.choices[0]?.message?.content || '',
                        inputTokens: completion.usage?.prompt_tokens || 0,
                        outputTokens: completion.usage?.completion_tokens || 0,
                        provider: 'openai',
                        model: modelName
                    };
                }
            });
        }

        // Provider 5: Anthropic (Claude-3)
        if (process.env.ANTHROPIC_API_KEY) {
            const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
            const modelName = 'claude-3-haiku-20240307';
            this.providers.push({
                name: 'Claude',
                model: modelName,
                isAvailable: () => !!process.env.ANTHROPIC_API_KEY,
                generate: async (prompt: string): Promise<AIResponse> => {
                    const message = await anthropic.messages.create({
                        model: modelName,
                        max_tokens: 2000,
                        messages: [{ role: 'user', content: prompt }]
                    });
                    
                    const content = message.content[0];
                    return {
                        content: content.type === 'text' ? content.text : '',
                        inputTokens: message.usage?.input_tokens || 0,
                        outputTokens: message.usage?.output_tokens || 0,
                        provider: 'anthropic',
                        model: modelName
                    };
                }
            });
        }

        if (this.providers.length === 0) {
            logger.error('NO AI PROVIDERS CONFIGURED! Add at least one API key.');
            throw new Error('AI Service requires at least one provider. Check your .env.local file.');
        }

        // Initialize circuit breakers for each provider
        this.providers.forEach(p => this.getCircuitBreaker(p.name));

        logger.info(`AI Service initialized with ${this.providers.length} provider(s): ${this.providers.map(p => p.name).join(', ')}`);
    }


    /**
     * Generate content with automatic fallback, circuit breaker, and retry
     */
    async generate(prompt: string, options?: {
        format?: 'text' | 'json';
        maxRetries?: number;
        articleId?: string;
        operation?: 'generate' | 'proofread' | 'translate' | 'summarize' | 'analyze' | 'other';
        skipBudgetCheck?: boolean;
    }): Promise<string> {
        this.ensureInitialized();
        const { 
            format = 'text', 
            maxRetries = 3, 
            articleId,
            operation = 'generate',
            skipBudgetCheck = false
        } = options || {};
        
        // Check budget before generation (unless skipped)
        if (this.budgetCheckEnabled && !skipBudgetCheck) {
            try {
                const budgetStatus = await this.budgetGovernor.checkBudget();
                if (!budgetStatus.canGenerate) {
                    const errorMsg = `Budget exceeded: ${budgetStatus.reason || 'Daily limit reached'}`;
                    logger.warn(errorMsg);
                    throw new Error(errorMsg);
                }
            } catch (error: any) {
                // Only throw if it's a budget error, not a connection error
                if (error.message?.includes('Budget exceeded')) {
                    throw error;
                }
                // Log but continue if budget check fails (fail open)
                logger.warn('Budget check failed, continuing with generation', error);
            }
        }
        
        // Enforce JSON structure in prompt if requested
        let finalPrompt = prompt;
        if (format === 'json') {
            finalPrompt += `\n\nCRITICAL INSTRUCTION: Return ONLY valid JSON. Do not use Markdown code blocks (no \`\`\`json). Do not add any conversational text. Start with { and end with }.`;
        }
        
        let lastError: Error | null = null;
        const attemptedProviders: string[] = [];
        const startTime = Date.now();

        // Try each provider in sequence with circuit breaker and retry
        for (let i = 0; i < this.providers.length; i++) {
            const provider = this.providers[this.currentProviderIndex];
            const circuitBreaker = this.getCircuitBreaker(provider.name);
            
            if (!provider.isAvailable()) {
                this.moveToNextProvider();
                continue;
            }
            
            // Skip if circuit breaker is open
            if (circuitBreaker.getState() === 'open') {
                logger.info(`⏭️ Skipping ${provider.name} - circuit breaker open`);
                this.moveToNextProvider();
                continue;
            }

            try {
                logger.info(`Attempting generation with ${provider.name}...`);
                attemptedProviders.push(provider.name);
                
                // Use circuit breaker with retry logic
                const response = await circuitBreaker.execute(async () => {
                    return retry(
                        () => provider.generate(finalPrompt),
                        {
                            maxRetries,
                            delay: 1000,
                            backoff: 'exponential',
                            onRetry: (attempt, error) => {
                                logger.info(`Retry ${attempt}/${maxRetries} for ${provider.name}: ${error.message}`);
                            }
                        }
                    );
                });
                
                // Validate JSON if required
                if (format === 'json') {
                    JSON.parse(response.content); // Will throw if invalid
                }
                
                const duration = Date.now() - startTime;
                logger.info(`✅ Successfully generated with ${provider.name} in ${duration}ms`);
                
                // Track cost asynchronously (don't block response)
                this.trackCost(response, articleId, operation, duration).catch(err => {
                    logger.warn('Failed to track AI cost', err);
                });
                
                return response.content;
                
            } catch (error: any) {
                lastError = error;
                
                // Check if circuit breaker opened
                if (error.message === 'Circuit breaker is open') {
                    logger.info(`⏭️ ${provider.name} circuit breaker is open, moving to next provider`);
                } else {
                    logger.warn(`❌ ${provider.name} failed:`, error.message);
                }
                
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
     * Track AI cost asynchronously
     */
    private async trackCost(
        response: AIResponse,
        articleId?: string,
        operation: 'generate' | 'proofread' | 'translate' | 'summarize' | 'analyze' | 'other' = 'generate',
        durationMs?: number
    ): Promise<void> {
        try {
            const cost = calculateCostFromTokens(
                response.provider,
                response.model,
                response.inputTokens,
                response.outputTokens
            );
            
            await logAICost({
                article_id: articleId,
                provider: response.provider,
                model: response.model,
                operation,
                input_tokens: response.inputTokens,
                output_tokens: response.outputTokens,
                cost_usd: cost,
                duration_ms: durationMs
            });
            
            // Also record to budget governor for daily tracking
            if (articleId) {
                await this.budgetGovernor.recordCost(
                    articleId,
                    response.inputTokens + response.outputTokens,
                    cost,
                    response.provider,
                    response.model
                );
            }
            
            logger.debug('AI cost tracked', {
                provider: response.provider,
                tokens: response.inputTokens + response.outputTokens,
                cost: cost.toFixed(6)
            });
        } catch (error) {
            logger.warn('Failed to track AI cost', error as Error);
        }
    }
    
    /**
     * Enable/disable budget checking (useful for tests)
     */
    setBudgetCheckEnabled(enabled: boolean): void {
        this.budgetCheckEnabled = enabled;
    }
    
    /**
     * Get circuit breaker states for monitoring
     */
    getCircuitBreakerStates(): Record<string, 'closed' | 'open' | 'half-open'> {
        const states: Record<string, 'closed' | 'open' | 'half-open'> = {};
        this.circuitBreakers.forEach((cb, name) => {
            states[name] = cb.getState();
        });
        return states;
    }
    
    /**
     * Check budget status
     */
    async checkBudget(): Promise<BudgetStatus> {
        return this.budgetGovernor.checkBudget();
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
     * Get service status including circuit breaker states
     */
    getStatus() {
        this.ensureInitialized();
        return {
            totalProviders: this.providers.length,
            activeProviders: this.providers.filter(p => p.isAvailable()).map(p => p.name),
            currentProvider: this.providers[this.currentProviderIndex]?.name,
            circuitBreakers: this.getCircuitBreakerStates(),
            budgetCheckEnabled: this.budgetCheckEnabled
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
