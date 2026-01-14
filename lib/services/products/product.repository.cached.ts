/**
 * Cached Product Repository
 * Adds Redis caching layer to product repository
 */
import { SupabaseProductRepository, type ProductRepository, type ProductQuery } from './product.repository';
import { cacheGet, cacheSet, cacheDelete } from '@/lib/cache/redis-service';
import { logger } from '@/lib/logger';

const CACHE_TTL = 300; // 5 minutes
const CACHE_PREFIX = 'product:';

export class CachedProductRepository extends SupabaseProductRepository {
    private async getCacheKey(query: ProductQuery): Promise<string> {
        const parts = [
            CACHE_PREFIX,
            `page:${query.page || 1}`,
            `limit:${query.limit || 20}`,
            query.category ? `cat:${query.category}` : '',
            query.search ? `search:${query.search}` : '',
            query.featured !== undefined ? `featured:${query.featured}` : ''
        ].filter(Boolean);
        return parts.join(':');
    }

    async findMany(query: ProductQuery): Promise<{ data: any[]; count: number }> {
        try {
            const cacheKey = await this.getCacheKey(query);

            // Try cache first
            const cached = await cacheGet<{ data: any[]; count: number }>(cacheKey);
            if (cached) {
                logger.debug('Product cache hit', { cacheKey });
                return cached;
            }

            // Cache miss - fetch from database
            const result = await super.findMany(query);

            // Store in cache
            await cacheSet(cacheKey, result, CACHE_TTL);
            logger.debug('Product cache set', { cacheKey });

            return result;
        } catch (error) {
            logger.warn('Cache error, falling back to direct query', error instanceof Error ? error : new Error(String(error)));
            return await super.findMany(query);
        }
    }

    async findById(id: string): Promise<any | null> {
        try {
            const cacheKey = `${CACHE_PREFIX}id:${id}`;

            // Try cache first
            const cached = await cacheGet<any>(cacheKey);
            if (cached !== null) {
                logger.debug('Product cache hit', { cacheKey });
                return cached;
            }

            // Cache miss
            const result = await super.findById(id);

            // Store in cache (null results also cached to prevent repeated DB queries)
            await cacheSet(cacheKey, result, CACHE_TTL);
            logger.debug('Product cache set', { cacheKey });

            return result;
        } catch (error) {
            logger.warn('Cache error, falling back to direct query', error instanceof Error ? error : new Error(String(error)));
            return await super.findById(id);
        }
    }

    async findBySlug(slug: string): Promise<any | null> {
        try {
            const cacheKey = `${CACHE_PREFIX}slug:${slug}`;

            // Try cache first
            const cached = await cacheGet<any>(cacheKey);
            if (cached !== null) {
                logger.debug('Product cache hit', { cacheKey });
                return cached;
            }

            // Cache miss
            const result = await super.findBySlug(slug);

            // Store in cache
            await cacheSet(cacheKey, result, CACHE_TTL);
            logger.debug('Product cache set', { cacheKey });

            return result;
        } catch (error) {
            logger.warn('Cache error, falling back to direct query', error instanceof Error ? error : new Error(String(error)));
            return await super.findBySlug(slug);
        }
    }

    /**
     * Invalidate cache for a product
     */
    async invalidateCache(id?: string, slug?: string): Promise<void> {
        try {
            const keys: string[] = [];

            if (id) {
                keys.push(`${CACHE_PREFIX}id:${id}`);
            }

            if (slug) {
                keys.push(`${CACHE_PREFIX}slug:${slug}`);
            }

            // Invalidate all query caches (pattern matching)
            if (keys.length > 0) {
                // Note: Redis pattern matching requires SCAN in production
                // For now, we'll just invalidate specific keys
                await Promise.all(keys.map(key => cacheDelete(key)));
                logger.debug('Product cache invalidated', { keys });
            }
        } catch (error) {
            logger.warn('Cache invalidation error', error instanceof Error ? error : new Error(String(error)));
        }
    }
}
