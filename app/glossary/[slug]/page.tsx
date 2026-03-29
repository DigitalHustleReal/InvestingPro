import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { createClient } from '@/lib/supabase/static';
import { createServiceClient } from '@/lib/supabase/service';
import GlossaryTermClient, { type EnrichedGlossaryTerm } from './GlossaryTermClient';

export const revalidate = 86400; // Revalidate daily

interface PageProps {
    params: { slug: string };
}

async function getTerm(slug: string): Promise<EnrichedGlossaryTerm | null> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('glossary_terms')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error || !data) return null;
        return data as EnrichedGlossaryTerm;
    } catch {
        return null;
    }
}

// Pre-build top 200 glossary terms at deploy time
export async function generateStaticParams() {
    try {
        const supabase = createServiceClient();
        const { data } = await supabase
            .from('glossary_terms')
            .select('slug')
            .eq('status', 'published')
            .limit(200);
        return (data || []).map((t) => ({ slug: t.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const term = await getTerm(params.slug);
    if (!term) return { title: 'Term Not Found | InvestingPro' };

    const canonical = `https://investingpro.in/glossary/${term.slug}`;
    return {
        title: term.seo_title || `${term.term} — Meaning, Definition & Examples | InvestingPro`,
        description: term.seo_description || term.definition?.slice(0, 160),
        alternates: { canonical },
        openGraph: {
            title: term.term,
            description: term.definition?.slice(0, 160),
            url: canonical,
        },
    };
}

export default async function GlossaryTermPage({ params }: PageProps) {
    const term = await getTerm(params.slug);

    if (!term) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <BookOpen className="w-16 h-16 text-slate-300 mb-4 mx-auto" />
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Term Not Found</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">The term you are looking for doesn&apos;t exist in our glossary.</p>
                    <Button asChild>
                        <Link href="/glossary">Return to Glossary</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return <GlossaryTermClient termData={term} />;
}
