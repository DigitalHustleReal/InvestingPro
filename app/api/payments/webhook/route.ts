/**
 * Razorpay Webhook Handler.
 * Replaced Stripe webhook 2026-04-26.
 *
 * Razorpay sends signed events for the subscription lifecycle. We
 * authoritatively flip user_profiles.subscription_* state based on
 * these events; the in-checkout payment handler is just a UX hint.
 *
 * Key event types handled:
 *   - subscription.activated  → Pro flag ON, status = active
 *   - subscription.charged    → renewal succeeded, extend period_end
 *   - subscription.cancelled  → Pro flag OFF on cycle end
 *   - subscription.halted     → mandate revoked / payment-method invalid
 *   - subscription.completed  → fixed-tenure end, downgrade to free
 *   - payment.failed          → log only (Razorpay retries automatically)
 *
 * Configure in Razorpay dashboard:
 *   URL: https://investingpro.in/api/payments/webhook
 *   Secret: matches RAZORPAY_WEBHOOK_SECRET env
 *   Events: all subscription.* + payment.failed
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { verifyWebhookSignature } from "@/lib/payments/razorpay-service";
import { createClient } from "@/lib/supabase/server";

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    subscription?: {
      entity: {
        id: string;
        plan_id: string;
        status: string;
        customer_id?: string;
        notes?: Record<string, string>;
        current_start?: number;
        current_end?: number;
      };
    };
    payment?: {
      entity: {
        id: string;
        order_id?: string;
        status: string;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 },
      );
    }

    const event = JSON.parse(rawBody) as RazorpayWebhookEvent;
    const supabase = await createClient();

    const sub = event.payload.subscription?.entity;
    const planFromNotes = sub?.notes?.plan;
    const userIdFromNotes = sub?.notes?.userId;

    switch (event.event) {
      case "subscription.activated": {
        if (!sub) break;
        logger.info(`[razorpay-webhook] subscription.activated ${sub.id}`);
        await supabase
          .from("user_profiles")
          .update({
            razorpay_customer_id: sub.customer_id,
            razorpay_subscription_id: sub.id,
            subscription_status: "active",
            subscription_plan: planFromNotes || "pro",
            subscription_period_end: sub.current_end
              ? new Date(sub.current_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", sub.id);
        break;
      }

      case "subscription.charged": {
        if (!sub) break;
        logger.info(`[razorpay-webhook] subscription.charged ${sub.id}`);
        // Extend period end on successful renewal
        await supabase
          .from("user_profiles")
          .update({
            subscription_status: "active",
            subscription_period_end: sub.current_end
              ? new Date(sub.current_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", sub.id);
        break;
      }

      case "subscription.cancelled":
      case "subscription.completed":
      case "subscription.expired": {
        if (!sub) break;
        logger.info(`[razorpay-webhook] ${event.event} ${sub.id}`);
        await supabase
          .from("user_profiles")
          .update({
            subscription_status:
              event.event === "subscription.cancelled"
                ? "cancelled"
                : "expired",
            subscription_plan: "free",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", sub.id);
        break;
      }

      case "subscription.halted": {
        if (!sub) break;
        logger.warn(
          `[razorpay-webhook] subscription.halted ${sub.id} — mandate revoked or payment method invalid; user remains active until period_end`,
        );
        await supabase
          .from("user_profiles")
          .update({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", sub.id);
        break;
      }

      case "payment.failed": {
        const pay = event.payload.payment?.entity;
        logger.warn(
          `[razorpay-webhook] payment.failed ${pay?.id} (Razorpay will auto-retry)`,
        );
        // Razorpay handles retry on its own; we only flip user state when
        // the subscription transitions to halted / cancelled.
        break;
      }

      default:
        logger.info(`[razorpay-webhook] unhandled event ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error("[razorpay-webhook] processing failed", err as Error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
