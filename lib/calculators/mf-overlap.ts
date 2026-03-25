/**
 * Mutual Fund Overlap Calculator
 * Compares holdings across 2-5 Indian mutual funds and computes overlap %.
 * Holdings data: curated from AMFI disclosures (top 10 holdings per fund).
 */

export interface FundHolding {
  name: string;   // Stock/bond name
  isin?: string;
  weight: number; // % of portfolio (0-100)
}

export interface FundData {
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  subcategory: string;
  holdings: FundHolding[];
}

// ─── Static Holdings Dataset ────────────────────────────────────────────────
// Source: AMFI monthly disclosures (top-10 holdings, approximate weights)
export const FUND_DATABASE: FundData[] = [
  // ── Large Cap ──
  {
    id: "hdfc-top-100",
    name: "HDFC Top 100 Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "Equity",
    subcategory: "Large Cap",
    holdings: [
      { name: "HDFC Bank", weight: 10.2 },
      { name: "ICICI Bank", weight: 9.1 },
      { name: "Reliance Industries", weight: 8.8 },
      { name: "Infosys", weight: 6.4 },
      { name: "Bharti Airtel", weight: 5.9 },
      { name: "Larsen & Toubro", weight: 5.1 },
      { name: "ITC", weight: 4.8 },
      { name: "Axis Bank", weight: 4.2 },
      { name: "State Bank of India", weight: 3.9 },
      { name: "Tata Consultancy Services", weight: 3.7 },
    ],
  },
  {
    id: "sbi-bluechip",
    name: "SBI Bluechip Fund",
    fundHouse: "SBI Mutual Fund",
    category: "Equity",
    subcategory: "Large Cap",
    holdings: [
      { name: "HDFC Bank", weight: 9.8 },
      { name: "Reliance Industries", weight: 8.2 },
      { name: "ICICI Bank", weight: 7.9 },
      { name: "Tata Consultancy Services", weight: 6.1 },
      { name: "Infosys", weight: 5.6 },
      { name: "Larsen & Toubro", weight: 5.2 },
      { name: "Kotak Mahindra Bank", weight: 4.4 },
      { name: "Maruti Suzuki", weight: 3.8 },
      { name: "Hindustan Unilever", weight: 3.6 },
      { name: "Bajaj Finance", weight: 3.1 },
    ],
  },
  {
    id: "mirae-large-cap",
    name: "Mirae Asset Large Cap Fund",
    fundHouse: "Mirae Asset",
    category: "Equity",
    subcategory: "Large Cap",
    holdings: [
      { name: "HDFC Bank", weight: 10.5 },
      { name: "Reliance Industries", weight: 9.3 },
      { name: "ICICI Bank", weight: 8.1 },
      { name: "Infosys", weight: 6.8 },
      { name: "Tata Consultancy Services", weight: 5.9 },
      { name: "Bharti Airtel", weight: 5.4 },
      { name: "Axis Bank", weight: 4.6 },
      { name: "Larsen & Toubro", weight: 4.1 },
      { name: "State Bank of India", weight: 3.7 },
      { name: "HCL Technologies", weight: 3.2 },
    ],
  },
  {
    id: "axis-bluechip",
    name: "Axis Bluechip Fund",
    fundHouse: "Axis Mutual Fund",
    category: "Equity",
    subcategory: "Large Cap",
    holdings: [
      { name: "HDFC Bank", weight: 11.2 },
      { name: "Reliance Industries", weight: 8.7 },
      { name: "Infosys", weight: 7.4 },
      { name: "ICICI Bank", weight: 7.1 },
      { name: "Tata Consultancy Services", weight: 6.3 },
      { name: "Bajaj Finance", weight: 5.2 },
      { name: "Kotak Mahindra Bank", weight: 4.8 },
      { name: "Maruti Suzuki", weight: 4.1 },
      { name: "Titan Company", weight: 3.9 },
      { name: "Asian Paints", weight: 3.5 },
    ],
  },
  {
    id: "icici-bluechip",
    name: "ICICI Pru Bluechip Fund",
    fundHouse: "ICICI Prudential",
    category: "Equity",
    subcategory: "Large Cap",
    holdings: [
      { name: "HDFC Bank", weight: 9.6 },
      { name: "ICICI Bank", weight: 8.9 },
      { name: "Reliance Industries", weight: 8.4 },
      { name: "Infosys", weight: 6.2 },
      { name: "Larsen & Toubro", weight: 5.7 },
      { name: "Bharti Airtel", weight: 5.3 },
      { name: "State Bank of India", weight: 4.9 },
      { name: "ITC", weight: 4.4 },
      { name: "Oil & Natural Gas Corporation", weight: 3.8 },
      { name: "Power Grid Corporation", weight: 3.4 },
    ],
  },
  // ── Flexi Cap ──
  {
    id: "parag-parikh-flexi",
    name: "Parag Parikh Flexi Cap Fund",
    fundHouse: "PPFAS Mutual Fund",
    category: "Equity",
    subcategory: "Flexi Cap",
    holdings: [
      { name: "HDFC Bank", weight: 7.2 },
      { name: "Alphabet Inc (US)", weight: 6.8 },
      { name: "Meta Platforms (US)", weight: 5.9 },
      { name: "Microsoft Corporation (US)", weight: 5.4 },
      { name: "Bajaj Holdings", weight: 5.1 },
      { name: "ITC", weight: 4.8 },
      { name: "Coal India", weight: 4.2 },
      { name: "Power Grid Corporation", weight: 3.9 },
      { name: "Maruti Suzuki", weight: 3.7 },
      { name: "Axis Bank", weight: 3.4 },
    ],
  },
  {
    id: "hdfc-flexi-cap",
    name: "HDFC Flexi Cap Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "Equity",
    subcategory: "Flexi Cap",
    holdings: [
      { name: "HDFC Bank", weight: 9.4 },
      { name: "ICICI Bank", weight: 8.6 },
      { name: "Reliance Industries", weight: 7.9 },
      { name: "Infosys", weight: 5.8 },
      { name: "Larsen & Toubro", weight: 5.3 },
      { name: "Axis Bank", weight: 4.7 },
      { name: "Kotak Mahindra Bank", weight: 4.2 },
      { name: "State Bank of India", weight: 3.9 },
      { name: "Bharti Airtel", weight: 3.6 },
      { name: "Maruti Suzuki", weight: 3.1 },
    ],
  },
  // ── Mid Cap ──
  {
    id: "hdfc-midcap",
    name: "HDFC Mid-Cap Opportunities Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "Equity",
    subcategory: "Mid Cap",
    holdings: [
      { name: "Cholamandalam Investment", weight: 4.8 },
      { name: "Max Healthcare", weight: 4.4 },
      { name: "Persistent Systems", weight: 4.1 },
      { name: "Apollo Hospitals", weight: 3.9 },
      { name: "Voltas", weight: 3.7 },
      { name: "Supreme Industries", weight: 3.4 },
      { name: "Coforge", weight: 3.2 },
      { name: "Tube Investments", weight: 3.1 },
      { name: "Sundaram Finance", weight: 2.9 },
      { name: "Page Industries", weight: 2.7 },
    ],
  },
  {
    id: "axis-midcap",
    name: "Axis Midcap Fund",
    fundHouse: "Axis Mutual Fund",
    category: "Equity",
    subcategory: "Mid Cap",
    holdings: [
      { name: "Cholamandalam Investment", weight: 5.1 },
      { name: "Persistent Systems", weight: 4.7 },
      { name: "Max Healthcare", weight: 4.3 },
      { name: "Coforge", weight: 4.0 },
      { name: "Astral", weight: 3.8 },
      { name: "Supreme Industries", weight: 3.5 },
      { name: "Tube Investments", weight: 3.3 },
      { name: "Crompton Greaves Consumer", weight: 3.1 },
      { name: "Sundaram Finance", weight: 2.9 },
      { name: "Sona BLW Precision", weight: 2.7 },
    ],
  },
  {
    id: "kotak-emerging-equity",
    name: "Kotak Emerging Equity Fund",
    fundHouse: "Kotak Mutual Fund",
    category: "Equity",
    subcategory: "Mid Cap",
    holdings: [
      { name: "Apollo Hospitals", weight: 4.9 },
      { name: "Max Healthcare", weight: 4.5 },
      { name: "Cholamandalam Investment", weight: 4.2 },
      { name: "Persistent Systems", weight: 3.9 },
      { name: "Voltas", weight: 3.6 },
      { name: "Cummins India", weight: 3.4 },
      { name: "Bharat Electronics", weight: 3.2 },
      { name: "Trent", weight: 3.0 },
      { name: "Oberoi Realty", weight: 2.8 },
      { name: "Astral", weight: 2.6 },
    ],
  },
  // ── Small Cap ──
  {
    id: "sbi-small-cap",
    name: "SBI Small Cap Fund",
    fundHouse: "SBI Mutual Fund",
    category: "Equity",
    subcategory: "Small Cap",
    holdings: [
      { name: "Blue Star", weight: 4.2 },
      { name: "Finolex Cables", weight: 3.8 },
      { name: "Garware Technical Fibres", weight: 3.6 },
      { name: "Carborundum Universal", weight: 3.4 },
      { name: "Kirloskar Brothers", weight: 3.2 },
      { name: "Hawkins Cookers", weight: 2.9 },
      { name: "V-Guard Industries", weight: 2.7 },
      { name: "Cosmo First", weight: 2.5 },
      { name: "Suprajit Engineering", weight: 2.4 },
      { name: "Safari Industries", weight: 2.2 },
    ],
  },
  {
    id: "nippon-small-cap",
    name: "Nippon India Small Cap Fund",
    fundHouse: "Nippon India",
    category: "Equity",
    subcategory: "Small Cap",
    holdings: [
      { name: "HDFC Bank", weight: 3.1 },
      { name: "Multi Commodity Exchange", weight: 2.9 },
      { name: "Apar Industries", weight: 2.7 },
      { name: "Voltamp Transformers", weight: 2.5 },
      { name: "Karur Vysya Bank", weight: 2.4 },
      { name: "Greenpanel Industries", weight: 2.3 },
      { name: "CMS Info Systems", weight: 2.2 },
      { name: "Brigade Enterprises", weight: 2.1 },
      { name: "Blue Star", weight: 2.0 },
      { name: "HBL Power Systems", weight: 1.9 },
    ],
  },
  {
    id: "quant-small-cap",
    name: "Quant Small Cap Fund",
    fundHouse: "Quant Mutual Fund",
    category: "Equity",
    subcategory: "Small Cap",
    holdings: [
      { name: "Reliance Industries", weight: 6.1 },
      { name: "IRB Infrastructure", weight: 4.8 },
      { name: "Bikaji Foods", weight: 4.2 },
      { name: "Jio Financial Services", weight: 3.9 },
      { name: "Hindustan Copper", weight: 3.7 },
      { name: "Kolte-Patil Developers", weight: 3.4 },
      { name: "Blue Star", weight: 3.2 },
      { name: "NCC", weight: 3.0 },
      { name: "Shriram Finance", weight: 2.8 },
      { name: "Aegis Logistics", weight: 2.6 },
    ],
  },
  // ── ELSS ──
  {
    id: "hdfc-elss",
    name: "HDFC ELSS Tax Saver Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "Equity",
    subcategory: "ELSS",
    holdings: [
      { name: "HDFC Bank", weight: 9.9 },
      { name: "ICICI Bank", weight: 8.3 },
      { name: "Reliance Industries", weight: 7.6 },
      { name: "Infosys", weight: 6.1 },
      { name: "Larsen & Toubro", weight: 5.4 },
      { name: "Bharti Airtel", weight: 4.9 },
      { name: "Axis Bank", weight: 4.5 },
      { name: "State Bank of India", weight: 4.1 },
      { name: "ITC", weight: 3.7 },
      { name: "Kotak Mahindra Bank", weight: 3.3 },
    ],
  },
  {
    id: "axis-elss",
    name: "Axis Long Term Equity Fund (ELSS)",
    fundHouse: "Axis Mutual Fund",
    category: "Equity",
    subcategory: "ELSS",
    holdings: [
      { name: "HDFC Bank", weight: 10.8 },
      { name: "Reliance Industries", weight: 8.4 },
      { name: "Infosys", weight: 7.2 },
      { name: "ICICI Bank", weight: 6.9 },
      { name: "Tata Consultancy Services", weight: 6.1 },
      { name: "Bajaj Finance", weight: 5.4 },
      { name: "Kotak Mahindra Bank", weight: 4.7 },
      { name: "Titan Company", weight: 4.2 },
      { name: "Maruti Suzuki", weight: 3.8 },
      { name: "Asian Paints", weight: 3.4 },
    ],
  },
  {
    id: "mirae-elss",
    name: "Mirae Asset ELSS Tax Saver Fund",
    fundHouse: "Mirae Asset",
    category: "Equity",
    subcategory: "ELSS",
    holdings: [
      { name: "HDFC Bank", weight: 10.1 },
      { name: "Reliance Industries", weight: 8.9 },
      { name: "ICICI Bank", weight: 7.8 },
      { name: "Infosys", weight: 6.5 },
      { name: "Tata Consultancy Services", weight: 5.7 },
      { name: "Bharti Airtel", weight: 5.2 },
      { name: "Axis Bank", weight: 4.4 },
      { name: "Larsen & Toubro", weight: 3.9 },
      { name: "State Bank of India", weight: 3.5 },
      { name: "HCL Technologies", weight: 3.0 },
    ],
  },
  // ── Index ──
  {
    id: "uti-nifty-50-index",
    name: "UTI Nifty 50 Index Fund",
    fundHouse: "UTI Mutual Fund",
    category: "Equity",
    subcategory: "Index",
    holdings: [
      { name: "HDFC Bank", weight: 13.2 },
      { name: "Reliance Industries", weight: 10.1 },
      { name: "ICICI Bank", weight: 9.4 },
      { name: "Infosys", weight: 7.2 },
      { name: "Larsen & Toubro", weight: 4.8 },
      { name: "Bharti Airtel", weight: 4.6 },
      { name: "Tata Consultancy Services", weight: 4.3 },
      { name: "ITC", weight: 4.1 },
      { name: "Bajaj Finance", weight: 3.9 },
      { name: "Axis Bank", weight: 3.7 },
    ],
  },
  {
    id: "sbi-nifty-50-index",
    name: "SBI Nifty 50 Index Fund",
    fundHouse: "SBI Mutual Fund",
    category: "Equity",
    subcategory: "Index",
    holdings: [
      { name: "HDFC Bank", weight: 13.1 },
      { name: "Reliance Industries", weight: 10.0 },
      { name: "ICICI Bank", weight: 9.3 },
      { name: "Infosys", weight: 7.1 },
      { name: "Larsen & Toubro", weight: 4.7 },
      { name: "Bharti Airtel", weight: 4.5 },
      { name: "Tata Consultancy Services", weight: 4.2 },
      { name: "ITC", weight: 4.0 },
      { name: "Bajaj Finance", weight: 3.8 },
      { name: "Axis Bank", weight: 3.6 },
    ],
  },
];

// ─── Overlap Algorithm ───────────────────────────────────────────────────────

export interface OverlapResult {
  funds: string[];                         // Fund names in the comparison
  pairwiseOverlap: PairwiseOverlap[];     // Overlap between each pair
  commonHoldings: CommonHolding[];        // Holdings shared by ≥2 funds
  concentrationRisk: ConcentrationRisk;   // Top sector/stock concentration
  overallOverlapPct: number;              // Weighted avg overlap across all pairs
  diversificationScore: number;           // 0-100 (100 = perfectly diversified)
  verdict: "excellent" | "good" | "fair" | "poor";
  suggestion: string;
}

export interface PairwiseOverlap {
  fund1: string;
  fund2: string;
  overlapPct: number;    // % overlap by weight
  commonStocks: number;  // Count of shared stocks
}

export interface CommonHolding {
  name: string;
  fundsHolding: string[];   // Fund names that hold this stock
  avgWeight: number;        // Average weight across funds holding it
  maxWeight: number;        // Max weight in any single fund
}

export interface ConcentrationRisk {
  topStock: string;
  topStockMaxWeight: number;
  top3StocksWeight: number; // Combined weight of top 3 stocks across portfolio
  riskLevel: "low" | "moderate" | "high";
}

/**
 * Calculate overlap between two fund holdings lists.
 * Uses the minimum weight of common holdings (conservative overlap measure).
 */
function pairOverlap(a: FundHolding[], b: FundHolding[]): { pct: number; count: number } {
  let overlapWeight = 0;
  let count = 0;

  for (const ha of a) {
    const match = b.find(
      (hb) => hb.name.toLowerCase() === ha.name.toLowerCase()
    );
    if (match) {
      overlapWeight += Math.min(ha.weight, match.weight);
      count++;
    }
  }

  return {
    pct: Math.min(overlapWeight, 100),
    count,
  };
}

export function calculateMFOverlap(selectedFundIds: string[]): OverlapResult | null {
  if (selectedFundIds.length < 2) return null;

  const funds = selectedFundIds
    .map((id) => FUND_DATABASE.find((f) => f.id === id))
    .filter(Boolean) as FundData[];

  if (funds.length < 2) return null;

  // ── Pairwise overlap ──
  const pairwiseOverlap: PairwiseOverlap[] = [];
  for (let i = 0; i < funds.length; i++) {
    for (let j = i + 1; j < funds.length; j++) {
      const { pct, count } = pairOverlap(funds[i].holdings, funds[j].holdings);
      pairwiseOverlap.push({
        fund1: funds[i].name,
        fund2: funds[j].name,
        overlapPct: Math.round(pct * 10) / 10,
        commonStocks: count,
      });
    }
  }

  // ── Common holdings across all selected funds ──
  const holdingMap = new Map<string, { funds: string[]; weights: number[] }>();
  for (const fund of funds) {
    for (const h of fund.holdings) {
      const key = h.name.toLowerCase();
      if (!holdingMap.has(key)) {
        holdingMap.set(key, { funds: [], weights: [] });
      }
      holdingMap.get(key)!.funds.push(fund.name);
      holdingMap.get(key)!.weights.push(h.weight);
    }
  }

  const commonHoldings: CommonHolding[] = Array.from(holdingMap.entries())
    .filter(([, v]) => v.funds.length >= 2)
    .map(([name, v]) => ({
      name: FUND_DATABASE.flatMap((f) => f.holdings).find(
        (h) => h.name.toLowerCase() === name
      )?.name ?? name,
      fundsHolding: v.funds,
      avgWeight: Math.round((v.weights.reduce((a, b) => a + b, 0) / v.weights.length) * 10) / 10,
      maxWeight: Math.round(Math.max(...v.weights) * 10) / 10,
    }))
    .sort((a, b) => b.fundsHolding.length - a.fundsHolding.length || b.avgWeight - a.avgWeight);

  // ── Concentration risk ──
  const allHoldings = funds.flatMap((f) => f.holdings);
  const sorted = [...allHoldings].sort((a, b) => b.weight - a.weight);
  const top3Weight = sorted.slice(0, 3).reduce((s, h) => s + h.weight, 0);
  const avgOverlap = pairwiseOverlap.reduce((s, p) => s + p.overlapPct, 0) / pairwiseOverlap.length;

  const concentrationRisk: ConcentrationRisk = {
    topStock: sorted[0]?.name ?? "",
    topStockMaxWeight: sorted[0]?.weight ?? 0,
    top3StocksWeight: Math.round(top3Weight * 10) / 10,
    riskLevel: top3Weight > 30 ? "high" : top3Weight > 20 ? "moderate" : "low",
  };

  // ── Diversification score (0-100, higher = better) ──
  const diversificationScore = Math.round(Math.max(0, Math.min(100, 100 - avgOverlap)));

  const verdict: OverlapResult["verdict"] =
    avgOverlap < 20
      ? "excellent"
      : avgOverlap < 40
      ? "good"
      : avgOverlap < 60
      ? "fair"
      : "poor";

  const suggestion =
    verdict === "excellent"
      ? "Great diversification! Your selected funds have minimal overlap."
      : verdict === "good"
      ? "Good diversification. Minor overlap exists but portfolio is broadly spread."
      : verdict === "fair"
      ? "Moderate overlap detected. Consider replacing one fund with a different category (e.g., add a Mid Cap or International fund)."
      : "High overlap! You are effectively holding the same stocks in multiple funds. Consider consolidating or switching one fund to a different category.";

  return {
    funds: funds.map((f) => f.name),
    pairwiseOverlap,
    commonHoldings,
    concentrationRisk,
    overallOverlapPct: Math.round(avgOverlap * 10) / 10,
    diversificationScore,
    verdict,
    suggestion,
  };
}
