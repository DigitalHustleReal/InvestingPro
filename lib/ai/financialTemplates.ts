/**
 * Financial Content Templates
 * 
 * Pre-built templates for fast content generation
 * Trained for Investopedia-grade educational content
 * and NerdWallet-grade practical articles
 */

export interface ContentTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    style: 'investopedia' | 'nerdwallet' | 'hybrid';
    structure: TemplateSection[];
    promptTemplate: string;
    keywords: string[];
    wordCount: number;
    framework: string;
}

export interface TemplateSection {
    type: 'intro' | 'body' | 'comparison' | 'faq' | 'conclusion' | 'calculator' | 'pros_cons' | 'how_to';
    title: string;
    placeholder: string;
    required: boolean;
}

/**
 * Investopedia-Style Templates
 * - Educational, authoritative, detailed
 * - Focus on explaining concepts
 * - Academic tone with examples
 */
export const INVESTOPEDIA_TEMPLATES: ContentTemplate[] = [
    {
        id: 'investopedia-concept-explainer',
        name: 'Financial Concept Explainer',
        description: 'Deep-dive educational article explaining a financial concept (Investopedia style)',
        category: 'investing-basics',
        style: 'investopedia',
        structure: [
            { type: 'intro', title: 'Introduction', placeholder: 'Define the concept and its importance', required: true },
            { type: 'body', title: 'Understanding the Concept', placeholder: 'Detailed explanation with examples', required: true },
            { type: 'body', title: 'How It Works', placeholder: 'Step-by-step breakdown', required: true },
            { type: 'body', title: 'Key Components', placeholder: 'Break down into parts', required: true },
            { type: 'body', title: 'Real-World Examples', placeholder: 'Practical applications', required: true },
            { type: 'body', title: 'Advantages and Disadvantages', placeholder: 'Balanced analysis', required: true },
            { type: 'faq', title: 'Frequently Asked Questions', placeholder: 'Common questions answered', required: false },
            { type: 'conclusion', title: 'Key Takeaways', placeholder: 'Summary of important points', required: true },
        ],
        promptTemplate: `You are a senior financial educator writing for Investopedia. Create a comprehensive, authoritative article explaining: {topic}

STYLE REQUIREMENTS:
- Academic yet accessible tone
- Detailed explanations with examples
- Use financial terminology correctly
- Include formulas and calculations where relevant
- Cite regulatory sources (RBI, SEBI, AMFI)
- Neutral, educational perspective
- No recommendations, only information

STRUCTURE:
1. Introduction: Define {topic} and its significance in Indian financial markets
2. Understanding: Deep explanation of the concept
3. How It Works: Step-by-step mechanism
4. Key Components: Break down into essential parts
5. Real-World Examples: Indian market examples
6. Advantages/Disadvantages: Balanced analysis
7. FAQs: Answer common questions
8. Key Takeaways: Summary

WORD COUNT: {wordCount}
KEYWORDS: {keywords}
LANGUAGE: {language}

Return comprehensive markdown content with proper headings (H2, H3).`,
        keywords: ['financial education', 'investment concepts', 'financial literacy'],
        wordCount: 2000,
        framework: 'educational',
    },
    {
        id: 'investopedia-formula-guide',
        name: 'Financial Formula & Calculation Guide',
        description: 'Detailed guide explaining financial formulas and calculations',
        category: 'investing-basics',
        style: 'investopedia',
        structure: [
            { type: 'intro', title: 'Introduction', placeholder: 'What is the formula and why it matters', required: true },
            { type: 'body', title: 'Formula Breakdown', placeholder: 'Explain each component', required: true },
            { type: 'body', title: 'Step-by-Step Calculation', placeholder: 'Worked examples', required: true },
            { type: 'body', title: 'Practical Applications', placeholder: 'When to use this formula', required: true },
            { type: 'calculator', title: 'Calculation Examples', placeholder: 'Multiple examples with solutions', required: true },
            { type: 'conclusion', title: 'Summary', placeholder: 'Key points to remember', required: true },
        ],
        promptTemplate: `You are a financial mathematics expert writing for Investopedia. Create a detailed guide on: {topic}

Focus on:
- Clear formula explanation
- Step-by-step calculations
- Multiple worked examples
- Indian market context
- Common mistakes to avoid
- When to use this calculation

WORD COUNT: {wordCount}
KEYWORDS: {keywords}`,
        keywords: ['financial formulas', 'calculations', 'investment math'],
        wordCount: 1500,
        framework: 'how-to',
    },
];

/**
 * NerdWallet-Style Templates
 * - Practical, comparison-focused, user-friendly
 * - Focus on helping users make decisions
 * - Actionable advice and comparisons
 */
export const NERDWALLET_TEMPLATES: ContentTemplate[] = [
    {
        id: 'nerdwallet-product-comparison',
        name: 'Product Comparison Guide',
        description: 'Compare financial products side-by-side (NerdWallet style)',
        category: 'comparison',
        style: 'nerdwallet',
        structure: [
            { type: 'intro', title: 'Introduction', placeholder: 'Why compare these products', required: true },
            { type: 'comparison', title: 'Side-by-Side Comparison', placeholder: 'Comparison table', required: true },
            { type: 'body', title: 'Key Features Compared', placeholder: 'Detailed feature analysis', required: true },
            { type: 'pros_cons', title: 'Pros and Cons', placeholder: 'For each product', required: true },
            { type: 'body', title: 'Who Should Choose What', placeholder: 'Target audience for each', required: true },
            { type: 'body', title: 'Cost Comparison', placeholder: 'Fees, charges, costs', required: true },
            { type: 'conclusion', title: 'Bottom Line', placeholder: 'Summary and next steps', required: true },
        ],
        promptTemplate: `You are a financial comparison expert writing for NerdWallet India. Create a comprehensive comparison guide: {topic}

STYLE REQUIREMENTS:
- User-friendly, conversational tone
- Practical, actionable information
- Clear comparisons with tables
- Focus on helping users decide
- Include costs, fees, features
- Real user scenarios
- No financial advice, only information

STRUCTURE:
1. Introduction: Why compare these products
2. Comparison Table: Side-by-side features
3. Key Features: Detailed analysis
4. Pros and Cons: For each option
5. Who Should Choose: Target audience
6. Cost Comparison: Fees and charges
7. Bottom Line: Summary and next steps

WORD COUNT: {wordCount}
KEYWORDS: {keywords}
LANGUAGE: {language}

Use tables, bullet points, and clear formatting.`,
        keywords: ['product comparison', 'best options', 'financial products'],
        wordCount: 1800,
        framework: 'comparison',
    },
    {
        id: 'nerdwallet-how-to-guide',
        name: 'How-To Guide',
        description: 'Step-by-step practical guide (NerdWallet style)',
        category: 'how-to',
        style: 'nerdwallet',
        structure: [
            { type: 'intro', title: 'Introduction', placeholder: 'What you will learn', required: true },
            { type: 'how_to', title: 'Step-by-Step Instructions', placeholder: 'Numbered steps', required: true },
            { type: 'body', title: 'What You Need', placeholder: 'Requirements and prerequisites', required: true },
            { type: 'body', title: 'Common Mistakes to Avoid', placeholder: 'Pitfalls and warnings', required: true },
            { type: 'body', title: 'Tips for Success', placeholder: 'Best practices', required: true },
            { type: 'faq', title: 'Frequently Asked Questions', placeholder: 'Common questions', required: false },
            { type: 'conclusion', title: 'Next Steps', placeholder: 'What to do after', required: true },
        ],
        promptTemplate: `You are a practical financial guide writer for NerdWallet India. Create a step-by-step how-to guide: {topic}

STYLE REQUIREMENTS:
- Clear, actionable steps
- Beginner-friendly language
- Practical examples
- Real-world scenarios
- What to expect at each step
- Common mistakes to avoid
- Tips for success

STRUCTURE:
1. Introduction: What you'll learn
2. Step-by-Step: Numbered instructions
3. What You Need: Requirements
4. Common Mistakes: What to avoid
5. Tips: Best practices
6. FAQs: Common questions
7. Next Steps: What to do after

WORD COUNT: {wordCount}
KEYWORDS: {keywords}
LANGUAGE: {language}`,
        keywords: ['how to', 'guide', 'step by step'],
        wordCount: 1500,
        framework: 'how-to',
    },
    {
        id: 'nerdwallet-best-of-list',
        name: 'Best Of List Article',
        description: 'Top 10 / Best 5 list article (NerdWallet style)',
        category: 'list',
        style: 'nerdwallet',
        structure: [
            { type: 'intro', title: 'Introduction', placeholder: 'What makes these the best', required: true },
            { type: 'body', title: 'How We Evaluated', placeholder: 'Criteria and methodology', required: true },
            { type: 'body', title: 'Top Picks', placeholder: 'Ranked list with details', required: true },
            { type: 'body', title: 'Detailed Reviews', placeholder: 'Each item explained', required: true },
            { type: 'body', title: 'Comparison Table', placeholder: 'Quick comparison', required: true },
            { type: 'conclusion', title: 'How to Choose', placeholder: 'Decision guide', required: true },
        ],
        promptTemplate: `You are a financial product reviewer for NerdWallet India. Create a "Best Of" list article: {topic}

STYLE REQUIREMENTS:
- Ranked list format
- Clear evaluation criteria
- Detailed reviews for each
- Comparison elements
- User-focused recommendations
- Practical considerations
- Cost and value analysis

STRUCTURE:
1. Introduction: What makes these best
2. How We Evaluated: Criteria
3. Top Picks: Ranked list
4. Detailed Reviews: Each item
5. Comparison: Quick table
6. How to Choose: Decision guide

WORD COUNT: {wordCount}
KEYWORDS: {keywords}
LANGUAGE: {language}`,
        keywords: ['best', 'top', 'review', 'comparison'],
        wordCount: 2000,
        framework: 'list',
    },
];

/**
 * Hybrid Templates (Combines both styles)
 */
export const HYBRID_TEMPLATES: ContentTemplate[] = [
    {
        id: 'hybrid-comprehensive-guide',
        name: 'Comprehensive Financial Guide',
        description: 'Complete guide combining education and practical advice',
        category: 'investing-basics',
        style: 'hybrid',
        structure: [
            { type: 'intro', title: 'Introduction', placeholder: 'Overview and importance', required: true },
            { type: 'body', title: 'Understanding the Basics', placeholder: 'Educational foundation', required: true },
            { type: 'body', title: 'How to Get Started', placeholder: 'Practical steps', required: true },
            { type: 'comparison', title: 'Options Comparison', placeholder: 'Compare available options', required: true },
            { type: 'body', title: 'Real-World Examples', placeholder: 'Case studies', required: true },
            { type: 'body', title: 'Common Mistakes', placeholder: 'What to avoid', required: true },
            { type: 'faq', title: 'Frequently Asked Questions', placeholder: 'Common questions', required: false },
            { type: 'conclusion', title: 'Key Takeaways', placeholder: 'Summary and next steps', required: true },
        ],
        promptTemplate: `You are a financial expert writing a comprehensive guide: {topic}

Combine Investopedia's educational depth with NerdWallet's practical approach.

STYLE REQUIREMENTS:
- Educational yet practical
- Detailed explanations with actionable steps
- Real-world examples
- Comparison elements
- User-friendly language
- Authoritative sources

STRUCTURE:
1. Introduction: Overview
2. Understanding: Educational foundation
3. How to Get Started: Practical steps
4. Options Comparison: Compare choices
5. Real-World Examples: Case studies
6. Common Mistakes: What to avoid
7. FAQs: Common questions
8. Key Takeaways: Summary

WORD COUNT: {wordCount}
KEYWORDS: {keywords}
LANGUAGE: {language}`,
        keywords: ['guide', 'comprehensive', 'financial planning'],
        wordCount: 2500,
        framework: 'hybrid',
    },
];

/**
 * All templates combined
 */
export const ALL_TEMPLATES: ContentTemplate[] = [
    ...INVESTOPEDIA_TEMPLATES,
    ...NERDWALLET_TEMPLATES,
    ...HYBRID_TEMPLATES,
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ContentTemplate | undefined {
    return ALL_TEMPLATES.find(t => t.id === id);
}

/**
 * Get templates by style
 */
export function getTemplatesByStyle(style: 'investopedia' | 'nerdwallet' | 'hybrid'): ContentTemplate[] {
    return ALL_TEMPLATES.filter(t => t.style === style);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): ContentTemplate[] {
    return ALL_TEMPLATES.filter(t => t.category === category);
}











