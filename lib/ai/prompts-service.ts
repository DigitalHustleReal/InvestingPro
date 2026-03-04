/**
 * Prompts Service
 * 
 * Manages AI prompts from database for centralized
 * prompt management, versioning, and A/B testing
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export interface PromptConfig {
  id: string;
  user_prompt_template: string;
  system_prompt: string | null;
  preferred_model: string;
  temperature: number;
  max_tokens: number;
  output_format: 'text' | 'json' | 'markdown';
  json_schema: Record<string, any> | null;
}

export interface PromptVariables {
  [key: string]: string | number | string[];
}

/**
 * Get a prompt configuration by slug
 */
export async function getPrompt(slug: string): Promise<PromptConfig | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc('get_prompt', { prompt_slug: slug });
  
  if (error || !data || data.length === 0) {
    logger.error('[PROMPTS] Error fetching prompt:', error?.message || 'Not found');
    return null;
  }
  
  return data[0] as PromptConfig;
}

/**
 * Interpolate variables into a prompt template
 * Template uses {{variable_name}} syntax
 */
export function interpolatePrompt(
  template: string,
  variables: PromptVariables
): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    const stringValue = Array.isArray(value) ? value.join(', ') : String(value);
    result = result.replace(new RegExp(placeholder, 'g'), stringValue);
  }
  
  return result;
}

/**
 * Get a ready-to-use prompt with variables filled in
 */
export async function getReadyPrompt(
  slug: string,
  variables: PromptVariables
): Promise<{
  userPrompt: string;
  systemPrompt: string | null;
  config: PromptConfig;
} | null> {
  const promptConfig = await getPrompt(slug);
  
  if (!promptConfig) {
    return null;
  }
  
  return {
    userPrompt: interpolatePrompt(promptConfig.user_prompt_template, variables),
    systemPrompt: promptConfig.system_prompt 
      ? interpolatePrompt(promptConfig.system_prompt, variables)
      : null,
    config: promptConfig,
  };
}

/**
 * Record successful prompt execution
 */
export async function recordPromptSuccess(
  promptId: string,
  latencyMs: number
): Promise<void> {
  const supabase = await createClient();
  
  await supabase.rpc('record_prompt_success', {
    prompt_id: promptId,
    latency_ms: latencyMs,
  });
}

/**
 * Fallback prompts when database is not available
 */
export const FALLBACK_PROMPTS: Record<string, string> = {
  'article-generator': `Write a comprehensive SEO-optimized article about: {{topic}}

Target keywords: {{keywords}}

Requirements:
- 1500+ words
- Include key takeaways
- Include FAQ section
- Use Indian context

Return as JSON with: title, meta_description, content, headings, key_takeaways, faq`,

  'product-generator': `Generate realistic financial product data for "{{product_name}}" in India.
Category: {{category}}

Return as JSON with: name, provider_name, description, rating, features, pros, cons, official_link`,

  'glossary-generator': `Define the financial term: "{{term}}"

Return as JSON with: term, simple_definition, detailed_explanation, example, related_terms`,

  'seo-meta-generator': `Generate SEO metadata for: {{topic}}

Return as JSON with: title, meta_description, og_title, og_description, keywords`,
};

/**
 * Get prompt with fallback to hardcoded version
 */
export async function getPromptWithFallback(
  slug: string,
  variables: PromptVariables
): Promise<string> {
  // Try database first
  const dbPrompt = await getReadyPrompt(slug, variables);
  if (dbPrompt) {
    return dbPrompt.userPrompt;
  }
  
  // Fallback to hardcoded
  const fallback = FALLBACK_PROMPTS[slug];
  if (fallback) {
    return interpolatePrompt(fallback, variables);
  }
  
  throw new Error(`Prompt not found: ${slug}`);
}

/**
 * List all active prompts
 */
export async function listPrompts(category?: string): Promise<any[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('prompts')
    .select('id, name, slug, category, description, usage_count, success_count, updated_at')
    .eq('is_active', true)
    .order('usage_count', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) {
    logger.error('[PROMPTS] Error listing prompts:', error);
    return [];
  }
  
  return data || [];
}

export default {
  getPrompt,
  getReadyPrompt,
  getPromptWithFallback,
  recordPromptSuccess,
  interpolatePrompt,
  listPrompts,
  FALLBACK_PROMPTS,
};
