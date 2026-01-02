
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { pipeline } from 'stream';
import { promisify } from 'util';

dotenv.config({ path: '.env.local' });

const streamPipeline = promisify(pipeline);

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || 'IUrwmrGaNkIyc_xurixdcaR0b5fBtiqErUiXL3eqruU';
const TARGET_DIR = path.join(process.cwd(), 'public/images/stock');
const MANIFEST_PATH = path.join(TARGET_DIR, 'manifest.json');

const TOPICS = [
    'Investment', 'Finance', 'Stock Market', 'Gold Coins', 
    'Office Meeting', 'Growth Chart', 'Laptop Analysis', 'Mutual Funds'
];

async function ensureDir() {
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }
}

async function downloadImage(url: string, filepath: string) {
    const response = await axios.get(url, { responseType: 'stream' });
    await streamPipeline(response.data, fs.createWriteStream(filepath));
}

async function run() {
    console.log('🚀 Starting Stock Library Download...');
    if (!UNSPLASH_KEY) {
        console.error('❌ Missing UNSPLASH_ACCESS_KEY');
        return;
    }

    await ensureDir();

    const manifest: any[] = [];
    
    for (const topic of TOPICS) {
        console.log(`\n📸 Searching for: ${topic}`);
        try {
            const res = await axios.get(`https://api.unsplash.com/search/photos`, {
                headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
                params: { query: topic, per_page: 3, orientation: 'landscape', content_filter: 'high' }
            });

            const photos = res.data.results;
            console.log(`   Found ${photos.length} photos.`);

            for (let i = 0; i < photos.length; i++) {
                const photo = photos[i];
                const cleanTopic = topic.toLowerCase().replace(/\s+/g, '-');
                const filename = `${cleanTopic}-${i + 1}.jpg`;
                const filepath = path.join(TARGET_DIR, filename);
                const publicUrl = `/images/stock/${filename}`;

                console.log(`   ⬇️ Downloading: ${filename}`);
                await downloadImage(photo.urls.regular, filepath);
                
                manifest.push({
                    id: photo.id,
                    filename: filename,
                    url: publicUrl,
                    alt: photo.alt_description || topic,
                    topic: topic,
                    credit: photo.user.name
                });
            }
        } catch (e: any) {
            console.error(`   ❌ Failed to fetch ${topic}:`, e.message);
        }
    }

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`\n✅ Download Complete! Saved ${manifest.length} images.`);
    console.log(`📝 Manifest written to ${MANIFEST_PATH}`);
}

run().catch(console.error);
