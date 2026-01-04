/**
 * Generate All Versus Pages Programmatically
 * Creates SEO-optimized comparison pages for top product combinations
 */

import { createClient } from '@supabase/supabase-js';
import { aiService } from '../lib/ai-service';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface VersusPage {
    slug: string; // e.g., "hdfc-regalia-vs-axis-magnus"
    product1_id: string;
    product2_id: string;
    product1_name: string;
    product2_name: string;
    category: string;
    title: string;
    meta_description: string;
    verdict: string;
    winner: string; // product1_id or product2_id
    difference_score: number; // How different they are (0-100)
}

async function generateVersusPages() {
    console.log('🚀 Generating programmatic versus pages...\n');
    
    // 1. Get all products grouped by category
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });
    
    if (error || !products) {
        console.error('Failed to fetch products:', error);
        return;
    }
    
    // 2. Group by category
    const byCategory: Record<string, any[]> = {};
    products.forEach(p => {
        if (!byCategory[p.category]) byCategory[p.category] = [];
        byCategory[p.category].push(p);
    });
    
    const versusPages: VersusPage[] = [];
    let generated = 0;
    
    // 3. Generate comparisons for each category
    for (const [category, items] of Object.entries(byCategory)) {
        console.log(`\n📦 ${category.toUpperCase()} (${items.length} products)`);
        
        // Generate top combinations (similar tier products)
        for (let i = 0; i < Math.min(items.length, 10); i++) {
            for (let j = i + 1; j < Math.min(items.length, 10); j++) {
                const p1 = items[i];
                const p2 = items[j];
                
                // Skip if rating difference is too high (not a fair comparison)
                const ratingDiff = Math.abs((p1.rating || 0) - (p2.rating || 0));
                if (ratingDiff > 1.5) continue;
                
                const slug = `${p1.slug}-vs-${p2.slug}`;
                process.stdout.write(`  ${p1.name} vs ${p2.name}... `);
                
                try {
                    // Generate AI verdict
                    const prompt = `
Compare these two ${category.replace('_', ' ')} products in India:

Product 1: ${p1.name}
- Provider: ${p1.provider_name}
- Rating: ${p1.rating}/5
- Description: ${p1.description}
- Features: ${JSON.stringify(p1.features)}

Product 2: ${p2.name}
- Provider: ${p2.provider_name}
- Rating: ${p2.rating}/5
- Description: ${p2.description}
- Features: ${JSON.stringify(p2.features)}

Write a 300-word expert comparison verdict. Include:
1. Key differences
2. Which is better for whom
3. Final recommendation

Be specific, data-driven, and helpful. Return plain text (no markdown).
`;

                    const verdict = await aiService.generate(prompt);
                    
                    // Determine winner (higher rating or trust score)
                    const winner = (p1.trust_score || p1.rating || 0) > (p2.trust_score || p2.rating || 0) 
                        ? p1.slug 
                        : p2.slug;
                    
                    versusPages.push({
                        slug,
                        product1_id: p1.slug,
                        product2_id: p2.slug,
                        product1_name: p1.name,
                        product2_name: p2.name,
                        category,
                        title: `${p1.name} vs ${p2.name} (2026): Which Is Better?`,
                        meta_description: `Compare ${p1.name} and ${p2.name}. See features, fees, rewards, and expert verdict to choose the best ${category.replace('_', ' ')}.`,
                        verdict: verdict.trim(),
                        winner,
                        difference_score: Math.abs((p1.rating || 0) - (p2.rating || 0)) * 20
                    });
                    
                    console.log('✅');
                    generated++;
                    
                    // Rate limit
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                } catch (error: any) {
                    console.log(`❌ ${error.message}`);
                }
                
                // Limit total comparisons per category to avoid too many pages
                if (versusPages.filter(vp => vp.category === category).length >= 20) {
                    break;
                }
            }
            
            if (versusPages.filter(vp => vp.category === category).length >= 20) {
                break;
            }
        }
    }
    
    console.log(`\n✨ Generated ${generated} versus pages!`);
    
    // 4. Save to database
    console.log('\n💾 Saving to database...');
    
    const { error: insertError } = await supabase
        .from('versus_pages')
        .upsert(versusPages, { onConflict: 'slug' });
    
    if (insertError) {
        console.error('❌ Failed to save:', insertError);
    } else {
        console.log(`✅ Saved ${versusPages.length} pages to database`);
    }
    
    // 5. Generate sitemap entries
    console.log('\n🗺️ Generating sitemap...');
    const sitemapEntries = versusPages.map(vp => 
        `\n  <url>\n    <loc>https://investingpro.in/compare/${vp.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    ).join('');
    
    const sitemapPath = join(process.cwd(), 'public', 'sitemap-versus.xml');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapEntries}
</urlset>`;
    
    writeFileSync(sitemapPath, sitemap);
    console.log(`✅ Sitemap saved: ${sitemapPath}`);
    
    // 6. Generate manifest file
    const manifestPath = join(process.cwd(), 'public', 'versus-manifest.json');
    const manifest = {
        generated_at: new Date().toISOString(),
        total_pages: versusPages.length,
        by_category: Object.entries(byCategory).map(([cat, items]) => ({
            category: cat,
            products: items.length,
            comparisons: versusPages.filter(vp => vp.category === cat).length
        })),
        pages: versusPages.map(vp => ({
            url: `/compare/${vp.slug}`,
            title: vp.title,
            category: vp.category,
            winner: vp.winner
        }))
    };
    
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest saved: ${manifestPath}`);
    
    // 7. Summary
    console.log('\n📊 Summary:');
    console.log(`✅ Total pages: ${versusPages.length}`);
    console.log(`📁 Categories: ${Object.keys(byCategory).length}`);
    console.log(`🏆 Top comparison: ${versusPages[0]?.title || 'None'}`);
    console.log('\n🎉 Programmatic SEO complete!');
}

generateVersusPages().catch(console.error);
