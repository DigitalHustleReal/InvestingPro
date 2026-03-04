import * as cheerio from 'cheerio';
import { logger } from '@/lib/logger';
import { createServiceClient } from '@/lib/supabase/service';
import { Database } from '@/lib/database.types';

type ProductInsert = Database['public']['Tables']['products']['Insert'];

/**
 * TypeScript Product Scraper Service
 * Replaces the legacy Python scraper for Vercel compatibility.
 */
export class ProductScraperVideo {
    private supabase = createServiceClient();
    private headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; InvestingProBot/1.0; +https://investingpro.in)'
    };

    /**
     * Helper to fetch HTML content
     */
    private async fetchHTML(url: string): Promise<string | null> {
        try {
            const response = await fetch(url, { headers: { ...this.headers } });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.text();
        } catch (error) {
            logger.error(`Failed to fetch ${url}:`, error);
            return null;
        }
    }

    /**
     * Scrape Credit Card from BankBazaar
     */
    async scrapeCreditCard(url: string) {
        const html = await this.fetchHTML(url);
        if (!html) return null;

        const $ = cheerio.load(html);
        
        // Selectors matched from Python script
        const name = $('h1.product-title, h1').first().text().trim();
        const feeText = $('span:contains("Annual Fee"), span:contains("Joining Fee")').first().text();
        const annualFee = this.extractPrice(feeText);
        
        const rewardText = $('div:contains("Reward"), div:contains("Cashback")').first().text();
        const rewardRate = this.extractPercentage(rewardText);

        const features: string[] = [];
        $('li.feature-item, div.feature').slice(0, 10).each((_, el) => {
            features.push($(el).text().trim());
        });

        if (!name) return null;

        return {
            name,
            annual_fee: annualFee,
            reward_rate: rewardRate,
            features,
            source_url: url,
            scraped_at: new Date().toISOString()
        };
    }

    /**
     * Scrape AMFI NAV Data (Text File)
     */
    async scrapeAMFINAV(isin: string) {
        const AMFI_URL = 'https://portal.amfiindia.com/spages/NAVAll.txt';
        const text = await this.fetchHTML(AMFI_URL);
        if (!text) return null;

        const lines = text.split('\n');
        for (const line of lines) {
            if (line.includes(isin)) {
                const parts = line.split(';');
                // AMFI Format: Scheme Code; ISIN Div Payout/ISIN Growth; ISIN Div Reinvestment; Scheme Name; NAV; Date
                if (parts.length >= 5) {
                    return {
                        amfi_code: parts[0].trim(),
                        nav: parseFloat(parts[4]),
                        date: parts[5]?.trim(),
                        last_updated: new Date().toISOString()
                    };
                }
            }
        }
        return null;
    }

    /**
     * Extract number from "₹2,500"
     */
    private extractPrice(text: string): number {
        if (!text) return 0;
        if (text.toLowerCase().includes('free') || text.toLowerCase().includes('nil')) return 0;
        const match = text.replace(/,/g, '').match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    /**
     * Extract percentage from "5% Cashback"
     */
    private extractPercentage(text: string): number {
        if (!text) return 0;
        const match = text.match(/(\d+(?:\.\d+)?)%/);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * Update or Create Product in Supabase
     */
    async updateProduct(data: any, type: 'credit_card' | 'mutual_fund') {
        const slug = this.generateSlug(data.name);

        // 1. Upsert Master Product
        const productRecord: ProductInsert = {
            slug,
            name: data.name,
            product_type: type,
            provider: this.extractProvider(data.name, data.source_url),
            is_active: true,
            last_updated_at: new Date().toISOString(),
            data_completeness_score: 0.8 // Placeholder
        };

        const { data: product, error } = await this.supabase
            .from('products')
            .upsert(productRecord, { onConflict: 'slug' })
            .select()
            .single();

        if (error || !product) {
            logger.error('Failed to upsert product:', error);
            return;
        }

        // 2. Upsert Specific Content
        if (type === 'credit_card') {
            await this.supabase.from('credit_cards').upsert({
                product_id: product.id,
                annual_fee: data.annual_fee,
                reward_rate: data.reward_rate,
                features: JSON.stringify(data.features),
                updated_at: new Date().toISOString()
            }, { onConflict: 'product_id' });
        } else if (type === 'mutual_fund') {
            await this.supabase.from('mutual_funds').upsert({
                product_id: product.id,
                nav: data.nav,
                amfi_code: data.amfi_code,
                updated_at: new Date().toISOString()
            }, { onConflict: 'product_id' });
        }
        
        logger.info(`✓ Updated ${data.name}`);
    }

    private generateSlug(name: string): string {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    private extractProvider(name: string, url?: string): string {
        const lower = (name + (url || '')).toLowerCase();
        if (lower.includes('hdfc')) return 'HDFC Bank';
        if (lower.includes('sbi')) return 'SBI';
        if (lower.includes('axis')) return 'Axis Bank';
        if (lower.includes('icici')) return 'ICICI Bank';
        return 'Unknown';
    }
}

export const productScraper = new ProductScraperVideo();
