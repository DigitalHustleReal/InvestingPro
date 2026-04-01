/**
 * Card vs Card Comparator — seed data + pair generation
 * Dynamic comparison pages at /credit-cards/vs/[cardA-slug]-vs-[cardB-slug]
 * Each page targets "X vs Y credit card" search queries — high purchase intent.
 */

export interface CardSeedData {
  slug: string;
  name: string;
  issuer: string;
  network: string;
  annualFee: number;
  joiningFee: number;
  annualFeeWaiver: string;
  rewardRate: string;
  welcomeOffer: string;
  loungeAccess: string;
  fuelSurcharge: boolean;
  category: string[];
  minCibilScore: number;
  minIncome: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  rating: number; // /5
  applyLink: string;
}

/** Popular cards seed — used when Supabase unavailable or for static generation */
export const CARD_SEED: CardSeedData[] = [
  {
    slug: 'hdfc-millennia',
    name: 'HDFC Millennia Credit Card',
    issuer: 'HDFC Bank',
    network: 'Visa',
    annualFee: 1000,
    joiningFee: 1000,
    annualFeeWaiver: 'Spend ₹1L in a year',
    rewardRate: '5% cashback on Amazon, Flipkart, Myntra; 1% everywhere',
    welcomeOffer: '1,000 bonus CashPoints on first transaction',
    loungeAccess: '8 complimentary domestic + 2 international per year',
    fuelSurcharge: true,
    category: ['cashback', 'online-shopping'],
    minCibilScore: 720,
    minIncome: '₹35,000/month',
    bestFor: 'Online shoppers who buy on Amazon/Flipkart/Myntra',
    pros: ['5% on top e-commerce', 'Lounge access at ₹1K fee', 'Fee easily waived'],
    cons: ['Low reward on offline spends', 'Max cashback cap per quarter'],
    rating: 4.3,
    applyLink: '/apply/hdfc-millennia',
  },
  {
    slug: 'sbi-simplyclick',
    name: 'SBI SimplyCLICK Credit Card',
    issuer: 'SBI Card',
    network: 'Visa',
    annualFee: 499,
    joiningFee: 499,
    annualFeeWaiver: 'Spend ₹1L in a year',
    rewardRate: '10X points on Amazon, BookMyShow, Cleartrip; 5X on other online; 1X offline',
    welcomeOffer: 'Amazon voucher worth ₹500',
    loungeAccess: 'None',
    fuelSurcharge: true,
    category: ['cashback', 'online-shopping', 'travel'],
    minCibilScore: 700,
    minIncome: '₹20,000/month',
    bestFor: 'Budget-conscious online shoppers and occasional travellers',
    pros: ['10X on Amazon', 'Low annual fee', 'Good for Cleartrip travel'],
    cons: ['No lounge access', 'Lower reward on offline spends'],
    rating: 4.1,
    applyLink: '/apply/sbi-simplyclick',
  },
  {
    slug: 'amazon-pay-icici',
    name: 'Amazon Pay ICICI Bank Credit Card',
    issuer: 'ICICI Bank',
    network: 'Visa',
    annualFee: 0,
    joiningFee: 0,
    annualFeeWaiver: 'Lifetime free — no conditions',
    rewardRate: '5% on Amazon (Prime), 3% on Amazon (non-Prime), 2% on partner merchants, 1% elsewhere',
    welcomeOffer: '₹400 Amazon Pay cashback on first transaction',
    loungeAccess: 'None',
    fuelSurcharge: true,
    category: ['cashback', 'lifetime-free', 'online-shopping'],
    minCibilScore: 700,
    minIncome: '₹25,000/month',
    bestFor: 'Amazon Prime members who want zero-fee card',
    pros: ['Lifetime free', '5% on Amazon no cap', 'Instant approval for Prime members'],
    cons: ['Low reward outside Amazon', 'No lounge access', 'ICICI customer preferred'],
    rating: 4.5,
    applyLink: '/apply/amazon-pay-icici',
  },
  {
    slug: 'axis-magnus',
    name: 'Axis Bank Magnus Credit Card',
    issuer: 'Axis Bank',
    network: 'Mastercard',
    annualFee: 12500,
    joiningFee: 12500,
    annualFeeWaiver: 'Spend ₹15L in a year',
    rewardRate: '12 EDGE Miles per ₹200; 2X on travel, dining, overseas',
    welcomeOffer: '25,000 EDGE Miles on first transaction + 10,000 miles on ₹50K spend in 30 days',
    loungeAccess: 'Unlimited domestic + 12 international (DragonPass) per year',
    fuelSurcharge: false,
    category: ['travel', 'premium', 'lounge-access'],
    minCibilScore: 750,
    minIncome: '₹1,80,000/month',
    bestFor: 'Frequent international travellers spending ₹8L+ per year',
    pros: ['Best travel miles card in India', 'Unlimited domestic lounge', '12 intl lounges/yr'],
    cons: ['Very high fee', 'Only worthwhile at ₹8L+ annual spend', 'Miles expire'],
    rating: 4.6,
    applyLink: '/apply/axis-magnus',
  },
  {
    slug: 'hdfc-infinia',
    name: 'HDFC Bank Infinia Credit Card',
    issuer: 'HDFC Bank',
    network: 'Visa Infinite',
    annualFee: 12500,
    joiningFee: 12500,
    annualFeeWaiver: 'Spend ₹10L in a year',
    rewardRate: '5 reward points per ₹150; 10X on SmartBuy portal',
    welcomeOffer: '10,000 reward points on fee payment',
    loungeAccess: 'Unlimited domestic + unlimited international (Priority Pass)',
    fuelSurcharge: false,
    category: ['premium', 'travel', 'lounge-access'],
    minCibilScore: 760,
    minIncome: 'By invitation / select clients',
    bestFor: 'Ultra-premium users who want unlimited lounge access worldwide',
    pros: ['Unlimited Priority Pass lounges', '10X on SmartBuy', 'Best concierge service'],
    cons: ['Invitation-only for new applicants', 'Very high fee', 'Points complex to redeem'],
    rating: 4.7,
    applyLink: '/apply/hdfc-infinia',
  },
  {
    slug: 'sbi-cashback',
    name: 'SBI Cashback Credit Card',
    issuer: 'SBI Card',
    network: 'Visa',
    annualFee: 999,
    joiningFee: 999,
    annualFeeWaiver: 'Spend ₹2L in a year',
    rewardRate: '5% cashback on all online transactions; 1% offline',
    welcomeOffer: 'None',
    loungeAccess: 'None',
    fuelSurcharge: true,
    category: ['cashback', 'online-shopping'],
    minCibilScore: 720,
    minIncome: '₹30,000/month',
    bestFor: 'All-round online shoppers — 5% flat, no merchant restrictions',
    pros: ['5% on ALL online — no merchant restriction', 'Simple cashback, no points', 'Good for subscriptions'],
    cons: ['No lounge access', 'High interest on revolving balance', 'Max cashback cap'],
    rating: 4.4,
    applyLink: '/apply/sbi-cashback',
  },
  {
    slug: 'icici-amazon-pay',
    name: 'ICICI Bank Amazon Pay Credit Card',
    issuer: 'ICICI Bank',
    network: 'Visa',
    annualFee: 0,
    joiningFee: 0,
    annualFeeWaiver: 'Lifetime free',
    rewardRate: '5% on Amazon (Prime); 3% (non-Prime); 2% on partner brands; 1% elsewhere',
    welcomeOffer: '₹400 cashback on activation',
    loungeAccess: 'None',
    fuelSurcharge: true,
    category: ['cashback', 'lifetime-free'],
    minCibilScore: 700,
    minIncome: '₹25,000/month',
    bestFor: 'Amazon Prime members seeking zero-fee everyday card',
    pros: ['Zero annual fee forever', 'Instant cashback to Amazon Pay wallet', 'Easy approval'],
    cons: ['Only useful for Amazon heavy users', 'No travel benefits'],
    rating: 4.5,
    applyLink: '/apply/icici-amazon-pay',
  },
  {
    slug: 'tata-neu-infinity-hdfc',
    name: 'Tata Neu Infinity HDFC Bank Credit Card',
    issuer: 'HDFC Bank',
    network: 'Rupay',
    annualFee: 1499,
    joiningFee: 1499,
    annualFeeWaiver: 'Spend ₹3L in a year',
    rewardRate: '5% NeuCoins on Tata brands; 1.5% on others; UPI rewards on RuPay',
    welcomeOffer: '1,499 NeuCoins on card activation',
    loungeAccess: '4 domestic per year',
    fuelSurcharge: true,
    category: ['cashback', 'tata-brands'],
    minCibilScore: 720,
    minIncome: '₹35,000/month',
    bestFor: 'Tata brand loyalists (BigBasket, Croma, Air India, Westside)',
    pros: ['5% on Tata ecosystem', 'RuPay = UPI rewards', 'Lounge access at mid-fee'],
    cons: ['Rewards only on Tata brands', 'NeuCoins limited to Tata redemption'],
    rating: 4.0,
    applyLink: '/apply/tata-neu-infinity-hdfc',
  },
];

/** Popular card vs card pairs — generates high-intent comparison pages */
export const POPULAR_PAIRS: Array<[string, string]> = [
  ['hdfc-millennia', 'sbi-simplyclick'],
  ['hdfc-millennia', 'sbi-cashback'],
  ['hdfc-millennia', 'amazon-pay-icici'],
  ['sbi-cashback', 'amazon-pay-icici'],
  ['sbi-cashback', 'sbi-simplyclick'],
  ['axis-magnus', 'hdfc-infinia'],
  ['axis-magnus', 'sbi-cashback'],
  ['hdfc-infinia', 'sbi-cashback'],
  ['amazon-pay-icici', 'tata-neu-infinity-hdfc'],
  ['hdfc-millennia', 'tata-neu-infinity-hdfc'],
  ['sbi-simplyclick', 'amazon-pay-icici'],
  ['axis-magnus', 'hdfc-millennia'],
];

export function parsePairSlug(pair: string): [string, string] | null {
  const idx = pair.indexOf('-vs-');
  if (idx === -1) return null;
  return [pair.slice(0, idx), pair.slice(idx + 4)];
}

export function buildPairSlug(a: string, b: string): string {
  return `${a}-vs-${b}`;
}

export function getCardBySlug(slug: string): CardSeedData | undefined {
  return CARD_SEED.find(c => c.slug === slug);
}

export interface ComparisonDimension {
  label: string;
  keyA: (c: CardSeedData) => string | number | boolean;
  keyB?: never;
  winner: (a: CardSeedData, b: CardSeedData) => 'a' | 'b' | 'tie';
  format?: (v: string | number | boolean) => string;
  higherIsBetter?: boolean;
}

export const COMPARISON_DIMENSIONS: ComparisonDimension[] = [
  {
    label: 'Annual Fee',
    keyA: c => c.annualFee,
    winner: (a, b) => a.annualFee < b.annualFee ? 'a' : b.annualFee < a.annualFee ? 'b' : 'tie',
    format: v => v === 0 ? 'Lifetime Free' : `₹${Number(v).toLocaleString('en-IN')}/year`,
  },
  {
    label: 'Fee Waiver',
    keyA: c => c.annualFeeWaiver,
    winner: () => 'tie',
  },
  {
    label: 'Reward Rate',
    keyA: c => c.rewardRate,
    winner: () => 'tie',
  },
  {
    label: 'Lounge Access',
    keyA: c => c.loungeAccess,
    winner: (a, b) => {
      if (a.loungeAccess === 'None' && b.loungeAccess !== 'None') return 'b';
      if (b.loungeAccess === 'None' && a.loungeAccess !== 'None') return 'a';
      return 'tie';
    },
  },
  {
    label: 'Fuel Surcharge Waiver',
    keyA: c => c.fuelSurcharge ? 'Yes' : 'No',
    winner: (a, b) => a.fuelSurcharge && !b.fuelSurcharge ? 'a' : !a.fuelSurcharge && b.fuelSurcharge ? 'b' : 'tie',
  },
  {
    label: 'Min CIBIL Score',
    keyA: c => c.minCibilScore,
    winner: (a, b) => a.minCibilScore < b.minCibilScore ? 'a' : b.minCibilScore < a.minCibilScore ? 'b' : 'tie',
    format: v => String(v),
  },
  {
    label: 'Min Income',
    keyA: c => c.minIncome,
    winner: () => 'tie',
  },
  {
    label: 'Rating',
    keyA: c => c.rating,
    winner: (a, b) => a.rating > b.rating ? 'a' : b.rating > a.rating ? 'b' : 'tie',
    format: v => `${v}/5`,
    higherIsBetter: true,
  },
];
