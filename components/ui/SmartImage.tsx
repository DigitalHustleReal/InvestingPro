'use client';

import React, { useState, useEffect } from 'react';
import { resolveFeaturedImage } from '@/lib/media/image-resolver';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartImageProps {
    src: string | null | undefined;
    alt?: string;
    category?: string;
    className?: string;
    fallbackUrl?: string;
    showPlaceholder?: boolean;
}

/**
 * SmartImage Component
 * 
 * Automatically resolves image URLs via centralized mapping logic.
 * Handles 404 errors by attempting a fallback URL or showing a consistent placeholder.
 * Prevents console 404 errors by pre-validating or gracefully switching sources.
 */
export default function SmartImage({
    src,
    alt = '',
    category,
    className,
    fallbackUrl = 'https://images.unsplash.com/photo-1611974714024-462740941821?w=400&h=400&fit=crop&auto=format&q=80',
    showPlaceholder = true
}: SmartImageProps) {
    const [currentSrc, setCurrentSrc] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);

    // Initial resolution
    useEffect(() => {
        const resolved = resolveFeaturedImage(src, category);
        setCurrentSrc(resolved);
        setHasError(false);
    }, [src, category]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            // Try the secondary fallback if the first resolution failed
            setCurrentSrc(fallbackUrl);
        }
    };

    if (hasError && !showPlaceholder && !currentSrc) {
        return null;
    }

    if (!currentSrc || (hasError && currentSrc === fallbackUrl && !currentSrc)) {
        return (
            <div className={cn("flex items-center justify-center bg-wt-surface-hover rounded-lg border border-wt-border", className)}>
                <FileText className="w-1/3 h-1/3 text-wt-text-muted/50" />
            </div>
        );
    }

    return (
        <img
            src={currentSrc}
            alt={alt}
            className={cn("object-cover", className)}
            onError={handleError}
            loading="lazy"
        />
    );
}
