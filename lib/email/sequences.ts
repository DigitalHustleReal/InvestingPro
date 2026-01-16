/**
 * Email Sequences
 * Automated email sequences for welcome, nurture, re-engagement
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface EmailSequence {
    id: string;
    name: string;
    type: 'welcome' | 'nurture' | 're-engagement' | 'conversion';
    emails: SequenceEmail[];
    status: 'active' | 'paused' | 'draft';
}

export interface SequenceEmail {
    id: string;
    subject: string;
    delay: number; // Days after previous email or signup
    template: string;
    content: string;
}

/**
 * Send welcome email sequence
 * Triggered when user subscribes to newsletter
 */
export async function sendWelcomeSequence(email: string, subscriberId?: string): Promise<void> {
    try {
        const welcomeEmails: SequenceEmail[] = [
            {
                id: 'welcome-1',
                subject: 'Welcome to InvestingPro! 🎉',
                delay: 0, // Immediate
                template: 'welcome-1',
                content: generateWelcomeEmail1()
            },
            {
                id: 'welcome-2',
                subject: 'Start Your Investment Journey',
                delay: 3, // 3 days later
                template: 'welcome-2',
                content: generateWelcomeEmail2()
            },
            {
                id: 'welcome-3',
                subject: 'Top 5 Credit Cards for 2026',
                delay: 7, // 7 days later
                template: 'welcome-3',
                content: generateWelcomeEmail3()
            },
            {
                id: 'welcome-4',
                subject: 'Best SIP Plans for Beginners',
                delay: 14, // 14 days later
                template: 'welcome-4',
                content: generateWelcomeEmail4()
            }
        ];

        // Send first email immediately
        await sendSequenceEmail(email, welcomeEmails[0], subscriberId);

        // Schedule remaining emails
        for (let i = 1; i < welcomeEmails.length; i++) {
            const emailData = welcomeEmails[i];
            const sendDate = new Date();
            sendDate.setDate(sendDate.getDate() + emailData.delay);

            // Store in database for cron job to process
            await supabase.from('email_sequences').insert({
                subscriber_email: email,
                subscriber_id: subscriberId,
                sequence_type: 'welcome',
                email_id: emailData.id,
                subject: emailData.subject,
                content: emailData.content,
                scheduled_at: sendDate.toISOString(),
                status: 'scheduled'
            });
        }

        logger.info('Welcome sequence initiated', { email, subscriberId });

    } catch (error) {
        logger.error('Error sending welcome sequence', error, { email });
        throw error;
    }
}

/**
 * Send nurture sequence
 * Educational content and product recommendations
 */
export async function sendNurtureSequence(email: string, interests?: string[]): Promise<void> {
    try {
        // Determine content based on interests
        const category = interests?.includes('credit-cards') ? 'credit-cards' :
                        interests?.includes('mutual-funds') ? 'mutual-funds' :
                        'general';

        const nurtureEmails: SequenceEmail[] = [
            {
                id: 'nurture-1',
                subject: 'How to Choose the Right Credit Card',
                delay: 0,
                template: 'nurture-1',
                content: generateNurtureEmail1(category)
            },
            {
                id: 'nurture-2',
                subject: 'SIP vs Lump Sum: Which is Better?',
                delay: 5,
                template: 'nurture-2',
                content: generateNurtureEmail2(category)
            },
            {
                id: 'nurture-3',
                subject: 'Tax Saving Strategies for 2026',
                delay: 10,
                template: 'nurture-3',
                content: generateNurtureEmail3(category)
            }
        ];

        // Schedule nurture emails
        for (const emailData of nurtureEmails) {
            const sendDate = new Date();
            sendDate.setDate(sendDate.getDate() + emailData.delay);

            await supabase.from('email_sequences').insert({
                subscriber_email: email,
                sequence_type: 'nurture',
                email_id: emailData.id,
                subject: emailData.subject,
                content: emailData.content,
                scheduled_at: sendDate.toISOString(),
                status: 'scheduled'
            });
        }

        logger.info('Nurture sequence initiated', { email, category });

    } catch (error) {
        logger.error('Error sending nurture sequence', error, { email });
        throw error;
    }
}

/**
 * Send re-engagement sequence
 * For inactive subscribers (no opens/clicks in 90 days)
 */
export async function sendReEngagementSequence(email: string): Promise<void> {
    try {
        const reEngagementEmails: SequenceEmail[] = [
            {
                id: 're-engagement-1',
                subject: 'We Miss You! Here\'s What You\'ve Been Missing',
                delay: 0,
                template: 're-engagement-1',
                content: generateReEngagementEmail1()
            },
            {
                id: 're-engagement-2',
                subject: 'Last Chance: Special Offer Inside',
                delay: 7,
                template: 're-engagement-2',
                content: generateReEngagementEmail2()
            }
        ];

        // Schedule re-engagement emails
        for (const emailData of reEngagementEmails) {
            const sendDate = new Date();
            sendDate.setDate(sendDate.getDate() + emailData.delay);

            await supabase.from('email_sequences').insert({
                subscriber_email: email,
                sequence_type: 're-engagement',
                email_id: emailData.id,
                subject: emailData.subject,
                content: emailData.content,
                scheduled_at: sendDate.toISOString(),
                status: 'scheduled'
            });
        }

        logger.info('Re-engagement sequence initiated', { email });

    } catch (error) {
        logger.error('Error sending re-engagement sequence', error, { email });
        throw error;
    }
}

/**
 * Send a single sequence email
 */
async function sendSequenceEmail(
    email: string,
    emailData: SequenceEmail,
    subscriberId?: string
): Promise<void> {
    try {
        if (!process.env.RESEND_API_KEY) {
            logger.warn('Resend API key not configured, skipping email', { email, emailId: emailData.id });
            return;
        }

        const result = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'InvestingPro <onboarding@resend.dev>',
            to: email,
            subject: emailData.subject,
            html: emailData.content
        });

        // Track email sent
        await supabase.from('email_sequences').insert({
            subscriber_email: email,
            subscriber_id: subscriberId,
            sequence_type: 'welcome',
            email_id: emailData.id,
            subject: emailData.subject,
            content: emailData.content,
            sent_at: new Date().toISOString(),
            status: 'sent',
            resend_id: result.data?.id
        });

        logger.info('Sequence email sent', { email, emailId: emailData.id, resendId: result.data?.id });

    } catch (error) {
        logger.error('Error sending sequence email', error, { email, emailId: emailData.id });
        throw error;
    }
}

/**
 * Generate welcome email templates
 */
function generateWelcomeEmail1(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome to InvestingPro! 🎉</h1>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <p>Hi there!</p>
        <p>Thank you for subscribing to InvestingPro. We're excited to help you make smarter financial decisions.</p>
        
        <h3>What You'll Get:</h3>
        <ul>
            <li>📊 Expert comparisons of credit cards, mutual funds, and more</li>
            <li>📈 Weekly investment insights and market updates</li>
            <li>💰 Exclusive deals and offers</li>
            <li>🎓 Educational content to grow your wealth</li>
        </ul>
        
        <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Explore InvestingPro →
            </a>
        </div>
        
        <p>Happy investing!<br>The InvestingPro Team</p>
    </div>
</body>
</html>
    `.trim();
}

function generateWelcomeEmail2(): string {
    return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2>Start Your Investment Journey</h2>
        <p>Ready to start investing? Here are some resources to get you started:</p>
        
        <h3>📚 Beginner's Guide</h3>
        <p>Learn the basics of investing in India with our comprehensive guides.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/investing-basics" style="color: #0d9488;">Read Guide →</a>
        
        <h3>💳 Compare Credit Cards</h3>
        <p>Find the best credit card for your spending habits.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/credit-cards" style="color: #0d9488;">Compare Cards →</a>
        
        <h3>📈 Start a SIP</h3>
        <p>Begin your mutual fund journey with as little as ₹500/month.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/mutual-funds" style="color: #0d9488;">Explore SIPs →</a>
    </div>
</body>
</html>
    `.trim();
}

function generateWelcomeEmail3(): string {
    return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2>Top 5 Credit Cards for 2026</h2>
        <p>We've curated the best credit cards based on rewards, benefits, and value.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/credit-cards" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
            View Top Cards →
        </a>
    </div>
</body>
</html>
    `.trim();
}

function generateWelcomeEmail4(): string {
    return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2>Best SIP Plans for Beginners</h2>
        <p>Start investing with Systematic Investment Plans (SIPs) - the easiest way to build wealth.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/mutual-funds" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
            Explore SIPs →
        </a>
    </div>
</body>
</html>
    `.trim();
}

function generateNurtureEmail1(category: string): string {
    return `<html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>How to Choose the Right ${category === 'credit-cards' ? 'Credit Card' : 'Investment'}</h2>
        <p>Expert tips and comparisons to help you make the right choice.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/${category}">Learn More →</a>
    </body></html>`;
}

function generateNurtureEmail2(category: string): string {
    return `<html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>SIP vs Lump Sum: Which is Better?</h2>
        <p>Understand the difference and choose the right investment strategy.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/mutual-funds">Read Article →</a>
    </body></html>`;
}

function generateNurtureEmail3(category: string): string {
    return `<html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Tax Saving Strategies for 2026</h2>
        <p>Maximize your tax savings with smart investment choices.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/tax-planning">Learn More →</a>
    </body></html>`;
}

function generateReEngagementEmail1(): string {
    return `<html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>We Miss You!</h2>
        <p>Here's what you've been missing - new articles, product updates, and exclusive offers.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}">Visit InvestingPro →</a>
    </body></html>`;
}

function generateReEngagementEmail2(): string {
    return `<html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Last Chance: Special Offer</h2>
        <p>Don't miss out on our latest insights and recommendations.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}">Explore Now →</a>
    </body></html>`;
}
