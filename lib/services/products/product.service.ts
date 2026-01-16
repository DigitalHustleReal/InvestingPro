/**
 * Product Service
 * Business logic for products
 */
import { SupabaseProductRepository, type ProductRepository, type ProductQuery } from './product.repository';
import { CachedProductRepository } from './product.repository.cached';
import { logger } from '@/lib/logger';

export interface ProductService {
    getProducts(query: ProductQuery): Promise<{
        products: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        source?: string;
    }>;
    getProductById(id: string): Promise<any | null>;
    getProductBySlug(slug: string): Promise<any | null>;
}

export class ProductServiceImpl implements ProductService {
    private repository: ProductRepository;

    constructor(repository?: ProductRepository) {
        // Use cached repository by default for better performance
        // Can be overridden for testing or special cases
        this.repository = repository || new CachedProductRepository();
    }

    async getProducts(query: ProductQuery): Promise<{
        products: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        source?: string;
    }> {
        try {
            const page = query.page || 1;
            const limit = query.limit || 20;

            const { data, count } = await this.repository.findMany(query);

            return {
                products: data,
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
                source: 'direct'
            };
        } catch (error) {
            logger.error('Product service getProducts error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getProductById(id: string): Promise<any | null> {
        try {
            return await this.repository.findById(id);
        } catch (error) {
            logger.error('Product service getProductById error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getProductBySlug(slug: string): Promise<any | null> {
        try {
            return await this.repository.findBySlug(slug);
        } catch (error) {
            logger.error('Product service getProductBySlug error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}

// Export singleton instance
export const productService = new ProductServiceImpl();
