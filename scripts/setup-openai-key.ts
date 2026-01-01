import * as fs from 'fs';
import * as path from 'path';

/**
 * Setup OpenAI API Key in .env.local
 */

const OPENAI_API_KEY = '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';

async function setupOpenAIKey() {
    console.log('🔑 Setting up OpenAI API Key...\n');

    const envPath = path.join(process.cwd(), '.env.local');
    
    // Read existing .env.local or create new
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
        console.log('📄 Found existing .env.local file');
    } else {
        console.log('📝 Creating new .env.local file');
    }

    // Check if OPENAI_API_KEY already exists
    const lines = envContent.split('\n');
    const openaiKeyIndex = lines.findIndex(line => line.startsWith('OPENAI_API_KEY='));
    
    if (openaiKeyIndex !== -1) {
        // Update existing key
        lines[openaiKeyIndex] = `OPENAI_API_KEY=${OPENAI_API_KEY}`;
        console.log('✏️  Updated existing OPENAI_API_KEY');
    } else {
        // Add new key
        if (envContent && !envContent.endsWith('\n')) {
            envContent += '\n';
        }
        envContent += `\n# OpenAI API Configuration\nOPENAI_API_KEY=${OPENAI_API_KEY}\nOPENAI_MODEL=gpt-4-turbo-preview\n`;
        console.log('➕ Added OPENAI_API_KEY to .env.local');
    }

    // Write back to file
    const finalContent = openaiKeyIndex !== -1 ? lines.join('\n') : envContent;
    fs.writeFileSync(envPath, finalContent, 'utf-8');
    
    console.log('\n✅ OpenAI API Key configured successfully!');
    console.log('📍 Location:', envPath);
    console.log('\n🔒 Security Note: .env.local is gitignored and will not be committed');
    console.log('\n🧪 Next step: Run test script to verify connection');
    console.log('   npx tsx scripts/test-openai-connection.ts');
}

setupOpenAIKey().catch(console.error);
