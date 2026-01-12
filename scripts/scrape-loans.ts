
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import slugify from 'slugify';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function scrapeLoans() {
  console.log('🚀 Starting Loans Scraper (Paisabazaar)...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    const url = 'https://www.paisabazaar.com/personal-loan/interest-rates/';
    console.log(`🌐 Navigating to ${url}...`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for the table to appear. The chunk showed "Swipe to see more table data", usually implies a responsive table.
    // We'll look for standard table tags.
    await page.waitForSelector('table');
    
    // Extract data
    const loans = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      // Skip header
      return rows.slice(1).map(row => {
        const cols = row.querySelectorAll('td');
        if (cols.length < 2) return null;
        
        const bankName = cols[0]?.textContent?.trim() || '';
        const rateText = cols[1]?.textContent?.trim() || '';
        const feeText = cols[2]?.textContent?.trim() || '';
        
        if (!bankName) return null;

        // Parse Interest Rate (e.g., "10.49% onwards" or "10.49% - 14%")
        // We want the min rate.
        const rateMatch = rateText.match(/(\d+\.?\d*)/);
        const minRate = rateMatch ? parseFloat(rateMatch[0]) : null;

        return {
          bankName,
          rateText,
          feeText,
          minRate
        };
      }).filter(item => item !== null && item.minRate !== null); // Filter valid rows
    });

    console.log(`📦 Found ${loans.length} loan entries.`);

    // Upsert to Database
    let successCount = 0;
    
    for (const loan of loans) {
      if (!loan) continue;

      const slug = slugify(`${loan.bankName}-personal-loan`, { lower: true, strict: true });
      
      const payload = {
        slug: slug,
        name: `${loan.bankName} Personal Loan`,
        bank_name: loan.bankName,
        type: 'Personal',
        interest_rate_min: loan.minRate,
        processing_fee: loan.feeText,
        features: {
           source: 'Paisabazaar',
           raw_rate: loan.rateText
        },
        min_tenure: 12, // Default
        max_tenure: 60  // Default
      };

      const { error } = await supabase
        .from('loans')
        .upsert(payload, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Error upserting ${loan.bankName}:`, error.message);
      } else {
        console.log(`✅ Upserted: ${loan.bankName} (@ ${loan.minRate}%)`);
        successCount++;
      }
    }

    console.log(`\n🎉 Scrape Complete! Successfully imported ${successCount} loans.`);

  } catch (error) {
    console.error('❌ Scraper Failed:', error);
  } finally {
    await browser.close();
  }
}

scrapeLoans();
