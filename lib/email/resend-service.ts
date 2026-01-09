/**
 * Resend Email Service
 * 
 * Free tier: 100 emails/day
 * Use for: Transactional emails, newsletters, notifications
 * 
 * Setup:
 * 1. Create account at resend.com
 * 2. Add RESEND_API_KEY to .env.local
 * 3. Verify your domain
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailTemplate {
  type: 'welcome' | 'newsletter' | 'notification' | 'password_reset';
  data: Record<string, any>;
}

/**
 * Send a transactional email
 */
export async function sendEmail(options: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] Resend API key not configured, skipping email');
    return { success: false, error: 'API key not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: options.from || 'InvestingPro <noreply@investingpro.in>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    if (error) {
      console.error('[EMAIL] Failed to send:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[EMAIL] Exception:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to InvestingPro.in! 🎉',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0d9488;">Welcome, ${name}!</h1>
        <p>Thanks for joining InvestingPro.in - India's trusted personal finance platform.</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>Use our financial calculators (SIP, EMI, Tax, etc.)</li>
          <li>Compare credit cards, loans, and insurance</li>
          <li>Read expert financial guides and articles</li>
        </ul>
        <a href="https://investingpro.in/calculators" 
           style="display: inline-block; padding: 12px 24px; background: #0d9488; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Explore Calculators
        </a>
        <p style="color: #64748b; font-size: 14px; margin-top: 32px;">
          - Team InvestingPro
        </p>
      </div>
    `,
  });
}

/**
 * Send newsletter subscription confirmation
 */
export async function sendNewsletterConfirmation(email: string) {
  return sendEmail({
    to: email,
    subject: 'You\'re subscribed! 📧',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0d9488;">Thanks for subscribing!</h1>
        <p>You'll now receive our weekly personal finance insights:</p>
        <ul>
          <li>Market updates and analysis</li>
          <li>Best deals on credit cards and loans</li>
          <li>Tax-saving tips</li>
          <li>Investment opportunities</li>
        </ul>
        <p style="color: #64748b; font-size: 14px; margin-top: 32px;">
          You can unsubscribe anytime by clicking the link in our emails.
        </p>
      </div>
    `,
  });
}

export default {
  sendEmail,
  sendWelcomeEmail,
  sendNewsletterConfirmation,
};
