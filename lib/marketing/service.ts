import { AffiliateAdapter, AffiliateProduct } from './types';
import { logger } from '@/lib/logger';

export class AffiliateManager {
  private adapters: AffiliateAdapter[] = [];

  constructor() {
    // Initialize adapters here
    // this.registerAdapter(new CuelinksAdapter());
  }

  registerAdapter(adapter: AffiliateAdapter) {
    this.adapters.push(adapter);
  }

  async fetchAllProducts(category: string): Promise<AffiliateProduct[]> {
    const results = await Promise.allSettled(
      this.adapters.map(adapter => adapter.fetchProducts(category))
    );

    const products: AffiliateProduct[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        products.push(...result.value);
      } else {
        logger.error(`Failed to fetch from ${this.adapters[index].providerName}:`, result.reason);
      }
    });

    return products;
  }
}
