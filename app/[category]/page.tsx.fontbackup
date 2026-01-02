import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/navigation/categories';
import { fetchPillarPageData } from '@/lib/pillar/data-fetcher';
import PillarPageTemplate from '@/components/pillar/PillarPageTemplate';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface PillarPageProps {
    params: Promise<{ category: string }>;
}

async function PillarPageContent({ categorySlug }: { categorySlug: string }) {
    // Verify category exists
    const category = getCategoryBySlug(categorySlug);
    if (!category) {
        notFound();
    }

    // Fetch data
    const data = await fetchPillarPageData(categorySlug);
    
    if (!data) {
        // Return basic page even if data fetch fails
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <h1 className="text-4xl font-black text-slate-900 mb-4">{category.name}</h1>
                    <p className="text-xl text-slate-600">{category.description}</p>
                    <p className="mt-8 text-slate-500">
                        Content is being generated. Please check back soon.
                    </p>
                </div>
            </div>
        );
    }

    return <PillarPageTemplate data={data} />;
}

export default async function PillarPage({ params }: PillarPageProps) {
    const { category } = await params;
    
    return (
        <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
            <PillarPageContent categorySlug={category} />
        </Suspense>
    );
}

// Generate static params for all categories
export async function generateStaticParams() {
    const { NAVIGATION_CATEGORIES } = await import('@/lib/navigation/categories');
    return NAVIGATION_CATEGORIES.map((category) => ({
        category: category.slug,
    }));
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

