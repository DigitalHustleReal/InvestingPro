/**
 * Affiliate Disclosure Automation
 * 
 * Automatically injects FTC/SEBI-compliant affiliate disclosure when affiliate links are detected
 * in article content.
 * 
 * Requirements:
 * - FTC: Clear disclosure of affiliate relationships
 * - SEBI: Disclosure required for financial product recommendations
 */

import { logger } from '@/lib/logger';

/**
 * Disclosure text variants (FTC/SEBI compliant)
 */
const DISCLOSURE_TEXTS = {
    // Standard disclosure (most common)
    standard: `**Disclosure:** We may receive a commission if you apply through our affiliate links. This does not affect our editorial independence or the accuracy of our recommendations.`,

    // Financial products (SEBI-compliant)
    financial: `**Disclosure:** We may earn a commission when you apply through our affiliate links. Our recommendations are based on independent research and are not influenced by commissions. Past performance does not guarantee future results.`,

    // Credit cards (IRDA/FTC)
    creditCards: `**Disclosure:** We may receive compensation when you apply through our affiliate links. This does not impact our editorial content or product ratings. Please read the terms and conditions before applying.`,

    // Investment products (SEBI)
    investments: `**Disclosure:** We may earn commissions from affiliate links. Our analysis and recommendations are independent and based on objective criteria. Investments are subject to market risks. Please consult a financial advisor.`,
};

/**
 * Check if content contains affiliate links
 * 
 * Detects:
 * - `/api/out?id=` (our affiliate tracking links)
 * - "apply now" / "click here" patterns
 * - Affiliate link patterns (tracking parameters, partner links)
 */
export function hasAffiliateLinks(content: string): boolean {
    const normalizedContent = content.toLowerCase();

    // Pattern 1: Our affiliate tracking links
    if (/\/api\/out\?id=|affiliate/i.test(content)) {
        return true;
    }

    // Pattern 2: "Apply Now" / "Click Here" CTAs (often indicate affiliate links)
    if (/apply now|click here to apply|get started now/i.test(normalizedContent)) {
        return true;
    }

    // Pattern 3: External affiliate link patterns (common tracking params)
    if (/ref=|affiliate_id|partner_id|utm_source=affiliate/i.test(content)) {
        return true;
    }

    return false;
}

/**
 * Check if content already contains disclosure
 */
export function hasDisclosure(content: string): boolean {
    const normalizedContent = content.toLowerCase();

    // Check for disclosure keywords
    const disclosurePatterns = [
        /disclosure[^.]*commission/,
        /disclosure[^.]*affiliate/,
        /we may receive.*commission/,
        /we may earn.*commission/,
        /affiliate.*disclosure/,
        /commission.*disclosure/,
        /editorial independence/,
        /does not affect.*recommendation/,
    ];

    return disclosurePatterns.some(pattern => pattern.test(normalizedContent));
}

/**
 * Get appropriate disclosure text based on category
 */
function getDisclosureText(category?: string): string {
    if (!category) {
        return DISCLOSURE_TEXTS.standard;
    }

    const categoryLower = category.toLowerCase();

    // Credit cards
    if (categoryLower.includes('credit-card')) {
        return DISCLOSURE_TEXTS.creditCards;
    }

    // Investment products (mutual funds, stocks)
    if (categoryLower.includes('mutual-fund') || 
        categoryLower.includes('stock') || 
        categoryLower.includes('investment')) {
        return DISCLOSURE_TEXTS.investments;
    }

    // Financial products (loans, insurance)
    if (categoryLower.includes('loan') || 
        categoryLower.includes('insurance') || 
        categoryLower.includes('financial')) {
        return DISCLOSURE_TEXTS.financial;
    }

    // Default
    return DISCLOSURE_TEXTS.standard;
}

/**
 * Inject affiliate disclosure into content
 * 
 * Strategy:
 * 1. If disclosure exists, don't add another
 * 2. Inject before the first affiliate link or CTA
 * 3. If no CTAs found, add at the beginning of content (after intro)
 * 
 * @param content - Article content (markdown or HTML)
 * @param category - Article category (optional, for category-specific disclosure)
 * @returns Content with disclosure injected
 */
export function injectAffiliateDisclosure(
    content: string,
    category?: string
): string {
    // Check if affiliate links exist
    if (!hasAffiliateLinks(content)) {
        return content; // No affiliate links, no disclosure needed
    }

    // Check if disclosure already exists
    if (hasDisclosure(content)) {
        logger.debug('Disclosure already present in content', { category });
        return content; // Already has disclosure
    }

    const disclosureText = getDisclosureText(category);
    const normalizedContent = content.toLowerCase();

    // Strategy 1: Inject before first "Apply Now" / CTA
    const ctaPatterns = [
        /(apply now|click here to apply|get started now)/i,
        /<a[^>]*href=["'][^"']*\/api\/out[^"']*["'][^>]*>.*?<\/a>/i,
        /<button[^>]*>.*?(apply|click).*?<\/button>/i,
    ];

    for (const pattern of ctaPatterns) {
        const match = content.match(pattern);
        if (match && match.index !== undefined) {
            // Insert disclosure before the CTA
            const beforeCTA = content.substring(0, match.index);
            const afterCTA = content.substring(match.index);
            
            logger.info('Injecting disclosure before CTA', { category, position: match.index });
            return `${beforeCTA}\n\n${disclosureText}\n\n${afterCTA}`;
        }
    }

    // Strategy 2: Inject after first paragraph (for markdown)
    if (content.includes('\n\n')) {
        const firstParagraphEnd = content.indexOf('\n\n');
        if (firstParagraphEnd > 0 && firstParagraphEnd < 500) {
            // Insert after first paragraph if it's short enough (likely intro)
            const beforePara = content.substring(0, firstParagraphEnd);
            const afterPara = content.substring(firstParagraphEnd);
            
            logger.info('Injecting disclosure after first paragraph', { category });
            return `${beforePara}\n\n${disclosureText}${afterPara}`;
        }
    }

    // Strategy 3: Inject at the beginning before first heading (for markdown)
    const firstHeadingMatch = content.match(/^(#{1,6}\s+.*?$)/m);
    if (firstHeadingMatch && firstHeadingMatch.index !== undefined && firstHeadingMatch.index < 200) {
        const beforeHeading = content.substring(0, firstHeadingMatch.index);
        const afterHeading = content.substring(firstHeadingMatch.index);
        
        // Only insert if there's some content before heading (intro text)
        if (beforeHeading.trim().length > 50) {
            logger.info('Injecting disclosure before first heading', { category });
            return `${beforeHeading}\n\n${disclosureText}\n\n${afterHeading}`;
        }
    }

    // Strategy 4: Inject at the beginning (fallback)
    logger.info('Injecting disclosure at beginning of content', { category });
    return `${disclosureText}\n\n${content}`;
}

/**
 * Validate disclosure compliance (for compliance checker)
 * 
 * Returns violation if affiliate links exist but disclosure is missing
 */
export function validateAffiliateDisclosure(content: string): {
    hasAffiliateLinks: boolean;
    hasDisclosure: boolean;
    isCompliant: boolean;
    shouldInject: boolean;
} {
    const hasLinks = hasAffiliateLinks(content);
    const hasDisclosureText = hasDisclosure(content);

    return {
        hasAffiliateLinks: hasLinks,
        hasDisclosure: hasDisclosureText,
        isCompliant: !hasLinks || hasDisclosureText, // Compliant if no links OR has disclosure
        shouldInject: hasLinks && !hasDisclosureText, // Should inject if links exist but no disclosure
    };
}
