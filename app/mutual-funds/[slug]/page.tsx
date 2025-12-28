import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/common/SEOHead';
import {
    generateMutualFundStructuredData,
    generateBreadcrumbStructuredData,
    combineStructuredData,
} from '@/lib/seo/structured-data';
import { TrendingUp, TrendingDown, Calendar, ExternalLink, CheckCircle2 } from 'lucide-react';

interface MutualFundPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MutualFundPageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from('products')
        .select('name, meta_title, meta_description, provider')
        .eq('slug', slug)
        .eq('product_type', 'mutual_fund')
        .single();

    if (!product) {
        return { title: 'Mutual Fund Not Found' };
    }

    return {
        title: product.meta_title || `${product.name} - Mutual Fund Analysis | InvestingPro`,
        description: product.meta_description || `Detailed analysis of ${product.name} by ${product.provider}. Returns, risk metrics, and performance data.`,
    };
}

export default async function MutualFundPage({ params }: MutualFundPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // Try to find by slug first, then by id (for backward compatibility)
    let productQuery = supabase
        .from('products')
        .select('*')
        .eq('product_type', 'mutual_fund')
        .or(`slug.eq.${slug},id.eq.${slug}`);

    const { data: products } = await productQuery;
    const product = products?.[0];

    if (!product) {
        notFound();
    }

    const { data: fundData } = await supabase
        .from('mutual_funds')
        .select('*')
        .eq('product_id', product.id)
        .single();

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
        .single();

    const productStructuredData = generateMutualFundStructuredData({
        name: product.name,
        provider: product.provider,
        slug: product.slug,
        category: fundData?.fund_category || '',
        returns3Y: fundData?.returns_3y || undefined,
        expenseRatio: fundData?.expense_ratio || undefined,
        description: product.meta_description || undefined,
        url: `https://investingpro.in/mutual-funds/${slug}`,
        lastUpdated: product.last_updated_at || new Date().toISOString(),
    });

    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Home', url: 'https://investingpro.in' },
        { name: 'Mutual Funds', url: 'https://investingpro.in/mutual-funds' },
        { name: product.name, url: `https://investingpro.in/mutual-funds/${slug}` },
    ]);

    const structuredData = combineStructuredData(productStructuredData, breadcrumbData);

    return (
        <>
            <SEOHead
                title={product.meta_title || `${product.name} - Mutual Fund Analysis`}
                description={product.meta_description || `Detailed analysis of ${product.name}`}
                url={`https://investingpro.in/mutual-funds/${slug}`}
                structuredData={JSON.parse(structuredData)}
            />
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <nav className="text-sm text-slate-600 mb-8">
                        <a href="/" className="hover:text-slate-900">Home</a>
                        {' / '}
                        <a href="/mutual-funds" className="hover:text-slate-900">Mutual Funds</a>
                        {' / '}
                        <span className="text-slate-900">{product.name}</span>
                    </nav>

                    <div className="mb-8">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                                    {product.name}
                                </h1>
                                <p className="text-xl text-slate-600">{product.provider}</p>
                                {fundData?.fund_category && (
                                    <Badge className="mt-2">{fundData.fund_category}</Badge>
                                )}
                            </div>
                            {ranking && (
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-teal-600">
                                        {ranking.total_score.toFixed(1)}
                                    </div>
                                    <div className="text-sm text-slate-500">Score</div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span>
                                Last updated: {new Date(product.last_updated_at).toLocaleDateString('en-IN')}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Performance Metrics */}
                            {fundData && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Performance Metrics</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {fundData.returns_1y !== null && (
                                                <div>
                                                    <div className="text-sm text-slate-500 mb-1">1 Year</div>
                                                    <div className="text-lg font-semibold text-slate-900">
                                                        {fundData.returns_1y > 0 ? (
                                                            <span className="text-emerald-600 flex items-center gap-1">
                                                                <TrendingUp className="w-4 h-4" />
                                                                {fundData.returns_1y.toFixed(2)}%
                                                            </span>
                                                        ) : (
                                                            <span className="text-rose-600 flex items-center gap-1">
                                                                <TrendingDown className="w-4 h-4" />
                                                                {fundData.returns_1y.toFixed(2)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {fundData.returns_3y !== null && (
                                                <div>
                                                    <div className="text-sm text-slate-500 mb-1">3 Year</div>
                                                    <div className="text-lg font-semibold text-slate-900">
                                                        {fundData.returns_3y > 0 ? (
                                                            <span className="text-emerald-600">{fundData.returns_3y.toFixed(2)}%</span>
                                                        ) : (
                                                            <span className="text-rose-600">{fundData.returns_3y.toFixed(2)}%</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {fundData.returns_5y !== null && (
                                                <div>
                                                    <div className="text-sm text-slate-500 mb-1">5 Year</div>
                                                    <div className="text-lg font-semibold text-slate-900">
                                                        {fundData.returns_5y > 0 ? (
                                                            <span className="text-emerald-600">{fundData.returns_5y.toFixed(2)}%</span>
                                                        ) : (
                                                            <span className="text-rose-600">{fundData.returns_5y.toFixed(2)}%</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {fundData.expense_ratio !== null && (
                                                <div>
                                                    <div className="text-sm text-slate-500 mb-1">Expense Ratio</div>
                                                    <div className="text-lg font-semibold text-slate-900">
                                                        {fundData.expense_ratio.toFixed(2)}%
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Risk Metrics */}
                            {fundData && (fundData.sharpe_ratio || fundData.alpha || fundData.beta) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Risk Metrics</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4">
                                            {fundData.sharpe_ratio !== null && (
                                                <div>
                                                    <div className="text-sm text-slate-500 mb-1">Sharpe Ratio</div>
                                                    <div className="text-lg font-semibold">{fundData.sharpe_ratio.toFixed(2)}</div>
                                                </div>
                                            )}
                                            {fundData.alpha !== null && (
                                                <div>
                                                    <div className="text-sm text-slate-500 mb-1">Alpha</div>
                                                    <div className="text-lg font-semibold">{fundData.alpha.toFixed(2)}</div>
                                                </div>
                                            )}
                                            {fundData.beta !== null && (
                                                <div>
                                                    <div className="text-sm text-slate-500 mb-1">Beta</div>
                                                    <div className="text-lg font-semibold">{fundData.beta.toFixed(2)}</div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Data Sources */}
                            {dataPoints && dataPoints.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Data Sources</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {dataPoints.map((point: any) => (
                                                <div key={point.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-slate-900 capitalize">
                                                            {point.field_name.replace(/_/g, ' ')}
                                                        </div>
                                                        <div className="text-sm text-slate-600 mt-1">
                                                            {point.data_sources?.name || 'Unknown source'}
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            Updated: {new Date(point.fetched_at).toLocaleDateString('en-IN')}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {point.data_sources?.is_verified && (
                                                            <Badge className="bg-emerald-100 text-emerald-700">
                                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                                Verified
                                                            </Badge>
                                                        )}
                                                        {point.data_sources?.url && (
                                                            <a
                                                                href={point.data_sources.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-teal-600 hover:text-teal-700"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-slate-900 mb-2">Compare Funds</h3>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Compare this fund with others in the same category.
                                    </p>
                                    <a
                                        href={`/mutual-funds/compare?funds=${product.slug}`}
                                        className="block w-full text-center py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                    >
                                        Compare Now
                                    </a>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-slate-900 mb-2">How We Rank</h3>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Our rankings are transparent and data-driven.
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

