export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
    id: string;
    product_id: string;

    user_id?: string;
    user_name: string;

    rating: number;
    title?: string;
    review_text: string;

    pros?: string[];
    cons?: string[];

    verified_purchase: boolean;
    helpful_count: number;
    status: ReviewStatus;
    language: string;

    created_at: string;
}
