export type ArticleCategory =
    | 'mutual-funds'
    | 'stocks'
    | 'insurance'
    | 'loans'
    | 'credit-cards'
    | 'tax-planning'
    | 'retirement'
    | 'investing-basics';

export type ArticleLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu';
export type ArticleStatus = 'draft' | 'published' | 'archived';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'revision-requested';

export interface Article {
    id: string;

    title: string;
    slug: string;
    excerpt?: string;
    content: string; // Markdown

    category: ArticleCategory;
    language: ArticleLanguage;
    tags?: string[];

    featured_image?: string;
    read_time?: number;

    author_id?: string;
    author_name?: string;
    author_email?: string; // Private, do not expose in public API responses

    is_user_submission: boolean;
    submission_status: SubmissionStatus;
    rejection_reason?: string;

    status: ArticleStatus;
    published_date?: string;

    views: number;
    ai_generated: boolean;

    seo_title?: string;
    seo_description?: string;

    affiliate_products?: string[]; // IDs

    created_at: string;
    updated_at: string;
}
