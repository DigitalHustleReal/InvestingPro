/**
 * AMFI NAV API Client
 *
 * Fetches mutual fund data from AMFI India (Association of Mutual Funds in India).
 * Source: https://portal.amfiindia.com/spages/NAVAll.txt
 *
 * This is a FREE, public API updated daily with NAV data for all Indian mutual funds.
 * No API key required.
 */

const AMFI_NAV_URL = 'https://portal.amfiindia.com/spages/NAVAll.txt';

export interface AMFIFund {
  schemeCode: string;
  isinGrowth: string | null;
  isinDivReinvest: string | null;
  schemeName: string;
  nav: number;
  navDate: string;
  fundHouse: string;
  category: string;
  // Derived fields
  planType: 'Direct' | 'Regular';
  optionType: 'Growth' | 'IDCW' | 'Bonus' | 'Other';
}

export interface ParsedAMFIData {
  funds: AMFIFund[];
  fundHouses: string[];
  categories: string[];
  lastUpdated: string;
}

/**
 * Fetch and parse ALL mutual fund NAV data from AMFI
 */
export async function fetchAMFIData(): Promise<ParsedAMFIData> {
  const response = await fetch(AMFI_NAV_URL, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!response.ok) {
    throw new Error(`AMFI API error: ${response.status}`);
  }

  const text = await response.text();
  return parseAMFIText(text);
}

/**
 * Parse the AMFI semicolon-delimited text format
 *
 * Format:
 *   Line 1: Header (Scheme Code;ISIN...;Scheme Name;NAV;Date)
 *   Blank line
 *   Category header (e.g., "Open Ended Schemes(Equity Scheme - Large Cap Fund)")
 *   Blank line
 *   Fund house name (e.g., "Aditya Birla Sun Life Mutual Fund")
 *   Blank line
 *   Data rows: SchemeCode;ISIN1;ISIN2;SchemeName;NAV;Date
 */
export function parseAMFIText(text: string): ParsedAMFIData {
  const lines = text.split('\n');
  const funds: AMFIFund[] = [];
  const fundHousesSet = new Set<string>();
  const categoriesSet = new Set<string>();

  let currentCategory = '';
  let currentFundHouse = '';
  let lastUpdated = '';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Category header line (contains parentheses)
    if (line.includes('(') && line.includes(')') && !line.includes(';')) {
      currentCategory = line;
      categoriesSet.add(currentCategory);
      continue;
    }

    // Fund house line (no semicolons, not a category)
    if (!line.includes(';') && !line.includes('(')) {
      currentFundHouse = line;
      fundHousesSet.add(currentFundHouse);
      continue;
    }

    // Data row
    const parts = line.split(';');
    if (parts.length < 5) continue;

    const [schemeCode, isin1, isin2, schemeName, navStr, dateStr] = parts;

    // Skip if NAV is not a number
    const nav = parseFloat(navStr);
    if (isNaN(nav)) continue;

    // Determine plan type
    const nameUpper = schemeName.toUpperCase();
    const planType: 'Direct' | 'Regular' =
      nameUpper.includes('DIRECT') ? 'Direct' : 'Regular';

    // Determine option type
    let optionType: 'Growth' | 'IDCW' | 'Bonus' | 'Other' = 'Other';
    if (nameUpper.includes('GROWTH')) optionType = 'Growth';
    else if (nameUpper.includes('IDCW') || nameUpper.includes('DIVIDEND')) optionType = 'IDCW';
    else if (nameUpper.includes('BONUS')) optionType = 'Bonus';

    if (dateStr) lastUpdated = dateStr.trim();

    funds.push({
      schemeCode: schemeCode.trim(),
      isinGrowth: isin1?.trim() || null,
      isinDivReinvest: isin2?.trim() || null,
      schemeName: schemeName.trim(),
      nav,
      navDate: dateStr?.trim() || '',
      fundHouse: currentFundHouse,
      category: currentCategory,
      planType,
      optionType,
    });
  }

  return {
    funds,
    fundHouses: Array.from(fundHousesSet),
    categories: Array.from(categoriesSet),
    lastUpdated,
  };
}

/**
 * Filter to only Direct Growth plans (most relevant for comparison)
 */
export function filterDirectGrowthPlans(data: ParsedAMFIData): AMFIFund[] {
  return data.funds.filter(
    (f) => f.planType === 'Direct' && f.optionType === 'Growth'
  );
}

/**
 * Categorize AMFI category string into simplified categories
 */
export function simplifyCategory(amfiCategory: string): string {
  const cat = amfiCategory.toLowerCase();

  if (cat.includes('large cap')) return 'Equity - Large Cap';
  if (cat.includes('large & mid cap')) return 'Equity - Large & Mid Cap';
  if (cat.includes('mid cap')) return 'Equity - Mid Cap';
  if (cat.includes('small cap')) return 'Equity - Small Cap';
  if (cat.includes('multi cap')) return 'Equity - Multi Cap';
  if (cat.includes('flexi cap') || cat.includes('flex cap')) return 'Equity - Flexi Cap';
  if (cat.includes('focused')) return 'Equity - Focused';
  if (cat.includes('value') || cat.includes('contra')) return 'Equity - Value/Contra';
  if (cat.includes('elss') || cat.includes('tax')) return 'Equity - ELSS (Tax Saving)';
  if (cat.includes('sectoral') || cat.includes('thematic')) return 'Equity - Sectoral/Thematic';
  if (cat.includes('index') && cat.includes('equity')) return 'Equity - Index';
  if (cat.includes('equity') && cat.includes('other')) return 'Equity - Other';

  if (cat.includes('hybrid') && cat.includes('aggressive')) return 'Hybrid - Aggressive';
  if (cat.includes('hybrid') && cat.includes('balanced') && cat.includes('advantage')) return 'Hybrid - Balanced Advantage';
  if (cat.includes('hybrid') && cat.includes('conservative')) return 'Hybrid - Conservative';
  if (cat.includes('hybrid') && cat.includes('equity savings')) return 'Hybrid - Equity Savings';
  if (cat.includes('hybrid') && cat.includes('arbitrage')) return 'Hybrid - Arbitrage';
  if (cat.includes('hybrid')) return 'Hybrid - Other';

  if (cat.includes('liquid')) return 'Debt - Liquid';
  if (cat.includes('overnight')) return 'Debt - Overnight';
  if (cat.includes('ultra short')) return 'Debt - Ultra Short';
  if (cat.includes('short duration') || cat.includes('short term')) return 'Debt - Short Duration';
  if (cat.includes('medium duration') || cat.includes('medium term')) return 'Debt - Medium Duration';
  if (cat.includes('long duration') || cat.includes('long term')) return 'Debt - Long Duration';
  if (cat.includes('corporate bond')) return 'Debt - Corporate Bond';
  if (cat.includes('banking') || cat.includes('psu')) return 'Debt - Banking & PSU';
  if (cat.includes('gilt')) return 'Debt - Gilt';
  if (cat.includes('credit risk')) return 'Debt - Credit Risk';
  if (cat.includes('dynamic bond')) return 'Debt - Dynamic Bond';
  if (cat.includes('money market')) return 'Debt - Money Market';
  if (cat.includes('floater')) return 'Debt - Floater';
  if (cat.includes('debt')) return 'Debt - Other';

  if (cat.includes('solution') || cat.includes('retirement') || cat.includes('children')) return 'Solution Oriented';
  if (cat.includes('fund of fund') || cat.includes('fof')) return 'Fund of Funds';
  if (cat.includes('index') || cat.includes('etf')) return 'Index/ETF';

  return 'Other';
}

/**
 * Map AMFI fund to InvestingPro product format
 */
export function mapAMFIToProduct(fund: AMFIFund) {
  const slug = fund.schemeName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);

  const simpleCat = simplifyCategory(fund.category);
  const isEquity = simpleCat.startsWith('Equity');
  const isDebt = simpleCat.startsWith('Debt');
  const isHybrid = simpleCat.startsWith('Hybrid');

  // Determine risk level
  let riskLevel = 'Moderate';
  if (simpleCat.includes('Small Cap') || simpleCat.includes('Mid Cap') || simpleCat.includes('Sectoral')) riskLevel = 'High';
  else if (simpleCat.includes('Large Cap') || simpleCat.includes('Flexi Cap') || simpleCat.includes('Index')) riskLevel = 'Moderately High';
  else if (simpleCat.includes('ELSS')) riskLevel = 'Moderately High';
  else if (isDebt) riskLevel = simpleCat.includes('Credit Risk') ? 'Moderate' : 'Low to Moderate';
  else if (simpleCat.includes('Liquid') || simpleCat.includes('Overnight')) riskLevel = 'Low';
  else if (isHybrid) riskLevel = simpleCat.includes('Aggressive') ? 'Moderately High' : 'Moderate';

  // Use columns that match the current PostgREST schema cache
  // Store all mutual fund-specific data in the `features` JSONB column
  return {
    slug,
    name: fund.schemeName,
    category: 'mutual_fund',
    provider_name: fund.fundHouse,
    description: `${fund.schemeName} is a ${simpleCat} fund managed by ${fund.fundHouse}. Current NAV: ₹${fund.nav.toFixed(4)} as of ${fund.navDate}.`,
    features: {
      scheme_code: fund.schemeCode,
      isin: fund.isinGrowth || fund.isinDivReinvest,
      fund_house: fund.fundHouse,
      provider_slug: fund.fundHouse
        .toLowerCase()
        .replace(/\s+mutual\s+fund$/i, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-'),
      category: simpleCat,
      sub_category: fund.category,
      short_description: `${simpleCat} fund | NAV: ₹${fund.nav.toFixed(2)}`,
      nav: fund.nav,
      nav_date: fund.navDate,
      risk_level: riskLevel,
      plan_type: fund.planType,
      option_type: fund.optionType,
      aum_crores: null,
      expense_ratio: null,
      returns_1y: null,
      returns_3y: null,
      returns_5y: null,
      benchmark: null,
      fund_manager: null,
      launch_date: null,
      min_sip: 500,
      min_lumpsum: 5000,
      exit_load: null,
      key_features: [
        `Category: ${simpleCat}`,
        `Risk: ${riskLevel}`,
        `NAV: ₹${fund.nav.toFixed(2)}`,
        `Plan: ${fund.planType} ${fund.optionType}`,
      ],
      tags: [
        simpleCat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        riskLevel.toLowerCase().replace(/\s+/g, '-'),
        fund.planType.toLowerCase(),
        isEquity ? 'equity' : isDebt ? 'debt' : 'hybrid',
      ].filter(Boolean),
    },
    pros: isEquity
      ? ['Market-linked growth potential', 'Professional fund management', 'Diversified portfolio']
      : isDebt
      ? ['Lower volatility than equity', 'Regular income potential', 'Capital preservation']
      : ['Balanced risk-return profile', 'Diversification across asset classes', 'Professional management'],
    cons: isEquity
      ? ['Market risk — NAV can decline', 'No guaranteed returns', 'Requires long-term horizon']
      : isDebt
      ? ['Lower returns than equity in long term', 'Interest rate risk', 'Credit risk in some categories']
      : ['Moderate returns compared to pure equity', 'Still has market risk', 'Tax treatment varies'],
    is_active: true,
    best_for: simpleCat,
  };
}
