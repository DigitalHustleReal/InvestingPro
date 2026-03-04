import { BaseScraper } from './BaseScraper';
import { logger } from '@/lib/logger';
import axios from 'axios';
import { z } from 'zod';

// Schema for Mutual Fund Data
const MutualFundSchema = z.object({
  scheme_code: z.string(),
  isin: z.string().optional(),
  name: z.string(),
  nav: z.number(),
  date: z.string(), // YYYY-MM-DD
  category: z.string().optional(),
  fund_house: z.string().optional(),
});

type MutualFundData = z.infer<typeof MutualFundSchema>;

export class MutualFundScraper extends BaseScraper<MutualFundData> {
  name = 'mutual-fund-scraper';
  schedule = '0 19 * * *'; // Daily at 7 PM
  sourceName = 'AMFI India';
  sourceUrl = 'https://www.amfiindia.com/spages/NAVAll.txt';
  
  schema = MutualFundSchema;

  async scrape(): Promise<MutualFundData[]> {
    logger.info(`📡 Fetching NAV data from ${this.sourceUrl}...`);
    
    const response = await axios.get(this.sourceUrl);
    const rawText = response.data;
    
    return this.parseAMFIData(rawText);
  }

  private parseAMFIData(text: string): MutualFundData[] {
    const lines = text.split('\n');
    const funds: MutualFundData[] = [];
    
    // Headers: Scheme Code;ISIN Div Payout/ISIN Growth;ISIN Div Reinvestment;Scheme Name;Net Asset Value;Date
    // Skip header lines
    let isData = false;
    let currentCategory = 'Unknown';
    let currentFundHouse = 'Unknown';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Detect Categories & Fund Houses (usually defined in lines without semicolons)
      if (!trimmed.includes(';')) {
        // This logic can be improved as AMFI structure is unique
        // For now, we treat non-data lines as potential categories logic placeholder
        continue;
      }

      const parts = trimmed.split(';');
      if (parts.length < 6) continue;

      const [schemeCode, isin1, isin2, schemeName, navStr, dateStr] = parts;

      // Skip header line
      if (schemeCode === 'Scheme Code') continue;

      const nav = parseFloat(navStr);
      if (isNaN(nav)) continue;

      // Convert date from DD-MMM-YYYY to YYYY-MM-DD
      const date = this.parseDate(dateStr);

      // Guess Fund House from Name (Simple heuristic)
      const fundHouseMatch = schemeName.split(' ')[0]; // E.g., "HDFC", "SBI"
      
      funds.push({
        scheme_code: schemeCode,
        isin: isin1 || isin2 || undefined,
        name: schemeName,
        nav: nav,
        date: date,
        fund_house: fundHouseMatch,
        category: 'Mutual Fund' // Default, enhancement needed for categorization
      });
    }

    return funds;
  }

  private parseDate(dateStr: string): string {
    // DD-MMM-YYYY -> YYYY-MM-DD
    try {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    } catch (e) {
        return new Date().toISOString().split('T')[0]; // Fallback to today
    }
  }

  /**
   * Save mutual funds to database
   */
  async save(data: MutualFundData[], runId?: string): Promise<void> {
    
    // Batch upsert (Supabase handles batching better than loop)
    // Map data to DB columns
    const records = data.map(fund => ({
        scheme_code: parseInt(fund.scheme_code),
        slug: `${fund.scheme_code}-${this.slugify(fund.name)}`,
        name: fund.name,
        nav: fund.nav,
        fund_house: fund.fund_house || 'Unknown',
        category: 'Mutual Fund', // Simplification, ideally map properly
        updated_at: new Date().toISOString(),
        pipeline_run_id: runId // Link to Truth Console
    }));

    // Process in chunks of 100 to avoid request size limits
    const chunkSize = 100;
    for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);
        
        const { error } = await this.supabase
            .from('mutual_funds')
            .upsert(chunk, {
                onConflict: 'scheme_code'
            });

        if (error) {
            logger.error(`Error saving chunk ${i}-${i+chunkSize}:`, error);
            // Don't throw, just log, so partially successful run continues
            // Or tracked by invalid count
        }
    }
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}
