import * as fs from 'fs';
import * as path from 'path';

/**
 * Setup Mistral AI API Key in .env.local
 */

const MISTRAL_API_KEY = 'Rgnit1Tjb0oe1I8uNhUnSCxSdYTyjj5N';

async function setupMistralKey() {
    console.log('🔑 Setting up Mistral AI API Key...\n');

    const envPath = path.join(process.cwd(), '.env.local');
    
    // Read existing .env.local or create new
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
        console.log('📄 Found existing .env.local file');
    } else {
        console.log('📝 Creating new .env.local file');
    }

    // Check if MISTRAL_API_KEY already exists
    const lines = envContent.split('\n');
    const mistralKeyIndex = lines.findIndex(line => line.startsWith('MISTRAL_API_KEY='));
    
    if (mistralKeyIndex !== -1) {
        // Update existing key
        lines[mistralKeyIndex] = `MISTRAL_API_KEY=${MISTRAL_API_KEY}`;
        envContent = lines.join('\n');
        console.log('✏️  Updated existing MISTRAL_API_KEY');
    } else {
        // Add new key
        if (envContent && !envContent.endsWith('\n')) {
            envContent += '\n';
        }
        envContent += `\n# Mistral AI API Configuration\nMISTRAL_API_KEY=${MISTRAL_API_KEY}\nMISTRAL_MODEL=mistral-small-latest\n`;
        console.log('➕ Added MISTRAL_API_KEY to .env.local');
    }

    // Write back to file
    fs.writeFileSync(envPath, envContent, 'utf-8');
    
    console.log('\n✅ Mistral AI API Key configured successfully!');
    console.log('📍 Location:', envPath);
    console.log('\n💰 Pricing: FREE tier with rate limits');
    console.log('📊 Models: mistral-small, mistral-medium, mistral-large');
    console.log('🌍 Specialty: Multilingual, European languages');
    console.log('\n🔒 Security Note: .env.local is gitignored and will not be committed');
    console.log('\n🧪 Next step: Run test script to verify connection');
    console.log('   npx tsx scripts/test-mistral-connection.ts');
}

setupMistralKey().catch(console.error);
