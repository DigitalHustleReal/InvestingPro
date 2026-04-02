import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TrustBadge from '@/components/common/TrustBadge';
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
                         <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-200">
                            {author.photo_url ? (
                                <Image
                                    src={author.photo_url}
                                    alt={author.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-600 bg-gray-100">
                                    {getInitials(author.name)}
                                </div>
                            )}
                         </div>
                    )}
                    <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600">{children || author.name}</span>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 md:w-96 p-0 overflow-hidden border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl" sideOffset={10}>
                
                {/* Header with Photo */}
                <div className="flex p-6 gap-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
                    <div className="shrink-0 relative">
                         {/* Avatar Glow */}
                         <div className="absolute -inset-1 bg-primary-500/10 rounded-full blur-md" />
                         <div className="w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-gray-900 border-2 border-white dark:border-gray-800 relative shadow-md">
                            {author.photo_url ? (
                                <Image
                                    src={author.photo_url}
                                    alt={author.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-gray-300 dark:text-gray-700 bg-gray-50 dark:bg-gray-900 font-heading">
                                    {getInitials(author.name)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-1 font-heading tracking-tight">
                            {author.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] uppercase tracking-widest font-black text-primary-600 dark:text-primary-400">
                                {author.role?.replace('_', ' ') || 'Contributor'}
                            </span>
                            <TrustBadge type="verified" className="px-1.5 py-0" showIcon={false} />
                        </div>
                        
                        {/* Compact Credentials */}
                        {safeCredentials.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {safeCredentials.slice(0, 2).map((cred, i) => (
                                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm">
                                        {cred}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio Section */}
                <div className="px-6 pb-6 pt-0 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                        {author.bio || author.short_bio || `Expert personal finance researcher and editor at InvestingPro.`}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-100/50 dark:bg-gray-900/50 px-5 py-4 flex items-center justify-between border-t border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
                    <div className="flex gap-1">
                         {author.social_links?.twitter && (
                            <a href={author.social_links.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 text-gray-600 hover:text-blue-500 hover:shadow-md transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                        )}
                        {author.social_links?.linkedin && (
                            <a href={author.social_links.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 text-gray-600 hover:text-blue-600 hover:shadow-md transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                    <Link 
                        href={`/author/${author.slug}`} 
                        className="h-9 px-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg"
                    >
                        View Profile
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

// Compact variant for bylines where space is tight
export function AuthorHoverCardCompact({ author }: { author: Author }) {
     return (
        <AuthorHoverCard author={author} className="text-gray-900 dark:text-white font-semibold hover:text-primary-600" />
     )
}
