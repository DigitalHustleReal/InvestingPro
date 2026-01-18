import { MutualFundScraper } from '../lib/scrapers/MutualFundScraper';

async function main() {
  console.log('🧪 Testing Mutual Fund Scraper...');
  
  const scraper = new MutualFundScraper();
  
  // Override save method for testing to just log
  scraper.save = async (data) => {
    console.log(`💾 [TEST MODE] Would save ${data.length} records to DB`);
    console.log('📝 Sample Data (First 5):');
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
  };

  await scraper.run();
}

main().catch(console.error);
