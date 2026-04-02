import type { Metadata } from 'next';
import { InflationAdjustedCalculator } from "@/components/calculators/InflationAdjustedCalculator";
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Info } from "lucide-react";

export const metadata: Metadata = {
    title: 'Inflation Adjusted Returns Calculator India 2026 | Real Returns | InvestingPro',
    description: 'Calculate inflation-adjusted (real) returns on investments. Understand what your money is actually worth after inflation. Free calculator for Indian investors.',
    keywords: 'inflation adjusted returns calculator, real returns calculator India, inflation calculator investment, real rate of return calculator',
    alternates: { canonical: 'https://investingpro.in/calculators/inflation-adjusted-returns' },
};

export default function InflationAdjustedReturnsPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <AutoBreadcrumbs />

                {/* Hero */}
                <div className="mt-6 mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-warning-DEFAULT/10 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5 text-warning-DEFAULT" />
                        </div>
                        <span className="text-sm font-semibold text-warning-DEFAULT uppercase tracking-wider">
                            Inflation Impact Tool
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        Inflation Adjusted Returns Calculator
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                        Your FD earns 7%. Inflation runs at 6%. Your real return is just 1%.
                        This calculator shows you what your investments are <em>actually</em> worth in today's money.
                    </p>
                </div>

                {/* Calculator */}
                <InflationAdjustedCalculator />

                {/* Why Real Returns Matter */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Nominal vs Real Return",
                            body: "Nominal return is what the bank or fund quotes. Real return is what you actually gain in purchasing power after inflation. Always compare investments using real returns.",
                        },
                        {
                            title: "The Rule of 72",
                            body: "Divide 72 by the inflation rate to find how many years it takes for your money to halve in value. At 6% inflation, ₹1 lakh becomes worth ₹50,000 in just 12 years.",
                        },
                        {
                            title: "Beating Inflation in India",
                            body: "Historically, equity mutual funds have delivered 12–15% returns vs 5–7% inflation — a real return of 6–9%. FDs and savings accounts barely keep pace with inflation.",
                        },
                    ].map(({ title, body }) => (
                        <Card key={title} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* FAQ */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "What is the average inflation rate in India?",
                                a: "India's average CPI inflation has been 5–7% over the past decade. The RBI targets 4% with a 2% tolerance band. For long-term planning, use 6% as a conservative estimate.",
                            },
                            {
                                q: "Why is my FD giving negative real returns?",
                                a: "If your FD rate is 6.5% and inflation is 6%, your real return is only 0.5% before tax. After 30% tax on interest, your post-tax real return becomes negative.",
                            },
                            {
                                q: "What investments beat inflation in India?",
                                a: "Historically: Equity mutual funds (12–15%), PPF (7.1% — tax-free, roughly matches inflation), Real estate (city-dependent). Fixed deposits and savings accounts often fail to beat inflation after tax.",
                            },
                            {
                                q: "How is real return calculated?",
                                a: "Real Return ≈ Nominal Return − Inflation Rate (simplified). The precise formula is: Real Return = ((1 + Nominal) / (1 + Inflation)) − 1. For small numbers the approximation works fine.",
                            },
                        ].map(({ q, a }, i) => (
                            <Card key={i} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{q}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Share & Disclaimer */}
                <div className="mt-10 space-y-4">
                    <SocialShareButtons
                        title="Inflation Adjusted Returns Calculator India | InvestingPro"
                        url="https://investingpro.in/calculators/inflation-adjusted-returns"
                        description="Calculate real returns after inflation — free tool for Indian investors"
                    />
                    <FinancialDisclaimer variant="compact" />
                </div>
            </div>
        </main>
    );
}
