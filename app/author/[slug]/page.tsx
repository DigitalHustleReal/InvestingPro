import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

// Mock Data (Replace with Supabase fetch later)
const AUTHOR = {
    name: "Shivansh Patel",
    slug: "shivansh-patel",
    role: "Senior Financial Analyst",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shivansh", // Placeholder
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000",
    location: "Mumbai, India",
    socials: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        website: "https://investingpro.in"
    },
    stats: {
        articles: 142,
        reviews: 38,
        experience: "8 Years"
    },
    bio: [
        "Shivansh is a Senior Financial Analyst at InvestingPro, specializing in credit cards, banking products, and personal finance strategies.",
        "With over 8 years of experience in the Indian fintech sector, he has reviewed over 200+ financial products and helped thousands of Indians optimize their financial portfolios.",
        "His work has been featured in leading financial publications, focusing on actionable advice for maximizing rewards and minimizing debt."
    ],
    expertise: ["Credit Cards", "Personal Loans", "Investment Strategy", "Banking Tech"],
    latestArticles: [
        {
            title: "HDFC Regalia Gold vs Diners Club Black: Which is Better in 2026?",
            excerpt: "A deep dive comparison of India's top two premium travel credit cards.",
            date: "Jan 03, 2026",
            category: "Credit Cards",
            image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Top 5 Home Loan Refinancing Options This Month",
            excerpt: "Interest rates are shifting. Here's how to save on your EMI.",
            date: "Dec 28, 2025",
            category: "Loans",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "The Ultimate Guide to Tax Saving via ELSS Funds",
            excerpt: "Why ELSS remains the best tax-saving instrument under Section 80C.",
            date: "Dec 15, 2025",
            category: "Investing",
            image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=400"
        }
    ]
};

export default function AuthorProfilePage({ params }: { params: { slug: string } }) {
    // In real app: const author = await fetchAuthor(params.slug);
    const author = AUTHOR;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header / Cover */}
            <div className="relative h-64 md:h-80 bg-slate-900 overflow-hidden">
                <Image 
                    src={author.coverImage}
                    alt="Cover"
                    fill
                    className="object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absoluteinset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Sidebar Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24 border border-slate-100">
                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden mb-6 bg-slate-100">
                                    <Image 
                                        src={author.avatar}
                                        alt={author.name}
                                        width={128}
                                        height={128}
                                        className="object-cover"
                                    />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-1">{author.name}</h1>
                                <p className="text-blue-600 font-medium mb-4">{author.role}</p>
                                
                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                    <MapPin className="w-4 h-4" />
                                    <span>{author.location}</span>
                                </div>

                                <div className="flex gap-4 mb-8">
                                    <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 hover:text-blue-500">
                                        <Twitter className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 hover:text-blue-700">
                                        <Linkedin className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 hover:text-primary-600">
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="w-full grid grid-cols-3 gap-2 border-t border-slate-100 pt-6">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-slate-900">{author.stats.articles}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Articles</div>
                                    </div>
                                    <div className="text-center border-l border-slate-100">
                                        <div className="text-lg font-bold text-slate-900">{author.stats.reviews}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Reviews</div>
                                    </div>
                                    <div className="text-center border-l border-slate-100">
                                        <div className="text-lg font-bold text-slate-900">{author.stats.experience}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Exp.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8 mt-4 lg:mt-32">
                        
                        {/* Bio Section */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200/60">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-500" />
                                About {author.name.split(' ')[0]}
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                                {author.bio.map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                            
                            {/* Expertise Tags */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Areas of Expertise</p>
                                <div className="flex flex-wrap gap-2">
                                    {author.expertise.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Verification / Trust Badge */}
                        <div className="bg-primary-50 rounded-xl p-6 border border-primary-100 flex items-start gap-4">
                            <div className="bg-primary-100 p-3 rounded-full">
                                <Shield className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary-900 mb-1">Editorial Integrity Verified</h3>
                                <p className="text-sm text-primary-800 leading-relaxed">
                                    All content written by {author.name} adheres to InvestingPro's strict editorial guidelines. 
                                    Financial advice is backed by data-driven research and peer-reviewed by our compliance team.
                                </p>
                            </div>
                        </div>

                        {/* Recent Articles */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                    Latest Analysis
                                </h2>
                            </div>
                            
                            <div className="grid gap-6">
                                {author.latestArticles.map((article, index) => (
                                    <Link key={index} href="#" className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row h-full md:h-48">
                                        <div className="w-full md:w-64 relative h-48 md:h-full bg-slate-200 shrink-0">
                                            <Image 
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-900 uppercase tracking-wide">
                                                {article.category}
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col justify-center">
                                            <div className="text-xs text-slate-500 mb-2">{article.date}</div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-slate-600 line-clamp-2 mb-4">
                                                {article.excerpt}
                                            </p>
                                            <span className="text-blue-600 text-sm font-medium group-hover:underline">Read Analysis &rarr;</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
