/**
 * Razorpay Payment Service (replaces Stripe — InvestingPro is India-only).
 *
 * Why Razorpay over Stripe for India:
 *   - Native UPI / RuPay support (Stripe India is card-only for most users)
 *   - 2% transaction fee vs Stripe's 3% on Indian cards
 *   - Razorpay Subscriptions API supports UPI AutoPay + e-mandate
 *     (RBI-compliant recurring payments) which Stripe India can't do
 *   - Indian-rupee-first UX, INR-denominated dashboard
 *   - Razorpay Standard Checkout modal converts ~30% better in IN than redirect flow
 *
 * Architectural shape mirrors stripe-service.ts so call-sites change minimally:
 *   - createCustomer(email, name, userId)
 *   - createSubscription(customerId, planId)  // replaces createCheckoutSession
 *   - cancelSubscription(subscriptionId)
 *   - getSubscription(subscriptionId)
 *   - verifyWebhookSignature(body, signature)
 *
 * Setup:
 *   1. Create Razorpay account (KYB approval ~1 business day)
 *   2. Set RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET in .env.local
 *   3. Set NEXT_PUBLIC_RAZORPAY_KEY_ID for client-side checkout
 *   4. Set RAZORPAY_WEBHOOK_SECRET for webhook signature verification
 *   5. Create plans in Razorpay dashboard:
 *        - Pro Monthly (₹199) → set RAZORPAY_PRO_MONTHLY_PLAN_ID
 *        - Pro Annual (₹1,999) → set RAZORPAY_PRO_ANNUAL_PLAN_ID
 *
 * Razorpay-specific notes:
 *   - "plan_id" in Razorpay = "price_id" in Stripe terminology
 *   - Subscription requires a customer first (we handle this internally)
 *   - Webhook signature uses HMAC-SHA256 (not Stripe's separate signing)
 *   - There's no hosted customer-portal equivalent — we render in-app billing UI
 *   - Mid-cycle plan changes use "update subscription" with prorate=true
 */

import crypto from "crypto";
import Razorpay from "razorpay";
import { logger } from "@/lib/logger";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  KEY_ID && KEY_SECRET
    ? new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })
    : null;

export const isRazorpayConfigured = !!razorpay;

/**
 * Subscription Plans for InvestingPro.
 * `planId` values come from the Razorpay dashboard once plans are created.
 */
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    interval: null,
    features: [
      "All 72 calculators",
      "Product comparisons",
      "Articles and guides",
      "Glossary access",
    ],
  },
  PRO_MONTHLY: {
    id: "pro_monthly",
    name: "Pro Monthly",
    price: 199, // INR
    interval: "monthly" as const,
    razorpayPlanId: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID,
    features: [
      "Everything in Free",
      "Advanced personalised recommendations",
      "Portfolio + goal tracker",
      "Ad-free experience",
      "Priority email support",
    ],
  },
  PRO_ANNUAL: {
    id: "pro_annual",
    name: "Pro Annual",
    price: 1999, // INR (save ~₹389 vs monthly)
    interval: "yearly" as const,
    razorpayPlanId: process.env.RAZORPAY_PRO_ANNUAL_PLAN_ID,
    features: [
      "Everything in Pro Monthly",
      "2 months free vs monthly billing",
      "Priority chat support",
    ],
  },
};

export type PlanKey = keyof typeof SUBSCRIPTION_PLANS;

interface RazorpayCustomer {
  id: string;
  email: string;
  name?: string;
}

interface RazorpaySubscription {
  id: string;
  plan_id: string;
  status:
    | "created"
    | "authenticated"
    | "active"
    | "pending"
    | "halted"
    | "cancelled"
    | "completed"
    | "expired";
  customer_id?: string;
  short_url?: string;
  current_start?: number;
  current_end?: number;
}

/**
 * Create a Razorpay customer record.
 * Idempotent on email — Razorpay returns the existing customer if email matches.
 */
export async function createCustomer(
  email: string,
  name?: string,
  userId?: string,
): Promise<RazorpayCustomer | null> {
  if (!razorpay) {
    logger.warn("[razorpay] not configured (missing RAZORPAY_KEY_ID/SECRET)");
    return null;
  }
  try {
    const customer = await razorpay.customers.create({
      email,
      name: name || email.split("@")[0],
      fail_existing: 0, // 0 = return existing customer if email already registered
      notes: userId ? { userId } : {},
    });
    return {
      id: customer.id,
      email: customer.email || email,
      name: customer.name || undefined,
    };
  } catch (err) {
    logger.error("[razorpay] createCustomer failed", err as Error);
    throw err;
  }
}

/**
 * Create a subscription on a given Razorpay plan.
 * Returns the subscription object — the client renders Razorpay Checkout
 * with the subscription_id; on successful payment, the webhook fires
 * `subscription.activated`.
 */
export async function createSubscription(
  customerId: string,
  planId: string,
  options?: {
    totalCount?: number; // for fixed-tenure subs; default unlimited
    notes?: Record<string, string>;
  },
): Promise<RazorpaySubscription> {
  if (!razorpay) {
    throw new Error("Razorpay not configured");
  }
  try {
    const sub = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      // For an "until cancelled" subscription, Razorpay still requires
      // total_count. 120 monthly cycles = 10 years; renew within app
      // before that boundary. (Stripe defaults to perpetual; Razorpay
      // does not have that semantic.)
      total_count: options?.totalCount ?? 120,
      notes: {
        customerId,
        ...(options?.notes || {}),
      },
    });
    return {
      id: sub.id,
      plan_id: sub.plan_id,
      status: sub.status as RazorpaySubscription["status"],
      customer_id: customerId,
      short_url: sub.short_url,
      current_start: sub.current_start ?? undefined,
      current_end: sub.current_end ?? undefined,
    };
  } catch (err) {
    logger.error("[razorpay] createSubscription failed", err as Error);
    throw err;
  }
}

/**
 * Fetch a subscription by ID.
 */
export async function getSubscription(
  subscriptionId: string,
): Promise<RazorpaySubscription | null> {
  if (!razorpay) return null;
  try {
    const sub = await razorpay.subscriptions.fetch(subscriptionId);
    return {
      id: sub.id,
      plan_id: sub.plan_id,
      status: sub.status as RazorpaySubscription["status"],
      current_start: sub.current_start ?? undefined,
      current_end: sub.current_end ?? undefined,
    };
  } catch (err) {
    logger.error("[razorpay] getSubscription failed", err as Error);
    return null;
  }
}

/**
 * Cancel a subscription. By default cancels at the end of the current
 * billing cycle so the user keeps Pro until paid period ends.
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelImmediately = false,
): Promise<RazorpaySubscription | null> {
  if (!razorpay) return null;
  try {
    const sub = await razorpay.subscriptions.cancel(
      subscriptionId,
      cancelImmediately,
    );
    return {
      id: sub.id,
      plan_id: sub.plan_id,
      status: sub.status as RazorpaySubscription["status"],
    };
  } catch (err) {
    logger.error("[razorpay] cancelSubscription failed", err as Error);
    throw err;
  }
}

/**
 * Verify the X-Razorpay-Signature header on a webhook payload.
 * Razorpay uses HMAC-SHA256 with your webhook secret as the key.
 *
 * Returns true if the signature matches; false otherwise. Always verify
 * before trusting any webhook event.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  // Use timingSafeEqual to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(expected, "utf8"),
    );
  } catch {
    return false;
  }
}

/**
 * Verify the in-checkout payment signature returned by the Razorpay
 * Standard Checkout modal. This is the immediate client-side handler
 * (separate from webhook signatures, which use a different secret).
 *
 * Sig formula: HMAC-SHA256(razorpay_payment_id + "|" + razorpay_subscription_id,
 *   key=KEY_SECRET).
 */
export function verifyPaymentSignature(params: {
  razorpay_subscription_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  if (!KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${params.razorpay_payment_id}|${params.razorpay_subscription_id}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(params.razorpay_signature, "utf8"),
      Buffer.from(expected, "utf8"),
    );
  } catch {
    return false;
  }
}
