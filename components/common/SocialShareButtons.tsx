"use client";

import React from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SocialShareButtonsProps {
    title: string;
    url: string;
    description?: string;
}

export default function SocialShareButtons({ title, url, description }: SocialShareButtonsProps) {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    const encodedDescription = encodeURIComponent(description || title);

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description,
                    url,
                });
            } catch (err) {
                // User cancelled or error occurred
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        // You could add a toast notification here
        alert('Link copied to clipboard!');
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-600 mr-2">Share:</span>
            <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-sm font-medium transition-colors border border-primary-200"
                aria-label="Share on WhatsApp"
            >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 rounded-lg text-sm font-medium transition-colors border border-secondary-200"
                aria-label="Share on Facebook"
            >
                <Facebook className="w-4 h-4" />
                <span className="hidden sm:inline">Facebook</span>
            </a>
            <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-sm font-medium transition-colors border border-sky-200"
                aria-label="Share on Twitter"
            >
                <Twitter className="w-4 h-4" />
                <span className="hidden sm:inline">Twitter</span>
            </a>
            <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                aria-label="Copy link"
            >
                <LinkIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Copy Link</span>
            </button>
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                    aria-label="Share via native share"
                >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">More</span>
                </button>
            )}
        </div>
    );
}


