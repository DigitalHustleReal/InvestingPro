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
import { generateDailyReport, formatRevenueReportAsMessage } from '@/lib/automation/revenue-reports';
import { sendMessagingNotification } from '@/lib/automation/messaging-notifier';
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

        // Format as message for WhatsApp/Telegram
        const message = formatRevenueReportAsMessage(report);

        // Get recipients from environment variables
        const telegramChatIds = process.env.REVENUE_REPORT_TELEGRAM_CHATS
            ? process.env.REVENUE_REPORT_TELEGRAM_CHATS.split(',').map(id => id.trim()).filter(Boolean)
            : [];

        const whatsappNumbers = process.env.REVENUE_REPORT_WHATSAPP_NUMBERS
            ? process.env.REVENUE_REPORT_WHATSAPP_NUMBERS.split(',').map(num => num.trim()).filter(Boolean)
            : [];

        // Send via WhatsApp and Telegram
        let messagingResult = null;
        if (telegramChatIds.length > 0 || whatsappNumbers.length > 0) {
            try {
                messagingResult = await sendMessagingNotification({
                    message: message,
                    recipients: {
                        telegram: telegramChatIds.length > 0 ? telegramChatIds : undefined,
                        whatsapp: whatsappNumbers.length > 0 ? whatsappNumbers : undefined
                    }
                });

                logger.info('Revenue report sent via messaging', {
                    telegram: messagingResult.telegram,
                    whatsapp: messagingResult.whatsapp
                });
            } catch (messagingError: any) {
                logger.error('Failed to send revenue report via messaging', messagingError);
                messagingResult = {
                    telegram: { sent: false, successCount: 0, failedCount: 0, errors: [messagingError.message] },
                    whatsapp: { sent: false, successCount: 0, failedCount: 0, errors: [messagingError.message] }
                };
            }
        } else {
            logger.warn('No messaging recipients configured (REVENUE_REPORT_TELEGRAM_CHATS or REVENUE_REPORT_WHATSAPP_NUMBERS)');
        }

        logger.info('Daily revenue report generated', {
            period: report.period,
            totalRevenue: report.totalRevenue,
            growth: report.growth,
            conversions: report.conversions,
            alerts: report.alerts.length,
            messagingSent: messagingResult?.telegram.sent || messagingResult?.whatsapp.sent || false
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
            messaging: messagingResult || {
                telegram: { sent: false, successCount: 0, failedCount: 0, errors: ['No recipients configured'] },
                whatsapp: { sent: false, successCount: 0, failedCount: 0, errors: ['No recipients configured'] }
            },
            message: messagingResult?.telegram.sent || messagingResult?.whatsapp.sent
                ? 'Daily revenue report generated and sent via WhatsApp/Telegram successfully.'
                : 'Daily revenue report generated successfully. WhatsApp/Telegram not configured (set REVENUE_REPORT_TELEGRAM_CHATS and/or REVENUE_REPORT_WHATSAPP_NUMBERS).'
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
