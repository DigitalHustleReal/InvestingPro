
import { config } from 'dotenv';
config({ path: '.env.local' });

import { chromium, Page } from 'playwright';
import { createServiceClient } from '../lib/supabase/service';
import * as cheerio from 'cheerio';

interface CreditCard {
  name: string;
  issuer: string;
  card_type?: string;
  annual_fee?: number;
  joining_fee?: number;
  features?: string[];
  best_for?: string;
  source: string;
  source_url: string;
}

const TARGET_URLS = [
    { url: 'https://www.bankbazaar.com/hdfc-bank-credit-card.html', issuer: 'HDFC Bank' },
    { url: 'https://www.bankbazaar.com/sbi-credit-card.html', issuer: 'SBI Card' },
    { url: 'https://www.bankbazaar.com/axis-bank-credit-card.html', issuer: 'Axis Bank' },
    { url: 'https://www.bankbazaar.com/icici-bank-credit-card.html', issuer: 'ICICI Bank' },
    { url: 'https://www.bankbazaar.com/citibank-credit-card.html', issuer: 'Citi Bank' },
    { url: 'https://www.bankbazaar.com/indusind-bank-credit-card.html', issuer: 'IndusInd Bank' },
    { url: 'https://www.bankbazaar.com/rbl-bank-credit-card.html', issuer: 'RBL Bank' }
];

async function extractCardsFromUrl(page: Page, url: string, defaultIssuer: string): Promise<CreditCard[]> {
    console.log(`  🌐 Scrapping: ${url}`);
    
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Scroll to load lazy content
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await page.waitForTimeout(1000);
        
        const html = await page.content();
        const $ = cheerio.load(html);
        const cards: CreditCard[] = [];

        // Generic Strategy: Find "Table Rows" or "Card Blocks"
        // Most BankBazaar bank pages use a Table structure for Top Cards.
        
        $('tr').each((_, tr) => {
            const text = $(tr).text();
            // Heuristic Not all rows are cards.
            if (!text.toLowerCase().includes('fee')) {
                // Try to find Card Name in first column
                const name = $(tr).find('td:nth-child(1) a').text().trim() || $(tr).find('td:nth-child(1)').text().trim();
                
                if (name.length > 5 && !name.includes('Name')) {
                    const lowerName = name.toLowerCase();
                    
                    // 1. MUST contain "Card"
                    if (!lowerName.includes('card')) return;

                    // 2. Blacklist (Case Insensitive)
                    const BLACKLIST = [
                        'transaction', 'payment', 'penalty', 'charge', 'interest', 'finance', 'cash', 
                        'over limit', 'late', 'return', 'fee', 'gst', 'statement', 'duplicate', 
                        'replacement', 'privileges', 'reward', 'points', 'surcharge', 'copy', 'priority pass',
                        'draft', 'cheque', 'outstation', 'collection', 'reissue', 'balance transfer',
                        'customer care', 'banking', 'service', 'login', 'account', 'loan', 'insurance', 'emi', 'calculator', 'status'
                    ];
                    
                    if (BLACKLIST.some(bad => lowerName.includes(bad))) return;

                    // Extract fees
                    const FeeText = $(tr).find('td:nth-child(2)').text().trim();
                    const feeMatch = FeeText.match(/₹\s*([\d,]+)/);
                    const fee = feeMatch ? parseInt(feeMatch[1].replace(/,/g, '')) : 0;

                    // Features are often in 3rd column or hidden.
                    const features = [$(tr).find('td:nth-child(3)').text().trim()].filter(f => f.length > 5);

                     // Clean name
                    const cleanName = name.replace(/\*/g, '').trim();

                    if (cleanName && cleanName.length > 3) {
                         cards.push({
                            name: cleanName,
                            issuer: defaultIssuer,
                            card_type: 'Standard', // Default
                            annual_fee: fee,
                            joining_fee: fee, // Assume same usually
                            features: features,
                            source: 'BankBazaar',
                            source_url: url
                        });
                    }
                }
            }
        });

        // If table scraping yielded few results, try "Card Block" style (some pages use this)
        if (cards.length < 2) {
             // Look for H2/H3 headlines followed by Fees
             $('h2, h3').each((_, h) => {
                 const title = $(h).text().trim();
                 // Heuristic: If title looks like a card name (not "Table of Contents")
                 if (!title.includes('Customer Care') && !title.includes('Apply') && title.length > 5 && title.length < 50) {
                     // Check siblings for "Annual Fee"
                     // This is fuzzy but better than nothing
                     cards.push({
                        name: title,
                        issuer: defaultIssuer,
                        annual_fee: 0, // Hard to extract reliably in unstructured text
                        features: [],
                        source: 'BankBazaar',
                        source_url: url
                     });
                 }
             });
        }
        
        console.log(`     -> Found ${cards.length} potential cards.`);
        return cards;

    } catch (e: any) {
        console.error(`     -> Error: ${e.message}`);
        return [];
    }
}

async function main() {
    console.log("🚀 Starting ROBUST Scraper...");
    const supabase = createServiceClient();

    // Warmup
    const { error: warmupError } = await supabase.from('credit_cards').select('id').limit(1);
    if (warmupError) {
        console.error("❌ Warmup failed:", warmupError.message);
        process.exit(1);
    } else {
        console.log("✅ Database connected.");
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    let totalSaved = 0;

    for (const target of TARGET_URLS) {
        const cards = await extractCardsFromUrl(page, target.url, target.issuer);
        
        for (const card of cards) {
            const slug = card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            // Clean junk
            if (slug.includes('table') || slug.includes('content') || slug.length < 4) continue;

             const { error } = await supabase.from('credit_cards').upsert({
                slug,
                name: card.name,
                bank: card.issuer,
                annual_fee: card.annual_fee, // Schema expects NUMERIC
                joining_fee: card.joining_fee, // Schema expects NUMERIC
                description: `Apply for ${card.name} from ${card.issuer}`,
                rewards: card.features, // Map features to rewards array
                pros: card.features,
                type: 'Rewards', // Default to valid Enum
                rating: 4.0, 
                apply_link: card.source_url // Correct column name
            }, { onConflict: 'slug'});

            if (!error) {
                totalSaved++;
            } else {
                 console.log(`❌ Error saving ${card.name}:`, error.message);
            }
        }
    }

    console.log("------------------------------------------");
    console.log(`✅ Scraper Finished. Total Cards Saved: ${totalSaved}`);
    console.log("------------------------------------------");
    await browser.close();
}

main();
