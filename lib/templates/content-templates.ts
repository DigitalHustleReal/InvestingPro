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

// ============================================================================
// TEMPLATE 5: GUIDE (101 Guides for Personal Finance)
// ============================================================================

export const GUIDE_TEMPLATE: ContentTemplate = {
    id: 'guide',
    name: 'Personal Finance Guide',
    description: 'Comprehensive guide for personal finance topics (e.g., "Investing 101", "Budgeting Basics")',
    use_cases: ['101 Guide to X', 'Complete Beginner Guide to Y', 'X Basics'],
    target_word_count: { min: 1500, max: 3000 },
    target_audience: 'Beginners seeking foundational knowledge',
    
    sections: [
        {
            heading: 'Introduction',
            purpose: 'Hook the reader and explain what they will learn',
            min_words: 100,
            max_words: 200,
            required: true,
            seo_keywords_count: 2
        },
        {
            heading: 'What is [Topic]?',
            purpose: 'Define the core concept clearly',
            min_words: 150,
            max_words: 300,
            required: true,
            seo_keywords_count: 3
        },
        {
            heading: 'Why is [Topic] Important?',
            purpose: 'Explain the benefits and importance',
            min_words: 150,
            max_words: 300,
            required: true
        },
        {
            heading: 'Key Concepts',
            purpose: 'Break down main concepts with examples',
            min_words: 300,
            max_words: 600,
            required: true,
            seo_keywords_count: 5
        },
        {
            heading: 'How to Get Started',
            purpose: 'Step-by-step actionable guide',
            min_words: 300,
            max_words: 600,
            required: true
        },
        {
            heading: 'Common Mistakes to Avoid',
            purpose: 'List common pitfalls and how to avoid them',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Tools and Resources',
            purpose: 'Recommend tools, apps, or resources',
            min_words: 150,
            max_words: 300,
            required: false
        },
        {
            heading: 'Conclusion',
            purpose: 'Summarize key takeaways and next steps',
            min_words: 100,
            max_words: 200,
            required: true,
            includes_cta: true
        }
    ],
    
    required_elements: [
        'Clear definition of topic',
        'Practical examples',
        'Step-by-step instructions',
        'Common mistakes section',
        'Actionable takeaways',
        'Internal links to related content'
    ],
    
    seo_checkpoints: [
        'Primary keyword in title and H1',
        'Keyword in first paragraph',
        'LSI keywords throughout',
        'Internal links (3-5)',
        'FAQ section',
        'HowTo schema markup'
    ],
    
    schema_types: ['Article', 'HowTo', 'FAQPage'],
    
    system_prompt: `You are an expert educator writing beginner-friendly guides on personal finance topics for Indian readers. Your writing is clear, practical, and helps readers take action.`,
    
    article_prompt_template: `Write a comprehensive beginner's guide: "{title}"

Topic: {topic}
Target audience: Beginners new to personal finance
Context: {context}

STRUCTURE REQUIREMENTS:
- Engaging introduction explaining what readers will learn (100-200 words)
- Clear definition: "What is [topic]?" (150-300 words)
- Importance section: "Why is [topic] important?" (150-300 words)
- Key concepts breakdown with examples (300-600 words)
- Step-by-step "How to Get Started" guide (300-600 words)
- Common mistakes to avoid (200-400 words)
- Tools and resources (150-300 words)
- Conclusion with actionable next steps (100-200 words)

QUALITY REQUIREMENTS:
- Use simple, clear language
- Include real-world examples relevant to Indian context
- Provide actionable steps
- Address common beginner questions
- Use bullet points and numbered lists for clarity
- Include practical tips and warnings

Write in a friendly, encouraging tone. Make complex topics accessible.`
};

// ============================================================================
// TEMPLATE 6: PILLAR PAGE (Comprehensive Topic Pages)
// ============================================================================

export const PILLAR_PAGE: ContentTemplate = {
    id: 'pillar',
    name: 'Pillar Page',
    description: 'Comprehensive pillar page covering a major topic in depth',
    use_cases: ['Complete Guide to X', 'Everything About Y', 'Ultimate Resource for Z'],
    target_word_count: { min: 3000, max: 6000 },
    target_audience: 'Learners seeking comprehensive knowledge',
    
    sections: [
        {
            heading: 'Hero Section',
            purpose: 'Compelling introduction with main value proposition',
            min_words: 200,
            max_words: 400,
            required: true,
            seo_keywords_count: 3
        },
        {
            heading: 'Table of Contents',
            purpose: 'Interactive table of contents for easy navigation',
            min_words: 50,
            max_words: 200,
            required: true
        },
        {
            heading: 'Overview',
            purpose: 'High-level overview of the topic',
            min_words: 300,
            max_words: 500,
            required: true
        },
        {
            heading: 'Fundamentals',
            purpose: 'Core fundamentals and principles',
            min_words: 500,
            max_words: 1000,
            required: true,
            seo_keywords_count: 5
        },
        {
            heading: 'Advanced Concepts',
            purpose: 'Advanced topics and strategies',
            min_words: 500,
            max_words: 1000,
            required: true,
            seo_keywords_count: 5
        },
        {
            heading: 'Strategies and Best Practices',
            purpose: 'Actionable strategies and best practices',
            min_words: 400,
            max_words: 800,
            required: true
        },
        {
            heading: 'Case Studies and Examples',
            purpose: 'Real-world examples and case studies',
            min_words: 300,
            max_words: 600,
            required: false
        },
        {
            heading: 'Frequently Asked Questions',
            purpose: 'Common questions and answers',
            min_words: 300,
            max_words: 600,
            required: true
        },
        {
            heading: 'Conclusion',
            purpose: 'Summary and call-to-action',
            min_words: 200,
            max_words: 400,
            required: true,
            includes_cta: true
        }
    ],
    
    required_elements: [
        'Table of contents',
        'Minimum 10 H2 headings',
        'Comprehensive coverage from basics to advanced',
        'Real-world examples',
        'Internal links to related content (10+)',
        'External authoritative sources',
        'Data and statistics'
    ],
    
    seo_checkpoints: [
        'Primary keyword in title and H1',
        'LSI keywords throughout',
        'Table of contents markup',
        '10+ internal links',
        'FAQ schema',
        'Breadcrumb schema',
        'Comprehensive keyword coverage'
    ],
    
    schema_types: ['Article', 'FAQPage', 'BreadcrumbList'],
    
    system_prompt: `You are an authoritative expert writing the definitive pillar page on financial topics for Indian readers. Your content is comprehensive, well-researched, and establishes thought leadership.`,
    
    article_prompt_template: `Write a comprehensive pillar page: "{title}"

Topic: {topic}
Audience: Mixed (beginner to advanced)
Context: {context}

STRUCTURE REQUIREMENTS:
- Hero section with compelling introduction (200-400 words)
- Table of contents
- Overview section (300-500 words)
- Fundamentals section covering core concepts (500-1000 words)
- Advanced concepts section (500-1000 words)
- Strategies and best practices (400-800 words)
- Case studies and examples (300-600 words)
- Comprehensive FAQs (300-600 words)
- Conclusion with next steps (200-400 words)

QUALITY REQUIREMENTS:
- Cover topic comprehensively from basics to advanced
- Use data, statistics, and examples throughout
- Include tables and visual references
- Link to reputable sources
- Provide Indian market context
- Make it the most comprehensive resource available

Write in an authoritative yet accessible tone. This should be THE reference guide.`
};

// ============================================================================
// TEMPLATE 7: INSIGHTS (News, Analysis, Market Insights)
// ============================================================================

export const INSIGHTS_TEMPLATE: ContentTemplate = {
    id: 'insights',
    name: 'Insights Article',
    description: 'News, analysis, and market insights for personal finance',
    use_cases: ['Market Analysis', 'Economic Trends', 'Industry Insights', 'News Commentary'],
    target_word_count: { min: 1200, max: 2500 },
    target_audience: 'Informed readers seeking analysis',
    
    sections: [
        {
            heading: 'Hook/Lead',
            purpose: 'Compelling opening that grabs attention',
            min_words: 100,
            max_words: 200,
            required: true,
            seo_keywords_count: 2
        },
        {
            heading: 'Context',
            purpose: 'Provide background and context',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Analysis',
            purpose: 'Deep dive analysis of the topic',
            min_words: 400,
            max_words: 800,
            required: true,
            seo_keywords_count: 5
        },
        {
            heading: 'Implications',
            purpose: 'What this means for readers',
            min_words: 300,
            max_words: 600,
            required: true
        },
        {
            heading: 'Action Items',
            purpose: 'What readers should do',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Conclusion',
            purpose: 'Wrap up with key takeaways',
            min_words: 100,
            max_words: 200,
            required: true
        }
    ],
    
    required_elements: [
        'Timely and relevant hook',
        'Data-driven analysis',
        'Clear implications',
        'Actionable recommendations',
        'Current statistics',
        'Expert perspective'
    ],
    
    seo_checkpoints: [
        'Keyword in title and H1',
        'Timely/recent information',
        'Data and statistics',
        'Internal links (2-4)',
        'External authoritative sources',
        'NewsArticle schema'
    ],
    
    schema_types: ['Article', 'NewsArticle'],
    
    system_prompt: `You are a financial analyst writing timely insights and analysis for Indian readers. Your writing is data-driven, insightful, and helps readers understand market trends.`,
    
    article_prompt_template: `Write an insights article: "{title}"

Topic: {topic}
Context: {context}
Current date: {date}

STRUCTURE REQUIREMENTS:
- Compelling hook/lead that grabs attention (100-200 words)
- Context section providing background (200-400 words)
- Deep analysis section (400-800 words)
- Implications for readers (300-600 words)
- Action items (200-400 words)
- Conclusion with key takeaways (100-200 words)

QUALITY REQUIREMENTS:
- Use current data and statistics
- Provide expert analysis
- Include actionable insights
- Address Indian market context
- Reference recent developments
- Be objective and balanced

Write in a professional, analytical tone. Focus on what matters to readers.`
};

// ============================================================================
// TEMPLATE 8: VERSES (Short-form, Inspirational Content)
// ============================================================================

export const VERSES_TEMPLATE: ContentTemplate = {
    id: 'verses',
    name: 'Verses Article',
    description: 'Short-form, inspirational, or motivational content',
    use_cases: ['Financial Wisdom', 'Investment Quotes', 'Motivational Content', 'Quick Insights'],
    target_word_count: { min: 800, max: 1500 },
    target_audience: 'Readers seeking inspiration and quick insights',
    
    sections: [
        {
            heading: 'Opening',
            purpose: 'Engaging opening that sets the tone',
            min_words: 100,
            max_words: 200,
            required: true
        },
        {
            heading: 'Main Content',
            purpose: 'Core message or verses',
            min_words: 400,
            max_words: 800,
            required: true,
            seo_keywords_count: 3
        },
        {
            heading: 'Reflection',
            purpose: 'Encourage reflection and application',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Closing',
            purpose: 'Inspirational closing',
            min_words: 100,
            max_words: 200,
            required: true
        }
    ],
    
    required_elements: [
        'Engaging opening',
        'Core message/verses',
        'Reflection prompts',
        'Inspirational tone',
        'Actionable takeaway'
    ],
    
    seo_checkpoints: [
        'Keyword in title',
        'Engaging content',
        'Internal links (1-3)',
        'Shareable format'
    ],
    
    schema_types: ['Article'],
    
    system_prompt: `You are a thoughtful writer creating inspirational content about personal finance for Indian readers. Your writing is uplifting, meaningful, and encourages positive financial habits.`,
    
    article_prompt_template: `Write a verses/inspirational article: "{title}"

Topic: {topic}
Tone: Inspirational and thoughtful
Context: {context}

STRUCTURE REQUIREMENTS:
- Engaging opening that sets the tone (100-200 words)
- Main content with core message/verses (400-800 words)
- Reflection section encouraging application (200-400 words)
- Inspirational closing (100-200 words)

QUALITY REQUIREMENTS:
- Use inspiring language
- Include meaningful quotes or verses
- Encourage reflection
- Provide actionable insights
- Keep it concise and impactful
- Make it shareable

Write in a warm, inspirational tone. Focus on wisdom and positive change.`
};

// ============================================================================
// TEMPLATE 9: NEWSLETTER (Email Newsletters)
// ============================================================================

export const NEWSLETTER_TEMPLATE: ContentTemplate = {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Email newsletter format for regular updates and insights',
    use_cases: ['Weekly Newsletter', 'Monthly Digest', 'Email Updates'],
    target_word_count: { min: 700, max: 1500 },
    target_audience: 'Subscribers seeking curated content',
    
    sections: [
        {
            heading: 'Header/Greeting',
            purpose: 'Personal greeting and newsletter introduction',
            min_words: 50,
            max_words: 100,
            required: true
        },
        {
            heading: 'Featured Story',
            purpose: 'Main featured article or insight',
            min_words: 300,
            max_words: 500,
            required: true,
            seo_keywords_count: 3
        },
        {
            heading: 'Quick Tips',
            purpose: 'Actionable tips in bullet format',
            min_words: 100,
            max_words: 200,
            required: true
        },
        {
            heading: 'Market Update',
            purpose: 'Brief market or industry update',
            min_words: 150,
            max_words: 300,
            required: false
        },
        {
            heading: 'Resources & Links',
            purpose: 'Links to additional resources',
            min_words: 50,
            max_words: 150,
            required: false
        },
        {
            heading: 'Closing',
            purpose: 'Sign-off and call-to-action',
            min_words: 50,
            max_words: 100,
            required: true,
            includes_cta: true
        }
    ],
    
    required_elements: [
        'Personal greeting',
        'Featured story',
        'Quick tips section',
        'Call-to-action',
        'Unsubscribe link mention'
    ],
    
    seo_checkpoints: [
        'Engaging subject line',
        'Clear structure',
        'Internal links',
        'CTA button'
    ],
    
    schema_types: ['Article'],
    
    system_prompt: `You are a newsletter editor creating engaging email content for personal finance subscribers. Your writing is concise, valuable, and encourages engagement.`,
    
    article_prompt_template: `Write a newsletter: "{title}"

Topic: {topic}
Date: {date}
Context: {context}

STRUCTURE REQUIREMENTS:
- Personal greeting (50-100 words)
- Featured story with main insight (300-500 words)
- Quick tips section (100-200 words)
- Optional market update (150-300 words)
- Optional resources section (50-150 words)
- Closing with CTA (50-100 words)

QUALITY REQUIREMENTS:
- Keep it concise and scannable
- Use bullet points for tips
- Include actionable content
- Make it personal and engaging
- Include clear CTAs
- Format for email readability

Write in a friendly, conversational tone. Make it valuable and shareable.`
};

// ============================================================================
// TEMPLATE 10: CASE STUDY (Real-World Examples)
// ============================================================================

export const CASE_STUDY_TEMPLATE: ContentTemplate = {
    id: 'case-study',
    name: 'Case Study',
    description: 'Real-world case studies and success stories',
    use_cases: ['Success Stories', 'Real Examples', 'Case Analysis'],
    target_word_count: { min: 1200, max: 2500 },
    target_audience: 'Readers seeking practical examples',
    
    sections: [
        {
            heading: 'Executive Summary',
            purpose: 'Brief overview of the case study',
            min_words: 100,
            max_words: 200,
            required: true,
            seo_keywords_count: 2
        },
        {
            heading: 'Background & Context',
            purpose: 'Setting the scene and context',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'The Challenge',
            purpose: 'Specific problems or goals',
            min_words: 150,
            max_words: 300,
            required: true
        },
        {
            heading: 'The Solution',
            purpose: 'Approach and methodology used',
            min_words: 300,
            max_words: 600,
            required: true,
            seo_keywords_count: 3
        },
        {
            heading: 'Results & Outcomes',
            purpose: 'Measurable results and achievements',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Key Takeaways',
            purpose: 'Lessons learned and insights',
            min_words: 150,
            max_words: 300,
            required: true
        },
        {
            heading: 'Conclusion',
            purpose: 'Wrap up and implications',
            min_words: 100,
            max_words: 200,
            required: true
        }
    ],
    
    required_elements: [
        'Clear problem statement',
        'Detailed solution approach',
        'Quantifiable results',
        'Key lessons learned',
        'Actionable takeaways'
    ],
    
    seo_checkpoints: [
        'Keyword in title',
        'Problem-solution structure',
        'Data and metrics',
        'Internal links (3-5)',
        'CaseStudy schema'
    ],
    
    schema_types: ['Article', 'CaseStudy'],
    
    system_prompt: `You are a business analyst writing detailed case studies for Indian readers. Your writing is structured, data-driven, and provides actionable insights.`,
    
    article_prompt_template: `Write a case study: "{title}"

Subject: {subject}
Challenge: {challenge}
Solution: {solution}
Context: {context}

STRUCTURE REQUIREMENTS:
- Executive summary (100-200 words)
- Background and context (200-400 words)
- The challenge section (150-300 words)
- The solution approach (300-600 words)
- Results and outcomes with metrics (200-400 words)
- Key takeaways (150-300 words)
- Conclusion (100-200 words)

QUALITY REQUIREMENTS:
- Use specific data and numbers
- Tell a clear story
- Include before/after metrics
- Provide actionable insights
- Address Indian context
- Make it relatable

Write in a professional, narrative tone. Focus on lessons learned.`
};

// ============================================================================
// TEMPLATE 11: TUTORIAL (Step-by-Step Tutorials)
// ============================================================================

export const TUTORIAL_TEMPLATE: ContentTemplate = {
    id: 'tutorial',
    name: 'Tutorial',
    description: 'Step-by-step tutorials with screenshots/examples',
    use_cases: ['How-To Tutorials', 'Step-by-Step Guides', 'Process Tutorials'],
    target_word_count: { min: 1200, max: 2500 },
    target_audience: 'Action-takers seeking detailed instructions',
    
    sections: [
        {
            heading: 'Introduction',
            purpose: 'What will be learned and prerequisites',
            min_words: 100,
            max_words: 200,
            required: true,
            seo_keywords_count: 2
        },
        {
            heading: 'Overview',
            purpose: 'High-level overview of the process',
            min_words: 100,
            max_words: 200,
            required: true
        },
        {
            heading: 'Step 1: [Action]',
            purpose: 'First step with detailed instructions',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Step 2: [Action]',
            purpose: 'Second step',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Step 3: [Action]',
            purpose: 'Third step',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Troubleshooting',
            purpose: 'Common issues and solutions',
            min_words: 150,
            max_words: 300,
            required: false
        },
        {
            heading: 'Summary',
            purpose: 'Recap and next steps',
            min_words: 100,
            max_words: 200,
            required: true,
            includes_cta: true
        }
    ],
    
    required_elements: [
        'Numbered steps (at least 3)',
        'Clear prerequisites',
        'Screenshot references',
        'Troubleshooting section',
        'Summary with next steps'
    ],
    
    seo_checkpoints: [
        'How-to in title',
        'Numbered steps',
        'HowTo schema markup',
        'Internal links (2-4)',
        'Screenshot mentions'
    ],
    
    schema_types: ['Article', 'HowTo'],
    
    system_prompt: `You are an expert instructor writing clear, detailed tutorials for Indian readers. Your instructions are step-by-step, easy to follow, and include practical examples.`,
    
    article_prompt_template: `Write a tutorial: "{title}"

Topic: {topic}
Objective: {objective}
Prerequisites: {prerequisites}

STRUCTURE REQUIREMENTS:
- Introduction with learning objectives (100-200 words)
- Overview of the process (100-200 words)
- Step 1: [Detailed instructions] (200-400 words)
- Step 2: [Detailed instructions] (200-400 words)
- Step 3: [Detailed instructions] (200-400 words)
- Troubleshooting section (150-300 words)
- Summary with next steps (100-200 words)

QUALITY REQUIREMENTS:
- Use numbered steps
- Be specific and actionable
- Mention where screenshots would help
- Include time estimates
- Address common issues
- Provide clear next steps

Write in a clear, instructional tone. Make it easy to follow.`
};

// ============================================================================
// TEMPLATE 12: REVIEW (Product/Service Reviews)
// ============================================================================

export const REVIEW_TEMPLATE: ContentTemplate = {
    id: 'review',
    name: 'Review',
    description: 'In-depth reviews of products, services, or tools',
    use_cases: ['Product Reviews', 'Service Reviews', 'Tool Reviews'],
    target_word_count: { min: 1500, max: 3000 },
    target_audience: 'Buyers seeking detailed evaluations',
    
    sections: [
        {
            heading: 'Introduction',
            purpose: 'What is being reviewed and why',
            min_words: 100,
            max_words: 200,
            required: true,
            seo_keywords_count: 2
        },
        {
            heading: 'Overview',
            purpose: 'Quick overview and key specs',
            min_words: 150,
            max_words: 300,
            required: true
        },
        {
            heading: 'Key Features',
            purpose: 'Detailed feature breakdown',
            min_words: 300,
            max_words: 600,
            required: true,
            seo_keywords_count: 5
        },
        {
            heading: 'Pros and Cons',
            purpose: 'Balanced pros and cons',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Pricing',
            purpose: 'Pricing information and value assessment',
            min_words: 150,
            max_words: 300,
            required: false
        },
        {
            heading: 'Our Verdict',
            purpose: 'Final rating and recommendation',
            min_words: 200,
            max_words: 400,
            required: true,
            includes_cta: true
        },
        {
            heading: 'Alternatives',
            purpose: 'Similar products/services to consider',
            min_words: 100,
            max_words: 200,
            required: false
        }
    ],
    
    required_elements: [
        'Detailed feature analysis',
        'Balanced pros and cons',
        'Clear rating/verdict',
        'Pricing information',
        "Who it's best for",
        'Comparison with alternatives'
    ],
    
    seo_checkpoints: [
        'Product name in title',
        'Review keyword',
        'Rating in content',
        'Product schema',
        'Review schema',
        'Internal links (3-5)'
    ],
    
    schema_types: ['Article', 'Product', 'Review'],
    
    system_prompt: `You are an expert reviewer writing honest, detailed reviews of financial products and services for Indian consumers. Your reviews are balanced, data-driven, and help readers make informed decisions.`,
    
    article_prompt_template: `Write a review: "{title}"

Product/Service: {product}
Category: {category}
Context: {context}

STRUCTURE REQUIREMENTS:
- Introduction explaining what's being reviewed (100-200 words)
- Overview with key specs (150-300 words)
- Detailed feature breakdown (300-600 words)
- Pros and cons section (200-400 words)
- Pricing information (150-300 words)
- Our verdict with rating (200-400 words)
- Alternatives section (100-200 words)

QUALITY REQUIREMENTS:
- Be honest and balanced
- Use specific data and examples
- Include pricing in INR
- Address Indian availability
- Provide clear rating
- Compare with alternatives

Write in a professional, trustworthy tone. Help readers make informed decisions.`
};

// ============================================================================
// TEMPLATE 13: ANALYSIS (Deep Dive Analysis)
// ============================================================================

export const ANALYSIS_TEMPLATE: ContentTemplate = {
    id: 'analysis',
    name: 'Analysis',
    description: 'In-depth analysis of trends, markets, or strategies',
    use_cases: ['Market Analysis', 'Trend Analysis', 'Strategy Analysis'],
    target_word_count: { min: 2000, max: 4000 },
    target_audience: 'Analytical readers seeking deep insights',
    
    sections: [
        {
            heading: 'Executive Summary',
            purpose: 'Key findings and conclusions',
            min_words: 150,
            max_words: 300,
            required: true,
            seo_keywords_count: 3
        },
        {
            heading: 'Methodology',
            purpose: 'How the analysis was conducted',
            min_words: 150,
            max_words: 300,
            required: true
        },
        {
            heading: 'Current State',
            purpose: 'Current situation and context',
            min_words: 300,
            max_words: 600,
            required: true
        },
        {
            heading: 'Key Findings',
            purpose: 'Main discoveries and insights',
            min_words: 400,
            max_words: 800,
            required: true,
            seo_keywords_count: 5
        },
        {
            heading: 'Implications',
            purpose: 'What this means for readers',
            min_words: 300,
            max_words: 600,
            required: true
        },
        {
            heading: 'Recommendations',
            purpose: 'Actionable recommendations',
            min_words: 200,
            max_words: 400,
            required: true
        },
        {
            heading: 'Conclusion',
            purpose: 'Summary and future outlook',
            min_words: 150,
            max_words: 300,
            required: true
        }
    ],
    
    required_elements: [
        'Data-driven analysis',
        'Clear methodology',
        'Key findings with evidence',
        'Actionable recommendations',
        'Future outlook',
        'Charts/data references'
    ],
    
    seo_checkpoints: [
        'Keyword in title',
        'Data and statistics',
        'Internal links (4-6)',
        'External authoritative sources',
        'Analysis structure'
    ],
    
    schema_types: ['Article'],
    
    system_prompt: `You are a financial analyst writing in-depth analysis for Indian readers. Your writing is data-driven, insightful, and provides actionable recommendations based on thorough research.`,
    
    article_prompt_template: `Write an analysis: "{title}"

Topic: {topic}
Time Period: {period}
Context: {context}

STRUCTURE REQUIREMENTS:
- Executive summary with key findings (150-300 words)
- Methodology explaining approach (150-300 words)
- Current state analysis (300-600 words)
- Key findings section (400-800 words)
- Implications for readers (300-600 words)
- Actionable recommendations (200-400 words)
- Conclusion with future outlook (150-300 words)

QUALITY REQUIREMENTS:
- Use data, statistics, and charts
- Explain methodology clearly
- Provide evidence for findings
- Address Indian market context
- Include actionable recommendations
- Reference authoritative sources

Write in a professional, analytical tone. Focus on insights and implications.`
};

// ============================================================================
// TEMPLATE 14: CHECKLIST (Actionable Checklists)
// ============================================================================

export const CHECKLIST_TEMPLATE: ContentTemplate = {
    id: 'checklist',
    name: 'Checklist',
    description: 'Actionable checklists for specific goals or processes',
    use_cases: ['Action Checklists', 'Process Checklists', 'Goal Checklists'],
    target_word_count: { min: 800, max: 1500 },
    target_audience: 'Action-takers seeking structured lists',
    
    sections: [
        {
            heading: 'Introduction',
            purpose: 'What the checklist is for',
            min_words: 100,
            max_words: 200,
            required: true
        },
        {
            heading: 'Preparation',
            purpose: 'What you need before starting',
            min_words: 100,
            max_words: 200,
            required: false
        },
        {
            heading: 'Main Checklist',
            purpose: 'The main checklist items',
            min_words: 300,
            max_words: 600,
            required: true,
            seo_keywords_count: 3
        },
        {
            heading: 'Tips & Best Practices',
            purpose: 'Helpful tips for completing the checklist',
            min_words: 150,
            max_words: 300,
            required: false
        },
        {
            heading: 'Next Steps',
            purpose: 'What to do after completing the checklist',
            min_words: 100,
            max_words: 200,
            required: true,
            includes_cta: true
        }
    ],
    
    required_elements: [
        'Clear checklist items',
        'Actionable tasks',
        'Tips section',
        'Next steps',
        'Printable format'
    ],
    
    seo_checkpoints: [
        'Checklist in title',
        'Numbered/bulleted items',
        'Internal links (2-4)',
        'HowTo schema'
    ],
    
    schema_types: ['Article', 'HowTo'],
    
    system_prompt: `You are an expert organizer creating actionable checklists for Indian readers. Your checklists are clear, comprehensive, and help readers accomplish goals systematically.`,
    
    article_prompt_template: `Write a checklist: "{title}"

Purpose: {purpose}
Goal: {goal}
Context: {context}

STRUCTURE REQUIREMENTS:
- Introduction explaining the checklist purpose (100-200 words)
- Optional preparation section (100-200 words)
- Main checklist with actionable items (300-600 words)
- Tips and best practices (150-300 words)
- Next steps after completion (100-200 words)

QUALITY REQUIREMENTS:
- Use clear, actionable items
- Organize by category if needed
- Include tips and warnings
- Make it scannable
- Provide next steps
- Format for printing

Write in a clear, organized tone. Make it easy to follow and complete.`
};

// ============================================================================
// TEMPLATE 15: FAQ (Frequently Asked Questions)
// ============================================================================

export const FAQ_TEMPLATE: ContentTemplate = {
    id: 'faq',
    name: 'FAQ',
    description: 'Frequently asked questions with detailed answers',
    use_cases: ['FAQ Pages', 'Common Questions', 'Q&A Content'],
    target_word_count: { min: 1000, max: 2000 },
    target_audience: 'Readers seeking quick answers',
    
    sections: [
        {
            heading: 'Introduction',
            purpose: 'Context for the FAQ',
            min_words: 100,
            max_words: 200,
            required: true
        },
        {
            heading: 'Q1: [Question]',
            purpose: 'First frequently asked question',
            min_words: 150,
            max_words: 300,
            required: true,
            seo_keywords_count: 2
        },
        {
            heading: 'Q2: [Question]',
            purpose: 'Second FAQ',
            min_words: 150,
            max_words: 300,
            required: true
        },
        {
            heading: 'Q3: [Question]',
            purpose: 'Third FAQ',
            min_words: 150,
            max_words: 300,
            required: true
        },
        {
            heading: 'Q4: [Question]',
            purpose: 'Fourth FAQ',
            min_words: 150,
            max_words: 300,
            required: true
        },
        {
            heading: 'Q5: [Question]',
            purpose: 'Fifth FAQ',
            min_words: 150,
            max_words: 300,
            required: true
        },
        {
            heading: 'Additional Resources',
            purpose: 'Links to more information',
            min_words: 100,
            max_words: 200,
            required: false
        }
    ],
    
    required_elements: [
        'At least 5 questions',
        'Detailed answers',
        'Clear Q&A format',
        'Additional resources',
        'Internal links'
    ],
    
    seo_checkpoints: [
        'FAQ in title',
        'Question keywords',
        'FAQPage schema',
        'Internal links (3-5)',
        'Structured Q&A format'
    ],
    
    schema_types: ['Article', 'FAQPage'],
    
    system_prompt: `You are an expert answering common questions about personal finance for Indian readers. Your answers are clear, comprehensive, and address real concerns.`,
    
    article_prompt_template: `Write an FAQ: "{title}"

Topic: {topic}
Common Questions: {questions}
Context: {context}

STRUCTURE REQUIREMENTS:
- Introduction explaining the FAQ context (100-200 words)
- Q1: [Question] with detailed answer (150-300 words)
- Q2: [Question] with detailed answer (150-300 words)
- Q3: [Question] with detailed answer (150-300 words)
- Q4: [Question] with detailed answer (150-300 words)
- Q5: [Question] with detailed answer (150-300 words)
- Additional resources section (100-200 words)

QUALITY REQUIREMENTS:
- Answer questions thoroughly
- Use clear Q&A format
- Address common concerns
- Include examples where helpful
- Link to related content
- Make answers scannable

Write in a helpful, conversational tone. Focus on clarity and completeness.`
};

// ============================================================================
// TEMPLATE SELECTOR
// ============================================================================

export function selectTemplate(contentType: string): ContentTemplate {
    const templates: Record<string, ContentTemplate> = {
        'comparison': COMPARISON_GUIDE,
        'howto': HOWTO_GUIDE,
        'ultimate': ULTIMATE_GUIDE,
        'listicle': LISTICLE,
        'guide': GUIDE_TEMPLATE,
        'pillar': PILLAR_PAGE,
        'insights': INSIGHTS_TEMPLATE,
        'verses': VERSES_TEMPLATE,
        'newsletter': NEWSLETTER_TEMPLATE,
        'case-study': CASE_STUDY_TEMPLATE,
        'tutorial': TUTORIAL_TEMPLATE,
        'review': REVIEW_TEMPLATE,
        'analysis': ANALYSIS_TEMPLATE,
        'checklist': CHECKLIST_TEMPLATE,
        'faq': FAQ_TEMPLATE
    };
    
    return templates[contentType] || ULTIMATE_GUIDE;
}

export function getAllTemplates(): ContentTemplate[] {
    return [
        COMPARISON_GUIDE,
        HOWTO_GUIDE,
        ULTIMATE_GUIDE,
        LISTICLE,
        GUIDE_TEMPLATE,
        PILLAR_PAGE,
        INSIGHTS_TEMPLATE,
        VERSES_TEMPLATE,
        NEWSLETTER_TEMPLATE,
        CASE_STUDY_TEMPLATE,
        TUTORIAL_TEMPLATE,
        REVIEW_TEMPLATE,
        ANALYSIS_TEMPLATE,
        CHECKLIST_TEMPLATE,
        FAQ_TEMPLATE
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
