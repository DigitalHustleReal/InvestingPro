/**
 * Intelligent Content Detection System
 * 
 * Automatically detects and renders interactive components from markdown/content:
 * - Tables → ComparisonTable
 * - Data → Charts
 * - Statistics → StatCard
 * - Quotes → TweetableQuote
 * - Comparisons → ComparisonCard
 */

import React from 'react';
import ComparisonTable from '@/components/content/ComparisonTable';
import TweetableQuote from '@/components/content/TweetableQuote';
import SharableStatCard from '@/components/content/SharableStatCard';
import SharableComparisonCard from '@/components/content/SharableComparisonCard';

export interface DetectedContent {
    type: 'table' | 'chart' | 'stat' | 'quote' | 'comparison';
    data: any;
    position: number; // Character position in content
}

/**
 * Detect tables in markdown content
 */
export function detectTables(content: string): DetectedContent[] {
    const tables: DetectedContent[] = [];
    
    // Match markdown tables
    const tableRegex = /^\|(.+)\|\s*\n\|[-\s|:]+\|\s*\n((?:\|.+\|\s*\n?)+)/gm;
    let match;
    let position = 0;
    
    while ((match = tableRegex.exec(content)) !== null) {
        const fullMatch = match[0];
        const headers = match[1].split('|').map(h => h.trim()).filter(Boolean);
        const rows = match[2].split('\n')
            .filter(row => row.trim())
            .map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));
        
        if (headers.length >= 2 && rows.length > 0) {
            tables.push({
                type: 'table',
                data: { headers, rows },
                position: match.index || 0
            });
        }
        
        position = (match.index || 0) + fullMatch.length;
    }
    
    return tables;
}

/**
 * Detect statistics in content
 */
export function detectStatistics(content: string): DetectedContent[] {
    const stats: DetectedContent[] = [];
    
    // Pattern: "₹X lakh", "X%", "₹X crore", etc.
    const statPatterns = [
        /(?:₹|Rs\.?)\s*([\d,]+(?:\.[\d]+)?)\s*(lakh|crore|thousand|K|L|Cr)/gi,
        /([\d,]+(?:\.[\d]+)?)\s*%\s*(?:p\.?a\.?|per\s+annum|annual)?/gi,
        /(average|minimum|maximum|up\s+to)\s+(?:₹|Rs\.?)\s*([\d,]+(?:\.[\d]+)?)/gi
    ];
    
    statPatterns.forEach((pattern, index) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const value = match[1] || match[2];
            const unit = match[2] || match[3] || '';
            
            // Extract context (sentence containing stat)
            const start = Math.max(0, match.index - 50);
            const end = Math.min(content.length, match.index + match[0].length + 50);
            const context = content.substring(start, end);
            
            // Extract title from context
            const titleMatch = context.match(/([A-Z][^.!?]*?)(?:₹|Rs\.?|\d+%)/);
            const title = titleMatch ? titleMatch[1].trim() : 'Statistic';
            
            stats.push({
                type: 'stat',
                data: {
                    title: title.substring(0, 60),
                    value: `${value}${unit ? ' ' + unit : ''}`,
                    source: 'Article Content'
                },
                position: match.index || 0
            });
        }
    });
    
    return stats;
}

/**
 * Detect quotes in content
 */
export function detectQuotes(content: string): DetectedContent[] {
    const quotes: DetectedContent[] = [];
    
    // Pattern: Quoted text (with quotes, blockquotes, or emphasis)
    const quotePatterns = [
        /"([^"]{50,280})"/g, // Double quotes
        /'([^']{50,280})'/g, // Single quotes
        /^>\s*(.+)$/gm, // Blockquotes
        /\*\*([^*]{50,280})\*\*/g // Bold text (often used for emphasis/quotes)
    ];
    
    quotePatterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const text = match[1].trim();
            
            // Only consider meaningful quotes (50+ chars, not just emphasis)
            if (text.length >= 50 && text.length <= 280) {
                quotes.push({
                    type: 'quote',
                    data: {
                        text,
                        source: 'Article'
                    },
                    position: match.index || 0
                });
            }
        }
    });
    
    return quotes;
}

/**
 * Detect comparisons in content
 */
export function detectComparisons(content: string): DetectedContent[] {
    const comparisons: DetectedContent[] = [];
    
    // Pattern: "X vs Y", "X compared to Y", "difference between X and Y"
    const comparisonPattern = /([A-Z][^.!?]{0,50}?)\s+(?:vs|versus|compared\s+to|vs\.|difference\s+between)\s+([A-Z][^.!?]{0,50}?)/gi;
    
    let match;
    while ((match = comparisonPattern.exec(content)) !== null) {
        const itemA = match[1].trim();
        const itemB = match[2].trim();
        
        // Extract comparison context
        const start = Math.max(0, match.index - 100);
        const end = Math.min(content.length, match.index + match[0].length + 100);
        const context = content.substring(start, end);
        
        // Try to extract comparison points from surrounding content
        const points: Array<{ label: string; valueA: string; valueB: string }> = [];
        
        // Look for lists or structured data after comparison
        const listMatch = context.match(/(?:[-•]|^\d+\.)\s*([^:]+):\s*([^,\n]+)/g);
        if (listMatch) {
            listMatch.slice(0, 5).forEach(item => {
                const parts = item.match(/(?:[-•]|^\d+\.)\s*([^:]+):\s*(.+)/);
                if (parts) {
                    points.push({
                        label: parts[1].trim(),
                        valueA: parts[2].trim().split(/[,\s]+/)[0] || 'N/A',
                        valueB: parts[2].trim().split(/[,\s]+/)[1] || 'N/A'
                    });
                }
            });
        }
        
        if (itemA && itemB) {
            comparisons.push({
                type: 'comparison',
                data: {
                    title: `${itemA} vs ${itemB}`,
                    itemA,
                    itemB,
                    items: points.length > 0 ? points : [
                        { label: 'Comparison', valueA: itemA, valueB: itemB }
                    ]
                },
                position: match.index || 0
            });
        }
    }
    
    return comparisons;
}

/**
 * Detect all interactive content in article
 */
export function detectInteractiveContent(content: string): DetectedContent[] {
    const allContent: DetectedContent[] = [];
    
    // Detect all types
    allContent.push(...detectTables(content));
    allContent.push(...detectStatistics(content));
    allContent.push(...detectQuotes(content));
    allContent.push(...detectComparisons(content));
    
    // Sort by position
    allContent.sort((a, b) => a.position - b.position);
    
    return allContent;
}

/**
 * Render detected content as React components
 */
export function renderDetectedContent(
    detected: DetectedContent,
    articleUrl?: string,
    articleTitle?: string,
    category?: string
): React.ReactNode {
    switch (detected.type) {
        case 'table':
            // Convert markdown table to ComparisonTable format
            const { headers, rows } = detected.data;
            if (headers.length >= 2) {
                // Assume first column is feature, rest are products
                const products = headers.slice(1).map((header: string, idx: number) => ({
                    id: `product-${idx}`,
                    name: header,
                    image: '',
                    rating: 0,
                    points: rows.map((row: string[]) => ({
                        label: row[0],
                        value: row[idx + 1] || '',
                        isFeature: false
                    })),
                    ctaLink: '#'
                }));
                
                return (
                    <ComparisonTable 
                        key={`table-${detected.position}`}
                        products={products}
                    />
                );
            }
            return null;
            
        case 'stat':
            return (
                <SharableStatCard
                    key={`stat-${detected.position}`}
                    title={detected.data.title}
                    value={detected.data.value}
                    source={detected.data.source}
                    articleUrl={articleUrl}
                    articleTitle={articleTitle}
                    category={category}
                />
            );
            
        case 'quote':
            return (
                <TweetableQuote
                    key={`quote-${detected.position}`}
                    text={detected.data.text}
                    source={detected.data.source}
                    articleUrl={articleUrl}
                    articleTitle={articleTitle}
                    category={category}
                    variant="standalone"
                />
            );
            
        case 'comparison':
            return (
                <SharableComparisonCard
                    key={`comparison-${detected.position}`}
                    title={detected.data.title}
                    itemA={detected.data.itemA}
                    itemB={detected.data.itemB}
                    items={detected.data.items}
                    articleUrl={articleUrl}
                    articleTitle={articleTitle}
                    category={category}
                />
            );
            
        default:
            return null;
    }
}
