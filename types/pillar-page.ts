import type { Article, ArticleCategory, ArticleLanguage, ArticleStatus } from './article';

/**
 * Pillar Page Content Type
 * 
 * A pillar page is a comprehensive, long-form piece of content that serves as
 * the foundation for a content cluster. It covers a broad topic in depth and
 * links to related articles (cluster content).
 */

export interface PillarRelatedArticle {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
}

export interface PillarHubSection {
    id: string;
    title: string;
    description?: string;
    content?: string; // Markdown/HTML content for this section
    order: number;
    related_articles?: string[]; // Article IDs
}

export interface PillarHubContent {
    sections?: PillarHubSection[];
    overview?: string; // Introduction/overview content
    conclusion?: string; // Conclusion/summary content
    cta_section?: {
        title: string;
        description: string;
        action_text: string;
        action_url: string;
    };
}

/**
 * Pillar Page extends Article with pillar-specific fields
 */
export interface PillarPage extends Omit<Article, 'id'> {
    id: string;
    content_type: 'pillar';
    
    // Pillar-specific fields
    pillar_related_articles?: string[]; // Array of related article IDs
    pillar_hub_content?: PillarHubContent; // Structured hub content
    pillar_primary_topic?: string; // Main topic/theme
    pillar_subtopics?: string[]; // Related subtopics
    pillar_related_categories?: string[]; // Related category slugs
    
    // Helper: Get related articles data (populated from DB)
    related_articles_data?: PillarRelatedArticle[];
}

/**
 * Content Type Union
 */
export type ContentType = 'article' | 'pillar' | 'category-page';

/**
 * Base Content Interface (shared by all content types)
 */
export interface BaseContent {
    id: string;
    content_type: ContentType;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    category: ArticleCategory;
    language: ArticleLanguage;
    tags?: string[];
    featured_image?: string;
    read_time?: number;
    status: ArticleStatus;
    seo_title?: string;
    seo_description?: string;
    created_at: string;
    updated_at: string;
}

