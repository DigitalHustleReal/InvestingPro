/**
 * Dynamic Prompt Builder
 * 
 * Combines writer-specific, category-specific, subcategory-specific, and
 * content-type prompts to create optimized prompts for AI content generation.
 * 
 * Priority Order: Writer > Subcategory > Category > Content-Type
 */

import { getAuthorSystemPrompt, getAuthorForCategory, type AuthorPersona } from '@/lib/content/author-personas';
import { getCategoryPrompt, type FinanceCategory } from '@/lib/prompts/category-prompts';
import { ContentTemplate, selectTemplate, type ContentTemplate as TemplateType } from '@/lib/templates/content-templates';
import { 
    determineOptimalTone, 
    buildToneInstructions,
    type ContentPurpose,
    type ContentIntent 
} from '@/lib/content/tone-manager';

export type ContentType = 'comparison' | 'howto' | 'ultimate' | 'listicle';

export interface PromptBuilderParams {
    contentType: ContentType;
    category: FinanceCategory;
    subcategory?: string;
    writerId?: string;
    topic: string;
    keywords?: string[];
    targetAudience?: string;
    wordCount?: number;
    // Tone management
    purpose?: ContentPurpose; // persuasive, educational, comparison, etc.
    intent?: ContentIntent; // monetization, education, decision-making, awareness
    hasAffiliateProducts?: boolean;
    hasApplicationFlow?: boolean;
    customTone?: string; // Override tone if needed
}

export interface CombinedPrompt {
    systemPrompt: string;
    userPrompt: string;
    metadata: {
        writer: string;
        category: string;
        subcategory?: string;
        contentType: string;
        templateId: string;
    };
}

/**
 * Subcategory-specific prompts
 * These provide additional focus for specific subcategories within categories
 */
const SUBCATEGORY_PROMPTS: Record<string, Record<string, string>> = {
    'credit-cards': {
        'travel': `Focus on travel rewards, lounge access, miles, international transactions.
        
SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize travel benefits: airport lounge access, miles/points on travel bookings
- Mention international transaction fees (or lack thereof)
- Include examples: "4 domestic lounge visits", "2x miles on travel bookings", "Airport meet & greet"
- Explain miles redemption, transfer partners
- Mention travel insurance benefits, lost baggage coverage
- Include hotel/airline partnerships

KEYWORDS TO EMPHASIZE: travel rewards, lounge access, miles, airport benefits, international travel, travel insurance`,

        'cashback': `Focus on cashback rates, spending categories, redemption options.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize cashback percentages on different spending categories
- Mention cashback caps, monthly limits
- Include examples: "5% cashback on groceries", "₹500 cashback per month", "1% on all other spends"
- Explain cashback redemption: statement credit, bank transfer, gift vouchers
- Mention category-specific cashback (dining, fuel, online shopping)
- Include cashback calculation examples

KEYWORDS TO EMPHASIZE: cashback, spending categories, redemption, statement credit, monthly cap`,

        'premium': `Focus on premium benefits, concierge services, high credit limits.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize premium lifestyle benefits: concierge, airport meet & greet, hotel upgrades
- Mention high credit limits, exclusive offers
- Include examples: "₹5 lakh credit limit", "24/7 concierge service", "Complimentary hotel stays"
- Explain premium card features: travel insurance, purchase protection, extended warranty
- Mention annual fee justification through benefits
- Include eligibility requirements (high income, existing relationship)

KEYWORDS TO EMPHASIZE: premium, concierge, high credit limit, exclusive benefits, lifestyle perks`,

        'rewards': `Focus on reward points, redemption options, point value.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize reward point earning rates
- Mention point redemption options: flights, hotels, gift vouchers, statement credit
- Include examples: "4 points per ₹150 spent", "1 point = ₹0.25 value", "Transfer to airline partners"
- Explain point expiry policies, transfer partners
- Mention welcome bonus points, milestone benefits
- Include point value calculations

KEYWORDS TO EMPHASIZE: reward points, redemption, point value, transfer partners, welcome bonus`,

        'shopping': `Focus on shopping benefits, online/offline discounts, partner merchants.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize shopping discounts, cashback on partner merchants
- Mention online shopping benefits, EMI options
- Include examples: "10% off on partner merchants", "No-cost EMI on purchases above ₹5,000"
- Explain shopping protection: extended warranty, price protection
- Mention seasonal offers, sale period benefits
- Include merchant partnerships

KEYWORDS TO EMPHASIZE: shopping, discounts, partner merchants, EMI, online shopping, offers`,

        'fuel': `Focus on fuel spending, fuel surcharge waiver, fuel rewards.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize fuel surcharge waiver benefits
- Mention fuel reward rates, redemption
- Include examples: "1% fuel surcharge waiver", "4% rewards on fuel spends", "Up to ₹400 fuel surcharge waiver per month"
- Explain fuel station partnerships
- Mention minimum transaction amounts, caps
- Include fuel expense calculations

KEYWORDS TO EMPHASIZE: fuel, surcharge waiver, fuel rewards, petrol pump, diesel`,

        'lifetime_free': `Focus on no annual fee, lifetime free benefits, value proposition.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize lifetime free nature, no annual fee
- Mention basic rewards, benefits despite being free
- Include examples: "Lifetime free card", "No annual fee ever", "Basic rewards at no cost"
- Explain eligibility requirements (often lower for free cards)
- Mention limitations compared to paid cards
- Include value proposition for beginners

KEYWORDS TO EMPHASIZE: lifetime free, no annual fee, free card, zero fee, basic rewards`
    },

    'mutual-funds': {
        'equity': `Focus on equity funds, stock market exposure, long-term returns.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize equity market exposure, stock investments
- Mention long-term wealth creation potential
- Include examples: "12% annual returns (historical)", "High risk, high returns", "Equity market exposure"
- Explain equity fund categories: large-cap, mid-cap, small-cap, flexi-cap
- Mention market volatility, long-term perspective required
- Include equity allocation recommendations

KEYWORDS TO EMPHASIZE: equity, stocks, long-term, high returns, market exposure, volatility`,

        'debt': `Focus on debt funds, fixed income, stability.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize stability, lower risk compared to equity
- Mention fixed income securities, bonds
- Include examples: "7% annual returns", "Low risk, stable returns", "Fixed income exposure"
- Explain debt fund categories: liquid, short-term, long-term
- Mention interest rate sensitivity
- Include debt allocation for conservative investors

KEYWORDS TO EMPHASIZE: debt, fixed income, stability, low risk, bonds, conservative`,

        'hybrid': `Focus on balanced funds, equity + debt mix.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize balanced approach, equity + debt combination
- Mention moderate risk, balanced returns
- Include examples: "9% annual returns", "Moderate risk", "60% equity, 40% debt"
- Explain hybrid fund categories: balanced advantage, aggressive hybrid, conservative hybrid
- Mention rebalancing benefits
- Include allocation recommendations

KEYWORDS TO EMPHASIZE: hybrid, balanced, equity + debt, moderate risk, balanced returns`,

        'elss': `Focus on tax-saving mutual funds, Section 80C benefits.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize tax benefits under Section 80C
- Mention 3-year lock-in period
- Include examples: "Up to ₹1.5 lakh tax deduction", "3-year lock-in", "ELSS for tax saving"
- Explain equity exposure, long-term wealth creation
- Mention tax-saving + wealth creation combination
- Include ELSS vs other tax-saving options

KEYWORDS TO EMPHASIZE: ELSS, tax saving, Section 80C, lock-in period, tax deduction`,

        'large-cap': `Focus on large-cap funds, blue-chip stocks, stability.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize large-cap companies, blue-chip stocks
- Mention lower volatility, stable returns
- Include examples: "Top 100 companies", "Lower risk", "Stable returns"
- Explain large-cap fund characteristics
- Mention suitability for conservative investors
- Include large-cap allocation recommendations

KEYWORDS TO EMPHASIZE: large-cap, blue-chip, top 100, stability, lower volatility`,

        'mid-cap': `Focus on mid-cap funds, growth potential, moderate risk.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize mid-cap companies, growth potential
- Mention moderate risk, higher returns than large-cap
- Include examples: "101-250 companies", "Growth potential", "Moderate risk"
- Explain mid-cap fund characteristics
- Mention suitability for moderate risk investors
- Include mid-cap allocation recommendations

KEYWORDS TO EMPHASIZE: mid-cap, growth, moderate risk, 101-250 companies`,

        'small-cap': `Focus on small-cap funds, high growth, high risk.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize small-cap companies, high growth potential
- Mention high risk, high returns
- Include examples: "251+ companies", "High growth potential", "High risk"
- Explain small-cap fund characteristics
- Mention suitability for aggressive investors
- Include small-cap allocation recommendations

KEYWORDS TO EMPHASIZE: small-cap, high growth, high risk, 251+ companies, aggressive`
    },

    'loans': {
        'personal': `Focus on personal loans, quick disbursal, unsecured loans.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize quick disbursal, no collateral required
- Mention higher interest rates, flexible usage
- Include examples: "₹50,000 - ₹50 lakh", "12% - 24% interest", "Quick approval"
- Explain personal loan features: no collateral, flexible tenure
- Mention eligibility: income, CIBIL score, employment
- Include use cases: medical emergency, wedding, home renovation

KEYWORDS TO EMPHASIZE: personal loan, unsecured, quick disbursal, no collateral, flexible`,

        'home': `Focus on home loans, property purchase, long tenure.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize property purchase, long tenure options
- Mention lower interest rates, tax benefits
- Include examples: "₹10 lakh - ₹5 crore", "8% - 10% interest", "Up to 30 years tenure"
- Explain home loan features: property as collateral, tax benefits (Section 24, 80C)
- Mention eligibility: income, property value, down payment
- Include home loan process, documentation

KEYWORDS TO EMPHASIZE: home loan, property, long tenure, tax benefits, down payment`,

        'car': `Focus on car loans, vehicle purchase, secured loans.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize vehicle purchase, car as collateral
- Mention competitive interest rates, quick approval
- Include examples: "₹2 lakh - ₹50 lakh", "8% - 12% interest", "Up to 7 years tenure"
- Explain car loan features: vehicle as collateral, lower rates
- Mention eligibility: income, car value, down payment
- Include car loan process, documentation

KEYWORDS TO EMPHASIZE: car loan, vehicle, secured, down payment, quick approval`,

        'education': `Focus on education loans, student financing, moratorium period.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize education financing, student benefits
- Mention lower interest rates, moratorium period
- Include examples: "₹4 lakh - ₹50 lakh", "8% - 12% interest", "Moratorium during course"
- Explain education loan features: moratorium, tax benefits
- Mention eligibility: admission, course, co-applicant
- Include education loan process, documentation

KEYWORDS TO EMPHASIZE: education loan, student, moratorium, tax benefits, course`
    },

    'insurance': {
        'term': `Focus on term insurance, pure protection, high coverage.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize pure protection, high coverage at low cost
- Mention no maturity benefits, death benefit only
- Include examples: "₹1 crore coverage", "₹5,000 - ₹15,000 annual premium", "30-year term"
- Explain term insurance features: pure protection, low premium
- Mention suitability for family protection
- Include term insurance vs other insurance types

KEYWORDS TO EMPHASIZE: term insurance, pure protection, high coverage, low premium, death benefit`,

        'health': `Focus on health insurance, medical coverage, hospitalization.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize medical coverage, hospitalization benefits
- Mention cashless treatment, network hospitals
- Include examples: "₹5 lakh coverage", "₹10,000 - ₹30,000 annual premium", "Cashless treatment"
- Explain health insurance features: hospitalization, pre/post hospitalization
- Mention waiting periods, exclusions
- Include health insurance vs other insurance types

KEYWORDS TO EMPHASIZE: health insurance, medical coverage, hospitalization, cashless, network hospitals`,

        'life': `Focus on life insurance, savings component, maturity benefits.

SUBCATEGORY-SPECIFIC REQUIREMENTS:
- Emphasize life coverage + savings component
- Mention maturity benefits, surrender value
- Include examples: "₹25 lakh coverage", "₹50,000 annual premium", "Maturity benefits"
- Explain life insurance features: protection + savings
- Mention premium payment, policy term
- Include life insurance vs term insurance

KEYWORDS TO EMPHASIZE: life insurance, savings, maturity benefits, surrender value, protection + savings`
    }
};

/**
 * Build dynamic prompt combining writer + category + subcategory + content-type
 */
export async function buildDynamicPrompt(
    params: PromptBuilderParams
): Promise<CombinedPrompt> {
    // Determine optimal tone based on purpose, intent, and context
    const optimalTone = params.customTone 
        ? (params.customTone as any) // Use custom tone if provided
        : determineOptimalTone({
            purpose: params.purpose,
            intent: params.intent,
            contentType: params.contentType,
            category: params.category,
            hasAffiliateProducts: params.hasAffiliateProducts,
            hasApplicationFlow: params.hasApplicationFlow,
            isMonetizationFocused: params.intent === 'monetization' || params.hasAffiliateProducts || params.hasApplicationFlow
        });
    
    // Build tone instructions
    const toneInstructions = buildToneInstructions(
        optimalTone,
        params.purpose,
        params.intent,
        params.category
    );
    
    // 1. Get Writer Prompt (Highest Priority)
    const writer = params.writerId 
        ? getAuthorForCategory(params.category) // Use provided writer or default for category
        : getAuthorForCategory(params.category);
    const writerPrompt = getAuthorSystemPrompt(writer.id);
    
    // 2. Get Category Prompt
    const categoryPrompt = getCategoryPrompt(params.category);
    const categorySystemPrompt = categoryPrompt.system_prompt;
    
    // 3. Get Subcategory Prompt (if provided)
    const subcategoryPrompt = params.subcategory 
        ? SUBCATEGORY_PROMPTS[params.category]?.[params.subcategory] || ''
        : '';
    
    // 4. Get Content-Type Prompt
    const template = selectTemplate(params.contentType);
    const contentTypePrompt = template.system_prompt;
    
    // 5. Combine System Prompts with Priority: Writer > Tone > Subcategory > Category > Content-Type
    const systemPrompt = combineSystemPrompts({
        writer: writerPrompt,
        tone: toneInstructions,
        subcategory: subcategoryPrompt,
        category: categorySystemPrompt,
        contentType: contentTypePrompt
    });
    
    // 6. Build User Prompt with Category-Specific Variables
    const userPrompt = buildUserPrompt({
        template: template.article_prompt_template,
        topic: params.topic,
        keywords: params.keywords || [],
        category: params.category,
        subcategory: params.subcategory,
        categoryExamples: categoryPrompt.examples,
        categoryKeywords: categoryPrompt.keywords,
        categoryRequiredSections: categoryPrompt.required_sections,
        targetAudience: params.targetAudience || 'general',
        wordCount: params.wordCount || template.target_word_count.min,
        tone: optimalTone,
        purpose: params.purpose,
        intent: params.intent
    });
    
    return {
        systemPrompt,
        userPrompt,
        metadata: {
            writer: writer.name,
            category: params.category,
            subcategory: params.subcategory,
            contentType: params.contentType,
            templateId: template.id
        }
    };
}

/**
 * Combine system prompts with priority
 * Priority: Writer > Subcategory > Category > Content-Type
 */
function combineSystemPrompts(prompts: {
    writer: string;
    subcategory: string;
    category: string;
    contentType: string;
}): string {
    const parts: string[] = [];
    
    // Priority order: Writer > Subcategory > Category > Content-Type
    if (prompts.writer) {
        parts.push(`WRITER IDENTITY & VOICE:\n${prompts.writer}\n`);
    }
    
    if (prompts.subcategory) {
        parts.push(`SUBCATEGORY FOCUS:\n${prompts.subcategory}\n`);
    }
    
    if (prompts.category) {
        parts.push(`CATEGORY EXPERTISE:\n${prompts.category}\n`);
    }
    
    if (prompts.contentType) {
        parts.push(`CONTENT TYPE GUIDELINES:\n${prompts.contentType}\n`);
    }
    
    return parts.join('\n---\n\n');
}

/**
 * Build user prompt with category-specific variables
 */
function buildUserPrompt(params: {
    template: string;
    topic: string;
    keywords: string[];
    category: string;
    subcategory?: string;
    categoryExamples: Record<string, string>;
    categoryKeywords: string[];
    categoryRequiredSections: string[];
    targetAudience: string;
    wordCount: number;
    tone?: string;
    purpose?: ContentPurpose;
    intent?: ContentIntent;
}): string {
    // Replace basic template variables
    let prompt = params.template
        .replace(/{title}/g, params.topic)
        .replace(/{topic}/g, params.topic)
        .replace(/{keywords}/g, params.keywords.join(', '))
        .replace(/{audience}/g, params.targetAudience);
    
    // Add category-specific examples
    if (Object.keys(params.categoryExamples).length > 0) {
        prompt += `\n\nCATEGORY-SPECIFIC EXAMPLES TO USE:\n`;
        for (const [key, value] of Object.entries(params.categoryExamples)) {
            prompt += `- ${key.replace(/_/g, ' ').toUpperCase()}: ${value}\n`;
        }
    }
    
    // Add category-specific keywords
    if (params.categoryKeywords.length > 0) {
        prompt += `\n\nCATEGORY-SPECIFIC KEYWORDS TO INCLUDE (naturally):\n`;
        prompt += params.categoryKeywords.map(k => `- ${k}`).join('\n');
    }
    
    // Add required sections
    if (params.categoryRequiredSections.length > 0) {
        prompt += `\n\nREQUIRED SECTIONS FOR THIS CATEGORY:\n`;
        prompt += params.categoryRequiredSections.map(s => `- ${s}`).join('\n');
    }
    
    // Add subcategory-specific focus
    if (params.subcategory) {
        prompt += `\n\nSUBCATEGORY FOCUS: ${params.subcategory.toUpperCase()}\n`;
        prompt += `Ensure content emphasizes ${params.subcategory}-specific features and benefits.\n`;
    }
    
    // Add word count requirement
    prompt += `\n\nWORD COUNT REQUIREMENT: Minimum ${params.wordCount} words. This is mandatory, not a suggestion.`;
    
    // Add tone-specific reminders
    if (params.tone) {
        if (params.purpose === 'persuasive' || params.intent === 'monetization') {
            prompt += `\n\nIMPORTANT: This content should drive action. Include clear CTAs, highlight value proposition, and make it easy for readers to apply or take the next step.`;
        }
        
        if (params.purpose === 'educational' || params.intent === 'education') {
            prompt += `\n\nIMPORTANT: This content should educate and inform. Focus on explaining concepts clearly, use examples, and help readers understand rather than sell.`;
        }
    }
    
    return prompt;
}

/**
 * Get subcategory prompt for a category
 */
export function getSubcategoryPrompt(
    category: FinanceCategory,
    subcategory: string
): string | null {
    return SUBCATEGORY_PROMPTS[category]?.[subcategory] || null;
}

/**
 * Get all subcategories for a category
 */
export function getSubcategoriesForCategory(category: FinanceCategory): string[] {
    return Object.keys(SUBCATEGORY_PROMPTS[category] || {});
}

/**
 * Validate subcategory for category
 */
export function isValidSubcategory(
    category: FinanceCategory,
    subcategory: string
): boolean {
    return subcategory in (SUBCATEGORY_PROMPTS[category] || {});
}
