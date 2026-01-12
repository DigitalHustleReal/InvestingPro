import { chromium } from 'playwright';
import { ReviewModerator, RawReview } from '../lib/moderation/review-moderator';

export async function scrapeMouthShutReviews(productName: string, limit: number = 10): Promise<RawReview[]> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Set a longer default timeout
  page.setDefaultTimeout(60000);

  try {
    console.log(`🔍 Searching MouthShut for: ${productName}`);
    const searchUrl = `https://www.mouthshut.com/search/prodsrch.aspx?data=${encodeURIComponent(productName)}`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 1. Find the first product link
    // MouthShut uses IDs like productRepeater_ctl00_hypProduct
    const firstProductLink = await page.getAttribute('a[id*="hypProduct"], a[id*="linkreadall"], .search-results .product-title a, .search-prods a', 'href');
    
    if (!firstProductLink) {
      console.error(`❌ No product found for ${productName}. Check if search returned results.`);
      // Optional: Save screenshot for debugging
      await page.screenshot({ path: `debug-search-${productName.replace(/\s+/g, '-')}.png` });
      return [];
    }

    const productUrl = firstProductLink.startsWith('http') ? firstProductLink : `https://www.mouthshut.com${firstProductLink}`;
    console.log(`📄 Navigating directly to: ${productUrl}`);
    
    // Use a more resilient navigation
    await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
    
    // Wait for the specific review container that subagent identified
    try {
      await page.waitForSelector('a[id*="lnkTitle"]', { timeout: 15000 });
    } catch (e) {
      console.log('   ⚠️ Timeout waiting for titles, but continuing...');
    }
    
    // 3. Extract reviews using browser context
    const reviews = await page.evaluate((limit) => {
      const results: any[] = [];
      // The HTML dump confirms reviews are in 'div.row.review-article'
      const reviewCards = document.querySelectorAll('div.row.review-article');
      
      console.log(`Found ${reviewCards.length} review cards via selector 'div.row.review-article'`);

      reviewCards.forEach((card: any) => {
        if (results.length >= limit) return;

        // Extract Title
        // Structure: <strong><a id="rptreviews_ctl..._lnkTitle">Title</a></strong>
        const titleElem = card.querySelector('a[id*="lnkTitle"]');
        
        // Extract Content
        // Structure: <div class="more reviewdata"><p>...</p></div>
        const contentElem = card.querySelector('.more.reviewdata');
        
        // Extract User
        // Structure: <div class="user-ms-name"><a ...>username</a>
        const userElem = card.querySelector('.user-ms-name a');
        
        // Extract Rating
        // Structure: <div class="rating"><span><i class="icon-rating rated-star"></i>...</span></div>
        const ratingStars = card.querySelectorAll('.rating .rated-star');
        const rating = ratingStars.length > 0 ? ratingStars.length : 0; 
        
        // Extract Date
        const dateElem = card.querySelector('span[id*="lblDateTime"]');

        if (titleElem && contentElem) {
            results.push({
                userName: userElem ? userElem.innerText.trim() : 'Anonymous',
                rating: rating,
                title: titleElem.innerText.trim(),
                content: contentElem.innerText.trim(),
                date: dateElem ? dateElem.innerText.trim() : new Date().toISOString()
            });
        }
      });
      return results;
    }, limit);


    console.log(`✅ Extracted ${reviews.length} reviews for: ${productName}`);
    return reviews;

  } catch (error) {
    console.error(`❌ Scraping failed:`, error);
    return [];
  } finally {
    await browser.close();
  }
}

// Main execution if run directly
if (require.main === module) {
  const query = process.argv[2] || 'HDFC Regalia Credit Card';
  scrapeMouthShutReviews(query).then(async (reviews) => {
    console.log('--- RAW REVIEWS ---');
    console.log(reviews);

    if (reviews.length > 0) {
      console.log('\n--- MODERATING FIRST REVIEW ---');
      const moderated = await ReviewModerator.moderate(reviews[0]);
      console.log(moderated);
    }
  });
}
