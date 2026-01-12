/**
 * Multi-AI Provider System
 * 
 * Supports multiple AI providers:
 * - OpenAI (GPT-4, GPT-3.5)
 * - DeepSeek (Open-source alternative)
 * - Ollama (Local models)
 * - Groq (Ultra-fast inference)
 * - Together AI (Open models)
 * - Hugging Face (Community models)
 * 
 * Automatically selects best provider based on:
 * - Task requirements
 * - Cost optimization
 * - Latency requirements
 * - Quality requirements
 */

import OpenAI from 'openai';
import { Groq } from 'groq-sdk';
import axios from 'axios';

export type AIProvider = 
    | 'openai'
    | 'deepseek'
    | 'ollama'
    | 'groq'
    | 'together'
    | 'huggingface';

export interface GenerationOptions {
    prompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    provider?: AIProvider; // Auto-select if not specified
    priority?: 'cost' | 'speed' | 'quality';
}

export interface GenerationResult {
    content: string;
    provider: AIProvider;
    model: string;
    tokensUsed: number;
    cost: number;
    latency: number;
}

/**
 * Multi-Provider AI Client
 */
export class MultiProviderAI {
    private openai: OpenAI | null = null;
    private groq: Groq | null = null;
    
    constructor() {
        // Initialize OpenAI
        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
        }
        
        // Initialize Groq
        if (process.env.GROQ_API_KEY) {
            this.groq = new Groq({
                apiKey: process.env.GROQ_API_KEY
            });
        }
    }
    
    /**
     * Generate content with automatic provider selection
     */
    async generate(options: GenerationOptions): Promise<GenerationResult> {
        const provider = options.provider || await this.selectBestProvider(options);
        
        switch (provider) {
            case 'openai':
                return this.generateWithOpenAI(options);
            case 'deepseek':
                return this.generateWithDeepSeek(options);
            case 'ollama':
                return this.generateWithOllama(options);
            case 'groq':
                return this.generateWithGroq(options);
            case 'together':
                return this.generateWithTogether(options);
            case 'huggingface':
                return this.generateWithHuggingFace(options);
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }
    
    /**
     * Select best provider based on requirements
     * 
     * STRICT COST-FIRST HIERARCHY:
     * 1. Ollama (Local, Free)
     * 2. DeepSeek (Open-source, Very Low Cost)
     * 3. Groq (Fast, Low Cost)
     * 4. Together AI (Open Models, Low Cost)
     * 5. OpenAI (Only when necessary)
     */
    private async selectBestProvider(options: GenerationOptions): Promise<AIProvider> {
        const priority = options.priority || 'cost'; // Default to cost-first
        
        // STRICT COST-FIRST ROUTING
        if (priority === 'cost') {
            // 1. Try Ollama first (100% free, local)
            if (process.env.OLLAMA_URL) return 'ollama';
            
            // 2. Try DeepSeek (very low cost, open-source)
            if (process.env.DEEPSEEK_API_KEY) return 'deepseek';
            
            // 3. Try Groq (low cost, fast)
            if (process.env.GROQ_API_KEY) return 'groq';
            
            // 4. Try Together AI (low cost, open models)
            if (process.env.TOGETHER_API_KEY) return 'together';
            
            // 5. Last resort: OpenAI (expensive)
            if (process.env.OPENAI_API_KEY) return 'openai';
            
            // Fallback
            return 'ollama';
        }
        
        // Speed-optimized: Use fastest providers (still cost-aware)
        if (priority === 'speed') {
            if (process.env.GROQ_API_KEY) return 'groq'; // Fastest
            if (process.env.OLLAMA_URL) return 'ollama';
            if (process.env.DEEPSEEK_API_KEY) return 'deepseek';
            if (process.env.TOGETHER_API_KEY) return 'together';
            if (process.env.OPENAI_API_KEY) return 'openai';
            return 'groq';
        }
        
        // Quality-optimized: Use best models (cost-aware)
        if (priority === 'quality') {
            // Only use expensive models for final drafts or high-value content
            // Check if this is a final draft or high-value content
            const isHighValue = (options as any).isHighValue || false;
            const isFinalDraft = (options as any).isFinalDraft || false;
            
            if (isHighValue || isFinalDraft) {
                // Use best available
                if (process.env.OPENAI_API_KEY) return 'openai';
                if (process.env.DEEPSEEK_API_KEY) return 'deepseek';
                if (process.env.GROQ_API_KEY) return 'groq';
            } else {
                // Use cheaper models for drafts
                if (process.env.DEEPSEEK_API_KEY) return 'deepseek';
                if (process.env.OLLAMA_URL) return 'ollama';
                if (process.env.GROQ_API_KEY) return 'groq';
                if (process.env.OPENAI_API_KEY) return 'openai';
            }
            
            return 'deepseek'; // Fallback
        }
        
        // Default: Cost-first
        return this.selectBestProvider({ ...options, priority: 'cost' });
    }
    
    /**
     * Generate with OpenAI
     */
    private async generateWithOpenAI(options: GenerationOptions): Promise<GenerationResult> {
        if (!this.openai) {
            throw new Error('OpenAI API key not configured');
        }
        
        const startTime = Date.now();
        const model = options.model || 'gpt-4-turbo-preview';
        
        const response = await this.openai.chat.completions.create({
            model,
            messages: [{ role: 'user', content: options.prompt }],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 2000
        });
        
        const latency = Date.now() - startTime;
        const content = response.choices[0]?.message?.content || '';
        const tokensUsed = response.usage?.total_tokens || 0;
        
        // Calculate cost (approximate)
        const cost = this.calculateOpenAICost(model, tokensUsed);
        
        return {
            content,
            provider: 'openai',
            model,
            tokensUsed,
            cost,
            latency
        };
    }
    
    /**
     * Generate with DeepSeek
     */
    private async generateWithDeepSeek(options: GenerationOptions): Promise<GenerationResult> {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            throw new Error('DeepSeek API key not configured');
        }
        
        const startTime = Date.now();
        const model = options.model || 'deepseek-chat';
        
        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
                model,
                messages: [{ role: 'user', content: options.prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const latency = Date.now() - startTime;
        const content = response.data.choices[0]?.message?.content || '';
        const tokensUsed = response.data.usage?.total_tokens || 0;
        
        // DeepSeek is free/low-cost
        const cost = tokensUsed * 0.0001; // Very low cost
        
        return {
            content,
            provider: 'deepseek',
            model,
            tokensUsed,
            cost,
            latency
        };
    }
    
    /**
     * Generate with Ollama (Local)
     */
    private async generateWithOllama(options: GenerationOptions): Promise<GenerationResult> {
        const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
        const model = options.model || 'llama3.1:70b';
        
        const startTime = Date.now();
        
        const response = await axios.post(
            `${ollamaUrl}/api/generate`,
            {
                model,
                prompt: options.prompt,
                stream: false,
                options: {
                    temperature: options.temperature || 0.7,
                    num_predict: options.maxTokens || 2000
                }
            }
        );
        
        const latency = Date.now() - startTime;
        const content = response.data.response || '';
        const tokensUsed = response.data.eval_count || 0;
        
        // Ollama is free (local)
        const cost = 0;
        
        return {
            content,
            provider: 'ollama',
            model,
            tokensUsed,
            cost,
            latency
        };
    }
    
    /**
     * Generate with Groq
     */
    private async generateWithGroq(options: GenerationOptions): Promise<GenerationResult> {
        if (!this.groq) {
            throw new Error('Groq API key not configured');
        }
        
        const startTime = Date.now();
        const model = options.model || 'llama-3.1-70b-versatile';
        
        const response = await this.groq.chat.completions.create({
            model,
            messages: [{ role: 'user', content: options.prompt }],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 2000
        });
        
        const latency = Date.now() - startTime;
        const content = response.choices[0]?.message?.content || '';
        const tokensUsed = response.usage?.total_tokens || 0;
        
        // Groq is free/low-cost
        const cost = tokensUsed * 0.00005; // Very low cost
        
        return {
            content,
            provider: 'groq',
            model,
            tokensUsed,
            cost,
            latency
        };
    }
    
    /**
     * Generate with Together AI
     */
    private async generateWithTogether(options: GenerationOptions): Promise<GenerationResult> {
        const apiKey = process.env.TOGETHER_API_KEY;
        if (!apiKey) {
            throw new Error('Together AI API key not configured');
        }
        
        const startTime = Date.now();
        const model = options.model || 'mistralai/Mixtral-8x7B-Instruct-v0.1';
        
        const response = await axios.post(
            'https://api.together.xyz/v1/chat/completions',
            {
                model,
                messages: [{ role: 'user', content: options.prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const latency = Date.now() - startTime;
        const content = response.data.choices[0]?.message?.content || '';
        const tokensUsed = response.data.usage?.total_tokens || 0;
        
        // Together AI pricing varies by model
        const cost = tokensUsed * 0.0002; // Approximate
        
        return {
            content,
            provider: 'together',
            model,
            tokensUsed,
            cost,
            latency
        };
    }
    
    /**
     * Generate with Hugging Face
     */
    private async generateWithHuggingFace(options: GenerationOptions): Promise<GenerationResult> {
        const apiKey = process.env.HUGGINGFACE_API_KEY;
        if (!apiKey) {
            throw new Error('Hugging Face API key not configured');
        }
        
        const startTime = Date.now();
        const model = options.model || 'mistralai/Mistral-7B-Instruct-v0.2';
        
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            {
                inputs: options.prompt,
                parameters: {
                    temperature: options.temperature || 0.7,
                    max_new_tokens: options.maxTokens || 2000
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const latency = Date.now() - startTime;
        const content = Array.isArray(response.data) 
            ? response.data[0]?.generated_text || ''
            : response.data.generated_text || '';
        const tokensUsed = content.split(' ').length; // Approximate
        
        // Hugging Face has free tier
        const cost = tokensUsed * 0.0001; // Very low cost
        
        return {
            content,
            provider: 'huggingface',
            model,
            tokensUsed,
            cost,
            latency
        };
    }
    
    /**
     * Calculate OpenAI cost
     */
    private calculateOpenAICost(model: string, tokens: number): number {
        const costs: Record<string, { input: number; output: number }> = {
            'gpt-4-turbo-preview': { input: 0.01 / 1000, output: 0.03 / 1000 },
            'gpt-4': { input: 0.03 / 1000, output: 0.06 / 1000 },
            'gpt-3.5-turbo': { input: 0.0005 / 1000, output: 0.0015 / 1000 }
        };
        
        const modelCost = costs[model] || costs['gpt-3.5-turbo'];
        // Approximate: 70% input, 30% output
        return (tokens * 0.7 * modelCost.input) + (tokens * 0.3 * modelCost.output);
    }
}

// Export singleton instance
export const multiProviderAI = new MultiProviderAI();
