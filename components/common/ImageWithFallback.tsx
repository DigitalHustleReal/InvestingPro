"use client";

import React, { useState } from 'react';
import Image from 'next/image';

/**
 * Generate placeholder SVG (no stock photos)
 */
function generatePlaceholderSVG(text: string): string {
    const svg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#f1f5f9"/>
            <rect width="400" height="4" fill="#0d9488"/>
            <text x="200" y="150" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">${escapeXml(text || 'Image')}</text>
        </svg>
    `.trim();
    
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

interface ImageWithFallbackProps {
    src?: string;
    alt: string;
    fallback?: string;
    className?: string;
    loading?: "lazy" | "eager";
    width?: number;
    height?: number;
    priority?: boolean;
    quality?: number;
    sizes?: string;
}

export default function ImageWithFallback({
    src,
    alt,
    fallback,
    className = "",
    loading = "lazy",
    width = 400,
    height = 300,
    priority = false,
    quality = 80,
    sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
}: ImageWithFallbackProps) {
    // Generate fallback SVG if no fallback provided
    const defaultFallback = fallback || generatePlaceholderSVG(alt);
    const [imgSrc, setImgSrc] = useState(src || defaultFallback);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        setHasError(true);
        setImgSrc(defaultFallback);
    };

    // If error occurred, use regular img tag for fallback
    if (hasError || !src) {
        return (
            <div className={`relative ${className}`}>
                <img
                    src={defaultFallback}
                    alt={alt}
                    className={className}
                    loading={loading}
                />
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <Image
                src={imgSrc}
                alt={alt}
                width={width}
                height={height}
                className={className}
                onError={handleError}
                loading={loading}
                priority={priority}
                quality={quality}
                sizes={sizes}
                placeholder="blur"
                blurDataURL={defaultFallback}
            />
        </div>
    );
}
