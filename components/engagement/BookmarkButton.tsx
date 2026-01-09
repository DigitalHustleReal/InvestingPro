"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BookmarkButtonProps {
    articleId: string;
    initialBookmarked?: boolean;
    variant?: 'icon' | 'button' | 'text';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onToggle?: (isBookmarked: boolean) => void;
}

export default function BookmarkButton({
    articleId,
    initialBookmarked = false,
    variant = 'icon',
    size = 'md',
    className,
    onToggle
}: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [isLoading, setIsLoading] = useState(false);

    // Check bookmark status on mount
    useEffect(() => {
        checkBookmarkStatus();
    }, [articleId]);

    const checkBookmarkStatus = async () => {
        try {
            const response = await fetch(`/api/bookmarks?articleId=${articleId}`);
            if (response.ok) {
                const data = await response.json();
                setIsBookmarked(data.isBookmarked);
            }
        } catch {
            // Silently fail - user might not be logged in
        }
    };

    const toggleBookmark = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/bookmarks', {
                method: isBookmarked ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleId })
            });

            if (response.status === 401) {
                toast.error('Please log in to save articles');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to update bookmark');
            }

            const newState = !isBookmarked;
            setIsBookmarked(newState);
            onToggle?.(newState);

            toast.success(newState ? 'Article saved!' : 'Removed from saved');

        } catch (error) {
            toast.error('Failed to update bookmark');
        } finally {
            setIsLoading(false);
        }
    };

    const sizeStyles = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    // Icon only
    if (variant === 'icon') {
        return (
            <button
                onClick={toggleBookmark}
                disabled={isLoading}
                className={cn(
                    "rounded-xl flex items-center justify-center transition-all",
                    isBookmarked 
                        ? "bg-primary-500/10 text-primary-500 hover:bg-primary-500/20" 
                        : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-primary-500 hover:bg-slate-200 dark:hover:bg-white/10",
                    sizeStyles[size],
                    className
                )}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
                {isLoading ? (
                    <Loader2 className={cn("animate-spin", iconSizes[size])} />
                ) : isBookmarked ? (
                    <BookmarkCheck className={iconSizes[size]} />
                ) : (
                    <Bookmark className={iconSizes[size]} />
                )}
            </button>
        );
    }

    // Button with text
    if (variant === 'button') {
        return (
            <Button
                onClick={toggleBookmark}
                disabled={isLoading}
                variant={isBookmarked ? 'default' : 'outline'}
                className={cn(
                    isBookmarked && "bg-primary-600 hover:bg-primary-700",
                    className
                )}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                ) : (
                    <Bookmark className="w-4 h-4 mr-2" />
                )}
                {isBookmarked ? 'Saved' : 'Save'}
            </Button>
        );
    }

    // Text link style
    return (
        <button
            onClick={toggleBookmark}
            disabled={isLoading}
            className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
                isBookmarked 
                    ? "text-primary-600 dark:text-primary-400" 
                    : "text-slate-500 hover:text-primary-600 dark:hover:text-primary-400",
                className
            )}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
            ) : (
                <Bookmark className="w-4 h-4" />
            )}
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
    );
}
