import { chromium } from 'playwright';
import fs from 'fs';

async function debugScraper() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to MouthShut search...');
    await page.goto('https://www.mouthshut.com/search/prodsrch.aspx?data=HDFC%20Regalia', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    const firstProductLink = await page.getAttribute('a[id*="hypProduct"], a[id*="linkreadall"], .search-results .product-title a, .search-prods a', 'href');
    
    if (firstProductLink) {
        const url = firstProductLink.startsWith('http') ? firstProductLink : `https://www.mouthshut.com${firstProductLink}`;
        console.log(`Navigating to product: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        // Wait a bit for dynamic content
        await page.waitForTimeout(5000);
        
        const content = await page.content();
        fs.writeFileSync('debug_mouthshut_product.html', content);
        console.log('Saved HTML to debug_mouthshut_product.html');
    } else {
        console.log('No product link found. Saving search page HTML...');
        const content = await page.content();
        fs.writeFileSync('debug_mouthshut_search.html', content);
    }
    
  } catch (e) {
      console.error(e);
  } finally {
      await browser.close();
  }
}

debugScraper();
