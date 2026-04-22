"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Landmark,
  TrendingUp,
  Shield,
  PiggyBank,
  Receipt,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// "Find Your Fit" — INSTANT VALUE interface.
// Default state shows the 3 best cashback credit cards immediately.
// Chips at the top let users refine (category + intent) with single-click swaps.
//
// Why this beats a 3-step wizard:
//  - Zero clicks to see editorial recommendations
//  - 1 click to refine by intent, 1 click to switch category
//  - Matches NerdWallet pattern: show content, filters refine
//  - Asking 2 questions before showing value kills retention

type Category = "cards" | "loans" | "mf" | "insurance" | "fd" | "tax";

interface CategoryDef {
  key: Category;
  label: string;
  icon: LucideIcon;
  intents: { id: string; label: string }[];
}

interface Pick {
  title: string;
  badge: string;
  oneLiner: string;
  cta: string;
  href: string;
}

const CATEGORIES: CategoryDef[] = [
  {
    key: "cards",
    label: "Credit Cards",
    icon: CreditCard,
    intents: [
      { id: "cashback", label: "Cashback" },
      { id: "travel", label: "Travel" },
      { id: "nofee", label: "No annual fee" },
    ],
  },
  {
    key: "loans",
    label: "Loans",
    icon: Landmark,
    intents: [
      { id: "home", label: "Home loan" },
      { id: "personal", label: "Personal" },
      { id: "car", label: "Car" },
    ],
  },
  {
    key: "mf",
    label: "Mutual Funds",
    icon: TrendingUp,
    intents: [
      { id: "safe", label: "Safe (3–5 yr)" },
      { id: "balanced", label: "Balanced (5–10 yr)" },
      { id: "aggressive", label: "Aggressive (10+ yr)" },
    ],
  },
  {
    key: "insurance",
    label: "Insurance",
    icon: Shield,
    intents: [
      { id: "life", label: "Term life" },
      { id: "health", label: "Health" },
      { id: "car", label: "Car" },
    ],
  },
  {
    key: "fd",
    label: "Fixed Deposits",
    icon: PiggyBank,
    intents: [
      { id: "short", label: "< 1 year" },
      { id: "medium", label: "1–3 years" },
      { id: "long", label: "Tax-saving (5 yr)" },
    ],
  },
  {
    key: "tax",
    label: "Tax Planning",
    icon: Receipt,
    intents: [
      { id: "regime", label: "Old vs New" },
      { id: "80c", label: "80C optimiser" },
      { id: "hra", label: "HRA" },
    ],
  },
];

const PICKS: Record<string, Pick[]> = {
  "cards-cashback": [
    { title: "Amazon Pay ICICI", badge: "Best overall · 91/100", oneLiner: "5% on Amazon, 2% everywhere. Lifetime free.", cta: "See details →", href: "/credit-cards/amazon-pay-icici-credit-card" },
    { title: "SBI Cashback Card", badge: "Best for online · 88/100", oneLiner: "5% cashback on all online spending, ₹999 fee.", cta: "See details →", href: "/credit-cards/sbi-cashback-credit-card" },
    { title: "HDFC Millennia", badge: "Best for young spenders · 72/100", oneLiner: "5% on Amazon, Flipkart, Swiggy, Zomato.", cta: "See details →", href: "/credit-cards/hdfc-millennia" },
  ],
  "cards-travel": [
    { title: "HDFC Infinia", badge: "Premium travel · 98/100", oneLiner: "Unlimited lounges, 3.3% return on SmartBuy.", cta: "See details →", href: "/credit-cards/hdfc-infinia-credit-card" },
    { title: "Amex Platinum Travel", badge: "Best miles · 92/100", oneLiner: "Lounge access + travel vouchers on milestones.", cta: "See details →", href: "/credit-cards/amex-platinum-travel" },
    { title: "Axis Magnus", badge: "Best reward rate · 89/100", oneLiner: "High reward rate on travel partners via Edge.", cta: "See details →", href: "/credit-cards/axis-magnus" },
  ],
  "cards-nofee": [
    { title: "Amazon Pay ICICI", badge: "Lifetime free · 91/100", oneLiner: "Zero annual fee. Ever. Solid 2–5% rewards.", cta: "See details →", href: "/credit-cards/amazon-pay-icici-credit-card" },
    { title: "Axis Ace", badge: "No fee · 84/100", oneLiner: "5% on Google Pay bills, 2% on Swiggy/Ola.", cta: "See details →", href: "/credit-cards/axis-ace" },
    { title: "IDFC First Wealth", badge: "No fee premium · 81/100", oneLiner: "Free for life with lounge access.", cta: "See details →", href: "/credit-cards/idfc-first-wealth" },
  ],
  "loans-home": [
    { title: "SBI Home Loan", badge: "Cheapest at 8.35%", oneLiner: "Lowest among PSU banks, 20-yr tenure.", cta: "Compare rates →", href: "/loans?type=home" },
    { title: "HDFC Home Loan", badge: "Fast processing", oneLiner: "Digital flow, 8.70% p.a., salaried priority.", cta: "Compare rates →", href: "/loans?type=home" },
    { title: "Home Loan EMI Calculator", badge: "Tool", oneLiner: "EMI + total interest + prepayment savings.", cta: "Run the numbers →", href: "/calculators/home-loan-emi" },
  ],
  "loans-personal": [
    { title: "HDFC Personal Loan", badge: "Lowest at 10.49%", oneLiner: "No collateral, 4-yr max, salaried-friendly.", cta: "Compare →", href: "/loans?type=personal" },
    { title: "Bajaj Finserv", badge: "Fastest disbursal", oneLiner: "Same-day for existing customers.", cta: "Compare →", href: "/loans?type=personal" },
    { title: "EMI Calculator", badge: "Tool", oneLiner: "Stress-test EMIs before you borrow.", cta: "Run the numbers →", href: "/calculators/emi" },
  ],
  "loans-car": [
    { title: "Bank of Baroda Car Loan", badge: "Cheapest at 8.70%", oneLiner: "New car, 7-yr tenure, zero processing fee.", cta: "Compare →", href: "/loans?type=car" },
    { title: "SBI Car Loan", badge: "Priority for salaried", oneLiner: "8.85%, up to 85% on-road funding.", cta: "Compare →", href: "/loans?type=car" },
    { title: "Car Loan EMI Calculator", badge: "Tool", oneLiner: "EMI + interest + down-payment scenarios.", cta: "Run the numbers →", href: "/calculators/car-loan-emi" },
  ],
  "mf-safe": [
    { title: "Short-term debt funds", badge: "6–7% · Low risk", oneLiner: "Better than FD for 1–3 year goals.", cta: "Top funds →", href: "/mutual-funds?type=debt" },
    { title: "Corporate bond funds", badge: "7–8% · Low-med risk", oneLiner: "Slightly higher returns with modest risk.", cta: "Top funds →", href: "/mutual-funds?type=debt" },
    { title: "FD vs Debt Fund guide", badge: "Read", oneLiner: "Which wins after tax for your bracket?", cta: "Read article →", href: "/articles/fd-vs-debt-fund-comparison" },
  ],
  "mf-balanced": [
    { title: "Nifty 50 Index Fund", badge: "10–12% · Low cost", oneLiner: "The default equity allocation for most Indians.", cta: "Top funds →", href: "/mutual-funds?type=index" },
    { title: "Flexi-cap funds", badge: "11–14% · Balanced", oneLiner: "Active managers across large/mid/small.", cta: "Top funds →", href: "/mutual-funds?type=equity" },
    { title: "SIP Calculator", badge: "Tool", oneLiner: "Compute 10-year SIP corpus with step-up.", cta: "Run the numbers →", href: "/calculators/sip" },
  ],
  "mf-aggressive": [
    { title: "Small-cap equity funds", badge: "13–16% · High risk", oneLiner: "For 10+ year horizons only. Stomach required.", cta: "Top funds →", href: "/mutual-funds?type=equity" },
    { title: "Mid-cap funds", badge: "12–15% · Med-high risk", oneLiner: "Better risk-adjusted than small-cap.", cta: "Top funds →", href: "/mutual-funds?type=equity" },
    { title: "ELSS (tax-saving equity)", badge: "Bonus: 80C", oneLiner: "3-yr lock-in, ₹46,800 tax saved at 30% slab.", cta: "Top funds →", href: "/mutual-funds?type=elss" },
  ],
  "insurance-life": [
    { title: "HDFC Life Click 2 Protect", badge: "Claim ratio · 98.6%", oneLiner: "Pure term, ₹1 Cr cover ~₹700/mo at 30.", cta: "Compare terms →", href: "/insurance?type=term" },
    { title: "Max Life Smart Secure Plus", badge: "Strong CSR · 99.3%", oneLiner: "Smart add-ons for critical illness.", cta: "Compare terms →", href: "/insurance?type=term" },
    { title: "Term Cover Calculator", badge: "Tool", oneLiner: "How much cover do you actually need?", cta: "Find out →", href: "/calculators/term-cover" },
  ],
  "insurance-health": [
    { title: "HDFC ERGO Optima Secure", badge: "Top rated · 95/100", oneLiner: "No-claim doubling + restore built-in.", cta: "Compare →", href: "/insurance?type=health" },
    { title: "Niva Bupa ReAssure", badge: "Best restore feature", oneLiner: "Unlimited automatic refills after claim.", cta: "Compare →", href: "/insurance?type=health" },
    { title: "Health Cover Calculator", badge: "Tool", oneLiner: "How much cover do you need in India?", cta: "Find out →", href: "/calculators/health-cover" },
  ],
  "insurance-car": [
    { title: "ICICI Lombard Car Insurance", badge: "Fastest settlement", oneLiner: "Cashless at 4,400+ network garages.", cta: "Compare →", href: "/insurance?type=car" },
    { title: "Tata AIG Auto Secure", badge: "Best add-ons", oneLiner: "Zero-dep + engine protect + consumables.", cta: "Compare →", href: "/insurance?type=car" },
    { title: "Car IDV Calculator", badge: "Tool", oneLiner: "What's your car's insured declared value?", cta: "Find out →", href: "/calculators/car-idv" },
  ],
  "fd-short": [
    { title: "Savings Account", badge: "7.25% AU SFB · Liquid", oneLiner: "Actually better than short FDs below 1 year.", cta: "Compare →", href: "/banking?sort=rate" },
    { title: "Liquid Funds", badge: "~7% · No lock-in", oneLiner: "More tax-efficient than short FD for emergencies.", cta: "Top funds →", href: "/mutual-funds?type=liquid" },
    { title: "Emergency Fund Guide", badge: "Read", oneLiner: "Where to park 6 months of expenses.", cta: "Read →", href: "/articles/emergency-fund-guide" },
  ],
  "fd-medium": [
    { title: "Shriram Finance FD", badge: "9.10% · 1-year top rate", oneLiner: "AAA-rated NBFC, ₹5L DICGC insurance.", cta: "Compare FDs →", href: "/fixed-deposits?sort=rate" },
    { title: "Unity Small Finance Bank", badge: "8.60% · 2-year", oneLiner: "Small finance bank, RBI regulated.", cta: "Compare FDs →", href: "/fixed-deposits?sort=rate" },
    { title: "FD Ladder Calculator", badge: "Tool", oneLiner: "Stagger FDs for liquidity + rate advantage.", cta: "Run the numbers →", href: "/calculators/fd-ladder" },
  ],
  "fd-long": [
    { title: "Tax-saving 5-yr FD (SBI)", badge: "7.25% · 80C", oneLiner: "Lock 5 yrs, deduct up to ₹1.5L.", cta: "Compare →", href: "/fixed-deposits?filter=tax-saving" },
    { title: "Tax-saving FD (ICICI)", badge: "7.20% · 80C", oneLiner: "Standard terms, easy to operate.", cta: "Compare →", href: "/fixed-deposits?filter=tax-saving" },
    { title: "Tax-saving FD vs ELSS", badge: "Read", oneLiner: "Which ₹1.5L instrument wins after tax?", cta: "Read →", href: "/articles/tax-saving-fd-vs-elss" },
  ],
  "tax-regime": [
    { title: "Old vs New Regime Calculator", badge: "Tool · 60-sec answer", oneLiner: "Enter salary → see which saves more tax.", cta: "Run the numbers →", href: "/calculators/old-vs-new-tax" },
    { title: "FY 2026 Tax Changes", badge: "Read", oneLiner: "Budget 2026 changes that affect your choice.", cta: "Read →", href: "/articles/budget-2026-tax-changes" },
    { title: "Tax Slab Lookup", badge: "Reference", oneLiner: "All brackets side-by-side, FY26.", cta: "View slabs →", href: "/articles/income-tax-slabs-fy-2025-26" },
  ],
  "tax-80c": [
    { title: "80C Optimiser", badge: "Tool", oneLiner: "Allocate ₹1.5L across instruments for max saving.", cta: "Optimise →", href: "/calculators/80c" },
    { title: "ELSS funds", badge: "Top-pick instrument", oneLiner: "Shortest lock-in (3yr) + equity growth.", cta: "Top funds →", href: "/mutual-funds?type=elss" },
    { title: "Complete 80C Guide", badge: "Read", oneLiner: "Every 80C instrument ranked by post-tax return.", cta: "Read →", href: "/articles/section-80c-complete-guide" },
  ],
  "tax-hra": [
    { title: "HRA Exemption Calculator", badge: "Tool", oneLiner: "Compute exempt portion from rent + salary.", cta: "Run the numbers →", href: "/calculators/hra" },
    { title: "HRA Claim Checklist", badge: "Read", oneLiner: "Documents, PAN rule, common mistakes.", cta: "Read →", href: "/articles/hra-exemption-complete-guide" },
    { title: "Tax Calculator", badge: "Tool", oneLiner: "Full annual tax with all exemptions.", cta: "Run the numbers →", href: "/calculators/tax" },
  ],
};

export default function FindYourFit() {
  // Default state: Credit Cards → Cashback (most common intent)
  // Users see 3 real picks with zero clicks
  const [catKey, setCatKey] = useState<Category>("cards");
  const [intentId, setIntentId] = useState<string>("cashback");

  const activeCat = CATEGORIES.find((c) => c.key === catKey)!;
  const picks = PICKS[`${catKey}-${intentId}`] || [];

  function switchCategory(c: Category) {
    const cat = CATEGORIES.find((x) => x.key === c)!;
    setCatKey(c);
    // Reset intent to first option of new category (valid default)
    setIntentId(cat.intents[0].id);
  }

  return (
    <section className="py-16 md:py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-8">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
            Editor&apos;s Picks · Updated weekly
          </div>
          <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink">
            What we&apos;d tell{" "}
            <em className="italic text-indian-gold">a friend.</em>
          </h2>
          <p className="text-sm text-ink-60 mt-3 leading-relaxed">
            Our three picks — no paid placement, no browsing 80 products.
            Switch category or intent, picks update instantly.
          </p>
        </div>

        {/* CATEGORY CHIP ROW — always visible, horizontal scroll on mobile */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = catKey === c.key;
            return (
              <button
                key={c.key}
                onClick={() => switchCategory(c.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm border-2 transition-all ${
                  active
                    ? "border-ink bg-ink text-canvas"
                    : "border-ink/10 bg-white text-ink hover:border-ink/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-[13px]">{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* INTENT CHIP ROW — category-specific */}
        <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-ink/10">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-60 self-center mr-2">
            Filter:
          </span>
          {activeCat.intents.map((opt) => {
            const active = intentId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setIntentId(opt.id)}
                className={`px-3 py-1.5 rounded-sm border transition-all font-mono text-[11px] uppercase tracking-wider ${
                  active
                    ? "border-indian-gold bg-indian-gold/10 text-indian-gold"
                    : "border-ink/15 bg-white text-ink-60 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* PICKS — render instantly, no clicks required */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {picks.map((p, i) => (
            <Link
              key={`${catKey}-${intentId}-${i}`}
              href={p.href}
              className="group bg-white border-2 border-ink/10 rounded-sm p-6 hover:border-ink/30 transition-colors flex flex-col"
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-3">
                #{i + 1} · {p.badge}
              </div>
              <h4 className="font-display font-bold text-xl text-ink mb-2 leading-snug group-hover:text-authority-green transition-colors">
                {p.title}
              </h4>
              <p className="text-[13px] text-ink-60 leading-relaxed mb-4 flex-1">
                {p.oneLiner}
              </p>
              <div className="font-mono text-[11px] uppercase tracking-wider text-action-green flex items-center gap-1 group-hover:gap-2 transition-all">
                {p.cta}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-ink-60">
            Rankings based on our 6-criteria methodology.
          </p>
          <Link
            href="/about/methodology"
            className="font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline whitespace-nowrap"
          >
            How we rate &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
