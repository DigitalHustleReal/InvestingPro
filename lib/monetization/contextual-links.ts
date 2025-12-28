/**
 * Contextual Affiliate Link Insertion
 * 
 * Automatically inserts affiliate links contextually based on content
 * WITHOUT affecting product rankings or trust
 */

import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

export interface ContextualLinkContext {
    contentType: 'product-card' | 'article' | 'comparison' | 'calculator' | 'pillar';
    category?: string;
    productId?: string;
    articleId?: string;
    keywords?: string[];
    position?: 'inline' | 'cta' | 'sidebar' | 'footer';
}

export interface ContextualAffiliateLink {
    productId: string;
    productName: string;
    affiliateLink: string;
    context: string; // Why this link is relevant
    disclosure: string; // Required disclosure text
    position: 'inline' | 'cta' | 'sidebar' | 'footer';
    priority: number; // 1-10, higher = more relevant
}

/**
 * Generate contextual affiliate links
 * 
 * Rules:
 * - Only insert when contextually relevant
 * - Never affect product rankings
 * - Always include disclosure
 * - Maximum 3 links per page
 */
export async function generateContextualLinks(
    context: ContextualLinkContext
): Promise<ContextualAffiliateLink[]> {
    const links: ContextualAffiliateLink[] = [];

    try {
        // Get relevant products based on context
        const relevantProducts = await getRelevantProducts(context);

        // Filter and prioritize
        const prioritized = relevantProducts
            .filter(product => isContextuallyRelevant(product, context))
            .sort((a, b) => b.priority - a.priority)
            .slice(0, 3); // Maximum 3 links per page

        // Generate contextual links with disclosures
        for (const product of prioritized) {
            links.push({
                productId: product.id,
                productName: product.name,
                affiliateLink: product.affiliate_link,
                context: generateContext(product, context),
                disclosure: generateDisclosure(product, context),
                position: context.position || 'cta',
                priority: product.priority,
            });
        }

    } catch (error) {
        logger.error('Error generating contextual links', error as Error, { context });
    }

    return links;
}

/**
 * Get relevant products based on context
 */
async function getRelevantProducts(context: ContextualLinkContext): Promise<any[]> {
    // If specific product ID, get that product
    if (context.productId) {
        const products = await api.entities.AffiliateProduct.filter({ id: context.productId });
        return products.map((p: any) => ({ ...p, priority: 10 }));
    }

    // Otherwise, get products by category
    if (context.category) {
        const products = await api.entities.AffiliateProduct.filter({
            category: context.category,
            is_active: true,
        });
        return products.map((p: any) => ({ ...p, priority: calculateRelevance(p, context) }));
    }

    return [];
}

/**
 * Calculate relevance score for a product
 */
function calculateRelevance(product: any, context: ContextualLinkContext): number {
    let score = 5; // Base score

    // Category match
    if (product.category === context.category) {
        score += 2;
    }

    // Keyword match
    if (context.keywords && product.keywords) {
        const matches = context.keywords.filter(k => 
            product.keywords.some((pk: string) => pk.toLowerCase().includes(k.toLowerCase()))
        );
        score += matches.length;
    }

    // Product performance (clicks, conversions)
    if (product.clicks > 100) score += 1;
    if (product.conversions > 10) score += 1;

    return Math.min(score, 10);
}

/**
 * Check if product is contextually relevant
 */
function isContextuallyRelevant(product: any, context: ContextualLinkContext): boolean {
    // Must have active affiliate link
    if (!product.affiliate_link || !product.is_active) {
        return false;
    }

    // Category must match (if specified)
    if (context.category && product.category !== context.category) {
        return false;
    }

    return true;
}

/**
 * Generate contextual explanation for link
 */
function generateContext(product: any, context: ContextualLinkContext): string {
    switch (context.contentType) {
        case 'product-card':
            return `Apply for ${product.name} directly through our partner`;
        case 'article':
            return `Learn more about ${product.name} and apply`;
        case 'comparison':
            return `Compare ${product.name} with other options`;
        case 'calculator':
            return `Use ${product.name} to achieve your financial goals`;
        case 'pillar':
            return `Explore ${product.name} and similar products`;
        default:
            return `Apply for ${product.name}`;
    }
}

/**
 * Generate disclosure text
 */
function generateDisclosure(product: any, context: ContextualLinkContext): string {
    return `We may earn a commission if you apply through this link. This does not affect our editorial independence or product rankings.`;
}

