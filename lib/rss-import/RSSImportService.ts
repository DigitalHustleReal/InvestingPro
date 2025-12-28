import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import Parser from 'rss-parser';

const parser = new Parser({
    customFields: {
        item: [
            ['content:encoded', 'content'],
            ['media:content', 'media'],
        ]
    }
});

export interface RSSFeed {
    id?: string;
    name: string;
    url: string;
    description?: string;
    category?: string;
    auto_import?: boolean;
    import_frequency?: 'hourly' | 'daily' | 'weekly';
    auto_generate_articles?: boolean;
    keyword_extraction_enabled?: boolean;
    status?: 'active' | 'paused' | 'error';
}

export interface RSSFeedItem {
    id?: string;
    feed_id: string;
    original_url: string;
    title: string;
    description?: string;
    content?: string;
    author?: string;
    published_date?: Date;
    guid: string;
    categories?: string[];
    processing_status?: 'pending' | 'processed' | 'article_generated' | 'skipped' | 'error';
}

export interface RSSImportJob {
    id?: string;
    feed_id: string;
    status: 'running' | 'completed' | 'failed' | 'partial';
    items_found?: number;
    items_processed?: number;
    articles_generated?: number;
    errors_count?: number;
}

/**
 * RSS Import Service
 * 
 * Handles RSS feed fetching, parsing, and storage
 */
export class RSSImportService {
    /**
     * Fetch and parse RSS feed
     */
    async fetchFeed(url: string): Promise<any> {
        try {
            const feed = await parser.parseURL(url);
            return feed;
        } catch (error) {
            logger.error("Error fetching RSS feed", error instanceof Error ? error : new Error(String(error)), { url });
            throw error;
        }
    }

    /**
     * Create or update RSS feed
     */
    async createFeed(feedData: RSSFeed): Promise<string> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('rss_feeds')
                .insert({
                    name: feedData.name,
                    url: feedData.url,
                    description: feedData.description,
                    category: feedData.category,
                    auto_import: feedData.auto_import || false,
                    import_frequency: feedData.import_frequency || 'daily',
                    auto_generate_articles: feedData.auto_generate_articles || false,
                    keyword_extraction_enabled: feedData.keyword_extraction_enabled ?? true,
                    status: feedData.status || 'active'
                })
                .select('id')
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            logger.error("Error creating RSS feed", error instanceof Error ? error : new Error(String(error)), { feedData });
            throw error;
        }
    }

    /**
     * Update RSS feed
     */
    async updateFeed(feedId: string, updates: Partial<RSSFeed>): Promise<void> {
        const supabase = await createClient();

        try {
            const { error } = await supabase
                .from('rss_feeds')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', feedId);

            if (error) throw error;
        } catch (error) {
            logger.error("Error updating RSS feed", error instanceof Error ? error : new Error(String(error)), { feedId, updates });
            throw error;
        }
    }

    /**
     * Get all RSS feeds
     */
    async getFeeds(): Promise<RSSFeed[]> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('rss_feeds')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error("Error fetching RSS feeds", error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    /**
     * Get single RSS feed
     */
    async getFeed(feedId: string): Promise<RSSFeed | null> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('rss_feeds')
                .select('*')
                .eq('id', feedId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error("Error fetching RSS feed", error instanceof Error ? error : new Error(String(error)), { feedId });
            throw error;
        }
    }

    /**
     * Delete RSS feed
     */
    async deleteFeed(feedId: string): Promise<void> {
        const supabase = await createClient();

        try {
            const { error } = await supabase
                .from('rss_feeds')
                .delete()
                .eq('id', feedId);

            if (error) throw error;
        } catch (error) {
            logger.error("Error deleting RSS feed", error instanceof Error ? error : new Error(String(error)), { feedId });
            throw error;
        }
    }

    /**
     * Import RSS feed items
     */
    async importFeedItems(feedId: string): Promise<RSSImportJob> {
        const supabase = await createClient();

        try {
            // Get feed
            const feed = await this.getFeed(feedId);
            if (!feed) {
                throw new Error('Feed not found');
            }

            // Create import job
            const { data: jobData, error: jobError } = await supabase
                .from('rss_import_jobs')
                .insert({
                    feed_id: feedId,
                    status: 'running'
                })
                .select('id')
                .single();

            if (jobError) throw jobError;
            const jobId = jobData.id;

            // Fetch and parse feed
            const parsedFeed = await this.fetchFeed(feed.url);
            const items = parsedFeed.items || [];

            let itemsProcessed = 0;
            let errorsCount = 0;
            const errors: string[] = [];

            // Process each item
            for (const item of items) {
                try {
                    // Check if item already exists (by GUID)
                    const guid = item.guid || item.id || item.link;
                    if (!guid) {
                        errorsCount++;
                        errors.push(`Item missing GUID: ${item.title}`);
                        continue;
                    }

                    const { data: existing } = await supabase
                        .from('rss_feed_items')
                        .select('id')
                        .eq('feed_id', feedId)
                        .eq('guid', guid)
                        .single();

                    if (existing) {
                        // Item already exists, skip
                        continue;
                    }

                    // Insert new item
                    const { error: insertError } = await supabase
                        .from('rss_feed_items')
                        .insert({
                            feed_id: feedId,
                            original_url: item.link || '',
                            title: item.title || '',
                            description: item.contentSnippet || item.description || '',
                            content: item.content || item['content:encoded'] || '',
                            author: item.creator || item.author || '',
                            published_date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
                            guid: guid,
                            categories: item.categories || [],
                            processing_status: 'pending'
                        });

                    if (insertError) {
                        errorsCount++;
                        errors.push(`Error inserting item: ${item.title}`);
                    } else {
                        itemsProcessed++;
                    }
                } catch (itemError) {
                    errorsCount++;
                    errors.push(`Error processing item: ${item.title} - ${itemError instanceof Error ? itemError.message : String(itemError)}`);
                }
            }

            // Update import job
            const jobStatus = errorsCount === 0 ? 'completed' : (itemsProcessed > 0 ? 'partial' : 'failed');
            await supabase
                .from('rss_import_jobs')
                .update({
                    status: jobStatus,
                    items_found: items.length,
                    items_processed: itemsProcessed,
                    errors_count: errorsCount,
                    completed_at: new Date().toISOString(),
                    error_message: errors.length > 0 ? errors.join('; ') : null
                })
                .eq('id', jobId);

            // Update feed metadata
            await supabase
                .from('rss_feeds')
                .update({
                    last_fetched_at: new Date().toISOString(),
                    last_successful_fetch: jobStatus !== 'failed' ? new Date().toISOString() : undefined,
                    fetch_count: (feed.fetch_count || 0) + 1,
                    error_count: jobStatus === 'failed' ? (feed.error_count || 0) + 1 : feed.error_count,
                    error_message: jobStatus === 'failed' ? errors.join('; ') : null,
                    status: jobStatus === 'failed' ? 'error' : 'active'
                })
                .eq('id', feedId);

            // Return job
            const { data: updatedJob } = await supabase
                .from('rss_import_jobs')
                .select('*')
                .eq('id', jobId)
                .single();

            return updatedJob as RSSImportJob;
        } catch (error) {
            logger.error("Error importing RSS feed items", error instanceof Error ? error : new Error(String(error)), { feedId });
            throw error;
        }
    }

    /**
     * Get feed items
     */
    async getFeedItems(feedId: string, status?: string): Promise<RSSFeedItem[]> {
        const supabase = await createClient();

        try {
            let query = supabase
                .from('rss_feed_items')
                .select('*')
                .eq('feed_id', feedId)
                .order('published_date', { ascending: false, nullsFirst: false });

            if (status) {
                query = query.eq('processing_status', status);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error("Error fetching RSS feed items", error instanceof Error ? error : new Error(String(error)), { feedId });
            throw error;
        }
    }

    /**
     * Get import jobs for feed
     */
    async getImportJobs(feedId: string): Promise<RSSImportJob[]> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('rss_import_jobs')
                .select('*')
                .eq('feed_id', feedId)
                .order('started_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error("Error fetching import jobs", error instanceof Error ? error : new Error(String(error)), { feedId });
            throw error;
        }
    }
}

export const rssImportService = new RSSImportService();

