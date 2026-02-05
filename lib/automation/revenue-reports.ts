/**
 * Automated Revenue Reports
 * Generates daily/weekly/monthly revenue reports and sends alerts
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { getRevenueMetrics } from '@/lib/analytics/revenue-tracker';
import { logger } from '@/lib/logger';
import { Resend } from 'resend';

// Lazy-initialize clients
let resendClient: Resend | null = null;
let supabaseClient: SupabaseClient | null = null;

function getResendClient(): Resend | null {
    if (!process.env.RESEND_API_KEY) return null;
    if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
    return resendClient;
}

function getSupabaseClient(): SupabaseClient {
    if (!supabaseClient) {
        if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Supabase environment variables not configured');
        }
        supabaseClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    }
    return supabaseClient;
}

export interface RevenueReport {
    period: 'daily' | 'weekly' | 'monthly';
    startDate: string;
    endDate: string;
    totalRevenue: number;
    previousRevenue: number;
    growth: number;
    conversions: number;
    conversionRate: number;
    topArticles: Array<{
        articleId: string;
        articleTitle: string;
        revenue: number;
    }>;
    alerts: string[];
}

/**
 * Generate daily revenue report
 */
export async function generateDailyReport(date?: string): Promise<RevenueReport> {
    const reportDate = date ? new Date(date) : new Date();
    reportDate.setHours(0, 0, 0, 0);
    
    const startDate = reportDate.toISOString();
    const endDate = new Date(reportDate);
    endDate.setHours(23, 59, 59, 999);
    endDate.setMilliseconds(999);

    // Previous day
    const previousDate = new Date(reportDate);
    previousDate.setDate(previousDate.getDate() - 1);
    const previousStartDate = previousDate.toISOString();
    const previousEndDate = new Date(previousDate);
    previousEndDate.setHours(23, 59, 59, 999);
    previousEndDate.setMilliseconds(999);

    // Get current day metrics
    const currentMetrics = await getRevenueMetrics(startDate, endDate.toISOString());

    // Get previous day metrics
    const previousMetrics = await getRevenueMetrics(previousStartDate, previousEndDate.toISOString());

    const growth = previousMetrics.totalRevenue > 0
        ? ((currentMetrics.totalRevenue - previousMetrics.totalRevenue) / previousMetrics.totalRevenue) * 100
        : 0;

    // Get conversions count
    const { data: conversions } = await supabase
        .from('affiliate_clicks')
        .select('id')
        .eq('converted', true)
        .gte('conversion_date', startDate)
        .lte('conversion_date', endDate.toISOString());

    const conversionsCount = conversions?.length || 0;

    // Get clicks count for conversion rate
    const { data: clicks } = await supabase
        .from('affiliate_clicks')
        .select('id')
        .gte('created_at', startDate)
        .lte('created_at', endDate.toISOString());

    const clicksCount = clicks?.length || 0;
    const conversionRate = clicksCount > 0 ? (conversionsCount / clicksCount) * 100 : 0;

    // Generate alerts
    const alerts: string[] = [];
    if (growth < -20) {
        alerts.push(`⚠️ Revenue dropped ${Math.abs(growth).toFixed(1)}% from previous day`);
    }
    if (currentMetrics.totalRevenue === 0) {
        alerts.push('🚨 No revenue generated today');
    }
    if (conversionRate < 1) {
        alerts.push(`⚠️ Low conversion rate: ${conversionRate.toFixed(2)}% (target: >1%)`);
    }

    return {
        period: 'daily',
        startDate,
        endDate: endDate.toISOString(),
        totalRevenue: currentMetrics.totalRevenue,
        previousRevenue: previousMetrics.totalRevenue,
        growth: Number(growth.toFixed(2)),
        conversions: conversionsCount,
        conversionRate: Number(conversionRate.toFixed(2)),
        topArticles: currentMetrics.revenueByArticle.slice(0, 5),
        alerts
    };
}

/**
 * Generate weekly revenue report
 */
export async function generateWeeklyReport(weekStartDate?: string): Promise<RevenueReport> {
    const weekStart = weekStartDate ? new Date(weekStartDate) : getStartOfWeek(new Date());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Previous week
    const previousWeekStart = new Date(weekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const previousWeekEnd = new Date(previousWeekStart);
    previousWeekEnd.setDate(previousWeekEnd.getDate() + 6);
    previousWeekEnd.setHours(23, 59, 59, 999);

    const currentMetrics = await getRevenueMetrics(weekStart.toISOString(), weekEnd.toISOString());
    const previousMetrics = await getRevenueMetrics(previousWeekStart.toISOString(), previousWeekEnd.toISOString());

    const growth = previousMetrics.totalRevenue > 0
        ? ((currentMetrics.totalRevenue - previousMetrics.totalRevenue) / previousMetrics.totalRevenue) * 100
        : 0;

    const { data: conversions } = await supabase
        .from('affiliate_clicks')
        .select('id')
        .eq('converted', true)
        .gte('conversion_date', weekStart.toISOString())
        .lte('conversion_date', weekEnd.toISOString());

    const conversionsCount = conversions?.length || 0;

    const { data: clicks } = await supabase
        .from('affiliate_clicks')
        .select('id')
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

    const clicksCount = clicks?.length || 0;
    const conversionRate = clicksCount > 0 ? (conversionsCount / clicksCount) * 100 : 0;

    const alerts: string[] = [];
    if (growth < -15) {
        alerts.push(`⚠️ Revenue dropped ${Math.abs(growth).toFixed(1)}% from previous week`);
    }

    return {
        period: 'weekly',
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString(),
        totalRevenue: currentMetrics.totalRevenue,
        previousRevenue: previousMetrics.totalRevenue,
        growth: Number(growth.toFixed(2)),
        conversions: conversionsCount,
        conversionRate: Number(conversionRate.toFixed(2)),
        topArticles: currentMetrics.revenueByArticle.slice(0, 10),
        alerts
    };
}

/**
 * Generate monthly revenue report
 */
export async function generateMonthlyReport(month?: string, year?: number): Promise<RevenueReport> {
    const now = new Date();
    const reportMonth = month ? parseInt(month) : now.getMonth() + 1;
    const reportYear = year || now.getFullYear();

    const monthStart = new Date(reportYear, reportMonth - 1, 1);
    monthStart.setHours(0, 0, 0, 0);

    const monthEnd = new Date(reportYear, reportMonth, 0);
    monthEnd.setHours(23, 59, 59, 999);

    // Previous month
    const previousMonthStart = new Date(reportYear, reportMonth - 2, 1);
    const previousMonthEnd = new Date(reportYear, reportMonth - 1, 0);
    previousMonthEnd.setHours(23, 59, 59, 999);

    const currentMetrics = await getRevenueMetrics(monthStart.toISOString(), monthEnd.toISOString());
    const previousMetrics = await getRevenueMetrics(previousMonthStart.toISOString(), previousMonthEnd.toISOString());

    const growth = previousMetrics.totalRevenue > 0
        ? ((currentMetrics.totalRevenue - previousMetrics.totalRevenue) / previousMetrics.totalRevenue) * 100
        : 0;

    const { data: conversions } = await supabase
        .from('affiliate_clicks')
        .select('id')
        .eq('converted', true)
        .gte('conversion_date', monthStart.toISOString())
        .lte('conversion_date', monthEnd.toISOString());

    const conversionsCount = conversions?.length || 0;

    const { data: clicks } = await supabase
        .from('affiliate_clicks')
        .select('id')
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

    const clicksCount = clicks?.length || 0;
    const conversionRate = clicksCount > 0 ? (conversionsCount / clicksCount) * 100 : 0;

    const alerts: string[] = [];
    if (growth < -10) {
        alerts.push(`⚠️ Revenue dropped ${Math.abs(growth).toFixed(1)}% from previous month`);
    }

    return {
        period: 'monthly',
        startDate: monthStart.toISOString(),
        endDate: monthEnd.toISOString(),
        totalRevenue: currentMetrics.totalRevenue,
        previousRevenue: previousMetrics.totalRevenue,
        growth: Number(growth.toFixed(2)),
        conversions: conversionsCount,
        conversionRate: Number(conversionRate.toFixed(2)),
        topArticles: currentMetrics.revenueByArticle.slice(0, 20),
        alerts
    };
}

/**
 * Format revenue report as text message for WhatsApp/Telegram
 */
export function formatRevenueReportAsMessage(report: RevenueReport): string {
    const periodLabel = report.period === 'daily' ? 'Daily' : report.period === 'weekly' ? 'Weekly' : 'Monthly';
    const growthEmoji = report.growth >= 0 ? '📈' : '📉';
    const dateStr = new Date(report.startDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    let message = `*${periodLabel} Revenue Report*\n`;
    message += `📅 ${dateStr}\n\n`;
    message += `💰 *Total Revenue:* ₹${report.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    message += `📊 *Previous:* ₹${report.previousRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    message += `${growthEmoji} *Growth:* ${report.growth >= 0 ? '+' : ''}${report.growth.toFixed(2)}%\n\n`;
    message += `✅ *Conversions:* ${report.conversions}\n`;
    message += `📈 *Conversion Rate:* ${report.conversionRate.toFixed(2)}%\n\n`;

    if (report.alerts.length > 0) {
        message += `⚠️ *Alerts:*\n`;
        report.alerts.forEach(alert => {
            message += `• ${alert}\n`;
        });
        message += '\n';
    }

    if (report.topArticles.length > 0) {
        message += `🏆 *Top Articles:*\n`;
        report.topArticles.slice(0, 5).forEach((article, idx) => {
            message += `${idx + 1}. ${article.articleTitle.substring(0, 40)}${article.articleTitle.length > 40 ? '...' : ''}\n`;
            message += `   ₹${article.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
        });
        message += '\n';
    }

    message += `_Automated report from InvestingPro.in_`;

    return message;
}

/**
 * Format revenue report as email HTML
 */
export function formatRevenueReportAsEmail(report: RevenueReport): string {
    const periodLabel = report.period === 'daily' ? 'Daily' : report.period === 'weekly' ? 'Weekly' : 'Monthly';
    const growthEmoji = report.growth >= 0 ? '📈' : '📉';
    const growthColor = report.growth >= 0 ? '#10b981' : '#ef4444';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${periodLabel} Revenue Report</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0d9488;">${periodLabel} Revenue Report</h1>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Summary</h2>
            <p><strong>Period:</strong> ${new Date(report.startDate).toLocaleDateString()} - ${new Date(report.endDate).toLocaleDateString()}</p>
            <p><strong>Total Revenue:</strong> ₹${report.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p><strong>Previous Period:</strong> ₹${report.previousRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p style="color: ${growthColor};"><strong>${growthEmoji} Growth:</strong> ${report.growth >= 0 ? '+' : ''}${report.growth.toFixed(2)}%</p>
            <p><strong>Conversions:</strong> ${report.conversions}</p>
            <p><strong>Conversion Rate:</strong> ${report.conversionRate.toFixed(2)}%</p>
        </div>

        ${report.alerts.length > 0 ? `
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">Alerts</h3>
            <ul style="margin: 0; padding-left: 20px;">
                ${report.alerts.map(alert => `<li>${alert}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        ${report.topArticles.length > 0 ? `
        <div style="margin: 20px 0;">
            <h2>Top Converting Articles</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #e2e8f0;">
                        <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Article</th>
                        <th style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.topArticles.map((article, idx) => `
                    <tr>
                        <td style="padding: 10px; border: 1px solid #cbd5e1;">${idx + 1}. ${article.articleTitle}</td>
                        <td style="padding: 10px; text-align: right; border: 1px solid #cbd5e1;">₹${article.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}

        <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
            This is an automated revenue report from InvestingPro.in
        </p>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Get start of week (Monday)
 */
function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
}

