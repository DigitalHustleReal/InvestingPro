/**
 * SEO Metadata Utilities
 * 
 * Generates metadata for Next.js pages
 * Includes title, description, Open Graph, Twitter Cards
 */

import { Metadata } from 'next';

export interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
    noindex?: boolean;
    nofollow?: boolean;
}

const defaultConfig = {
    siteName: 'InvestingPro.in',
    siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://investingpro.in',
    defaultImage: '/og-image.png',
    twitterHandle: '@investingpro',
};

/**
 * Generate metadata for Next.js pages
 */
export function generateMetadata(config: SEOConfig): Metadata {
    const {
        title,
        description,
        keywords,
        image,
        url,
        type = 'website',
        publishedTime,
        modifiedTime,
        author,
        section,
        tags,
        noindex,
        nofollow,
    } = config;

    const fullTitle = title.includes('InvestingPro') 
        ? title 
        : `${title} | InvestingPro.in`;

    const fullUrl = url || defaultConfig.siteUrl;
    const ogImage = image || `${defaultConfig.siteUrl}${defaultConfig.defaultImage}`;

    const metadata: Metadata = {
        title: fullTitle,
        description,
        keywords: keywords?.join(', '),
        authors: author ? [{ name: author }] : undefined,
        openGraph: {
            title: fullTitle,
            description,
            url: fullUrl,
            siteName: defaultConfig.siteName,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'en_IN',
            type: type === 'article' ? 'article' : 'website',
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
            ...(author && { authors: [author] }),
            ...(section && { section }),
            ...(tags && { tags }),
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
            creator: defaultConfig.twitterHandle,
        },
        alternates: {
            canonical: fullUrl,
        },
        robots: {
            index: !noindex,
            follow: !nofollow,
            googleBot: {
                index: !noindex,
                follow: !nofollow,
            },
        },
    };

    return metadata;
}

/**
 * Generate article metadata
 */
export function generateArticleMetadata(data: {
    title: string;
    description: string;
    slug: string;
    image?: string;
    publishedDate: string;
    modifiedDate?: string;
    author?: string;
    category?: string;
    tags?: string[];
}): Metadata {
    const url = `${defaultConfig.siteUrl}/article/${data.slug}`;

    return generateMetadata({
        title: data.title,
        description: data.description,
        image: data.image,
        url,
        type: 'article',
        publishedTime: data.publishedDate,
        modifiedTime: data.modifiedDate,
        author: data.author,
        section: data.category,
        tags: data.tags,
    });
}

/**
 * Generate product metadata
 */
export function generateProductMetadata(data: {
    name: string;
    description: string;
    slug: string;
    type: string;
    image?: string;
    rating?: number;
}): Metadata {
    const url = `${defaultConfig.siteUrl}/${data.type}/${data.slug}`;
    const title = `${data.name} - ${data.type.charAt(0).toUpperCase() + data.type.slice(1)} | InvestingPro.in`;

    return generateMetadata({
        title,
        description: data.description,
        image: data.image,
        url,
        type: 'product',
        keywords: [data.name, data.type, 'comparison', 'review'],
    });
}
