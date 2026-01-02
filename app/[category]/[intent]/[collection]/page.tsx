import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NAVIGATION_CONFIG } from '@/lib/navigation/config';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';

interface CollectionPageProps {
    params: Promise<{ category: string; intent: string; collection: string }>;
}

async function CollectionPageContent({ 
    categorySlug, 
    intentSlug,
    collectionSlug
}: { 
    categorySlug: string; 
    intentSlug: string;
    collectionSlug: string;
}) {
    // Find category, intent, and collection
    const category = NAVIGATION_CONFIG.find(cat => cat.slug === categorySlug);
    if (!category) {
        notFound();
    }

    const intent = category.intents.find(int => int.slug === intentSlug);
    if (!intent) {
        notFound();
    }

    // Find collection by matching the last segment of href
    const collection = intent.collections.find(col => {
        const hrefSegments = col.href.split('/').filter(Boolean);
        return hrefSegments[hrefSegments.length - 1] === collectionSlug;
    });

    if (!collection) {
        notFound();
    }

    // Fetch products based on category mapping
    const productCategoryMap: Record<string, any> = {
        'credit-cards': 'credit_card',
        'loans': 'loan',
        'banking': 'loan',
        'investing': 'mutual_fund',
        'insurance': 'insurance',
        'small-business': 'loan'
    };

    const categoryForProducts = productCategoryMap[categorySlug];
    let products = [];
    if (categoryForProducts) {
        const { productService } = await import('@/lib/products/product-service');
        products = await productService.getProducts(categoryForProducts);
    }

    return (
        <>
            <SEOHead
                title={title}
                description={description}
                url={collection.href}
            />
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <AutoBreadcrumbs />
                    
                    <div className="mb-12">
                        <div className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-wider mb-2">
                            <span>{category.name}</span>
                            <span>/</span>
                            <span>{intent.name}</span>
                        </div>
                        <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                            {collection.name}
                        </h1>
                        {collection.description ? (
                            <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                                {collection.description}
                            </p>
                        ) : (
                            <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                                Our experts have analyzed dozens of options to bring you the best {collection.name.toLowerCase()} in India.
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-16">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((p) => {
                                    // Dynamically import ProductCard inside map or just use it if imported at top
                                    // For simplicity, I'll import at top
                                    return <ProductCard key={p.id} product={p} />;
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 text-center shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-2xl">🔍</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found yet</h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    We're still updating our database with the latest {collection.name.toLowerCase()}. 
                                    Please check back soon for our expert analysis.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation links */}
                    <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
                        <div className="flex gap-4">
                            <Link
                                href={`/${categorySlug}/${intentSlug}`}
                                className="text-teal-600 hover:text-teal-700 font-bold text-sm uppercase tracking-wider"
                            >
                                ← Back to {intent.name} Hub
                            </Link>
                        </div>
                        <Link
                            href={`/${categorySlug}`}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                        >
                            Explore all {category.name}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

// Separate import for ProductCard to avoid issues
import ProductCard from '@/components/products/ProductCard';

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { category, intent, collection } = await params;
    
    return (
        <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
            <CollectionPageContent 
                categorySlug={category} 
                intentSlug={intent}
                collectionSlug={collection}
            />
        </Suspense>
    );
}

// Generate static params for all collections
export async function generateStaticParams() {
    const params: Array<{ category: string; intent: string; collection: string }> = [];
    
    for (const category of NAVIGATION_CONFIG) {
        for (const intent of category.intents) {
            for (const collection of intent.collections) {
                // Extract collection slug from href
                const hrefSegments = collection.href.split('/').filter(Boolean);
                const collectionSlug = hrefSegments[hrefSegments.length - 1];
                
                params.push({
                    category: category.slug,
                    intent: intent.slug,
                    collection: collectionSlug,
                });
            }
        }
    }
    
    return params;
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

