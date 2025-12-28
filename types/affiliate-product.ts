export type AffiliateProductType =
    | 'mutual-fund'
    | 'stock-broker'
    | 'insurance'
    | 'loan'
    | 'credit-card'
    | 'demat-account'
    | 'banking';

export type CommissionType = 'percentage' | 'fixed' | 'cpa';
export type ProductStatus = 'active' | 'inactive' | 'pending';

export interface AffiliatePricing {
    amount: string;
    period?: string; // e.g., 'yearly', 'monthly', 'one-time'
}

export interface AffiliateProduct {
    id: string;
    name: string;
    company: string;
    type: AffiliateProductType;
    description?: string;

    affiliate_link: string;
    commission_rate?: number;
    commission_type: CommissionType;

    rating?: number;
    features?: string[];
    pricing?: AffiliatePricing;
    image_url?: string;

    clicks: number;
    conversions: number;
    status: ProductStatus;

    created_at: string;
}
