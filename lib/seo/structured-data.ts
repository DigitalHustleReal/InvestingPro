/**
 * Structured Data (JSON-LD) Generator
 * Implements Schema.org markup for SEO
 * 
 * Types:
 * - Product
 * - FinancialProduct
 * - FAQPage
 * - Review
 * - BreadcrumbList
 */

export interface StructuredData {
    '@context': string;
    '@type': string;
    [key: string]: any;
}

/**
 * Generate Product structured data for credit card
 */
export function generateCreditCardStructuredData(card: {
    name: string;
    provider: string;
    slug: string;
    annualFee?: number;
    interestRate?: number;
    rewardRate?: number;
    description?: string;
    url: string;
    lastUpdated: string;
}): StructuredData {
    return {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: card.name,
        provider: {
            '@type': 'FinancialService',
            name: card.provider
        },
        description: card.description || `${card.name} by ${card.provider}`,
        url: card.url,
        category: 'Credit Card',
        feesAndCommissionsSpecification: {
            '@type': 'UnitPriceSpecification',
            price: card.annualFee || 0,
            priceCurrency: 'INR',
            name: 'Annual Fee'
        },
        interestRate: card.interestRate ? {
            '@type': 'QuantitativeValue',
            value: card.interestRate,
            unitText: 'percent'
        } : undefined,
        dateModified: card.lastUpdated,
        aggregateRating: undefined, // Add if available
    };
}

/**
 * Generate Product structured data for mutual fund
 */
export function generateMutualFundStructuredData(fund: {
    name: string;
    provider: string;
    slug: string;
    category: string;
    returns3Y?: number;
    expenseRatio?: number;
    description?: string;
    url: string;
    lastUpdated: string;
}): StructuredData {
    return {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: fund.name,
        provider: {
            '@type': 'FinancialService',
            name: fund.provider
        },
        description: fund.description || `${fund.name} by ${fund.provider}`,
        url: fund.url,
        category: fund.category,
        feesAndCommissionsSpecification: {
            '@type': 'UnitPriceSpecification',
            price: fund.expenseRatio || 0,
            priceCurrency: 'INR',
            name: 'Expense Ratio'
        },
        dateModified: fund.lastUpdated,
    };
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQStructuredData(faqs: Array<{
    question: string;
    answer: string;
}>): StructuredData {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{
    name: string;
    url: string;
}>): StructuredData {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
}

/**
 * Generate Review structured data
 */
export function generateReviewStructuredData(review: {
    productName: string;
    rating: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
}): StructuredData {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: review.productName,
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: review.rating,
            reviewCount: review.reviewCount,
            bestRating: review.bestRating || 5,
            worstRating: review.worstRating || 1
        }
    };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationStructuredData(): StructuredData {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'InvestingPro',
        url: 'https://investingpro.in',
        logo: 'https://investingpro.in/logo.png',
        description: 'India\'s leading independent financial comparison platform',
        sameAs: [
            // Add social media links
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'support@investingpro.in'
        }
    };
}

/**
 * Combine multiple structured data objects
 */
export function combineStructuredData(...data: StructuredData[]): string {
    return JSON.stringify(data, null, 2);
}

