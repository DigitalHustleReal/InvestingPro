import * as fs from 'fs';
import * as path from 'path';

/**
 * Setup Groq API Key in .env.local
 */

const GROQ_API_KEY = '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';

async function setupGroqKey() {
    console.log('🔑 Setting up Groq API Key...\n');

    const envPath = path.join(process.cwd(), '.env.local');
    
    // Read existing .env.local or create new
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
        console.log('📄 Found existing .env.local file');
    } else {
        console.log('📝 Creating new .env.local file');
    }

    // Check if GROQ_API_KEY already exists
    const lines = envContent.split('\n');
    const groqKeyIndex = lines.findIndex(line => line.startsWith('GROQ_API_KEY='));
    
    if (groqKeyIndex !== -1) {
        // Update existing key
        lines[groqKeyIndex] = `GROQ_API_KEY=${GROQ_API_KEY}`;
        envContent = lines.join('\n');
        console.log('✏️  Updated existing GROQ_API_KEY');
    } else {
        // Add new key
        if (envContent && !envContent.endsWith('\n')) {
            envContent += '\n';
        }
        envContent += `\n# Groq API Configuration\nGROQ_API_KEY=${GROQ_API_KEY}\nGROQ_MODEL=mixtral-8x7b-32768\n`;
        console.log('➕ Added GROQ_API_KEY to .env.local');
    }

    // Write back to file
    fs.writeFileSync(envPath, envContent, 'utf-8');
    
    console.log('\n✅ Groq API Key configured successfully!');
    console.log('📍 Location:', envPath);
    console.log('\n⚡ FASTEST AI INFERENCE IN THE WORLD!');
    console.log('📊 Speed: 500+ tokens/second');
    console.log('💰 Pricing: FREE tier with rate limits');
    console.log('🎯 Models: Mixtral, Llama 3, Gemma');
    console.log('\n🔒 Security Note: .env.local is gitignored and will not be committed');
    console.log('\n🧪 Next step: Run test script to verify connection');
    console.log('   npx tsx scripts/test-groq-connection.ts');
}

setupGroqKey().catch(console.error);
