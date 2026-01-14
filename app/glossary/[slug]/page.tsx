"use client";

import React, { useState, useEffect, use } from 'react';
import { api } from '@/lib/api';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import { 
    BookOpen, 
    Share2, 
    Calculator,
    AlertCircle,
    Lightbulb,
    ExternalLink,
    CheckCircle,
    ChevronRight,
    User,
    Calendar
} from 'lucide-react';

interface EnrichedGlossaryTerm {
    id: string;
    term: string;
    category: string;
    definition: string;
    why_it_matters?: string;
    example_numeric?: string;
    example_text?: string;
    how_to_use?: string;
    common_mistakes?: string[];
    related_terms?: string[];
    related_calculators?: string[];
    seo_title?: string;
    seo_description?: string;
}

interface TableOfContentsItem {
    id: string;
    title: string;
}

export default function GlossaryArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    
    const [termData, setTermData] = useState<EnrichedGlossaryTerm | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<string>('');

    const tableOfContents: TableOfContentsItem[] = [
        { id: 'definition', title: `What Is ${termData?.term || 'This Term'}?` },
        { id: 'understanding', title: `Understanding ${termData?.term || 'This Term'}` },
        { id: 'examples', title: 'Examples & Calculations' },
        { id: 'how-to-use', title: 'How to Use' },
        { id: 'common-mistakes', title: 'Common Mistakes' },
        { id: 'faq', title: 'Frequently Asked Questions' },
        { id: 'bottom-line', title: 'The Bottom Line' },
    ];

    useEffect(() => {
        const fetchTerm = async () => {
            setLoading(true);
            try {
                const allTerms: any[] = await api.entities.Glossary.list();
                const matched = allTerms.find(t => t.slug === slug);
                
                if (matched) {
                    setTermData(matched);
                } else {
                    setTermData(null);
                }
            } catch (e) {
                console.error("Failed to load term", e);
            } finally {
                setLoading(false);
            }
        };
        fetchTerm();
    }, [slug]);

    useEffect(() => {
        const handleScroll = () => {
            const sections = tableOfContents.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + 150;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(tableOfContents[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [termData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-12 h-12 text-primary-500 animate-pulse mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading article...</p>
                </div>
            </div>
        );
    }

    if (!termData) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <BookOpen className="w-16 h-16 text-slate-300 mb-4 mx-auto" />
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Term Not Found</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">The term you are looking for doesn't exist in our glossary.</p>
                    <Button asChild>
                        <Link href="/glossary">Return to Glossary</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const keyTakeaways = termData.why_it_matters 
        ? termData.why_it_matters.split('\n').filter(line => line.trim()).slice(0, 4)
        : [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Breadcrumbs */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-slate-500 hover:text-primary-600 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <Link href="/glossary" className="text-slate-500 hover:text-primary-600 transition-colors">Glossary</Link>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-500 capitalize">{termData.category}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900 dark:text-white font-medium truncate">{termData.term}</span>
                    </nav>
                </div>
            </div>

            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                    {/* Main Content */}
                    <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                        {/* Article Header */}
                        <header className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <Badge className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 dark:bg-primary-900/20 border-0">
                                    {termData.category}
                                </Badge>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <CheckCircle className="w-4 h-4 text-success-600" />
                                    <span>Fact-Checked</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                {termData.term}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>By <strong className="text-slate-900 dark:text-white">InvestingPro Editorial Team</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Updated Jan 2026</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="text-slate-600">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </header>

                        {/* Key Takeaways */}
                        {keyTakeaways.length > 0 && (
                            <div className="m-8 p-6 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-950/50 dark:to-primary-900/30 rounded-xl border border-primary-200 dark:border-primary-800">
                                <div className="flex items-start gap-3 mb-4">
                                    <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Key Takeaways</h2>
                                </div>
                                <ul className="space-y-2">
                                    {keyTakeaways.map((point, i) => (
                                        <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                                            <span className="text-primary-600 dark:text-primary-400 font-bold flex-shrink-0">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Content Sections */}
                        <div className="p-8 space-y-12">
                            {/* What Is [Term]? */}
                            <section id="definition" className="scroll-mt-24">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                    What Is {termData.term}?
                                </h2>
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                                        {termData.definition}
                                    </p>
                                </div>
                            </section>

                            {/* Understanding [Term] */}
                            {termData.why_it_matters && (
                                <section id="understanding" className="scroll-mt-24">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                        Understanding {termData.term}
                                    </h2>
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                                            {termData.why_it_matters}
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* Examples & Calculations */}
                            {(termData.example_numeric || termData.example_text) && (
                                <section id="examples" className="scroll-mt-24">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                        Examples & Calculations
                                    </h2>
                                    {termData.example_numeric && (
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 mb-4">
                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                                <Calculator className="w-5 h-5 text-primary-600" />
                                                Numeric Example
                                            </h3>
                                            <div className="prose dark:prose-invert max-w-none">
                                                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-lg">
                                                    {termData.example_numeric}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                    {termData.example_text && (
                                        <div className="prose prose-lg dark:prose-invert max-w-none">
                                            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                                                {termData.example_text}
                                            </p>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* How to Use */}
                            {termData.how_to_use && (
                                <section id="how-to-use" className="scroll-mt-24">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                        How to Use {termData.term}
                                    </h2>
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                                            {termData.how_to_use}
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* Common Mistakes */}
                            {termData.common_mistakes && termData.common_mistakes.length > 0 && (
                                <section id="common-mistakes" className="scroll-mt-24">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                        Common Mistakes to Avoid
                                    </h2>
                                    <div className="bg-danger-50 dark:bg-danger-950/20 rounded-xl p-6 border border-danger-200 dark:border-danger-900">
                                        <ul className="space-y-3">
                                            {termData.common_mistakes.map((mistake: string, i: number) => (
                                                <li key={i} className="flex gap-3 text-danger-900 dark:text-danger-200">
                                                    <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
                                                    <span className="text-lg">{mistake}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>
                            )}

                            {/* FAQ Section */}
                            <section id="faq" className="scroll-mt-24">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    <details className="group bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 cursor-pointer">
                                        <summary className="text-lg font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between">
                                            <span>Why is {termData.term} important?</span>
                                            <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                                        </summary>
                                        <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {termData.why_it_matters?.split('\n')[0] || `Understanding ${termData.term} is crucial for making informed financial decisions.`}
                                        </p>
                                    </details>
                                    
                                    {termData.related_calculators && termData.related_calculators.length > 0 && (
                                        <details className="group bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 cursor-pointer">
                                            <summary className="text-lg font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between">
                                                <span>How do I calculate {termData.term}?</span>
                                                <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                                            </summary>
                                            <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                                                You can use our free calculators to compute {termData.term}. Check out the related calculators section below.
                                            </p>
                                        </details>
                                    )}
                                </div>
                            </section>

                            {/* The Bottom Line */}
                            <section id="bottom-line" className="scroll-mt-24">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                    The Bottom Line
                                </h2>
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 border-l-4 border-primary-600">
                                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                                        {termData.definition.split('.')[0]}. Understanding this concept is essential for {termData.category.replace(/-/g, ' ')} decisions in the Indian financial market.
                                    </p>
                                </div>
                            </section>

                            {/* Related Calculators */}
                            {termData.related_calculators && termData.related_calculators.length > 0 && (
                                <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Try It Yourself</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {termData.related_calculators.map((calc: string) => (
                                            <Link
                                                key={calc}
                                                href={`/calculators/${calc}`}
                                                className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Calculator className="w-5 h-5 text-primary-600" />
                                                        <span className="font-bold capitalize text-slate-900 dark:text-white">{calc.replace(/-/g, ' ')} Calculator</span>
                                                    </div>
                                                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-primary-600 transition-colors" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </article>

                    {/* Sticky Sidebar */}
                    <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
                        {/* Table of Contents */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                                In This Article
                            </h3>
                            <nav className="space-y-2">
                                {tableOfContents.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                                            activeSection === item.id
                                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {item.title}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Related Terms */}
                        {termData.related_terms && termData.related_terms.length > 0 && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                                    Related Terms
                                </h3>
                                <div className="space-y-2">
                                    {termData.related_terms.map((relatedTerm: string) => {
                                        const relatedSlug = relatedTerm.toLowerCase()
                                            .replace(/[()]/g, '')
                                            .replace(/\s+/g, '-')
                                            .replace(/&/g, 'and');
                                        return (
                                            <Link
                                                key={relatedTerm}
                                                href={`/glossary/${relatedSlug}`}
                                                className="block text-sm py-2 px-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors font-medium"
                                            >
                                                {relatedTerm}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
