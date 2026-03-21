"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Award, Linkedin, Twitter, Globe, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthorBioProps {
    author: {
        id: string;
        name: string;
        role?: string;
        avatar_url?: string;
        bio?: string;
        credentials?: string[];
        years_of_experience?: number;
        specialization?: string[];
        linkedin_url?: string;
        twitter_url?: string;
        website_url?: string;
        slug?: string;
    };
    variant?: 'compact' | 'full';
    showCredentials?: boolean;
    className?: string;
}

// Helper to normalize credentials (handles string, array, or undefined)
function normalizeCredentials(credentials: string[] | string | undefined): string[] {
    if (Array.isArray(credentials)) return credentials;
    if (typeof credentials === 'string' && credentials.trim()) {
        return credentials.split(',').map(c => c.trim()).filter(Boolean);
    }
    return [];
}

/**
 * AuthorBio Component
 * 
 * Displays author information with credentials, bio, and social links.
 * Used in article pages, author pages, and expert listings.
 */
export default function AuthorBio({
    author,
    variant = 'compact',
    showCredentials = true,
    className
}: AuthorBioProps) {
    const isFull = variant === 'full';
    const credentialsArray = normalizeCredentials(author.credentials);

    if (variant === 'compact') {
        return (
            <div className={cn("flex items-start gap-3", className)}>
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {author.avatar_url ? (
                        <Image
                            src={author.avatar_url}
                            alt={author.name}
                            width={48}
                            height={48}
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-600">
                            {author.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        {author.slug ? (
                            <Link
                                href={`/author/${author.slug}`}
                                className="font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                            >
                                {author.name}
                            </Link>
                        ) : (
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {author.name}
                            </span>
                        )}
                        {showCredentials && credentialsArray.length > 0 && (
                            <div className="flex gap-1">
                                {credentialsArray.map((cred, idx) => (
                                    <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                    >
                                        {cred}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                    {author.role && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                            {author.role}
                        </p>
                    )}
                    {author.bio && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {author.bio}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Full variant
    return (
        <div className={cn("bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800", className)}>
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full border-4 border-primary-200 dark:border-primary-800 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {author.avatar_url ? (
                        <Image
                            src={author.avatar_url}
                            alt={author.name}
                            width={80}
                            height={80}
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-600">
                            {author.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                            {author.slug ? (
                                <Link
                                    href={`/author/${author.slug}`}
                                    className="text-xl font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    {author.name}
                                </Link>
                            ) : (
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {author.name}
                                </h3>
                            )}
                            {author.role && (
                                <p className="text-primary-600 dark:text-primary-400 font-medium mt-1">
                                    {author.role}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Credentials */}
                    {showCredentials && credentialsArray.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {credentialsArray.map((cred, idx) => (
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
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            {author.years_of_experience}+ years of experience
                        </p>
                    )}

                    {/* Bio */}
                    {author.bio && (
                        <p className="text-slate-700 dark:text-slate-300 mb-4">
                            {author.bio}
                        </p>
                    )}

                    {/* Specialization */}
                    {author.specialization && author.specialization.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-600 uppercase tracking-wide mb-2">
                                Expertise
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {author.specialization.map((spec, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                                    >
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Social Links */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                        {author.linkedin_url && (
                            <a
                                href={author.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </a>
                        )}
                        {author.twitter_url && (
                            <a
                                href={author.twitter_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </a>
                        )}
                        {author.website_url && (
                            <a
                                href={author.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Website"
                            >
                                <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
