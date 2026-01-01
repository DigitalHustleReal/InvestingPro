import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

/**
 * Quick Insert: AI-Generated Article into blog_posts table
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

// Extract title from HTML
function extractTitle(htmlContent: string): string {
    const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/);
    if (h1Match) {
        return h1Match[1].replace(/<[^>]+>/g, '').trim();
    }
    return 'Untitled Article';
}

// Generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
}

async function quickInsertArticle(htmlFilePath: string) {
    console.log('📝 Quick Insert: AI-Generated Article\n');
    
    // Load environment
    loadEnvFile();
    
    // Check if file exists
    if (!fs.existsSync(htmlFilePath)) {
        console.error('❌ File not found:', htmlFilePath);
        process.exit(1);
    }
    
    console.log('📄 Reading:', path.basename(htmlFilePath));
    
    // Read HTML file
    const body = fs.readFileSync(htmlFilePath, 'utf-8');
    
    // Extract title
    const title = extractTitle(body);
    const slug = generateSlug(title);
    
    console.log(`   Title: ${title}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Length: ${body.length} characters\n`);
    
    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase credentials not found');
        process.exit(1);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('💾 Inserting into database...');
    
    // Insert article
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
            title,
            slug,
            body,
            excerpt: title.substring(0, 200),
            featured_image: '/images/default-article.jpg',
            published_at: new Date().toISOString(),
        }])
        .select()
        .single();
    
    if (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
    
    console.log('\n✅ Article inserted successfully!');
    console.log(`   ID: ${data.id}`);
    console.log('\n🔗 View at: http://localhost:3000/articles/${slug}');
    console.log('\n🎉 Your article now has:');
    console.log('   ✅ Professional formatting');
    console.log('   ✅ Draggable Table of Contents');
    console.log('   ✅ All visual components styled');
}

const filePath = process.argv[2] || 'generated-articles/complete-guide-to-sip-investment-in-india-2026-1767231345577.html';
const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

quickInsertArticle(fullPath).catch((error) => {
    console.error('💥 Error:', error.message);
    process.exit(1);
});
