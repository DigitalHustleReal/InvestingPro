
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface NewsletterSubscriber {
    id: string;
    email: string;
    name?: string;
    status: 'pending' | 'verified' | 'unsubscribed';
    interests: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
    verification_token?: string;
    verified_at?: string;
    unsubscribed_at?: string;
    created_at: string;
}

export interface SubscribeResult {
    success: boolean;
    message: string;
    requiresVerification?: boolean;
}

class NewsletterService {
    private supabase = createClient();

    /**
     * Subscribe a new email to the newsletter
     */
    async subscribe(data: {
        email: string;
        name?: string;
        interests?: string[];
        frequency?: 'daily' | 'weekly' | 'monthly';
    }): Promise<SubscribeResult> {
        try {
            const { email, name, interests = [], frequency = 'weekly' } = data;

            // Validate email
            if (!this.isValidEmail(email)) {
                return { success: false, message: 'Invalid email address' };
            }

            // Check if already subscribed
            const { data: existing } = await this.supabase
                .from('newsletter_subscribers')
                .select('id, status')
                .eq('email', email.toLowerCase())
                .single();

            if (existing) {
                if (existing.status === 'verified') {
                    return { success: false, message: 'This email is already subscribed' };
                }
                if (existing.status === 'pending') {
                    // Resend verification
                    await this.sendVerificationEmail(email);
                    return { 
                        success: true, 
                        message: 'Verification email resent. Please check your inbox.',
                        requiresVerification: true
                    };
                }
                // Was unsubscribed, resubscribe
                await this.supabase
                    .from('newsletter_subscribers')
                    .update({ 
                        status: 'pending',
                        verification_token: this.generateToken(),
                        unsubscribed_at: null,
                        interests,
                        frequency
                    })
                    .eq('id', existing.id);

                await this.sendVerificationEmail(email);
                return { 
                    success: true, 
                    message: 'Please verify your email to resubscribe.',
                    requiresVerification: true
                };
            }

            // Create new subscriber
            const verificationToken = this.generateToken();
            const { error } = await this.supabase
                .from('newsletter_subscribers')
                .insert({
                    email: email.toLowerCase(),
                    name,
                    status: 'pending',
                    interests,
                    frequency,
                    verification_token: verificationToken
                });

            if (error) throw error;

            // Send verification email
            await this.sendVerificationEmail(email, verificationToken);

            return { 
                success: true, 
                message: 'Please check your email to verify your subscription.',
                requiresVerification: true
            };

        } catch (error) {
            logger.error('Newsletter subscription failed', error as Error);
            return { success: false, message: 'Subscription failed. Please try again.' };
        }
    }

    /**
     * Verify email subscription
     */
    async verify(token: string): Promise<SubscribeResult> {
        try {
            const { data: subscriber, error } = await this.supabase
                .from('newsletter_subscribers')
                .select('*')
                .eq('verification_token', token)
                .eq('status', 'pending')
                .single();

            if (error || !subscriber) {
                return { success: false, message: 'Invalid or expired verification link' };
            }

            await this.supabase
                .from('newsletter_subscribers')
                .update({
                    status: 'verified',
                    verified_at: new Date().toISOString(),
                    verification_token: null
                })
                .eq('id', subscriber.id);

            return { 
                success: true, 
                message: 'Email verified successfully! You\'re now subscribed.' 
            };

        } catch (error) {
            logger.error('Newsletter verification failed', error as Error);
            return { success: false, message: 'Verification failed. Please try again.' };
        }
    }

    /**
     * Unsubscribe from newsletter
     */
    async unsubscribe(email: string): Promise<SubscribeResult> {
        try {
            const { error } = await this.supabase
                .from('newsletter_subscribers')
                .update({
                    status: 'unsubscribed',
                    unsubscribed_at: new Date().toISOString()
                })
                .eq('email', email.toLowerCase());

            if (error) throw error;

            return { success: true, message: 'You have been unsubscribed successfully.' };

        } catch (error) {
            logger.error('Newsletter unsubscribe failed', error as Error);
            return { success: false, message: 'Unsubscribe failed. Please try again.' };
        }
    }

    /**
     * Get subscriber count
     */
    async getSubscriberCount(): Promise<number> {
        try {
            const { count, error } = await this.supabase
                .from('newsletter_subscribers')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'verified');

            if (error) throw error;
            return count || 0;

        } catch (error) {
            return 0;
        }
    }

    /**
     * Update subscriber preferences
     */
    async updatePreferences(email: string, preferences: {
        interests?: string[];
        frequency?: 'daily' | 'weekly' | 'monthly';
    }): Promise<SubscribeResult> {
        try {
            const { error } = await this.supabase
                .from('newsletter_subscribers')
                .update(preferences)
                .eq('email', email.toLowerCase())
                .eq('status', 'verified');

            if (error) throw error;

            return { success: true, message: 'Preferences updated successfully.' };

        } catch (error) {
            logger.error('Newsletter preferences update failed', error as Error);
            return { success: false, message: 'Update failed. Please try again.' };
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private generateToken(): string {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    private async sendVerificationEmail(email: string, token?: string): Promise<void> {
        // In production, integrate with email service (SendGrid, Resend, etc.)
        // For now, just log
        logger.info('Verification email would be sent', { email, token });
        
        // TODO: Implement actual email sending
        // await emailService.send({
        //     to: email,
        //     subject: 'Verify your InvestingPro newsletter subscription',
        //     template: 'newsletter-verification',
        //     data: { verificationUrl: `${process.env.NEXT_PUBLIC_URL}/newsletter/verify?token=${token}` }
        // });
    }
}

export const newsletterService = new NewsletterService();
