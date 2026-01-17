import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { requireAdmin } from '@/lib/auth/admin-auth';

// Use service role for admin access
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * GET /api/v1/admin/revenue/dashboard
 * Returns overall revenue metrics, revenue by category, conversion rates, and trends
 * 
 * Query Parameters:
 * - startDate (optional): ISO date string, defaults to 30 days ago
 * - endDate (optional): ISO date string, defaults to now
 */
export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        const adminCheck = await requireAdmin(request);
        if (adminCheck.error) {
            return adminCheck.response;
        }

        // Validate and parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        // Validate date format if provided
        if (startDateParam && isNaN(Date.parse(startDateParam))) {
            return NextResponse.json(
                { error: 'Invalid startDate format. Use ISO 8601 format.' },
                { status: 400 }
            );
        }

        if (endDateParam && isNaN(Date.parse(endDateParam))) {
            return NextResponse.json(
                { error: 'Invalid endDate format. Use ISO 8601 format.' },
                { status: 400 }
            );
        }

        const startDate = startDateParam || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = endDateParam || new Date().toISOString();

        // Ensure startDate is before endDate
        if (new Date(startDate) > new Date(endDate)) {
            return NextResponse.json(
                { error: 'startDate must be before endDate' },
                { status: 400 }
            );
        }

        // Get current month revenue
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const currentMonthEnd = new Date().toISOString();
        
        // Get previous month revenue
        const previousMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString();
        const previousMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString();

        // Total revenue - current month
        const { data: currentRevenueData } = await supabase
            .from('affiliate_clicks')
            .select('commission_earned')
            .eq('converted', true)
            .gte('conversion_date', currentMonthStart)
            .lte('conversion_date', currentMonthEnd);

        const currentRevenue = currentRevenueData?.reduce((sum, row) => sum + (Number(row.commission_earned) || 0), 0) || 0;

        // Total revenue - previous month
        const { data: previousRevenueData } = await supabase
            .from('affiliate_clicks')
            .select('commission_earned')
            .eq('converted', true)
            .gte('conversion_date', previousMonthStart)
            .lte('conversion_date', previousMonthEnd);

        const previousRevenue = previousRevenueData?.reduce((sum, row) => sum + (Number(row.commission_earned) || 0), 0) || 0;

        // Calculate growth percentage
        const growth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

        // Revenue by category
        const { data: categoryData } = await supabase
            .from('affiliate_clicks')
            .select('product_type, commission_earned')
            .eq('converted', true)
            .gte('conversion_date', currentMonthStart)
            .lte('conversion_date', currentMonthEnd);

        const revenueByCategory = {
            creditCards: 0,
            mutualFunds: 0,
            insurance: 0,
            others: 0
        };

        categoryData?.forEach(row => {
            const revenue = Number(row.commission_earned) || 0;
            const productType = row.product_type?.toLowerCase() || '';
            
            if (productType.includes('credit_card') || productType.includes('creditcard')) {
                revenueByCategory.creditCards += revenue;
            } else if (productType.includes('mutual_fund') || productType.includes('mutualfund') || productType.includes('stock_broker')) {
                revenueByCategory.mutualFunds += revenue;
            } else if (productType.includes('insurance')) {
                revenueByCategory.insurance += revenue;
            } else {
                revenueByCategory.others += revenue;
            }
        });

        // Conversion rates
        const { data: allClicks } = await supabase
            .from('affiliate_clicks')
            .select('product_type, converted')
            .gte('created_at', currentMonthStart)
            .lte('created_at', currentMonthEnd);

        const totalClicks = allClicks?.length || 0;
        const totalConversions = allClicks?.filter(c => c.converted).length || 0;
        const overallConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

        // Credit Cards conversion rate
        const creditCardClicks = allClicks?.filter(c => 
            c.product_type?.toLowerCase().includes('credit_card') || 
            c.product_type?.toLowerCase().includes('creditcard')
        ) || [];
        const creditCardConversions = creditCardClicks.filter(c => c.converted).length;
        const creditCardConversionRate = creditCardClicks.length > 0 ? (creditCardConversions / creditCardClicks.length) * 100 : 0;

        // Mutual Funds conversion rate
        const mutualFundClicks = allClicks?.filter(c => 
            c.product_type?.toLowerCase().includes('mutual_fund') || 
            c.product_type?.toLowerCase().includes('mutualfund') ||
            c.product_type?.toLowerCase().includes('stock_broker')
        ) || [];
        const mutualFundConversions = mutualFundClicks.filter(c => c.converted).length;
        const mutualFundConversionRate = mutualFundClicks.length > 0 ? (mutualFundConversions / mutualFundClicks.length) * 100 : 0;

        // Daily trends (last 30 days)
        const dailyTrends = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStart = new Date(date.setHours(0, 0, 0, 0)).toISOString();
            const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toISOString();

            const { data: dayRevenue } = await supabase
                .from('affiliate_clicks')
                .select('commission_earned')
                .eq('converted', true)
                .gte('conversion_date', dayStart)
                .lte('conversion_date', dayEnd);

            const dayRevenueTotal = dayRevenue?.reduce((sum, row) => sum + (Number(row.commission_earned) || 0), 0) || 0;
            
            dailyTrends.push({
                date: date.toISOString().split('T')[0],
                revenue: dayRevenueTotal
            });
        }

        // Weekly trends (last 12 weeks)
        const weeklyTrends = [];
        for (let i = 11; i >= 0; i--) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
            weekStart.setHours(0, 0, 0, 0);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);

            const { data: weekRevenue } = await supabase
                .from('affiliate_clicks')
                .select('commission_earned')
                .eq('converted', true)
                .gte('conversion_date', weekStart.toISOString())
                .lte('conversion_date', weekEnd.toISOString());

            const weekRevenueTotal = weekRevenue?.reduce((sum, row) => sum + (Number(row.commission_earned) || 0), 0) || 0;
            
            weeklyTrends.push({
                week: `Week ${12 - i}`,
                revenue: weekRevenueTotal
            });
        }

        // Monthly trends (last 12 months)
        const monthlyTrends = [];
        for (let i = 11; i >= 0; i--) {
            const monthStart = new Date();
            monthStart.setMonth(monthStart.getMonth() - i);
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0);
            monthEnd.setHours(23, 59, 59, 999);

            const { data: monthRevenue } = await supabase
                .from('affiliate_clicks')
                .select('commission_earned')
                .eq('converted', true)
                .gte('conversion_date', monthStart.toISOString())
                .lte('conversion_date', monthEnd.toISOString());

            const monthRevenueTotal = monthRevenue?.reduce((sum, row) => sum + (Number(row.commission_earned) || 0), 0) || 0;
            
            monthlyTrends.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                revenue: monthRevenueTotal
            });
        }

        return NextResponse.json({
            totalRevenue: {
                current: currentRevenue,
                previous: previousRevenue,
                growth: Number(growth.toFixed(2))
            },
            revenueByCategory,
            conversionRates: {
                overall: Number(overallConversionRate.toFixed(2)),
                creditCards: Number(creditCardConversionRate.toFixed(2)),
                mutualFunds: Number(mutualFundConversionRate.toFixed(2))
            },
            trends: {
                daily: dailyTrends,
                weekly: weeklyTrends,
                monthly: monthlyTrends
            }
        });

    } catch (error: any) {
        console.error('Revenue dashboard error:', error);
        
        // Return more specific error messages
        if (error.message?.includes('permission denied') || error.message?.includes('RLS')) {
            return NextResponse.json(
                { 
                    error: 'Database permission error',
                    code: 'DB_PERMISSION_ERROR',
                    message: 'Unable to access revenue data. Please check database permissions.'
                },
                { status: 403 }
            );
        }

        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
            return NextResponse.json(
                { 
                    error: 'Database schema error',
                    code: 'DB_SCHEMA_ERROR',
                    message: 'Required database tables are missing. Please run migrations.'
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch revenue data. Please try again later.'
            },
            { status: 500 }
        );
    }
}
