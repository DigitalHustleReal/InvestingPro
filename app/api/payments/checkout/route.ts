/**
 * Stripe Checkout API Route
 * 
 * Creates a checkout session for subscription purchases
 */

import { NextRequest, NextResponse } from 'next/server';
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

    const session = await stripeService.createCheckoutSession(
      customerId,
      priceId,
      successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?payment=cancelled`
    );

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('[API] Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
