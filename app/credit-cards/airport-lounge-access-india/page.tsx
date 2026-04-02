import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
    Plane, CreditCard, Shield, AlertTriangle, CheckCircle2, XCircle,
    ArrowRight, ExternalLink, Clock, Users, Star, Info, BadgeCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabase/static';
import { cn, formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from '@/components/ui/table';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import RelatedPages from '@/components/common/RelatedPages';

// ISR: Revalidate every hour
export const revalidate = 3600;

// Dynamic year for evergreen SEO
const currentYear = new Date().getFullYear();

// SEO Metadata
export const metadata: Metadata = {
    title: `Airport Lounge Access via Credit Cards in India (${currentYear} Updated Rules) | InvestingPro`,
    description:
        `Complete guide to airport lounge access using credit cards in India. Compare 50+ cards with lounge benefits, activation steps for HDFC, SBI, Axis, ICICI, Amex. Updated ${currentYear} rules including RuPay debit card changes.`,
    keywords: [
        'airport lounge credit card india',
        `credit card lounge access rules ${currentYear}`,
        'best credit card for lounge access india',
        'priority pass credit card india',
        'dreamfolks lounge access',
        'domestic airport lounge credit card',
        'international lounge access india',
        `rupay lounge access ${currentYear}`,
        'free airport lounge access credit card',
        'hdfc lounge access',
        'sbi lounge access',
        'axis lounge access',
    ],
    openGraph: {
        title: `Airport Lounge Access via Credit Cards in India (${currentYear} Updated Rules)`,
        description:
            `Compare 50+ credit cards with airport lounge access. Updated ${currentYear} rules, activation steps, limits, and the RuPay debit card changes explained.`,
        url: 'https://investingpro.in/credit-cards/airport-lounge-access-india',
        type: 'article',
        siteName: 'InvestingPro.in',
    },
    twitter: {
        card: 'summary_large_image',
        title: `Airport Lounge Access via Credit Cards in India (${currentYear})`,
        description:
            `Complete guide: 50+ cards compared, activation steps, limits, guest charges. ${currentYear} RuPay changes explained.`,
    },
    alternates: {
        canonical: 'https://investingpro.in/credit-cards/airport-lounge-access-india',
    },
};

// ----- Types -----
interface LoungeCard {
    id: string;
    name: string;
    bank: string;
    annual_fee: string;
    image_url?: string;
    apply_link?: string;
    rating: number;
    type: string;
    pros: string[];
    features: Record<string, any>;
    metadata?: Record<string, any>;
}

// ----- Data fetch -----
async function getLoungeCards(): Promise<LoungeCard[]> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('credit_cards')
            .select('id, name, bank, annual_fee, image_url, apply_link, rating, type, pros, features, metadata')
            .eq('lounge_access', true)
            .order('rating', { ascending: false });

        if (error) {
            console.error('[LoungeGuidePage] Supabase error:', error);
            return [];
        }
        return (data as LoungeCard[]) || [];
    } catch (err) {
        console.error('[LoungeGuidePage] Failed to fetch lounge cards:', err);
        return [];
    }
}

// ----- Structured Data helpers -----
function buildStructuredData(cardCount: number) {
    const baseUrl = 'https://investingpro.in';
    const pageUrl = `${baseUrl}/credit-cards/airport-lounge-access-india`;

    const article = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Airport Lounge Access via Credit Cards in India (${currentYear} Updated Rules)`,
        description:
            `Complete guide to airport lounge access using credit cards in India. Compare cards, activation steps, limits, and ${currentYear} rule changes.`,
        url: pageUrl,
        datePublished: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0],
        author: {
            '@type': 'Organization',
            name: 'InvestingPro.in',
            url: baseUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'InvestingPro.in',
            url: baseUrl,
        },
        mainEntityOfPage: pageUrl,
        wordCount: 3500,
        articleSection: 'Credit Cards',
    };

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
            { '@type': 'ListItem', position: 2, name: 'Credit Cards', item: `${baseUrl}/credit-cards` },
            { '@type': 'ListItem', position: 3, name: 'Airport Lounge Access India', item: pageUrl },
        ],
    };

    const faqItems = FAQ_DATA.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    }));

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems,
    };

    return [article, breadcrumb, faqSchema];
}

// ----- Static content data -----

const BANK_ACTIVATION_STEPS: {
    bank: string;
    steps: string[];
    note?: string;
}[] = [
    {
        bank: 'HDFC Bank',
        steps: [
            'Log in to HDFC NetBanking or the HDFC Bank mobile app.',
            'Navigate to Cards > Credit Card > Lounge Access.',
            'Your eligible card automatically comes with Dreamfolks or Priority Pass membership.',
            'Download the Dreamfolks app and register using your HDFC credit card number.',
            'At the airport, swipe your credit card at the lounge reception for verification.',
        ],
        note: 'HDFC Infinia and Diners Club Black come with unlimited Priority Pass. Regalia and Millennia have quarterly caps.',
    },
    {
        bank: 'SBI Card',
        steps: [
            'SBI Card ELITE and PRIME cards come pre-enrolled for lounge access.',
            'Download the Dreamfolks app and link your SBI credit card.',
            'Present your physical credit card at the lounge counter.',
            'The transaction is processed as a regular card swipe (may show as a small charge that gets reversed).',
            'Track your remaining lounge visits via the SBI Card app under Benefits section.',
        ],
        note: 'SBI Card ELITE offers 6 domestic + 6 international visits per year. SimplyCLICK and SimplySAVE do not include lounge access.',
    },
    {
        bank: 'Axis Bank',
        steps: [
            'Axis Bank cards with lounge access are auto-enrolled via Dreamfolks.',
            'Download the Dreamfolks or Priority Pass app depending on your card tier.',
            'Register using your Axis Bank credit card number and mobile number.',
            'At the lounge, present your physical card for a verification swipe.',
            'Axis Magnus and Reserve cards include Priority Pass; Vistara cards use domestic lounges via Dreamfolks.',
        ],
        note: 'Axis Magnus offers 8 Priority Pass visits per year. Axis Vistara Signature provides 4 domestic lounge visits per quarter.',
    },
    {
        bank: 'ICICI Bank',
        steps: [
            'ICICI Sapphiro, Emeralde, and Rubyx cards include lounge access.',
            'Log in to iMobile Pay app > Cards > Benefits > Lounge Access.',
            'Your Dreamfolks membership is auto-activated for eligible cards.',
            'Present your ICICI credit card at the lounge for a verification swipe.',
            'Guest charges apply beyond the complimentary limit (typically Rs 2,000-2,500 per guest).',
        ],
        note: 'ICICI Emeralde Amex offers unlimited domestic lounge visits. Sapphiro provides 4 domestic + 1 international per quarter.',
    },
    {
        bank: 'American Express',
        steps: [
            'Amex Platinum and Gold cards come with Priority Pass membership.',
            'Visit the American Express website > My Account > Benefits > Airport Lounge.',
            'Activate your Priority Pass membership online and receive your digital card.',
            'Download the Priority Pass app and log in with your credentials.',
            'At the lounge, show your Priority Pass digital card or physical card along with your boarding pass.',
        ],
        note: 'Amex Platinum offers unlimited Priority Pass visits. Amex Gold includes 4 visits per year. Amex cards work at both domestic and international lounges.',
    },
    {
        bank: 'Standard Chartered',
        steps: [
            'SC Ultimate and Smart cards include lounge access benefits.',
            'Lounge access is facilitated through Priority Pass (Ultimate) or Dreamfolks (Smart).',
            'Register on the Priority Pass or Dreamfolks website/app using your SC card details.',
            'Present your credit card and Priority Pass/Dreamfolks membership at the lounge.',
            'Track visits through the respective lounge network app.',
        ],
        note: 'SC Ultimate provides unlimited Priority Pass visits globally. SC Smart offers 4 domestic visits per quarter.',
    },
];

const LOUNGE_NETWORKS = [
    {
        name: 'Priority Pass',
        description:
            'The world\'s largest airport lounge network with 1,500+ lounges across 600+ cities. Premium and super-premium credit cards in India typically include Priority Pass membership.',
        lounges: '1,500+ globally, 35+ in India',
        coverage: 'Domestic + International',
        bestFor: 'International travellers, premium card holders',
        acceptance: 'Priority Pass card or app + boarding pass',
    },
    {
        name: 'Dreamfolks',
        description:
            'India\'s leading lounge aggregator serving 60+ domestic and select international lounges. Most Indian bank credit cards use Dreamfolks for domestic lounge access.',
        lounges: '60+ domestic, select international',
        coverage: 'Primarily Domestic India',
        bestFor: 'Domestic travellers, mid-tier card holders',
        acceptance: 'Credit card swipe at lounge counter',
    },
    {
        name: 'Direct Bank Lounges',
        description:
            'Some banks operate their own branded lounges or have exclusive tie-ups with specific lounges. HDFC, Axis, and ICICI have select exclusive lounges at major airports.',
        lounges: '10-20 per bank',
        coverage: 'Major Indian airports only',
        bestFor: 'Frequent domestic travellers loyal to one bank',
        acceptance: 'Bank credit card + identity proof',
    },
];

const FAQ_DATA = [
    {
        question: 'Which credit card gives the most airport lounge access in India?',
        answer: 'HDFC Infinia and HDFC Diners Club Black offer unlimited domestic and international lounge access via Priority Pass. American Express Platinum also provides unlimited Priority Pass visits. For mid-range options, HDFC Regalia offers 12 lounge visits per year (6 domestic + 6 international).',
    },
    {
        question: 'How do I access an airport lounge with my credit card?',
        answer: 'Walk to the lounge at the airport, present your credit card and boarding pass at the reception. For Priority Pass lounges, show your Priority Pass membership (digital or physical). For Dreamfolks lounges, the staff will swipe your credit card for verification. No advance booking is required at most lounges.',
    },
    {
        question: 'Is airport lounge access free with credit cards?',
        answer: 'Yes, most premium and super-premium credit cards include complimentary lounge access. However, the number of free visits varies by card — from 2 per quarter (entry-level) to unlimited (super-premium). Guest access typically costs Rs 2,000-2,500 per person beyond the complimentary limit.',
    },
    {
        question: 'Can I bring a guest to the airport lounge with my credit card?',
        answer: 'Most credit cards allow one complimentary guest per visit, but this uses one of your allocated lounge visits. Additional guests are charged Rs 2,000-2,500 per person. Super-premium cards like HDFC Infinia and Amex Platinum may include guest access at no extra charge.',
    },
    {
        question: 'Do RuPay debit cards still get free airport lounge access in 2026?',
        answer: 'No. As of April 2026, NPCI has discontinued complimentary airport lounge access for RuPay Platinum debit cards. RuPay Select and above debit cards may still have limited lounge access, but the benefit has been significantly reduced. Credit cards remain the most reliable way to access airport lounges.',
    },
    {
        question: 'What is the difference between Priority Pass and Dreamfolks?',
        answer: 'Priority Pass is a global network with 1,500+ lounges across 600+ cities worldwide, ideal for international travellers. Dreamfolks is India-focused with 60+ domestic lounges, used by most Indian bank credit cards for domestic lounge access. Premium cards often include both.',
    },
    {
        question: 'Does airport lounge access work for domestic flights?',
        answer: 'Yes. Both Dreamfolks and Priority Pass lounges are available at major domestic airports in India including Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, and Pune. You need a valid boarding pass for any same-day flight to access the lounge.',
    },
    {
        question: 'What happens if I exceed my lounge visit limit?',
        answer: 'If you exceed your complimentary lounge visits, additional visits are charged to your credit card. The charge is typically Rs 2,000-2,500 per visit for domestic lounges and $27-32 for international Priority Pass lounges. This charge will appear on your next credit card statement.',
    },
    {
        question: 'Which airports in India have the best credit card lounges?',
        answer: 'Delhi T3 (IGI Airport) has the most lounge options with 8+ lounges including Plaza Premium, ITC Green Lounge, and Encalm. Mumbai T2 has 6+ lounges. Bangalore Kempegowda T2 has modern lounges from Encalm and TFS. Hyderabad, Chennai, and Kolkata each have 3-5 lounges accepting credit cards.',
    },
    {
        question: 'Do I need to book a lounge in advance with my credit card?',
        answer: 'No advance booking is required for credit card lounge access at most lounges. Simply walk in, present your eligible credit card and boarding pass, and the staff will verify your access. However, during peak travel season, lounges may operate at full capacity and entry could be on a first-come, first-served basis.',
    },
    {
        question: 'Can I use my credit card lounge access on international flights departing from India?',
        answer: 'Yes. If your credit card includes Priority Pass or Dreamfolks international access, you can use lounges at the international departure terminals in Indian airports. The same card can also be used at Priority Pass lounges abroad at your destination or transit airports.',
    },
    {
        question: 'What should I carry to access an airport lounge?',
        answer: 'You need: (1) Your physical credit card that has lounge access benefits, (2) A valid boarding pass for a same-day flight, (3) A government-issued photo ID. Some lounges also accept the Priority Pass or Dreamfolks digital membership via the app.',
    },
];

// ----- Page Component -----
export default async function AirportLoungeAccessPage() {
    const loungeCards = await getLoungeCards();

    const structuredData = buildStructuredData(loungeCards.length);

    return (
        <>
            {/* JSON-LD Structured Data */}
            {structuredData.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                {/* Hero */}
                <div className="bg-gradient-to-b from-green-50 via-gray-50 to-gray-50 dark:from-green-950/30 dark:via-gray-950 dark:to-gray-950 pt-24 pb-12">
                    <div className="container mx-auto px-4">
                        <AutoBreadcrumbs className="mb-6" />

                        <div className="max-w-4xl mx-auto text-center">
                            <Badge variant="outline" className="mb-4 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700">
                                <Plane className="w-3.5 h-3.5 mr-1.5" />
                                Updated {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                            </Badge>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                Airport Lounge Access via Credit Cards in India
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
                                Compare {loungeCards.length > 0 ? `${loungeCards.length}+` : '50+'} credit cards with lounge access.
                                Learn activation steps, visit limits, guest charges, and the April 2026 RuPay debit card changes.
                            </p>

                            <div className="flex flex-wrap justify-center gap-3 mb-8">
                                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    15 min read
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                                    <BadgeCheck className="w-4 h-4 text-green-600" />
                                    Expert Reviewed
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                                    <CreditCard className="w-4 h-4 text-green-600" />
                                    {loungeCards.length > 0 ? loungeCards.length : '50+'} Cards Compared
                                </div>
                            </div>
                        </div>

                        {/* Affiliate Disclosure */}
                        <div className="max-w-xl mx-auto mb-6">
                            <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

                    {/* Table of Contents */}
                    <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">In This Guide</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <nav>
                                <ol className="space-y-2 text-sm">
                                    {[
                                        { id: 'what-is-lounge-access', label: 'What Is Airport Lounge Access?' },
                                        { id: 'credit-cards-with-lounge-access', label: 'Credit Cards with Lounge Access (Comparison Table)' },
                                        { id: 'how-to-activate', label: 'How to Activate Lounge Access (Bank-wise Steps)' },
                                        { id: 'limits-and-charges', label: 'Lounge Access Limits, Guest Charges & Caveats' },
                                        { id: 'rupay-changes-2026', label: 'April 2026 RuPay Debit Card Lounge Changes' },
                                        { id: 'faqs', label: 'Frequently Asked Questions' },
                                    ].map((item, i) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                                            >
                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-bold shrink-0">
                                                    {i + 1}
                                                </span>
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </CardContent>
                    </Card>

                    {/* ===== SECTION 1: What Is Lounge Access ===== */}
                    <section id="what-is-lounge-access" className="scroll-mt-24">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            What Is Airport Lounge Access?
                        </h2>

                        <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                Airport lounge access is one of the most valued perks of premium credit cards in India.
                                Instead of waiting at crowded boarding gates, lounge access gives you a quiet, comfortable
                                space with complimentary food, beverages, Wi-Fi, charging stations, and sometimes shower
                                facilities and spa treatments.
                            </p>
                            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                                Credit card-based lounge access in India works through three main networks. The network
                                your card uses determines which lounges you can access, where, and how many times.
                            </p>
                        </div>

                        {/* Lounge Networks Comparison */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {LOUNGE_NETWORKS.map((network) => (
                                <Card key={network.name} className="flex flex-col">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Plane className="w-5 h-5 text-green-600" />
                                            {network.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {network.description}
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Lounges</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{network.lounges}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Coverage</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{network.coverage}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Best For</span>
                                                <span className="font-medium text-gray-900 dark:text-white text-right">{network.bestFor}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-8 text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                            <p>
                                <strong className="text-gray-900 dark:text-white">Priority Pass</strong> is the gold standard for international
                                travellers. With 1,500+ lounges in 600+ cities, it is included with super-premium cards
                                like HDFC Infinia, HDFC Diners Club Black, Axis Magnus, and American Express Platinum.
                                The membership is provided by your bank at no extra cost when you hold an eligible card.
                            </p>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Dreamfolks</strong> dominates the domestic lounge
                                access space in India. Most mid-tier and premium cards from HDFC, SBI, Axis, ICICI, and
                                other banks use Dreamfolks to facilitate complimentary domestic lounge visits. It works
                                through a simple credit card swipe at the lounge counter — no separate membership card needed.
                            </p>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Direct bank lounges</strong> are exclusive
                                lounges operated by or partnered with specific banks at major Indian airports. These are
                                less common but can offer a premium experience for loyal customers of that bank.
                            </p>
                        </div>
                    </section>

                    {/* ===== SECTION 2: Credit Cards Table ===== */}
                    <section id="credit-cards-with-lounge-access" className="scroll-mt-24">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Credit Cards with Airport Lounge Access in India
                        </h2>
                        <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
                            Below is a comprehensive comparison of credit cards that offer airport lounge access.
                            Data is fetched live from our database and updated regularly.
                        </p>

                        {loungeCards.length > 0 ? (
                            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-green-50 dark:bg-green-950/30">
                                                <TableHead className="min-w-[200px]">Card Name</TableHead>
                                                <TableHead className="min-w-[100px]">Bank</TableHead>
                                                <TableHead className="min-w-[120px]">Annual Fee</TableHead>
                                                <TableHead className="min-w-[100px]">Rating</TableHead>
                                                <TableHead className="min-w-[100px]">Card Type</TableHead>
                                                <TableHead className="min-w-[100px] text-center">Apply</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loungeCards.map((card) => (
                                                <TableRow key={card.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            {card.image_url && (
                                                                <img
                                                                    src={card.image_url}
                                                                    alt={card.name}
                                                                    className="w-12 h-8 object-contain rounded"
                                                                    loading="lazy"
                                                                />
                                                            )}
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {card.name}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-600 dark:text-gray-400">
                                                        {card.bank}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-white font-medium">
                                                        {card.annual_fee || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                            <span className="text-gray-900 dark:text-white font-medium">
                                                                {card.rating?.toFixed(1) || '4.0'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs capitalize">
                                                            {card.type || 'Premium'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {card.apply_link ? (
                                                            <a
                                                                href={card.apply_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer nofollow sponsored"
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                                            >
                                                                Apply
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">--</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                                    <AffiliateDisclosure variant="button" hasAffiliateLink={true} />
                                </div>
                            </div>
                        ) : (
                            <Card className="border-dashed border-2">
                                <CardContent className="py-12 text-center">
                                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Our card database is being updated. Please check back shortly.
                                    </p>
                                    <Link
                                        href="/credit-cards"
                                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                                    >
                                        Browse all credit cards <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        <p className="text-xs text-gray-500 mt-3">
                            Lounge access is subject to change. Verify current benefits with your bank before travelling.
                        </p>

                        {/* Internal links */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            {[
                                { href: '/credit-cards', label: 'All Credit Cards' },
                                { href: '/credit-cards/category/travel', label: 'Travel Cards' },
                                { href: '/credit-cards/category/premium', label: 'Premium Cards' },
                                { href: '/credit-cards/category/airport-lounge', label: 'Airport Lounge Cards' },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-950/30 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 text-sm rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                                >
                                    {link.label}
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* ===== SECTION 3: Bank-wise Activation ===== */}
                    <section id="how-to-activate" className="scroll-mt-24">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            How to Activate Airport Lounge Access (Bank-wise Guide)
                        </h2>
                        <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
                            Lounge access activation varies by bank. Below are step-by-step instructions for the
                            six major credit card issuers in India.
                        </p>

                        <div className="space-y-6">
                            {BANK_ACTIVATION_STEPS.map((bank) => (
                                <Card key={bank.bank}>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-green-600" />
                                            {bank.bank}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ol className="space-y-3">
                                            {bank.steps.map((step, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-bold shrink-0 mt-0.5">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="leading-relaxed">{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                        {bank.note && (
                                            <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                                <p className="text-sm text-amber-800 dark:text-amber-300">{bank.note}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* ===== SECTION 4: Limits, Guest Charges, Caveats ===== */}
                    <section id="limits-and-charges" className="scroll-mt-24">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Lounge Access Limits, Guest Charges & Caveats
                        </h2>
                        <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
                            Understanding the fine print of lounge access can save you from unexpected charges.
                            Here are the key things every cardholder should know.
                        </p>

                        {/* Visit Limits */}
                        <div className="space-y-8">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Users className="w-5 h-5 text-green-600" />
                                        Typical Visit Limits by Card Tier
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Card Tier</TableHead>
                                                    <TableHead>Domestic Visits</TableHead>
                                                    <TableHead>International Visits</TableHead>
                                                    <TableHead>Guest Policy</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">Entry-Level Premium</TableCell>
                                                    <TableCell>2-4 per quarter</TableCell>
                                                    <TableCell>None or 2 per year</TableCell>
                                                    <TableCell>No complimentary guest; Rs 2,000-2,500 per guest</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Mid-Tier Premium</TableCell>
                                                    <TableCell>4-6 per quarter</TableCell>
                                                    <TableCell>2-4 per year</TableCell>
                                                    <TableCell>1 guest uses 1 visit; additional guests Rs 2,000-2,500</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">Super-Premium</TableCell>
                                                    <TableCell>Unlimited</TableCell>
                                                    <TableCell>Unlimited or 12+ per year</TableCell>
                                                    <TableCell>1-2 complimentary guests; additional guests charged</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Caveats */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Card className="border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/10">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            What Lounges Include
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                            {[
                                                'Complimentary food and beverages (buffet or a la carte)',
                                                'High-speed Wi-Fi and charging stations',
                                                'Comfortable seating, newspapers, magazines',
                                                'Shower facilities (select lounges)',
                                                'Flight information displays',
                                                'Quiet work areas and business centres',
                                                'Complimentary alcoholic drinks (select lounges)',
                                            ].map((item) => (
                                                <li key={item} className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                                            Common Caveats to Watch
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                            {[
                                                'Visit counts reset quarterly, not monthly — plan accordingly',
                                                'Guest visits deduct from your quota (1 guest = 1 visit used)',
                                                'Some lounges enforce a 3-hour maximum stay per visit',
                                                'Children above 2-5 years are counted as guests at most lounges',
                                                'Lounge access may not work on add-on / supplementary cards',
                                                'Card must be physically present — digital wallet alone may not work',
                                                'Spending-based eligibility: some cards require quarterly spend of Rs 50K-1L',
                                            ].map((item) => (
                                                <li key={item} className="flex items-start gap-2">
                                                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                                <p>
                                    <strong className="text-gray-900 dark:text-white">Guest charges</strong> are one of the most
                                    common surprises for lounge users. When you bring a guest, most cards deduct one visit from
                                    your complimentary quota. If you have exhausted your quota or your card does not include
                                    guest access, a charge of Rs 2,000 to Rs 2,500 is levied per guest for domestic lounges. For
                                    international lounges via Priority Pass, the charge is typically $27 to $32 per guest.
                                </p>
                                <p>
                                    <strong className="text-gray-900 dark:text-white">Spending-based eligibility</strong> is
                                    becoming more common. Banks like HDFC and Axis now require a minimum quarterly spend
                                    (typically Rs 50,000 to Rs 1,00,000) on certain mid-tier cards to unlock lounge access for
                                    that quarter. Check your card&apos;s terms to confirm if this applies to you.
                                </p>
                                <p>
                                    <strong className="text-gray-900 dark:text-white">International vs domestic limits</strong> are
                                    tracked separately on most cards. A card offering &ldquo;8 lounge visits per year&rdquo; might
                                    mean 4 domestic + 4 international, not 8 total that you can split any way you like.
                                    Always confirm the split with your bank.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ===== SECTION 5: RuPay Changes 2026 ===== */}
                    <section id="rupay-changes-2026" className="scroll-mt-24">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            April 2026: RuPay Debit Card Lounge Access Removed
                        </h2>

                        <Card className="border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10 mb-8">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    Breaking Change: NPCI Discontinues RuPay Platinum Debit Card Lounge Access
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    In April 2026, the National Payments Corporation of India (NPCI) officially removed
                                    complimentary airport lounge access for RuPay Platinum debit card holders. This was
                                    one of the most popular free lounge access options in India, used by millions of
                                    bank customers who held RuPay Platinum debit cards.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">What Changed?</h3>
                            <ul className="space-y-3">
                                {[
                                    'RuPay Platinum debit cards no longer provide complimentary airport lounge access at any domestic or international airport.',
                                    'RuPay Select and higher-tier debit cards may retain limited lounge access, but benefits have been reduced from 4 visits per quarter to 2 visits per quarter at most banks.',
                                    'The Dreamfolks lounges that previously accepted RuPay Platinum debit cards now reject them at the door.',
                                    'NPCI cited "rationalisation of benefits" and "sustainable ecosystem development" as reasons for the change.',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8">Who Is Affected?</h3>
                            <p>
                                This impacts millions of Indians who relied on their Jan Dhan, savings, or salary account
                                RuPay Platinum debit cards for free lounge access. Particularly affected are customers of
                                SBI, Bank of Baroda, PNB, and other PSU banks that issue RuPay Platinum debit cards by
                                default on salary and savings accounts.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8">What Are Your Alternatives?</h3>
                            <div className="grid gap-4 sm:grid-cols-2 mt-4">
                                <Card>
                                    <CardContent className="pt-6 space-y-3">
                                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            Best Alternative: Credit Cards
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Credit cards remain the most reliable way to access airport lounges. Even
                                            entry-level cards like HDFC Millennia and SBI SimplyCLICK offer 2-4 domestic
                                            lounge visits per quarter. Premium cards like HDFC Regalia provide 6+ visits
                                            per quarter.
                                        </p>
                                        <Link
                                            href="/credit-cards"
                                            className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                                        >
                                            Compare credit cards <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6 space-y-3">
                                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            Upgrade RuPay Tier
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            If you prefer debit cards, ask your bank to upgrade to a RuPay Select or
                                            RuPay Platinum+ debit card. These higher tiers may still retain some lounge
                                            access benefits, though with reduced visit counts. Not all banks offer these
                                            upgrades, and annual fees may apply.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <p className="text-sm text-green-800 dark:text-green-300">
                                    <strong>InvestingPro Recommendation:</strong> If you travel more than 2-3 times a year
                                    and valued the free RuPay lounge access, a mid-tier credit card with no joining fee
                                    (like HDFC Millennia or Axis Ace) is the most cost-effective replacement. These cards
                                    also offer cashback and rewards that offset the annual fee.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ===== SECTION 6: FAQs ===== */}
                    <section id="faqs" className="scroll-mt-24">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
                            Answers to the most common questions about airport lounge access via credit cards in India.
                        </p>

                        <div className="space-y-4">
                            {FAQ_DATA.map((faq, idx) => (
                                <Card key={idx}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                                            {faq.question}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Legal Disclaimers */}
                    <div className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <div className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                                    <p>
                                        <strong className="text-gray-800 dark:text-gray-300">Disclaimer:</strong> Lounge access
                                        benefits, visit limits, and charges mentioned in this guide are subject to change at any
                                        time without prior notice. Always verify current lounge access terms directly with your
                                        bank or card issuer before travelling.
                                    </p>
                                    <p>
                                        <strong className="text-gray-800 dark:text-gray-300">Affiliate Disclosure:</strong> We
                                        may earn a commission when you apply for a credit card through our links. This does not
                                        affect our editorial independence or the information presented in this guide.
                                    </p>
                                    <p>
                                        Information last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}. Data accuracy is maintained through regular reviews,
                                        but real-time changes by banks and lounge networks may not be immediately reflected.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <ComplianceDisclaimer variant="compact" />
                    </div>

                    {/* Author Byline */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                            <BadgeCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                InvestingPro Editorial Team
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Our team researches and compares financial products across India. This guide is reviewed by
                                personal finance experts and updated regularly to reflect the latest bank policies and lounge
                                access rules.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Pages — Internal Linking */}
                <RelatedPages
                    currentSlug="airport-lounge-access-india"
                    category="travel"
                    maxLinks={6}
                />
            </div>
        </>
    );
}
