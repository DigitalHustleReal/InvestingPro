/**
 * Article Service Event Integration
 * Publishes events when articles are created, updated, or published
 */
import { eventPublisher } from '../publisher';
import { EventType, type ArticleCreatedEvent, type ArticlePublishedEvent } from '../types';
import { logger } from '@/lib/logger';

/**
 * Publish article created event
 */
export async function publishArticleCreated(article: {
    id: string;
    title: string;
    slug: string;
    authorId?: string;
}): Promise<void> {
    try {
        await eventPublisher.publish<ArticleCreatedEvent>({
            type: EventType.ARTICLE_CREATED,
            source: 'ArticleService',
            payload: {
                articleId: article.id,
                title: article.title,
                slug: article.slug,
                authorId: article.authorId
            },
            metadata: {
                articleId: article.id,
                slug: article.slug
            }
        });
    } catch (error) {
        logger.error('Failed to publish article created event', error instanceof Error ? error : new Error(String(error)));
    }
}

/**
 * Publish article published event
 */
export async function publishArticlePublished(article: {
    id: string;
    slug: string;
    publishedAt: string;
}): Promise<void> {
    try {
        await eventPublisher.publish<ArticlePublishedEvent>({
            type: EventType.ARTICLE_PUBLISHED,
            source: 'ArticleService',
            payload: {
                articleId: article.id,
                slug: article.slug,
                publishedAt: article.publishedAt
            },
            metadata: {
                articleId: article.id,
                slug: article.slug
            }
        });
    } catch (error) {
        logger.error('Failed to publish article published event', error instanceof Error ? error : new Error(String(error)));
    }
}

/**
 * Publish article updated event
 */
export async function publishArticleUpdated(article: {
    id: string;
    slug: string;
    title?: string;
}): Promise<void> {
    try {
        await eventPublisher.publish({
            type: EventType.ARTICLE_UPDATED,
            source: 'ArticleService',
            payload: {
                articleId: article.id,
                slug: article.slug,
                title: article.title
            },
            metadata: {
                articleId: article.id,
                slug: article.slug
            }
        });
    } catch (error) {
        logger.error('Failed to publish article updated event', error instanceof Error ? error : new Error(String(error)));
    }
}
