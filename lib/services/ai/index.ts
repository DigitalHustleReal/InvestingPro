/**
 * AI Services Index
 * 
 * Purpose: Central export point for all AI services
 */

export { openAIService } from './openai.service';
export { groqService } from './groq.service';
export { mistralService } from './mistral.service';
export { deepSeekService } from './deepseek.service';
export { togetherAIService } from './together.service';
export { aiOrchestrator } from './ai-orchestrator.service';

/**
 * Usage:
 * 
 * import { aiOrchestrator } from '@/lib/services/ai';
 * 
 * const response = await aiOrchestrator.invoke({
 *   prompt: 'Generate article about credit cards',
 *   operation: 'article_generation'
 * });
 */
