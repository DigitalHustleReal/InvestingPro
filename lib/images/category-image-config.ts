/**
 * Category-Specific Image Configuration
 * 
 * Provides optimized image loading strategies for different product categories
 * - Lazy loading thresholds
 * - Image sizes
 * - Priority settings
 */

export type ProductCategory = 'credit_card' | 'mutual_fund' | 'loan' | 'insurance' | 'demat_account' | 'banking';

export interface CategoryImageConfig {
  /** Lazy loading threshold (distance from viewport in pixels) */
  lazyThreshold: number;
  /** Default image width */
  defaultWidth: number;
  /** Default image height */
  defaultHeight: number;
  /** Priority loading (for above-fold images) */
  priority: boolean;
  /** Image quality (1-100) */
  quality: number;
  /** Loading strategy */
  loading: 'lazy' | 'eager';
}

/**
 * Category-specific image configurations
 * 
 * Credit Cards: Higher priority (above fold), eager loading
 * Mutual Funds: Medium priority, lazy loading
 * Loans: Lower priority, lazy loading
 * Insurance: Medium priority, lazy loading
 */
export const categoryImageConfigs: Record<ProductCategory, CategoryImageConfig> = {
  credit_card: {
    lazyThreshold: 200, // Load 200px before entering viewport
    defaultWidth: 400,
    defaultHeight: 250,
    priority: true, // Credit cards often above fold
    quality: 85,
    loading: 'eager', // Load immediately for better UX
  },
  mutual_fund: {
    lazyThreshold: 300,
    defaultWidth: 400,
    defaultHeight: 400,
    priority: false,
    quality: 80,
    loading: 'lazy',
  },
  loan: {
    lazyThreshold: 400,
    defaultWidth: 400,
    defaultHeight: 300,
    priority: false,
    quality: 75,
    loading: 'lazy',
  },
  insurance: {
    lazyThreshold: 300,
    defaultWidth: 400,
    defaultHeight: 300,
    priority: false,
    quality: 80,
    loading: 'lazy',
  },
  demat_account: {
    lazyThreshold: 300,
    defaultWidth: 400,
    defaultHeight: 300,
    priority: false,
    quality: 80,
    loading: 'lazy',
  },
  banking: {
    lazyThreshold: 300,
    defaultWidth: 400,
    defaultHeight: 300,
    priority: false,
    quality: 80,
    loading: 'lazy',
  },
};

/**
 * Get image config for a category
 */
export function getCategoryImageConfig(category: ProductCategory): CategoryImageConfig {
  return categoryImageConfigs[category] || categoryImageConfigs.mutual_fund;
}

/**
 * Get optimized image sizes for a category
 */
export function getCategoryImageSizes(category: ProductCategory): string {
  const config = getCategoryImageConfig(category);
  
  // Responsive sizes based on viewport
  if (category === 'credit_card') {
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px';
  }
  if (category === 'mutual_fund') {
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px';
  }
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px';
}
