/**
 * Daily Revenue Report Cron Job
 * Runs daily at 9 AM IST to generate and send revenue reports
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/daily-revenue-report",
 *     "schedule": "0 9 * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateDailyReport } from '@/lib/automation/revenue-reports';
import { formatRevenueReportAsEmail } from '@/lib/automation/revenue-reports';
import { logger } from '@/lib/logger';

// Verify cron secret (for Vercel Cron Jobs)
function verifyCronSecret(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret) {
        return true; // Allow if no secret configured (for local development)
    }

    return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        if (!verifyCronSecret(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Generate daily report
        const report = await generateDailyReport();

        // Format as email
        const emailHtml = formatRevenueReportAsEmail(report);

        // TODO: Send email via Resend
        // For now, log the report
        logger.info('Daily revenue report generated', {
            period: report.period,
            totalRevenue: report.totalRevenue,
            growth: report.growth,
            conversions: report.conversions,
            alerts: report.alerts.length
        });

        // Return report data
        return NextResponse.json({
            success: true,
            report: {
                period: report.period,
                startDate: report.startDate,
                endDate: report.endDate,
                totalRevenue: report.totalRevenue,
                previousRevenue: report.previousRevenue,
                growth: report.growth,
                conversions: report.conversions,
                conversionRate: report.conversionRate,
                topArticlesCount: report.topArticles.length,
                alertsCount: report.alerts.length
            },
            emailHtml: emailHtml, // For now, return HTML. Later, send via Resend
            message: 'Daily revenue report generated successfully. Email sending not yet implemented.'
        });

    } catch (error: any) {
        logger.error('Error generating daily revenue report', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate daily revenue report',
                message: error.message
            },
            { status: 500 }
        );
    }
}
