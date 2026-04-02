/**
 * Alpha Vantage Utility Library
 * Easy-to-use functions for financial data in your InvestingPro app
 */

// Load environment variables
import * as fs from 'fs';
import { logger } from '@/lib/logger';
import * as path from 'path';

function loadEnvFile() {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                const value = valueParts.join('=').trim();
                if (key && value) {
                    process.env[key] = value;
                }
            }
        }
    }
}

loadEnvFile();

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || '';
const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Get stock quote (current price, change, volume)
 */
export async function getStockQuote(symbol: string) {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Global Quote']) {
        const quote = data['Global Quote'];
        return {
            symbol: quote['01. symbol'],
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: quote['10. change percent'],
            volume: parseInt(quote['06. volume']),
            lastUpdated: quote['07. latest trading day']
        };
    }
    
    throw new Error(data['Note'] || 'Failed to fetch stock quote');
}

/**
 * Get forex exchange rate
 */
export async function getForexRate(fromCurrency: string, toCurrency: string) {
    const url = `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Realtime Currency Exchange Rate']) {
        const rate = data['Realtime Currency Exchange Rate'];
        return {
            from: rate['1. From_Currency Code'],
            to: rate['3. To_Currency Code'],
            rate: parseFloat(rate['5. Exchange Rate']),
            lastUpdated: rate['6. Last Refreshed']
        };
    }
    
    throw new Error(data['Note'] || 'Failed to fetch forex rate');
}

/**
 * Get daily historical prices
 */
export async function getDailyPrices(symbol: string, outputSize: 'compact' | 'full' = 'compact') {
    const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputSize}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Time Series (Daily)']) {
        const timeSeries = data['Time Series (Daily)'];
        return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
            date,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume'])
        }));
    }
    
    throw new Error(data['Note'] || 'Failed to fetch daily prices');
}

/**
 * Get company overview (fundamentals)
 */
export async function getCompanyOverview(symbol: string) {
    const url = `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Symbol']) {
        return {
            symbol: data['Symbol'],
            name: data['Name'],
            description: data['Description'],
            sector: data['Sector'],
            industry: data['Industry'],
            marketCap: data['MarketCapitalization'],
            peRatio: parseFloat(data['PERatio']),
            dividendYield: parseFloat(data['DividendYield']),
            eps: parseFloat(data['EPS']),
            beta: parseFloat(data['Beta'])
        };
    }
    
    throw new Error(data['Note'] || 'Failed to fetch company overview');
}

/**
 * Get top gainers, losers, and most active stocks
 */
export async function getMarketMovers() {
    const url = `${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return {
        gainers: data['top_gainers'] || [],
        losers: data['top_losers'] || [],
        mostActive: data['most_actively_traded'] || []
    };
}

/**
 * Get SMA (Simple Moving Average) indicator
 */
export async function getSMA(symbol: string, interval: string = 'daily', timePeriod: number = 20) {
    const url = `${BASE_URL}?function=SMA&symbol=${symbol}&interval=${interval}&time_period=${timePeriod}&series_type=close&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Technical Analysis: SMA']) {
        const sma = data['Technical Analysis: SMA'];
        return Object.entries(sma).map(([date, values]: [string, any]) => ({
            date,
            sma: parseFloat(values['SMA'])
        }));
    }
    
    throw new Error(data['Note'] || 'Failed to fetch SMA');
}

/**
 * Example usage in your app
 */
export async function exampleUsage() {
    try {
        // Get Reliance stock quote
        const reliance = await getStockQuote('RELIANCE.BSE');
        logger.info('Reliance Price:', { price: reliance.price });

        // Get USD to INR rate
        const usdInr = await getForexRate('USD', 'INR');
        logger.info('USD/INR Rate:', { rate: usdInr.rate });
        
        // Get TCS historical prices (last 100 days)
        const tcsHistory = await getDailyPrices('TCS.BSE', 'compact');
        logger.info('TCS Historical Data:', tcsHistory.slice(0, 5));
        
        // Get company overview
        const infy = await getCompanyOverview('INFY');
        logger.info('Infosys Overview:', infy);
        
    } catch (error: any) {
        logger.error('Error:', error.message);
    }
}

// Export all functions
export default {
    getStockQuote,
    getForexRate,
    getDailyPrices,
    getCompanyOverview,
    getMarketMovers,
    getSMA
};
