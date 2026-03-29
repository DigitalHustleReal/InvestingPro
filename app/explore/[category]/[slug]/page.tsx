
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NAVIGATION_CONFIG } from '@/lib/navigation/config';
import { getCategoryBySlug, getSubcategoryBySlug } from '@/lib/navigation/categories';
import { fetchSubcategoryPageData } from '@/lib/pillar/subcategory-data-fetcher';
import SubcategoryPageTemplate from '@/components/pillar/SubcategoryPageTemplate';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';

// Type definitions
interface PageProps {
    params: Promise<{ category: string; slug: string }>;
}

// Intent Page Content Component
async function IntentPageContent({ 
    categorySlug, 
    intentSlug 
}: { 
    categorySlug: string; 
    intentSlug: string;
}) {
    // Find category and intent
    const category = NAVIGATION_CONFIG.find(cat => cat.slug === categorySlug);
    if (!category) return null;

    const intent = category.intents.find(int => int.slug === intentSlug);
    if (!intent) return null;

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
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">
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
                                className="block p-6 bg-white rounded-lg border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all"
                            >
                                <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-emerald-600">
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
                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            ← Back to {category.name}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

// Subcategory Page Content Component
async function SubcategoryPageContent({ 
    categorySlug, 
    subcategorySlug 
}: { 
    categorySlug: string; 
    subcategorySlug: string;
}) {
    // Verify category and subcategory exist
    const category = getCategoryBySlug(categorySlug);
    if (!category) return null;

    const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);
    if (!subcategory) return null;

    // Fetch data
    const data = await fetchSubcategoryPageData(categorySlug, subcategorySlug);
    
    if (!data) {
        // Return basic page even if data fetch fails
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {subcategory.name}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                        {subcategory.description}
                    </p>
                    <p className="mt-8 text-slate-500">
                        Content is being generated. Please check back soon.
                    </p>
                </div>
            </div>
        );
    }

    return <SubcategoryPageTemplate data={data!} />;}

// Main Page Component
async function CombinedSlugPageContent({ 
    categorySlug, 
    slug 
}: { 
    categorySlug: string; 
    slug: string;
}) {
    // 1. Check if it's an Intent
    const categoryConfig = NAVIGATION_CONFIG.find(cat => cat.slug === categorySlug);
    const intent = categoryConfig?.intents.find(int => int.slug === slug);

    if (intent) {
        return <IntentPageContent categorySlug={categorySlug} intentSlug={slug} />;
    }

    // 2. Check if it's a Subcategory
    const subcategory = getSubcategoryBySlug(categorySlug, slug);
    if (subcategory) {
        return <SubcategoryPageContent categorySlug={categorySlug} subcategorySlug={slug} />;
    }

    // 3. Not found
    notFound();
}

export default async function Page({ params }: PageProps) {
    const { category, slug } = await params;
    
    return (
        <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
            <CombinedSlugPageContent 
                categorySlug={category} 
                slug={slug} 
            />
        </Suspense>
    );
}

// No generateStaticParams — pages are force-dynamic (rendered on demand)

// Dynamic: render on demand to avoid pre-building 100s of pages at deploy time
export const dynamic = 'force-dynamic';
export const revalidate = 3600;
