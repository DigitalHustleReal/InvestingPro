/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe events for subscription lifecycle
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import stripeService from '@/lib/payments/stripe-service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const event = stripeService.verifyWebhookSignature(
      Buffer.from(body),
      signature
    );

    if (!event) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        logger.info('[WEBHOOK] Checkout completed:', session.id);
        
        // Update user subscription status in database
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        
        await supabase
          .from('user_profiles')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            subscription_plan: 'pro',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        logger.info('[WEBHOOK] Subscription updated:', subscription.id);
        
        await supabase
          .from('user_profiles')
          .update({
            subscription_status: subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        logger.info('[WEBHOOK] Subscription cancelled:', subscription.id);
        
        await supabase
          .from('user_profiles')
          .update({
            subscription_status: 'cancelled',
            subscription_plan: 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        logger.info('[WEBHOOK] Payment failed:', invoice.id);
        
        // Could send email notification here
        break;
      }

      default:
        logger.info('[WEBHOOK] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('[WEBHOOK] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
