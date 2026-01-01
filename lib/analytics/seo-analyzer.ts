
import { logger } from '@/lib/logger';

export interface SEOScore {
    overall: number; // 0-100
    breakdown: {
        title: SEOCheck;
        meta: SEOCheck;
        headings: SEOCheck;
        content: SEOCheck;
        images: SEOCheck;
        links: SEOCheck;
    };
    issues: SEOIssue[];
    recommendations: string[];
}

export interface SEOCheck {
    score: number; // 0-100
    status: 'good' | 'warning' | 'error';
    message: string;
}

export interface SEOIssue {
    type: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    fix?: string;
}

interface ArticleForSEO {
    title: string;
    slug: string;
    excerpt?: string;
    body_markdown?: string;
    seo_title?: string;
    seo_description?: string;
    featured_image?: string;
    tags?: string[];
}

export class SEOAnalyzer {
    /**
     * Analyze an article for SEO health
     */
    static analyze(article: ArticleForSEO): SEOScore {
        const issues: SEOIssue[] = [];
        const recommendations: string[] = [];

        // Title Analysis
        const titleCheck = this.analyzeTitle(article, issues, recommendations);
        
        // Meta Description Analysis
        const metaCheck = this.analyzeMeta(article, issues, recommendations);
        
        // Headings Analysis
        const headingsCheck = this.analyzeHeadings(article, issues, recommendations);
        
        // Content Analysis
        const contentCheck = this.analyzeContent(article, issues, recommendations);
        
        // Images Analysis
        const imagesCheck = this.analyzeImages(article, issues, recommendations);
        
        // Links Analysis
        const linksCheck = this.analyzeLinks(article, issues, recommendations);

        // Calculate overall score
        const scores = [
            titleCheck.score * 0.2,
            metaCheck.score * 0.2,
            headingsCheck.score * 0.15,
            contentCheck.score * 0.25,
            imagesCheck.score * 0.1,
            linksCheck.score * 0.1
        ];
        const overall = Math.round(scores.reduce((a, b) => a + b, 0));

        return {
            overall,
            breakdown: {
                title: titleCheck,
                meta: metaCheck,
                headings: headingsCheck,
                content: contentCheck,
                images: imagesCheck,
                links: linksCheck
            },
            issues,
            recommendations
        };
    }

    private static analyzeTitle(article: ArticleForSEO, issues: SEOIssue[], recommendations: string[]): SEOCheck {
        const title = article.seo_title || article.title;
        let score = 100;
        
        if (!title) {
            issues.push({ type: 'error', category: 'Title', message: 'Missing title', fix: 'Add a descriptive title' });
            return { score: 0, status: 'error', message: 'No title found' };
        }

        if (title.length < 30) {
            score -= 20;
            issues.push({ type: 'warning', category: 'Title', message: 'Title is too short', fix: 'Aim for 50-60 characters' });
        } else if (title.length > 60) {
            score -= 15;
            issues.push({ type: 'warning', category: 'Title', message: 'Title may be truncated in search results', fix: 'Keep under 60 characters' });
        }

        // Check for power words
        const powerWords = ['guide', 'how to', 'best', 'complete', 'ultimate', 'tips', 'strategies'];
        const hasPowerWord = powerWords.some(word => title.toLowerCase().includes(word));
        if (!hasPowerWord) {
            recommendations.push('Consider adding a power word to the title for better CTR');
        }

        return {
            score: Math.max(0, score),
            status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
            message: score >= 80 ? 'Title is well optimized' : 'Title needs improvement'
        };
    }

    private static analyzeMeta(article: ArticleForSEO, issues: SEOIssue[], recommendations: string[]): SEOCheck {
        const description = article.seo_description || article.excerpt;
        let score = 100;

        if (!description) {
            issues.push({ type: 'error', category: 'Meta', message: 'Missing meta description', fix: 'Add a compelling meta description' });
            return { score: 0, status: 'error', message: 'No meta description found' };
        }

        if (description.length < 120) {
            score -= 20;
            issues.push({ type: 'warning', category: 'Meta', message: 'Meta description is too short', fix: 'Aim for 150-160 characters' });
        } else if (description.length > 160) {
            score -= 10;
            issues.push({ type: 'info', category: 'Meta', message: 'Meta description may be truncated' });
        }

        return {
            score: Math.max(0, score),
            status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
            message: score >= 80 ? 'Meta description is good' : 'Meta description needs work'
        };
    }

    private static analyzeHeadings(article: ArticleForSEO, issues: SEOIssue[], recommendations: string[]): SEOCheck {
        const content = article.body_markdown || '';
        let score = 100;

        // Check for H2s
        const h2Count = (content.match(/^##\s/gm) || []).length;
        if (h2Count === 0) {
            score -= 30;
            issues.push({ type: 'warning', category: 'Headings', message: 'No H2 headings found', fix: 'Add subheadings for better structure' });
        } else if (h2Count < 3) {
            score -= 10;
            recommendations.push('Consider adding more subheadings for long-form content');
        }

        // Check for H3s
        const h3Count = (content.match(/^###\s/gm) || []).length;
        if (h2Count > 3 && h3Count === 0) {
            recommendations.push('Consider using H3 headings for detailed sections');
        }

        return {
            score: Math.max(0, score),
            status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
            message: `Found ${h2Count} H2 and ${h3Count} H3 headings`
        };
    }

    private static analyzeContent(article: ArticleForSEO, issues: SEOIssue[], recommendations: string[]): SEOCheck {
        const content = article.body_markdown || '';
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
        let score = 100;

        if (wordCount < 300) {
            score -= 40;
            issues.push({ type: 'error', category: 'Content', message: 'Content is too thin', fix: 'Aim for at least 1000 words for comprehensive coverage' });
        } else if (wordCount < 800) {
            score -= 20;
            issues.push({ type: 'warning', category: 'Content', message: 'Content could be more comprehensive', fix: 'Consider expanding to 1500+ words' });
        } else if (wordCount > 1500) {
            score += 10; // Bonus for long-form
        }

        // Check for lists
        const hasList = content.includes('- ') || content.includes('* ') || content.match(/^\d+\./m);
        if (!hasList && wordCount > 500) {
            recommendations.push('Add bullet points or numbered lists for better readability');
        }

        // Check for bold text
        const hasBold = content.includes('**') || content.includes('__');
        if (!hasBold) {
            recommendations.push('Use bold text to highlight key points');
        }

        return {
            score: Math.min(100, Math.max(0, score)),
            status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
            message: `${wordCount} words`
        };
    }

    private static analyzeImages(article: ArticleForSEO, issues: SEOIssue[], recommendations: string[]): SEOCheck {
        const content = article.body_markdown || '';
        let score = 100;

        // Check for featured image
        if (!article.featured_image) {
            score -= 30;
            issues.push({ type: 'warning', category: 'Images', message: 'No featured image', fix: 'Add a featured image for social sharing' });
        }

        // Check for images in content
        const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
        if (imageCount === 0) {
            score -= 20;
            recommendations.push('Add relevant images to break up text and improve engagement');
        }

        // Check for alt text (simplified check)
        const imagesWithoutAlt = (content.match(/!\[\]\(/g) || []).length;
        if (imagesWithoutAlt > 0) {
            score -= 15;
            issues.push({ type: 'warning', category: 'Images', message: `${imagesWithoutAlt} images missing alt text`, fix: 'Add descriptive alt text for accessibility and SEO' });
        }

        return {
            score: Math.max(0, score),
            status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
            message: imageCount > 0 ? `${imageCount} images found` : 'No inline images'
        };
    }

    private static analyzeLinks(article: ArticleForSEO, issues: SEOIssue[], recommendations: string[]): SEOCheck {
        const content = article.body_markdown || '';
        let score = 100;

        // Check for internal links
        const internalLinks = (content.match(/\]\(\/[^)]+\)/g) || []).length;
        if (internalLinks === 0) {
            score -= 20;
            recommendations.push('Add internal links to related articles for better site navigation');
        }

        // Check for external links
        const externalLinks = (content.match(/\]\(https?:\/\/[^)]+\)/g) || []).length;
        if (externalLinks === 0) {
            score -= 10;
            recommendations.push('Consider adding authoritative external links for credibility');
        } else if (externalLinks > 10) {
            score -= 10;
            issues.push({ type: 'info', category: 'Links', message: 'High number of external links' });
        }

        return {
            score: Math.max(0, score),
            status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
            message: `${internalLinks} internal, ${externalLinks} external links`
        };
    }
}
