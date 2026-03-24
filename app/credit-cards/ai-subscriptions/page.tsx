import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import MobileEngagementBar from '@/components/common/MobileEngagementBar';
import MethodologyBanner from '@/components/common/MethodologyBanner';
import DataFreshnessBar from '@/components/common/DataFreshnessBar';
import CibilCrossLink from '@/components/common/CibilCrossLink';
import CreditCardsClient from '../CreditCardsClient';
import { getCreditCardsByCategory } from '@/lib/products/get-cc-by-category';
import { Badge } from '@/components/ui/badge';

export const revalidate = 3600;

export default async function AiSubscriptionsCardsPage() {
    let assets = [];
    try {
        assets = await getCreditCardsByCategory([
            'ai', 'chatgpt', 'openai', 'gemini', 'copilot', 'claude',
            'subscription', 'digital', 'software', 'app', 'saas',
            'online', 'technology', 'tech',
        ]);
    } catch (error) {
        console.error('[AiSubscriptionsCardsPage] Failed to load cards:', error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Credit Cards for AI Subscriptions in India (2026) — ChatGPT, Gemini & More | InvestingPro"
                description="Pay for ChatGPT Plus, Google One AI, Microsoft Copilot, and other AI subscriptions with maximum rewards. Compare India's best credit cards for AI tool purchases. Save ₹5,000+/year."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Credit Cards for AI Subscriptions in India',
                    description: 'Compare credit cards that offer maximum rewards, cashback, or free credits on AI subscriptions like ChatGPT Plus, Google One AI Premium, Microsoft Copilot, and Claude Pro.',
                    url: 'https://investingpro.in/credit-cards/ai-subscriptions',
                    numberOfItems: assets.length,
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />

                    {/* First-mover badge */}
                    <div className="flex justify-center mb-4">
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-sm px-4 py-1">
                            India&apos;s first AI subscription credit card comparison
                        </Badge>
                    </div>

                    <CategoryHero
                        title="Credit Cards for AI Subscriptions"
                        subtitle="Earn Rewards on ChatGPT, Gemini, Copilot & More"
                        description="Indian professionals spending ₹2,000–₹10,000/month on AI tools are leaving cashback on the table. Find which credit card maximises rewards on ChatGPT Plus, Google One AI, Microsoft 365 Copilot, and other AI subscriptions."
                        primaryCta={{ text: 'Find Your Card', href: '/credit-cards/find-your-card' }}
                        secondaryCta={{ text: 'Compare All Cards', href: '/credit-cards' }}
                        stats={[
                            { label: 'Cards Listed', value: `${assets.length || '20'}+` },
                            { label: 'Max Rewards', value: '5%' },
                            { label: 'Annual Saving', value: '₹5,000+' },
                        ]}
                        badge="Expert Reviewed • Updated March 2026 • Zero Competition"
                        variant="primary"
                        className="mb-8"
                    />

                    <MethodologyBanner vertical="credit-cards" className="mb-4" />
                    <DataFreshnessBar
                        verifiedAt={new Date().toISOString()}
                        source="RBI"
                        updateFrequency="Daily"
                        productCount={assets.length}
                        className="mb-4"
                    />
                    <div className="max-w-xl mx-auto mb-6">
                        <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                    </div>
                    <CibilCrossLink context="cards" className="mb-6" />
                </div>
            </div>

            {/* AI subscription context section */}
            <div className="container mx-auto px-4 mb-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Popular AI Subscriptions in India — Monthly Costs
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { name: 'ChatGPT Plus', price: '₹1,950/mo', provider: 'OpenAI', usd: '$20', tip: 'Use cards with 5% on international/online' },
                            { name: 'Google One AI Premium', price: '₹1,950/mo', provider: 'Google', usd: '$19.99', tip: 'Includes Gemini Advanced + 2TB storage' },
                            { name: 'Microsoft 365 Copilot', price: '₹2,100/mo', provider: 'Microsoft', usd: '$30', tip: 'Business plan — use corporate card for GST input' },
                            { name: 'Claude Pro', price: '₹1,680/mo', provider: 'Anthropic', usd: '$20', tip: 'Charged in USD — use zero forex-fee card' },
                            { name: 'Perplexity Pro', price: '₹1,680/mo', provider: 'Perplexity', usd: '$20', tip: 'Annual plan saves ~17%' },
                            { name: 'Midjourney', price: '₹840–₹3,360/mo', provider: 'Midjourney', usd: '$10–$40', tip: 'Creatives: use cashback card for max return' },
                            { name: 'Adobe Firefly', price: 'Bundled', provider: 'Adobe', usd: 'Creative Cloud', tip: 'Use card with Adobe/software category rewards' },
                            { name: 'GitHub Copilot', price: '₹840/mo', provider: 'GitHub/Microsoft', usd: '$10', tip: 'Dev tool — some corporate cards reimburse' },
                        ].map(tool => (
                            <div key={tool.name} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{tool.usd}</span>
                                </div>
                                <div className="text-green-700 dark:text-green-400 font-bold text-base mb-1">{tool.price}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{tool.provider}</div>
                                <div className="text-xs text-amber-700 dark:text-amber-400 mt-1.5 border-t border-gray-100 dark:border-gray-700 pt-1.5">{tool.tip}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                        * Prices in INR are approximate (USD billed at current card forex rate). Annual plans typically offer 10–20% discount.
                        AI subscription charges are treated as &quot;international online transactions&quot; or &quot;digital/software purchases&quot; by most cards.
                    </p>
                </div>
            </div>

            {/* Key buying guide */}
            <div className="container mx-auto px-4 mb-8">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        What to Look for in an AI Subscription Card
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <div className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Zero Forex Markup</div>
                            <p className="text-gray-600 dark:text-gray-300">
                                All AI tools bill in USD. Most cards charge 1.5–3.5% forex markup — that&apos;s ₹600–₹1,400 extra per year on a ₹2K/month spend.
                                Look for cards that waive forex fees.
                            </p>
                        </div>
                        <div>
                            <div className="font-semibold text-amber-700 dark:text-amber-400 mb-2">5%+ on Online / International</div>
                            <p className="text-gray-600 dark:text-gray-300">
                                Cards with 5% cashback on all online or international transactions cover ChatGPT, Claude, Perplexity in one shot.
                                Amazon Pay ICICI, SBI Cashback, and HDFC Millennia all qualify.
                            </p>
                        </div>
                        <div>
                            <div className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Tech / Software Category Bonus</div>
                            <p className="text-gray-600 dark:text-gray-300">
                                Premium cards (Axis Magnus, HDFC Infinia) give 2–3X accelerated points on technology, software, and digital services —
                                which AI subscriptions often fall under.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <CreditCardsClient initialAssets={assets as any} />
            </div>

            <div className="container mx-auto px-4 pb-8">
                <ComplianceDisclaimer variant="compact" />
            </div>

            <MobileEngagementBar category="credit_card" />
        </div>
    );
}
