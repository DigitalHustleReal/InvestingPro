import React, { useState } from 'react';

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
}

export default function ImageWithFallback({
    src,
    alt,
    fallback,
    className = "",
    loading = "lazy"
}: ImageWithFallbackProps) {
    // Generate fallback SVG if no fallback provided
    const defaultFallback = fallback || generatePlaceholderSVG(alt);
    const [imgSrc, setImgSrc] = useState(src || defaultFallback);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        setImgSrc(defaultFallback);
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className={`absolute inset-0 bg-slate-200 animate-pulse ${className}`} />
            )}
            <img
                src={imgSrc}
                alt={alt}
                className={className}
                onError={handleError}
                onLoad={handleLoad}
                loading={loading}
            />
        </div>
    );
}
