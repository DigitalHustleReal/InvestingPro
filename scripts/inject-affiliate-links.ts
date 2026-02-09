
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Use Service Role for writing
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function injectLinks() {
    console.log("💉 Starting Affiliate Link Injection...");

    // 1. Fetch Partners
    const { data: partners } = await supabase
        .from('affiliate_partners')
        .select('*')
        .eq('is_active', true);

    if (!partners || partners.length === 0) {
        console.log("❌ No active partners found.");
        return;
    }

    console.log(`Checking ${partners.length} partners against articles...`);

    // 2. Fetch Articles
    const { data: articles } = await supabase
        .from('articles')
        .select('id, title, content, slug');

    if (!articles) {
        console.log("❌ No articles found.");
        return;
    }

    let updatedCount = 0;

    for (const article of articles) {
        let content = article.content || "";
        let hasChanges = false;
        
        // Skip if empty
        if (!content) continue;

        for (const partner of partners) {
            // Match against Partner Name AND Keywords
            const keywordsToMatch = [
                partner.name,
                ...(partner.keywords ? partner.keywords.split(',').map((k: string) => k.trim()) : [])
            ].filter(k => k.length > 0);

            for (const keyword of keywordsToMatch) {
                const linkSlug = `${partner.slug}-auto-link-${article.id.substring(0, 8)}`;
                
                // Avoid matching keywords that are too short (risk of false positives)
                if (keyword.length < 3) continue;

                const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                const match = content.match(regex);

                if (match) {
                     // Check if it's already a markdown link or part of one
                     const index = match.index!;
                     const contextBefore = content.substring(Math.max(0, index - 20), index);
                     const contextAfter = content.substring(index + keyword.length, index + keyword.length + 20);
                     
                     if (contextBefore.includes('[') && contextAfter.includes('](')) {
                         // Likely already linked in markdown
                         continue;
                     }

                     console.log(`   Found '${keyword}' for partner '${partner.name}' in '${article.title}'`);

                     // Create/Get Affiliate Link
                     const { data: existingLink } = await supabase
                        .from('affiliate_links')
                        .select('id')
                        .eq('slug', linkSlug)
                        .maybeSingle();

                     let linkId;
                     if (existingLink) {
                         linkId = existingLink.id;
                     } else {
                         // Create new link
                         const { data: newLink, error } = await supabase
                            .from('affiliate_links')
                            .insert({
                                partner_id: partner.id,
                                name: `Auto-Link in: ${article.title}`,
                                destination_url: `${partner.base_url}?${partner.tracking_param}=investingpro`,
                                slug: linkSlug,
                                placement: 'article_body',
                                is_active: true
                            })
                            .select()
                            .single();
                         
                         if (error) {
                             console.error(`Failed to create link: ${error.message}`);
                             continue;
                         }
                         linkId = newLink.id;
                     }

                     const replacement = `[${keyword}](/api/out?link_id=${linkId})`;
                     content = content.replace(regex, replacement);
                     hasChanges = true;
                     
                     // Only one link per partner per article
                     break; 
                }
            }
        }

        if (hasChanges) {
            const { error } = await supabase
                .from('articles')
                .update({ content: content })
                .eq('id', article.id);

            if (error) {
                console.error(`❌ Failed to update article ${article.title}: ${error.message}`);
            } else {
                console.log(`✅ Updated: ${article.title}`);
                updatedCount++;
            }
        }
    }

    console.log(`\n✨ Injection Complete. Updated ${updatedCount} articles.`);
}

injectLinks().catch(console.error);
