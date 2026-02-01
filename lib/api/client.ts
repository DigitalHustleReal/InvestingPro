/**
 * API Client Layer
 * 
 * Centralized API client for frontend components
 * Replaces direct Supabase calls with API endpoints
 * 
 * Benefits:
 * - Frontend decoupled from database
 * - Consistent error handling
 * - Rate limiting
 * - Caching support
 * - Type safety
 */

import { getServerPublicUrl } from '@/lib/env';
import { logger } from '@/lib/logger';

export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        statusCode: number;
        details?: any;
    };
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    [key: string]: any;
}

/**
 * Base API client with error handling
 */
class APIClient {
    private baseURL: string;

    constructor() {
        this.baseURL = typeof window !== 'undefined'
            ? window.location.origin
            : getServerPublicUrl() || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    }

    /**
     * Make API request with error handling
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<APIResponse<T>> {
        try {
            const url = `${this.baseURL}${endpoint}`;
            
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || {
                        code: 'HTTP_ERROR',
                        message: `HTTP ${response.status}: ${response.statusText}`,
                        statusCode: response.status,
                    },
                };
            }

            return {
                success: true,
                data: data.data || data,
            };
        } catch (error) {
            logger.error('API request failed', error instanceof Error ? error : new Error(String(error)), {
                endpoint,
            });

            return {
                success: false,
                error: {
                    code: 'NETWORK_ERROR',
                    message: error instanceof Error ? error.message : 'Network error',
                    statusCode: 0,
                },
            };
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, params?: QueryParams): Promise<APIResponse<T>> {
        const queryString = params 
            ? '?' + new URLSearchParams(
                Object.entries(params)
                    .filter(([_, v]) => v !== undefined && v !== null)
                    .map(([k, v]) => [k, String(v)])
            ).toString()
            : '';

        return this.request<T>(`${endpoint}${queryString}`, {
            method: 'GET',
        });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body?: any): Promise<APIResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body?: any): Promise<APIResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, body?: any): Promise<APIResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<APIResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }
}

/**
 * API Client instance
 */
const apiClient = new APIClient();

/**
 * Articles API
 */
export const articlesAPI = {
    /**
     * Get public articles
     */
    list: (params?: QueryParams) => 
        apiClient.get<PaginatedResponse<any>>('/api/articles/public', params),

    /**
     * Get article by ID
     */
    getById: (id: string) => 
        apiClient.get<any>(`/api/articles/${id}`),

    /**
     * Get article by slug
     */
    getBySlug: (slug: string) => 
        apiClient.get<any>(`/api/articles/${slug}`),

    /**
     * Create article (admin)
     */
    create: (data: any) => 
        apiClient.post<any>('/api/articles', data),

    /**
     * Update article (admin)
     */
    update: (id: string, data: any) => 
        apiClient.put<any>(`/api/articles/${id}`, data),

    /**
     * Delete article (admin)
     */
    delete: (id: string) => 
        apiClient.delete(`/api/articles/${id}`),
};

/**
 * Products API
 */
export const productsAPI = {
    /**
     * Get public products
     */
    list: (params?: QueryParams) => 
        apiClient.get<PaginatedResponse<any>>('/api/products/public', params),

    /**
     * Get product by ID
     */
    getById: (id: string) => 
        apiClient.get<any>(`/api/products/${id}`),

    /**
     * Get product by slug
     */
    getBySlug: (slug: string) => 
        apiClient.get<any>(`/api/products/${slug}`),

    /**
     * Search products
     */
    search: (query: string, params?: QueryParams) => 
        apiClient.get<PaginatedResponse<any>>('/api/products/search', {
            ...params,
            q: query,
        }),
};

/**
 * Reviews API
 */
export const reviewsAPI = {
    /**
     * Get reviews for a product
     */
    list: (productId: string, params?: QueryParams) => 
        apiClient.get<any[]>(`/api/reviews`, {
            ...params,
            product_id: productId,
        }),

    /**
     * Create review
     */
    create: (data: any) => 
        apiClient.post<any>('/api/reviews', data),

    /**
     * Update review
     */
    update: (id: string, data: any) => 
        apiClient.put<any>(`/api/reviews/${id}`, data),
};

/**
 * Analytics API
 */
export const analyticsAPI = {
    /**
     * Track event
     */
    track: (event: string, data?: any) => 
        apiClient.post('/api/analytics/track', {
            event,
            ...data,
        }),

    /**
     * Track product view
     */
    trackProductView: (productId: string, data?: any) => 
        apiClient.post('/api/analytics/product-view', {
            product_id: productId,
            ...data,
        }),

    /**
     * Track affiliate click
     */
    trackAffiliateClick: (productId: string, articleId?: string) => 
        apiClient.post('/api/affiliate/track', {
            product_id: productId,
            article_id: articleId,
        }),
};

/**
 * Newsletter API
 */
export const newsletterAPI = {
    /**
     * Subscribe to newsletter
     */
    subscribe: (email: string) => 
        apiClient.post('/api/newsletter', { email }),
};

/**
 * Bookmarks API
 */
export const bookmarksAPI = {
    /**
     * Get user bookmarks
     */
    list: () => 
        apiClient.get<any[]>('/api/bookmarks'),

    /**
     * Add bookmark
     */
    add: (articleId: string) => 
        apiClient.post('/api/bookmarks', { article_id: articleId }),

    /**
     * Remove bookmark
     */
    remove: (articleId: string) => 
        apiClient.delete(`/api/bookmarks/${articleId}`),
};

/**
 * Search API
 */
export const searchAPI = {
    /**
     * Search articles and products
     */
    search: (query: string, params?: QueryParams) => 
        apiClient.get<PaginatedResponse<any>>('/api/search', {
            ...params,
            q: query,
        }),
};

/**
 * Admin API
 */
export const adminAPI = {
    /**
     * Get database performance metrics
     */
    getDatabasePerformance: () => 
        apiClient.get<any>('/api/v1/admin/database/performance'),

    /**
     * Get automation metrics
     */
    getAutomationMetrics: () => 
        apiClient.get<any>('/api/v1/admin/automation/metrics'),

    /**
     * Get automation status
     */
    getAutomationStatus: () => 
        apiClient.get<any>('/api/v1/admin/automation/status'),
};

/**
 * Health API
 */
export const healthAPI = {
    /**
     * Health check
     */
    check: () => 
        apiClient.get<any>('/api/health'),

    /**
     * Liveness probe
     */
    liveness: () => 
        apiClient.get<any>('/api/health/liveness'),

    /**
     * Readiness probe
     */
    readiness: () => 
        apiClient.get<any>('/api/health/readiness'),
};

/**
 * Auth API
 */
export const authAPI = {
    /**
     * Get current user
     */
    me: () => 
        apiClient.get<any>('/api/auth/me'),
};

/**
 * Admin API - Categories
 */
export const categoriesAPI = {
    /**
     * List categories
     */
    list: () => 
        apiClient.get<any[]>('/api/admin/categories'),

    /**
     * Create category
     */
    create: (data: { name: string; slug?: string; description?: string }) => 
        apiClient.post<any>('/api/admin/categories', data),
};

/**
 * Admin API - Tags
 */
export const tagsAPI = {
    /**
     * List tags
     */
    list: () => 
        apiClient.get<any[]>('/api/admin/tags'),

    /**
     * Create tag
     */
    create: (data: { name: string; slug?: string }) => 
        apiClient.post<any>('/api/admin/tags', data),
};

/**
 * Main API client export
 */
export const api = {
    articles: articlesAPI,
    products: productsAPI,
    reviews: reviewsAPI,
    analytics: analyticsAPI,
    newsletter: newsletterAPI,
    bookmarks: bookmarksAPI,
    search: searchAPI,
    admin: adminAPI,
    health: healthAPI,
    auth: authAPI,
    categories: categoriesAPI,
    tags: tagsAPI,
};

export default api;
