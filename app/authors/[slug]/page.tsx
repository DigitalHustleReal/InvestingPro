import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/static';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Award, 
    Linkedin, 
    Twitter, 
    Globe, 
    Mail,
    Calendar,
    FileText,
    ArrowRight
} from 'lucide-react';

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createClient();
    
    const { data: author } = await supabase
        .from('authors')
        .select('name, role, bio')
        .eq('slug', slug)
        .single();

    if (!author) {
        return {
            title: 'Author Not Found | InvestingPro',
        };
    }

    return {
        title: `${author.name} - ${author.role || 'Financial Expert'} | InvestingPro`,
        description: author.bio || `Read articles by ${author.name}, ${author.role || 'financial expert'} at InvestingPro.`,
        openGraph: {
            title: `${author.name} | InvestingPro`,
            description: author.bio || `Articles by ${author.name}`,
            type: 'profile',
        },
    };
}

export default async function AuthorPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = createClient();

    // Fetch author details
    const { data: author, error } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !author) {
        notFound();
    }

    // Fetch articles by this author
    const { data: articles } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, published_at, category')
        .eq('author_id', author.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(20);

    // JSON-LD structured data for Person schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: author.name,
        jobTitle: author.role || 'Financial Expert',
        description: author.bio,
        image: author.photo_url || `https://api.dicebear.com/7.x/personas/svg?seed=${author.slug}`,
        url: `https://investingpro.in/authors/${author.slug}`,
        worksFor: {
            '@type': 'Organization',
            name: 'InvestingPro',
            url: 'https://investingpro.in',
        },
        sameAs: [
            author.social_links?.linkedin,
            author.social_links?.twitter,
        ].filter(Boolean),
        knowsAbout: author.credentials || ['Personal Finance', 'Investing', 'Credit Cards'],
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-slate-900 text-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                {/* Profile Image */}
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 shrink-0">
                                    {author.photo_url ? (
                                        <Image
                                            src={author.photo_url}
                                            alt={author.name}
                                            width={160}
                                            height={160}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <Image
                                            src={`https://api.dicebear.com/7.x/personas/svg?seed=${author.slug}`}
                                            alt={author.name}
                                            width={160}
                                            height={160}
                                            className="object-cover w-full h-full"
                                        />
                                    )}
                                </div>

                                {/* Author Info */}
                                <div className="text-center md:text-left flex-1">
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        {author.name}
                                    </h1>
                                    {author.role && (
                                        <p className="text-xl text-primary-200 mb-4">
                                            {author.role}
                                        </p>
                                    )}
                                    
                                    {/* Credentials */}
                                    {author.credentials && author.credentials.length > 0 && (
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                            {author.credentials.map((cred: string, idx: number) => (
                                                <Badge
                                                    key={idx}
                                                    className="bg-white/20 text-white border-white/30"
                                                >
                                                    <Award className="w-3 h-3 mr-1" />
                                                    {cred}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    {/* Bio */}
                                    {author.bio && (
                                        <p className="text-primary-100 max-w-2xl">
                                            {author.bio}
                                        </p>
                                    )}

                                    {/* Social Links */}
                                    <div className="flex gap-3 mt-6 justify-center md:justify-start">
                                        {author.social_links?.linkedin && (
                                            <a
                                                href={author.social_links.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                                aria-label="LinkedIn"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {author.social_links?.twitter && (
                                            <a
                                                href={author.social_links.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                                aria-label="Twitter"
                                            >
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        )}
                                        {author.email && (
                                            <a
                                                href={`mailto:${author.email}`}
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                                aria-label="Email"
                                            >
                                                <Mail className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Articles Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-3 mb-8">
                                <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Articles by {author.name}
                                </h2>
                                <Badge variant="secondary" className="ml-auto">
                                    {articles?.length || 0} articles
                                </Badge>
                            </div>

                            {articles && articles.length > 0 ? (
                                <div className="space-y-6">
                                    {articles.map((article: any) => (
                                        <Card 
                                            key={article.id} 
                                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-500/50 transition-colors group"
                                        >
                                            <CardContent className="p-6">
                                                <Link href={`/articles/${article.slug}`}>
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            {article.category && (
                                                                <Badge 
                                                                    variant="outline" 
                                                                    className="mb-2 text-xs"
                                                                >
                                                                    {article.category}
                                                                </Badge>
                                                            )}
                                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                                                                {article.title}
                                                            </h3>
                                                            {article.excerpt && (
                                                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                                                                    {article.excerpt}
                                                                </p>
                                                            )}
                                                            {article.published_at && (
                                                                <div className="flex items-center gap-2 mt-3 text-sm text-slate-500 dark:text-slate-500">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {new Date(article.published_at).toLocaleDateString('en-IN', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors shrink-0 mt-1" />
                                                    </div>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                    <CardContent className="p-12 text-center">
                                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-600 dark:text-slate-400">
                                            No published articles yet. Check back soon!
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </section>

                {/* Back to Team Link */}
                <section className="pb-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                Meet our full editorial team
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
