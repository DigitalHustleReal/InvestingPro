import * as fs from 'fs';
import * as path from 'path';

/**
 * Setup Google Gemini API Key in .env.local
 */

const GOOGLE_GEMINI_API_KEY = 'AIzaSyAo-Fus6PJFJCgmN-hRkt8SR0OPbCQpRvs';

async function setupGeminiKey() {
    console.log('🔑 Setting up Google Gemini API Key...\n');

    const envPath = path.join(process.cwd(), '.env.local');
    
    // Read existing .env.local or create new
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
        console.log('📄 Found existing .env.local file');
    } else {
        console.log('📝 Creating new .env.local file');
    }

    // Check if GOOGLE_GEMINI_API_KEY already exists
    const lines = envContent.split('\n');
    const geminiKeyIndex = lines.findIndex(line => line.startsWith('GOOGLE_GEMINI_API_KEY='));
    
    if (geminiKeyIndex !== -1) {
        // Update existing key
        lines[geminiKeyIndex] = `GOOGLE_GEMINI_API_KEY=${GOOGLE_GEMINI_API_KEY}`;
        envContent = lines.join('\n');
        console.log('✏️  Updated existing GOOGLE_GEMINI_API_KEY');
    } else {
        // Add new key
        if (envContent && !envContent.endsWith('\n')) {
            envContent += '\n';
        }
        envContent += `\n# Google Gemini API Configuration\nGOOGLE_GEMINI_API_KEY=${GOOGLE_GEMINI_API_KEY}\nGEMINI_MODEL=gemini-1.5-pro\n`;
        console.log('➕ Added GOOGLE_GEMINI_API_KEY to .env.local');
    }

    // Write back to file
    fs.writeFileSync(envPath, envContent, 'utf-8');
    
    console.log('\n✅ Google Gemini API Key configured successfully!');
    console.log('📍 Location:', envPath);
    console.log('\n💰 Pricing: FREE tier with generous limits!');
    console.log('📊 Rate Limits: 60 requests/minute');
    console.log('\n🔒 Security Note: .env.local is gitignored and will not be committed');
    console.log('\n🧪 Next step: Run test script to verify connection');
    console.log('   npx tsx scripts/test-gemini-connection.ts');
}

setupGeminiKey().catch(console.error);
