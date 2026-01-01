/**
 * Yahoo Finance Utility Library
 * Real-time stock data for Indian and global markets
 */

import yahooFinance from 'yahoo-finance2';

/**
 * Get stock quote for Indian stocks
 */
export async function getIndianStockQuote(symbol: string, exchange: 'NSE' | 'BSE' = 'NSE') {
  const suffix = exchange === 'NSE' ? '.NS' : '.BO';
  const fullSymbol = symbol.includes('.') ? symbol : `${symbol}${suffix}`;
  
  try {
    const quote = await yahooFinance.quote(fullSymbol);
    
    return {
      symbol: quote.symbol,
      name: quote.longName || quote.shortName,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
      peRatio: quote.trailingPE,
      dividendYield: quote.dividendYield,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      lastUpdated: new Date()
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch quote for ${fullSymbol}: ${error.message}`);
  }
}

/**
 * Get historical prices
 */
export async function getHistoricalPrices(
  symbol: string,
  exchange: 'NSE' | 'BSE' = 'NSE',
  period1: string | Date = '2024-01-01',
  period2: string | Date = new Date(),
  interval: '1d' | '1wk' | '1mo' = '1d'
) {
  const suffix = exchange === 'NSE' ? '.NS' : '.BO';
  const fullSymbol = symbol.includes('.') ? symbol : `${symbol}${suffix}`;
  
  try {
    const history = await yahooFinance.historical(fullSymbol, {
      period1,
      period2,
      interval
    });
    
    return history.map(h => ({
      date: h.date,
      open: h.open,
      high: h.high,
      low: h.low,
      close: h.close,
      volume: h.volume,
      adjClose: h.adjClose
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch history for ${fullSymbol}: ${error.message}`);
  }
}

/**
 * Search for stocks
 */
export async function searchStocks(query: string) {
  try {
    const results = await yahooFinance.search(query);
    
    return results.quotes.map(q => ({
      symbol: q.symbol,
      name: q.longname || q.shortname,
      exchange: q.exchange,
      type: q.quoteType
    }));
  } catch (error: any) {
    throw new Error(`Failed to search for ${query}: ${error.message}`);
  }
}

/**
 * Get multiple stock quotes at once
 */
export async function getMultipleQuotes(symbols: string[], exchange: 'NSE' | 'BSE' = 'NSE') {
  const suffix = exchange === 'NSE' ? '.NS' : '.BO';
  const fullSymbols = symbols.map(s => s.includes('.') ? s : `${s}${suffix}`);
  
  try {
    const quotes = await Promise.all(
      fullSymbols.map(symbol => yahooFinance.quote(symbol))
    );
    
    return quotes.map(quote => ({
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent
    }));
  } catch (error: any) {
    throw new Error(`Failed to fetch multiple quotes: ${error.message}`);
  }
}

/**
 * Get company profile
 */
export async function getCompanyProfile(symbol: string, exchange: 'NSE' | 'BSE' = 'NSE') {
  const suffix = exchange === 'NSE' ? '.NS' : '.BO';
  const fullSymbol = symbol.includes('.') ? symbol : `${symbol}${suffix}`;
  
  try {
    const quote = await yahooFinance.quoteSummary(fullSymbol, {
      modules: ['assetProfile', 'summaryDetail', 'financialData']
    });
    
    return {
      symbol: fullSymbol,
      name: quote.assetProfile?.longBusinessSummary,
      sector: quote.assetProfile?.sector,
      industry: quote.assetProfile?.industry,
      website: quote.assetProfile?.website,
      employees: quote.assetProfile?.fullTimeEmployees,
      description: quote.assetProfile?.longBusinessSummary,
      marketCap: quote.summaryDetail?.marketCap,
      peRatio: quote.summaryDetail?.trailingPE,
      profitMargin: quote.financialData?.profitMargins,
      revenueGrowth: quote.financialData?.revenueGrowth
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch profile for ${fullSymbol}: ${error.message}`);
  }
}

/**
 * Example usage
 */
export async function exampleUsage() {
  // Get Reliance stock quote
  const reliance = await getIndianStockQuote('RELIANCE', 'NSE');
  console.log('Reliance:', reliance);
  
  // Get historical data
  const history = await getHistoricalPrices('TCS', 'NSE', '2024-01-01', new Date(), '1d');
  console.log('TCS History:', history.slice(0, 5));
  
  // Search for stocks
  const search = await searchStocks('Infosys');
  console.log('Search Results:', search);
  
  // Get multiple quotes
  const quotes = await getMultipleQuotes(['RELIANCE', 'TCS', 'INFY'], 'NSE');
  console.log('Multiple Quotes:', quotes);
}

export default {
  getIndianStockQuote,
  getHistoricalPrices,
  searchStocks,
  getMultipleQuotes,
  getCompanyProfile
};
