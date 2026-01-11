/**
 * 🕷️ PRODUCTION CREDIT CARD SCRAPER V2
 * 
 * Handles BankBazaar's questionnaire funnel
 * Strategy: Navigate through the funnel to access card listings
 * 
 * Key Changes from V1:
 * - Navigates through employment type selection
 * - Waits for card listings to load
 * - Uses correct CSS selectors from browser analysis
 * - Extracts features from expandable sections
 */

import { chromium, Browser, Page } from 'playwright';
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

/**
 * Navigate through BankBazaar funnel to get card listings
 */
async function navigateToCardListings(page: Page): Promise<void> {
  console.log('  🚪 Navigating through funnel...');
  
  // Step 1: Go to main credit card page
  await page.goto('https://www.bankbazaar.com/credit-card.html', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  
  await page.waitForTimeout(2000);
  
  // Step 2: Select "Salaried" employment type
  try {
    const salariedButton = page.locator('text=Salaried').first();
    await salariedButton.click({ timeout: 5000 });
    console.log('  ✓ Selected employment type');
    
   await page.waitForTimeout(1000);
    
    // Step 3: Click Continue
    const continueButton = page.locator('button:has-text("Continue")').first();
    await continueButton.click({ timeout: 5000 });
    console.log('  ✓ Clicked continue');
    
    // Step 4: Wait for card listings to appear
    await page.waitForSelector('.shadow-lg.border', { timeout: 10000 });
    console.log('  ✓ Card listings loaded');
    
  } catch (error: any) {
    console.log(`  ⚠️  Funnel navigation issue: ${error.message}`);
    // Continue anyway - might already be past the funnel
  }
}

/**
 * Extract card data from the listings page
 */
async function extractCardsFromPage(page: Page): Promise<CreditCard[]> {
  const cards: CreditCard[] = [];
  
  // Scroll to load lazy-loaded cards
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(1000);
  }
  
  const html = await page.content();
  const $ = cheerio.load(html);
  
  // Find all card containers
  let cardCount = 0;
  
  // Use the selectors identified by the browser subagent
  $('.shadow-lg.border').each((_, element) => {
    try {
      const $card = $(element);
      
      // Extract card name (h4 with font-bold class)
      let cardName = $card.find('h4.font-bold').first().text().trim();
      
      // If not found, try alternative selector
      if (!cardName || cardName.length < 3) {
        cardName = $card.find('h4').filter((_, el) => {
          const text = $(el).text();
          return text.includes('Credit Card') || text.includes('Card');
        }).first().text().trim();
      }
      
      // Skip if no valid card name
      if (!cardName || cardName.length < 3) return;
      
      // Extract "Best for" category
      const bestFor = $card.find('h4').filter((_, el) => {
        const text = $(el).text();
        return text.includes('Perfect For') || text.includes('Best For');
      }).first().text().replace(/Perfect For|Best For/i, '').trim();
      
      // Extract fees
      let annualFee = 0;
      let joiningFee = 0;
      
      $card.find('p').each((_, p) => {
        const text = $(p).text().toLowerCase();
        if (text.includes('1st year fee') || text.includes('annual fee')) {
          const nextP = $(p).next('p');
          const feeText = nextP.text();
          const feeMatch = feeText.match(/₹\s*([\d,]+)/);
          if (feeMatch) {
            annualFee = parseInt(feeMatch[1].replace(/,/g, ''));
          } else if (feeText.toLowerCase().includes('nil') || feeText.toLowerCase().includes('free')) {
            annualFee = 0;
          }
        }
        if (text.includes('joining fee')) {
          const nextP = $(p).next('p');
          const feeText = nextP.text();
          const feeMatch = feeText.match(/₹\s*([\d,]+)/);
          if (feeMatch) {
            joiningFee = parseInt(feeMatch[1].replace(/,/g, ''));
          }
        }
      });
      
      // Extract features (usually in a <details> or expandable section)
      const features: string[] = [];
      $card.find('ul li, ol li').each((_, li) => {
        const feature = $(li).text().trim();
        if (feature.length > 10 && feature.length < 300) {
          features.push(feature);
        }
      });
      
      // Detect issuer from card name
      const issuer = detectIssuer(cardName);
      const cardType = categorizeCard(cardName, bestFor);
      
      if (cardName) {
        cards.push({
          name: cardName,
          issuer,
          card_type: cardType,
          annual_fee: annualFee,
          joining_fee: joiningFee,
          features: features.slice(0, 10), // Top 10 features
          best_for: bestFor,
          source: 'BankBazaar',
          source_url: page.url()
        });
        
        cardCount++;
      }
      
    } catch (err) {
      // Skip problematic cards
      console.log(`  ⚠️  Error parsing card: ${err}`);
    }
  });
  
  console.log(`  📦 Extracted ${cardCount} cards from page`);
  return cards;
}

/**
 * Detect card issuer from name
 */
function detectIssuer(name: string): string {
  const nameUpper = name.toUpperCase();
  
  if (nameUpper.includes('HDFC')) return 'HDFC Bank';
  if (nameUpper.includes('SBI')) return 'SBI Card';
  if (nameUpper.includes('ICICI')) return 'ICICI Bank';
  if (nameUpper.includes('AXIS')) return 'Axis Bank';
  if (nameUpper.includes('KOTAK')) return 'Kotak Mahindra Bank';
  if (nameUpper.includes('INDUSIND')) return 'IndusInd Bank';
  if (nameUpper.includes('AMEX') || nameUpper.includes('AMERICAN EXPRESS')) return 'American Express';
  if (nameUpper.includes('RBL')) return 'RBL Bank';
  if (nameUpper.includes('YES')) return 'Yes Bank';
  if (nameUpper.includes('AU')) return 'AU Small Finance Bank';
  if (nameUpper.includes('IDFC')) return 'IDFC FIRST Bank';
  if (nameUpper.includes('STANDARD CHARTERED') || nameUpper.includes('SC')) return 'Standard Chartered';
  
  return 'Other';
}

/**
 * Categorize card type
 */
function categorizeCard(name: string, bestFor: string = ''): string {
  const combined = (name + ' ' + bestFor).toUpperCase();
  
  if (combined.includes('MAGNUS') || combined.includes('INFINIA') || combined.includes('DINERS BLACK')) {
    return 'Super Premium';
  }
  if (combined.includes('REGALIA') || combined.includes('ELITE') || combined.includes('SIGNATURE') || combined.includes('PLATINUM')) {
    return 'Premium';
  }
  if (combined.includes('CASHBACK') || combined.includes('CASH BACK')) {
    return 'Cashback';
  }
  if (combined.includes('TRAV EL') || combined.includes('MILES') || combined.includes('AIR') || combined.includes('VISTARA')) {
    return 'Travel';
  }
  if (combined.includes('SHOPPING') || combined.includes('AMAZON') || combined.includes('FLIPKART') || combined.includes('RETAIL')) {
    return 'Shopping';
  }
  if (combined.includes('REWARDS') || combined.includes('REWARD')) {
    return 'Rewards';
  }
  if (combined.includes('FUEL') || combined.includes('PETROL')) {
    return 'Fuel';
  }
  if (combined.includes('LIFETIME FREE') || combined.includes('NO ANNUAL FEE')) {
    return 'Lifetime Free';
  }
  
  return 'Standard';
}

/**
 * Main scraper
 */
async function main() {
  console.log('\n🕷️  PRODUCTION CREDIT CARD SCRAPER V2');
  console.log('═'.repeat(70));
  console.log('Strategy: Navigate through BankBazaar funnel');
  console.log('Source: https://www.bankbazaar.com/credit-card.html');
  console.log('═'.repeat(70));
  console.log('\n🌐 Launching browser...\n');
  
  const browser = await chromium.launch({
    headless: false, // DEBUG: Watch the browser
    slowMo: 500, // Slow down for visibility
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Set realistic headers
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-IN,en;q=0.9'
  });
  
  let allCards: CreditCard[] = [];
  
  try {
    // Navigate through funnel
    await navigateToCardListings(page);
    
    // Extract cards from listings
    allCards = await extractCardsFromPage(page);
    
    // Optional: Can try to filter by bank if needed
    // For now, getting all cards shown
    
    console.log('\n' + '═'.repeat(70));
    console.log(`📦 Total Cards Scraped: ${allCards.length}`);
    console.log('═'.repeat(70));
    
    if (allCards.length > 0) {
      console.log('\n📋 Sample Cards:');
      allCards.slice(0, 10).forEach((card, idx) => {
        console.log(`\n  ${idx + 1}. ${card.name}`);
        console.log(`     Issuer: ${card.issuer}`);
        console.log(`     Type: ${card.card_type}`);
        console.log(`     Annual Fee: ₹${card.annual_fee || 0}`);
        if (card.best_for) {
          console.log(`     Best For: ${card.best_for}`);
        }
        if (card.features && card.features.length > 0) {
          console.log(`     Features: ${card.features.length} listed`);
        }
      });
      
      // Save to database
      console.log('\n💾 Saving to database...');
      console.log('─'.repeat(70));
      
      const supabase = createServiceClient();
      let success = 0;
      let failed = 0;
      let duplicates = 0;
      
      for (const card of allCards) {
        const cardData = {
          name: card.name,
          issuer: card.issuer,
          card_type: card.card_type,
          annual_fee: card.annual_fee,
          joining_fee: card.joining_fee,
          features: card.features,
          best_for: card.best_for,
          source: card.source,
          source_url: card.source_url,
          slug: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase.from('credit_cards').upsert(cardData, {
          onConflict: 'slug'
        });
        
        if (error) {
          if (error.message.includes('duplicate')) {
            console.log(`  ⚠️  ${card.name}: Already exists (updated)`);
            duplicates++;
            success++; // Count updates as success
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
      
      console.log('\n🎯 Next Steps:');
      console.log('   1. Review cards in database');
      console.log('   2. Generate AI descriptions: npx tsx scripts/generate-cards-with-quality.ts');
      console.log('   3. Verify card data quality\n');
      
    } else {
      console.log('\n⚠️  No cards scraped. Possible issues:');
      console.log('   - Funnel navigation failed');
      console.log('   - Page structure changed');
      console.log('   - Selectors need updating\n');
    }
    
  } catch (error: any) {
    console.error(`\n❌ Scraper error: ${error.message}`);
  } finally {
    console.log('\n⏳ Keeping browser open for 10 seconds for inspection...\n');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

main().catch(console.error);
