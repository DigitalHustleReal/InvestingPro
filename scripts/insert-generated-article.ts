import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

/**
 * Insert AI-Generated Article into Database
 * Extracts content from HTML file and inserts with proper metadata
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

// Extract content from HTML file
function extractContentFromHTML(htmlContent: string): {
    title: string;
    description: string;
    keywords: string;
    body: string;
} {
    // Remove the ```html wrapper if present
    let content = htmlContent.replace(/^```html\n/, '').replace(/\n```$/, '');
    
    // Extract title
    const titleMatch = content.match(/<title>(.*?)<\/title>/s);
    const title = titleMatch ? titleMatch[1].replace(/\s*\(InvestingPro.*?\)/, '').trim() : 'Untitled Article';
    
    // Extract meta description
    const descMatch = content.match(/<meta name="description" content="(.*?)"/);
    const description = descMatch ? descMatch[1] : '';
    
    // Extract keywords
    const keywordsMatch = content.match(/<meta name="keywords" content="(.*?)"/);
    const keywords = keywordsMatch ? keywordsMatch[1] : '';
    
    // Extract body content (everything between <body> tags, excluding the wrapper)
    const bodyMatch = content.match(/<body>(.*?)<\/body>/s);
    let body = bodyMatch ? bodyMatch[1].trim() : '';
    
    // Remove the header wrapper if present
    body = body.replace(/<header>\s*<h1>.*?<\/h1>\s*<\/header>/s, '');
    
    // Clean up the body - keep only the content divs and elements
    // Remove inline styles from body
    body = body.replace(/<body[^>]*>/, '').replace(/<\/body>/, '');
    
    return {
        title,
        description,
        keywords,
        body: body.trim()
    };
}

// Generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
}

async function insertGeneratedArticle(htmlFilePath: string) {
    console.log('📝 Processing AI-Generated Article...\n');
    
    // Load environment
    loadEnvFile();
    
    // Check if file exists
    if (!fs.existsSync(htmlFilePath)) {
        console.error('❌ File not found:', htmlFilePath);
        console.log('\n💡 Usage:');
        console.log('   npx tsx scripts/insert-generated-article.ts path/to/article.html');
        process.exit(1);
    }
    
    console.log('📄 Reading file:', path.basename(htmlFilePath));
    
    // Read HTML file
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
    
    // Extract content
    console.log('🔍 Extracting content...');
    const { title, description, keywords, body } = extractContentFromHTML(htmlContent);
    
    console.log('\n📊 Article Details:');
    console.log(`   Title: ${title}`);
    console.log(`   Description: ${description.substring(0, 100)}...`);
    console.log(`   Keywords: ${keywords.split(',').length} keywords`);
    console.log(`   Body Length: ${body.length} characters\n`);
    
    // Generate slug
    const slug = generateSlug(title);
    console.log(`   Slug: ${slug}\n`);
    
    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase credentials not found in .env.local');
        process.exit(1);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('💾 Inserting into database...');
    
    // Prepare article data
    const articleData = {
        title,
        slug,
        excerpt: description,
        body,
        featured_image: '/images/articles/default-featured.jpg', // You can update this
        author_id: '00000000-0000-0000-0000-000000000000', // Update with actual author ID
        category: 'Mutual Funds', // Update as needed
        tags: keywords.split(',').map(k => k.trim()).slice(0, 5),
        meta_title: title,
        meta_description: description,
        meta_keywords: keywords.split(',').map(k => k.trim()),
        published_at: new Date().toISOString(),
        status: 'published',
        reading_time: Math.ceil(body.split(/\s+/).length / 200), // Approx reading time
    };
    
    // Insert article
    const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();
    
    if (error) {
        console.error('\n❌ Error inserting article:', error.message);
        
        if (error.message.includes('duplicate')) {
            console.log('\n💡 This article may already exist. Try updating the title or slug.');
        }
        
        process.exit(1);
    }
    
    console.log('\n✅ Article inserted successfully!');
    console.log('\n📊 Article Info:');
    console.log(`   ID: ${data.id}`);
    console.log(`   Title: ${data.title}`);
    console.log(`   Slug: ${data.slug}`);
    console.log(`   Reading Time: ${data.reading_time} min`);
    console.log(`   Tags: ${data.tags?.join(', ')}`);
    
    console.log('\n🔗 View your article at:');
    console.log(`   http://localhost:3000/articles/${data.slug}`);
    
    console.log('\n🎉 Done! Your AI-generated article is now live with:');
    console.log('   ✅ Professional formatting');
    console.log('   ✅ Draggable Table of Contents');
    console.log('   ✅ SEO metadata');
    console.log('   ✅ Responsive design');
    console.log('   ✅ All visual components styled');
}

// Get file path from command line
const filePath = process.argv[2];

if (!filePath) {
    console.log('📝 Insert AI-Generated Article into Database\n');
    console.log('Usage:');
    console.log('  npx tsx scripts/insert-generated-article.ts path/to/article.html\n');
    console.log('Example:');
    console.log('  npx tsx scripts/insert-generated-article.ts generated-articles/best-tax-saving-mutual-funds-for-2026-1767230569890.html\n');
    process.exit(1);
}

// Resolve full path
const fullPath = path.isAbsolute(filePath) 
    ? filePath 
    : path.join(process.cwd(), filePath);

insertGeneratedArticle(fullPath).catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
