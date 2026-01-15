/**
 * Product Data Scraper
 * 
 * Automated scraping for all product categories
 * Primary Focus: Credit Cards + Mutual Funds (highest monetization)
 * Secondary: Insurance, Loans (supporting categories)
 * 
 * Data Sources:
 * - Credit Cards: BankBazaar, Paisabazaar, CardExpert
 * - Mutual Funds: AMFI NAV data, Value Research, Moneycontrol
 * - Insurance: Policybazaar, BankBazaar, Paisabazaar
 * - Loans: BankBazaar, Paisabazaar, RBI data
 */

import { createServiceClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';
import * as cheerio from 'cheerio';

interface CreditCardData {
    name: string;
    bank: string;
    type: 'Cashback' | 'Rewards' | 'Travel' | 'Premium' | 'Shopping' | 'Fuel';
    annual_fee?: string;
    joining_fee?: string;
    min_income?: string;
    interest_rate?: string;
    rewards?: string[];
    pros?: string[];
    cons?: string[];
    image_url?: string;
    apply_link?: string;
    description?: string;
}

interface MutualFundData {
    name: string;
    fund_house: string;
    scheme_code?: number;
    category: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Flexi Cap' | 'Multi Cap' | 'ELSS' | 'Index Fund' | 'Debt' | 'Hybrid';
    nav: number;
    aum?: string;
    expense_ratio?: number;
    returns_1y?: number;
    returns_3y?: number;
    returns_5y?: number;
    risk?: 'Low' | 'Moderate' | 'Moderately High' | 'High' | 'Very High';
    min_investment?: string;
    description?: string;
}

interface InsuranceData {
    name: string;
    provider: string;
    type: 'term' | 'health' | 'motor' | 'life';
    coverage_amount_min?: number;
    coverage_amount_max?: number;
    premium_monthly?: number;
    premium_yearly?: number;
    features?: string[];
    claim_settlement_ratio?: number;
    cashless_hospitals?: number;
    waiting_period?: string;
    description?: string;
    image_url?: string;
    apply_link?: string;
}

interface LoanData {
    name: string;
    provider: string;
    type: 'personal' | 'home' | 'car' | 'education';
    interest_rate_min?: number;
    interest_rate_max?: number;
    interest_rate_type?: 'fixed' | 'floating';
    processing_fee?: string;
    prepayment_charges?: string;
    max_tenure_months?: number;
    max_amount?: string;
    min_age?: number;
    description?: string;
    image_url?: string;
    apply_link?: string;
}

export class ProductDataScraper {
    private supabase = createServiceClient();
    private headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (compatible; InvestingProBot/1.0; +https://investingpro.in)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    };

    /**
     * Generate slug from name
     */
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Extract price from text (handles "₹2,500", "Free", "Nil", etc.)
     */
    private extractPrice(text: string): string | null {
        if (!text) return null;
        const lower = text.toLowerCase();
        if (lower.includes('free') || lower.includes('nil') || lower.includes('zero')) {
            return 'Free';
        }
        // Extract ₹ amount
        const match = text.match(/₹\s*([\d,]+(?:\.[\d]+)?)/);
        if (match) {
            return `₹${match[1]}`;
        }
        // Extract number only
        const numMatch = text.match(/([\d,]+(?:\.[\d]+)?)/);
        if (numMatch) {
            return `₹${numMatch[1]}`;
        }
        return text.trim();
    }

    /**
     * Extract number from text
     */
    private extractNumber(text: string): number | null {
        if (!text) return null;
        const match = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]) : null;
    }

    /**
     * Fetch HTML with retry
     */
    private async fetchHTML(url: string, retries = 3): Promise<string | null> {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, {
                    headers: this.headers,
                    signal: AbortSignal.timeout(10000), // 10s timeout
                });
                
                if (!response.ok) {
                    if (response.status === 429) {
                        // Rate limited - wait and retry
                        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
                        continue;
                    }
                    throw new Error(`HTTP ${response.status}`);
                }
                
                return await response.text();
            } catch (error) {
                logger.warn(`Failed to fetch ${url} (attempt ${i + 1}/${retries})`, { error });
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                }
            }
        }
        return null;
    }

    /**
     * Scrape Credit Card from BankBazaar
     */
    async scrapeCreditCardFromBankBazaar(url: string): Promise<CreditCardData | null> {
        const html = await this.fetchHTML(url);
        if (!html) return null;

        try {
            const $ = cheerio.load(html);
            
            const name = $('h1, .product-title, .card-name').first().text().trim();
            if (!name) return null;

            // Extract bank name
            const bank = this.extractBankName(name, url);

            // Extract fees
            const annualFee = this.extractPrice($('.annual-fee, [data-field="annual-fee"]').text() || '');
            const joiningFee = this.extractPrice($('.joining-fee, [data-field="joining-fee"]').text() || '');

            // Extract income requirement
            const minIncome = this.extractPrice($('.min-income, [data-field="min-income"]').text() || '');

            // Extract interest rate
            const interestRate = $('.interest-rate, [data-field="interest-rate"]').text().trim() || undefined;

            // Extract rewards/features
            const rewards: string[] = [];
            $('.reward-item, .feature-item, .benefit').each((_, el) => {
                const text = $(el).text().trim();
                if (text) rewards.push(text);
            });

            // Extract card type from name or features
            const type = this.detectCardType(name, rewards);

            // Extract description
            const description = $('.product-description, .card-description, .overview').first().text().trim() || undefined;

            // Extract image
            const imageUrl = $('.product-image img, .card-image img').attr('src') || 
                           $('meta[property="og:image"]').attr('content') || undefined;

            // Extract apply link
            const applyLink = $('.apply-button, .apply-now, a[href*="apply"]').attr('href') || undefined;

            return {
                name,
                bank,
                type,
                annual_fee: annualFee || undefined,
                joining_fee: joiningFee || undefined,
                min_income: minIncome || undefined,
                interest_rate: interestRate,
                rewards: rewards.length > 0 ? rewards : undefined,
                description,
                image_url: imageUrl,
                apply_link: applyLink,
            };
        } catch (error) {
            logger.error('Error scraping credit card from BankBazaar', { url, error });
            return null;
        }
    }

    /**
     * Scrape Mutual Fund NAV from AMFI
     */
    async scrapeMutualFundNAV(schemeCode?: number): Promise<MutualFundData | null> {
        const AMFI_URL = 'https://portal.amfiindia.com/spages/NAVAll.txt';
        const text = await this.fetchHTML(AMFI_URL);
        if (!text) return null;

        try {
            const lines = text.split('\n');
            let currentScheme: any = null;
            let schemeName = '';
            let fundHouse = '';

            for (const line of lines) {
                // AMFI format: Scheme Code;ISIN;Scheme Name;NAV;Date
                if (line.startsWith('Open Ended Schemes')) {
                    continue; // Skip header
                }

                if (line.includes(';')) {
                    const parts = line.split(';').map(p => p.trim());
                    
                    if (parts.length >= 4) {
                        const code = parseInt(parts[0]);
                        if (schemeCode && code === schemeCode) {
                            return {
                                name: parts[2] || schemeName,
                                fund_house: fundHouse || 'Unknown',
                                scheme_code: code,
                                category: this.detectFundCategory(parts[2] || schemeName),
                                nav: parseFloat(parts[3]) || 0,
                            };
                        }
                    }
                } else if (line.trim() && !line.includes(';')) {
                    // Fund house name
                    fundHouse = line.trim();
                }
            }

            return null;
        } catch (error) {
            logger.error('Error scraping AMFI NAV data', { error });
            return null;
        }
    }

    /**
     * Save Credit Card to database
     */
    async saveCreditCard(data: CreditCardData): Promise<boolean> {
        try {
            const slug = this.generateSlug(data.name);

            const { error } = await this.supabase
                .from('credit_cards')
                .upsert({
                    slug,
                    name: data.name,
                    bank: data.bank,
                    type: data.type,
                    annual_fee: data.annual_fee,
                    joining_fee: data.joining_fee,
                    min_income: data.min_income,
                    interest_rate: data.interest_rate,
                    rewards: data.rewards || [],
                    pros: data.pros || [],
                    cons: data.cons || [],
                    image_url: data.image_url,
                    apply_link: data.apply_link,
                    description: data.description,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'slug',
                });

            if (error) {
                logger.error('Error saving credit card', { error, data });
                return false;
            }

            logger.info('Credit card saved', { name: data.name, slug });
            return true;
        } catch (error) {
            logger.error('Exception saving credit card', { error, data });
            return false;
        }
    }

    /**
     * Save Mutual Fund to database
     */
    async saveMutualFund(data: MutualFundData): Promise<boolean> {
        try {
            const slug = this.generateSlug(data.name);

            const { error } = await this.supabase
                .from('mutual_funds')
                .upsert({
                    slug,
                    name: data.name,
                    fund_house: data.fund_house,
                    scheme_code: data.scheme_code,
                    category: data.category,
                    nav: data.nav,
                    aum: data.aum,
                    expense_ratio: data.expense_ratio,
                    returns_1y: data.returns_1y,
                    returns_3y: data.returns_3y,
                    returns_5y: data.returns_5y,
                    risk: data.risk,
                    min_investment: data.min_investment,
                    description: data.description,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'slug',
                });

            if (error) {
                logger.error('Error saving mutual fund', { error, data });
                return false;
            }

            logger.info('Mutual fund saved', { name: data.name, slug });
            return true;
        } catch (error) {
            logger.error('Exception saving mutual fund', { error, data });
            return false;
        }
    }

    /**
     * Extract bank name from card name or URL
     */
    private extractBankName(name: string, url?: string): string {
        const text = (name + ' ' + (url || '')).toLowerCase();
        
        if (text.includes('hdfc')) return 'HDFC Bank';
        if (text.includes('sbi')) return 'SBI';
        if (text.includes('axis')) return 'Axis Bank';
        if (text.includes('icici')) return 'ICICI Bank';
        if (text.includes('kotak')) return 'Kotak Mahindra Bank';
        if (text.includes('yes bank')) return 'Yes Bank';
        if (text.includes('indusind')) return 'IndusInd Bank';
        if (text.includes('rbl')) return 'RBL Bank';
        if (text.includes('standard chartered')) return 'Standard Chartered';
        if (text.includes('amex') || text.includes('american express')) return 'American Express';
        
        return 'Unknown';
    }

    /**
     * Detect card type from name and features
     */
    private detectCardType(name: string, features: string[]): CreditCardData['type'] {
        const text = (name + ' ' + features.join(' ')).toLowerCase();
        
        if (text.includes('cashback') || text.includes('cash back')) return 'Cashback';
        if (text.includes('travel') || text.includes('airline') || text.includes('miles')) return 'Travel';
        if (text.includes('shopping') || text.includes('e-commerce')) return 'Shopping';
        if (text.includes('fuel') || text.includes('petrol')) return 'Fuel';
        if (text.includes('premium') || text.includes('platinum') || text.includes('signature')) return 'Premium';
        
        return 'Rewards'; // Default
    }

    /**
     * Detect fund category from name
     */
    private detectFundCategory(name: string): MutualFundData['category'] {
        const lower = name.toLowerCase();
        
        if (lower.includes('large cap')) return 'Large Cap';
        if (lower.includes('mid cap')) return 'Mid Cap';
        if (lower.includes('small cap')) return 'Small Cap';
        if (lower.includes('flexi cap')) return 'Flexi Cap';
        if (lower.includes('multi cap')) return 'Multi Cap';
        if (lower.includes('elss') || lower.includes('tax saving')) return 'ELSS';
        if (lower.includes('index')) return 'Index Fund';
        if (lower.includes('debt') || lower.includes('bond')) return 'Debt';
        if (lower.includes('hybrid') || lower.includes('balanced')) return 'Hybrid';
        
        return 'Large Cap'; // Default
    }

    /**
     * Scrape multiple credit cards from a list of URLs
     */
    async scrapeCreditCards(urls: string[]): Promise<{ success: number; failed: number }> {
        let success = 0;
        let failed = 0;

        for (const url of urls) {
            try {
                const data = await this.scrapeCreditCardFromBankBazaar(url);
                if (data) {
                    const saved = await this.saveCreditCard(data);
                    if (saved) {
                        success++;
                    } else {
                        failed++;
                    }
                } else {
                    failed++;
                }
                
                // Rate limiting - wait 1 second between requests
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                logger.error('Error scraping credit card URL', { url, error });
                failed++;
            }
        }

        return { success, failed };
    }

    /**
     * Update mutual fund NAVs from AMFI
     */
    async updateMutualFundNAVs(schemeCodes?: number[]): Promise<{ updated: number; failed: number }> {
        let updated = 0;
        let failed = 0;

        // If no scheme codes provided, get all from database
        if (!schemeCodes || schemeCodes.length === 0) {
            const { data: funds } = await this.supabase
                .from('mutual_funds')
                .select('scheme_code')
                .not('scheme_code', 'is', null);
            
            schemeCodes = funds?.map(f => f.scheme_code).filter(Boolean) as number[] || [];
        }

        // Fetch AMFI data once
        const AMFI_URL = 'https://portal.amfiindia.com/spages/NAVAll.txt';
        const text = await this.fetchHTML(AMFI_URL);
        if (!text) {
            logger.error('Failed to fetch AMFI NAV data');
            return { updated: 0, failed: schemeCodes.length };
        }

        // Parse and update
        const lines = text.split('\n');
        const navMap = new Map<number, number>();

        for (const line of lines) {
            if (line.includes(';')) {
                const parts = line.split(';').map(p => p.trim());
                if (parts.length >= 4) {
                    const code = parseInt(parts[0]);
                    const nav = parseFloat(parts[3]);
                    if (code && nav && !isNaN(nav)) {
                        navMap.set(code, nav);
                    }
                }
            }
        }

        // Update database
        for (const schemeCode of schemeCodes) {
            const nav = navMap.get(schemeCode);
            if (nav) {
                const { error } = await this.supabase
                    .from('mutual_funds')
                    .update({ nav, updated_at: new Date().toISOString() })
                    .eq('scheme_code', schemeCode);

                if (error) {
                    logger.error('Error updating NAV', { schemeCode, error });
                    failed++;
                } else {
                    updated++;
                }
            } else {
                failed++;
            }
        }

        return { updated, failed };
    }

    /**
     * Scrape Insurance from Policybazaar/BankBazaar
     */
    async scrapeInsuranceFromPolicybazaar(url: string): Promise<InsuranceData | null> {
        const html = await this.fetchHTML(url);
        if (!html) return null;

        try {
            const $ = cheerio.load(html);
            
            const name = $('h1, .product-title, .policy-name').first().text().trim();
            if (!name) return null;

            // Extract provider
            const provider = this.extractProvider(name, url);

            // Detect insurance type
            const type = this.detectInsuranceType(name, url);

            // Extract coverage amounts
            const coverageText = $('.coverage-amount, [data-field="coverage"]').text();
            const coverageMin = this.extractNumber(coverageText);
            const coverageMax = this.extractNumber(coverageText.split('-')[1] || '');

            // Extract premiums
            const premiumMonthly = this.extractNumber($('.premium-monthly, [data-field="premium-monthly"]').text());
            const premiumYearly = this.extractNumber($('.premium-yearly, [data-field="premium-yearly"]').text());

            // Extract features
            const features: string[] = [];
            $('.feature-item, .benefit-item, .coverage-item').each((_, el) => {
                const text = $(el).text().trim();
                if (text) features.push(text);
            });

            // Extract claim settlement ratio
            const claimRatio = this.extractNumber($('.claim-ratio, [data-field="claim-settlement"]').text());

            // Extract cashless hospitals count
            const cashlessHospitals = this.extractNumber($('.cashless-hospitals, [data-field="cashless"]').text());

            // Extract waiting period
            const waitingPeriod = $('.waiting-period, [data-field="waiting-period"]').text().trim() || undefined;

            // Extract description
            const description = $('.product-description, .policy-description, .overview').first().text().trim() || undefined;

            // Extract image
            const imageUrl = $('.product-image img, .policy-image img').attr('src') || 
                           $('meta[property="og:image"]').attr('content') || undefined;

            // Extract apply link
            const applyLink = $('.apply-button, .apply-now, a[href*="apply"]').attr('href') || undefined;

            return {
                name,
                provider,
                type,
                coverage_amount_min: coverageMin || undefined,
                coverage_amount_max: coverageMax || undefined,
                premium_monthly: premiumMonthly || undefined,
                premium_yearly: premiumYearly || undefined,
                features: features.length > 0 ? features : undefined,
                claim_settlement_ratio: claimRatio || undefined,
                cashless_hospitals: cashlessHospitals || undefined,
                waiting_period: waitingPeriod,
                description,
                image_url: imageUrl,
                apply_link: applyLink,
            };
        } catch (error) {
            logger.error('Error scraping insurance from Policybazaar', { url, error });
            return null;
        }
    }

    /**
     * Scrape Loan from BankBazaar/Paisabazaar
     */
    async scrapeLoanFromBankBazaar(url: string): Promise<LoanData | null> {
        const html = await this.fetchHTML(url);
        if (!html) return null;

        try {
            const $ = cheerio.load(html);
            
            const name = $('h1, .product-title, .loan-name').first().text().trim();
            if (!name) return null;

            // Extract provider
            const provider = this.extractProvider(name, url);

            // Detect loan type
            const type = this.detectLoanType(name, url);

            // Extract interest rates
            const interestRateText = $('.interest-rate, [data-field="interest-rate"]').text();
            const rates = this.extractInterestRateRange(interestRateText);
            
            // Extract interest rate type
            const interestRateType = interestRateText.toLowerCase().includes('fixed') ? 'fixed' : 'floating';

            // Extract processing fee
            const processingFee = this.extractPrice($('.processing-fee, [data-field="processing-fee"]').text()) || undefined;

            // Extract prepayment charges
            const prepaymentCharges = this.extractPrice($('.prepayment-charges, [data-field="prepayment"]').text()) || undefined;

            // Extract max tenure
            const maxTenureText = $('.max-tenure, [data-field="tenure"]').text();
            const maxTenureMonths = this.extractTenureInMonths(maxTenureText);

            // Extract max amount
            const maxAmount = this.extractPrice($('.max-amount, [data-field="max-amount"]').text()) || undefined;

            // Extract min age
            const minAge = this.extractNumber($('.min-age, [data-field="min-age"]').text()) || undefined;

            // Extract description
            const description = $('.product-description, .loan-description, .overview').first().text().trim() || undefined;

            // Extract image
            const imageUrl = $('.product-image img, .loan-image img').attr('src') || 
                           $('meta[property="og:image"]').attr('content') || undefined;

            // Extract apply link
            const applyLink = $('.apply-button, .apply-now, a[href*="apply"]').attr('href') || undefined;

            return {
                name,
                provider,
                type,
                interest_rate_min: rates.min || undefined,
                interest_rate_max: rates.max || undefined,
                interest_rate_type: interestRateType,
                processing_fee: processingFee,
                prepayment_charges: prepaymentCharges,
                max_tenure_months: maxTenureMonths || undefined,
                max_amount: maxAmount,
                min_age: minAge,
                description,
                image_url: imageUrl,
                apply_link: applyLink,
            };
        } catch (error) {
            logger.error('Error scraping loan from BankBazaar', { url, error });
            return null;
        }
    }

    /**
     * Save Insurance to database (using affiliate_products table)
     */
    async saveInsurance(data: InsuranceData): Promise<boolean> {
        try {
            const slug = this.generateSlug(data.name);

            // Save to affiliate_products table (since there's no dedicated insurance table)
            const { error } = await this.supabase
                .from('affiliate_products')
                .upsert({
                    name: data.name,
                    company: data.provider,
                    type: 'insurance',
                    description: data.description,
                    features: data.features || [],
                    pricing: {
                        monthly: data.premium_monthly,
                        yearly: data.premium_yearly,
                        coverage_min: data.coverage_amount_min,
                        coverage_max: data.coverage_amount_max,
                    },
                    image_url: data.image_url,
                    affiliate_link: data.apply_link || '',
                    status: 'active',
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'name,company',
                });

            if (error) {
                logger.error('Error saving insurance', { error, data });
                return false;
            }

            logger.info('Insurance saved', { name: data.name });
            return true;
        } catch (error) {
            logger.error('Exception saving insurance', { error, data });
            return false;
        }
    }

    /**
     * Save Loan to database (using products + personal_loans tables)
     */
    async saveLoan(data: LoanData): Promise<boolean> {
        try {
            const slug = this.generateSlug(data.name);

            // First, upsert to products table
            const { data: product, error: productError } = await this.supabase
                .from('products')
                .upsert({
                    slug,
                    name: data.name,
                    product_type: 'personal_loan',
                    provider: data.provider,
                    is_active: true,
                    last_updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'slug',
                })
                .select()
                .single();

            if (productError || !product) {
                logger.error('Error saving product for loan', { error: productError, data });
                return false;
            }

            // Then, upsert to personal_loans table
            const { error: loanError } = await this.supabase
                .from('personal_loans')
                .upsert({
                    product_id: product.id,
                    interest_rate_min: data.interest_rate_min || null,
                    interest_rate_max: data.interest_rate_max || null,
                    processing_fee_value: data.processing_fee ? this.extractNumber(data.processing_fee) : null,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'product_id',
                });

            if (loanError) {
                logger.error('Error saving loan details', { error: loanError, data });
                return false;
            }

            logger.info('Loan saved', { name: data.name, slug });
            return true;
        } catch (error) {
            logger.error('Exception saving loan', { error, data });
            return false;
        }
    }

    /**
     * Extract provider name from text or URL
     */
    private extractProvider(name: string, url?: string): string {
        const text = (name + ' ' + (url || '')).toLowerCase();
        
        // Insurance providers
        if (text.includes('lic')) return 'LIC';
        if (text.includes('hdfc life')) return 'HDFC Life';
        if (text.includes('icici prudential')) return 'ICICI Prudential';
        if (text.includes('sbi life')) return 'SBI Life';
        if (text.includes('bajaj allianz')) return 'Bajaj Allianz';
        if (text.includes('max life')) return 'Max Life';
        if (text.includes('tata aia')) return 'Tata AIA';
        if (text.includes('aditya birla')) return 'Aditya Birla Sun Life';
        
        // Banks (for loans)
        if (text.includes('hdfc')) return 'HDFC Bank';
        if (text.includes('sbi')) return 'SBI';
        if (text.includes('axis')) return 'Axis Bank';
        if (text.includes('icici')) return 'ICICI Bank';
        if (text.includes('kotak')) return 'Kotak Mahindra Bank';
        if (text.includes('yes bank')) return 'Yes Bank';
        if (text.includes('indusind')) return 'IndusInd Bank';
        if (text.includes('rbl')) return 'RBL Bank';
        
        return 'Unknown';
    }

    /**
     * Detect insurance type from name or URL
     */
    private detectInsuranceType(name: string, url?: string): InsuranceData['type'] {
        const text = (name + ' ' + (url || '')).toLowerCase();
        
        if (text.includes('term') || text.includes('life insurance')) return 'term';
        if (text.includes('health') || text.includes('mediclaim')) return 'health';
        if (text.includes('motor') || text.includes('car') || text.includes('vehicle')) return 'motor';
        
        return 'life'; // Default
    }

    /**
     * Detect loan type from name or URL
     */
    private detectLoanType(name: string, url?: string): LoanData['type'] {
        const text = (name + ' ' + (url || '')).toLowerCase();
        
        if (text.includes('home') || text.includes('housing')) return 'home';
        if (text.includes('car') || text.includes('vehicle') || text.includes('auto')) return 'car';
        if (text.includes('education') || text.includes('student')) return 'education';
        
        return 'personal'; // Default
    }

    /**
     * Extract interest rate range from text (e.g., "10.5% - 18%")
     */
    private extractInterestRateRange(text: string): { min: number | null; max: number | null } {
        if (!text) return { min: null, max: null };
        
        const rates = text.match(/(\d+(?:\.\d+)?)%/g);
        if (!rates || rates.length === 0) return { min: null, max: null };
        
        const numbers = rates.map(r => parseFloat(r.replace('%', '')));
        
        if (numbers.length === 1) {
            return { min: numbers[0], max: numbers[0] };
        }
        
        return {
            min: Math.min(...numbers),
            max: Math.max(...numbers),
        };
    }

    /**
     * Extract tenure in months from text (e.g., "5 years" = 60 months)
     */
    private extractTenureInMonths(text: string): number | null {
        if (!text) return null;
        
        // Try years first
        const yearMatch = text.match(/(\d+(?:\.\d+)?)\s*years?/i);
        if (yearMatch) {
            return Math.round(parseFloat(yearMatch[1]) * 12);
        }
        
        // Try months
        const monthMatch = text.match(/(\d+(?:\.\d+)?)\s*months?/i);
        if (monthMatch) {
            return Math.round(parseFloat(monthMatch[1]));
        }
        
        return null;
    }

    /**
     * Scrape multiple insurance products from URLs
     */
    async scrapeInsurance(urls: string[]): Promise<{ success: number; failed: number }> {
        let success = 0;
        let failed = 0;

        for (const url of urls) {
            try {
                const data = await this.scrapeInsuranceFromPolicybazaar(url);
                if (data) {
                    const saved = await this.saveInsurance(data);
                    if (saved) {
                        success++;
                    } else {
                        failed++;
                    }
                } else {
                    failed++;
                }
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                logger.error('Error scraping insurance URL', { url, error });
                failed++;
            }
        }

        return { success, failed };
    }

    /**
     * Scrape multiple loans from URLs
     */
    async scrapeLoans(urls: string[]): Promise<{ success: number; failed: number }> {
        let success = 0;
        let failed = 0;

        for (const url of urls) {
            try {
                const data = await this.scrapeLoanFromBankBazaar(url);
                if (data) {
                    const saved = await this.saveLoan(data);
                    if (saved) {
                        success++;
                    } else {
                        failed++;
                    }
                } else {
                    failed++;
                }
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                logger.error('Error scraping loan URL', { url, error });
                failed++;
            }
        }

        return { success, failed };
    }
}

export const productDataScraper = new ProductDataScraper();
