import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Zap, Shield, Star, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Pricing — InvestingPro | Free & Pro Plans',
    description: 'Compare InvestingPro Free vs Pro plans. Get unlimited comparisons, advanced filters, and portfolio tools for ₹199/month. Cancel anytime.',
    alternates: { canonical: 'https://investingpro.in/pricing' },
};

const FREE_FEATURES = [
    'Compare up to 3 products/day',
    'Access all calculators (24 tools)',
    'Basic product filters',
    'Educational guides & articles',
    'Rate alert emails (weekly)',
];

const PRO_FEATURES = [
    'Unlimited product comparisons',
    'Advanced filters & sorting',
    'Portfolio tracker & watchlist',
    'Real-time rate change alerts',
    'Ad-free experience',
    'Priority email support',
    'Downloadable comparison reports (PDF)',
    'Early access to new tools',
];

const FAQ = [
    {
        q: 'Can I cancel anytime?',
        a: 'Yes. Cancel from your account dashboard — no questions asked. You keep Pro access until the end of your billing period.',
    },
    {
        q: 'Is my payment secure?',
        a: 'Payments are processed by Stripe, the same platform used by Amazon and Google. We never store your card details.',
    },
    {
        q: 'Do you offer a free trial?',
        a: 'The free plan lets you explore everything. Upgrade to Pro when you need unlimited comparisons or the portfolio tracker.',
    },
    {
        q: 'What payment methods are accepted?',
        a: 'UPI, all major debit/credit cards (Visa, Mastercard, RuPay), and net banking via Stripe.',
    },
    {
        q: 'Will prices change?',
        a: 'Existing subscribers are locked in at ₹199/month for life. We will never raise prices on active subscribers.',
    },
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero */}
            <section className="pt-20 pb-16 px-4 text-center">
                <Badge className="mb-4 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                    Simple, transparent pricing
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                    One plan. Everything unlocked.
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                    Free forever for casual use. Upgrade to Pro for unlimited comparisons, portfolio tools, and an ad-free experience.
                </p>
            </section>

            {/* Plans */}
            <section className="max-w-5xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

                    {/* Free Plan */}
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <CardContent className="p-8 flex flex-col h-full">
                            <div className="mb-8">
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Free</p>
                                <div className="flex items-end gap-2 mb-3">
                                    <span className="text-5xl font-bold text-slate-900 dark:text-white">₹0</span>
                                    <span className="text-slate-500 dark:text-slate-400 mb-1.5">/month</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    Perfect for getting started. No credit card required.
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {FREE_FEATURES.map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <Check className="w-4 h-4 text-success-DEFAULT flex-shrink-0 mt-0.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/signup">
                                <Button variant="outline" className="w-full h-12 font-semibold border-slate-300 dark:border-slate-700">
                                    Get Started Free
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="bg-slate-900 dark:bg-slate-800 border-0 rounded-2xl overflow-hidden relative">
                        {/* Popular badge */}
                        <div className="absolute top-6 right-6">
                            <Badge className="bg-primary-500 text-white border-0 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-white" /> Most Popular
                            </Badge>
                        </div>

                        <CardContent className="p-8 flex flex-col h-full">
                            <div className="mb-8">
                                <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-2">Pro</p>
                                <div className="flex items-end gap-2 mb-3">
                                    <span className="text-5xl font-bold text-white">₹199</span>
                                    <span className="text-slate-400 mb-1.5">/month</span>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    Less than a coffee. Unlimited access to every tool.
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {PRO_FEATURES.map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm text-slate-200">
                                        <Check className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <UpgradeButton />

                            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure via Stripe</span>
                                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Cancel anytime</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Trust strip */}
                <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-8">
                    Trusted by <strong className="text-slate-700 dark:text-slate-300">12,000+</strong> Indian investors •
                    Payments secured by <strong className="text-slate-700 dark:text-slate-300">Stripe</strong> •
                    Questions? <Link href="/contact-us" className="text-primary-600 dark:text-primary-400 hover:underline">Contact us</Link>
                </p>
            </section>

            {/* Feature comparison table */}
            <section className="max-w-3xl mx-auto px-4 pb-20">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">Full feature comparison</h2>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800">
                                <th className="text-left px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Feature</th>
                                <th className="text-center px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Free</th>
                                <th className="text-center px-6 py-4 font-semibold text-primary-600 dark:text-primary-400">Pro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                            {[
                                ['Product comparisons', '3/day', 'Unlimited'],
                                ['Financial calculators', '✓ All 24', '✓ All 24'],
                                ['Product filters', 'Basic', 'Advanced'],
                                ['Rate change alerts', 'Weekly email', 'Real-time'],
                                ['Portfolio tracker', '—', '✓'],
                                ['Watchlist', '—', '✓'],
                                ['Ad-free experience', '—', '✓'],
                                ['PDF comparison export', '—', '✓'],
                                ['Email support', 'Community', 'Priority'],
                            ].map(([feat, free, pro]) => (
                                <tr key={feat} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{feat}</td>
                                    <td className="px-6 py-4 text-center text-slate-500 dark:text-slate-500">{free}</td>
                                    <td className="px-6 py-4 text-center font-semibold text-primary-600 dark:text-primary-400">{pro}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-2xl mx-auto px-4 pb-24">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8 flex items-center justify-center gap-2">
                    <HelpCircle className="w-6 h-6 text-primary-500" />
                    Frequently asked questions
                </h2>
                <div className="space-y-4">
                    {FAQ.map(({ q, a }) => (
                        <div key={q} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <p className="font-semibold text-slate-900 dark:text-white mb-2">{q}</p>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{a}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

// Client component for the upgrade CTA (needs useRouter for auth check)
function UpgradeButton() {
    return (
        <Link href="/signup?plan=pro">
            <Button className="w-full h-12 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 group">
                Start Pro — ₹199/month
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
        </Link>
    );
}
