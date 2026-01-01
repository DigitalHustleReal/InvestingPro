
import * as cheerio from 'cheerio';
// @ts-ignore
import TurndownService from 'turndown';
import axios from 'axios';
import { logger } from '@/lib/logger';

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

// Remove unwanted elements
turndownService.remove(['script', 'style', 'iframe', 'nav', 'footer', 'header', 'form', 'noscript']);

export class WebExtractor {
    /**
     * Extract main content from a URL and convert to Markdown
     * Uses heuristics to find the article body
     */
    static async extractContent(url: string): Promise<string | null> {
        if (!url) return null;
        
        try {
            // Fetch HTML
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5'
                },
                timeout: 10000 // 10s timeout
            });

            const $ = cheerio.load(data);
            
            // Clean DOM
            $('script, style, link, nav, footer, header, aside, .ad, .ads, .advertisement, .social-share, .comments').remove();
            
            // Attempt to find Article Body
            // Priority: <article> -> main -> specific classes
            let contentHtml = $('article').html();
            
            if (!contentHtml) {
                // Try selectors common in news sites
                const selectors = [
                    'main',
                    '.article-body', 
                    '.story-content', 
                    '.post-content', 
                    '#article-content',
                    '.content-body',
                    '#main-content'
                ];
                
                for (const selector of selectors) {
                    const found = $(selector).html();
                    if (found && found.length > 500) {
                        contentHtml = found;
                        break;
                    }
                }
            }
            
            // Fallback to body but simplified
            if (!contentHtml) {
                contentHtml = $('body').html();
            }

            if (!contentHtml) {
                logger.warn('WebExtractor: No content found', { url });
                return null;
            }

            // Convert to Markdown
            let markdown = turndownService.turndown(contentHtml);
            
            // Cleanup excess newlines
            markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
            
            // Truncate if too long (max 10k chars for LLM context)
            if (markdown.length > 10000) {
                markdown = markdown.substring(0, 10000) + '... (truncated)';
            }
            
            return markdown;

        } catch (error) {
            logger.warn('WebExtractor: Extraction failed', { 
                url, 
                error: error instanceof Error ? error.message : String(error) 
            });
            return null;
        }
    }
}
