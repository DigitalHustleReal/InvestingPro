export interface AffiliateClick {
    id: string;
    product_id: string;
    product_type?: 'credit_card' | 'loan' | 'investment' | 'other';

    article_id?: string;

    user_ip?: string;
    user_agent?: string;
    referrer?: string;

    converted: boolean;
    conversion_date?: string;
    commission_earned?: number;

    created_at: string;
}
