/**
 * 🕷️ PRODUCTION CREDIT CARD SCRAPER
 * 
 * Scrapes from multiple aggregator sources for comprehensive coverage
 * Sources: BankBazaar, PolicyBazaar, CRED
 * 
 * Aggregators are preferred because:
 * - Better structured data
 * - Multiple banks in one place
 * - Easier to maintain selectors
 * - More complete information
 */

import { chromium, Browser, Page } from 'playwright';
import { createServiceClient } from '../lib/supabase/service';
import * as cheerio from 'cheerio';

interface CreditCard {
  name: string;
  issuer: string;
  card_type?: string;
  annual_fee?: number;
  joining_bonus?: string;
  rewards_rate?: string;
  features?: string[];
  source: string;
  source_url: string;
}

/**
 * Scrape BankBazaar - Most comprehensive aggregator
 */
async function scrapeBankBazaar(page: Page): Promise<CreditCard[]> {
  console.log('\n🏦 Scraping BankBazaar...');
  const cards: CreditCard[] = [];
  
  try {
    await page.goto('https://www.bankbazaar.com/credit-card.html', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    
    console.log('  📄 Page loaded, waiting for content...');
    await page.waitForTimeout(5000); // Let JavaScript render
    
    // Get page HTML
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // Find card elements (will adjust selectors after viewing actual page)
    const cardElements = $('.card-item, .product-card, [class*="card-list"], [class*="product"]');
    
    console.log(`  🔍 Found ${cardElements.length} potential card elements`);
    
    cardElements.each((idx, elem) => {
      if (idx < 50) { // Limit to first 50
        const $elem = $(elem);
        
        // Extract data (selectors to be adjusted based on actual HTML)
        const name = $elem.find('h2, h3, .card-name, [class*="name"]').first().text().trim();
        const issuer = $elem.find('.bank-name, [class*="issuer"], [class*="bank"]').first().text().trim();
        const fee = $elem.find('[class*="fee"], [class*="annual"]').first().text().trim();
        
        if (name) {
          cards.push({
            name,
            issuer: issuer || extractIssuerFromName(name),
            card_type: categorizeCard(name),
            annual_fee: extractFee(fee),
            features: [],
            source: 'BankBazaar',
            source_url: 'https://www.bankbazaar.com/credit-card.html'
          });
        }
      }
    });
    
    console.log(`  ✅ Extracted ${cards.length} cards`);
    
  } catch (error: any) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  
  return cards;
}

/**
 * Scrape Paisabazaar (PolicyBazaar's credit card platform)
 */
async function scrapePaisabazaar(page: Page): Promise<CreditCard[]> {
  console.log('\n🏦 Scraping Paisabazaar...');
  const cards: CreditCard[] = [];
  
  try {
    await page.goto('https://www.paisabazaar.com/credit-card/', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    
    console.log('  📄 Page loaded, extracting data...');
    await page.waitForTimeout(5000);
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // Paisabazaar specific selectors
    const cardElements = $('[class*="card"], .product-item, [class*="listing"]');
    
    console.log(`  🔍 Found ${cardElements.length} potential elements`);
    
    cardElements.each((idx, elem) => {
      if (idx < 50) {
        const $elem = $(elem);
        const name = $elem.find('h2, h3, .title, [class*="name"]').first().text().trim();
        const issuer = $elem.find('[class*="bank"], [class*="issuer"]').first().text().trim();
        
        if (name) {
          cards.push({
            name,
            issuer: issuer || extractIssuerFromName(name),
            card_type: categorizeCard(name),
            features: [],
            source: 'Paisabazaar',
            source_url: 'https://www.paisabazaar.com/credit-card/'
          });
        }
      }
    });
    
    console.log(`  ✅ Extracted ${cards.length} cards`);
    
  } catch (error: any) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  
  return cards;
}

/**
 * Helper: Extract issuer from card name
 */
function extractIssuerFromName(name: string): string {
  const banks = ['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'IndusInd', 'RBL', 'Yes Bank', 'IDFC', 'Standard Chartered'];
  
  for (const bank of banks) {
    if (name.toUpperCase().includes(bank.toUpperCase())) {
      return bank === 'SBI' ? 'SBI Card' : bank + ' Bank';
    }
  }
  
  return 'Unknown';
}

/**
 * Helper: Categorize card type from name
 */
function categorizeCard(name: string): string {
  const nameUpper = name.toUpperCase();
  
  if (nameUpper.includes('MAGNUS') || nameUpper.includes('INFINIA') || nameUpper.includes('DINERS BLACK')) {
    return 'Super Premium';
  }
  if (nameUpper.includes('REGALIA') || nameUpper.includes('ELITE') || nameUpper.includes('SIGNATURE')) {
    return 'Premium';
  }
  if (nameUpper.includes('CASHBACK') || nameUpper.includes('SIMPLYCLICK')) {
    return 'Cashback';
  }
  if (nameUpper.includes('TRAVEL') || nameUpper.includes('MILES')) {
    return 'Travel';
  }
  if (nameUpper.includes('SHOPPING') || nameUpper.includes('AMAZON') || nameUpper.includes('FLIPKART')) {
    return 'Shopping';
  }
  if (nameUpper.includes('MILLENNIA') || nameUpper.includes('FREEDOM')) {
    return 'Lifestyle';
  }
  
  return 'Standard';
}

/**
 * Helper: Extract numeric fee
 */
function extractFee(feeText: string): number {
  const numbers = feeText.match(/\d+/g);
  if (!numbers) return 0;
  
  const fee = parseInt(numbers.join(''));
  return isNaN(fee) ? 0 : fee;
}

/**
 * Main scraper
 */
async function main() {
  console.log('\n🕷️  PRODUCTION CREDIT CARD SCRAPER');
  console.log('═'.repeat(70));
  console.log('Launching browser...\n');
  
  const browser = await chromium.launch({
    headless: false, // Show browser for debugging
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  let allCards: CreditCard[] = [];
  
  try {
    // Scrape each source
    const bankbazaarCards = await scrapeBankBazaar(page);
    allCards = allCards.concat(bankbazaarCards);
    
    const paisabazaarCards = await scrapePaisabazaar(page);
    allCards = allCards.concat(paisabazaarCards);
    
  } finally {
    console.log('\n⏸️  Browser will stay open for 10 seconds for inspection...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
  
  // Remove duplicates
  const uniqueCards = Array.from(
    new Map(allCards.map(card => [card.name, card])).values()
  );
  
  console.log('\n' + '═'.repeat(70));
  console.log(`📦 Total unique cards: ${uniqueCards.length}`);
  console.log('═'.repeat(70));
  
  if (uniqueCards.length > 0) {
    console.log('\nSample cards:');
    uniqueCards.slice(0, 10).forEach((card, idx) => {
      console.log(`  ${idx + 1}. ${card.name} (${card.issuer}) - ${card.source}`);
    });
    
    // Save to database
    const supabase = createServiceClient();
    let success = 0;
    let failed = 0;
    
    console.log('\n💾 Saving to database...');
    for (const card of uniqueCards) {
      const cardData = {
        ...card,
        slug: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase.from('credit_cards').insert(cardData);
      
      if (error) {
        if (!error.message.includes('duplicate')) {
          console.log(`  ❌ ${card.name}: ${error.message}`);
          failed++;
        }
      } else {
        console.log(`  ✅ ${card.name}`);
        success++;
      }
    }
    
    console.log(`\n📊 Saved: ${success}, Failed: ${failed}`);
    console.log('\n✅ Scraping complete!');
  }
}

main().catch(console.error);
