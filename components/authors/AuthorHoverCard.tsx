import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight, Twitter, Linkedin } from 'lucide-react';

interface Author {
    name: string;
    slug: string;
    role?: string;
    photo_url?: string;
    bio?: string; // Long bio
    short_bio?: string; // Or specific short bio
    credentials?: string[];
    social_links?: {
        twitter?: string;
        linkedin?: string;
    };
}

interface AuthorHoverCardProps {
    author: Author;
    children?: React.ReactNode;
    className?: string;
    showAvatar?: boolean;
}

// Helper to normalize credentials (handles string, array, or undefined)
function normalizeCredentials(credentials: unknown): string[] {
    if (Array.isArray(credentials)) return credentials.filter(c => typeof c === 'string');
    if (typeof credentials === 'string' && credentials.trim()) {
        return credentials.split(',').map(c => c.trim()).filter(Boolean);
    }
    return [];
}

export function AuthorHoverCard({ author, children, className, showAvatar = false }: AuthorHoverCardProps) {
    // #region agent log
    console.log('[DEBUG AuthorHoverCard]', { name: author?.name, credentialsType: typeof author?.credentials, isArray: Array.isArray(author?.credentials), value: author?.credentials });
    // #endregion
    
    // Normalize credentials once at the top level
    const safeCredentials = normalizeCredentials(author?.credentials);
    
    // Determine image to show
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const imageUrl = author.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${author.slug}`;

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Link 
                    href={`/author/${author.slug}`}
                    className={cn("cursor-pointer hover:text-primary-600 hover:underline decoration-primary-600/30 underline-offset-4 transition-colors flex items-center gap-2", className)}
                >
                    {showAvatar && (
                         <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-200">
                            {author.photo_url ? (
                                <Image
                                    src={author.photo_url}
                                    alt={author.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400 bg-slate-100">
                                    {getInitials(author.name)}
                                </div>
                            )}
                         </div>
                    )}
                    <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-primary-600">{children || author.name}</span>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 md:w-96 p-0 overflow-hidden border-slate-200 dark:border-slate-800 shadow-xl" sideOffset={10}>
                
                {/* Header with Photo */}
                <div className="flex p-5 gap-4 bg-white dark:bg-slate-950">
                    <div className="shrink-0">
                         <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-100 dark:border-slate-800 relative shadow-sm">
                            {author.photo_url ? (
                                <Image
                                    src={author.photo_url}
                                    alt={author.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400 bg-slate-100">
                                    {getInitials(author.name)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">
                            {author.name}
                        </h4>
                        <p className="text-xs uppercase tracking-wider font-semibold text-primary-600 dark:text-primary-400 mb-2">
                             {author.role?.replace('_', ' ') || 'Contributor'}
                        </p>
                        
                        {/* Compact Credentials - using pre-normalized safeCredentials */}
                        {safeCredentials.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {safeCredentials.slice(0, 2).map((cred, i) => (
                                    <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        {cred}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio Section */}
                <div className="px-5 pb-5 pt-0 bg-white dark:bg-slate-950">
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {author.bio || author.short_bio || `Read articles by ${author.name} on InvestingPro.`}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 dark:bg-slate-900 p-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <div className="flex gap-2">
                         {author.social_links?.twitter && (
                            <a href={author.social_links.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors p-1">
                                <Twitter className="w-4 h-4" />
                            </a>
                        )}
                        {author.social_links?.linkedin && (
                            <a href={author.social_links.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-700 transition-colors p-1">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                    <Link 
                        href={`/author/${author.slug}`} 
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
                    >
                        View Full Profile
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

// Compact variant for bylines where space is tight
export function AuthorHoverCardCompact({ author }: { author: Author }) {
     return (
        <AuthorHoverCard author={author} className="text-slate-900 dark:text-white font-semibold hover:text-primary-600" />
     )
}
