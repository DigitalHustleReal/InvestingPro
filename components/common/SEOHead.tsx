"use client";

import React, { useEffect } from 'react';
import { generateSEOImage } from '@/lib/visuals/generator';

interface SEOHeadProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    structuredData?: any;
}

export default function SEOHead({
    title = "InvestingPro.in - Smart Investment Decisions Made Easy",
    description = "Compare 1000+ Credit Cards & Mutual Funds in India. Make Smart Decisions. Get personalized recommendations based on your spending, lifestyle, and goals. Apply Instantly.",
    image: providedImage,
    url,
    type = "website",
    structuredData = null
}: SEOHeadProps) {
    // Generate standardized SEO image if not provided
    const image = providedImage || generateSEOImage(title);

    useEffect(() => {
        // Safe check for window
        if (typeof window === 'undefined') return;

        const currentUrl = url || window.location.href;

        // Set title
        document.title = title;

        // Set meta tags
        const setMetaTag = (name: string, content: string, isProperty = false) => {
            const attr = isProperty ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attr}="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attr, name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Standard meta tags
        setMetaTag('description', description);
        setMetaTag('keywords', 'investment, mutual funds, stocks, credit cards, insurance, SIP calculator, India');

        // Open Graph tags
        setMetaTag('og:title', title, true);
        setMetaTag('og:description', description, true);
        setMetaTag('og:image', image, true);
        setMetaTag('og:url', currentUrl, true);
        setMetaTag('og:type', type, true);
        setMetaTag('og:site_name', 'InvestingPro.in', true);

        // Twitter Card tags
        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:title', title);
        setMetaTag('twitter:description', description);
        setMetaTag('twitter:image', image);

        // Structured Data
        if (structuredData) {
            // Remove existing structured data scripts
            const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
            existingScripts.forEach(script => script.remove());
            
            // Handle array of structured data or single object
            const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
            
            dataArray.forEach((data, index) => {
                const script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                script.textContent = JSON.stringify(data);
                script.setAttribute('data-schema-index', index.toString());
                document.head.appendChild(script);
            });
        }

        // Canonical URL (use provided URL or current URL)
        const canonicalUrl = url || currentUrl;
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;
    }, [title, description, image, url, type, structuredData]);

    return null;
}
