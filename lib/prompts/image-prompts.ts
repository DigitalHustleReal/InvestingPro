/**
 * 🎨 AUTOMATED IMAGE PROMPT GENERATOR
 * 
 * 100% Automated, Precise, Theme-Related Image Prompts
 * 
 * Features:
 * - Category-specific themes
 * - Keyword-optimized prompts
 * - Brand consistency
 * - Multiple image types (featured, in-article, social)
 * - Automatic style selection
 * - Theme-aware generation
 */

export interface ImagePromptOptions {
    articleTitle: string;
    category: string;
    keywords: string[];
    articleExcerpt?: string;
    imageType: 'featured' | 'in-article' | 'social' | 'og';
    style?: 'photorealistic' | 'illustration' | 'minimalist' | 'infographic' | 'professional';
    theme?: string; // Specific theme if provided
}

export interface GeneratedImagePrompt {
    prompt: string;
    style: string;
    size: string;
    quality: 'standard' | 'hd';
    aspectRatio: string;
    brandColors: string[];
    themeElements: string[];
    negativePrompts: string[];
}

// ============================================================================
// CATEGORY-SPECIFIC THEMES
// ============================================================================

const CATEGORY_THEMES: Record<string, {
    visualElements: string[];
    colorPalette: string[];
    style: string;
    metaphors: string[];
}> = {
    'mutual-funds': {
        visualElements: [
            'upward trending line charts',
            'diverse investment portfolio visualization',
            'growth trajectory graphs',
            'financial planning charts',
            'asset allocation pie charts',
            'compound interest visualization'
        ],
        colorPalette: ['#10b981', '#059669', '#047857', '#065f46'], // Emerald greens
        style: 'professional infographic',
        metaphors: ['growth', 'diversification', 'wealth building', 'long-term planning']
    },
    
    'credit-cards': {
        visualElements: [
            'modern credit card design',
            'premium banking aesthetics',
            'financial technology symbols',
            'payment processing visualization',
            'reward points accumulation',
            'cashback benefits illustration'
        ],
        colorPalette: ['#1e40af', '#1e3a8a', '#1d4ed8', '#2563eb'], // Blue tones
        style: 'modern minimalist',
        metaphors: ['convenience', 'rewards', 'financial freedom', 'smart spending']
    },
    
    'loans': {
        visualElements: [
            'home ownership visualization',
            'loan approval process',
            'financial security symbols',
            'money transfer concepts',
            'debt management charts',
            'EMI calculation graphics'
        ],
        colorPalette: ['#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'], // Purple tones
        style: 'trustworthy professional',
        metaphors: ['security', 'achievement', 'financial goals', 'responsible borrowing']
    },
    
    'insurance': {
        visualElements: [
            'protection shield',
            'family security umbrella',
            'safety net visualization',
            'health protection symbols',
            'life insurance concepts',
            'risk mitigation graphics'
        ],
        colorPalette: ['#0ea5e9', '#0284c7', '#0369a1', '#075985'], // Sky blue
        style: 'protective trustworthy',
        metaphors: ['protection', 'security', 'peace of mind', 'safety net']
    },
    
    'tax-planning': {
        visualElements: [
            'tax calculator interface',
            'financial documents',
            'tax savings visualization',
            'filing process graphics',
            'deduction concepts',
            'compliance symbols'
        ],
        colorPalette: ['#f59e0b', '#d97706', '#b45309', '#92400e'], // Amber/gold
        style: 'precise professional',
        metaphors: ['optimization', 'savings', 'compliance', 'financial planning']
    },
    
    'retirement': {
        visualElements: [
            'retirement timeline',
            'wealth accumulation charts',
            'pension planning graphics',
            'golden years visualization',
            'financial independence symbols',
            'nest egg concepts'
        ],
        colorPalette: ['#f97316', '#ea580c', '#c2410c', '#9a3412'], // Orange tones
        style: 'warm professional',
        metaphors: ['security', 'freedom', 'preparation', 'peaceful future']
    },
    
    'investing-basics': {
        visualElements: [
            'investment fundamentals',
            'market education graphics',
            'beginner-friendly charts',
            'learning path visualization',
            'financial literacy symbols',
            'investment journey maps'
        ],
        colorPalette: ['#14b8a6', '#0d9488', '#0f766e', '#115e59'], // Teal
        style: 'educational approachable',
        metaphors: ['learning', 'growth', 'empowerment', 'knowledge']
    },
    
    'stocks': {
        visualElements: [
            'stock market charts',
            'trading floor visualization',
            'bull and bear markets',
            'portfolio performance graphs',
            'market analysis graphics',
            'equity investment concepts'
        ],
        colorPalette: ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'], // Red for stocks
        style: 'dynamic professional',
        metaphors: ['growth', 'volatility', 'opportunity', 'market dynamics']
    }
};

// ============================================================================
// BRAND GUIDELINES
// ============================================================================

const BRAND_GUIDELINES = {
    primaryColor: '#10b981', // Emerald green
    secondaryColor: '#059669',
    accentColor: '#f59e0b', // Amber
    neutralColor: '#0f172a', // Slate
    backgroundColor: '#f8fafc', // Slate 50
    
    styleKeywords: [
        'modern fintech aesthetic',
        'professional financial branding',
        'trustworthy and authoritative',
        'clean minimalist design',
        'premium quality',
        'Indian market context'
    ],
    
    avoidElements: [
        'text overlays',
        'watermarks',
        'logos (except brand)',
        'dated design elements',
        'cluttered compositions',
        'unprofessional imagery'
    ]
};

// ============================================================================
// IMAGE TYPE SPECIFICATIONS
// ============================================================================

const IMAGE_TYPE_SPECS: Record<string, {
    size: string;
    aspectRatio: string;
    quality: 'standard' | 'hd';
    composition: string;
    textPlacement?: string;
}> = {
    'featured': {
        size: '1792x1024',
        aspectRatio: '16:9',
        quality: 'hd',
        composition: 'wide horizontal composition, centered focal point, room for text overlay at bottom',
        textPlacement: 'bottom third'
    },
    
    'in-article': {
        size: '1024x1024',
        aspectRatio: '1:1',
        quality: 'standard',
        composition: 'square format, clear subject, suitable for inline placement',
        textPlacement: 'none'
    },
    
    'social': {
        size: '1200x1200',
        aspectRatio: '1:1',
        quality: 'hd',
        composition: 'square format optimized for social media, eye-catching, shareable',
        textPlacement: 'center'
    },
    
    'og': {
        size: '1200x630',
        aspectRatio: '1.91:1',
        quality: 'hd',
        composition: 'Open Graph optimized, horizontal, text-safe area on left',
        textPlacement: 'left third'
    }
};

// ============================================================================
// PROMPT GENERATION
// ============================================================================

/**
 * Generate precise, theme-related image prompt
 */
export function generateImagePrompt(options: ImagePromptOptions): GeneratedImagePrompt {
    const {
        articleTitle,
        category,
        keywords,
        articleExcerpt,
        imageType,
        style,
        theme
    } = options;
    
    // Get category theme
    const categoryTheme = CATEGORY_THEMES[category] || CATEGORY_THEMES['investing-basics'];
    
    // Get image type specs
    const typeSpecs = IMAGE_TYPE_SPECS[imageType] || IMAGE_TYPE_SPECS['featured'];
    
    // Determine style
    const selectedStyle = style || categoryTheme.style || 'professional';
    
    // Extract main concept from title
    const mainConcept = extractMainConcept(articleTitle, keywords);
    
    // Build theme elements
    const themeElements = buildThemeElements(
        mainConcept,
        categoryTheme,
        keywords,
        theme
    );
    
    // Build color palette
    const brandColors = [
        ...categoryTheme.colorPalette,
        BRAND_GUIDELINES.primaryColor,
        BRAND_GUIDELINES.accentColor
    ];
    
    // Build negative prompts
    const negativePrompts = [
        ...BRAND_GUIDELINES.avoidElements,
        'low quality',
        'blurry',
        'distorted',
        'unprofessional',
        'dated design'
    ];
    
    // Construct the prompt
    const prompt = buildPrompt({
        mainConcept,
        categoryTheme,
        themeElements,
        brandColors,
        typeSpecs,
        selectedStyle,
        articleTitle,
        articleExcerpt
    });
    
    return {
        prompt,
        style: selectedStyle,
        size: typeSpecs.size,
        quality: typeSpecs.quality,
        aspectRatio: typeSpecs.aspectRatio,
        brandColors,
        themeElements,
        negativePrompts
    };
}

/**
 * Extract main concept from title and keywords
 */
function extractMainConcept(title: string, keywords: string[]): string {
    // Use first keyword if available
    if (keywords.length > 0) {
        return keywords[0];
    }
    
    // Extract from title (first 3-4 significant words)
    const words = title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .filter(w => w.length > 3 && !isStopWord(w))
        .slice(0, 3);
    
    return words.join(' ') || title.toLowerCase().split(' ').slice(0, 3).join(' ');
}

/**
 * Build theme elements based on concept and category
 */
function buildThemeElements(
    mainConcept: string,
    categoryTheme: typeof CATEGORY_THEMES[string],
    keywords: string[],
    customTheme?: string
): string[] {
    const elements: string[] = [];
    
    // Add category-specific visual elements
    elements.push(...categoryTheme.visualElements.slice(0, 2));
    
    // Add concept-specific elements
    if (mainConcept.includes('sip') || mainConcept.includes('systematic')) {
        elements.push('recurring investment flow', 'monthly contribution visualization');
    } else if (mainConcept.includes('tax') || mainConcept.includes('deduction')) {
        elements.push('tax calculation interface', 'savings visualization');
    } else if (mainConcept.includes('retirement') || mainConcept.includes('pension')) {
        elements.push('retirement timeline', 'wealth accumulation');
    } else if (mainConcept.includes('credit') || mainConcept.includes('card')) {
        elements.push('modern credit card', 'payment processing');
    } else if (mainConcept.includes('loan') || mainConcept.includes('emi')) {
        elements.push('loan approval process', 'financial security');
    }
    
    // Add keyword-based elements
    keywords.slice(0, 2).forEach(keyword => {
        if (keyword.length > 4) {
            elements.push(`${keyword} concept visualization`);
        }
    });
    
    // Add custom theme if provided
    if (customTheme) {
        elements.push(customTheme);
    }
    
    return elements.slice(0, 5); // Limit to 5 elements
}

/**
 * Build the complete prompt
 */
function buildPrompt(params: {
    mainConcept: string;
    categoryTheme: typeof CATEGORY_THEMES[string];
    themeElements: string[];
    brandColors: string[];
    typeSpecs: typeof IMAGE_TYPE_SPECS[string];
    selectedStyle: string;
    articleTitle: string;
    articleExcerpt?: string;
}): string {
    const {
        mainConcept,
        categoryTheme,
        themeElements,
        brandColors,
        typeSpecs,
        selectedStyle,
        articleTitle,
        articleExcerpt
    } = params;
    
    // Base description
    let prompt = `Create a ${selectedStyle} image for a financial article titled "${articleTitle}".\n\n`;
    
    // Main concept
    prompt += `PRIMARY CONCEPT: ${mainConcept}\n\n`;
    
    // Visual elements
    prompt += `VISUAL ELEMENTS:\n`;
    themeElements.forEach((element, i) => {
        prompt += `- ${element}\n`;
    });
    prompt += `\n`;
    
    // Style requirements
    prompt += `STYLE REQUIREMENTS:\n`;
    prompt += `- ${selectedStyle} design style\n`;
    prompt += `- Clean, minimalist composition\n`;
    prompt += `- Professional, trustworthy aesthetic\n`;
    prompt += `- Suitable for premium financial website\n`;
    prompt += `- Modern, contemporary design\n`;
    prompt += `- ${typeSpecs.composition}\n`;
    prompt += `\n`;
    
    // Color palette
    prompt += `COLOR PALETTE:\n`;
    prompt += `- Primary: ${brandColors[0]} (emerald green)\n`;
    prompt += `- Secondary: ${brandColors[1]}\n`;
    prompt += `- Accent: ${BRAND_GUIDELINES.accentColor} (amber/gold)\n`;
    prompt += `- Background: ${BRAND_GUIDELINES.backgroundColor} (light gray/white)\n`;
    prompt += `- Supporting: Deep blue, slate gray\n`;
    prompt += `\n`;
    
    // Composition
    prompt += `COMPOSITION:\n`;
    prompt += `- Aspect ratio: ${typeSpecs.aspectRatio}\n`;
    prompt += `- High contrast, easily readable\n`;
    prompt += `- Professional composition\n`;
    if (typeSpecs.textPlacement) {
        prompt += `- Text-safe area: ${typeSpecs.textPlacement}\n`;
    }
    prompt += `\n`;
    
    // Brand guidelines
    prompt += `BRAND GUIDELINES:\n`;
    BRAND_GUIDELINES.styleKeywords.forEach(keyword => {
        prompt += `- ${keyword}\n`;
    });
    prompt += `\n`;
    
    // Quality requirements
    prompt += `QUALITY REQUIREMENTS:\n`;
    prompt += `- ${typeSpecs.quality === 'hd' ? 'HD quality, sharp focus' : 'High quality'}\n`;
    prompt += `- Well-lit, professional photography/illustration\n`;
    prompt += `- Suitable for financial content\n`;
    prompt += `- Indian market context (if applicable)\n`;
    prompt += `\n`;
    
    // Negative requirements
    prompt += `AVOID:\n`;
    BRAND_GUIDELINES.avoidElements.forEach(element => {
        prompt += `- ${element}\n`;
    });
    prompt += `\n`;
    
    // Final instruction
    prompt += `The image should look like it belongs on a premium financial website like Bloomberg, Investopedia, or NerdWallet. It should convey professionalism, trust, and expertise.`;
    
    return prompt.trim();
}

/**
 * Check if word is a stop word
 */
function isStopWord(word: string): boolean {
    const stopWords = [
        'the', 'and', 'for', 'with', 'from', 'what', 'when', 'where', 'how', 'why',
        'this', 'that', 'your', 'best', 'top', 'guide', 'complete', 'ultimate',
        'india', 'indian', '2026', '2025', '2024'
    ];
    return stopWords.includes(word.toLowerCase());
}

// ============================================================================
// AUTOMATED PROMPT VARIATIONS
// ============================================================================

/**
 * Generate multiple prompt variations for A/B testing
 */
export function generatePromptVariations(
    baseOptions: ImagePromptOptions,
    count: number = 3
): GeneratedImagePrompt[] {
    const variations: GeneratedImagePrompt[] = [];
    
    const styleVariations: Array<'photorealistic' | 'illustration' | 'minimalist' | 'infographic' | 'professional'> = [
        'professional',
        'illustration',
        'minimalist'
    ];
    
    for (let i = 0; i < count; i++) {
        const variation = generateImagePrompt({
            ...baseOptions,
            style: styleVariations[i % styleVariations.length]
        });
        
        // Add variation identifier
        variation.prompt = `${variation.prompt}\n\nVariation ${i + 1}: ${variation.style} style`;
        
        variations.push(variation);
    }
    
    return variations;
}

// ============================================================================
// THEME-SPECIFIC PROMPT ENHANCEMENTS
// ============================================================================

/**
 * Enhance prompt with specific theme context
 */
export function enhancePromptWithTheme(
    basePrompt: GeneratedImagePrompt,
    themeContext: {
        trendingTopic?: string;
        seasonalContext?: string;
        eventContext?: string; // e.g., "Union Budget 2026", "RBI rate cut"
    }
): GeneratedImagePrompt {
    let enhancedPrompt = basePrompt.prompt;
    
    // Add trending topic context
    if (themeContext.trendingTopic) {
        enhancedPrompt += `\n\nTRENDING CONTEXT: This article relates to the trending topic "${themeContext.trendingTopic}". Include subtle visual references if appropriate.`;
    }
    
    // Add seasonal context
    if (themeContext.seasonalContext) {
        enhancedPrompt += `\n\nSEASONAL CONTEXT: ${themeContext.seasonalContext}`;
    }
    
    // Add event context
    if (themeContext.eventContext) {
        enhancedPrompt += `\n\nEVENT CONTEXT: ${themeContext.eventContext}. Ensure imagery reflects current financial landscape.`;
    }
    
    return {
        ...basePrompt,
        prompt: enhancedPrompt
    };
}

// ============================================================================
// EXPORT
// ============================================================================

export const imagePromptGenerator = {
    generate: generateImagePrompt,
    generateVariations: generatePromptVariations,
    enhanceWithTheme: enhancePromptWithTheme
};
