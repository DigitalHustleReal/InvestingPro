import React from 'react';
import { BookOpen } from 'lucide-react';

interface ResearchNoteProps {
    note: string;
    author?: string;
    date?: string;
    className?: string;
    /** accent color variant — default=amber (editorial), green=positive finding, red=warning */
    variant?: 'default' | 'green' | 'red';
}

const VARIANTS = {
    default: {
        wrapper: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40',
        icon: 'text-amber-600 dark:text-amber-400',
        label: 'text-amber-700 dark:text-amber-400',
        text: 'text-amber-900 dark:text-amber-200',
        meta: 'text-amber-600 dark:text-amber-500',
    },
    green: {
        wrapper: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/40',
        icon: 'text-green-700 dark:text-green-400',
        label: 'text-green-700 dark:text-green-400',
        text: 'text-green-900 dark:text-green-200',
        meta: 'text-green-600 dark:text-green-500',
    },
    red: {
        wrapper: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/40',
        icon: 'text-red-600 dark:text-red-400',
        label: 'text-red-700 dark:text-red-400',
        text: 'text-red-900 dark:text-red-200',
        meta: 'text-red-600 dark:text-red-500',
    },
};

/**
 * Signed editorial research note — shown on every product listing page.
 * From ideation 8: "SBI Cashback wins for most online spenders — 5% flat...
 * Critical caveat: 42% annual interest if you carry a balance."
 * This is the Martin Lewis differentiator: honest editorial opinion, not just data.
 */
export default function ResearchNote({
    note,
    author = 'InvestingPro Research',
    date,
    className = '',
    variant = 'default',
}: ResearchNoteProps) {
    const v = VARIANTS[variant];

    return (
        <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${v.wrapper} ${className}`}>
            <BookOpen className={`h-4 w-4 shrink-0 mt-0.5 ${v.icon}`} />
            <div className="flex-1 min-w-0">
                <span className={`text-[11px] font-bold uppercase tracking-wide mr-2 ${v.label}`}>
                    Research Note
                </span>
                <span className={`text-sm leading-relaxed ${v.text}`}>{note}</span>
                <div className={`text-[11px] mt-1 ${v.meta}`}>
                    — {author}{date ? ` · ${date}` : ''}
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────────────
   Pre-written notes for each vertical — import directly
────────────────────────────────────────────────────── */
export const RESEARCH_NOTES = {
    creditCards: {
        cashback: "SBI Cashback is the most versatile pick for online spenders — 5% with no merchant restrictions. Critical caveat: 42% annual interest if you carry a balance. Only apply if you pay the full amount every month. For lifetime-free without conditions: Amazon Pay ICICI.",
        travel: "Axis Magnus leads for travel frequency of 4+ trips/year. Calculate your lounge value before applying — the ₹12,500 annual fee is only worth it above ₹18,000/year in lounge + reward value. For occasional travellers, SBI SimplyCLICK's 10x reward on Cleartrip is cheaper.",
        fuelCards: "BPCL SBI Card's 4.25% fuel surcharge waiver is the strongest single-brand fuel card. If you use multiple fuel stations, IndianOil Axis Bank gives 4% at IOCL. Neither is worth holding solo — pair with a flat cashback card.",
        lifetimeFree: "Amazon Pay ICICI remains India's best no-conditions lifetime free card. No annual fee, no spend waiver, no catch. The 5% Amazon Prime cashback is the highest flat rate on a free card. Run this as your default if you prefer zero-fee.",
        ott: "If your OTT bills exceed ₹1,500/month (Netflix + Prime + Hotstar), an OTT card pays for its annual fee within 3–4 months. HDFC Swiggy card covers OTT + food delivery. For pure streaming, look at SBI Pulse which covers Disney+ Hotstar.",
        rentPayment: "Rent payment via BBPS on credit cards typically earns 0.5–1% rewards — but verify before applying. Several banks have now excluded rent transactions from reward earning. Always check the bank's reward exclusion list before using a card for rent.",
        electricity: "Electricity and utility bill payments via BBPS earn standard rewards on most cards. Best picks: HDFC Millennia (5% on utility apps like Paytm/PhonePe), ICICI Amazon Pay (2% on utility), SBI Cashback (5% all online including BBPS).",
        upi: "UPI/RuPay credit cards earn rewards on UPI transactions — unlike Visa/Mastercard. HDFC Rupay Credit Card and Axis Bank Rupay CC both earn full rewards on UPI. This is a genuine differentiation vs regular credit cards for India's UPI-first users.",
        lounge: "Lounge access value depends entirely on how often you fly. At 4+ trips/year, even a ₹5,000/year card pays back. At 1–2 trips, a free card with 2 complimentary visits (like HDFC Millennia) is smarter than paying ₹10,000+ annually.",
        dining: "Dining cards earn best on restaurant and food delivery spend. SBI Card Dining: 5× at restaurants. Swiggy HDFC: 10% on Swiggy food delivery. If you order delivery more than dine out, the food delivery card wins. If you dine at restaurants, the restaurant rewards card wins.",
        premium: "Premium cards (Axis Magnus, HDFC Infinia, Amex Platinum) only make financial sense above ₹8–12L annual spend. Below that, a mid-tier card with lower fee gives better net reward value. Calculate your annual reward earn vs fee before upgrading.",
    },
    loans: {
        homeLoan: "SBI has the lowest headline rate (8.35%) but your actual rate depends on CIBIL, loan amount, and property type. A CIBIL of 749 vs 750 can cost ₹4.8L extra on a ₹60L loan over 20 years. Check your CIBIL before applying — 3 months of on-time payments can lift it 15–30 points.",
        personalLoan: "Personal loan interest rates range from 10.5% (HDFC, good CIBIL) to 24%+ (NBFCs, lower CIBIL). At 18%+ interest, you are paying ₹90 in interest for every ₹500 borrowed over 3 years. Use personal loans only for genuine emergencies — not for consumption.",
    },
    mutualFunds: {
        bestSip: "For most investors: a 2-fund portfolio (large cap index + mid cap index) beats 80% of active funds over 10 years, at lower expense ratio. If you want tax saving too, add ELSS. SIP works because you buy more units when markets fall — don't pause SIPs during corrections.",
        elss: "ELSS is the only 80C investment where your money can grow at 12–14%. Lock-in of 3 years is the shortest among all 80C options. Key caveat: 12.5% LTCG tax on gains above ₹1.25L/year. Still beats PPF (7.1%) and NSC (7.7%) on post-tax returns over 5+ years.",
        largeCap: "Large cap funds invest in India's top 100 companies by market cap — Reliance, TCS, HDFC Bank. Lower volatility than mid/small cap. Expect 10–13% CAGR over 10-year periods. Best as portfolio anchor — 50–60% of equity allocation for conservative investors.",
        midCap: "Mid cap funds offer higher growth than large caps but with higher volatility. 3-year returns can swing ±30% vs ±15% for large caps. Suitable for a 7+ year horizon with higher risk tolerance. Limit to 20–30% of total equity allocation.",
        smallCap: "Small cap funds have the highest long-term return potential — and the highest short-term risk. Down 40–50% in bad years is not unusual. Suitable only for 10+ year horizon, high risk tolerance, and investors who won't panic-sell during corrections.",
    },
    fixedDeposits: {
        general: "Small Finance Banks (AU, Unity, Equitas) offer 7.5–8.15% vs 6.5–7% from major banks. They are DICGC-insured up to ₹5L per depositor — same as HDFC and SBI. Keep each SFB FD below ₹5L for full insurance coverage. For amounts above ₹5L, spread across multiple banks.",
    },
    insurance: {
        term: "Most Indians are underinsured by 80–90%. The rule: life cover = 10–15× your annual income. A ₹1Cr term policy for a 30-year-old costs ₹8,000–₹12,000/year — less than most people spend on dining out. Buy online-only plans (LIC eTerm, HDFC Click2Protect) — they're 30–40% cheaper than offline with the same cover.",
        ulip: "Most ULIPs sold in India return 6–8% net of charges — worse than a plain term + mutual fund combination. Insurance charges, fund management charges, and mortality charges typically consume 3–5% of your investment every year for the first 5 years. The honest analysis: buy term for protection, buy mutual funds for investment. Don't mix them.",
        health: "A ₹5L individual health plan is adequate for most single adults in tier-2 cities. For families, a ₹10L family floater covers most hospitalisation. Critical gap: room rent sub-limits. A policy with 1% room rent limit on ₹5L cover = ₹5,000/day room, which modern hospitals charge ₹8,000+ for. Avoid plans with room rent sub-limits.",
    },
};
