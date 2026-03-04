/**
 * Stripe Checkout API Route
 * 
 * Creates a checkout session for subscription purchases
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import stripeService from '@/lib/payments/stripe-service';

export async function POST(request: NextRequest) {
  try {
    const { priceId, customerId, successUrl, cancelUrl } = await request.json();

    if (!priceId || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId, customerId' },
        { status: 400 }
      );
    }

    if (!stripeService.isConfigured) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
    if (!baseUrl && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Set NEXT_PUBLIC_BASE_URL in Vercel for payment redirects.' },
        { status: 503 }
      );
    }
    const fallbackBase = baseUrl || 'http://localhost:3000';

    const session = await stripeService.createCheckoutSession(
      customerId,
      priceId,
      successUrl || `${fallbackBase}/dashboard?payment=success`,
      cancelUrl || `${fallbackBase}/pricing?payment=cancelled`
    );

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    logger.error('[API] Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
