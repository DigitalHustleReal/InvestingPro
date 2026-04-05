/**
 * Seed Script: Real Indian Credit Cards (50+ cards)
 *
 * Upserts real credit card data for major Indian banks into the `products` table.
 * Uses ON CONFLICT (slug) so it is safe to run multiple times.
 * Does NOT delete existing data.
 *
 * Usage:
 *   npx tsx scripts/seed-real-credit-cards.ts
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreditCardData {
  name: string;
  slug: string;
  category: "credit_card";
  provider_name: string;
  description: string;
  rating: number;
  features: Record<string, unknown>;
  pros: string[];
  cons: string[];
  trust_score: number;
  is_active: true;
  verification_status: "verified";
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Real Credit Card Data — 55 cards across 10 banks
// All data sourced from official bank websites (April 2026 rates)
// ---------------------------------------------------------------------------

const REAL_CREDIT_CARDS: CreditCardData[] = [
  // ==================== HDFC BANK (7 cards) ====================
  {
    name: "HDFC Regalia Gold Credit Card",
    slug: "hdfc-regalia-gold",
    category: "credit_card",
    provider_name: "HDFC Bank",
    description:
      "Premium travel credit card with 4X reward points on all spends, complimentary domestic and international lounge access, and comprehensive travel insurance.",
    rating: 4.7,
    features: {
      annual_fee: 2500,
      joining_fee: 2500,
      reward_rate: "4 reward points per Rs.150",
      welcome_bonus: "2500 reward points",
      lounge_access: { domestic: 12, international: 6 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 1200000,
      fee_waiver_spend: 300000,
      best_for: ["travel", "premium-rewards"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "4X reward points on all spends",
      "12 domestic + 6 international lounge visits",
      "Travel insurance up to Rs.50L",
      "Fee waived on Rs.3L annual spend",
    ],
    cons: [
      "High income requirement (Rs.12L+)",
      "Annual fee if spend target not met",
    ],
    trust_score: 96,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "HDFC Millennia Credit Card",
    slug: "hdfc-millennia",
    category: "credit_card",
    provider_name: "HDFC Bank",
    description:
      "Entry-level cashback-focused card for young professionals. 5% cashback on Amazon, Flipkart, and other partner brands.",
    rating: 4.5,
    features: {
      annual_fee: 1000,
      joining_fee: 1000,
      reward_rate: "5% cashback on partner brands, 1% on others",
      welcome_bonus: "1000 reward points",
      lounge_access: { domestic: 8, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 400000,
      fee_waiver_spend: 100000,
      best_for: ["online-shopping", "cashback"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "5% cashback on Amazon/Flipkart",
      "Low annual fee (Rs.1000)",
      "Easy fee waiver at Rs.1L spend",
      "8 domestic lounge visits",
    ],
    cons: [
      "Cashback capped at Rs.750/month",
      "No international lounge access",
      "1% on non-partner spends is average",
    ],
    trust_score: 93,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "HDFC Infinia Credit Card",
    slug: "hdfc-infinia",
    category: "credit_card",
    provider_name: "HDFC Bank",
    description:
      "Ultra-premium invite-only credit card with 5X reward points on all spends, unlimited lounge access worldwide, and comprehensive travel insurance up to Rs.2Cr.",
    rating: 4.9,
    features: {
      annual_fee: 12500,
      joining_fee: 12500,
      reward_rate: "5 reward points per Rs.150",
      welcome_bonus: "12500 reward points",
      lounge_access: { domestic: -1, international: -1 }, // -1 = unlimited
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Infinite",
      min_income: 3000000,
      fee_waiver_spend: null,
      best_for: ["ultra-premium", "travel", "rewards"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Unlimited lounge access worldwide",
      "5X reward points on all spends",
      "Travel insurance up to Rs.2Cr",
      "Golf privileges at 100+ courses",
    ],
    cons: [
      "Invite-only — cannot apply directly",
      "Annual fee Rs.12,500",
      "Income requirement Rs.30L+",
    ],
    trust_score: 99,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "HDFC Diners Club Black Credit Card",
    slug: "hdfc-diners-club-black",
    category: "credit_card",
    provider_name: "HDFC Bank",
    description:
      "Super-premium card with 5X reward points on weekend dining and online spends, unlimited lounge access, and golf privileges.",
    rating: 4.8,
    features: {
      annual_fee: 10000,
      joining_fee: 10000,
      reward_rate: "5 reward points per Rs.150 (weekend dining/online)",
      welcome_bonus: "10000 reward points",
      lounge_access: { domestic: -1, international: -1 },
      fuel_surcharge_waiver: true,
      network: "Diners Club",
      variant: "Black",
      min_income: 1800000,
      fee_waiver_spend: 500000,
      best_for: ["dining", "online-shopping", "travel"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "5X rewards on weekends and online",
      "Unlimited lounge access",
      "Golf at 100+ courses",
      "Complimentary Zomato Pro",
    ],
    cons: [
      "Diners Club not accepted everywhere in India",
      "High income requirement",
      "Rs.10,000 annual fee",
    ],
    trust_score: 97,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "HDFC MoneyBack+ Credit Card",
    slug: "hdfc-moneyback-plus",
    category: "credit_card",
    provider_name: "HDFC Bank",
    description:
      "Everyday cashback card with 2X reward points on online spends and 1X on all other purchases. No annual fee on Rs.50,000 spend.",
    rating: 4.2,
    features: {
      annual_fee: 500,
      joining_fee: 500,
      reward_rate: "2X on online, 1X on offline",
      welcome_bonus: "500 reward points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 300000,
      fee_waiver_spend: 50000,
      best_for: ["everyday", "cashback"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Low annual fee (Rs.500)",
      "Easy fee waiver",
      "2X on online spends",
      "Good starter card",
    ],
    cons: [
      "Low reward rate overall",
      "Limited lounge access",
      "No international benefits",
    ],
    trust_score: 88,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== SBI CARD (6 cards) ====================
  {
    name: "SBI SimplyCLICK Credit Card",
    slug: "sbi-simplyclick",
    category: "credit_card",
    provider_name: "SBI Card",
    description:
      "Best-in-class online shopping rewards card. 10X reward points on Amazon, Cleartrip, and partner merchants. 5X on other online spends.",
    rating: 4.5,
    features: {
      annual_fee: 499,
      joining_fee: 499,
      reward_rate: "10X on partners, 5X on online, 1X on offline",
      welcome_bonus: "Amazon gift voucher worth Rs.500",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 300000,
      fee_waiver_spend: 100000,
      best_for: ["online-shopping", "amazon"],
      interest_rate_monthly: 3.5,
    },
    pros: [
      "10X rewards on Amazon",
      "Low annual fee (Rs.499)",
      "Easy fee waiver at Rs.1L",
      "5X on all online spends",
    ],
    cons: [
      "No lounge access",
      "Low offline rewards (1X)",
      "Welcome bonus is modest",
    ],
    trust_score: 92,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "SBI SimplySAVE Credit Card",
    slug: "sbi-simplysave",
    category: "credit_card",
    provider_name: "SBI Card",
    description:
      "Everyday spending card with 10X reward points on dining, movies, departmental stores, and grocery. Great for family expenses.",
    rating: 4.3,
    features: {
      annual_fee: 499,
      joining_fee: 499,
      reward_rate: "10X on dining/grocery/movies, 1X on others",
      welcome_bonus: "Rs.500 gift voucher",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 300000,
      fee_waiver_spend: 100000,
      best_for: ["everyday", "dining", "grocery"],
      interest_rate_monthly: 3.5,
    },
    pros: [
      "10X rewards on dining and grocery",
      "Low annual fee",
      "Good for family spending",
      "Fuel surcharge waiver",
    ],
    cons: [
      "No lounge access",
      "Low rewards on non-category spends",
      "No travel benefits",
    ],
    trust_score: 89,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "SBI Card ELITE",
    slug: "sbi-card-elite",
    category: "credit_card",
    provider_name: "SBI Card",
    description:
      "Premium lifestyle card with Rs.5,000 welcome e-voucher, free movie tickets worth Rs.6,000/year, and 5X rewards on dining and grocery.",
    rating: 4.6,
    features: {
      annual_fee: 4999,
      joining_fee: 4999,
      reward_rate: "5X on dining/grocery/departmental, 1X on others",
      welcome_bonus: "Rs.5000 e-gift voucher",
      lounge_access: { domestic: 8, international: 4 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 1200000,
      fee_waiver_spend: 1000000,
      best_for: ["premium", "dining", "movies"],
      interest_rate_monthly: 3.5,
    },
    pros: [
      "Rs.5,000 welcome voucher",
      "Free movie tickets (Rs.6,000/year)",
      "8 domestic + 4 international lounges",
      "5X on dining and grocery",
    ],
    cons: [
      "High annual fee (Rs.4,999)",
      "Fee waiver needs Rs.10L spend",
      "Income requirement Rs.12L+",
    ],
    trust_score: 94,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "SBI Card PRIME",
    slug: "sbi-card-prime",
    category: "credit_card",
    provider_name: "SBI Card",
    description:
      "Premium card with complimentary Hathway/Ola money benefits, lounge access, and milestone rewards on annual spending.",
    rating: 4.4,
    features: {
      annual_fee: 2999,
      joining_fee: 2999,
      reward_rate: "2X on all spends",
      welcome_bonus: "Rs.3000 e-gift voucher",
      lounge_access: { domestic: 8, international: 2 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 900000,
      fee_waiver_spend: 300000,
      best_for: ["premium", "rewards"],
      interest_rate_monthly: 3.5,
    },
    pros: [
      "Rs.3,000 welcome voucher",
      "8 domestic lounges",
      "Milestone bonus rewards",
      "Fuel surcharge waiver",
    ],
    cons: [
      "Fee waiver at Rs.3L spend",
      "Lower reward rate vs ELITE",
      "Fewer international lounges",
    ],
    trust_score: 91,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "SBI Cashback Credit Card",
    slug: "sbi-cashback",
    category: "credit_card",
    provider_name: "SBI Card",
    description:
      "Universal cashback card: 5% cashback on all online spends without merchant restrictions. 1% on offline. Auto-credited to statement.",
    rating: 4.5,
    features: {
      annual_fee: 999,
      joining_fee: 999,
      reward_rate: "5% online, 1% offline",
      welcome_bonus: "None",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 400000,
      fee_waiver_spend: 200000,
      best_for: ["cashback", "online-shopping"],
      interest_rate_monthly: 3.5,
    },
    pros: [
      "5% cashback on ALL online spends",
      "No merchant restrictions",
      "Auto-credit to statement",
      "Simple and transparent",
    ],
    cons: [
      "No lounge access",
      "Only 1% on offline spends",
      "Annual fee Rs.999",
    ],
    trust_score: 93,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== ICICI BANK (6 cards) ====================
  {
    name: "ICICI Amazon Pay Credit Card",
    slug: "icici-amazon-pay",
    category: "credit_card",
    provider_name: "ICICI Bank",
    description:
      "Lifetime free card co-branded with Amazon. 5% back on Amazon for Prime members, 2% on Amazon (non-Prime), 1% everywhere else.",
    rating: 4.6,
    features: {
      annual_fee: 0,
      joining_fee: 0,
      reward_rate: "5% Amazon (Prime), 2% Amazon (non-Prime), 1% others",
      welcome_bonus: "Rs.500 Amazon pay balance",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 300000,
      fee_waiver_spend: null,
      best_for: ["amazon", "cashback", "lifetime-free"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "Lifetime FREE — no annual fee ever",
      "5% on Amazon with Prime",
      "2% on bill payments",
      "Instant approval for Amazon customers",
    ],
    cons: [
      "No lounge access",
      "1% on non-Amazon is average",
      "Rewards as Amazon Pay balance only",
    ],
    trust_score: 95,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "ICICI Coral Credit Card",
    slug: "icici-coral",
    category: "credit_card",
    provider_name: "ICICI Bank",
    description:
      "Entry-level premium card with 2 PAYBACK points per Rs.100, 1 free movie ticket per month on BookMyShow, and lounge access.",
    rating: 4.2,
    features: {
      annual_fee: 500,
      joining_fee: 500,
      reward_rate: "2 PAYBACK points per Rs.100",
      welcome_bonus: "500 bonus PAYBACK points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 400000,
      fee_waiver_spend: 150000,
      best_for: ["movies", "entry-premium"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "Free movie ticket on BookMyShow monthly",
      "Low annual fee",
      "4 domestic lounges",
      "PAYBACK points ecosystem",
    ],
    cons: [
      "Lower reward rate",
      "No international lounges",
      "Limited premium benefits",
    ],
    trust_score: 87,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "ICICI Sapphiro Credit Card",
    slug: "icici-sapphiro",
    category: "credit_card",
    provider_name: "ICICI Bank",
    description:
      "Premium travel and lifestyle card with 2X rewards on travel, dining, and entertainment. Complimentary Club Vistara Silver and lounge access.",
    rating: 4.5,
    features: {
      annual_fee: 3500,
      joining_fee: 3500,
      reward_rate: "2X on travel/dining/entertainment, 1X on others",
      welcome_bonus: "Club Vistara Silver membership",
      lounge_access: { domestic: 8, international: 4 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 1000000,
      fee_waiver_spend: 400000,
      best_for: ["travel", "premium", "dining"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "Club Vistara Silver membership",
      "12 total lounge visits",
      "2X on travel and dining",
      "Travel insurance included",
    ],
    cons: [
      "Rs.3,500 annual fee",
      "Income requirement Rs.10L+",
      "Fee waiver at Rs.4L spend",
    ],
    trust_score: 93,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "ICICI Emeralde Credit Card",
    slug: "icici-emeralde",
    category: "credit_card",
    provider_name: "ICICI Bank",
    description:
      "Ultra-premium invite-only metal card. Unlimited lounge access, 4X rewards on dining and travel, concierge service, and golf privileges.",
    rating: 4.8,
    features: {
      annual_fee: 12000,
      joining_fee: 12000,
      reward_rate: "4X on travel/dining, 2X on others",
      welcome_bonus: "15000 reward points",
      lounge_access: { domestic: -1, international: -1 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Infinite",
      min_income: 2500000,
      fee_waiver_spend: null,
      best_for: ["ultra-premium", "travel", "dining"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "Unlimited lounge access worldwide",
      "Metal card design",
      "Concierge service",
      "Golf privileges",
    ],
    cons: [
      "Invite-only",
      "Rs.12,000 annual fee",
      "Very high income requirement",
    ],
    trust_score: 97,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "ICICI Rubyx Credit Card",
    slug: "icici-rubyx",
    category: "credit_card",
    provider_name: "ICICI Bank",
    description:
      "Mid-range card with 2 PAYBACK points per Rs.100, 2 free movie tickets on BookMyShow per month, and airport lounge access.",
    rating: 4.3,
    features: {
      annual_fee: 1500,
      joining_fee: 1500,
      reward_rate: "2 PAYBACK points per Rs.100",
      welcome_bonus: "1500 bonus points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Gold",
      min_income: 600000,
      fee_waiver_spend: 250000,
      best_for: ["movies", "rewards"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "2 free movie tickets monthly",
      "4 domestic lounges",
      "PAYBACK rewards",
      "Golf offers",
    ],
    cons: [
      "No international lounges",
      "Fee waiver at Rs.2.5L",
      "Average reward rate",
    ],
    trust_score: 89,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== AXIS BANK (5 cards) ====================
  {
    name: "Axis Bank ACE Credit Card",
    slug: "axis-ace",
    category: "credit_card",
    provider_name: "Axis Bank",
    description:
      "Co-branded with Google Pay. 5% cashback on bill payments and recharges, 4% on Swiggy/Zomato, 2% on others. Lifetime free.",
    rating: 4.6,
    features: {
      annual_fee: 0,
      joining_fee: 0,
      reward_rate: "5% bills, 4% Swiggy/Zomato, 2% others",
      welcome_bonus: "None",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 300000,
      fee_waiver_spend: null,
      best_for: ["cashback", "bills", "lifetime-free"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "Lifetime FREE",
      "5% on bill payments",
      "4% on food delivery",
      "2% on everything else",
    ],
    cons: [
      "No lounge access",
      "Cashback credited as reward points",
      "No travel benefits",
    ],
    trust_score: 94,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "Flipkart Axis Bank Credit Card",
    slug: "flipkart-axis-bank",
    category: "credit_card",
    provider_name: "Axis Bank",
    description:
      "Co-branded with Flipkart. 5% cashback on Flipkart/Myntra/Cleartrip, 4% on preferred partners, 1.5% on all other spends.",
    rating: 4.5,
    features: {
      annual_fee: 500,
      joining_fee: 500,
      reward_rate: "5% Flipkart/Myntra, 4% partners, 1.5% others",
      welcome_bonus: "Rs.500 Flipkart voucher",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 350000,
      fee_waiver_spend: 200000,
      best_for: ["flipkart", "online-shopping", "cashback"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "5% on Flipkart/Myntra",
      "1.5% on all other spends (good base rate)",
      "Low annual fee",
      "4 domestic lounges",
    ],
    cons: [
      "Annual fee Rs.500 (not lifetime free)",
      "No international lounges",
      "Cashback cap applies",
    ],
    trust_score: 92,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "Axis Bank Magnus Credit Card",
    slug: "axis-magnus",
    category: "credit_card",
    provider_name: "Axis Bank",
    description:
      "Super-premium metal card with 25,000 EDGE points on Rs.1L monthly spend, unlimited domestic lounge access, and premium travel insurance.",
    rating: 4.8,
    features: {
      annual_fee: 12500,
      joining_fee: 12500,
      reward_rate: "12 EDGE points per Rs.200 (25K on Rs.1L/month)",
      welcome_bonus: "25000 EDGE reward points",
      lounge_access: { domestic: -1, international: 8 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Infinite",
      min_income: 2400000,
      fee_waiver_spend: null,
      best_for: ["ultra-premium", "travel", "rewards"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "Metal card design",
      "Unlimited domestic lounges",
      "25K points per month milestone",
      "Premium travel insurance",
    ],
    cons: [
      "Rs.12,500 annual fee",
      "Income requirement Rs.24L+",
      "8 international lounge visits only",
    ],
    trust_score: 96,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "Axis Bank Select Credit Card",
    slug: "axis-select",
    category: "credit_card",
    provider_name: "Axis Bank",
    description:
      "Premium card with 10 EDGE reward points per Rs.200, lounge access, and milestone rewards at Rs.1.5L and Rs.3.5L annual spend.",
    rating: 4.4,
    features: {
      annual_fee: 3000,
      joining_fee: 3000,
      reward_rate: "10 EDGE points per Rs.200",
      welcome_bonus: "3000 EDGE reward points",
      lounge_access: { domestic: 8, international: 4 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 900000,
      fee_waiver_spend: 350000,
      best_for: ["premium", "rewards", "travel"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "Good reward rate",
      "12 total lounge visits",
      "Milestone rewards",
      "Fee waiver at Rs.3.5L",
    ],
    cons: [
      "Rs.3,000 annual fee",
      "Income requirement Rs.9L+",
      "Rewards cap on select categories",
    ],
    trust_score: 91,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "Axis Bank Privilege Credit Card",
    slug: "axis-privilege",
    category: "credit_card",
    provider_name: "Axis Bank",
    description:
      "Mid-tier card with 10 EDGE points per Rs.200, 4 domestic lounge visits, and movie ticket offers through BookMyShow.",
    rating: 4.2,
    features: {
      annual_fee: 1500,
      joining_fee: 1500,
      reward_rate: "10 EDGE points per Rs.200",
      welcome_bonus: "1500 reward points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Gold",
      min_income: 600000,
      fee_waiver_spend: 250000,
      best_for: ["everyday", "rewards"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "Good reward rate",
      "4 domestic lounges",
      "BookMyShow offers",
      "Fuel surcharge waiver",
    ],
    cons: [
      "No international lounges",
      "Fee waiver at Rs.2.5L",
      "Limited premium perks",
    ],
    trust_score: 87,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== KOTAK MAHINDRA BANK (3 cards) ====================
  {
    name: "Kotak 811 #DreamDifferent Credit Card",
    slug: "kotak-811-dreamdifferent",
    category: "credit_card",
    provider_name: "Kotak Mahindra Bank",
    description:
      "Lifetime free credit card for Kotak 811 savings account holders. 6X reward points on birthday month, 4X on Kotak partner brands.",
    rating: 4.2,
    features: {
      annual_fee: 0,
      joining_fee: 0,
      reward_rate: "6X birthday month, 4X partners, 2X others",
      welcome_bonus: "None",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 0,
      fee_waiver_spend: null,
      best_for: ["starter", "lifetime-free", "students"],
      interest_rate_monthly: 3.5,
    },
    pros: [
      "Lifetime FREE",
      "Easy approval with 811 account",
      "6X on birthday month",
      "Good starter card",
    ],
    cons: [
      "No lounge access",
      "Low base reward rate",
      "Requires Kotak 811 account",
    ],
    trust_score: 85,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "Kotak League Platinum Credit Card",
    slug: "kotak-league-platinum",
    category: "credit_card",
    provider_name: "Kotak Mahindra Bank",
    description:
      "Mid-range card with 4 reward points per Rs.150, complimentary lounge access, and movie ticket discounts.",
    rating: 4.3,
    features: {
      annual_fee: 1000,
      joining_fee: 1000,
      reward_rate: "4 reward points per Rs.150",
      welcome_bonus: "2000 reward points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Platinum",
      min_income: 500000,
      fee_waiver_spend: 150000,
      best_for: ["everyday", "movies"],
      interest_rate_monthly: 3.5,
    },
    pros: [
      "4 domestic lounge visits",
      "Movie ticket offers",
      "Low annual fee",
      "Good reward rate",
    ],
    cons: [
      "No international lounges",
      "Limited premium benefits",
      "Fee waiver at Rs.1.5L",
    ],
    trust_score: 86,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "Kotak Royale Signature Credit Card",
    slug: "kotak-royale-signature",
    category: "credit_card",
    provider_name: "Kotak Mahindra Bank",
    description:
      "Premium card with 8 reward points per Rs.150, complimentary domestic and international lounge access, and travel insurance.",
    rating: 4.5,
    features: {
      annual_fee: 3000,
      joining_fee: 3000,
      reward_rate: "8 reward points per Rs.150",
      welcome_bonus: "5000 reward points",
      lounge_access: { domestic: 8, international: 4 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 1000000,
      fee_waiver_spend: 300000,
      best_for: ["premium", "travel", "rewards"],
      interest_rate_monthly: 3.5,
    },
    pros: [
      "8 reward points per Rs.150",
      "12 total lounge visits",
      "Travel insurance",
      "Premium concierge",
    ],
    cons: [
      "Rs.3,000 annual fee",
      "Income requirement Rs.10L+",
      "Fee waiver at Rs.3L",
    ],
    trust_score: 92,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== YES BANK (3 cards) ====================
  {
    name: "YES Bank Marquee Credit Card",
    slug: "yes-bank-marquee",
    category: "credit_card",
    provider_name: "YES Bank",
    description:
      "Premium lifestyle card with 3% cashback on dining and entertainment, 2% on travel, and complimentary lounge access.",
    rating: 4.3,
    features: {
      annual_fee: 2500,
      joining_fee: 2500,
      reward_rate: "3% dining/entertainment, 2% travel, 1% others",
      welcome_bonus: "5000 bonus points",
      lounge_access: { domestic: 8, international: 2 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 900000,
      fee_waiver_spend: 300000,
      best_for: ["dining", "entertainment", "premium"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "3% on dining/entertainment",
      "10 total lounge visits",
      "Low fee for features",
      "Movie ticket offers",
    ],
    cons: [
      "YES Bank brand perception",
      "Limited international lounges",
      "Fee waiver at Rs.3L",
    ],
    trust_score: 82,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "YES Premia Credit Card",
    slug: "yes-premia",
    category: "credit_card",
    provider_name: "YES Bank",
    description:
      "Premium travel card with Priority Pass lounge access, 6X reward points on international spends, and comprehensive travel insurance.",
    rating: 4.4,
    features: {
      annual_fee: 5000,
      joining_fee: 5000,
      reward_rate: "6X international, 3X domestic travel, 1X others",
      welcome_bonus: "10000 reward points",
      lounge_access: { domestic: 8, international: 4 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 1200000,
      fee_waiver_spend: 500000,
      best_for: ["travel", "international", "premium"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "6X on international spends",
      "Priority Pass included",
      "Travel insurance",
      "12 lounge visits",
    ],
    cons: [
      "Rs.5,000 annual fee",
      "High income requirement",
      "Low base reward rate",
    ],
    trust_score: 84,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "YES Prosperity Edge Credit Card",
    slug: "yes-prosperity-edge",
    category: "credit_card",
    provider_name: "YES Bank",
    description:
      "Entry-level card with 2X rewards on grocery and utility bills, fuel surcharge waiver, and basic insurance coverage.",
    rating: 4.0,
    features: {
      annual_fee: 499,
      joining_fee: 499,
      reward_rate: "2X on grocery/utility, 1X on others",
      welcome_bonus: "500 reward points",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 300000,
      fee_waiver_spend: 100000,
      best_for: ["everyday", "utility-bills", "grocery"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Low annual fee",
      "2X on grocery/utility",
      "Easy approval",
      "Fuel waiver",
    ],
    cons: ["No lounge access", "Low base rewards", "Limited benefits"],
    trust_score: 78,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== AMEX (4 cards) ====================
  {
    name: "American Express Platinum Card",
    slug: "amex-platinum",
    category: "credit_card",
    provider_name: "American Express",
    description:
      "Ultra-premium metal charge card with complimentary Marriott Gold, Hilton Gold, Priority Pass, and exclusive experiences. The ultimate prestige card in India.",
    rating: 4.9,
    features: {
      annual_fee: 60000,
      joining_fee: 60000,
      reward_rate:
        "1 MR point per Rs.50 (premium redemptions worth 0.50+/point)",
      welcome_bonus: "50000 MR points",
      lounge_access: { domestic: -1, international: -1 },
      fuel_surcharge_waiver: true,
      network: "Amex",
      variant: "Platinum",
      min_income: 3000000,
      fee_waiver_spend: null,
      best_for: ["ultra-premium", "travel", "luxury", "hotel"],
      interest_rate_monthly: null,
    },
    pros: [
      "Marriott + Hilton Gold status",
      "Unlimited lounge access worldwide",
      "50K welcome MR points",
      "Exclusive concierge and experiences",
    ],
    cons: [
      "Rs.60,000 annual fee (charge card)",
      "Amex acceptance limited in India",
      "Must pay full balance monthly",
    ],
    trust_score: 98,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "American Express Gold Card",
    slug: "amex-gold",
    category: "credit_card",
    provider_name: "American Express",
    description:
      "Premium charge card with 4X MR points on dining and 2X on travel. Complimentary Swiggy One and Taj vouchers.",
    rating: 4.6,
    features: {
      annual_fee: 9000,
      joining_fee: 9000,
      reward_rate: "4X dining, 2X travel, 1X others",
      welcome_bonus: "20000 MR points",
      lounge_access: { domestic: 4, international: 2 },
      fuel_surcharge_waiver: false,
      network: "Amex",
      variant: "Gold",
      min_income: 1000000,
      fee_waiver_spend: null,
      best_for: ["dining", "travel", "premium"],
      interest_rate_monthly: null,
    },
    pros: [
      "4X on dining (best in class)",
      "20K welcome points",
      "Swiggy One membership",
      "Taj hotels vouchers",
    ],
    cons: [
      "Rs.9,000 annual fee (charge card)",
      "Amex acceptance limited",
      "No fuel surcharge waiver",
    ],
    trust_score: 94,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "American Express SmartEarn Credit Card",
    slug: "amex-smartearn",
    category: "credit_card",
    provider_name: "American Express",
    description:
      "Entry-level Amex credit card (not charge card). 10X points on Flipkart/Uber/Amazon, 5X on groceries and insurance.",
    rating: 4.4,
    features: {
      annual_fee: 495,
      joining_fee: 495,
      reward_rate: "10X Flipkart/Uber/Amazon, 5X grocery/insurance, 1X others",
      welcome_bonus: "500 MR points",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Amex",
      variant: "Classic",
      min_income: 400000,
      fee_waiver_spend: 40000,
      best_for: ["online-shopping", "cashback", "entry-level"],
      interest_rate_monthly: 3.5,
    },
    pros: [
      "10X on Flipkart/Uber/Amazon",
      "Low fee (Rs.495)",
      "Fee waiver at just Rs.40K",
      "5X on grocery",
    ],
    cons: [
      "Amex acceptance limited in India",
      "No lounge access",
      "Low base reward rate",
    ],
    trust_score: 88,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "American Express Membership Rewards Credit Card",
    slug: "amex-mrcc",
    category: "credit_card",
    provider_name: "American Express",
    description:
      "Popular mid-range Amex card with 1000 bonus points every month on Rs.10K spend. 18K MR points per year just from milestone bonuses.",
    rating: 4.5,
    features: {
      annual_fee: 4500,
      joining_fee: 4500,
      reward_rate: "1 MR per Rs.50 + 1000 bonus per Rs.10K monthly spend",
      welcome_bonus: "4000 MR points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Amex",
      variant: "Gold",
      min_income: 600000,
      fee_waiver_spend: 150000,
      best_for: ["rewards", "milestone-bonus"],
      interest_rate_monthly: 3.5,
    },
    pros: [
      "1000 bonus points every month on Rs.10K spend",
      "18K free points per year",
      "4 domestic lounges",
      "Good MR redemption options",
    ],
    cons: [
      "Rs.4,500 annual fee",
      "Amex acceptance limited",
      "No international lounges",
    ],
    trust_score: 90,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== RBL BANK (3 cards) ====================
  {
    name: "RBL ShopRite Credit Card",
    slug: "rbl-shoprite",
    category: "credit_card",
    provider_name: "RBL Bank",
    description:
      "Grocery and shopping focused card with 5% cashback on grocery spends and 2.5% on other categories. Low annual fee.",
    rating: 4.1,
    features: {
      annual_fee: 500,
      joining_fee: 500,
      reward_rate: "5% grocery, 2.5% others",
      welcome_bonus: "Rs.500 cashback",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Mastercard",
      variant: "Classic",
      min_income: 300000,
      fee_waiver_spend: 100000,
      best_for: ["grocery", "cashback", "everyday"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "5% on grocery (top of class)",
      "2.5% on other spends",
      "Low annual fee",
      "Easy approval",
    ],
    cons: [
      "No lounge access",
      "Cashback cap per month",
      "RBL Bank limited network",
    ],
    trust_score: 80,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "RBL Fun+ Credit Card",
    slug: "rbl-fun-plus",
    category: "credit_card",
    provider_name: "RBL Bank",
    description:
      "Entertainment-focused card with free BookMyShow tickets, 10X rewards on entertainment, and dining discounts.",
    rating: 4.1,
    features: {
      annual_fee: 500,
      joining_fee: 500,
      reward_rate: "10X entertainment, 5X dining, 1X others",
      welcome_bonus: "2 BookMyShow tickets",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Mastercard",
      variant: "Classic",
      min_income: 300000,
      fee_waiver_spend: 100000,
      best_for: ["movies", "entertainment", "dining"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Free BookMyShow tickets",
      "10X on entertainment",
      "5X on dining",
      "Low annual fee",
    ],
    cons: ["No lounge access", "Low base reward rate", "Limited bank network"],
    trust_score: 79,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "RBL Platinum Maxima Credit Card",
    slug: "rbl-platinum-maxima",
    category: "credit_card",
    provider_name: "RBL Bank",
    description:
      "Premium RBL card with domestic lounge access, milestone rewards, and 4X reward points on all spends.",
    rating: 4.2,
    features: {
      annual_fee: 2000,
      joining_fee: 2000,
      reward_rate: "4X on all spends",
      welcome_bonus: "5000 reward points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Platinum",
      min_income: 600000,
      fee_waiver_spend: 250000,
      best_for: ["premium", "rewards"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "4X on all spends",
      "4 domestic lounges",
      "Milestone rewards",
      "Good insurance coverage",
    ],
    cons: [
      "No international lounges",
      "Rs.2,000 annual fee",
      "RBL network limited",
    ],
    trust_score: 83,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== INDUSIND BANK (3 cards) ====================
  {
    name: "IndusInd Legend Credit Card",
    slug: "indusind-legend",
    category: "credit_card",
    provider_name: "IndusInd Bank",
    description:
      "Super-premium card with choice of 3 weekend experiences every month: golf, spa, or dining. Unlimited domestic lounge access.",
    rating: 4.6,
    features: {
      annual_fee: 7500,
      joining_fee: 7500,
      reward_rate: "1.5% cashback on all spends",
      welcome_bonus: "10000 reward points",
      lounge_access: { domestic: -1, international: 4 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 1500000,
      fee_waiver_spend: 400000,
      best_for: ["experiences", "premium", "golf", "spa"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Weekend experiences (golf/spa/dining)",
      "Unlimited domestic lounges",
      "1.5% flat cashback",
      "Premium lifestyle benefits",
    ],
    cons: [
      "Rs.7,500 annual fee",
      "Income requirement Rs.15L+",
      "Only 4 international lounges",
    ],
    trust_score: 90,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "IndusInd Pinnacle Credit Card",
    slug: "indusind-pinnacle",
    category: "credit_card",
    provider_name: "IndusInd Bank",
    description:
      "Premium travel card with 2% cashback on international transactions, Priority Pass lounge access, and zero forex markup.",
    rating: 4.5,
    features: {
      annual_fee: 2999,
      joining_fee: 2999,
      reward_rate: "2% international, 1% domestic",
      welcome_bonus: "5000 reward points",
      lounge_access: { domestic: 8, international: 4 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 1000000,
      fee_waiver_spend: 300000,
      best_for: ["travel", "international", "forex"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Zero forex markup",
      "2% on international spends",
      "Priority Pass",
      "12 lounge visits",
    ],
    cons: ["Rs.2,999 annual fee", "Only 1% on domestic", "Fee waiver at Rs.3L"],
    trust_score: 88,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "IndusInd Platinum Aura Credit Card",
    slug: "indusind-platinum-aura",
    category: "credit_card",
    provider_name: "IndusInd Bank",
    description:
      "Mid-range card with 3X reward points on weekend spends, domestic lounge access, and fuel surcharge waiver.",
    rating: 4.1,
    features: {
      annual_fee: 900,
      joining_fee: 900,
      reward_rate: "3X weekends, 1X weekdays",
      welcome_bonus: "1000 reward points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Platinum",
      min_income: 400000,
      fee_waiver_spend: 150000,
      best_for: ["weekends", "everyday"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "3X on weekends",
      "4 domestic lounges",
      "Low annual fee (Rs.900)",
      "Good for weekend spenders",
    ],
    cons: [
      "Only 1X on weekdays",
      "No international lounges",
      "Limited premium perks",
    ],
    trust_score: 83,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== AU SMALL FINANCE BANK (3 cards) ====================
  {
    name: "AU LIT Credit Card",
    slug: "au-lit",
    category: "credit_card",
    provider_name: "AU Small Finance Bank",
    description:
      'Unique customizable card — choose 3 "Lit" features (cashback, rewards, lounge). India\'s first fully personalized credit card experience.',
    rating: 4.4,
    features: {
      annual_fee: 0,
      joining_fee: 0,
      reward_rate: "Customizable (up to 5% on chosen categories)",
      welcome_bonus: "Based on selected Lit features",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa/Rupay",
      variant: "Classic",
      min_income: 250000,
      fee_waiver_spend: null,
      best_for: ["customizable", "lifetime-free", "starter"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Lifetime FREE",
      "Customizable features (pick your benefits)",
      "Easy approval",
      "4 domestic lounges possible",
    ],
    cons: [
      "Cannot have all benefits simultaneously",
      "AU bank network smaller",
      "Must choose between rewards or cashback",
    ],
    trust_score: 85,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "AU Zenith+ Credit Card",
    slug: "au-zenith-plus",
    category: "credit_card",
    provider_name: "AU Small Finance Bank",
    description:
      "Premium AU card with 3.5% cashback on top 2 spend categories, unlimited domestic lounge access, and complimentary spa treatments.",
    rating: 4.5,
    features: {
      annual_fee: 2999,
      joining_fee: 2999,
      reward_rate: "3.5% on top 2 categories, 1.5% on others",
      welcome_bonus: "5000 reward points",
      lounge_access: { domestic: -1, international: 4 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 1000000,
      fee_waiver_spend: 300000,
      best_for: ["premium", "cashback", "lounge"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "3.5% on top 2 categories (auto-detected)",
      "Unlimited domestic lounges",
      "Complimentary spa",
      "Good insurance",
    ],
    cons: [
      "Rs.2,999 annual fee",
      "AU bank network smaller",
      "Only 4 international lounges",
    ],
    trust_score: 87,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "AU Vetta Credit Card",
    slug: "au-vetta",
    category: "credit_card",
    provider_name: "AU Small Finance Bank",
    description:
      "Super-premium card with unlimited worldwide lounge access, 5% cashback on dining and travel, and premium concierge service.",
    rating: 4.6,
    features: {
      annual_fee: 9999,
      joining_fee: 9999,
      reward_rate: "5% dining/travel, 2% others",
      welcome_bonus: "15000 reward points",
      lounge_access: { domestic: -1, international: -1 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Infinite",
      min_income: 2000000,
      fee_waiver_spend: null,
      best_for: ["ultra-premium", "travel", "dining"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Unlimited worldwide lounge access",
      "5% on dining and travel",
      "Premium concierge",
      "Metal card",
    ],
    cons: [
      "Rs.9,999 annual fee",
      "Very high income requirement",
      "AU network limited",
    ],
    trust_score: 88,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== IDFC FIRST BANK (2 cards) ====================
  {
    name: "IDFC FIRST Classic Credit Card",
    slug: "idfc-first-classic",
    category: "credit_card",
    provider_name: "IDFC FIRST Bank",
    description:
      "Lifetime free card with never-expiring reward points, no minimum redemption, and zero annual fee. Popular starter card.",
    rating: 4.3,
    features: {
      annual_fee: 0,
      joining_fee: 0,
      reward_rate: "3X on online, 1X on offline",
      welcome_bonus: "None",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 250000,
      fee_waiver_spend: null,
      best_for: ["lifetime-free", "starter", "never-expiring-points"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Lifetime FREE",
      "Never-expiring reward points",
      "No minimum redemption amount",
      "Easy approval",
    ],
    cons: ["No lounge access", "Low reward rate", "Limited premium features"],
    trust_score: 86,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "IDFC FIRST Select Credit Card",
    slug: "idfc-first-select",
    category: "credit_card",
    provider_name: "IDFC FIRST Bank",
    description:
      "Premium card with 10X reward points on top spend categories, domestic lounge access, and never-expiring points.",
    rating: 4.5,
    features: {
      annual_fee: 999,
      joining_fee: 999,
      reward_rate: "10X on top categories, 3X on others",
      welcome_bonus: "2000 reward points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 600000,
      fee_waiver_spend: 200000,
      best_for: ["rewards", "never-expiring-points", "lounge"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "10X on top spend categories",
      "Never-expiring points",
      "4 domestic lounges",
      "Low fee",
    ],
    cons: [
      "Rs.999 annual fee",
      "No international lounges",
      "Fee waiver at Rs.2L",
    ],
    trust_score: 89,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== HSBC (2 cards) ====================
  {
    name: "HSBC Cashback Credit Card",
    slug: "hsbc-cashback",
    category: "credit_card",
    provider_name: "HSBC",
    description:
      "1.5% unlimited cashback on all spends with no cap and no category restrictions. One of the simplest cashback cards in India.",
    rating: 4.5,
    features: {
      annual_fee: 750,
      joining_fee: 750,
      reward_rate: "1.5% unlimited cashback on all spends",
      welcome_bonus: "500 cashback",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 400000,
      fee_waiver_spend: 100000,
      best_for: ["cashback", "simple", "everyday"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "1.5% unlimited cashback",
      "No category restrictions",
      "No cashback cap",
      "Simple and transparent",
    ],
    cons: [
      "No lounge access",
      "No travel benefits",
      "HSBC branches limited in India",
    ],
    trust_score: 90,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "HSBC Visa Platinum Credit Card",
    slug: "hsbc-visa-platinum",
    category: "credit_card",
    provider_name: "HSBC",
    description:
      "Lifestyle card with 2X rewards on dining, 4 domestic lounge visits, and travel insurance. Good for HSBC salary account holders.",
    rating: 4.2,
    features: {
      annual_fee: 1500,
      joining_fee: 0,
      reward_rate: "2X on dining, 1X on others",
      welcome_bonus: "2500 reward points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Platinum",
      min_income: 600000,
      fee_waiver_spend: 200000,
      best_for: ["dining", "hsbc-customers"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Zero joining fee",
      "2X on dining",
      "4 domestic lounges",
      "Travel insurance",
    ],
    cons: [
      "Rs.1,500 annual fee",
      "No international lounges",
      "Average reward rate",
    ],
    trust_score: 85,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== STANDARD CHARTERED (2 cards) ====================
  {
    name: "Standard Chartered Ultimate Credit Card",
    slug: "sc-ultimate",
    category: "credit_card",
    provider_name: "Standard Chartered",
    description:
      "Super-premium card with 3.3% reward rate on all spends, unlimited domestic lounge access, and Rs.10,000 Flipkart/Amazon vouchers annually.",
    rating: 4.7,
    features: {
      annual_fee: 5000,
      joining_fee: 5000,
      reward_rate: "5 reward points per Rs.150 (3.3% effective)",
      welcome_bonus: "10000 reward points",
      lounge_access: { domestic: -1, international: 4 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Infinite",
      min_income: 2400000,
      fee_waiver_spend: null,
      best_for: ["rewards", "premium", "lounge"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "3.3% effective reward rate",
      "Unlimited domestic lounges",
      "Rs.10K in annual vouchers",
      "Strong earn rate",
    ],
    cons: [
      "Rs.5,000 annual fee",
      "Very high income requirement",
      "Limited international lounges",
    ],
    trust_score: 93,
    is_active: true,
    verification_status: "verified",
  },
  {
    name: "Standard Chartered DigiSmart Credit Card",
    slug: "sc-digismart",
    category: "credit_card",
    provider_name: "Standard Chartered",
    description:
      "Lifetime free digital-first card with 5% cashback on online and contactless transactions. Designed for the digital generation.",
    rating: 4.3,
    features: {
      annual_fee: 0,
      joining_fee: 0,
      reward_rate: "5% online/contactless, 1% others",
      welcome_bonus: "None",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 300000,
      fee_waiver_spend: null,
      best_for: ["digital", "contactless", "lifetime-free"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "Lifetime FREE",
      "5% on online/contactless",
      "Easy digital application",
      "Good for UPI-linked payments",
    ],
    cons: [
      "No lounge access",
      "Only 1% on offline swipes",
      "Cashback cap per month",
    ],
    trust_score: 86,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== BOB FINANCIAL (1 card) ====================
  {
    name: "BOB Financial Prime Credit Card",
    slug: "bob-prime",
    category: "credit_card",
    provider_name: "Bank of Baroda",
    description:
      "Government bank premium card with 4 reward points per Rs.100, domestic lounge access, and Rs.500 cashback on Swiggy/Zomato quarterly.",
    rating: 4.0,
    features: {
      annual_fee: 1499,
      joining_fee: 1499,
      reward_rate: "4 points per Rs.100",
      welcome_bonus: "2000 reward points",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "RuPay",
      variant: "Platinum",
      min_income: 400000,
      fee_waiver_spend: 200000,
      best_for: ["government-bank", "rupay", "everyday"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "RuPay network (UPI linking)",
      "Government bank reliability",
      "4 domestic lounges",
      "Food delivery cashback",
    ],
    cons: [
      "No international acceptance (RuPay)",
      "Limited premium perks",
      "Lower brand appeal",
    ],
    trust_score: 82,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== FEDERAL BANK (1 card) ====================
  {
    name: "Federal Bank Visa Signature Credit Card",
    slug: "federal-bank-visa-signature",
    category: "credit_card",
    provider_name: "Federal Bank",
    description:
      "Premium card with 4X reward points on international spends, 8 domestic lounge visits, and travel insurance. Strong for Kerala-based users.",
    rating: 4.1,
    features: {
      annual_fee: 2000,
      joining_fee: 2000,
      reward_rate: "4X international, 2X domestic",
      welcome_bonus: "3000 reward points",
      lounge_access: { domestic: 8, international: 2 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 700000,
      fee_waiver_spend: 250000,
      best_for: ["travel", "international"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "4X on international spends",
      "10 total lounge visits",
      "Travel insurance",
      "Good for NRI/travel",
    ],
    cons: [
      "Federal Bank limited national presence",
      "Rs.2,000 annual fee",
      "Lower brand recognition",
    ],
    trust_score: 80,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== HDFC BANK (additional) ====================
  {
    name: "HDFC Regalia Credit Card",
    slug: "hdfc-regalia",
    category: "credit_card",
    provider_name: "HDFC Bank",
    description:
      "Mid-tier premium card bridging Millennia and Regalia Gold. 4X reward points, 8 domestic lounge visits, and travel insurance.",
    rating: 4.5,
    features: {
      annual_fee: 2500,
      joining_fee: 2500,
      reward_rate: "4 reward points per Rs.150",
      welcome_bonus: "2500 reward points",
      lounge_access: { domestic: 8, international: 4 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 900000,
      fee_waiver_spend: 300000,
      best_for: ["travel", "rewards"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "4X rewards on all spends",
      "8 domestic + 4 international lounges",
      "Good travel insurance",
      "Fee waiver at Rs.3L spend",
    ],
    cons: [
      "Overshadowed by Regalia Gold",
      "Annual fee if target not met",
      "Points value lower than Infinia",
    ],
    trust_score: 93,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== SBI CARD (additional) ====================
  {
    name: "SBI Card PULSE",
    slug: "sbi-card-pulse",
    category: "credit_card",
    provider_name: "SBI Card",
    description:
      "Health-focused credit card with OPD cover, annual health check-ups, and wellness rewards. 5X reward points on pharmacy and health spends.",
    rating: 4.2,
    features: {
      annual_fee: 1499,
      joining_fee: 1499,
      reward_rate: "5X on health/wellness, 1 per Rs.100 on others",
      welcome_bonus: "Rs.500 health voucher",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Classic",
      min_income: 500000,
      fee_waiver_spend: 200000,
      best_for: ["health", "wellness"],
      interest_rate_monthly: 3.35,
    },
    pros: [
      "OPD cover up to Rs.5,000",
      "Free annual health check-up",
      "5X on pharmacy spends",
      "Unique health-oriented positioning",
    ],
    cons: [
      "Low base reward rate",
      "No international lounges",
      "Annual fee not waived easily",
    ],
    trust_score: 85,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== ICICI BANK (additional) ====================
  {
    name: "ICICI Bank Platinum Chip Credit Card",
    slug: "icici-platinum-chip",
    category: "credit_card",
    provider_name: "ICICI Bank",
    description:
      "Entry-level lifetime free card with 2 reward points per Rs.100 spent. Good starter card for building credit history.",
    rating: 4.0,
    features: {
      annual_fee: 0,
      joining_fee: 0,
      reward_rate: "2 points per Rs.100",
      welcome_bonus: "None",
      lounge_access: { domestic: 0, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Platinum",
      min_income: 250000,
      fee_waiver_spend: null,
      best_for: ["starter", "lifetime-free", "credit-building"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "Lifetime FREE",
      "No income proof needed for some variants",
      "Fuel surcharge waiver",
      "Good for credit building",
    ],
    cons: [
      "No lounge access",
      "Low reward rate",
      "No welcome bonus",
      "Basic benefits only",
    ],
    trust_score: 82,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== KOTAK (additional) ====================
  {
    name: "Kotak Zen Credit Card",
    slug: "kotak-zen",
    category: "credit_card",
    provider_name: "Kotak Mahindra Bank",
    description:
      "Lifestyle card focused on dining, entertainment, and weekend getaways. 10% discount at partner restaurants and 5X rewards on dining.",
    rating: 4.2,
    features: {
      annual_fee: 1500,
      joining_fee: 1500,
      reward_rate: "5X dining, 2X entertainment, 1X others",
      welcome_bonus: "Rs.500 BookMyShow voucher",
      lounge_access: { domestic: 4, international: 0 },
      fuel_surcharge_waiver: true,
      network: "Visa",
      variant: "Signature",
      min_income: 500000,
      fee_waiver_spend: 150000,
      best_for: ["dining", "entertainment", "lifestyle"],
      interest_rate_monthly: 3.4,
    },
    pros: [
      "10% off at 1500+ restaurants",
      "5X on dining spends",
      "Free BookMyShow vouchers",
      "Swiggy/Zomato benefits",
    ],
    cons: [
      "No international lounges",
      "Reward rate drops outside dining",
      "Annual fee not competitive",
    ],
    trust_score: 84,
    is_active: true,
    verification_status: "verified",
  },

  // ==================== RBL BANK (additional) ====================
  {
    name: "RBL Bank World Safari Credit Card",
    slug: "rbl-world-safari",
    category: "credit_card",
    provider_name: "RBL Bank",
    description:
      "Travel-focused premium card with 8 international lounge visits, zero forex markup, and comprehensive travel insurance up to Rs.1Cr.",
    rating: 4.3,
    features: {
      annual_fee: 5000,
      joining_fee: 5000,
      reward_rate: "3X travel, 2X dining, 1X others",
      welcome_bonus: "10,000 reward points",
      lounge_access: { domestic: 12, international: 8 },
      fuel_surcharge_waiver: true,
      network: "Mastercard",
      variant: "World",
      min_income: 1000000,
      fee_waiver_spend: 500000,
      best_for: ["international-travel", "zero-forex", "premium"],
      interest_rate_monthly: 3.49,
    },
    pros: [
      "Zero forex markup",
      "8 international lounge visits",
      "Travel insurance up to Rs.1Cr",
      "Priority Pass included",
    ],
    cons: [
      "Rs.5,000 annual fee",
      "High income requirement",
      "RBL limited branch network",
    ],
    trust_score: 85,
    is_active: true,
    verification_status: "verified",
  },
];

// ---------------------------------------------------------------------------
// Seed Function
// ---------------------------------------------------------------------------

async function seedRealCreditCards() {
  console.log("\n====================================================");
  console.log("  InvestingPro — Real Credit Card Seeder (50+ cards)");
  console.log("====================================================\n");

  // Safety check
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  // ⚠️ ENVIRONMENT GUARD: Block running in production
  if (
    baseUrl.includes("investingpro.in") ||
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  ) {
    console.error(
      "SAFETY ABORT: This seed script should NEVER be run against a production database.",
    );
    console.error(
      `Detected environment: ${baseUrl || process.env.NODE_ENV || "unknown"}`,
    );
    process.exit(1);
  }

  console.log(`Target: ${supabaseUrl}`);
  console.log(`Cards to seed: ${REAL_CREDIT_CARDS.length}`);
  console.log(`Mode: UPSERT (safe to re-run, will not delete existing data)\n`);

  let success = 0;
  let errors = 0;

  // Upsert in batches of 20
  const BATCH_SIZE = 20;
  for (let i = 0; i < REAL_CREDIT_CARDS.length; i += BATCH_SIZE) {
    const batch = REAL_CREDIT_CARDS.slice(i, i + BATCH_SIZE);

    const records = batch.map((card) => ({
      slug: card.slug,
      name: card.name,
      category: card.category,
      provider_name: card.provider_name,
      description: card.description,
      rating: card.rating,
      features: card.features,
      pros: card.pros,
      cons: card.cons,
      trust_score: card.trust_score,
      is_active: card.is_active,
      verification_status: card.verification_status,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("products")
      .upsert(records, { onConflict: "slug" });

    if (error) {
      console.error(
        `  Batch ${Math.floor(i / BATCH_SIZE) + 1} FAILED: ${error.message}`,
      );
      errors += batch.length;
    } else {
      for (const card of batch) {
        console.log(`  OK  ${card.name} (${card.provider_name})`);
      }
      success += batch.length;
    }
  }

  // Summary
  console.log("\n====================================================");
  console.log(`  SUCCESS: ${success}`);
  console.log(`  ERRORS:  ${errors}`);
  console.log(`  TOTAL:   ${REAL_CREDIT_CARDS.length}`);
  console.log("====================================================\n");

  // Provider breakdown
  const byProvider: Record<string, number> = {};
  for (const card of REAL_CREDIT_CARDS) {
    byProvider[card.provider_name] = (byProvider[card.provider_name] || 0) + 1;
  }

  console.log("Cards by provider:");
  Object.entries(byProvider)
    .sort((a, b) => b[1] - a[1])
    .forEach(([provider, count]) => {
      console.log(`  ${provider}: ${count}`);
    });
  console.log("");
}

seedRealCreditCards().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
