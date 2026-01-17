/**
 * Playwright Scraper Utilities
 * 
 * Helper functions for browser-based scraping:
 * - Browser instance management
 * - Page navigation with retries
 * - Element extraction
 * - Rate limiting
 * - Error handling
 */

import { logger } from '@/lib/logger';

// Dynamic import to avoid bundle issues if playwright not installed
let playwright: any = null;

/**
 * Initialize Playwright (lazy load)
 */
async function getPlaywright() {
    if (!playwright) {
        try {
            playwright = await import('playwright');
        } catch (error) {
            logger.warn('Playwright not installed. Install with: npm install playwright && npx playwright install');
            return null;
        }
    }
    return playwright;
}

export interface ScrapeOptions {
    timeout?: number; // Page load timeout (default: 30000)
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
    retries?: number; // Number of retries (default: 3)
    rateLimit?: number; // Delay between requests in ms (default: 2000)
}

/**
 * Launch browser instance
 */
export async function launchBrowser(headless: boolean = true) {
    const pw = await getPlaywright();
    if (!pw) {
        throw new Error('Playwright not available');
    }

    try {
        const browser = await pw.chromium.launch({
            headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        return browser;
    } catch (error) {
        logger.error('Failed to launch browser', error as Error);
        throw error;
    }
}

/**
 * Navigate to URL with retries
 */
export async function navigateWithRetry(
    page: any,
    url: string,
    options: ScrapeOptions = {}
): Promise<{ success: boolean; error?: string }> {
    const timeout = options.timeout || 30000;
    const waitUntil = options.waitUntil || 'networkidle';
    const retries = options.retries || 3;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await page.goto(url, {
                waitUntil,
                timeout
            });

            // Wait for page to stabilize
            await page.waitForTimeout(2000);

            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.warn(`Navigation attempt ${attempt}/${retries} failed`, { url, error: errorMessage });

            if (attempt < retries) {
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            } else {
                return { success: false, error: errorMessage };
            }
        }
    }

    return { success: false, error: 'All retries exhausted' };
}

/**
 * Extract text from element selector
 */
export async function extractText(
    page: any,
    selector: string,
    options?: { timeout?: number; required?: boolean }
): Promise<string | null> {
    try {
        const element = await page.waitForSelector(selector, {
            timeout: options?.timeout || 10000,
            state: options?.required ? 'visible' : undefined
        });

        if (!element) {
            if (options?.required) {
                throw new Error(`Required element not found: ${selector}`);
            }
            return null;
        }

        return await element.textContent();
    } catch (error) {
        if (options?.required) {
            logger.error(`Failed to extract text from ${selector}`, error as Error);
            throw error;
        }
        return null;
    }
}

/**
 * Extract multiple elements
 */
export async function extractElements(
    page: any,
    selector: string,
    options?: { timeout?: number }
): Promise<string[]> {
    try {
        await page.waitForSelector(selector, {
            timeout: options?.timeout || 10000
        });

        const elements = await page.$$(selector);
        const texts: string[] = [];

        for (const element of elements) {
            const text = await element.textContent();
            if (text) texts.push(text.trim());
        }

        return texts;
    } catch (error) {
        logger.warn(`Failed to extract elements from ${selector}`, { error });
        return [];
    }
}

/**
 * Extract attribute value
 */
export async function extractAttribute(
    page: any,
    selector: string,
    attribute: string,
    options?: { timeout?: number }
): Promise<string | null> {
    try {
        const element = await page.waitForSelector(selector, {
            timeout: options?.timeout || 10000
        });

        if (!element) return null;

        return await element.getAttribute(attribute);
    } catch (error) {
        logger.warn(`Failed to extract attribute ${attribute} from ${selector}`, { error });
        return null;
    }
}

/**
 * Rate limiting delay
 */
export function rateLimit(ms: number = 2000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if Playwright is available
 */
export async function isPlaywrightAvailable(): Promise<boolean> {
    try {
        const pw = await getPlaywright();
        return pw !== null;
    } catch {
        return false;
    }
}
