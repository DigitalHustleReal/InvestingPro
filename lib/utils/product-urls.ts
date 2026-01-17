/**
 * Product URL Utilities
 * Standardized functions for generating product and affiliate URLs
 * Prevents broken links and inconsistent URL patterns
 */

export interface Product {
  id: string;
  slug?: string;
  category: string;
  affiliate_link?: string | null;
  applyLink?: string | null;
}

/**
 * Generate standardized product detail page URL
 * Format: /category/slug or /category/id
 */
export function getProductUrl(product: Pick<Product, 'category' | 'slug' | 'id'>): string {
  // Normalize category (credit_card → credit-cards)
  const category = product.category
    .replace(/_/g, '-')
    .toLowerCase();
  
  const identifier = product.slug || product.id;
  
  return `/${category}/${identifier}`;
}

/**
 * Generate product category listing URL
 * Format: /category (e.g., /credit-cards, /loans)
 */
export function getCategoryUrl(category: string): string {
  return `/${category.replace(/_/g, '-').toLowerCase()}`;
}

/**
 * Generate affiliate tracking URL with fallback
 * Priority: affiliate_link > /go/slug > product detail page
 */
export function getAffiliateUrl(product: Product): string {
  // Use provided affiliate link if valid
  if (product.affiliate_link && 
      product.affiliate_link !== '#' && 
      product.affiliate_link !== '') {
    return product.affiliate_link;
  }
  
  // Use applyLink if valid
  if (product.applyLink && 
      product.applyLink !== '#' && 
      product.applyLink !== '') {
    return product.applyLink;
  }
  
  // Use /go/ tracking URL if product has slug
  if (product.slug) {
    return `/go/${product.slug}`;
  }
  
  // Final fallback: product detail page
  return getProductUrl(product);
}

/**
 * Generate comparison URL
 * Format: /compare/slug1-vs-slug2
 */
export function getCompareUrl(product1: string, product2: string): string {
  return `/compare/${product1}-vs-${product2}`;
}

/**
 * Generate category comparison URL
 * Format: /category/compare
 */
export function getCategoryCompareUrl(category: string): string {
  return `/${category.replace(/_/g, '-').toLowerCase()}/compare`;
}

/**
 * Check if a URL is valid (not empty, not '#')
 */
export function isValidUrl(url: string | null | undefined): boolean {
  return Boolean(url && url !== '#' && url.trim() !== '');
}

/**
 * Get safe URL with fallback
 * Never returns '#' or empty string
 */
export function getSafeUrl(url: string | null | undefined, fallback: string = '/'): string {
  return isValidUrl(url) ? url! : fallback;
}
