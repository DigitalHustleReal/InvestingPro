import * as fs from 'fs';
import * as path from 'path';

/**
 * Setup Alpha Vantage API Key in .env.local
 */

const ALPHA_VANTAGE_API_KEY = '24KAN6BEESR8I0U0';

async function setupAlphaVantageKey() {
    console.log('🔑 Setting up Alpha Vantage API Key...\n');

    const envPath = path.join(process.cwd(), '.env.local');
    
    // Read existing .env.local or create new
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
        console.log('📄 Found existing .env.local file');
    } else {
        console.log('📝 Creating new .env.local file');
    }

    // Check if ALPHA_VANTAGE_API_KEY already exists
    const lines = envContent.split('\n');
    const alphaKeyIndex = lines.findIndex(line => line.startsWith('ALPHA_VANTAGE_API_KEY='));
    
    if (alphaKeyIndex !== -1) {
        // Update existing key
        lines[alphaKeyIndex] = `ALPHA_VANTAGE_API_KEY=${ALPHA_VANTAGE_API_KEY}`;
        envContent = lines.join('\n');
        console.log('✏️  Updated existing ALPHA_VANTAGE_API_KEY');
    } else {
        // Add new key
        if (envContent && !envContent.endsWith('\n')) {
            envContent += '\n';
        }
        envContent += `\n# Alpha Vantage API Configuration (Financial Data)\nALPHA_VANTAGE_API_KEY=${ALPHA_VANTAGE_API_KEY}\n`;
        console.log('➕ Added ALPHA_VANTAGE_API_KEY to .env.local');
    }

    // Write back to file
    fs.writeFileSync(envPath, envContent, 'utf-8');
    
    console.log('\n✅ Alpha Vantage API Key configured successfully!');
    console.log('📍 Location:', envPath);
    console.log('\n📊 What You Can Access:');
    console.log('   ✅ Stock prices (NSE, BSE, NYSE, NASDAQ)');
    console.log('   ✅ Mutual fund NAV data');
    console.log('   ✅ Forex rates (USD/INR, etc.)');
    console.log('   ✅ Cryptocurrency prices');
    console.log('   ✅ Technical indicators (SMA, EMA, RSI, etc.)');
    console.log('   ✅ Company fundamentals');
    console.log('\n💰 Free Tier Limits:');
    console.log('   📊 25 requests per day');
    console.log('   📊 500 requests per month');
    console.log('   📊 5 API calls per minute');
    console.log('\n🔒 Security Note: .env.local is gitignored and will not be committed');
    console.log('\n🧪 Next step: Run test script to verify connection');
    console.log('   npx tsx scripts/test-alpha-vantage.ts');
}

setupAlphaVantageKey().catch(console.error);
