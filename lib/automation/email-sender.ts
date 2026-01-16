/**
 * Email Automation
 * Sends newsletter emails, welcome sequences, etc.
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
// import { Resend } from 'resend'; // TODO: Uncomment when Resend is configured

// const resend = new Resend(process.env.RESEND_API_KEY);

export interface NewArticleEmailParams {
    articleId: string;
    title: string;
    excerpt: string;
    url: string;
    category: string;
}

export interface EmailSendResult {
    sent: boolean;
    subscribers: number;
    error?: string;
}

/**
 * Send new article email to newsletter subscribers
 */
export async function sendNewArticleEmail(params: NewArticleEmailParams): Promise<EmailSendResult> {
    try {
        const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // Get active newsletter subscribers
        const { data: subscribers, error: subscribersError } = await supabase
            .from('newsletter_subscribers')
            .select('id, email, status')
            .eq('status', 'active')
            .limit(1000); // Batch limit

        if (subscribersError) {
            throw subscribersError;
        }

        if (!subscribers || subscribers.length === 0) {
            return {
                sent: false,
                subscribers: 0,
                error: 'No active subscribers'
            };
        }

        // TODO: Send email via Resend
        // For now, log the email and return success
        logger.info('Newsletter email prepared', {
            articleId: params.articleId,
            subscribers: subscribers.length,
            title: params.title
        });

        // Generate email HTML
        const emailHtml = generateArticleEmailHtml(params);

        // TODO: Implement Resend email sending
        // await resend.emails.send({
        //     from: 'InvestingPro <newsletter@investingpro.in>',
        //     to: subscribers.map(s => s.email),
        //     subject: `📈 ${params.title}`,
        //     html: emailHtml
        // });

        return {
            sent: false, // Set to true when Resend is configured
            subscribers: subscribers.length,
            error: 'Resend API not yet configured. Email prepared but not sent.'
        };

    } catch (error: any) {
        logger.error('Error sending newsletter email', error, { articleId: params.articleId });
        return {
            sent: false,
            subscribers: 0,
            error: error.message
        };
    }
}

/**
 * Generate HTML email for new article
 */
function generateArticleEmailHtml(params: NewArticleEmailParams): string {
    const { title, excerpt, url, category } = params;

    const categoryLabels: Record<string, string> = {
        'credit-cards': 'Credit Cards',
        'mutual-funds': 'Mutual Funds',
        'insurance': 'Insurance',
        'loans': 'Loans'
    };

    const categoryLabel = categoryLabels[category] || 'Finance';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">InvestingPro.in</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Latest from ${categoryLabel}</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0f172a; margin-top: 0;">${title}</h2>
        
        ${excerpt ? `<p style="color: #64748b; font-size: 16px;">${excerpt}</p>` : ''}
        
        <div style="margin: 30px 0;">
            <a href="${url}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Read Full Article →
            </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            You're receiving this because you subscribed to InvestingPro newsletter.<br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/unsubscribe" style="color: #0d9488;">Unsubscribe</a>
        </p>
    </div>
</body>
</html>
    `.trim();
}
