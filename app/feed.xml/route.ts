/**
 * RSS Feed Generation
 * 
 * Provides RSS 2.0 feed for article syndication.
 * Available at /feed.xml
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://investingpro.in';
const SITE_NAME = 'InvestingPro';
const SITE_DESCRIPTION = 'Expert financial guidance for credit cards, loans, mutual funds, and personal finance in India.';

interface FeedArticle {
    title: string;
    slug: string;
    excerpt?: string;
    category: string;
    published_date: string;
    author_name?: string;
    featured_image?: string;
}

function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toUTCString();
}

function generateRssFeed(articles: FeedArticle[]): string {
    const items = articles.map(article => {
        const link = `${SITE_URL}/articles/${article.slug}`;
        const categoryFormatted = article.category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'General';
        
        return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.excerpt || '')}</description>
      <category>${escapeXml(categoryFormatted)}</category>
      <pubDate>${formatDate(article.published_date)}</pubDate>
      ${article.author_name ? `<author>${escapeXml(article.author_name)}</author>` : ''}
      ${article.featured_image ? `<enclosure url="${escapeXml(article.featured_image)}" type="image/jpeg" />` : ''}
    </item>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;
}

export async function GET() {
    try {
        const supabase = await createClient();

        // Get latest published articles
        const { data: articles, error } = await supabase
            .from('articles')
            .select('title, slug, excerpt, category, published_date, author_name, featured_image')
            .eq('status', 'published')
            .not('published_date', 'is', null)
            .order('published_date', { ascending: false })
            .limit(50);

        if (error) {
            console.error('RSS feed error:', error);
            return new NextResponse('Error generating feed', { status: 500 });
        }

        const feed = generateRssFeed(articles || []);

        return new NextResponse(feed, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
            },
        });
    } catch (error) {
        console.error('RSS feed error:', error);
        return new NextResponse('Error generating feed', { status: 500 });
    }
}
