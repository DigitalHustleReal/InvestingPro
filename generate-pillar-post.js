
const fs = require('fs');
if (fs.existsSync('.env.local')) {
    const env = fs.readFileSync('.env.local', 'utf8');
    env.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        }
    });
}

const { generateArticleCore } = require('./lib/automation/article-generator');

async function createPillarPost() {
    const topic = "The Ultimate Guide to Mutual Funds in India (2026): Your Path to Financial Freedom";
    console.log(`🚀 Starting high-quality pillar post generation for: "${topic}"`);
    
    try {
        const result = await generateArticleCore(topic, (msg) => {
            process.stdout.write(`[FACTORY] ${msg}\n`);
        });
        
        if (result.success) {
            console.log("\n--- PILLAR POST ASSET CREATED ---");
            console.log(`Title: ${result.article.title}`);
            console.log(`Slug: ${result.article.slug}`);
            console.log(`Category: ${result.article.category}`);
            console.log(`Featured Image: ${result.article.featured_image}`);
            console.log(`URL: http://localhost:3000${result.url}`);
            console.log("---------------------------------\n");
        } else {
            console.error("❌ Pillar Post generation failed:", result.error);
        }
    } catch (e) {
        console.error("💥 Critical Failure:", e.stack);
    }
}

createPillarPost();
