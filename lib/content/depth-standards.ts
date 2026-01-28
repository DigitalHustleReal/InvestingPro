/**
 * Content Depth Standards
 * 
 * Defines minimum content depth requirements by content type
 * to ensure comprehensive, valuable content that ranks well.
 */

export interface ContentDepthStandards {
    minWordCount: number;
    targetWordCount: number;
    minHeadings: number;
    minSections: number;
    minExamples: number;
    minDataPoints: number;
    minCitations: number;
    requiredSections?: string[];
}

/**
 * Content depth standards by content type
 */
export const CONTENT_DEPTH_BY_TYPE: Record<string, ContentDepthStandards> = {
    // Long-form articles
    article: {
        minWordCount: 1500,
        targetWordCount: 2500,
        minHeadings: 8,
        minSections: 6,
        minExamples: 5,
        minDataPoints: 10,
        minCitations: 5,
        requiredSections: [
            'Introduction',
            'Key Points/Features',
            'How It Works',
            'Benefits',
            'Considerations',
            'Conclusion'
        ]
    },
    
    // Comprehensive guides
    guide: {
        minWordCount: 2000,
        targetWordCount: 3500,
        minHeadings: 10,
        minSections: 8,
        minExamples: 8,
        minDataPoints: 15,
        minCitations: 8,
        requiredSections: [
            'Introduction',
            'What is X',
            'How to Get Started',
            'Step-by-Step Process',
            'Tips & Best Practices',
            'Common Mistakes',
            'FAQs',
            'Conclusion'
        ]
    },
    
    // Product comparisons
    comparison: {
        minWordCount: 1000,
        targetWordCount: 2000,
        minHeadings: 6,
        minSections: 5,
        minExamples: 3,
        minDataPoints: 20, // Comparison data
        minCitations: 3,
        requiredSections: [
            'Introduction',
            'Comparison Criteria',
            'Detailed Comparison',
            'Verdict/Summary',
            'FAQs'
        ]
    },
    
    // Glossary terms
    glossary: {
        minWordCount: 300,
        targetWordCount: 600,
        minHeadings: 3,
        minSections: 3,
        minExamples: 2,
        minDataPoints: 3,
        minCitations: 2,
        requiredSections: [
            'Definition',
            'Example',
            'Related Terms'
        ]
    },
    
    // News articles
    news: {
        minWordCount: 400,
        targetWordCount: 800,
        minHeadings: 4,
        minSections: 3,
        minExamples: 1,
        minDataPoints: 5,
        minCitations: 3,
        requiredSections: [
            'Summary',
            'Details',
            'Impact'
        ]
    },
    
    // Product reviews
    review: {
        minWordCount: 1200,
        targetWordCount: 2000,
        minHeadings: 7,
        minSections: 6,
        minExamples: 4,
        minDataPoints: 12,
        minCitations: 4,
        requiredSections: [
            'Overview',
            'Features',
            'Pros',
            'Cons',
            'Verdict',
            'FAQs'
        ]
    }
};

/**
 * Validate content depth against standards
 */
export function validateContentDepth(
    contentType: string,
    metrics: {
        wordCount: number;
        headingCount: number;
        sectionCount: number;
        exampleCount: number;
        dataPointCount: number;
        citationCount: number;
        sections: string[];
    }
): {
    passes: boolean;
    score: number;
    issues: string[];
    recommendations: string[];
} {
    const standards = CONTENT_DEPTH_BY_TYPE[contentType];
    
    if (!standards) {
        return {
            passes: true,
            score: 100,
            issues: [],
            recommendations: [`Unknown content type: ${contentType}`]
        };
    }
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;
    
    // Word count validation
    if (metrics.wordCount < standards.minWordCount) {
        issues.push(`Word count too low: ${metrics.wordCount} (min: ${standards.minWordCount})`);
        score -= 20;
    } else if (metrics.wordCount < standards.targetWordCount) {
        recommendations.push(`Consider expanding to ${standards.targetWordCount} words for better depth`);
        score -= 5;
    }
    
    // Heading validation
    if (metrics.headingCount < standards.minHeadings) {
        issues.push(`Not enough headings: ${metrics.headingCount} (min: ${standards.minHeadings})`);
        score -= 10;
    }
    
    // Section validation
    if (metrics.sectionCount < standards.minSections) {
        issues.push(`Not enough sections: ${metrics.sectionCount} (min: ${standards.minSections})`);
        score -= 10;
    }
    
    // Example validation
    if (metrics.exampleCount < standards.minExamples) {
        issues.push(`Not enough examples: ${metrics.exampleCount} (min: ${standards.minExamples})`);
        score -= 10;
    }
    
    // Data point validation
    if (metrics.dataPointCount < standards.minDataPoints) {
        issues.push(`Not enough data points: ${metrics.dataPointCount} (min: ${standards.minDataPoints})`);
        score -= 10;
    }
    
    // Citation validation
    if (metrics.citationCount < standards.minCitations) {
        issues.push(`Not enough citations: ${metrics.citationCount} (min: ${standards.minCitations})`);
        score -= 15;
    }
    
    // Required sections validation
    if (standards.requiredSections) {
        const missingSections = standards.requiredSections.filter(
            required => !metrics.sections.some(section => 
                section.toLowerCase().includes(required.toLowerCase())
            )
        );
        
        if (missingSections.length > 0) {
            issues.push(`Missing required sections: ${missingSections.join(', ')}`);
            score -= missingSections.length * 5;
        }
    }
    
    score = Math.max(0, score);
    const passes = score >= 70 && issues.length === 0;
    
    return {
        passes,
        score,
        issues,
        recommendations
    };
}

/**
 * Get content depth report
 */
export function getContentDepthReport(contentType: string): string {
    const standards = CONTENT_DEPTH_BY_TYPE[contentType];
    
    if (!standards) {
        return `No depth standards defined for content type: ${contentType}`;
    }
    
    return `
Content Depth Standards for ${contentType.toUpperCase()}:

Word Count: ${standards.minWordCount} - ${standards.targetWordCount} words
Headings: ${standards.minHeadings}+ headings
Sections: ${standards.minSections}+ sections
Examples: ${standards.minExamples}+ real-world examples
Data Points: ${standards.minDataPoints}+ specific data/statistics
Citations: ${standards.minCitations}+ authoritative sources

${standards.requiredSections ? `Required Sections:\n${standards.requiredSections.map(s => `- ${s}`).join('\n')}` : ''}
    `.trim();
}
