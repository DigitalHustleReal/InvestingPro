/**
 * 🕷️ PRODUCTION CREDIT CARD SCRAPER (FINOLOGY EDITION)
 * 
 * Target: select.finology.in
 * Why: Cleaner data, no lead gen funnel, direct listing
 * 
 * Strategy:
 * 1. Visit bank-specific issuer pages
 * 2. Extract card details (Name, Fees, Features, Ratings)
 * 3. Save to Supabase
 */

import { chromium, Browser, Page } from 'playwright';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';
import * as cheerio from 'cheerio';

interface CreditCard {
  name: string;
  issuer: string;
  card_type?: string;
  annual_fee?: number;
  joining_fee?: number;
  rewards_rate?: string;
  features?: string[];
  best_for?: string;
  rating?: number;
  source: string;
  source_url: string;
  image_url?: string;
}

// Bank mappings to Finology slugs
const BANKS = [
  { name: 'HDFC Bank', slug: 'hdfc-bank' },
  { name: 'SBI Card', slug: 'sbi-card' },
  { name: 'ICICI Bank', slug: 'icici-bank' },
  { name: 'Axis Bank', slug: 'axis-bank' },
  { name: 'Kotak Bank', slug: 'kotak-mahindra-bank' },
  { name: 'IndusInd Bank', slug: 'indusind-bank' },
  { name: 'American Express', slug: 'american-express' },
  { name: 'IDFC FIRST Bank', slug: 'idfc-first-bank' },
  { name: 'AU Bank', slug: 'au-small-finance-bank' }
];

const BASE_URL = 'https://select.finology.in/credit-card-issuer';

async function scrapeBank(page: Page, bank: typeof BANKS[0]): Promise<CreditCard[]> {
  const url = `${BASE_URL}/${bank.slug}`;
  console.log(`\n🏦 Scraping ${bank.name} from ${url}...`);
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for cards to load
    await page.waitForSelector('.cardList, .card-body', { timeout: 10000 });
    
    // Scroll a bit to trigger lazy loading
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(2000);

    const html = await page.content();
    const $ = cheerio.load(html);
    
    const cards: CreditCard[] = [];
    
    // Selectors based on Finology structure
    // Cards seem to be in .col-md-12 containers inside the main list
    console.log(`  DEBUG: found ${$('.cardList').length} .cardList elements`);
    console.log(`  DEBUG: found ${$('.card').length} .card elements`);
    console.log(`  DEBUG: found ${$('.shadow-sm').length} .shadow-sm elements`);
    
    $('.cardList, .card, .shadow-sm').each((_, el) => {
      const $card = $(el);
      
      // Name
      const name = $card.find('h4 a').text().trim() || $card.find('a.text-black').first().text().trim();
      if (!name || name.length < 5) return;
      
      // Fees
      let annualFee = 0;
      let joiningFee = 0;
      
      // Try to find fee by text search in the card
      const text = $card.text();
      
      // Joining Fee
      const joinMatch = text.match(/Joining Fee\s*₹\s*([\d,]+)/i);
      if (joinMatch) {
        joiningFee = parseInt(joinMatch[1].replace(/,/g, ''));
      }
      
      // Annual Fee
      const annualMatch = text.match(/Annual Fee\s*₹\s*([\d,]+)/i) || text.match(/Renewal Fee\s*₹\s*([\d,]+)/i);
      if (annualMatch) {
         annualFee = parseInt(annualMatch[1].replace(/,/g, ''));
      }
      
      // If "Life Time Free" or "Nil"
      if (text.toLowerCase().includes('lifetime free') || text.toLowerCase().includes('joining fee nil')) {
        if (!joiningFee) joiningFee = 0;
        if (!annualFee) annualFee = 0;
      }

      // Features
      const features: string[] = [];
      $card.find('ul li, .badge, .text-secondary span').each((_, f) => {
        const featureText = $(f).text().trim();
        if (featureText.length > 5 && featureText.length < 100 && !featureText.includes('Fee') && !featureText.includes('more')) {
            features.push(featureText);
        }
      });

      // Pros (often listed as checked items)
      const pros: string[] = [];
      $card.find('.fa-check, .bi-check').closest('div, li').each((_, p) => {
          pros.push($(p).text().trim());
      });
      if (pros.length > 0) features.push(...pros);

      // Unique features
      const uniqueFeatures = [...new Set(features)].slice(0, 10);
      
      // Image
      const img = $card.find('img').attr('src');
      const imageUrl = img ? (img.startsWith('http') ? img : `https://select.finology.in${img}`) : undefined;

      // Rating (sometimes available as star count)
      const stars = $card.find('.bi-star-fill, .fa-star').length;
      const rating = stars > 0 ? (stars > 5 ? stars / 20 : stars) : 4.5; // Default to 4.5 if not found

      cards.push({
        name,
        issuer: bank.name,
        card_type: categorizeCard(name),
        annual_fee: annualFee,
        joining_fee: joiningFee,
        features: uniqueFeatures,
        rating,
        source: 'Finology',
        source_url: url,
        image_url: imageUrl
      });
    });

    console.log(`  ✅ Extracted ${cards.length} cards for ${bank.name}`);
    return cards;

  } catch (err: any) {
    console.log(`  ❌ Error scraping ${bank.name}: ${err.message}`);
    return [];
  }
}

function categorizeCard(name: string): string {
  const n = name.toUpperCase();
  if (n.includes('INFINIA') || n.includes('MAGNUS') || n.includes('METAL') || n.includes('PRIVATE')) return 'Super Premium';
  if (n.includes('REGALIA') || n.includes('PRIVILEGE') || n.includes('SELECT') || n.includes('SIGNATURE')) return 'Premium';
  if (n.includes('CASHBACK') || n.includes('Neu') || n.includes('ACE') || n.includes('SWIGGY') || n.includes('AMAZON') || n.includes('FLIPKART')) return 'Shopping & Cashback';
  if (n.includes('MILES') || n.includes('VISTARA') || n.includes('PLATINUM TRAVEL') || n.includes('AIR INDIA')) return 'Travel';
  if (n.includes('IOCL') || n.includes('BPCL') || n.includes('HPCL')) return 'Fuel';
  return 'Standard';
}

async function main() {
  console.log('🚀 Starting Finology Credit Card Scraper...');
  
  const browser = await chromium.launch({
    headless: false, // DEBUG: Visible browser
    slowMo: 1000,
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  
  const supabase = createServiceClient();
  let totalCards = 0;

  const allCards: CreditCard[] = [];

  try {
    for (const bank of BANKS) {
      const cards = await scrapeBank(page, bank);
      allCards.push(...cards);
      
      if (cards.length > 0) {
        // Save to DB immediately to see progress
        for (const card of cards) {
           const slug = card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
           
           // Map card type to allowed values
           let type = 'Rewards';
           const t = (card.card_type || '').toUpperCase();
           if (t.includes('PREMIUM')) type = 'Premium';
           else if (t.includes('TRAVEL')) type = 'Travel';
           else if (t.includes('FUEL')) type = 'Fuel';
           else if (t.includes('SHOPPING')) type = 'Shopping';
           else if (t.includes('CASHBACK') || t.includes('SHOPPING')) type = 'Cashback'; // Map shopping to cashback if needed or keep Shopping if allowed. Schema allows 'Shopping'.

           const { error } = await supabase.from('credit_cards').upsert({
               name: card.name,
               slug,
               bank: card.issuer, // Map issuer -> bank
               type: type, // Map card_type -> type
               annual_fee: card.annual_fee || 0,
               joining_fee: card.joining_fee || 0,
               pros: card.features || [],
               rewards: [],
               rating: card.rating || 4.5,
               image_url: card.image_url,
               // Omitted missing columns: min_income, interest_rate
               source: 'Finology',
               source_url: card.source_url,
               updated_at: new Date().toISOString()
           }, { onConflict: 'slug' });

           if (error) {
              // Try one fallback: maybe annual_fee expects text?
              // console.error(`    ❌ Failed to save ${card.name}: ${error.message}`);
              // Silent fail to keep logs clean, or use debug
              console.log(`    ⚠️ DB Save Failed for ${card.name}: ${error.message}`);
           }
           else console.log(`    💾 Saved: ${card.name}`);
        }
        totalCards += cards.length;
      }
      
      // Be nice to the server
      await page.waitForTimeout(1000);
    }
    
    // Save full backup at the end
    const fs = require('fs');
    fs.writeFileSync('credit_cards_backup.json', JSON.stringify(allCards, null, 2));
    console.log(`\n📦 Full backup saved to credit_cards_backup.json (${allCards.length} cards)`);
    
  } finally {
    await browser.close();
  }
  
  console.log(`\n🎉 Scraping Complete! Total processed: ${totalCards} cards.`);
}

main().catch(console.error);
