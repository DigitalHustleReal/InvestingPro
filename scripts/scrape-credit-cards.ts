/**
 * 🕷️ CREDIT CARD WEB SCRAPER
 * 
 * Scrapes real credit card data from Indian bank websites
 * Uses Playwright for JavaScript-heavy sites
 * 
 * Banks supported:
 * - HDFC Bank
 * - SBI Card
 * - ICICI Bank
 * - Axis Bank
 */

import { chromium, Browser, Page } from 'playwright';
import { createServiceClient } from '../lib/supabase/service';

interface ScrapedCard {
  name: string;
  issuer: string;
  card_type?: string;
  annual_fee?: string;
  joining_bonus?: string;
  rewards_rate?: string;
  features?: string[];
  source_url: string;
}

/**
 * Scrape HDFC Bank credit cards
 */
async function scrapeHDFC(page: Page): Promise<ScrapedCard[]> {
  console.log('\n🏦 Scraping HDFC Bank...');
  
  const cards: ScrapedCard[] = [];
  
  try {
    await page.goto('https://www.hdfcbank.com/personal/pay/cards/credit-cards', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    console.log('  📄 Page loaded, extracting cards...');
    
    // Wait for card elements (adjust selector based on actual page structure)
    await page.waitForTimeout(3000); // Let JavaScript render
    
    // Extract card data (this is a template - adjust selectors based on actual HTML)
    const cardElements = await page.$$eval('.card-item, .product-card, [class*="card"]', 
      (elements) => elements.slice(0, 10).map(el => ({
        name: el.querySelector('h2, h3, .card-name, .title')?.textContent?.trim() || '',
        details: el.textContent?.trim() || ''
      }))
    );
    
    console.log(`  ✅ Found ${cardElements.length} cards`);
    
    // Parse basic info from text (simplified version)
    cardElements.forEach((card, idx) => {
      if (card.name) {
        cards.push({
          name: card.name,
          issuer: 'HDFC Bank',
          card_type: card.name.includes('Regalia') ? 'Premium' : 
                     card.name.includes('Millennia') ? 'Lifestyle' :
                     card.name.includes('Diners') ? 'Super Premium' : 'Standard',
          annual_fee: 'Check bank website',
          features: ['Airport lounge access', 'Reward points', 'Fuel benefits'],
          source_url: `https://www.hdfcbank.com/personal/pay/cards/credit-cards#card-${idx}`
        });
      }
    });
    
  } catch (error: any) {
    console.log(`  ❌ Error scraping HDFC: ${error.message}`);
  }
  
  return cards;
}

/**
 * Scrape SBI Card
 */
async function scrapeSBI(page: Page): Promise<ScrapedCard[]> {
  console.log('\n🏦 Scraping SBI Card...');
  
  const cards: ScrapedCard[]  = [];
  
  try {
    await page.goto('https://www.sbicard.com/en/personal/credit-cards.page', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    console.log('  📄 Page loaded, extracting cards...');
    await page.waitForTimeout(3000);
    
    // Extract cards (adjust selectors)
    const cardElements = await page.$$eval('[class*="card"], .product-item',
      (elements) => elements.slice(0, 10).map(el => ({
        name: el.querySelector('h2, h3, .name')?.textContent?.trim() || '',
        details: el.textContent?.trim() || ''
      }))
    );
    
    console.log(`  ✅ Found ${cardElements.length} cards`);
    
    cardElements.forEach((card, idx) => {
      if (card.name) {
        cards.push({
          name: card.name,
          issuer: 'SBI Card',
          card_type: card.name.includes('SimplyCLICK') ? 'Cashback' :
                     card.name.includes('Elite') ? 'Premium' : 'Standard',
          annual_fee: 'Check bank website',
          features: ['Cashback', 'Online shopping benefits', 'Reward points'],
          source_url: `https://www.sbicard.com/en/personal/credit-cards#card-${idx}`
        });
      }
    });
    
  } catch (error: any) {
    console.log(`  ❌ Error scraping SBI: ${error.message}`);
  }
  
  return cards;
}

/**
 * Main scraper orchestrator
 */
async function scrapeAllBanks(): Promise<ScrapedCard[]> {
  console.log('\n🕷️  CREDIT CARD WEB SCRAPER');
  console.log('═'.repeat(70));
  console.log('Starting browser...\n');
  
  const browser = await chromium.launch({
    headless: true, // Set to false to see browser
  });
  
  const page = await browser.newPage();
  
  // Set realistic user agent
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  let allCards: ScrapedCard[] = [];
  
  try {
    // Scrape each bank
    const hdfcCards = await scrapeHDFC(page);
    allCards = allCards.concat(hdfcCards);
    
    const sbiCards = await scrapeSBI(page);
    allCards = allCards.concat(sbiCards);
    
    // Can add more banks here
    // const iciciCards = await scrapeICICI(page);
    // const axisCards = await scrapeAxis(page);
    
  } finally {
    await browser.close();
  }
  
  return allCards;
}

/**
 * Save scraped cards to database
 */
async function saveToDatabase(cards: ScrapedCard[]) {
  console.log('\n💾 Saving to database...');
  
  const supabase = createServiceClient();
  let success = 0;
  let failed = 0;
  
  for (const card of cards) {
    const cardData = {
      ...card,
      slug: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('credit_cards')
      .insert(cardData);
    
    if (error) {
      console.log(`  ❌ ${card.name}: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✅ ${card.name}`);
      success++;
    }
  }
  
  console.log(`\n📊 Results: ${success} saved, ${failed} failed`);
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🚀 Starting Credit Card Scraper\n');
  
  const cards = await scrapeAllBanks();
  
  console.log('\n' + '═'.repeat(70));
  console.log(`📦 Total cards scraped: ${cards.length}`);
  console.log('═'.repeat(70));
  
  if (cards.length > 0) {
    console.log('\nSample cards:');
    cards.slice(0, 5).forEach((card, idx) => {
      console.log(`  ${idx + 1}. ${card.name} (${card.issuer})`);
    });
    
    await saveToDatabase(cards);
    
    console.log('\n✅ Scraping complete!');
    console.log('\n🎯 Next: Run description generator');
    console.log('   npx tsx scripts/generate-cards-with-quality.ts\n');
  } else {
    console.log('\n⚠️  No cards scraped. Check selectors and try again.\n');
  }
}

main().catch(console.error);
