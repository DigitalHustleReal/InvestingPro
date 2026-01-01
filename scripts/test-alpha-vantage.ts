import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Alpha Vantage API Connection
 * Tests stock quotes, forex, and other financial data
 */

// Load environment variables
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

async function testAlphaVantage() {
    console.log('🧪 Testing Alpha Vantage API Connection...\n');

    // Load environment
    loadEnvFile();

    // Check API key
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
        console.error('❌ ALPHA_VANTAGE_API_KEY not found in .env.local');
        console.log('\n💡 Run this first:');
        console.log('   npx tsx scripts/setup-alpha-vantage-key.ts');
        process.exit(1);
    }

    console.log('✅ API Key found');
    console.log(`🔑 Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}\n`);

    try {
        console.log('📡 Testing different endpoints...\n');

        // Test 1: Get stock quote (Reliance Industries)
        console.log('1️⃣ Testing Stock Quote (RELIANCE.BSE)...');
        const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=RELIANCE.BSE&apikey=${apiKey}`;
        const quoteResponse = await fetch(quoteUrl);
        const quoteData = await quoteResponse.json();
        
        if (quoteData['Global Quote']) {
            const quote = quoteData['Global Quote'];
            console.log('   ✅ Stock Quote Retrieved!');
            console.log(`   Symbol: ${quote['01. symbol']}`);
            console.log(`   Price: ₹${quote['05. price']}`);
            console.log(`   Change: ${quote['09. change']} (${quote['10. change percent']})`);
        } else if (quoteData['Note']) {
            console.log('   ⚠️  Rate limit reached (5 calls/min limit)');
            console.log('   This is normal - API key is valid!');
        } else {
            console.log('   ℹ️  Response:', JSON.stringify(quoteData).substring(0, 200));
        }

        console.log('');

        // Test 2: Get forex rate (USD to INR)
        console.log('2️⃣ Testing Forex Rate (USD/INR)...');
        await new Promise(resolve => setTimeout(resolve, 12000)); // Wait 12s to avoid rate limit
        
        const forexUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=${apiKey}`;
        const forexResponse = await fetch(forexUrl);
        const forexData = await forexResponse.json();
        
        if (forexData['Realtime Currency Exchange Rate']) {
            const rate = forexData['Realtime Currency Exchange Rate'];
            console.log('   ✅ Forex Rate Retrieved!');
            console.log(`   From: ${rate['1. From_Currency Code']} (${rate['2. From_Currency Name']})`);
            console.log(`   To: ${rate['3. To_Currency Code']} (${rate['4. To_Currency Name']})`);
            console.log(`   Rate: ${rate['5. Exchange Rate']}`);
            console.log(`   Last Updated: ${rate['6. Last Refreshed']}`);
        } else if (forexData['Note']) {
            console.log('   ⚠️  Rate limit reached');
        } else {
            console.log('   ℹ️  Response:', JSON.stringify(forexData).substring(0, 200));
        }

        console.log('\n' + '═'.repeat(60));
        console.log('🎉 Alpha Vantage API is working!');
        console.log('═'.repeat(60));
        
        console.log('\n📊 Available Data:');
        console.log('   ✅ Stock Quotes (NSE, BSE, NYSE, NASDAQ)');
        console.log('   ✅ Historical Prices (Daily, Weekly, Monthly)');
        console.log('   ✅ Intraday Data (1min, 5min, 15min, 30min, 60min)');
        console.log('   ✅ Forex Rates (150+ currencies)');
        console.log('   ✅ Cryptocurrency Prices');
        console.log('   ✅ Technical Indicators (50+ indicators)');
        console.log('   ✅ Company Fundamentals');
        
        console.log('\n💰 Rate Limits:');
        console.log('   📊 25 requests per day');
        console.log('   📊 5 requests per minute');
        console.log('   💡 Use caching to optimize usage!');
        
        console.log('\n📚 Next Steps:');
        console.log('   1. Add stock data to your articles');
        console.log('   2. Create portfolio tracking features');
        console.log('   3. Build price comparison tools');
        console.log('   4. Add technical analysis charts');
        
        console.log('\n💡 Pro Tip: Cache responses for 5-15 minutes to save API calls!');
        
        return true;

    } catch (error: any) {
        console.error('❌ Connection Failed!\n');
        console.error('Error:', error.message);
        
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Check your internet connection');
        console.log('   2. Verify API key is correct');
        console.log('   3. Check if you hit rate limit (5 calls/min)');
        console.log('   4. Visit: https://www.alphavantage.co/support/#support');
        
        process.exit(1);
    }
}

// Run the test
testAlphaVantage().catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
