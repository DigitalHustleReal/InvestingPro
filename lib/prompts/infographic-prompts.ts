/**
 * 🎨 INFOGRAPHIC PROMPT GENERATOR
 * 
 * 100% Automated, Precise, Data-Driven Infographic Prompts
 * 
 * Features:
 * - Data extraction from articles
 * - Multiple infographic types (comparison, timeline, process, statistics)
 * - Category-specific themes
 * - Brand consistency
 * - Social media optimization
 */

export interface InfographicPromptOptions {
    articleTitle: string;
    articleContent: string;
    category: string;
    infographicType: 'comparison' | 'timeline' | 'process' | 'statistics' | 'data-visualization' | 'flowchart';
    dataPoints?: Array<{ label: string; value: number | string; unit?: string }>;
    targetPlatform?: 'social' | 'article' | 'newsletter';
    style?: 'minimalist' | 'modern' | 'professional' | 'bold';
}

export interface GeneratedInfographicPrompt {
    prompt: string;
    infographicType: string;
    dataStructure: any;
    visualElements: string[];
    colorPalette: string[];
    layout: string;
    dimensions: string;
}

// ============================================================================
// INFOGRAPHIC TYPE DEFINITIONS
// ============================================================================

const INFOGRAPHIC_TYPES = {
    comparison: {
        name: 'Comparison Infographic',
        description: 'Compare multiple items side-by-side',
        visualElements: ['side-by-side comparison', 'feature matrix', 'pros/cons columns'],
        layout: 'horizontal split or vertical columns'
    },
    timeline: {
        name: 'Timeline Infographic',
        description: 'Show progression over time',
        visualElements: ['timeline line', 'milestone markers', 'date labels', 'progress indicators'],
        layout: 'horizontal or vertical timeline'
    },
    process: {
        name: 'Process Flow Infographic',
        description: 'Show step-by-step process',
        visualElements: ['flow arrows', 'step boxes', 'decision points', 'start/end markers'],
        layout: 'flowchart or linear process'
    },
    statistics: {
        name: 'Statistics Infographic',
        description: 'Display key statistics and data',
        visualElements: ['large numbers', 'percentage circles', 'bar charts', 'pie charts', 'iconography'],
        layout: 'grid or dashboard style'
    },
    'data-visualization': {
        name: 'Data Visualization',
        description: 'Charts and graphs',
        visualElements: ['bar charts', 'line graphs', 'pie charts', 'scatter plots', 'heat maps'],
        layout: 'chart-focused layout'
    },
    flowchart: {
        name: 'Flowchart Infographic',
        description: 'Decision trees and workflows',
        visualElements: ['decision diamonds', 'process boxes', 'flow arrows', 'connectors'],
        layout: 'top-to-bottom or left-to-right flow'
    }
};

// ============================================================================
// CATEGORY-SPECIFIC THEMES
// ============================================================================

const CATEGORY_THEMES: Record<string, {
    colorPalette: string[];
    iconStyle: string;
    dataEmphasis: string[];
}> = {
    'mutual-funds': {
        colorPalette: ['#10b981', '#059669', '#047857', '#065f46'], // Emerald greens
        iconStyle: 'growth charts, upward arrows, portfolio icons',
        dataEmphasis: ['returns', 'NAV', 'AUM', 'expense ratio', 'returns percentage']
    },
    'credit-cards': {
        colorPalette: ['#1e40af', '#1e3a8a', '#1d4ed8', '#2563eb'], // Blue tones
        iconStyle: 'credit card icons, payment symbols, reward badges',
        dataEmphasis: ['interest rate', 'annual fee', 'rewards rate', 'credit limit']
    },
    'loans': {
        colorPalette: ['#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'], // Purple tones
        iconStyle: 'home icons, money symbols, approval checkmarks',
        dataEmphasis: ['interest rate', 'EMI amount', 'loan amount', 'tenure']
    },
    'insurance': {
        colorPalette: ['#0ea5e9', '#0284c7', '#0369a1', '#075985'], // Sky blue
        iconStyle: 'shield icons, protection symbols, family icons',
        dataEmphasis: ['coverage amount', 'premium', 'claim ratio', 'sum assured']
    },
    'tax-planning': {
        colorPalette: ['#f59e0b', '#d97706', '#b45309', '#92400e'], // Amber/gold
        iconStyle: 'calculator icons, document symbols, tax forms',
        dataEmphasis: ['tax savings', 'deduction amount', 'tax bracket', 'savings percentage']
    },
    'retirement': {
        colorPalette: ['#f97316', '#ea580c', '#c2410c', '#9a3412'], // Orange tones
        iconStyle: 'retirement symbols, timeline icons, wealth accumulation',
        dataEmphasis: ['retirement corpus', 'monthly savings', 'years to retirement', 'corpus target']
    },
    'investing-basics': {
        colorPalette: ['#14b8a6', '#0d9488', '#0f766e', '#115e59'], // Teal
        iconStyle: 'education icons, learning symbols, beginner-friendly graphics',
        dataEmphasis: ['investment amount', 'returns', 'time horizon', 'risk level']
    },
    'stocks': {
        colorPalette: ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'], // Red tones
        iconStyle: 'stock charts, market symbols, trading icons',
        dataEmphasis: ['stock price', 'market cap', 'PE ratio', 'dividend yield']
    }
};

// ============================================================================
// DATA EXTRACTION FROM ARTICLE
// ============================================================================

/**
 * Extract data points from article content
 */
function extractDataPoints(content: string): Array<{ label: string; value: number | string; unit?: string }> {
    const dataPoints: Array<{ label: string; value: number | string; unit?: string }> = [];
    
    // Extract percentages
    const percentageMatches = content.match(/(\d+(?:\.\d+)?)\s*%/g);
    if (percentageMatches) {
        percentageMatches.slice(0, 5).forEach(match => {
            const value = match.replace('%', '');
            dataPoints.push({
                label: 'Percentage',
                value: parseFloat(value),
                unit: '%'
            });
        });
    }
    
    // Extract currency amounts (INR)
    const currencyMatches = content.match(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakh|crore|thousand|million)?/gi);
    if (currencyMatches) {
        currencyMatches.slice(0, 5).forEach(match => {
            const value = match.replace(/₹\s*/i, '').trim();
            dataPoints.push({
                label: 'Amount',
                value: value,
                unit: 'INR'
            });
        });
    }
    
    // Extract numbers with units
    const numberMatches = content.match(/(\d+(?:\.\d+)?)\s*(years?|months?|days?|times?|points?)/gi);
    if (numberMatches) {
        numberMatches.slice(0, 5).forEach(match => {
            const parts = match.match(/(\d+(?:\.\d+)?)\s*(\w+)/i);
            if (parts) {
                dataPoints.push({
                    label: parts[2],
                    value: parseFloat(parts[1]),
                    unit: parts[2]
                });
            }
        });
    }
    
    return dataPoints.slice(0, 10); // Limit to 10 data points
}

// ============================================================================
// PROMPT GENERATION
// ============================================================================

/**
 * Generate infographic prompt
 */
export function generateInfographicPrompt(options: InfographicPromptOptions): GeneratedInfographicPrompt {
    const {
        articleTitle,
        articleContent,
        category,
        infographicType,
        dataPoints,
        targetPlatform = 'article',
        style = 'professional'
    } = options;
    
    // Get category theme
    const categoryTheme = CATEGORY_THEMES[category] || CATEGORY_THEMES['investing-basics'];
    
    // Get infographic type definition
    const typeDef = INFOGRAPHIC_TYPES[infographicType];
    
    // Extract data points if not provided
    const extractedData = dataPoints || extractDataPoints(articleContent);
    
    // Determine dimensions based on platform
    const dimensions = targetPlatform === 'social' 
        ? '1200x1200 (square, optimized for social media)'
        : targetPlatform === 'newsletter'
            ? '800x2000 (vertical, newsletter-friendly)'
            : '1920x1080 (horizontal, article-friendly)';
    
    // Build visual elements
    const visualElements = [
        ...typeDef.visualElements,
        ...categoryTheme.iconStyle.split(', '),
        'brand colors',
        'clean typography',
        'data labels'
    ];
    
    // Build prompt
    const prompt = buildInfographicPrompt({
        articleTitle,
        infographicType: typeDef.name,
        typeDescription: typeDef.description,
        categoryTheme,
        visualElements,
        dataPoints: extractedData,
        layout: typeDef.layout,
        dimensions,
        style,
        targetPlatform
    });
    
    return {
        prompt,
        infographicType,
        dataStructure: {
            dataPoints: extractedData,
            type: infographicType,
            layout: typeDef.layout
        },
        visualElements,
        colorPalette: categoryTheme.colorPalette,
        layout: typeDef.layout,
        dimensions
    };
}

/**
 * Build the complete infographic prompt
 */
function buildInfographicPrompt(params: {
    articleTitle: string;
    infographicType: string;
    typeDescription: string;
    categoryTheme: typeof CATEGORY_THEMES[string];
    visualElements: string[];
    dataPoints: Array<{ label: string; value: number | string; unit?: string }>;
    layout: string;
    dimensions: string;
    style: string;
    targetPlatform: string;
}): string {
    const {
        articleTitle,
        infographicType,
        typeDescription,
        categoryTheme,
        visualElements,
        dataPoints,
        layout,
        dimensions,
        style,
        targetPlatform
    } = params;
    
    let prompt = `Create a ${style} ${infographicType} infographic for: "${articleTitle}"\n\n`;
    
    prompt += `INFOGRAPHIC TYPE: ${infographicType}\n`;
    prompt += `Description: ${typeDescription}\n\n`;
    
    prompt += `DATA TO VISUALIZE:\n`;
    dataPoints.forEach((point, i) => {
        prompt += `${i + 1}. ${point.label}: ${point.value}${point.unit ? ' ' + point.unit : ''}\n`;
    });
    prompt += `\n`;
    
    prompt += `VISUAL ELEMENTS:\n`;
    visualElements.forEach((element, i) => {
        if (i < 8) { // Limit to 8 elements
            prompt += `- ${element}\n`;
        }
    });
    prompt += `\n`;
    
    prompt += `LAYOUT REQUIREMENTS:\n`;
    prompt += `- Layout style: ${layout}\n`;
    prompt += `- Dimensions: ${dimensions}\n`;
    prompt += `- Style: ${style}\n`;
    prompt += `- Target platform: ${targetPlatform}\n`;
    prompt += `\n`;
    
    prompt += `COLOR PALETTE:\n`;
    prompt += `- Primary: ${categoryTheme.colorPalette[0]} (emerald green)\n`;
    prompt += `- Secondary: ${categoryTheme.colorPalette[1]}\n`;
    prompt += `- Accent: #f59e0b (amber/gold)\n`;
    prompt += `- Background: #f8fafc (light gray/white)\n`;
    prompt += `- Supporting: Deep blue, slate gray\n`;
    prompt += `\n`;
    
    prompt += `DESIGN REQUIREMENTS:\n`;
    prompt += `- Clean, professional design\n`;
    prompt += `- Easy to read at a glance\n`;
    prompt += `- Data-driven and informative\n`;
    prompt += `- Suitable for financial content\n`;
    prompt += `- Modern, contemporary style\n`;
    prompt += `- High contrast for readability\n`;
    prompt += `- Brand-consistent colors\n`;
    prompt += `\n`;
    
    prompt += `CONTENT REQUIREMENTS:\n`;
    prompt += `- Clear data labels\n`;
    prompt += `- Prominent numbers/statistics\n`;
    prompt += `- Visual hierarchy\n`;
    prompt += `- No text overlays (data will be added separately)\n`;
    prompt += `- Iconography where appropriate\n`;
    prompt += `\n`;
    
    prompt += `AVOID:\n`;
    prompt += `- Cluttered design\n`;
    prompt += `- Too many colors\n`;
    prompt += `- Small text\n`;
    prompt += `- Unprofessional imagery\n`;
    prompt += `- Dated design elements\n`;
    prompt += `\n`;
    
    prompt += `The infographic should be suitable for a premium financial website and convey professionalism, trust, and expertise.`;
    
    return prompt.trim();
}

// ============================================================================
// SPECIALIZED INFOGRAPHIC PROMPTS
// ============================================================================

/**
 * Generate comparison infographic prompt
 */
export function generateComparisonInfographicPrompt(
    items: Array<{ name: string; features: Record<string, string | number> }>,
    category: string
): GeneratedInfographicPrompt {
    const categoryTheme = CATEGORY_THEMES[category] || CATEGORY_THEMES['investing-basics'];
    
    const prompt = `Create a professional comparison infographic comparing ${items.length} items.

ITEMS TO COMPARE:
${items.map((item, i) => `${i + 1}. ${item.name}`).join('\n')}

FEATURES TO COMPARE:
${Object.keys(items[0].features).join(', ')}

VISUAL REQUIREMENTS:
- Side-by-side comparison layout
- Feature matrix with checkmarks/X marks
- Color-coded sections for each item
- Clear labels and headings
- Professional, modern design
- Brand colors: ${categoryTheme.colorPalette[0]}, ${categoryTheme.colorPalette[1]}

The infographic should make it easy to compare features at a glance.`;

    return {
        prompt,
        infographicType: 'comparison',
        dataStructure: { items, features: Object.keys(items[0].features) },
        visualElements: ['side-by-side layout', 'feature matrix', 'color coding'],
        colorPalette: categoryTheme.colorPalette,
        layout: 'horizontal split',
        dimensions: '1920x1080'
    };
}

/**
 * Generate timeline infographic prompt
 */
export function generateTimelineInfographicPrompt(
    milestones: Array<{ date: string; event: string; description?: string }>,
    category: string
): GeneratedInfographicPrompt {
    const categoryTheme = CATEGORY_THEMES[category] || CATEGORY_THEMES['investing-basics'];
    
    const prompt = `Create a professional timeline infographic showing ${milestones.length} milestones.

MILESTONES:
${milestones.map((m, i) => `${i + 1}. ${m.date}: ${m.event}${m.description ? ' - ' + m.description : ''}`).join('\n')}

VISUAL REQUIREMENTS:
- Horizontal or vertical timeline layout
- Clear date markers
- Event descriptions
- Visual progression indicators
- Professional, modern design
- Brand colors: ${categoryTheme.colorPalette[0]}, ${categoryTheme.colorPalette[1]}

The timeline should show clear progression and be easy to follow.`;

    return {
        prompt,
        infographicType: 'timeline',
        dataStructure: { milestones },
        visualElements: ['timeline line', 'date markers', 'event boxes', 'progress indicators'],
        colorPalette: categoryTheme.colorPalette,
        layout: 'horizontal timeline',
        dimensions: '1920x1080'
    };
}

/**
 * Generate statistics infographic prompt
 */
export function generateStatisticsInfographicPrompt(
    statistics: Array<{ label: string; value: number | string; unit?: string; highlight?: boolean }>,
    category: string
): GeneratedInfographicPrompt {
    const categoryTheme = CATEGORY_THEMES[category] || CATEGORY_THEMES['investing-basics'];
    
    const prompt = `Create a professional statistics infographic displaying key data points.

STATISTICS TO DISPLAY:
${statistics.map((stat, i) => `${i + 1}. ${stat.label}: ${stat.value}${stat.unit ? ' ' + stat.unit : ''}${stat.highlight ? ' (HIGHLIGHT)' : ''}`).join('\n')}

VISUAL REQUIREMENTS:
- Large, prominent numbers
- Clear labels
- Visual emphasis on highlighted statistics
- Charts/graphs where appropriate
- Iconography for each statistic
- Professional, modern design
- Brand colors: ${categoryTheme.colorPalette[0]}, ${categoryTheme.colorPalette[1]}

The infographic should make statistics easy to understand at a glance.`;

    return {
        prompt,
        infographicType: 'statistics',
        dataStructure: { statistics },
        visualElements: ['large numbers', 'percentage circles', 'bar charts', 'iconography'],
        colorPalette: categoryTheme.colorPalette,
        layout: 'grid/dashboard style',
        dimensions: '1920x1080'
    };
}

// ============================================================================
// EXPORT
// ============================================================================

export const infographicPromptGenerator = {
    generate: generateInfographicPrompt,
    generateComparison: generateComparisonInfographicPrompt,
    generateTimeline: generateTimelineInfographicPrompt,
    generateStatistics: generateStatisticsInfographicPrompt,
    extractDataPoints
};
