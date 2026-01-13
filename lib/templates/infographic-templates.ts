/**
 * 📊 INFOGRAPHIC TEMPLATES LIBRARY
 * 
 * Structured templates for consistent, high-quality infographic generation
 * across different types and use cases.
 */

import { getThemePalette } from '../theme/brand-theme';

export interface InfographicSection {
    id: string;
    name: string;
    type: 'header' | 'data' | 'comparison' | 'timeline' | 'statistics' | 'footer';
    required: boolean;
    elements: string[];
}

export interface InfographicTemplate {
    id: string;
    name: string;
    description: string;
    infographicType: 'comparison' | 'timeline' | 'process' | 'statistics' | 'data-visualization' | 'flowchart';
    useCases: string[];
    targetPlatform: 'social' | 'article' | 'newsletter';
    
    // Structure
    sections: InfographicSection[];
    
    // Visual requirements
    requiredElements: string[];
    colorPalette: string[];
    layout: string;
    dimensions: { width: number; height: number };
    
    // Data requirements
    minDataPoints: number;
    maxDataPoints: number;
    
    // Prompts
    systemPrompt: string;
    generationPromptTemplate: string;
}

const BRAND_THEME = getThemePalette('light');
const BRAND_COLOR_PALETTE = [
    BRAND_THEME.primary,
    BRAND_THEME.primaryStrong,
    BRAND_THEME.accent,
    BRAND_THEME.background
];

// ============================================================================
// TEMPLATE 1: COMPARISON INFOGRAPHIC
// ============================================================================

export const COMPARISON_INFOGRAFIC: InfographicTemplate = {
    id: 'comparison_infographic',
    name: 'Comparison Infographic',
    description: 'Compare multiple products/services side-by-side',
    infographicType: 'comparison',
    useCases: ['Product comparison', 'Feature comparison', 'Pricing comparison'],
    targetPlatform: 'article',
    
    sections: [
        {
            id: 'header',
            name: 'Header',
            type: 'header',
            required: true,
            elements: ['Title', 'Subtitle', 'Brand logo area']
        },
        {
            id: 'comparison_table',
            name: 'Comparison Table',
            type: 'comparison',
            required: true,
            elements: ['Item names', 'Feature matrix', 'Checkmarks/X marks', 'Color coding']
        },
        {
            id: 'key_differences',
            name: 'Key Differences',
            type: 'data',
            required: true,
            elements: ['Highlighted differences', 'Visual emphasis', 'Callout boxes']
        },
        {
            id: 'recommendation',
            name: 'Recommendation',
            type: 'footer',
            required: false,
            elements: ['Best for section', 'Visual recommendation', 'CTA area']
        }
    ],
    
    requiredElements: [
        'Side-by-side comparison layout',
        'Feature matrix with visual indicators',
        'Color-coded sections',
        'Clear labels and headings',
        'Data labels for all values'
    ],
    
    colorPalette: BRAND_COLOR_PALETTE,
    layout: 'horizontal split or vertical columns',
    dimensions: { width: 1920, height: 1080 },
    
    minDataPoints: 2,
    maxDataPoints: 5,
    
    systemPrompt: `You are an expert infographic designer creating professional comparison infographics for financial products. Your designs are clear, data-driven, and help readers make informed decisions.`,
    
    generationPromptTemplate: `Create a comparison infographic comparing {itemCount} items: {itemNames}

Features to compare: {features}

Requirements:
- Side-by-side layout
- Feature matrix with checkmarks/X marks
- Color-coded sections
- Clear visual hierarchy
- Professional design
- Brand colors: {primaryColor}, {secondaryColor}

Make it easy to compare at a glance.`
};

// ============================================================================
// TEMPLATE 2: TIMELINE INFOGRAPHIC
// ============================================================================

export const TIMELINE_INFOGRAFIC: InfographicTemplate = {
    id: 'timeline_infographic',
    name: 'Timeline Infographic',
    description: 'Show progression over time with milestones',
    infographicType: 'timeline',
    useCases: ['Investment timeline', 'Process timeline', 'Historical progression'],
    targetPlatform: 'article',
    
    sections: [
        {
            id: 'header',
            name: 'Header',
            type: 'header',
            required: true,
            elements: ['Title', 'Time period', 'Brand logo area']
        },
        {
            id: 'timeline',
            name: 'Timeline',
            type: 'timeline',
            required: true,
            elements: ['Timeline line', 'Milestone markers', 'Date labels', 'Event descriptions']
        },
        {
            id: 'milestones',
            name: 'Milestones',
            type: 'data',
            required: true,
            elements: ['Milestone boxes', 'Icons', 'Descriptions', 'Visual connectors']
        },
        {
            id: 'footer',
            name: 'Footer',
            type: 'footer',
            required: false,
            elements: ['Summary', 'Key takeaway', 'Branding']
        }
    ],
    
    requiredElements: [
        'Clear timeline progression',
        'Date markers',
        'Milestone visual indicators',
        'Event descriptions',
        'Visual flow'
    ],
    
    colorPalette: BRAND_COLOR_PALETTE,
    layout: 'horizontal or vertical timeline',
    dimensions: { width: 1920, height: 1080 },
    
    minDataPoints: 3,
    maxDataPoints: 10,
    
    systemPrompt: `You are an expert infographic designer creating professional timeline infographics for financial content. Your designs show clear progression and are easy to follow.`,
    
    generationPromptTemplate: `Create a timeline infographic showing {milestoneCount} milestones: {milestones}

Time period: {timePeriod}

Requirements:
- Clear timeline progression
- Date markers
- Milestone indicators
- Event descriptions
- Visual flow
- Professional design
- Brand colors: {primaryColor}, {secondaryColor}

Show clear progression over time.`
};

// ============================================================================
// TEMPLATE 3: STATISTICS INFOGRAPHIC
// ============================================================================

export const STATISTICS_INFOGRAFIC: InfographicTemplate = {
    id: 'statistics_infographic',
    name: 'Statistics Infographic',
    description: 'Display key statistics and data points',
    infographicType: 'statistics',
    useCases: ['Key statistics', 'Data summary', 'Performance metrics'],
    targetPlatform: 'social',
    
    sections: [
        {
            id: 'header',
            name: 'Header',
            type: 'header',
            required: true,
            elements: ['Title', 'Subtitle', 'Brand logo area']
        },
        {
            id: 'statistics',
            name: 'Statistics',
            type: 'statistics',
            required: true,
            elements: ['Large numbers', 'Percentage circles', 'Bar charts', 'Iconography', 'Labels']
        },
        {
            id: 'visualizations',
            name: 'Visualizations',
            type: 'data',
            required: true,
            elements: ['Charts', 'Graphs', 'Data visualizations', 'Color coding']
        },
        {
            id: 'footer',
            name: 'Footer',
            type: 'footer',
            required: false,
            elements: ['Source attribution', 'Branding', 'CTA']
        }
    ],
    
    requiredElements: [
        'Large, prominent numbers',
        'Clear data labels',
        'Visual emphasis on key statistics',
        'Charts/graphs where appropriate',
        'Iconography'
    ],
    
    colorPalette: BRAND_COLOR_PALETTE,
    layout: 'grid or dashboard style',
    dimensions: { width: 1200, height: 1200 },
    
    minDataPoints: 3,
    maxDataPoints: 8,
    
    systemPrompt: `You are an expert infographic designer creating professional statistics infographics for financial content. Your designs make data easy to understand at a glance.`,
    
    generationPromptTemplate: `Create a statistics infographic displaying {statisticCount} key statistics: {statistics}

Requirements:
- Large, prominent numbers
- Clear labels
- Visual emphasis on highlighted statistics
- Charts/graphs where appropriate
- Iconography
- Professional design
- Brand colors: {primaryColor}, {secondaryColor}

Make statistics easy to understand at a glance.`
};

// ============================================================================
// TEMPLATE 4: PROCESS FLOW INFOGRAPHIC
// ============================================================================

export const PROCESS_FLOW_INFOGRAFIC: InfographicTemplate = {
    id: 'process_flow_infographic',
    name: 'Process Flow Infographic',
    description: 'Show step-by-step process or workflow',
    infographicType: 'process',
    useCases: ['How-to process', 'Workflow', 'Step-by-step guide'],
    targetPlatform: 'article',
    
    sections: [
        {
            id: 'header',
            name: 'Header',
            type: 'header',
            required: true,
            elements: ['Title', 'Process name', 'Brand logo area']
        },
        {
            id: 'steps',
            name: 'Steps',
            type: 'data',
            required: true,
            elements: ['Step boxes', 'Step numbers', 'Step descriptions', 'Flow arrows', 'Connectors']
        },
        {
            id: 'decision_points',
            name: 'Decision Points',
            type: 'data',
            required: false,
            elements: ['Decision diamonds', 'Yes/No branches', 'Conditional flows']
        },
        {
            id: 'footer',
            name: 'Footer',
            type: 'footer',
            required: false,
            elements: ['Outcome', 'Next steps', 'Branding']
        }
    ],
    
    requiredElements: [
        'Clear step progression',
        'Flow arrows',
        'Step numbers',
        'Step descriptions',
        'Visual connectors'
    ],
    
    colorPalette: BRAND_COLOR_PALETTE,
    layout: 'top-to-bottom or left-to-right flow',
    dimensions: { width: 1920, height: 1080 },
    
    minDataPoints: 3,
    maxDataPoints: 10,
    
    systemPrompt: `You are an expert infographic designer creating professional process flow infographics for financial content. Your designs show clear step-by-step progression.`,
    
    generationPromptTemplate: `Create a process flow infographic showing {stepCount} steps: {steps}

Process: {processName}

Requirements:
- Clear step progression
- Flow arrows
- Step numbers
- Step descriptions
- Visual connectors
- Professional design
- Brand colors: {primaryColor}, {secondaryColor}

Show clear step-by-step progression.`
};

// ============================================================================
// TEMPLATE SELECTOR
// ============================================================================

export function selectInfographicTemplate(
    infographicType: string,
    targetPlatform: 'social' | 'article' | 'newsletter' = 'article'
): InfographicTemplate {
    const templates: Record<string, InfographicTemplate> = {
        'comparison': COMPARISON_INFOGRAFIC,
        'timeline': TIMELINE_INFOGRAFIC,
        'statistics': STATISTICS_INFOGRAFIC,
        'process': PROCESS_FLOW_INFOGRAFIC,
        'flowchart': PROCESS_FLOW_INFOGRAFIC
    };
    
    const template = templates[infographicType] || STATISTICS_INFOGRAFIC;
    
    // Adjust dimensions for platform
    if (targetPlatform === 'social') {
        template.dimensions = { width: 1200, height: 1200 };
    } else if (targetPlatform === 'newsletter') {
        template.dimensions = { width: 800, height: 2000 };
    }
    
    return template;
}

export function getAllInfographicTemplates(): InfographicTemplate[] {
    return [
        COMPARISON_INFOGRAFIC,
        TIMELINE_INFOGRAFIC,
        STATISTICS_INFOGRAFIC,
        PROCESS_FLOW_INFOGRAFIC
    ];
}
