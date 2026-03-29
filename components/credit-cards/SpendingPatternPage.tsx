"use client";

import React from 'react';
import { CreditCardDecisionEngine, SpendingInput, CardRecommendation } from '@/lib/decision-engines/credit-card-engine';
import { CreditCard } from '@/types/credit-card';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, TrendingUp, Lightbulb, ShoppingCart, Fuel, Plane, Utensils, Zap, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import DecisionCTA from '@/components/common/DecisionCTA';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import CategoryHero from '@/components/common/CategoryHero';
import { formatCurrency } from '@/lib/utils';
import SEOHead from '@/components/common/SEOHead';

interface SpendingPatternPageProps {
    category: string;
    categoryLabel: string;
    amount: number;
    spendingField: keyof SpendingInput;
    cards: any[];
}

// ─── Category-specific educational content ────────────────────────────────────
// Each entry has >300 words of unique, category-specific guidance to satisfy
// Google's Scaled Content Abuse threshold (30%+ unique content per page).

const CATEGORY_CONTENT: Record<string, {
    icon: React.ElementType;
    whatToLookFor: string[];
    proTips: string[];
    commonMistake: string;
    relatedLinks: { label: string; href: string }[];
    faq: { q: string; a: string }[];
}> = {
    groceries: {
        icon: ShoppingCart,
        whatToLookFor: [
            'Look for cards with 5–10% cashback or 4–5x reward points on grocery and supermarket purchases.',
            'Check if the card covers both offline supermarkets (Big Bazaar, DMart, Reliance Fresh) and online grocery apps (BigBasket, Swiggy Instamart, Blinkit).',
            'Beware of merchant-category code (MCC) exclusions — some cards cap grocery rewards or exclude wallet top-ups used for groceries.',
            'Cards with a monthly or annual reward cap can limit earnings if you have a large household budget.',
        ],
        proTips: [
            'Link your grocery card to BigBasket and Swiggy Instamart to double-dip: earn card rewards + app cashback simultaneously.',
            'Buy grocery gift vouchers (Amazon, Flipkart grocery) using your card at outlets that trigger higher category reward rates.',
            'Use the card\'s annual fee waiver spend threshold — monthly grocery spend often makes waiving fees easy.',
            'Opt for cards that treat "food delivery apps" as grocery spend for higher reward rates.',
        ],
        commonMistake: 'Many people use a general-purpose card for groceries and miss 3–8% cashback from a dedicated grocery rewards card. On ₹10,000/month grocery spend, this is ₹3,600–9,600 per year in missed rewards.',
        relatedLinks: [
            { label: 'Best cashback credit cards India 2025', href: '/credit-cards/cashback' },
            { label: 'Compare HDFC Millennia vs SBI SimplyCLICK', href: '/credit-cards/vs/hdfc-millennia-vs-sbi-simplyclick' },
            { label: 'SIP Calculator — invest your grocery savings', href: '/calculators/sip' },
        ],
        faq: [
            { q: 'Which credit card gives the most cashback on groceries in India?', a: 'Cards like HDFC Millennia (5% on BigBasket), Axis Flipkart (5% on grocery apps), and Amazon Pay ICICI (2–5% on Amazon Fresh) consistently rank highest for grocery cashback in India.' },
            { q: 'Do credit card reward points on groceries expire?', a: 'Reward point validity varies by card — typically 2–3 years. Set a calendar reminder 60 days before expiry, or redeem points regularly for statement credit or vouchers.' },
        ],
    },
    fuel: {
        icon: Fuel,
        whatToLookFor: [
            'Prioritise cards that waive the 1% fuel surcharge — on ₹5,000/month fuel spend, this saves ₹600/year before any rewards.',
            'Check the transaction amount limits for surcharge waiver — many cards only waive the surcharge between ₹400–₹4,000 per transaction.',
            'Look for cards offering 2.5–5% fuel cashback at HPCL, BPCL, or Indian Oil outlets specifically.',
            'Co-branded fuel cards (BPCL SBI Card, HPCL Coral) often provide higher fuel rewards but less value elsewhere.',
        ],
        proTips: [
            'Fill fuel in multiple transactions if your monthly spend is concentrated, to stay within the surcharge-waiver transaction cap per swipe.',
            'Use the card at company-owned fuel outlets rather than dealer-owned ones — MCC codes differ and rewards may vary.',
            'Pair a fuel card with a UPI app to earn additional app-level fuel cashback on top of your card reward.',
            'Track annual fuel spend: if you spend over ₹1.2L/year, a premium fuel card\'s annual fee is often offset by surcharge savings alone.',
        ],
        commonMistake: 'Paying fuel via UPI or debit card forfeits both the 1% surcharge waiver and any fuel reward points. Switching to a fuel credit card on a ₹8,000/month fuel budget saves ₹960–2,400/year.',
        relatedLinks: [
            { label: 'Best fuel credit cards India 2025', href: '/credit-cards/fuel' },
            { label: 'EMI Calculator — plan your vehicle loan', href: '/calculators/emi' },
            { label: 'Compare all credit cards', href: '/credit-cards' },
        ],
        faq: [
            { q: 'What is the fuel surcharge on credit cards in India?', a: 'A 1% surcharge (plus GST) is levied on fuel transactions at petrol pumps. Cards with fuel surcharge waiver eliminate this fee, saving ₹10 per ₹1,000 of fuel purchased.' },
            { q: 'Do fuel credit cards work at all petrol pumps in India?', a: 'Most fuel cards work at all HPCL, BPCL, and Indian Oil pumps. Some co-branded cards offer higher rewards at affiliated pumps only — check before applying.' },
        ],
    },
    travel: {
        icon: Plane,
        whatToLookFor: [
            'Lounge access is the most tangible travel perk — check if the card covers Indian domestic lounges (Priority Pass or Dreamfolks network) and international ones.',
            'Look for accelerated miles/points on flight and hotel bookings — ideally 4–10x on travel portals vs 1–2x on standard spend.',
            'Foreign transaction fee (forex markup) matters if you travel abroad — aim for cards with ≤1.5% markup vs the industry average of 3.5%.',
            'Travel insurance bundled with the card should cover flight delay (min 6 hours), baggage loss, and medical emergencies abroad.',
        ],
        proTips: [
            'Book flights via the card\'s travel portal to earn both airline miles and card reward points simultaneously.',
            'Convert reward points to airline miles at 1:1 before they devalue — most travel cards support Vistara, IndiGo, Air India transfers.',
            'Use airport lounge access even on domestic trips: free WiFi + food can easily be worth ₹500–800 per visit.',
            'Apply for travel cards 3–4 months before an international trip to activate the welcome bonus and insurance cover.',
        ],
        commonMistake: 'Using a standard credit card abroad incurs a 3–4% forex markup on every transaction. On a ₹1L foreign spend trip, that\'s ₹3,000–4,000 wasted on fees alone. A low-forex travel card eliminates this.',
        relatedLinks: [
            { label: 'Best travel credit cards India 2025', href: '/credit-cards/travel' },
            { label: 'Best lounge access credit cards', href: '/credit-cards/lounge-access' },
            { label: 'Compare all credit cards', href: '/credit-cards' },
        ],
        faq: [
            { q: 'How many lounge visits do travel credit cards offer?', a: 'Entry-level travel cards typically give 2–4 complimentary lounge visits per quarter. Premium cards (HDFC Infinia, Axis Magnus) offer unlimited lounge access globally. Verify the network (Priority Pass, Dreamfolks, or both) before applying.' },
            { q: 'Can I transfer credit card reward points to airline miles?', a: 'Yes — most premium travel cards support point transfers to IndiGo, Air India, Vistara, Singapore Airlines, and others. Transfer ratios vary (typically 4:1 to 2:1 points-to-miles). Check transfer minimums before accumulating.' },
        ],
    },
    'online-shopping': {
        icon: ShoppingCart,
        whatToLookFor: [
            'Look for flat 5% cashback on Amazon, Flipkart, or Myntra — these three platforms account for 70%+ of Indian e-commerce spend.',
            'Check if the card provides additional cashback during sales events (Big Billion Days, Great Indian Festival) — some cards offer temporary rate boosts.',
            'Cards with No Cost EMI partnerships with major e-commerce platforms help spread large purchases interest-free.',
            'International shopping rewards matter if you buy from overseas websites — look for low forex markup alongside online shopping rewards.',
        ],
        proTips: [
            'Stack discounts: use an e-commerce platform offer + bank card offer + co-branded card reward for triple savings on the same transaction.',
            'Enable instant EMI on your card and convert large appliance or electronics purchases to 0% EMI to preserve cash flow.',
            'Use browser extensions that surface automatic bank card offers before checkout on major shopping portals.',
            'Set purchase alerts on your card app — instant notifications help you verify each transaction and catch fraud immediately.',
        ],
        commonMistake: 'Using a standard card for Amazon/Flipkart and missing the co-branded card 5% cashback. On ₹20,000/month online shopping, a co-branded card saves ₹12,000/year vs a general rewards card at 1% return.',
        relatedLinks: [
            { label: 'Best credit cards for online shopping 2025', href: '/credit-cards/cashback' },
            { label: 'Amazon Pay ICICI vs Flipkart Axis Bank Card', href: '/credit-cards/vs/amazon-pay-icici-vs-flipkart-axis' },
            { label: 'SWP Calculator — put your savings to work', href: '/calculators/swp' },
        ],
        faq: [
            { q: 'Which is better for online shopping — Amazon Pay ICICI or Flipkart Axis Bank card?', a: 'Amazon Pay ICICI offers 5% cashback for Prime members on Amazon. Flipkart Axis Bank offers 5% on Flipkart and Myntra. If you split spending between both platforms, a general-purpose cashback card may give better overall returns.' },
            { q: 'Are credit card rewards on online shopping taxable in India?', a: 'Cashback and reward points are generally not taxable as they\'re considered a discount/rebate. However, large referral bonuses or bank interest paid on reward accounts may need to be declared. Consult a CA for your specific situation.' },
        ],
    },
    dining: {
        icon: Utensils,
        whatToLookFor: [
            'Look for cards with 5–15% cashback or 5x–10x reward points at restaurants, cafes, and food delivery apps (Swiggy, Zomato).',
            'Some cards distinguish between dining at physical restaurants vs food delivery — check both are covered at the higher reward rate.',
            'Complimentary dining memberships (EazyDiner Prime, DineOut Pass) can be worth ₹3,000–5,000/year independently.',
            'Cards with concierge service or restaurant recommendation features add convenience for frequent diners.',
        ],
        proTips: [
            'Pay restaurant bills via the card\'s dining portal or partner app to layer card rewards + EazyDiner/DineOut cashback.',
            'Use the dining card for Swiggy and Zomato orders — both platforms recognise the dining MCC for higher reward triggers.',
            'Some banks offer "dining day" promotions (10x rewards on Tuesdays, etc.) — time your restaurant bookings accordingly.',
            'A dining card\'s annual fee often breaks even with just one complimentary dining pass per month.',
        ],
        commonMistake: 'Paying restaurant bills with UPI or debit misses 10–15% combined cashback available via dining cards + restaurant apps. On ₹15,000/month dining, that\'s ₹18,000–27,000/year in missed savings.',
        relatedLinks: [
            { label: 'Best dining credit cards India 2025', href: '/credit-cards/dining' },
            { label: 'Compare all credit cards', href: '/credit-cards' },
            { label: 'Financial Health Score — track your spending', href: '/calculators/financial-health-score' },
        ],
        faq: [
            { q: 'Do food delivery apps (Swiggy/Zomato) count as dining for credit card rewards?', a: 'It depends on the card. Many premium cards treat Swiggy and Zomato as dining (MCC 5812 or 5814). Others categorise them as "food delivery" or "internet purchases" at a lower reward rate. Check the card\'s merchant category policy before assuming elevated rewards.' },
            { q: 'What is EazyDiner Prime and is it worth it?', a: 'EazyDiner Prime is a dining subscription offering 25–30% off at 2,000+ restaurants in India. Several credit cards include it as a complimentary benefit. At ₹3,000/year retail price, just two premium restaurant visits per month justify the cost.' },
        ],
    },
    utilities: {
        icon: Zap,
        whatToLookFor: [
            'Look for cards with 2–5% cashback or reward points on utility bill payments (electricity, water, gas, mobile recharges).',
            'Check if the card covers online bill payment platforms (BBPS via PhonePe, Paytm, Google Pay) and not just direct biller payments.',
            'Some cards exclude wallet top-ups used for bill payments — pay bills directly via card or via BBPS to ensure rewards are credited.',
            'Look for auto-pay features that let the card auto-debit recurring utility bills to earn rewards passively.',
        ],
        proTips: [
            'Set up auto-pay for electricity, broadband, and mobile bills on your utility rewards card — earn points without manual effort.',
            'Pay annual insurance premiums (car, health, term life) using your utility card if insurance MCCs qualify for enhanced rewards.',
            'Some cards reward "wallet loading" — load Paytm or Amazon Pay wallet up to the monthly limit before paying bills to capture 2x rewards.',
            'Time your large utility bill payments (society maintenance, property tax) during card statement periods to maximise reward-point cycles.',
        ],
        commonMistake: 'Paying utility bills via bank auto-debit (NACH mandate) earns zero rewards. Switching to credit card auto-pay via BBPS on a ₹8,000/month utility budget earns ₹1,920–4,800/year in reward points at standard rates.',
        relatedLinks: [
            { label: 'Best credit cards for bill payment 2025', href: '/credit-cards' },
            { label: 'Home Loan EMI Calculator', href: '/calculators/emi' },
            { label: 'PPF Calculator — build an emergency fund', href: '/calculators/ppf' },
        ],
        faq: [
            { q: 'Do credit cards give rewards on electricity bill payments in India?', a: 'Yes, most rewards cards earn points or cashback on electricity bill payments made via BBPS (Bharat Bill Payment System) through the card\'s app or BBPS portals like PhonePe and Google Pay. Some cards exclude wallet top-ups, so pay bills directly with the card.' },
            { q: 'What is BBPS and why does it matter for credit card rewards?', a: 'BBPS (Bharat Bill Payment System) is RBI\'s standardised bill payment network. Payments made through BBPS get a standard MCC code that most cards recognise for rewards. Using BBPS-enabled payment apps (PhonePe, Paytm) with your credit card ensures you earn rewards on utility bills reliably.' },
        ],
    },
};

export default function SpendingPatternPage({
    category,
    categoryLabel,
    amount,
    spendingField,
    cards
}: SpendingPatternPageProps) {
    // Create spending input with the specific category amount
    const spendingInput: SpendingInput = {
        monthlySpending: amount,
        groceries: spendingField === 'groceries' ? amount : 0,
        fuel: spendingField === 'fuel' ? amount : 0,
        travel: spendingField === 'travel' ? amount : 0,
        onlineShopping: spendingField === 'onlineShopping' ? amount : 0,
        dining: spendingField === 'dining' ? amount : 0,
        utilities: spendingField === 'utilities' ? amount : 0,
        other: spendingField === 'other' ? amount : 0
    };

    const engine = cards.length > 0 ? new CreditCardDecisionEngine(cards as CreditCard[]) : null;
    const recommendations: CardRecommendation[] = engine
        ? engine.getSpendingBasedRecommendations(spendingInput, 5)
        : [];

    const formattedAmount = formatCurrency(amount);
    const catContent = CATEGORY_CONTENT[category];
    const CategoryIcon = catContent?.icon ?? HelpCircle;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title={`Best Credit Cards for ${categoryLabel} - Spend ${formattedAmount}/Month | InvestingPro`}
                description={`Find the best credit cards if you spend ${formattedAmount}/month on ${categoryLabel.toLowerCase()}. Compare rewards, fees, and features. Apply instantly.`}
            />

            <CategoryHero
                title={`Best Credit Cards for ${categoryLabel}`}
                subtitle={`If You Spend ${formattedAmount}/Month`}
                description={`We've analyzed all credit cards to find the best options for maximizing rewards on your ${categoryLabel.toLowerCase()} spending. Compare and apply instantly.`}
                primaryCta={{
                    text: "Compare All Cards",
                    href: "/credit-cards"
                }}
                secondaryCta={{
                    text: "Customize Your Search",
                    href: "/credit-cards/recommendations/spending-based"
                }}
                stats={[
                    { label: "Cards Analyzed", value: cards.length.toString() },
                    { label: "Top Matches", value: recommendations.length.toString() },
                    { label: "Avg. Monthly Rewards", value: recommendations.length > 0 ? formatCurrency(recommendations.reduce((sum, r) => sum + r.estimatedRewards, 0) / recommendations.length) : "₹0" }
                ]}
                badge={`Spending: ${formattedAmount}/month`}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Key Insight */}
                    <Card className="mb-8 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                        Why This Matters
                                    </h3>
                                    <p className="text-slate-700 dark:text-slate-300">
                                        If you spend {formattedAmount}/month on {categoryLabel.toLowerCase()}, you could earn 
                                        {recommendations.length > 0 ? ` up to ${formatCurrency(recommendations[0].estimatedRewards)}/month in rewards` : ' significant rewards'} 
                                        {' '}with the right credit card. The cards below are optimized for your spending pattern.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    {recommendations.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-slate-600 dark:text-slate-400">
                                    No specific recommendations found for this spending pattern. 
                                    Try our <Link href="/credit-cards/recommendations/spending-based" className="text-primary-600 dark:text-primary-400 hover:underline">custom recommendation tool</Link>.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Top Recommended Credit Cards
                            </h2>
                            {recommendations.map((rec, idx) => (
                                <Card key={rec.card.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                        {rec.card.name}
                                                    </h3>
                                                    <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs font-semibold">
                                                        #{idx + 1} Best Match
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                                    {rec.card.provider || rec.card.bank}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm mb-4">
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        Estimated Rewards: <strong className="text-success-600 dark:text-success-400">{formatCurrency(rec.estimatedRewards)}/month</strong>
                                                    </span>
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        Match Score: <strong className="text-primary-600 dark:text-primary-400">{rec.score.toFixed(0)}</strong>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Why This Card:</h4>
                                            <ul className="space-y-1">
                                                {rec.reasons.map((reason, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                        <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400 mt-0.5 shrink-0" />
                                                        {reason}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex gap-3">
                                            <DecisionCTA
                                                text="Apply Instantly"
                                                href={rec.card.apply_link || rec.card.affiliate_link || `/apply/credit-card/${rec.card.id}`}
                                                productId={rec.card.id}
                                                variant="primary"
                                                className="flex-1"
                                                isExternal={!!(rec.card.apply_link || rec.card.affiliate_link)}
                                            />
                                            <Link href={`/credit-cards/${rec.card.slug || rec.card.id}`}>
                                                <button className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Related Links */}
                    <Card className="mt-8">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Explore More Options</h3>
                            <div className="space-y-2">
                                <Link href="/credit-cards/recommendations/spending-based" className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
                                    <ArrowRight className="w-4 h-4" />
                                    Customize your spending pattern for personalized recommendations
                                </Link>
                                <Link href="/credit-cards/find-your-card" className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
                                    <ArrowRight className="w-4 h-4" />
                                    Find cards based on your lifestyle and eligibility
                                </Link>
                                <Link href="/credit-cards" className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
                                    <ArrowRight className="w-4 h-4" />
                                    Compare all credit cards
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Category-specific educational content ─────────── */}
                    {catContent && (
                        <>
                            {/* What to look for */}
                            <Card className="mt-10">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <CategoryIcon className="w-5 h-5 text-primary-600" />
                                        What to Look for in a {categoryLabel} Credit Card
                                    </h2>
                                    <ul className="space-y-3">
                                        {catContent.whatToLookFor.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Pro tips */}
                            <Card className="mt-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-amber-600" />
                                        Pro Tips to Maximise {categoryLabel} Rewards
                                    </h2>
                                    <ul className="space-y-3">
                                        {catContent.proTips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                                                <span className="text-amber-600 font-bold mt-0.5 shrink-0">{i + 1}.</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Common mistake callout */}
                            <Card className="mt-6 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-red-800 dark:text-red-300 mb-2">
                                        Common Mistake to Avoid
                                    </h3>
                                    <p className="text-red-700 dark:text-red-400 text-sm leading-relaxed">
                                        {catContent.commonMistake}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* FAQ */}
                            <div className="mt-10">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    {catContent.faq.map((item, i) => (
                                        <details key={i} className="group bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm cursor-pointer">
                                            <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-2">
                                                <span>{item.q}</span>
                                                <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                                            </summary>
                                            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                                {item.a}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </div>

                            {/* Related links */}
                            <Card className="mt-6">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Related Guides</h3>
                                    <div className="space-y-2">
                                        {catContent.relatedLinks.map((link, i) => (
                                            <Link key={i} href={link.href} className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline text-sm">
                                                <ArrowRight className="w-4 h-4 shrink-0" />
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <ComplianceDisclaimer variant="compact" className="mt-8" />
                </div>
            </div>
        </div>
    );
}
