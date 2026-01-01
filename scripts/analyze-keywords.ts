import { getJson } from 'serpapi';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ADVANCED KEYWORD ANALYZER (SerpAPI)
 * 
 * Deep dives into a keyword to find:
 * - "People Also Ask" questions (Perfect for FAQs/H2s)
 * - Related Search queries
 * - Organic Search Competition
 * 
 * Usage: npx tsx scripts/analyze-keywords.ts "mutual funds"
 */

// Load environment variables
function loadEnvFile() {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');
        for (const line of lines) {
            const [key, ...valueParts] = line.trim().split('=');
            if (key && valueParts.length > 0) {
                process.env[key] = valueParts.join('=').trim();
            }
        }
    }
}

async function analyzeKeyword(keyword: string) {
    console.log('🔍 ADVANCED KEYWORD ANALYZER\n');
    console.log(`Analyzing: "${keyword}"...\n`);

    loadEnvFile();

    // Check for API Key
    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
        console.error('❌ SERPAPI_API_KEY not found in .env.local');
        console.log('   Get a free key (100 searches/mo) from: https://serpapi.com/');
        console.log('   Then add it to your .env.local file.');
        return;
    }

    try {
        console.log('📡 Fetching SERP data...');
        
        // Wrap getJson in a promise
        const json = await new Promise<any>((resolve, reject) => {
            getJson({
                engine: "google",
                q: keyword,
                location: "India",
                google_domain: "google.co.in",
                gl: "in",
                hl: "en",
                api_key: apiKey
            }, (json) => {
                resolve(json);
            });
        });

        const result = {
            keyword: keyword,
            analyzedAt: new Date().toISOString(),
            peopleAlsoAsk: json.related_questions?.map((q: any) => q.question) || [],
            relatedSearches: json.related_searches?.map((s: any) => s.query) || [],
            organicResults: json.organic_results?.slice(0, 5).map((r: any) => ({
                title: r.title,
                link: r.link,
                snippet: r.snippet
            })) || []
        };

        // Display Insights
        console.log('\n' + '═'.repeat(60));
        console.log('❓ PEOPLE ALSO ASK (Great for FAQs & H2s)');
        console.log('═'.repeat(60));
        if (result.peopleAlsoAsk.length > 0) {
            result.peopleAlsoAsk.forEach(q => console.log(`   • ${q}`));
        } else {
            console.log('   (No PAA questions found)');
        }

        console.log('\n' + '═'.repeat(60));
        console.log('🔗 RELATED SEARCHES (LSI Keywords)');
        console.log('═'.repeat(60));
        if (result.relatedSearches.length > 0) {
            result.relatedSearches.forEach(s => console.log(`   • ${s}`));
        } else {
            console.log('   (No related searches found)');
        }

        console.log('\n' + '═'.repeat(60));
        console.log('🏆 TOP COMPETITORS');
        console.log('═'.repeat(60));
        result.organicResults.forEach((r, i) => {
            console.log(`${i+1}. ${r.title}`);
            console.log(`   ${r.link}`);
            console.log('');
        });

        // Save analysis
        const filename = `keyword-analysis-${keyword.replace(/\s+/g, '-')}.json`;
        fs.writeFileSync(filename, JSON.stringify(result, null, 2));
        console.log(`\n💾 Saved detailed analysis to: ${filename}`);

        // Suggest Content Structure
        console.log('\n' + '═'.repeat(60));
        console.log('📝 SUGGESTED CONTENT OUTLINE');
        console.log('═'.repeat(60));
        console.log(`H1: Complete Guide to ${keyword.replace(/\b\w/g, l => l.toUpperCase())}`);
        console.log(`\nH2: Introduction`);
        if (result.peopleAlsoAsk.length > 0) {
            console.log(`\nH2: Common Questions`);
            result.peopleAlsoAsk.slice(0, 3).forEach(q => console.log(`  H3: ${q}`));
        }
        console.log(`\nH2: Related Topics`);
        result.relatedSearches.slice(0, 3).forEach(s => console.log(`  H3: ${s.replace(/\b\w/g, l => l.toUpperCase())}`));
        console.log(`\nH2: Conclusion`);

        return result;

    } catch (error: any) {
        console.error('❌ Error analyzing keyword:', error.message);
    }
}

// Get keyword from CLI
const keyword = process.argv[2];
if (!keyword) {
    console.log('Usage: npx tsx scripts/analyze-keywords.ts "keyword"');
    process.exit(1);
}

analyzeKeyword(keyword);
