import React from 'react';
import { ShieldCheck, Clock, Info, User } from 'lucide-react';
import Image from 'next/image';
import { AuthorHoverCard } from '@/components/authors/AuthorHoverCard';

interface AuthorBylineProps {
    author: {
        name: string;
        slug?: string; // Added for linking
        title: string;
        avatar?: string;
        credentials?: string;
        bio?: string; // Added for hover card
        role?: string; // Added for hover card
    };
    factChecker?: {
        name: string;
    };
    lastUpdated?: string;
    showMethodology?: boolean;
}

export function AuthorByline({ 
    author, 
    factChecker, 
    lastUpdated, 
    showMethodology = true 
}: AuthorBylineProps) {
    // Construct author object for HoverCard
    const hoverCardAuthor = {
        name: author.name,
        slug: author.slug || '#', // Fallback if no slug
        photo_url: author.avatar,
        bio: author.bio,
        role: author.role || 'Contributor',
        credentials: author.credentials ? [author.credentials] : [],
    };

    const AuthorContent = () => (
        <div className="flex items-start gap-4">
             <div className="relative w-14 h-14 rounded-full overflow-hidden bg-primary-100 flex-shrink-0 cursor-pointer">
                {author.avatar ? (
                    <Image
                        src={author.avatar}
                        alt={author.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                    </div>
                )}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-primary-600 hover:underline decoration-primary-600/30 underline-offset-4 transition-colors">
                        {author.name}
                    </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-600">
                    {author.title}
                </p>
                {author.credentials && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {author.credentials}
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 py-6 border-y border-slate-200 dark:border-slate-800 my-8">
            {/* Author Card with Hover Effect */}
            {author.slug ? (
                <AuthorHoverCard author={hoverCardAuthor}>
                     <AuthorContent />
                </AuthorHoverCard>
            ) : (
                <AuthorContent />
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
                {factChecker && (
                    <div className="flex items-center gap-1.5 text-primary-700 dark:text-primary-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="font-medium">
                            Fact-checked by {factChecker.name}
                        </span>
                    </div>
                )}
                
                {lastUpdated && (
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>
                            Updated {lastUpdated}
                        </span>
                    </div>
                )}
                
                {showMethodology && (
                    <a 
                        href="/methodology" 
                        className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                        <Info className="w-4 h-4" />
                        <span className="font-medium">
                            Our Review Process
                        </span>
                    </a>
                )}
            </div>
        </div>
    );
}
