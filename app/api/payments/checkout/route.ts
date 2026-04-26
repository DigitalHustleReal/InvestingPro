/**
 * Razorpay Subscription Creation API Route.
 * Replaced Stripe Checkout 2026-04-26 (InvestingPro is India-only;
 * Razorpay supports UPI AutoPay + RBI-mandate recurring payments).
 *
 * POST /api/payments/checkout
 * Body: { plan: "pro_monthly" | "pro_annual", email, name, userId }
 * Response: { subscriptionId, keyId, planLabel } — client renders
 *           Razorpay Standard Checkout modal with these values.
 *
 * After successful payment in the modal, the client POSTs the
 * payment_id + signature to /api/payments/verify, and the webhook
 * (separate endpoint) authoritatively flips the subscription state.
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  SUBSCRIPTION_PLANS,
  createCustomer,
  createSubscription,
  isRazorpayConfigured,
} from "@/lib/payments/razorpay-service";

export async function POST(request: NextRequest) {
  try {
    const { plan, email, name, userId } = await request.json();

    if (!plan || !email) {
      return NextResponse.json(
        { error: "Missing required fields: plan, email" },
        { status: 400 },
      );
    }

    if (!isRazorpayConfigured) {
      return NextResponse.json(
        {
          error:
            "Razorpay not configured (missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)",
        },
        { status: 503 },
      );
    }

    if (plan !== "pro_monthly" && plan !== "pro_annual") {
      return NextResponse.json(
        {
          error: "Unknown plan. Use 'pro_monthly' or 'pro_annual'.",
        },
        { status: 400 },
      );
    }

    const planConfig =
      plan === "pro_monthly"
        ? SUBSCRIPTION_PLANS.PRO_MONTHLY
        : SUBSCRIPTION_PLANS.PRO_ANNUAL;

    if (!planConfig.razorpayPlanId) {
      return NextResponse.json(
        {
          error: `Razorpay plan ID not set in env (RAZORPAY_PRO_${plan === "pro_monthly" ? "MONTHLY" : "ANNUAL"}_PLAN_ID). Create the plan in the Razorpay dashboard first.`,
        },
        { status: 503 },
      );
    }

    // Create or fetch customer (idempotent on email)
    const customer = await createCustomer(email, name, userId);
    if (!customer) {
      return NextResponse.json(
        { error: "Failed to create Razorpay customer" },
        { status: 500 },
      );
    }

    // Create subscription on the chosen plan
    const subscription = await createSubscription(
      customer.id,
      planConfig.razorpayPlanId,
      {
        notes: {
          userId: userId || "",
          plan: planConfig.id,
          source: "investingpro.in",
        },
      },
    );

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      customerId: customer.id,
      plan: planConfig.id,
      planLabel: planConfig.name,
      amount: planConfig.price * 100, // paise (Razorpay uses subunit)
      currency: "INR",
      checkoutUrl: subscription.short_url, // fallback if client can't render modal
    });
  } catch (error) {
    logger.error("[api/payments/checkout] failed", error as Error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 },
    );
  }
}
