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

    const title = `${collection.name} | InvestingPro`;
    const description = collection.description || `Explore ${collection.name} on InvestingPro.`;

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
                    
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-slate-900 mb-4">
                            {collection.name}
                        </h1>
                        {collection.description && (
                            <p className="text-xl text-slate-600">
                                {collection.description}
                            </p>
                        )}
                    </div>

                    {/* Collection content will be dynamically generated here */}
                    <div className="bg-white rounded-lg border border-slate-200 p-8">
                        <p className="text-slate-500">
                            Content for {collection.name} is being generated. Please check back soon.
                        </p>
                    </div>

                    {/* Navigation links */}
                    <div className="mt-8 pt-8 border-t border-slate-200 flex gap-4">
                        <Link
                            href={`/${categorySlug}/${intentSlug}`}
                            className="text-teal-600 hover:text-teal-700 font-medium"
                        >
                            ← Back to {intent.name}
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link
                            href={`/${categorySlug}`}
                            className="text-teal-600 hover:text-teal-700 font-medium"
                        >
                            {category.name}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

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

