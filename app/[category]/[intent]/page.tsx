import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NAVIGATION_CONFIG, EDITORIAL_INTENTS } from '@/lib/navigation/config';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';

interface IntentPageProps {
    params: Promise<{ category: string; intent: string }>;
}

async function IntentPageContent({ 
    categorySlug, 
    intentSlug 
}: { 
    categorySlug: string; 
    intentSlug: string;
}) {
    // Find category and intent
    const category = NAVIGATION_CONFIG.find(cat => cat.slug === categorySlug);
    if (!category) {
        notFound();
    }

    const intent = category.intents.find(int => int.slug === intentSlug);
    if (!intent) {
        notFound();
    }

    const title = `${intent.name} ${category.name} | InvestingPro`;
    const description = intent.description || `Find the ${intent.name.toLowerCase()} ${category.name.toLowerCase()} on InvestingPro.`;

    return (
        <>
            <SEOHead
                title={title}
                description={description}
                url={`/${categorySlug}/${intentSlug}`}
            />
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <AutoBreadcrumbs />
                    
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-slate-900 mb-4">
                            {intent.name} {category.name}
                        </h1>
                        {intent.description && (
                            <p className="text-xl text-slate-600">
                                {intent.description}
                            </p>
                        )}
                    </div>

                    {/* Collections List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {intent.collections.map((collection) => (
                            <Link
                                key={collection.href}
                                href={collection.href}
                                className="block p-6 bg-white rounded-lg border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all"
                            >
                                <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-teal-600">
                                    {collection.name}
                                </h3>
                                {collection.description && (
                                    <p className="text-sm text-slate-500">
                                        {collection.description}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Category-level link */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <Link
                            href={`/${categorySlug}`}
                            className="text-teal-600 hover:text-teal-700 font-medium"
                        >
                            ← Back to {category.name}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default async function IntentPage({ params }: IntentPageProps) {
    const { category, intent } = await params;
    
    return (
        <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
            <IntentPageContent 
                categorySlug={category} 
                intentSlug={intent} 
            />
        </Suspense>
    );
}

// Generate static params for all intents
export async function generateStaticParams() {
    const params: Array<{ category: string; intent: string }> = [];
    
    for (const category of NAVIGATION_CONFIG) {
        for (const intent of category.intents) {
            params.push({
                category: category.slug,
                intent: intent.slug,
            });
        }
    }
    
    return params;
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

