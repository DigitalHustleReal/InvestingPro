/**
 * Cache Monitor
 * Tracks cache hit rates and performance
 */

import { cacheService } from './cache-service';
import { logger } from '@/lib/logger';

interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
}

class CacheMonitor {
  private metrics: Map<string, CacheMetrics> = new Map();
  private totalHits = 0;
  private totalMisses = 0;

  /**
   * Record a cache hit
   */
  recordHit(key: string, category: string = 'default'): void {
    this.totalHits++;
    const metrics = this.getOrCreateMetrics(category);
    metrics.hits++;
    this.updateHitRate(category, metrics);
  }

  /**
   * Record a cache miss
   */
  recordMiss(key: string, category: string = 'default'): void {
    this.totalMisses++;
    const metrics = this.getOrCreateMetrics(category);
    metrics.misses++;
    this.updateHitRate(category, metrics);
  }

  /**
   * Record a cache set
   */
  recordSet(key: string, category: string = 'default'): void {
    const metrics = this.getOrCreateMetrics(category);
    metrics.sets++;
  }

  /**
   * Record a cache delete
   */
  recordDelete(key: string, category: string = 'default'): void {
    const metrics = this.getOrCreateMetrics(category);
    metrics.deletes++;
  }

  /**
   * Get or create metrics for a category
   */
  private getOrCreateMetrics(category: string): CacheMetrics {
    if (!this.metrics.has(category)) {
      this.metrics.set(category, {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        hitRate: 0,
      });
    }
    return this.metrics.get(category)!;
  }

  /**
   * Update hit rate for a category
   */
  private updateHitRate(category: string, metrics: CacheMetrics): void {
    const total = metrics.hits + metrics.misses;
    metrics.hitRate = total > 0 ? (metrics.hits / total) * 100 : 0;
  }

  /**
   * Get overall hit rate
   */
  getOverallHitRate(): number {
    const total = this.totalHits + this.totalMisses;
    return total > 0 ? (this.totalHits / total) * 100 : 0;
  }

  /**
   * Get metrics by category
   */
  getMetricsByCategory(): Record<string, CacheMetrics> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): {
    overall: {
      hits: number;
      misses: number;
      hitRate: number;
    };
    byCategory: Record<string, CacheMetrics>;
  } {
    return {
      overall: {
        hits: this.totalHits,
        misses: this.totalMisses,
        hitRate: this.getOverallHitRate(),
      },
      byCategory: this.getMetricsByCategory(),
    };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics.clear();
    this.totalHits = 0;
    this.totalMisses = 0;
  }
}

// Export singleton instance
export const cacheMonitor = new CacheMonitor();
