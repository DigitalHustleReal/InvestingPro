import { NextRequest, NextResponse } from 'next/server';

/**
 * Enhanced Analytics API
 * 
 * GET /api/analytics/enhanced?range=30d
 */

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const range = searchParams.get('range') || '30d';

        // Mock data (replace with real database queries)
        const data = {
            overview: {
                totalArticles: 156,
                totalViews: 45230,
                totalUsers: 12450,
                totalClicks: 3420,
                totalRevenue: 125000
            },
            timeSeries: generateTimeSeries(range),
            topContent: [
                {
                    id: '1',
                    title: 'Best Credit Cards in India 2026',
                    slug: 'best-credit-cards-india-2026',
                    views: 5420,
                    category: 'credit-cards'
                },
                {
                    id: '2',
                    title: 'How to Choose the Right Home Loan',
                    slug: 'how-to-choose-home-loan',
                    views: 4230,
                    category: 'home-loans'
                },
                {
                    id: '3',
                    title: 'Top 10 Mutual Funds for 2026',
                    slug: 'top-mutual-funds-2026',
                    views: 3890,
                    category: 'mutual-funds'
                },
                {
                    id: '4',
                    title: 'Personal Loan vs Credit Card',
                    slug: 'personal-loan-vs-credit-card',
                    views: 3120,
                    category: 'personal-loans'
                },
                {
                    id: '5',
                    title: 'SIP Calculator Guide',
                    slug: 'sip-calculator-guide',
                    views: 2890,
                    category: 'calculators'
                }
            ],
            categoryBreakdown: [
                { category: 'credit-cards', articleCount: 45, totalViews: 15420 },
                { category: 'home-loans', articleCount: 32, totalViews: 12230 },
                { category: 'mutual-funds', articleCount: 28, totalViews: 9890 },
                { category: 'personal-loans', articleCount: 25, totalViews: 7120 },
                { category: 'calculators', articleCount: 26, totalViews: 5890 }
            ],
            conversionFunnel: [
                { stage: 'Page View', users: 12450, conversionRate: 100 },
                { stage: 'Article Read', users: 8920, conversionRate: 71.6 },
                { stage: 'Product View', users: 4230, conversionRate: 47.4 },
                { stage: 'Affiliate Click', users: 1560, conversionRate: 36.9 },
                { stage: 'Conversion', users: 234, conversionRate: 15.0 }
            ]
        };

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}

function generateTimeSeries(range: string) {
    const days = range === 'today' ? 1 : 
                 range === '7d' ? 7 :
                 range === '30d' ? 30 :
                 range === '90d' ? 90 : 365;

    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        data.push({
            date: date.toISOString().split('T')[0],
            views: Math.floor(Math.random() * 2000) + 1000,
            users: Math.floor(Math.random() * 500) + 300,
            clicks: Math.floor(Math.random() * 150) + 50
        });
    }

    return data;
}
