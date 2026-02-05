import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
    Twitter, 
    Linkedin, 
    Globe, 
    MapPin, 
    Mail, 
    Award,
    TrendingUp,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/static';
import SEOHead from '@/components/common/SEOHead';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function AuthorProfilePage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = createClient();
    
    // Fetch author
    const { data: author, error } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .maybeSingle(); // Use maybeSingle() to handle 0 rows gracefully

    if (error || !author) {
        notFound();
    }

    // Fetch author's articles
    const { data: articles } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, featured_image, published_date, category')
        .eq('author_id', author.id)
        .eq('status', 'published')
        .order('published_date', { ascending: false })
        .limit(6);

    // Count total articles
    const { count: articleCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', author.id)
        .eq('status', 'published');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title={`${author.name} - ${author.role || 'Financial Expert'} | InvestingPro`}
                description={author.bio || `Read articles and insights from ${author.name}, ${author.role || 'financial expert'} at InvestingPro.`}
            />

            {/* Header / Cover */}
            <div className="relative h-64 md:h-80 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-slate-900 to-slate-950"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Sidebar Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden sticky top-24 border border-slate-100 dark:border-slate-800">
                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                                    {author.avatar_url ? (
                                        <Image 
                                            src={author.avatar_url}
                                            alt={author.name}
                                            width={128}
                                            height={128}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                                            {author.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{author.name}</h1>
                                {author.role && (
                                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">{author.role}</p>
                                )}
                                
                                {/* Credentials */}
                                {author.credentials && author.credentials.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                        {author.credentials.map((cred: string, idx: number) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                            >
                                                <Award className="w-3 h-3 mr-1" />
                                                {cred}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Experience */}
                                {author.years_of_experience && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                        {author.years_of_experience}+ years of experience
                                    </p>
                                )}

                                {/* Social Links */}
                                <div className="flex gap-4 mb-8">
                                    {author.twitter_url && (
                                        <a
                                            href={author.twitter_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Twitter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        </a>
                                    )}
                                    {author.linkedin_url && (
                                        <a
                                            href={author.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Linkedin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        </a>
                                    )}
                                    {author.website_url && (
                                        <a
                                            href={author.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        </a>
                                    )}
                                </div>

                                <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-slate-900 dark:text-white">{articleCount || 0}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Articles</div>
                                    </div>
                                    <div className="text-center border-l border-slate-100 dark:border-slate-800">
                                        <div className="text-lg font-bold text-slate-900 dark:text-white">{author.years_of_experience || 0}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Years</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8 mt-4 lg:mt-32">
                        
                        {/* Bio Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                About {author.name.split(' ')[0]}
                            </h2>
                            {author.bio && (
                                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
                                    <p>{author.bio}</p>
                                </div>
                            )}
                            
                            {/* Expertise Tags */}
                            {author.specialization && author.specialization.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Areas of Expertise</p>
                                    <div className="flex flex-wrap gap-2">
                                        {author.specialization.map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium border border-primary-100 dark:border-primary-800">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Verification / Trust Badge */}
                        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 border border-primary-100 dark:border-primary-800 flex items-start gap-4">
                            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
                                <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">Editorial Integrity Verified</h3>
                                <p className="text-sm text-primary-800 dark:text-primary-200 leading-relaxed">
                                    All content written by {author.name} adheres to InvestingPro's strict editorial guidelines. 
                                    Financial advice is backed by data-driven research and peer-reviewed by our compliance team.
                                </p>
                            </div>
                        </div>

                        {/* Recent Articles */}
                        {articles && articles.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                        Latest Articles
                                    </h2>
                                </div>
                                
                                <div className="grid gap-6">
                                    {articles.map((article) => (
                                        <Link 
                                            key={article.id} 
                                            href={`/articles/${article.slug}`}
                                            className="group bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row h-full md:h-48"
                                        >
                                            {article.featured_image && (
                                                <div className="w-full md:w-64 relative h-48 md:h-full bg-slate-200 dark:bg-slate-800 shrink-0">
                                                    <Image 
                                                        src={article.featured_image}
                                                        alt={article.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    {article.category && (
                                                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                                                            {article.category}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="p-6 flex flex-col justify-center">
                                                {article.published_date && (
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                                        {new Date(article.published_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                )}
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                                    {article.title}
                                                </h3>
                                                {article.excerpt && (
                                                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                                                        {article.excerpt}
                                                    </p>
                                                )}
                                                <span className="text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:underline">Read Article →</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
