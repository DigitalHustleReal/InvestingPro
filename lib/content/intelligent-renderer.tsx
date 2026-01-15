/**
 * Intelligent Content Renderer
 * 
 * Parses article content and intelligently places interactive components:
 * - Auto-detects tables, stats, quotes, comparisons
 * - Renders appropriate components
 * - Places them contextually (not pushed, naturally integrated)
 */

"use client";

import React from 'react';
import { detectInteractiveContent, renderDetectedContent, type DetectedContent } from './content-detector';
import TweetableQuote from '@/components/content/TweetableQuote';
import SharableStatCard from '@/components/content/SharableStatCard';
import SharableComparisonCard from '@/components/content/SharableComparisonCard';
import { ComparisonTable } from '@/components/content/ComparisonTable';

export interface IntelligentRendererProps {
    /**
     * Article content (HTML or Markdown)
     */
    content: string;
    
    /**
     * Article URL for sharing
     */
    articleUrl?: string;
    
    /**
     * Article title for context
     */
    articleTitle?: string;
    
    /**
     * Article category
     */
    category?: string;
    
    /**
     * Enable auto-detection
     */
    enableAutoDetection?: boolean;
    
    /**
     * Custom components to inject
     */
    customComponents?: Array<{
        type: 'quote' | 'stat' | 'comparison';
        data: any;
        position?: number;
    }>;
}

/**
 * Intelligent Content Renderer
 * 
 * Parses content and intelligently places interactive components
 */
export function IntelligentContentRenderer({
    content,
    articleUrl,
    articleTitle,
    category,
    enableAutoDetection = true,
    customComponents = []
}: IntelligentRendererProps) {
    // Detect interactive content
    const detectedContent = enableAutoDetection 
        ? detectInteractiveContent(content)
        : [];
    
    // Merge with custom components
    const allComponents = [
        ...detectedContent,
        ...customComponents.map(comp => ({
            type: comp.type,
            data: comp.data,
            position: comp.position || 0
        }))
    ].sort((a, b) => a.position - b.position);
    
    // Split content and inject components
    const renderContent = () => {
        if (allComponents.length === 0) {
            // No components to inject, return content as-is
            return <div dangerouslySetInnerHTML={{ __html: content }} />;
        }
        
        // Split content at component positions and inject components
        const parts: Array<{ type: 'content' | 'component'; data: any }> = [];
        let lastPosition = 0;
        
        allComponents.forEach((component, index) => {
            // Add content before component
            if (component.position > lastPosition) {
                const contentPart = content.substring(lastPosition, component.position);
                if (contentPart.trim()) {
                    parts.push({
                        type: 'content',
                        data: contentPart
                    });
                }
            }
            
            // Add component
            parts.push({
                type: 'component',
                data: component
            });
            
            lastPosition = component.position;
        });
        
        // Add remaining content
        if (lastPosition < content.length) {
            const remainingContent = content.substring(lastPosition);
            if (remainingContent.trim()) {
                parts.push({
                    type: 'content',
                    data: remainingContent
                });
            }
        }
        
        // Render parts
        return (
            <>
                {parts.map((part, index) => {
                    if (part.type === 'content') {
                        return (
                            <div 
                                key={`content-${index}`}
                                dangerouslySetInnerHTML={{ __html: part.data }}
                            />
                        );
                    } else {
                        return (
                            <div key={`component-${index}`} className="my-8">
                                {renderDetectedContent(
                                    part.data,
                                    articleUrl,
                                    articleTitle,
                                    category
                                )}
                            </div>
                        );
                    }
                })}
            </>
        );
    };
    
    return <div className="prose prose-lg max-w-none">{renderContent()}</div>;
}

/**
 * Extract and render tables from markdown
 */
export function renderMarkdownTables(content: string): React.ReactNode[] {
    const tables: React.ReactNode[] = [];
    const tableRegex = /^\|(.+)\|\s*\n\|[-\s|:]+\|\s*\n((?:\|.+\|\s*\n?)+)/gm;
    
    let match;
    let index = 0;
    while ((match = tableRegex.exec(content)) !== null) {
        const headers = match[1].split('|').map(h => h.trim()).filter(Boolean);
        const rows = match[2].split('\n')
            .filter(row => row.trim())
            .map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));
        
        if (headers.length >= 2) {
            // Convert to ComparisonTable format
            const products = headers.slice(1).map((header, idx) => ({
                id: `product-${index}-${idx}`,
                name: header,
                image: '',
                rating: 0,
                points: rows.map(row => ({
                    label: row[0],
                    value: row[idx + 1] || '',
                    isFeature: false
                })),
                ctaLink: '#'
            }));
            
            tables.push(
                <ComparisonTable 
                    key={`table-${index}`}
                    products={products}
                />
            );
        }
        index++;
    }
    
    return tables;
}

/**
 * Extract and render statistics from content
 */
export function renderStatistics(content: string, articleUrl?: string, articleTitle?: string, category?: string): React.ReactNode[] {
    const stats: React.ReactNode[] = [];
    const statPattern = /(?:₹|Rs\.?)\s*([\d,]+(?:\.[\d]+)?)\s*(lakh|crore|thousand|K|L|Cr|%)\s*(?:p\.?a\.?|per\s+annum)?/gi;
    
    let match;
    let index = 0;
    while ((match = statPattern.exec(content)) !== null) {
        const value = match[1];
        const unit = match[2];
        
        // Extract context for title
        const start = Math.max(0, match.index - 50);
        const end = Math.min(content.length, match.index + match[0].length + 50);
        const context = content.substring(start, end);
        const titleMatch = context.match(/([A-Z][^.!?]*?)(?:₹|Rs\.?|\d+%)/);
        const title = titleMatch ? titleMatch[1].trim().substring(0, 60) : 'Statistic';
        
        stats.push(
            <SharableStatCard
                key={`stat-${index}`}
                title={title}
                value={`${value} ${unit}`}
                articleUrl={articleUrl}
                articleTitle={articleTitle}
                category={category}
            />
        );
        index++;
    }
    
    return stats;
}
