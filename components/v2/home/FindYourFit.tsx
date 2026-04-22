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
  ArrowRight,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// "Find Your Fit" — 3-step interactive wizard.
// Step 1: What are you looking for? (category)
// Step 2: Your situation (1 question, category-specific)
// Step 3: Top 3 personalised picks + direct CTAs
//
// Engagement-first design: interaction > vanity stats. Matches brainstorm
// tone "We'll tell you what to pick, not just list 80 options."
// All logic client-side, deterministic lookup — no DB round-trips.

type Category = "cards" | "loans" | "mf" | "insurance" | "fd" | "tax";

interface CategoryDef {
  key: Category;
  label: string;
  tagline: string;
  icon: LucideIcon;
  q2: { prompt: string; options: { id: string; label: string }[] };
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
    label: "Credit Card",
    tagline: "Rewards, cashback, or travel",
    icon: CreditCard,
    q2: {
      prompt: "What matters most to you?",
      options: [
        { id: "cashback", label: "Flat cashback on all spending" },
        { id: "travel", label: "Travel miles & lounge access" },
        { id: "nofee", label: "No annual fee, forever" },
      ],
    },
  },
  {
    key: "loans",
    label: "Loan",
    tagline: "Home, personal, car, gold",
    icon: Landmark,
    q2: {
      prompt: "What are you borrowing for?",
      options: [
        { id: "home", label: "Buying / renovating a home" },
        { id: "personal", label: "Personal expense (medical, wedding)" },
        { id: "car", label: "New car purchase" },
      ],
    },
  },
  {
    key: "mf",
    label: "Mutual Fund",
    tagline: "SIP, equity, debt, ELSS",
    icon: TrendingUp,
    q2: {
      prompt: "Your investing style is…",
      options: [
        { id: "safe", label: "Safe & steady (3-5 yr horizon)" },
        { id: "balanced", label: "Balanced (5-10 yr horizon)" },
        { id: "aggressive", label: "Aggressive (10+ yr horizon)" },
      ],
    },
  },
  {
    key: "insurance",
    label: "Insurance",
    tagline: "Term, health, car",
    icon: Shield,
    q2: {
      prompt: "What do you need to protect?",
      options: [
        { id: "life", label: "My family (term life)" },
        { id: "health", label: "Hospital bills (health)" },
        { id: "car", label: "My car" },
      ],
    },
  },
  {
    key: "fd",
    label: "Fixed Deposit",
    tagline: "Highest rates, tax-saving",
    icon: PiggyBank,
    q2: {
      prompt: "How long can you lock the money?",
      options: [
        { id: "short", label: "Under 1 year" },
        { id: "medium", label: "1-3 years" },
        { id: "long", label: "5 years (tax-saving FD)" },
      ],
    },
  },
  {
    key: "tax",
    label: "Tax Planning",
    tagline: "Old vs New, 80C, HRA",
    icon: Receipt,
    q2: {
      prompt: "Biggest tax pain right now?",
      options: [
        { id: "regime", label: "Old vs New regime decision" },
        { id: "80c", label: "Maximising 80C deductions" },
        { id: "hra", label: "HRA exemption calculation" },
      ],
    },
  },
];

// Deterministic lookup: category + answer → 3 picks.
// Picks are curated editorial opinions, not an ML ranker. Maintained here.
const PICKS: Record<string, Pick[]> = {
  "cards-cashback": [
    {
      title: "Amazon Pay ICICI",
      badge: "Best overall · 91/100",
      oneLiner: "5% on Amazon, 2% everywhere. Lifetime free.",
      cta: "See details →",
      href: "/credit-cards/amazon-pay-icici-credit-card",
    },
    {
      title: "SBI Cashback Card",
      badge: "Best for online · 88/100",
      oneLiner: "5% cashback on all online spending, ₹999 fee.",
      cta: "See details →",
      href: "/credit-cards/sbi-cashback-credit-card",
    },
    {
      title: "HDFC Millennia",
      badge: "Best for young spenders · 72/100",
      oneLiner: "5% on Amazon, Flipkart, Swiggy, Zomato.",
      cta: "See details →",
      href: "/credit-cards/hdfc-millennia",
    },
  ],
  "cards-travel": [
    {
      title: "HDFC Infinia",
      badge: "Premium travel · 98/100",
      oneLiner: "Unlimited lounges, 3.3% return on SmartBuy.",
      cta: "See details →",
      href: "/credit-cards/hdfc-infinia-credit-card",
    },
    {
      title: "Amex Platinum Travel",
      badge: "Best miles · 92/100",
      oneLiner: "Lounge access + travel vouchers on milestones.",
      cta: "See details →",
      href: "/credit-cards/amex-platinum-travel",
    },
    {
      title: "Axis Magnus",
      badge: "Best reward rate · 89/100",
      oneLiner: "High reward rate on travel partners via Edge.",
      cta: "See details →",
      href: "/credit-cards/axis-magnus",
    },
  ],
  "cards-nofee": [
    {
      title: "Amazon Pay ICICI",
      badge: "Lifetime free · 91/100",
      oneLiner: "Zero annual fee. Ever. Solid 2-5% rewards.",
      cta: "See details →",
      href: "/credit-cards/amazon-pay-icici-credit-card",
    },
    {
      title: "Axis Ace",
      badge: "No fee · 84/100",
      oneLiner: "5% on Google Pay bills, 2% on Swiggy/Ola.",
      cta: "See details →",
      href: "/credit-cards/axis-ace",
    },
    {
      title: "IDFC First Wealth",
      badge: "No fee premium · 81/100",
      oneLiner: "Free for life with lounge access.",
      cta: "See details →",
      href: "/credit-cards/idfc-first-wealth",
    },
  ],
  "loans-home": [
    {
      title: "SBI Home Loan",
      badge: "Cheapest at 8.35% · Top pick",
      oneLiner: "Lowest interest among PSU banks, 20-yr tenure.",
      cta: "Compare rates →",
      href: "/loans?type=home",
    },
    {
      title: "HDFC Home Loan",
      badge: "Fast processing",
      oneLiner: "Digital flow, 8.70% p.a., salaried priority.",
      cta: "Compare rates →",
      href: "/loans?type=home",
    },
    {
      title: "Home Loan EMI Calculator",
      badge: "Tool",
      oneLiner: "See EMI + total interest + prepayment savings.",
      cta: "Run the numbers →",
      href: "/calculators/home-loan-emi",
    },
  ],
  "loans-personal": [
    {
      title: "HDFC Personal Loan",
      badge: "Lowest at 10.49%",
      oneLiner: "No collateral, 4-yr max, salaried-friendly.",
      cta: "Compare →",
      href: "/loans?type=personal",
    },
    {
      title: "Bajaj Finserv",
      badge: "Fastest disbursal",
      oneLiner: "Same-day disbursal for existing customers.",
      cta: "Compare →",
      href: "/loans?type=personal",
    },
    {
      title: "EMI Calculator",
      badge: "Tool",
      oneLiner: "Stress-test EMIs before you borrow.",
      cta: "Run the numbers →",
      href: "/calculators/emi",
    },
  ],
  "loans-car": [
    {
      title: "Bank of Baroda Car Loan",
      badge: "Cheapest at 8.70%",
      oneLiner: "New car, 7-yr tenure, zero processing fee.",
      cta: "Compare →",
      href: "/loans?type=car",
    },
    {
      title: "SBI Car Loan",
      badge: "Priority for salaried",
      oneLiner: "8.85%, up to 85% on-road funding.",
      cta: "Compare →",
      href: "/loans?type=car",
    },
    {
      title: "Car Loan EMI Calculator",
      badge: "Tool",
      oneLiner: "EMI + interest + down-payment scenarios.",
      cta: "Run the numbers →",
      href: "/calculators/car-loan-emi",
    },
  ],
  "mf-safe": [
    {
      title: "Short-term debt funds",
      badge: "6-7% returns · Low risk",
      oneLiner: "Better than FD for 1-3 year goals.",
      cta: "Top funds →",
      href: "/mutual-funds?type=debt",
    },
    {
      title: "Corporate bond funds",
      badge: "7-8% · Low-medium risk",
      oneLiner: "Slightly higher returns with modest risk.",
      cta: "Top funds →",
      href: "/mutual-funds?type=debt",
    },
    {
      title: "FD vs Debt Fund guide",
      badge: "Read",
      oneLiner: "Which wins after tax for your bracket?",
      cta: "Read article →",
      href: "/articles/fd-vs-debt-fund-comparison",
    },
  ],
  "mf-balanced": [
    {
      title: "Nifty 50 Index Fund",
      badge: "10-12% historical · Low cost",
      oneLiner: "The default equity allocation for most Indians.",
      cta: "Top funds →",
      href: "/mutual-funds?type=index",
    },
    {
      title: "Flexi-cap funds",
      badge: "11-14% · Balanced equity",
      oneLiner: "Active managers across large/mid/small.",
      cta: "Top funds →",
      href: "/mutual-funds?type=equity",
    },
    {
      title: "SIP Calculator",
      badge: "Tool",
      oneLiner: "Compute your 10-year SIP corpus with step-up.",
      cta: "Run the numbers →",
      href: "/calculators/sip",
    },
  ],
  "mf-aggressive": [
    {
      title: "Small-cap equity funds",
      badge: "13-16% potential · High risk",
      oneLiner: "For 10+ year horizons only. Stomach required.",
      cta: "Top funds →",
      href: "/mutual-funds?type=equity",
    },
    {
      title: "Mid-cap funds",
      badge: "12-15% · Medium-high risk",
      oneLiner: "Better risk-adjusted returns than small-cap.",
      cta: "Top funds →",
      href: "/mutual-funds?type=equity",
    },
    {
      title: "ELSS (tax-saving + equity)",
      badge: "Bonus: 80C deduction",
      oneLiner: "3-yr lock-in, ₹46,800 tax saved at 30% slab.",
      cta: "Top funds →",
      href: "/mutual-funds?type=elss",
    },
  ],
  "insurance-life": [
    {
      title: "HDFC Life Click 2 Protect",
      badge: "Best claim ratio · 98.6%",
      oneLiner: "Pure term, 1 Cr cover from ~₹700/mo at 30.",
      cta: "Compare terms →",
      href: "/insurance?type=term",
    },
    {
      title: "Max Life Smart Secure Plus",
      badge: "Strong CSR · 99.3%",
      oneLiner: "Smart add-ons for critical illness.",
      cta: "Compare terms →",
      href: "/insurance?type=term",
    },
    {
      title: "Term Cover Calculator",
      badge: "Tool",
      oneLiner: "How much cover do you actually need?",
      cta: "Find out →",
      href: "/calculators/term-cover",
    },
  ],
  "insurance-health": [
    {
      title: "HDFC ERGO Optima Secure",
      badge: "Top rated · 95/100",
      oneLiner: "No-claim doubling + restore benefit built-in.",
      cta: "Compare →",
      href: "/insurance?type=health",
    },
    {
      title: "Niva Bupa ReAssure",
      badge: "Best restore feature",
      oneLiner: "Unlimited automatic refills after claim.",
      cta: "Compare →",
      href: "/insurance?type=health",
    },
    {
      title: "Health Cover Calculator",
      badge: "Tool",
      oneLiner: "How much health cover do you need in India?",
      cta: "Find out →",
      href: "/calculators/health-cover",
    },
  ],
  "insurance-car": [
    {
      title: "ICICI Lombard Car Insurance",
      badge: "Fastest claim settlement",
      oneLiner: "Cashless at 4,400+ network garages.",
      cta: "Compare →",
      href: "/insurance?type=car",
    },
    {
      title: "Tata AIG Auto Secure",
      badge: "Best add-ons",
      oneLiner: "Zero-dep + engine protect + consumables.",
      cta: "Compare →",
      href: "/insurance?type=car",
    },
    {
      title: "Car IDV Calculator",
      badge: "Tool",
      oneLiner: "What's your car's insured declared value?",
      cta: "Find out →",
      href: "/calculators/car-idv",
    },
  ],
  "fd-short": [
    {
      title: "Savings Account",
      badge: "7.25% at AU SFB · Any time access",
      oneLiner: "Actually better than short FDs below 1 year.",
      cta: "Compare →",
      href: "/banking?sort=rate",
    },
    {
      title: "3-month Liquid Funds",
      badge: "~7% · No lock-in",
      oneLiner: "More tax-efficient than short FD for emergencies.",
      cta: "Top funds →",
      href: "/mutual-funds?type=liquid",
    },
    {
      title: "Rules of Thumb: Emergency Fund",
      badge: "Read",
      oneLiner: "Where to park 6 months of expenses.",
      cta: "Read →",
      href: "/articles/emergency-fund-guide",
    },
  ],
  "fd-medium": [
    {
      title: "Shriram Finance FD",
      badge: "9.10% · 1-year top rate",
      oneLiner: "AAA-rated NBFC, ₹5L DICGC insurance.",
      cta: "Compare FDs →",
      href: "/fixed-deposits?sort=rate",
    },
    {
      title: "Unity Small Finance Bank",
      badge: "8.60% · 2-year",
      oneLiner: "Small finance bank, RBI regulated.",
      cta: "Compare FDs →",
      href: "/fixed-deposits?sort=rate",
    },
    {
      title: "FD Ladder Calculator",
      badge: "Tool",
      oneLiner: "Stagger FDs for liquidity + rate advantage.",
      cta: "Run the numbers →",
      href: "/calculators/fd-ladder",
    },
  ],
  "fd-long": [
    {
      title: "Tax-saving 5-yr FD (SBI)",
      badge: "7.25% · 80C deduction",
      oneLiner: "Lock-in 5 yrs, deduct up to ₹1.5L.",
      cta: "Compare →",
      href: "/fixed-deposits?filter=tax-saving",
    },
    {
      title: "Tax-saving FD (ICICI)",
      badge: "7.20% · 80C eligible",
      oneLiner: "Standard terms, easy to operate.",
      cta: "Compare →",
      href: "/fixed-deposits?filter=tax-saving",
    },
    {
      title: "Tax-saving FD vs ELSS",
      badge: "Read",
      oneLiner: "Which ₹1.5L instrument wins after tax?",
      cta: "Read →",
      href: "/articles/tax-saving-fd-vs-elss",
    },
  ],
  "tax-regime": [
    {
      title: "Old vs New Regime Calculator",
      badge: "Tool · 60-sec answer",
      oneLiner: "Enter salary → see which saves more tax.",
      cta: "Run the numbers →",
      href: "/calculators/old-vs-new-tax",
    },
    {
      title: "FY 2026 Tax Changes",
      badge: "Read",
      oneLiner: "Budget 2026 changes that affect your choice.",
      cta: "Read →",
      href: "/articles/budget-2026-tax-changes",
    },
    {
      title: "Tax Slab Lookup",
      badge: "Reference",
      oneLiner: "All brackets side-by-side, FY26.",
      cta: "View slabs →",
      href: "/articles/income-tax-slabs-fy-2025-26",
    },
  ],
  "tax-80c": [
    {
      title: "80C Optimiser",
      badge: "Tool",
      oneLiner: "Allocate ₹1.5L across PPF / ELSS / ULIP / FD / insurance for maximum saving.",
      cta: "Optimise →",
      href: "/calculators/80c",
    },
    {
      title: "ELSS funds",
      badge: "Top-pick instrument",
      oneLiner: "Shortest lock-in (3yr) + equity growth.",
      cta: "Top funds →",
      href: "/mutual-funds?type=elss",
    },
    {
      title: "Complete 80C Guide",
      badge: "Read",
      oneLiner: "Every 80C instrument ranked by post-tax return.",
      cta: "Read →",
      href: "/articles/section-80c-complete-guide",
    },
  ],
  "tax-hra": [
    {
      title: "HRA Exemption Calculator",
      badge: "Tool",
      oneLiner: "Compute exempt portion from your rent + salary.",
      cta: "Run the numbers →",
      href: "/calculators/hra",
    },
    {
      title: "HRA Claim Checklist",
      badge: "Read",
      oneLiner: "Documents, PAN rule, common mistakes.",
      cta: "Read →",
      href: "/articles/hra-exemption-complete-guide",
    },
    {
      title: "Tax Calculator",
      badge: "Tool",
      oneLiner: "Full annual tax computation with all exemptions.",
      cta: "Run the numbers →",
      href: "/calculators/tax",
    },
  ],
};

export default function FindYourFit() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  const activeCategory = CATEGORIES.find((c) => c.key === category);
  const picks =
    category && answer ? PICKS[`${category}-${answer}`] || [] : [];

  function pickCategory(c: Category) {
    setCategory(c);
    setAnswer(null);
    setStep(2);
  }
  function pickAnswer(a: string) {
    setAnswer(a);
    setStep(3);
  }
  function reset() {
    setStep(1);
    setCategory(null);
    setAnswer(null);
  }
  function back() {
    if (step === 3) {
      setAnswer(null);
      setStep(2);
    } else if (step === 2) {
      setCategory(null);
      setStep(1);
    }
  }

  return (
    <section className="py-16 md:py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-8">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
            Find Your Fit · 60 seconds
          </div>
          <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink">
            Stop scrolling.{" "}
            <em className="italic text-indian-gold">We&apos;ll pick for you.</em>
          </h2>
          <p className="text-sm text-ink-60 mt-3 leading-relaxed">
            Two questions, three picks. No paid placement — just what we&apos;d
            tell a friend in your situation.
          </p>
        </div>

        <div className="bg-white border-2 border-ink/10 rounded-sm">
          {/* Progress strip */}
          <div className="flex items-center gap-0 border-b border-ink/10">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`flex-1 py-3 px-4 flex items-center gap-2 ${
                  step >= n
                    ? "bg-indian-gold/5"
                    : "bg-canvas opacity-50"
                } ${n < 3 ? "border-r border-ink/10" : ""}`}
              >
                <span
                  className={`font-mono text-[11px] w-5 h-5 flex items-center justify-center rounded-full ${
                    step >= n
                      ? "bg-indian-gold text-canvas"
                      : "bg-ink/10 text-ink-60"
                  }`}
                >
                  {n}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
                  {n === 1
                    ? "What?"
                    : n === 2
                      ? "Your fit"
                      : "Your picks"}
                </span>
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {/* Step 1: Category */}
            {step === 1 && (
              <>
                <h3 className="font-display font-bold text-xl text-ink mb-5">
                  What are you looking for?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.key}
                        onClick={() => pickCategory(c.key)}
                        className="group text-left border-2 border-ink/10 rounded-sm p-4 hover:border-indian-gold hover:bg-indian-gold/5 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 bg-indian-gold/10 rounded-sm flex items-center justify-center">
                            <Icon className="w-4 h-4 text-indian-gold" />
                          </div>
                          <div className="font-display font-bold text-base text-ink">
                            {c.label}
                          </div>
                        </div>
                        <div className="text-[12px] text-ink-60">
                          {c.tagline}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Step 2: Category-specific question */}
            {step === 2 && activeCategory && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={back}
                    className="font-mono text-[10px] uppercase tracking-wider text-ink-60 hover:text-ink flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
                    · {activeCategory.label}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-ink mb-5">
                  {activeCategory.q2.prompt}
                </h3>
                <div className="space-y-2">
                  {activeCategory.q2.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => pickAnswer(opt.id)}
                      className="w-full text-left border-2 border-ink/10 rounded-sm p-4 hover:border-indian-gold hover:bg-indian-gold/5 transition-colors flex items-center justify-between"
                    >
                      <span className="text-ink font-medium">{opt.label}</span>
                      <ArrowRight className="w-4 h-4 text-ink-60" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 3: Results */}
            {step === 3 && picks.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-1">
                      Your Top 3 Picks
                    </div>
                    <h3 className="font-display font-bold text-xl text-ink">
                      What we&apos;d tell a friend in your situation
                    </h3>
                  </div>
                  <button
                    onClick={reset}
                    className="font-mono text-[10px] uppercase tracking-wider text-ink-60 hover:text-ink flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Start over
                  </button>
                </div>
                <div className="space-y-3">
                  {picks.map((p, i) => (
                    <Link
                      key={p.title + i}
                      href={p.href}
                      className="group block border-2 border-ink/10 rounded-sm p-4 hover:border-ink/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-1">
                            #{i + 1} · {p.badge}
                          </div>
                          <h4 className="font-display font-bold text-lg text-ink mb-1 group-hover:text-authority-green transition-colors">
                            {p.title}
                          </h4>
                          <p className="text-[13px] text-ink-60">
                            {p.oneLiner}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-action-green">
                          {p.cta}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-ink/10 flex items-center justify-between gap-4">
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
              </>
            )}

            {step === 3 && picks.length === 0 && (
              <div className="text-center py-6">
                <p className="text-ink-60 mb-4">
                  We&apos;re still building recommendations for this combo. Try
                  another path.
                </p>
                <button
                  onClick={reset}
                  className="font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
                >
                  Start over &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
