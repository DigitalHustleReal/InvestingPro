/**
 * Tone Management System
 * 
 * Intelligently sets tone based on:
 * - Content purpose (persuasive money content vs educational)
 * - Content type (comparison, how-to, ultimate guide, listicle)
 * - Category (credit-cards, mutual-funds, etc.)
 * - Monetization intent (affiliate products, application flow)
 * 
 * TONE MAPPING:
 * - Money/Persuasive Content → Urgent/Authoritative (drive action)
 * - Educational Content → Educational/Conversational (teach, explain)
 * - Comparison Content → Analytical (objective, data-driven)
 * - How-To Content → Educational (step-by-step)
 * - Product Reviews → Authoritative (expert opinion)
 */

import { ToneType, TONE_CONFIGS, type ToneConfig } from './content-schema';
import type { FinanceCategory } from '@/lib/prompts/category-prompts';

export type ContentPurpose = 
    | 'persuasive'      // Drive action (apply, buy, invest)
    | 'educational'     // Teach, explain, inform
    | 'comparison'      // Compare products/services
    | 'analytical'      // Data-driven analysis
    | 'reassuring';     // Build trust, calm concerns

export type ContentIntent =
    | 'monetization'    // Affiliate products, application flow
    | 'education'      // Pure educational content
    | 'decision-making' // Help user decide
    | 'awareness';      // Build awareness

export interface ToneMapping {
    purpose: ContentPurpose;
    intent: ContentIntent;
    contentType: string;
    category?: FinanceCategory;
    recommendedTone: ToneType;
    alternativeTones: ToneType[];
    reasoning: string;
}

/**
 * Content Purpose → Tone Mapping
 */
const PURPOSE_TONE_MAP: Record<ContentPurpose, ToneType[]> = {
    persuasive: ['urgent', 'authoritative', 'conversational'],
    educational: ['educational', 'conversational', 'reassuring'],
    comparison: ['analytical', 'authoritative', 'educational'],
    analytical: ['analytical', 'authoritative', 'educational'],
    reassuring: ['reassuring', 'educational', 'conversational']
};

/**
 * Content Intent → Tone Mapping
 */
const INTENT_TONE_MAP: Record<ContentIntent, ToneType[]> = {
    monetization: ['urgent', 'authoritative', 'conversational'],
    education: ['educational', 'conversational', 'reassuring'],
    'decision-making': ['analytical', 'authoritative', 'educational'],
    awareness: ['educational', 'conversational', 'reassuring']
};

/**
 * Content Type → Tone Mapping
 */
const CONTENT_TYPE_TONE_MAP: Record<string, ToneType[]> = {
    comparison: ['analytical', 'authoritative'],
    howto: ['educational', 'conversational'],
    ultimate: ['authoritative', 'educational'],
    listicle: ['conversational', 'educational'],
    review: ['authoritative', 'analytical'],
    guide: ['educational', 'conversational']
};

/**
 * Category → Default Tone Preferences
 */
const CATEGORY_TONE_PREFERENCES: Partial<Record<FinanceCategory, ToneType[]>> = {
    'credit-cards': ['conversational', 'authoritative', 'urgent'],
    'mutual-funds': ['educational', 'reassuring', 'analytical'],
    'loans': ['reassuring', 'educational', 'authoritative'],
    'insurance': ['reassuring', 'educational', 'authoritative'],
    'tax': ['authoritative', 'educational', 'analytical'],
    'stocks': ['analytical', 'authoritative', 'educational'],
    'banking': ['conversational', 'educational', 'authoritative'],
    'fixed-deposits': ['reassuring', 'educational', 'conversational'],
    'nps-ppf': ['educational', 'reassuring', 'authoritative'],
    'gold': ['reassuring', 'educational', 'conversational'],
    'real-estate': ['authoritative', 'analytical', 'educational'],
    'investing-basics': ['educational', 'conversational', 'reassuring']
};

/**
 * Determine optimal tone based on multiple factors
 */
export function determineOptimalTone(params: {
    purpose?: ContentPurpose;
    intent?: ContentIntent;
    contentType?: string;
    category?: FinanceCategory;
    hasAffiliateProducts?: boolean;
    hasApplicationFlow?: boolean;
    isMonetizationFocused?: boolean;
}): ToneType {
    const {
        purpose,
        intent,
        contentType,
        category,
        hasAffiliateProducts = false,
        hasApplicationFlow = false,
        isMonetizationFocused = false
    } = params;

    // Priority 1: Monetization intent → Persuasive tones
    if (isMonetizationFocused || hasAffiliateProducts || hasApplicationFlow) {
        return 'urgent'; // Drive action
    }

    // Priority 2: Explicit purpose
    if (purpose) {
        const tones = PURPOSE_TONE_MAP[purpose];
        return tones[0]; // Primary tone
    }

    // Priority 3: Explicit intent
    if (intent) {
        const tones = INTENT_TONE_MAP[intent];
        return tones[0]; // Primary tone
    }

    // Priority 4: Content type
    if (contentType) {
        const tones = CONTENT_TYPE_TONE_MAP[contentType];
        if (tones) {
            return tones[0];
        }
    }

    // Priority 5: Category default
    if (category && CATEGORY_TONE_PREFERENCES[category]) {
        return CATEGORY_TONE_PREFERENCES[category]![0];
    }

    // Default: Educational (safest, most neutral)
    return 'educational';
}

/**
 * Get tone configuration with reasoning
 */
export function getToneConfig(
    tone: ToneType,
    purpose?: ContentPurpose,
    intent?: ContentIntent
): ToneConfig & { reasoning: string } {
    const config = TONE_CONFIGS[tone];
    
    let reasoning = `Using ${tone} tone`;
    
    if (purpose) {
        reasoning += ` for ${purpose} content`;
    }
    
    if (intent) {
        reasoning += ` with ${intent} intent`;
    }
    
    return {
        ...config,
        reasoning
    };
}

/**
 * Build tone-specific prompt instructions
 */
export function buildToneInstructions(
    tone: ToneType,
    purpose?: ContentPurpose,
    intent?: ContentIntent,
    category?: FinanceCategory
): string {
    const config = TONE_CONFIGS[tone];
    
    let instructions = `\nTONE & VOICE REQUIREMENTS:\n`;
    instructions += `Primary Tone: ${config.tone}\n`;
    instructions += `Description: ${config.description}\n\n`;
    
    instructions += `VOICE CHARACTERISTICS:\n`;
    config.voiceCharacteristics.forEach(char => {
        instructions += `- ${char}\n`;
    });
    
    instructions += `\nDO:\n`;
    config.doList.forEach(item => {
        instructions += `- ${item}\n`;
    });
    
    instructions += `\nDON'T:\n`;
    config.dontList.forEach(item => {
        instructions += `- ${item}\n`;
    });
    
    // Add purpose-specific instructions
    if (purpose === 'persuasive' || intent === 'monetization') {
        instructions += `\nPERSUASIVE ELEMENTS:\n`;
        instructions += `- Highlight benefits and value proposition\n`;
        instructions += `- Include clear call-to-action (CTA)\n`;
        instructions += `- Use social proof and data to build trust\n`;
        instructions += `- Create urgency where appropriate (deadlines, limited offers)\n`;
        instructions += `- Make it easy to take action (application flow, calculators)\n`;
    }
    
    if (purpose === 'educational' || intent === 'education') {
        instructions += `\nEDUCATIONAL ELEMENTS:\n`;
        instructions += `- Explain concepts step-by-step\n`;
        instructions += `- Use simple analogies and examples\n`;
        instructions += `- Define jargon immediately\n`;
        instructions += `- Encourage questions and exploration\n`;
        instructions += `- Focus on understanding, not selling\n`;
    }
    
    if (purpose === 'comparison' || contentType === 'comparison') {
        instructions += `\nCOMPARISON ELEMENTS:\n`;
        instructions += `- Present both sides fairly\n`;
        instructions += `- Use data and tables for clarity\n`;
        instructions += `- Let readers make their own decision\n`;
        instructions += `- Highlight pros and cons objectively\n`;
    }
    
    // Add category-specific tone adjustments
    if (category === 'credit-cards' && (purpose === 'persuasive' || intent === 'monetization')) {
        instructions += `\nCREDIT CARD PERSUASIVE ELEMENTS:\n`;
        instructions += `- Emphasize rewards and benefits\n`;
        instructions += `- Show real value calculations (₹ saved, points earned)\n`;
        instructions += `- Highlight eligibility and easy application\n`;
        instructions += `- Use urgency for limited-time offers\n`;
    }
    
    if (category === 'mutual-funds' && (purpose === 'educational' || intent === 'education')) {
        instructions += `\nMUTUAL FUND EDUCATIONAL ELEMENTS:\n`;
        instructions += `- Explain SIP benefits with examples\n`;
        instructions += `- Show long-term wealth creation potential\n`;
        instructions += `- Address common fears (market volatility, risk)\n`;
        instructions += `- Encourage starting small (₹500/month)\n`;
    }
    
    instructions += `\nEXAMPLE TONE:\n`;
    instructions += `"${config.examplePhrase}"\n`;
    
    return instructions;
}

/**
 * Get all recommended tones for a given context
 */
export function getRecommendedTones(params: {
    purpose?: ContentPurpose;
    intent?: ContentIntent;
    contentType?: string;
    category?: FinanceCategory;
}): ToneType[] {
    const { purpose, intent, contentType, category } = params;
    
    const tones: Set<ToneType> = new Set();
    
    // Add purpose-based tones
    if (purpose) {
        PURPOSE_TONE_MAP[purpose].forEach(tone => tones.add(tone));
    }
    
    // Add intent-based tones
    if (intent) {
        INTENT_TONE_MAP[intent].forEach(tone => tones.add(tone));
    }
    
    // Add content-type tones
    if (contentType && CONTENT_TYPE_TONE_MAP[contentType]) {
        CONTENT_TYPE_TONE_MAP[contentType].forEach(tone => tones.add(tone));
    }
    
    // Add category preferences
    if (category && CATEGORY_TONE_PREFERENCES[category]) {
        CATEGORY_TONE_PREFERENCES[category]!.forEach(tone => tones.add(tone));
    }
    
    // If no matches, return educational as default
    if (tones.size === 0) {
        return ['educational', 'conversational'];
    }
    
    return Array.from(tones);
}

/**
 * Validate tone appropriateness for context
 */
export function isToneAppropriate(
    tone: ToneType,
    purpose?: ContentPurpose,
    intent?: ContentIntent
): boolean {
    if (!purpose && !intent) {
        return true; // No constraints
    }
    
    const recommendedTones = getRecommendedTones({ purpose, intent });
    return recommendedTones.includes(tone);
}

/**
 * Get tone adjustment suggestions
 */
export function getToneAdjustments(
    currentTone: ToneType,
    targetPurpose: ContentPurpose,
    targetIntent: ContentIntent
): string[] {
    const adjustments: string[] = [];
    const targetTone = determineOptimalTone({ purpose: targetPurpose, intent: targetIntent });
    
    if (currentTone !== targetTone) {
        adjustments.push(`Consider switching from ${currentTone} to ${targetTone} tone`);
        
        const currentConfig = TONE_CONFIGS[currentTone];
        const targetConfig = TONE_CONFIGS[targetTone];
        
        // Suggest specific adjustments
        if (targetPurpose === 'persuasive' && currentTone !== 'urgent' && currentTone !== 'authoritative') {
            adjustments.push('Add urgency elements: deadlines, limited offers, clear CTAs');
        }
        
        if (targetPurpose === 'educational' && currentTone !== 'educational') {
            adjustments.push('Add educational elements: step-by-step explanations, analogies, examples');
        }
        
        if (targetIntent === 'monetization' && currentTone !== 'urgent') {
            adjustments.push('Emphasize value proposition and make action easy (application flow, calculators)');
        }
    }
    
    return adjustments;
}
