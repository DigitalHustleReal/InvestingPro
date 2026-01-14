/**
 * Bookmark Service
 * Business logic for bookmarks
 */
import { SupabaseBookmarkRepository, type BookmarkRepository } from './bookmark.repository';
import { logger } from '@/lib/logger';

export interface BookmarkService {
    getUserBookmarks(userId: string): Promise<any[]>;
    addBookmark(userId: string, articleId: string, notes?: string): Promise<any>;
    removeBookmark(userId: string, articleId: string): Promise<void>;
    isBookmarked(userId: string, articleId: string): Promise<boolean>;
    updateProgress(userId: string, articleId: string, progress: number, readTime: number): Promise<void>;
    getReadingStats(userId: string): Promise<any>;
    getReadingHistory(userId: string): Promise<any[]>;
}

export class BookmarkServiceImpl implements BookmarkService {
    private repository: BookmarkRepository;

    constructor(repository?: BookmarkRepository) {
        this.repository = repository || new SupabaseBookmarkRepository();
    }

    async getUserBookmarks(userId: string): Promise<any[]> {
        try {
            return await this.repository.findByUserId(userId);
        } catch (error) {
            logger.error('Bookmark service getUserBookmarks error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async addBookmark(userId: string, articleId: string, notes?: string): Promise<any> {
        try {
            // Check if already bookmarked
            const exists = await this.repository.exists(userId, articleId);
            if (exists) {
                return await this.repository.findByUserId(userId);
            }

            const bookmark = await this.repository.create(userId, articleId);
            // TODO: Add notes support if needed
            return bookmark;
        } catch (error) {
            logger.error('Bookmark service addBookmark error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async updateProgress(userId: string, articleId: string, progress: number, readTime: number): Promise<void> {
        try {
            // Use existing bookmark service for reading progress
            const { bookmarkService: existingService } = await import('@/lib/engagement/bookmark-service');
            await existingService.updateProgress(userId, articleId, progress, readTime);
        } catch (error) {
            logger.error('Bookmark service updateProgress error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getReadingStats(userId: string): Promise<any> {
        try {
            // Use existing bookmark service for reading stats
            const { bookmarkService: existingService } = await import('@/lib/engagement/bookmark-service');
            return await existingService.getReadingStats(userId);
        } catch (error) {
            logger.error('Bookmark service getReadingStats error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getReadingHistory(userId: string): Promise<any[]> {
        try {
            // Use existing bookmark service for reading history
            const { bookmarkService: existingService } = await import('@/lib/engagement/bookmark-service');
            return await existingService.getReadingHistory(userId);
        } catch (error) {
            logger.error('Bookmark service getReadingHistory error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async removeBookmark(userId: string, articleId: string): Promise<void> {
        try {
            await this.repository.delete(userId, articleId);
        } catch (error) {
            logger.error('Bookmark service removeBookmark error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async isBookmarked(userId: string, articleId: string): Promise<boolean> {
        try {
            return await this.repository.exists(userId, articleId);
        } catch (error) {
            logger.error('Bookmark service isBookmarked error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}

// Export singleton instance
export const bookmarkService = new BookmarkServiceImpl();
