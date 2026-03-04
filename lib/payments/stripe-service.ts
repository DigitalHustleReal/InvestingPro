/**
 * Stripe Payment Service
 * 
 * Use for: Premium subscriptions, one-time purchases
 * 
 * Setup:
 * 1. Create account at stripe.com
 * 2. Add STRIPE_SECRET_KEY to .env.local (server-side)
 * 3. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local (client-side)
 * 4. Add STRIPE_WEBHOOK_SECRET for webhook verification
 */

import Stripe from 'stripe';
import { logger } from '@/lib/logger';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const isConfigured = !!stripe;

/**
 * Subscription Plans for InvestingPro
 */
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'All calculators',
      'Product comparisons',
      'Articles and guides',
      'Glossary access',
    ],
  },
  PRO: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 199, // INR
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    features: [
      'Everything in Free',
      'Advanced calculators',
      'Portfolio tracker',
      'Personalized recommendations',
      'Ad-free experience',
      'Email support',
    ],
  },
  PRO_ANNUAL: {
    id: 'pro_annual',
    name: 'Pro Annual',
    price: 1999, // INR (save 2 months)
    stripePriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    features: [
      'Everything in Pro Monthly',
      '2 months free',
      'Priority support',
    ],
  },
};

/**
 * Create a Stripe customer
 */
export async function createCustomer(email: string, name?: string, userId?: string) {
  if (!stripe) {
    logger.warn('[STRIPE] Not configured');
    return null;
  }

  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId: userId || '',
      },
    });
    return customer;
  } catch (error) {
    logger.error('[STRIPE] Create customer error:', error);
    throw error;
  }
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
      },
    });
    return session;
  } catch (error) {
    logger.error('[STRIPE] Create checkout session error:', error);
    throw error;
  }
}

/**
 * Create a customer portal session
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  } catch (error) {
    logger.error('[STRIPE] Create portal session error:', error);
    throw error;
  }
}

/**
 * Get customer subscriptions
 */
export async function getSubscriptions(customerId: string) {
  if (!stripe) return [];

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });
    return subscriptions.data;
  } catch (error) {
    logger.error('[STRIPE] Get subscriptions error:', error);
    return [];
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return subscription;
  } catch (error) {
    logger.error('[STRIPE] Cancel subscription error:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: Buffer,
  signature: string
): Stripe.Event | null {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    logger.warn('[STRIPE] Webhook secret not configured');
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    logger.error('[STRIPE] Webhook signature verification failed:', error);
    return null;
  }
}

export default {
  createCustomer,
  createCheckoutSession,
  createPortalSession,
  getSubscriptions,
  cancelSubscription,
  verifyWebhookSignature,
  SUBSCRIPTION_PLANS,
  isConfigured,
};
