
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.join(process.cwd(), '.env.local');

console.log('🔍 Diagnosing .env.local...');

if (fs.existsSync(envPath)) {
    const buffer = fs.readFileSync(envPath);
    const content = buffer.toString('utf8');
    
    console.log(`📄 File exists. Size: ${buffer.length} bytes`);
    console.log('---------------------------------------------------');
    console.log(content);
    console.log('---------------------------------------------------');
    
    // Check using dotenv
    const parsed = dotenv.parse(buffer);
    console.log('🔑 Dotenv Parsed Keys:', Object.keys(parsed));
    
    if (parsed.RESEND_API_KEY) {
        console.log('✅ RESEND_API_KEY found via dotenv!');
        console.log(`   Value length: ${parsed.RESEND_API_KEY.length}`);
    } else {
        console.log('❌ RESEND_API_KEY NOT found via dotenv.');
    }

    // Check for raw string occurrence (case insensitive)
    if (content.match(/RESEND_API_KEY/i)) {
        console.log('⚠️  "RESEND_API_KEY" string found in raw content (checking validity...)');
        const lines = content.split('\n');
        lines.forEach((line, i) => {
            if (line.match(/RESEND/i)) {
                console.log(`   Line ${i+1}: ${line.substring(0, 50)}...`);
            }
        });
    } else {
        console.log('❌ "RESEND_API_KEY" string NOT found in raw content.');
    }

} else {
    console.log('❌ .env.local file NOT found at:', envPath);
}
