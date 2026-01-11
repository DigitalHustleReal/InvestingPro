/**
 * 🕷️ PRODUCTION-GRADE CREDIT CARD SCRAPER
 * 
 * Based on real analysis of BankBazaar structure
 * Scrapes bank-specific landing pages for comprehensive data
 * 
 * Architecture:
 * 1. Visit bank-specific pages (hdfc-bank-credit-card.html, etc.)
 * 2. Extract from "Top X Credit Cards" table
 * 3.Extract detailed features from h3/h4 sections
 * 4. Combine data from multiple sources for validation
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

// Bank-specific pages on BankBazaar  
const BANK_PAGES = [
  { bank: 'HDFC Bank', url: 'https://www.bankbazaar.com/hdfc-bank-credit-card.html' },
  // DEBUG: Test with one bank first
  // { bank: 'SBI Card', url: 'https://www.bankbazaar.com/sbi-credit-card.html' },
  // { bank: 'ICICI Bank', url: 'https://www.bankbazaar.com/icici-bank-credit-card.html' },
  // { bank: 'Axis Bank', url: 'https://www.bankbazaar.com/axis-bank-credit-card.html' },
  // { bank: 'Kotak Bank', url: 'https://www.bankbazaar.com/kotak-mahindra-bank-credit-card.html' },
  // { bank: 'IndusInd Bank', url: 'https://www.bankbazaar.com/indusind-bank-credit-card.html' },
];

/**
 * Scrape a single bank page from BankBazaar
 */
async function scrapeBankPage(page: Page, bankInfo: typeof BANK_PAGES[0]): Promise<CreditCard[]> {
  console.log(`\n🏦 Scraping ${bankInfo.bank}...`);
  const cards: CreditCard[] = [];
  
  try {
    await page.goto(bankInfo.url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    console.log('  📄 Page loaded, waiting for content...');
    await page.waitForTimeout(3000);
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // DEBUG: Log what we're seeing
    console.log(`  DEBUG: Page title: ${$('title').text()}`);
    console.log(`  DEBUG: Number of tables: ${$('table').length}`);
    console.log(`  DEBUG: Number of h3: ${$('h3').length}`);
    console.log(`  DEBUG: Number of h4: ${$('h4').length}`);
    
    // Strategy 1: Extract from "Top X Credit Cards" table
    const tableCards = extractFromTable($, bankInfo.bank);
    cards.push(...tableCards);
    
    // Strategy 2: Extract from h3/h4 card sections
    const sectionCards = extractFromSections($, bankInfo.bank, bankInfo.url);
    cards.push(...sectionCards);
    
    // Merge and deduplicate
    const uniqueCards = deduplicateCards([...tableCards, ...sectionCards]);
    
    console.log(`  ✅ Extracted ${uniqueCards.length} cards (${tableCards.length} from tables, ${sectionCards.length} from sections)`);
    return uniqueCards;
    
  } catch (error: any) {
    console.log(`  ❌ Error: ${error.message}`);
    return [];
  }
}

/**
 * Extract from "Top X Credit Cards" summary table
 */
function extractFromTable($: cheerio.CheerioAPI, issuer: string): CreditCard[] {
  const cards: CreditCard[] = [];
  
  // Look for tables with card data
  $('table').each((_, table) => {
    const $table = $(table);
    
    // Check if this looks like a credit card table
    const headers = $table.find('th').map((_, th) => $(th).text().toLowerCase()).get();
    if (headers.some(h => h.includes('card') || h.includes('fee') || h.includes('category'))) {
      
      $table.find('tr').each((idx, row) => {
        if (idx === 0) return; // Skip header
        
        const $row = $(row);
        const cells = $row.find('td');
        
        if (cells.length >= 2) {
          const cardName = $(cells[0]).text().trim();
          const fee = $(cells[1]).text().trim();
          const category = cells.length > 2 ? $(cells[2]).text().trim() : '';
          
          if (cardName && !cardName.toLowerCase().includes('credit card') && cardName.length > 3) {
            cards.push({
              name: cardName,
              issuer,
              card_type: category || categorizeCard(cardName),
              annual_fee: extractFee(fee),
              features: [],
              source: 'BankBazaar',
              source_url: 'extracted-from-table'
            });
          }
        }
      });
    }
  });
  
  return cards;
}

/**
 * Extract from h3/h4 card detail sections
 */
function extractFromSections($: cheerio.CheerioAPI, issuer: string, url: string): CreditCard[] {
  const cards: CreditCard[] = [];
  
  // Find all h3 or h4 elements that likely contain card names
  $('h3, h4').each((_, heading) => {
    const cardName = $(heading).text().trim();
    
    // Filter out non-card headings
    if (cardName && 
        !cardName.toLowerCase().includes('credit card') &&
        !cardName.toLowerCase().includes('frequently') &&
        !cardName.toLowerCase().includes('how to') &&
        cardName.length > 3 &&
        cardName.length < 100) {
      
      // Look for features list after this heading
      const features: string[] = [];
      let nextElement = $(heading).next();
      let attempts = 0;
      
      while (attempts < 5 && nextElement.length) {
        if (nextElement.is('ul')) {
          nextElement.find('li').each((_, li) => {
            const feature = $(li).text().trim();
            if (feature.length > 5 && feature.length < 200) {
              features.push(feature);
            }
          });
          break;
        }
        nextElement = nextElement.next();
        attempts++;
      }
      
      // Look for fee information in surrounding paragraphs
      let fee = 0;
      $(heading).nextAll('p').slice(0, 3).each((_, p) => {
        const text = $(p).text();
        if (text.toLowerCase().includes('fee') || text.toLowerCase().includes('₹')) {
          fee = extractFee(text);
        }
      });
      
      if (features.length > 0 || fee > 0) {
        cards.push({
          name: cardName,
          issuer,
          card_type: categorizeCard(cardName),
          annual_fee: fee,
          features: features.slice(0, 5),
          source: 'BankBazaar',
          source_url: url
        });
      }
    }
  });
  
  return cards;
}

/**
 * Helper: Categorize card type
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
  
  return 'Standard';
}

/**
 * Helper: Extract fee from text
 */
function extractFee(text: string): number {
  // Look for ₹ symbol followed by numbers
  const match = text.match(/₹\s*(\d[\d,]*)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''));
  }
  
  // Look for "Rs" or "INR"
  const rsMatch = text.match(/(?:Rs\.?|INR)\s*(\d[\d,]*)/i);
  if (rsMatch) {
    return parseInt(rsMatch[1].replace(/,/g, ''));
  }
  
  // Look for any number near "fee"
  if (text.toLowerCase().includes('fee')) {
    const numbers = text.match(/\d[\d,]*/g);
    if (numbers) {
      return parseInt(numbers[0].replace(/,/g, ''));
    }
  }
  
  return 0;
}

/**
 * Helper: Remove duplicate cards
 */
function deduplicateCards(cards: CreditCard[]): CreditCard[] {
  const seen = new Set<string>();
  const unique: CreditCard[] = [];
  
  for (const card of cards) {
    const key = card.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(card);
    }
  }
  
  return unique;
}

/**
 * Main scraper
 */
async function main() {
  console.log('\n🕷️  PRODUCTION CREDIT CARD SCRAPER');
  console.log('═'.repeat(70));
  console.log('Target: BankBazaar bank-specific pages');
  console.log(`Banks: ${BANK_PAGES.length}`);
  console.log('═'.repeat(70));
  console.log('\nLaunching browser...\n');
  
  const browser = await chromium.launch({
    headless: false, // DEBUG MODE - See the browser
    slowMo: 1000, // Slow down to see what's happening
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Set realistic headers
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  });
  
  let allCards: CreditCard[] = [];
  
  try {
    for (const bankInfo of BANK_PAGES) {
      const bankCards = await scrapeBankPage(page, bankInfo);
      allCards = allCards.concat(bankCards);
      
      // Rate limiting - be respectful
      await page.waitForTimeout(2000);
    }
  } finally {
    await browser.close();
  }
  
  // Final deduplication across all banks
  const uniqueCards = deduplicateCards(allCards);
  
  console.log('\n' + '═'.repeat(70));
  console.log(`📦 Total Cards Scraped: ${uniqueCards.length}`);
  console.log('═'.repeat(70));
  
  if (uniqueCards.length > 0) {
    console.log('\n📋 Sample Cards:');
    uniqueCards.slice(0, 10).forEach((card, idx) => {
      console.log(`\n  ${idx + 1}. ${card.name}`);
      console.log(`     Issuer: ${card.issuer}`);
      console.log(`     Type: ${card.card_type}`);
      console.log(`     Fee: ₹${card.annual_fee || 'Check bank'}`);
      if (card.features && card.features.length > 0) {
        console. log(`     Features: ${card.features.length} listed`);
      }
    });
    
    // Save to database
    console.log('\n💾 Saving to database...');
    console.log('─'.repeat(70));
    
    const supabase = createServiceClient();
    let success = 0;
    let failed = 0;
    let duplicates = 0;
    
    for (const card of uniqueCards) {
      const cardData = {
        ...card,
        slug: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase.from('credit_cards').insert(cardData);
      
      if (error) {
        if (error.message.includes('duplicate')) {
          console.log(`  ⚠️  ${card.name}: Already exists`);
          duplicates++;
        } else {
          console.log(`  ❌ ${card.name}: ${error.message}`);
          failed++;
        }
      } else {
        console.log(`  ✅ ${card.name}`);
        success++;
      }
    }
    
    console.log('\n' + '═'.repeat(70));
    console.log('📊 SCRAPING COMPLETE');
    console.log('═'.repeat(70));
    console.log(`✅ Saved: ${success}`);
    console.log(`⚠️  Duplicates: ${duplicates}`);
    console.log(`❌ Failed: ${failed}`);
    console.log('═'.repeat(70));
    
    console.log('\n🎯 Next Step: Generate descriptions with quality gates');
    console.log('   Run: npx tsx scripts/generate-cards-with-quality.ts 50\n');
    
  } else {
    console.log('\n⚠️  No cards scraped. Check selectors and try again.\n');
  }
}

main().catch(console.error);
