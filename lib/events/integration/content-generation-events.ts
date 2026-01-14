/**
 * Content Generation Event Integration
 * Publishes events for AI content generation workflows
 */
import { eventPublisher } from '../publisher';
import { EventType, type ContentGenerationStartedEvent, type ContentGenerationCompletedEvent, type ContentGenerationFailedEvent } from '../types';
import { logger } from '@/lib/logger';

/**
 * Publish content generation started event
 */
export async function publishGenerationStarted(params: {
    topic: string;
    agentId: string;
    cycleId?: string;
}): Promise<string> {
    try {
        const event = await eventPublisher.publish<ContentGenerationStartedEvent>({
            type: EventType.CONTENT_GENERATION_STARTED,
            source: 'ContentGenerator',
            payload: {
                topic: params.topic,
                agentId: params.agentId,
                cycleId: params.cycleId
            },
            metadata: {
                topic: params.topic,
                agentId: params.agentId
            }
        });
        return event.id;
    } catch (error) {
        logger.error('Failed to publish generation started event', error instanceof Error ? error : new Error(String(error)));
        throw error;
    }
}

/**
 * Publish content generation completed event
 */
export async function publishGenerationCompleted(params: {
    articleId: string;
    topic: string;
    agentId: string;
    cycleId?: string;
    duration: number;
}): Promise<void> {
    try {
        await eventPublisher.publish<ContentGenerationCompletedEvent>({
            type: EventType.CONTENT_GENERATION_COMPLETED,
            source: 'ContentGenerator',
            payload: {
                articleId: params.articleId,
                topic: params.topic,
                agentId: params.agentId,
                cycleId: params.cycleId,
                duration: params.duration
            },
            metadata: {
                articleId: params.articleId,
                topic: params.topic
            }
        });
    } catch (error) {
        logger.error('Failed to publish generation completed event', error instanceof Error ? error : new Error(String(error)));
    }
}

/**
 * Publish content generation failed event
 */
export async function publishGenerationFailed(params: {
    topic: string;
    agentId: string;
    cycleId?: string;
    error: string;
}): Promise<void> {
    try {
        await eventPublisher.publish<ContentGenerationFailedEvent>({
            type: EventType.CONTENT_GENERATION_FAILED,
            source: 'ContentGenerator',
            payload: {
                topic: params.topic,
                agentId: params.agentId,
                cycleId: params.cycleId,
                error: params.error
            },
            metadata: {
                topic: params.topic,
                agentId: params.agentId,
                error: params.error
            }
        });
    } catch (error) {
        logger.error('Failed to publish generation failed event', error instanceof Error ? error : new Error(String(error)));
    }
}
