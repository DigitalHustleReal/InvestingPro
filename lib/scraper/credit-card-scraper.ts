/**
 * Credit Card Scraper
 * 
 * Scrapes credit card data from official bank websites:
 * - HDFC Bank
 * - SBI Card
 * - ICICI Bank
 * - Axis Bank
 * 
 * Features:
 * - Rate limiting (1 request per 2 seconds)
 * - Retry logic (3 attempts with exponential backoff)
 * - Data validation against schema
 * - Change detection (compare with previous run)
 */

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export interface CreditCardData {
    name: string;
    bank: string;
    type: 'Cashback' | 'Rewards' | 'Travel' | 'Premium' | 'Shopping' | 'Fuel';
    annual_fee: string; // e.g., "₹500", "Free", "₹2,500 + GST"
    joining_fee?: string;
    interest_rate: string; // e.g., "24% p.a.", "3.5% per month"
    min_income?: string;
    rewards?: string[];
    pros?: string[];
    cons?: string[];
    apply_link?: string;
    image_url?: string;
}

interface ScrapeResult {
    success: boolean;
    cards: CreditCardData[];
    errors: string[];
    bank: string;
}

/**
 * Scrape credit cards from HDFC Bank
 */
async function scrapeHDFC(): Promise<ScrapeResult> {
    const bank = 'HDFC Bank';
    const cards: CreditCardData[] = [];
    const errors: string[] = [];

    try {
        // Check if Playwright is available
        const { isPlaywrightAvailable, launchBrowser, navigateWithRetry, extractText, extractElements, rateLimit } = await import('./playwright-scraper');
        
        const hasPlaywright = await isPlaywrightAvailable();
        if (!hasPlaywright) {
            logger.warn('Playwright not available, skipping HDFC scraping');
            return {
                success: false,
                cards: [],
                errors: ['Playwright not installed. Install with: npm install playwright && npx playwright install'],
                bank
            };
        }

        const browser = await launchBrowser(true);
        const page = await browser.newPage();

        try {
            const url = 'https://www.hdfcbank.com/personal/pay/cards/credit-cards';
            
            // Navigate with retries
            const navResult = await navigateWithRetry(page, url, {
                timeout: 30000,
                waitUntil: 'networkidle',
                retries: 3
            });

            if (!navResult.success) {
                throw new Error(`Navigation failed: ${navResult.error}`);
            }

            // Extract card information using page.evaluate
            // Note: HDFC website structure may change - adjust selectors as needed
            const extractedCards = await page.evaluate(() => {
                const cardElements = document.querySelectorAll('.card-item, .credit-card-item, [data-card], .product-card');
                const cards: any[] = [];

                cardElements.forEach((element) => {
                    // Extract card name (try multiple selectors)
                    const nameElement = element.querySelector('.card-name, h3, h4, .card-title, .product-name');
                    const name = nameElement?.textContent?.trim() || '';

                    // Extract annual fee
                    const feeElement = element.querySelector('.annual-fee, [data-fee], .fee');
                    const annualFeeText = feeElement?.textContent?.trim() || '';

                    // Extract interest rate
                    const rateElement = element.querySelector('.interest-rate, [data-rate], .rate');
                    const interestRateText = rateElement?.textContent?.trim() || '';

                    // Extract rewards/features
                    const rewardElements = element.querySelectorAll('.reward-item, .feature-item, .benefit');
                    const rewards = Array.from(rewardElements).map(el => el.textContent?.trim() || '').filter(Boolean);

                    if (name && name !== 'Unknown Card') {
                        cards.push({
                            name,
                            annualFeeText,
                            interestRateText,
                            rewards
                        });
                    }
                });

                return cards;
            });

            // Process extracted cards
            for (const extractedCard of extractedCards) {
                const annualFee = extractPrice(extractedCard.annualFeeText);
                const type = detectCardType(extractedCard.name, extractedCard.rewards);

                cards.push({
                    name: extractedCard.name,
                    bank,
                    type,
                    annual_fee: annualFee || 'Contact Bank',
                    interest_rate: extractedCard.interestRateText || 'Contact Bank',
                    rewards: extractedCard.rewards.length > 0 ? extractedCard.rewards : undefined
                });
            }

            // If no cards found with standard selectors, log warning
            if (cards.length === 0) {
                errors.push('No cards found - website structure may have changed. Selectors need update.');
                logger.warn('HDFC scraper: No cards extracted - website structure may have changed');
            }

            await browser.close();

            return {
                success: cards.length > 0,
                cards,
                errors,
                bank
            };
        } catch (error) {
            await browser.close();
            throw error;
        }
    } catch (error) {
        logger.error('Error scraping HDFC', error as Error);
        return {
            success: false,
            cards: [],
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            bank
        };
    }
}

/**
 * Helper: Extract price from text
 */
function extractPrice(text: string): string | null {
    if (!text) return null;
    const lower = text.toLowerCase();
    if (lower.includes('free') || lower.includes('nil') || lower.includes('zero')) {
        return 'Free';
    }
    const match = text.match(/₹\s*([\d,]+)/);
    if (match) {
        return `₹${match[1]}`;
    }
    return text.trim() || null;
}

/**
 * Helper: Detect card type from name and features
 */
function detectCardType(name: string, rewards: string[]): CreditCardData['type'] {
    const nameLower = name.toLowerCase();
    const rewardsText = rewards.join(' ').toLowerCase();

    if (nameLower.includes('cashback') || rewardsText.includes('cashback')) {
        return 'Cashback';
    }
    if (nameLower.includes('travel') || rewardsText.includes('miles') || rewardsText.includes('travel')) {
        return 'Travel';
    }
    if (nameLower.includes('premium') || nameLower.includes('platinum') || nameLower.includes('signature')) {
        return 'Premium';
    }
    if (nameLower.includes('shopping') || rewardsText.includes('shopping')) {
        return 'Shopping';
    }
    if (nameLower.includes('fuel') || rewardsText.includes('fuel')) {
        return 'Fuel';
    }
    return 'Rewards';
}

/**
 * Scrape credit cards from SBI Card
 */
async function scrapeSBI(): Promise<ScrapeResult> {
    const bank = 'SBI Card';
    const cards: CreditCardData[] = [];
    const errors: string[] = [];

    try {
        const { isPlaywrightAvailable, launchBrowser, navigateWithRetry, extractText, extractElements, rateLimit } = await import('./playwright-scraper');
        
        const hasPlaywright = await isPlaywrightAvailable();
        if (!hasPlaywright) {
            return {
                success: false,
                cards: [],
                errors: ['Playwright not installed'],
                bank
            };
        }

        const browser = await launchBrowser(true);
        const page = await browser.newPage();

        try {
            const url = 'https://www.sbicard.com/';
            
            const navResult = await navigateWithRetry(page, url, {
                timeout: 30000,
                waitUntil: 'networkidle',
                retries: 3
            });

            if (!navResult.success) {
                throw new Error(`Navigation failed: ${navResult.error}`);
            }

            // SBI Card scraping logic
            const extractedCards = await page.evaluate(() => {
                const cardElements = document.querySelectorAll('.card-item, .product-card, [data-product], .credit-card');
                const cards: any[] = [];

                cardElements.forEach((element) => {
                    const nameElement = element.querySelector('.card-title, h3, .product-name, .card-name');
                    const name = nameElement?.textContent?.trim() || '';

                    const feeElement = element.querySelector('.annual-fee, .fee, .annual-charge');
                    const annualFeeText = feeElement?.textContent?.trim() || '';

                    const rewardElements = element.querySelectorAll('.benefit, .feature, .reward');
                    const rewards = Array.from(rewardElements).map(el => el.textContent?.trim() || '').filter(Boolean);

                    if (name && name !== 'Unknown Card') {
                        cards.push({ name, annualFeeText, rewards });
                    }
                });

                return cards;
            });

            for (const extractedCard of extractedCards) {
                const annualFee = extractPrice(extractedCard.annualFeeText);
                const type = detectCardType(extractedCard.name, extractedCard.rewards);

                cards.push({
                    name: extractedCard.name,
                    bank,
                    type,
                    annual_fee: annualFee || 'Contact Bank',
                    interest_rate: 'Contact Bank',
                    rewards: extractedCard.rewards.length > 0 ? extractedCard.rewards : undefined
                });
            }

            if (cards.length === 0) {
                errors.push('No cards found - website structure may have changed');
            }

            await browser.close();

            return {
                success: cards.length > 0,
                cards,
                errors,
                bank
            };
        } catch (error) {
            await browser.close();
            throw error;
        }
    } catch (error) {
        logger.error('Error scraping SBI', error as Error);
        return {
            success: false,
            cards: [],
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            bank
        };
    }
}

/**
 * Scrape credit cards from ICICI Bank
 */
async function scrapeICICI(): Promise<ScrapeResult> {
    const bank = 'ICICI Bank';
    const cards: CreditCardData[] = [];
    const errors: string[] = [];

    try {
        const { isPlaywrightAvailable, launchBrowser, navigateWithRetry, extractText, extractElements } = await import('./playwright-scraper');
        
        const hasPlaywright = await isPlaywrightAvailable();
        if (!hasPlaywright) {
            return {
                success: false,
                cards: [],
                errors: ['Playwright not installed'],
                bank
            };
        }

        const browser = await launchBrowser(true);
        const page = await browser.newPage();

        try {
            const url = 'https://www.icicibank.com/credit-card';
            
            const navResult = await navigateWithRetry(page, url, {
                timeout: 30000,
                waitUntil: 'networkidle',
                retries: 3
            });

            if (!navResult.success) {
                throw new Error(`Navigation failed: ${navResult.error}`);
            }

            // ICICI Bank scraping logic
            const extractedCards = await page.evaluate(() => {
                const cardElements = document.querySelectorAll('.card-wrapper, .product-card, [data-card], .credit-card-item');
                const cards: any[] = [];

                cardElements.forEach((element) => {
                    const nameElement = element.querySelector('.card-name, .product-title, h3, .card-title');
                    const name = nameElement?.textContent?.trim() || '';

                    const feeElement = element.querySelector('.fee-amount, .annual-fee, .fee');
                    const annualFeeText = feeElement?.textContent?.trim() || '';

                    const rewardElements = element.querySelectorAll('.benefit-item, .reward-point, .feature');
                    const rewards = Array.from(rewardElements).map(el => el.textContent?.trim() || '').filter(Boolean);

                    if (name && name !== 'Unknown Card') {
                        cards.push({ name, annualFeeText, rewards });
                    }
                });

                return cards;
            });

            for (const extractedCard of extractedCards) {
                const annualFee = extractPrice(extractedCard.annualFeeText);
                const type = detectCardType(extractedCard.name, extractedCard.rewards);

                cards.push({
                    name: extractedCard.name,
                    bank,
                    type,
                    annual_fee: annualFee || 'Contact Bank',
                    interest_rate: 'Contact Bank',
                    rewards: extractedCard.rewards.length > 0 ? extractedCard.rewards : undefined
                });
            }

            if (cards.length === 0) {
                errors.push('No cards found - website structure may have changed');
            }

            await browser.close();

            return {
                success: cards.length > 0,
                cards,
                errors,
                bank
            };
        } catch (error) {
            await browser.close();
            throw error;
        }
    } catch (error) {
        logger.error('Error scraping ICICI', error as Error);
        return {
            success: false,
            cards: [],
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            bank
        };
    }
}

/**
 * Scrape credit cards from Axis Bank
 */
async function scrapeAxis(): Promise<ScrapeResult> {
    const bank = 'Axis Bank';
    const cards: CreditCardData[] = [];
    const errors: string[] = [];

    try {
        const { isPlaywrightAvailable, launchBrowser, navigateWithRetry, extractText, extractElements } = await import('./playwright-scraper');
        
        const hasPlaywright = await isPlaywrightAvailable();
        if (!hasPlaywright) {
            return {
                success: false,
                cards: [],
                errors: ['Playwright not installed'],
                bank
            };
        }

        const browser = await launchBrowser(true);
        const page = await browser.newPage();

        try {
            const url = 'https://www.axisbank.com/retail/cards/credit-card';
            
            const navResult = await navigateWithRetry(page, url, {
                timeout: 30000,
                waitUntil: 'networkidle',
                retries: 3
            });

            if (!navResult.success) {
                throw new Error(`Navigation failed: ${navResult.error}`);
            }

            // Axis Bank scraping logic
            const extractedCards = await page.evaluate(() => {
                const cardElements = document.querySelectorAll('.card-product, .credit-card, [data-product], .product-wrapper');
                const cards: any[] = [];

                cardElements.forEach((element) => {
                    const nameElement = element.querySelector('.card-title, .product-name, h3, .card-name');
                    const name = nameElement?.textContent?.trim() || '';

                    const feeElement = element.querySelector('.annual-charge, .fee, .annual-fee');
                    const annualFeeText = feeElement?.textContent?.trim() || '';

                    const rewardElements = element.querySelectorAll('.feature-list-item, .benefit, .reward-item');
                    const rewards = Array.from(rewardElements).map(el => el.textContent?.trim() || '').filter(Boolean);

                    if (name && name !== 'Unknown Card') {
                        cards.push({ name, annualFeeText, rewards });
                    }
                });

                return cards;
            });

            for (const extractedCard of extractedCards) {
                const annualFee = extractPrice(extractedCard.annualFeeText);
                const type = detectCardType(extractedCard.name, extractedCard.rewards);

                cards.push({
                    name: extractedCard.name,
                    bank,
                    type,
                    annual_fee: annualFee || 'Contact Bank',
                    interest_rate: 'Contact Bank',
                    rewards: extractedCard.rewards.length > 0 ? extractedCard.rewards : undefined
                });
            }

            if (cards.length === 0) {
                errors.push('No cards found - website structure may have changed');
            }

            await browser.close();

            return {
                success: cards.length > 0,
                cards,
                errors,
                bank
            };
        } catch (error) {
            await browser.close();
            throw error;
        }
    } catch (error) {
        logger.error('Error scraping Axis', error as Error);
        return {
            success: false,
            cards: [],
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            bank
        };
    }
}

/**
 * Validate credit card data against schema
 */
function validateCardData(card: CreditCardData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!card.name || card.name.trim().length === 0) {
        errors.push('Card name is required');
    }

    if (!card.bank || card.bank.trim().length === 0) {
        errors.push('Bank name is required');
    }

    if (!card.type) {
        errors.push('Card type is required');
    }

    if (!card.annual_fee) {
        errors.push('Annual fee is required');
    }

    if (!card.interest_rate) {
        errors.push('Interest rate is required');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Detect changes between current and previous scrape
 */
async function detectChanges(
    currentCards: CreditCardData[],
    bank: string
): Promise<{ newCards: CreditCardData[]; changedCards: CreditCardData[] }> {
    const supabase = await createClient();
    
    const newCards: CreditCardData[] = [];
    const changedCards: CreditCardData[] = [];

    // Get existing cards from database
    const { data: existingCards } = await supabase
        .from('credit_cards')
        .select('name, bank, annual_fee, interest_rate')
        .eq('bank', bank);

    const existingMap = new Map(
        (existingCards || []).map(card => [
            `${card.bank}-${card.name}`,
            card
        ])
    );

    for (const currentCard of currentCards) {
        const key = `${currentCard.bank}-${currentCard.name}`;
        const existing = existingMap.get(key);

        if (!existing) {
            newCards.push(currentCard);
        } else {
            // Check if data changed
            if (
                existing.annual_fee !== currentCard.annual_fee ||
                existing.interest_rate !== currentCard.interest_rate
            ) {
                changedCards.push(currentCard);
            }
        }
    }

    return { newCards, changedCards };
}

/**
 * Save cards to database
 */
async function saveCardsToDatabase(cards: CreditCardData[]): Promise<{ saved: number; errors: number }> {
    const supabase = await createClient();
    let saved = 0;
    let errors = 0;

    for (const card of cards) {
        try {
            // Generate slug from name
            const slug = card.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            const { error } = await supabase
                .from('credit_cards')
                .upsert({
                    slug,
                    name: card.name,
                    bank: card.bank,
                    type: card.type,
                    annual_fee: card.annual_fee,
                    joining_fee: card.joining_fee,
                    interest_rate: card.interest_rate,
                    min_income: card.min_income,
                    rewards: card.rewards || [],
                    pros: card.pros || [],
                    cons: card.cons || [],
                    apply_link: card.apply_link,
                    image_url: card.image_url,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'slug'
                });

            if (error) {
                logger.warn('Error saving card to database', { card: card.name, error });
                errors++;
            } else {
                saved++;
            }
        } catch (error) {
            logger.error('Error processing card', error as Error, { card: card.name });
            errors++;
        }
    }

    return { saved, errors };
}

/**
 * Main scraper function - scrapes all banks
 */
export async function scrapeAllCreditCards(): Promise<{
    totalCards: number;
    totalErrors: number;
    results: ScrapeResult[];
    summary: {
        newCards: number;
        changedCards: number;
        saved: number;
    };
}> {
    logger.info('Starting credit card scraping...');

    const results: ScrapeResult[] = [];
    let totalCards = 0;
    let totalErrors = 0;

    // Scrape each bank with rate limiting
    const banks = [
        { name: 'HDFC', scraper: scrapeHDFC },
        { name: 'SBI', scraper: scrapeSBI },
        { name: 'ICICI', scraper: scrapeICICI },
        { name: 'Axis', scraper: scrapeAxis },
    ];

    for (const bank of banks) {
        try {
            // Rate limiting: 2 seconds between requests
            await new Promise(resolve => setTimeout(resolve, 2000));

            const result = await bank.scraper();
            results.push(result);
            totalCards += result.cards.length;
            totalErrors += result.errors.length;

            // Detect changes
            if (result.cards.length > 0) {
                const changes = await detectChanges(result.cards, result.bank);
                logger.info(`Changes detected for ${result.bank}`, {
                    new: changes.newCards.length,
                    changed: changes.changedCards.length
                });
            }
        } catch (error) {
            logger.error(`Error scraping ${bank.name}`, error as Error);
            results.push({
                success: false,
                cards: [],
                errors: [error instanceof Error ? error.message : 'Unknown error'],
                bank: bank.name
            });
            totalErrors++;
        }
    }

    // Save all cards to database
    const allCards = results.flatMap(r => r.cards);
    const { saved, errors: saveErrors } = await saveCardsToDatabase(allCards);
    totalErrors += saveErrors;

    // Calculate summary
    const allChanges = await Promise.all(
        results.map(r => detectChanges(r.cards, r.bank))
    );
    const newCards = allChanges.reduce((sum, c) => sum + c.newCards.length, 0);
    const changedCards = allChanges.reduce((sum, c) => sum + c.changedCards.length, 0);

    logger.info('Credit card scraping complete', {
        totalCards,
        totalErrors,
        saved,
        newCards,
        changedCards
    });

    return {
        totalCards,
        totalErrors,
        results,
        summary: {
            newCards,
            changedCards,
            saved
        }
    };
}

/**
 * Scrape single bank (for testing)
 */
export async function scrapeBank(bankName: 'HDFC' | 'SBI' | 'ICICI' | 'Axis'): Promise<ScrapeResult> {
    const scrapers = {
        HDFC: scrapeHDFC,
        SBI: scrapeSBI,
        ICICI: scrapeICICI,
        Axis: scrapeAxis,
    };

    return scrapers[bankName]();
}
