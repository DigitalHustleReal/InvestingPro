export type AssetType = 'mutual-fund' | 'stock' | 'etf' | 'bond';
export type AssetCategory = 'equity' | 'debt' | 'hybrid' | 'gold' | 'international';

export interface PortfolioAsset {
    id?: string; // Optional for new items
    user_email: string;

    asset_type: AssetType;
    asset_name: string;
    asset_category: AssetCategory;

    quantity: number;
    purchase_price: number;
    current_price: number;
    purchase_date: string; // ISO Date string

    // Computed fields
    invested_amount?: number;
    current_value?: number;
    returns?: number; // (current_value - invested_amount)
    returns_percentage?: number;

    created_at?: string;
}
