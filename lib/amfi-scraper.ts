/**
 * AMFI (Association of Mutual Funds in India) Data Scraper
 * Official source for mutual fund NAV data
 */

import { fetchText } from './api/external-client';
import { z } from 'zod';

// Schema for AMFI fund data
const AMFIFundSchema = z.object({
  schemeCode: z.string(),
  isinDivPayout: z.string().optional(),
  isinDivReinvest: z.string().optional(),
  schemeName: z.string(),
  nav: z.number(),
  date: z.string()
});

type AMFIFund = z.infer<typeof AMFIFundSchema>;

export async function getAllMutualFunds(): Promise<AMFIFund[]> {
  try {
    const url = 'https://www.amfiindia.com/spages/NAVAll.txt';
    // Use resilient fetch with 3 retries and 30s timeout (large file)
    const data = await fetchText(url, {
        circuitBreakerKey: 'amfi-api',
        timeout: 30000, 
        retries: 3,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });
    
    const lines = data.split('\n');
    const funds: AMFIFund[] = [];
    
    for (const line of lines) {
      if (!line.trim() || line.startsWith('Scheme Code')) continue;
      
      const parts = line.split(';');
      if (parts.length < 6) continue;
      
      try {
        const fund = {
          schemeCode: parts[0]?.trim() || '',
          isinDivPayout: parts[1]?.trim(),
          isinDivReinvest: parts[2]?.trim(),
          schemeName: parts[3]?.trim() || '',
          nav: parseFloat(parts[4]?.trim() || '0'),
          date: parts[5]?.trim() || ''
        };
        
        // Validate with Zod
        const validatedFund = AMFIFundSchema.parse(fund);
        funds.push(validatedFund);
      } catch (error) {
        // Skip invalid entries
        continue;
      }
    }
    
    return funds;
  } catch (error: any) {
    throw new Error(`Failed to fetch AMFI data: ${error.message}`);
  }
}

/**
 * Search for mutual funds by name
 */
export async function searchMutualFunds(query: string): Promise<AMFIFund[]> {
  const allFunds = await getAllMutualFunds();
  const lowerQuery = query.toLowerCase();
  
  return allFunds.filter(fund => 
    fund.schemeName.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get specific fund by scheme code
 */
export async function getFundByCode(schemeCode: string): Promise<AMFIFund | null> {
  const allFunds = await getAllMutualFunds();
  return allFunds.find(fund => fund.schemeCode === schemeCode) || null;
}

/**
 * Get funds by fund house
 */
export async function getFundsByHouse(fundHouse: string): Promise<AMFIFund[]> {
  const allFunds = await getAllMutualFunds();
  const lowerHouse = fundHouse.toLowerCase();
  
  return allFunds.filter(fund => 
    fund.schemeName.toLowerCase().includes(lowerHouse)
  );
}

/**
 * Get top performing funds (by NAV - simplified)
 */
export async function getTopFunds(limit: number = 10): Promise<AMFIFund[]> {
  const allFunds = await getAllMutualFunds();
  
  return allFunds
    .sort((a, b) => b.nav - a.nav)
    .slice(0, limit);
}

/**
 * Get funds by category
 */
export async function getFundsByCategory(category: string): Promise<AMFIFund[]> {
  const allFunds = await getAllMutualFunds();
  const lowerCategory = category.toLowerCase();
  
  return allFunds.filter(fund => 
    fund.schemeName.toLowerCase().includes(lowerCategory)
  );
}

/**
 * Get ELSS funds (Tax saving)
 */
export async function getELSSFunds(): Promise<AMFIFund[]> {
  return getFundsByCategory('elss');
}

/**
 * Get Index funds
 */
export async function getIndexFunds(): Promise<AMFIFund[]> {
  return getFundsByCategory('index');
}

/**
 * Get Debt funds
 */
export async function getDebtFunds(): Promise<AMFIFund[]> {
  const allFunds = await getAllMutualFunds();
  
  return allFunds.filter(fund => {
    const name = fund.schemeName.toLowerCase();
    return name.includes('debt') || 
           name.includes('bond') || 
           name.includes('income') ||
           name.includes('liquid');
  });
}

/**
 * Get Equity funds
 */
export async function getEquityFunds(): Promise<AMFIFund[]> {
  const allFunds = await getAllMutualFunds();
  
  return allFunds.filter(fund => {
    const name = fund.schemeName.toLowerCase();
    return name.includes('equity') || 
           name.includes('growth') ||
           name.includes('large cap') ||
           name.includes('mid cap') ||
           name.includes('small cap');
  });
}

/**
 * Example usage
 */
export async function exampleUsage() {
  // Get all funds
  const allFunds = await getAllMutualFunds();
  console.log(`Total funds: ${allFunds.length}`);
  
  // Search for SBI funds
  const sbiFunds = await searchMutualFunds('SBI');
  console.log(`SBI funds: ${sbiFunds.length}`);
  
  // Get ELSS funds
  const elssFunds = await getELSSFunds();
  console.log(`ELSS funds: ${elssFunds.length}`);
  
  // Get specific fund
  const fund = await getFundByCode('119551');
  console.log('Specific fund:', fund);
  
  // Get top funds
  const topFunds = await getTopFunds(5);
  console.log('Top 5 funds by NAV:', topFunds);
}

export default {
  getAllMutualFunds,
  searchMutualFunds,
  getFundByCode,
  getFundsByHouse,
  getTopFunds,
  getFundsByCategory,
  getELSSFunds,
  getIndexFunds,
  getDebtFunds,
  getEquityFunds
};
