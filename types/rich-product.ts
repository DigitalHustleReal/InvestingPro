
export type ProductCategory = 'credit_card' | 'broker' | 'loan' | 'mutual_fund' | 'insurance';

export interface RichFeature {
    icon?: string;
    label: string;
    value: string | number;
    highlight?: boolean;
}

export interface ProductRating {
    overall: number; // 0-5
    breakdown?: {
        fees?: number;
        ease_of_use?: number;
        customer_service?: number;
        rewards?: number;
    };
    trust_score: number; // 0-100
}

export interface RichProduct {
    id: string;
    slug: string;
    name: string;
    provider_name: string;
    category: ProductCategory;
    image_url?: string;
    
    // Core Data
    rating: ProductRating;
    features: Record<string, any>; // Raw JSON features
    key_features: RichFeature[]; // Processed for Card display
    
    // Content
    description: string;
    pros: string[];
    cons: string[];
    
    // Badge System
    bestFor?: string; // Category ID from BEST_FOR_CATEGORIES (e.g., 'travel-rewards')
    
    // Specs (used for filtering/display)
    specs?: Record<string, any>;
    
    // Links
    affiliate_link?: string;
    official_link?: string;
    
    // Metadata
    is_verified: boolean;
    updated_at: string;
}
