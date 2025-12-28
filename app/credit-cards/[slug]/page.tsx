import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/common/SEOHead';
import {
    generateCreditCardStructuredData,
    generateBreadcrumbStructuredData,
    combineStructuredData,
} from '@/lib/seo/structured-data';
import { CheckCircle2, XCircle, ExternalLink, Calendar } from 'lucide-react';
import RankingExplanation from '@/components/ranking/RankingExplanation';
import DataProvenance from '@/components/common/DataProvenance';

interface CreditCardPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CreditCardPageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from('products')
        .select('name, meta_title, meta_description, provider')
        .eq('slug', slug)
        .eq('product_type', 'credit_card')
        .single();

    if (!product) {
        return {
            title: 'Credit Card Not Found',
        };
    }

    return {
        title: product.meta_title || `${product.name} - Credit Card Review | InvestingPro`,
        description: product.meta_description || `Detailed review and comparison of ${product.name} by ${product.provider}. Compare fees, rewards, and features.`,
    };
}

export default async function CreditCardPage({ params }: CreditCardPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch product data
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('product_type', 'credit_card')
        .single();

    if (!product) {
        notFound();
    }

    // Fetch credit card specific data
    const { data: cardData } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('product_id', product.id)
        .single();

    // Fetch data points with provenance
    const { data: dataPoints } = await supabase
        .from('product_data_points')
        .select(`
            *,
            data_sources (
                name,
                url,
                is_verified
            )
        `)
        .eq('product_id', product.id)
        .order('fetched_at', { ascending: false });

    // Fetch ranking (optional - may not exist)
    const { data: ranking } = await supabase
        .from('rankings')
        .select(`
            *,
            ranking_configurations (
                name,
                methodology
            )
        `)
        .eq('product_id', product.id)
        .eq('ranking_configurations.is_published', true)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    // Generate structured data
    const productStructuredData = generateCreditCardStructuredData({
        name: product.name,
        provider: product.provider,
        slug: product.slug,
        annualFee: cardData?.annual_fee || undefined,
        interestRate: cardData?.interest_rate_min || undefined,
        rewardRate: cardData?.reward_rate || undefined,
        description: product.meta_description || undefined,
        url: `https://investingpro.in/credit-cards/${slug}`,
        lastUpdated: product.last_updated_at || new Date().toISOString(),
    });

    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Home', url: 'https://investingpro.in' },
        { name: 'Credit Cards', url: 'https://investingpro.in/credit-cards' },
        { name: product.name, url: `https://investingpro.in/credit-cards/${slug}` },
    ]);

    const structuredData = combineStructuredData(productStructuredData, breadcrumbData);

    return (
        <>
            <SEOHead
                title={product.meta_title || `${product.name} - Credit Card Review`}
                description={product.meta_description || `Detailed review of ${product.name}`}
                url={`https://investingpro.in/credit-cards/${slug}`}
                structuredData={JSON.parse(structuredData)}
            />
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Breadcrumb */}
                    <nav className="text-sm text-slate-600 mb-8">
                        <a href="/" className="hover:text-slate-900">Home</a>
                        {' / '}
                        <a href="/credit-cards" className="hover:text-slate-900">Credit Cards</a>
                        {' / '}
                        <span className="text-slate-900">{product.name}</span>
                    </nav>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                                    {product.name}
                                </h1>
                                <p className="text-xl text-slate-600">{product.provider}</p>
                            </div>
                            {ranking && (
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-teal-600">
                                        {ranking.total_score.toFixed(1)}
                                    </div>
                                    <div className="text-sm text-slate-500">Score</div>
                                    <div className="text-sm text-slate-500">Rank #{ranking.rank}</div>
                                </div>
                            )}
                        </div>

                        {/* Last Updated */}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span>
                                Last updated: {new Date(product.last_updated_at).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Key Features */}
                            {cardData && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Key Features</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-slate-500 mb-1">Annual Fee</div>
                                                <div className="text-lg font-semibold">
                                                    {cardData.annual_fee === 0 ? 'Free' : `₹${cardData.annual_fee?.toLocaleString('en-IN')}`}
                                                </div>
                                            </div>
                                            {cardData.reward_rate && (
                                                <div>
                                                    <div className="text-sm text-slate-500 mb-1">Reward Rate</div>
                                                    <div className="text-lg font-semibold">{cardData.reward_rate}%</div>
                                                </div>
                                            )}
                                            {cardData.interest_rate_min && (
                                                <div>
                                                    <div className="text-sm text-slate-500 mb-1">Interest Rate</div>
                                                    <div className="text-lg font-semibold">{cardData.interest_rate_min}% APR</div>
                                                </div>
                                            )}
                                            {cardData.min_income && (
                                                <div>
                                                    <div className="text-sm text-slate-500 mb-1">Min Income</div>
                                                    <div className="text-lg font-semibold">₹{(cardData.min_income / 100000).toFixed(1)}L</div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Ranking Explanation - CORE FEATURE */}
                            {ranking && ranking.factor_scores && Object.keys(ranking.factor_scores).length > 0 && (
                                <RankingExplanation
                                    totalScore={ranking.total_score}
                                    rank={ranking.rank}
                                    breakdown={Object.entries(ranking.factor_scores as Record<string, any>).map(([factor, data]) => ({
                                        factor,
                                        rawValue: data?.rawValue ?? '',
                                        normalizedScore: data?.normalizedScore ?? 0,
                                        weight: data?.weight ?? 0,
                                        weightedScore: data?.weightedScore ?? 0,
                                        explanation: data?.explanation || `Factor: ${factor.replace(/_/g, ' ')}`
                                    }))}
                                    strengths={(ranking.strengths as string[]) || []}
                                    weaknesses={(ranking.weaknesses as string[]) || []}
                                    explanation={ranking.explanation_text || undefined}
                                    methodology={(ranking.ranking_configurations as any)?.methodology || undefined}
                                    calculatedAt={ranking.calculated_at || undefined}
                                    dataSnapshotDate={ranking.data_snapshot_date || undefined}
                                />
                            )}

                            {/* Data Provenance - MANDATORY */}
                            {dataPoints && dataPoints.length > 0 && (
                                <DataProvenance
                                    dataPoints={dataPoints as any}
                                    lastUpdated={product.last_updated_at || undefined}
                                />
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* CTA Card */}
                            <Card className="bg-teal-50 border-teal-200">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-slate-900 mb-2">Apply Now</h3>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Compare this card with others and apply directly through the bank.
                                    </p>
                                    <a
                                        href={`/credit-cards/compare?cards=${product.slug}`}
                                        className="block w-full text-center py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                    >
                                        Compare Cards
                                    </a>
                                </CardContent>
                            </Card>

                            {/* Methodology Link */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-slate-900 mb-2">How We Rank</h3>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Our rankings are transparent, data-driven, and unbiased.
                                    </p>
                                    <a
                                        href="/methodology"
                                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                                    >
                                        View Methodology →
                                    </a>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
