/**
 * 📝 PRODUCTION CONTENT TEMPLATES LIBRARY
 * 
 * Structured templates for consistent, high-quality content generation
 * across different article types and formats.
 * 
 * TEMPLATE TYPES:
 * 1. Comparison Guide (Product A vs Product B)
 * 2. How-To Guide (Step-by-step instructions)
 * 3. Ultimate Guide (Comprehensive deep-dive)
 * 4. Listicle (Top 10, Best X for Y)
 * 5. Product Review (Individual product analysis)
 * 6. Beginner's Guide (Introduction to topic)
 * 7. Case Study (Real-world example analysis)
 * 
 * FEATURES:
 * - Structured outlines
 * - Required sections
 * - Quality criteria per template
 * - SEO checkpoints
 * - Word count targets
 * - Schema markup recommendations
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ContentSection {
    heading: string;
    purpose: string;
    min_words: number;
    max_words: number;
    required: boolean;
    seo_keywords_count?: number;
    includes_cta?: boolean;
}

export interface ContentTemplate {
    id: string;
    name: string;
    description: string;
    use_cases: string[];
    target_word_count: { min: number; max: number };
    target_audience: string;
    
    // Structure
    sections: ContentSection[];
    
    // Quality criteria
    required_elements: string[];
    seo_checkpoints: string[];
    schema_types: string[];
    
    // Prompts
    system_prompt: string;
    article_prompt_template: string;
}

// ============================================================================
// TEMPLATE 1: COMPARISON GUIDE
// ============================================================================

export const COMPARISON_GUIDE: ContentTemplate = {
    id: 'comparison_guide',
    name: 'Comparison Guide',
    description: 'Compare two or more products/services side-by-side',
    use_cases: ['Best X vs Best Y', 'Product A vs Product B for Z'],
    target_word_count: { min: 2000, max: 3500 },
    target_audience: 'Buyers in decision phase',
    
    sections: [
        {
            heading: 'Introduction',
            purpose: 'Set context and explain comparison criteria',
            min_words: 150,
            max_words: 300,
            required: true,
            seo_keywords_count: 2
        },
        {
            heading: 'Quick Comparison Table',
            purpose: 'At-a-glance feature comparison',
            min_words: 0,  // Table
            max_words: 0,
            required: true
        },
        {
            heading: '[Product A] Overview',
            purpose: 'Detailed look at first product',
            min_words: 300,
            max_words: 500,
            required: true,
            seo_keywords_count: 3
        },
        {
            heading: '[Product B] Overview',
            purpose: 'Detailed look at second product',
            min_words: 300,
            max_words: 500,
            required: true,
            seo_keywords_count: 3
        },
        {
            heading: 'Feature Comparison',
            purpose: 'Compare specific features in detail',
            min_words: 400,
            max_words: 600,
            required: true
        },
        {
            heading: 'Pricing Comparison',
            purpose: 'Compare costs and value',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Pros and Cons',
            purpose: 'Summarize advantages and disadvantages',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Which One Should You Choose?',
            purpose: 'Recommendation based on use case',
            min_words: 250,
            max_words: 400,
            required: true,
            includes_cta: true
        },
        {
            heading: 'FAQs',
            purpose: 'Answer common questions',
            min_words: 300,
            max_words: 500,
            required: true
        }
    ],
    
    required_elements: [
        'Comparison table',
        'Clear verdict/recommendation',
        'Data-driven comparisons',
        'At least 3 pros and 3 cons for each',
        'Price details',
        'Use case scenarios'
    ],
    
    seo_checkpoints: [
        'Primary keyword in title',
        'Both product names in H1',
        'Keyword in first paragraph',
        'Table markup for comparison',
        'FAQ schema',
        'Product schema for each item'
    ],
    
    schema_types: ['Article', 'Product', 'FAQPage'],
    
    system_prompt: `You are an expert financial product analyst writing comprehensive comparison guides for Indian consumers. Your writing is authoritative, data-driven, and helps readers make informed decisions.`,
    
    article_prompt_template: `Write a comprehensive comparison guide: "{title}"

Compare the following products/services:
1. {productA}
2. {productB}

Target audience: {audience}
Context: {context}

STRUCTURE REQUIREMENTS:
- Start with a brief introduction (150-300 words)
- Include a comparison table with key features
- Provide detailed overviews of each product (300-500 words each)
- Compare features, pricing, and value
- Give pros and cons for each
- Provide a clear recommendation based on use case
- End with 5-7 FAQs

QUALITY REQUIREMENTS:
- Use specific data and numbers
- Be objective and balanced
- Focus on Indian market specifics  
- Include real-world examples
- Provide actionable recommendations

Write in a professional, trustworthy tone. Use bullet points and tables for clarity.`
};

// ============================================================================
// TEMPLATE 2: HOW-TO GUIDE
// ============================================================================

export const HOWTO_GUIDE: ContentTemplate = {
    id: 'howto_guide',
    name: 'How-To Guide',
    description: 'Step-by-step instructions for completing a task',
    use_cases: ['How to X', 'Complete guide to Y'],
    target_word_count: { min: 1500, max: 2500 },
    target_audience: 'Action-takers seeking instructions',
    
    sections: [
        {
            heading: 'Introduction',
            purpose: 'Explain what readers will learn',
            min_words: 150,
            max_words: 250,
            required: true
        },
        {
            heading: 'Prerequisites/What You Need',
            purpose: 'List requirements before starting',
            min_words: 100,
            max_words: 200,
            required: true
        },
        {
            heading: 'Step-by-Step Instructions',
            purpose: 'Detailed walkthrough of the process',
            min_words: 800,
            max_words: 1500,
            required: true,
            seo_keywords_count: 5
        },
        {
            heading: 'Common Mistakes to Avoid',
            purpose: 'Help readers avoid pitfalls',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Tips for Success',
            purpose: 'Expert tips and best practices',
            min_words: 200,
            max_words: 300,
            required: false
        },
        {
            heading: 'FAQs',
            purpose: 'Answer common questions',
            min_words: 250,
            max_words: 400,
            required: true
        },
        {
            heading: 'Conclusion',
            purpose: 'Summarize and encourage action',
            min_words: 150,
            max_words: 250,
            required: true,
            includes_cta: true
        }
    ],
    
    required_elements: [
        'Numbered steps (at least 5)',
        'Clear prerequisites',
        'Screenshots or examples (mention where needed)',
        'Time estimate',
        'Difficulty level',
        'Success criteria'
    ],
    
    seo_checkpoints: [
        'How-to in title',
        'Keyword in H1',
        'Steps in ordered list',
        'HowTo schema markup',
        'Internal links to related guides'
    ],
    
    schema_types: ['Article', 'HowTo', 'FAQPage'],
    
    system_prompt: `You are an expert educator writing clear, actionable how-to guides for Indian readers. Your instructions are detailed, easy to follow, and include practical examples.`,
    
    article_prompt_template: `Write a comprehensive how-to guide: "{title}"

Topic: {topic}
Target audience: {audience}
Complexity level: {complexity}

STRUCTURE REQUIREMENTS:
- Introduction explaining the outcome (150-250 words)
- Prerequisites and what's needed (100-200 words)
- Step-by-step instructions with at least 5 clear steps (800-1500 words)
- Common mistakes section (200-400 words)
- Expert tips (200-300 words)
- 5-7 FAQs
- Motivating conclusion with call-to-action

QUALITY REQUIREMENTS:
- Use numbered lists for steps
- Be specific and actionable
- Include time estimates
- Mention where screenshots would help
- Address Indian market specifics
- Provide real examples

Write in a clear, encouraging tone. Make it easy for anyone to follow.`
};

// ============================================================================
// TEMPLATE 3: ULTIMATE GUIDE
// ============================================================================

export const ULTIMATE_GUIDE: ContentTemplate = {
    id: 'ultimate_guide',
    name: 'Ultimate Guide',
    description: 'Comprehensive deep-dive covering all aspects of a topic',
    use_cases: ['Complete guide to X', 'Everything you need to know about Y'],
    target_word_count: { min: 3000, max: 5000 },
    target_audience: 'Learners seeking comprehensive knowledge',
    
    sections: [
        {
            heading: 'Introduction',
            purpose: 'Set stage for comprehensive coverage',
            min_words: 200,
            max_words: 350,
            required: true
        },
        {
            heading: 'Table of Contents',
            purpose: 'Guide navigation',
            min_words: 0,
            max_words: 0,
            required: true
        },
        {
            heading: 'What is [Topic]?',
            purpose: 'Define and explain basics',
            min_words: 400,
            max_words: 600,
            required: true,
            seo_keywords_count: 3
        },
        {
            heading: 'Why [Topic] Matters',
            purpose: 'Establish importance and benefits',
            min_words: 300,
            max_words: 500,
            required: true
        },
        {
            heading: 'Core Concepts (3-5 subsections)',
            purpose: 'Deep dive into key aspects',
            min_words: 1000,
            max_words: 2000,
            required: true,
            seo_keywords_count: 8
        },
        {
            heading: 'How to Get Started',
            purpose: 'Actionable first steps',
            min_words: 400,
            max_words: 600,
            required: true
        },
        {
            heading: 'Advanced Tips and Strategies',
            purpose: 'Expert-level insights',
            min_words: 400,
            max_words: 600,
            required: false
        },
        {
            heading: 'Common Mistakes and How to Avoid Them',
            purpose: 'Learn from failures',
            min_words: 300,
            max_words: 500,
            required: true
        },
        {
            heading: 'Tools and Resources',
            purpose: 'Recommend helpful resources',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'FAQs',
            purpose: 'Comprehensive Q&A',
            min_words: 400,
            max_words: 800,
            required: true
        },
        {
            heading: 'Conclusion and Next Steps',
            purpose: 'Wrap up and guide action',
            min_words: 200,
            max_words: 350,
            required: true,
            includes_cta: true
        }
    ],
    
    required_elements: [
        'Table of contents',
        'Minimum 10 H2 headings',
        'At least 3 tables or charts (mentioned)',
        'Internal links to related content',
        'External authoritative sources',
        'Real-world examples',
        'Data and statistics'
    ],
    
    seo_checkpoints: [
        'Primary keyword in title and H1',
        'LSI keywords throughout',
        'Comprehensive keyword coverage',
        'Table of contents markup',
        '10+ internal links',
        'Schema markup for all applicable types'
    ],
    
    schema_types: ['Article', 'FAQPage', 'HowTo'],
    
    system_prompt: `You are an authoritative expert writing the definitive guide on financial topics for Indian readers. Your content is comprehensive, well-researched, and establishes thought leadership.`,
    
    article_prompt_template: `Write the ultimate comprehensive guide: "{title}"

Topic: {topic}
Audience expertise level: {expertiseLevel}

STRUCTURE REQUIREMENTS:
- Engaging introduction (200-350 words)
- Table of contents
- What is [topic]? definition and basics (400-600 words)
- Why it matters (300-500 words)
- 3-5 core concept sections (1000-2000 words total)
- How to get started (400-600 words)
- Advanced strategies (400-600 words)
- Common mistakes (300-500 words)
- Tools and resources (200-400 words)
- Comprehensive FAQs (at least 10 questions)
- Conclusion with next steps

QUALITY REQUIREMENTS:
- Use data, statistics, and examples throughout
- Include tables and visual references
- Link to reputable sources
- Provide Indian market context
- Cover beginner to advanced levels
- Make it the most comprehensive resource available

Write in an authoritative yet accessible tone. This should be THE reference guide.`
};

// ============================================================================
// TEMPLATE 4: LISTICLE
// ============================================================================

export const LISTICLE: ContentTemplate = {
    id: 'listicle',
    name: 'Listicle (Top 10, Best X)',
    description: 'Ranked or numbered list of items with brief descriptions',
    use_cases: ['Top 10 X', 'Best Y for Z', '7 Ways to...'],
    target_word_count: { min: 1800, max: 2500 },
    target_audience: 'Quick browsers seeking curated lists',
    
    sections: [
        {
            heading: 'Introduction',
            purpose: 'Set up the list and selection criteria',
            min_words: 150,
            max_words: 250,
            required: true
        },
        {
            heading: 'Our Selection Criteria',
            purpose: 'Explain how items were chosen',
            min_words: 100,
            max_words: 200,
            required: true
        },
        {
            heading: 'The List (7-15 items)',
            purpose: 'Main numbered/ranked content',
            min_words: 1200,
            max_words: 1800,
            required: true,
            seo_keywords_count: 10
        },
        {
            heading: 'Comparison Table',
            purpose: 'Quick reference summary',
            min_words: 0,
            max_words: 0,
            required: true
        },
        {
            heading: 'How to Choose the Right One',
            purpose: 'Help readers decide',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'FAQs',
            purpose: 'Answer common questions',
            min_words: 200,
            max_words: 400,
            required: true
        }
    ],
    
    required_elements: [
        'Numbered list (7-15 items)',
        'Each item: name, description (150-200 words), pros/cons, rating',
        'Comparison table',
        'Clear selection criteria',
        'At least one image/mention per item'
    ],
    
    seo_checkpoints: [
        'Number in title (e.g., "Top 10")',
        'Keyword in H1',
        'Each list item as H3',
        'Schema markup for list',
        'FAQ schema'
    ],
    
    schema_types: ['Article', 'FAQPage'],
    
    system_prompt: `You are an expert curator writing engaging listicles for Indian readers. Your lists are well-researched, balanced, and help readers make quick decisions.`,
    
    article_prompt_template: `Write an engaging listicle: "{title}"

Topic: {topic}
Number of items: {count}
Ranking criteria: {criteria}

STRUCTURE REQUIREMENTS:
- Introduction with context (150-250 words)
- Selection criteria explanation (100-200 words)
- Numbered list with {count} items:
  * Each item: 150-200 words
  * Include: key features, pros, cons, best for
  * Add ratings or rankings
- Comparison table summarizing all items
- How to choose guide (200-400 words)
- 5-7 FAQs

QUALITY REQUIREMENTS:
- Be objective and balanced
- Use specific data and features
- Include pricing in INR
- Mention Indian availability
- Provide clear rankings/ratings
- Add real user perspectives

Write in an engaging, scannable format. Make it easy to compare options quickly.`
};

// ============================================================================
// TEMPLATE SELECTOR
// ============================================================================

export function selectTemplate(contentType: string): ContentTemplate {
    const templates: Record<string, ContentTemplate> = {
        'comparison': COMPARISON_GUIDE,
        'howto': HOWTO_GUIDE,
        'ultimate': ULTIMATE_GUIDE,
        'listicle': LISTICLE
    };
    
    return templates[contentType] || ULTIMATE_GUIDE;
}

export function getAllTemplates(): ContentTemplate[] {
    return [
        COMPARISON_GUIDE,
        HOWTO_GUIDE,
        ULTIMATE_GUIDE,
        LISTICLE
    ];
}

// ============================================================================
// TEMPLATE VALIDATOR
// ============================================================================

export function validateContent(content: string, template: ContentTemplate): {
    valid: boolean;
    score: number;
    missing_sections: string[];
    missing_elements: string[];
    word_count: number;
    recommendations: string[];
} {
    const wordCount = content.split(/\s+/).length;
    const missingSections: string[] = [];
    const missingElements: string[] = [];
    const recommendations: string[] = [];
    
    // Check sections
    template.sections.forEach(section => {
        if (section.required) {
            const hasSection = content.toLowerCase().includes(section.heading.toLowerCase());
            if (!hasSection) {
                missingSections.push(section.heading);
            }
        }
    });
    
    // Check required elements
    template.required_elements.forEach(element => {
        const hasElement = content.toLowerCase().includes(element.toLowerCase());
        if (!hasElement) {
            missingElements.push(element);
        }
    });
    
    // Check word count
    if (wordCount < template.target_word_count.min) {
        recommendations.push(`Increase word count to at least ${template.target_word_count.min} words (current: ${wordCount})`);
    }
    
    // Calculate score
    let score = 100;
    score -= missingSections.length * 10;
    score -= missingElements.length * 5;
    if (wordCount < template.target_word_count.min) score -= 15;
    if (wordCount > template.target_word_count.max) score -= 10;
    
    return {
        valid: missingSections.length === 0 && missingElements.length === 0,
        score: Math.max(0, score),
        missing_sections: missingSections,
        missing_elements: missingElements,
        word_count: wordCount,
        recommendations
    };
}
