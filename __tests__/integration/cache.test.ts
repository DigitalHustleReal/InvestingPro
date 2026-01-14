/**
 * Integration Tests: Caching
 */

import { cacheService } from '@/lib/cache/cache-service';
import { cacheKeyGenerators } from '@/lib/cache/cache-strategies';

describe('Cache Integration', () => {
  beforeEach(async () => {
    // Clear cache before each test
    await cacheService.clearAll();
  });

  describe('Cache Operations', () => {
    it('should set and get cache value', async () => {
      const key = 'test:key';
      const value = { test: 'data' };

      await cacheService.set(key, value, 60);
      const cached = await cacheService.get(key);

      expect(cached).toEqual(value);
    });

    it('should return null for non-existent key', async () => {
      const cached = await cacheService.get('non-existent-key');
      expect(cached).toBeNull();
    });

    it('should expire cache after TTL', async () => {
      const key = 'test:ttl';
      const value = { test: 'data' };

      await cacheService.set(key, value, 1); // 1 second TTL
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const cached = await cacheService.get(key);
      expect(cached).toBeNull();
    });

    it('should delete cache value', async () => {
      const key = 'test:delete';
      const value = { test: 'data' };

      await cacheService.set(key, value, 60);
      await cacheService.delete(key);
      
      const cached = await cacheService.get(key);
      expect(cached).toBeNull();
    });
  });

  describe('Cache Key Generation', () => {
    it('should generate article cache key', () => {
      const key = cacheKeyGenerators.article('test-slug');
      expect(key).toBe('article:test-slug');
    });

    it('should generate category cache key', () => {
      const key = cacheKeyGenerators.category('test-category');
      expect(key).toBe('category:test-category');
    });
  });

  describe('Cache Invalidation', () => {
    it('should invalidate by tags', async () => {
      const key1 = 'test:key1';
      const key2 = 'test:key2';

      await cacheService.set(key1, { data: 1 }, 60, ['tag1']);
      await cacheService.set(key2, { data: 2 }, 60, ['tag2']);

      await cacheService.invalidateByTags(['tag1']);

      const cached1 = await cacheService.get(key1);
      const cached2 = await cacheService.get(key2);

      expect(cached1).toBeNull();
      expect(cached2).toEqual({ data: 2 });
    });
  });
});
