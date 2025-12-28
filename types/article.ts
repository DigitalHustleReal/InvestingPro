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
export type ContentType = 'article' | 'pillar' | 'category-page';

export interface Article {
    id: string;

    title: string;
    slug: string;
    excerpt?: string;
    content: string; // Markdown

    content_type?: ContentType; // Default: 'article'
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

    // Schema-driven fields
    primary_keyword?: string;
    secondary_keywords?: string[];
    search_intent?: 'informational' | 'commercial' | 'transactional';

    affiliate_products?: string[]; // IDs

    // Pillar page specific fields (optional, only for content_type='pillar')
    pillar_related_articles?: string[];
    pillar_hub_content?: any; // JSONB
    pillar_primary_topic?: string;
    pillar_subtopics?: string[];
    pillar_related_categories?: string[];

    created_at: string;
    updated_at: string;
}
