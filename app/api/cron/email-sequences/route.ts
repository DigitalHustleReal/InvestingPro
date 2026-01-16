/**
 * Email Sequences Cron Job
 * Processes scheduled email sequences
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/email-sequences",
 *     "schedule": "0 */6 * * *" // Every 6 hours
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { Resend } from 'resend';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify cron secret
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

        logger.info('Email sequences cron started');

        // Get scheduled emails that are due
        const now = new Date().toISOString();
        const { data: scheduledEmails, error } = await supabase
            .from('email_sequences')
            .select('*')
            .eq('status', 'scheduled')
            .lte('scheduled_at', now)
            .limit(100); // Process 100 at a time

        if (error) {
            throw error;
        }

        if (!scheduledEmails || scheduledEmails.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No scheduled emails to process',
                processed: 0
            });
        }

        // Check if Resend is configured
        if (!process.env.RESEND_API_KEY) {
            logger.warn('Resend API key not configured, skipping email sequences');
            return NextResponse.json({
                success: false,
                message: 'Resend API key not configured',
                processed: 0
            });
        }

        // Process each scheduled email
        let sentCount = 0;
        let failedCount = 0;
        const errors: string[] = [];

        for (const emailData of scheduledEmails) {
            try {
                // Check if subscriber is still active
                const { data: subscriber } = await supabase
                    .from('newsletter_subscribers')
                    .select('status')
                    .eq('email', emailData.subscriber_email)
                    .single();

                if (!subscriber || subscriber.status !== 'active') {
                    // Mark as skipped
                    await supabase
                        .from('email_sequences')
                        .update({ status: 'skipped', skipped_reason: 'Subscriber inactive' })
                        .eq('id', emailData.id);
                    continue;
                }

                // Send email
                const result = await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'InvestingPro <onboarding@resend.dev>',
                    to: emailData.subscriber_email,
                    subject: emailData.subject,
                    html: emailData.content
                });

                // Update status
                await supabase
                    .from('email_sequences')
                    .update({
                        status: 'sent',
                        sent_at: new Date().toISOString(),
                        resend_id: result.data?.id
                    })
                    .eq('id', emailData.id);

                sentCount++;
                logger.info('Sequence email sent', {
                    email: emailData.subscriber_email,
                    sequenceType: emailData.sequence_type,
                    emailId: emailData.email_id
                });

            } catch (emailError: any) {
                failedCount++;
                errors.push(`${emailData.subscriber_email}: ${emailError.message}`);

                // Update status
                await supabase
                    .from('email_sequences')
                    .update({
                        status: 'failed',
                        error: emailError.message
                    })
                    .eq('id', emailData.id);

                logger.error('Error sending sequence email', emailError, {
                    email: emailData.subscriber_email,
                    emailId: emailData.id
                });
            }
        }

        logger.info('Email sequences cron complete', {
            total: scheduledEmails.length,
            sent: sentCount,
            failed: failedCount
        });

        return NextResponse.json({
            success: true,
            message: `Processed ${sentCount} emails`,
            processed: sentCount,
            failed: failedCount,
            errors: errors.length > 0 ? errors.slice(0, 5) : undefined, // Return first 5 errors
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        logger.error('Error in email sequences cron', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process email sequences',
                message: error.message
            },
            { status: 500 }
        );
    }
}
