/**
 * Auto-Categorization API
 * Analyzes article title and excerpt to suggest the best category
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const CATEGORIES = [
    'investing-basics',
    'stocks',
    'mutual-funds',
    'credit-cards',
    'banking',
    'insurance',
    'loans',
    'tax-planning',
    'retirement',
    'real-estate',
    'cryptocurrency',
    'personal-finance'
];

export async function POST(request: NextRequest) {
    try {
        const { title, excerpt = '', content = '' } = await request.json();

        if (!title) {
            return NextResponse.json({ error: 'Title required' }, { status: 400 });
        }

        console.log('🤖 Auto-categorizing:', title);

        // Use AI to categorize
        const category = await categorizeWithAI(title, excerpt, content);
        
        console.log('✅ Suggested category:', category);

        return NextResponse.json({
            category,
            confidence: 'high',
            alternatives: getAlternativeCategories(title)
        });

    } catch (error: any) {
        console.error('Auto-categorization error:', error);
        
        // Fallback to basic keyword matching
        const fallbackCategory = fallbackCategorization(
            await request.json().then(d => d.title)
        );
        
        return NextResponse.json({
            category: fallbackCategory,
            confidence: 'low',
            error: 'Using fallback categorization'
        });
    }
}

async function categorizeWithAI(title: string, excerpt: string, content: string): Promise<string> {
    try {
        const prompt = `Analyze this article and choose the MOST appropriate category.

Title: ${title}
Excerpt: ${excerpt}
${content ? `Content preview: ${content.substring(0, 500)}` : ''}

Available categories:
${CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Respond with ONLY the category slug (e.g., "credit-cards"), nothing else.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a content categorization expert for a financial website. Choose the most accurate category based on the article\'s main topic.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 50
        });

        const suggested = response.choices[0]?.message?.content?.trim().toLowerCase() || '';
        
        // Validate it's a real category
        if (CATEGORIES.includes(suggested)) {
            return suggested;
        }

        // If AI returns something weird, use fallback
        return fallbackCategorization(title);

    } catch (error) {
        console.error('AI categorization failed:', error);
        return fallbackCategorization(title);
    }
}

function fallbackCategorization(title: string): string {
    const titleLower = title.toLowerCase();

    // Keyword-based matching
    const keywords: { [key: string]: string[] } = {
        'credit-cards': ['credit card', 'rewards', 'cashback', 'apr', 'credit score'],
        'stocks': ['stock', 'share', 'equity', 'dividend', 'market', 'trading'],
        'mutual-funds': ['mutual fund', 'sip', 'nav', 'elss', 'debt fund', 'equity fund'],
        'banking': ['bank', 'account', 'savings', 'checking', 'deposit', 'debit'],
        'insurance': ['insurance', 'policy', 'premium', 'coverage', 'claim', 'health insurance'],
        'loans': ['loan', 'mortgage', 'emi', 'interest rate', 'personal loan', 'home loan'],
        'tax-planning': ['tax', 'deduction', 'exemption', '80c', 'return', 'refund'],
        'retirement': ['retirement', 'pension', 'nps', 'ppf', '401k', 'ira'],
        'cryptocurrency': ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'defi'],
        'real-estate': ['real estate', 'property', 'home', 'rent', 'broker', 'realty']
    };

    // Check keywords
    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => titleLower.includes(word))) {
            return category;
        }
    }

    // Default fallback
    return 'investing-basics';
}

function getAlternativeCategories(title: string): string[] {
    const alternatives: string[] = [];
    const titleLower = title.toLowerCase();

    if (titleLower.includes('invest')) alternatives.push('investing-basics');
    if (titleLower.includes('money') || titleLower.includes('finance')) alternatives.push('personal-finance');
    if (titleLower.includes('save') || titleLower.includes('budget')) alternatives.push('personal-finance');

    return alternatives.slice(0, 2);
}
