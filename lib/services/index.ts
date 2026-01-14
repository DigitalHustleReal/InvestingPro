/**
 * Services Index
 * Central export for all services
 */
export { articleService, ArticleServiceImpl, type ArticleService } from './articles/article.service';
export { productService, ProductServiceImpl, type ProductService } from './products/product.service';
export { searchServiceInstance as searchService, SearchServiceImpl, type SearchService } from './search/search.service';
export { trendsService, TrendsServiceImpl, type TrendsServiceInterface } from './trends/trends.service';
export { bookmarkService, BookmarkServiceImpl, type BookmarkService } from './bookmarks/bookmark.service';
export { newsletterService, NewsletterServiceImpl, type NewsletterService } from './newsletter/newsletter.service';
export { affiliateService, AffiliateServiceImpl, type AffiliateService } from './affiliate/affiliate.service';
export { analyticsService } from '@/lib/analytics/service';
