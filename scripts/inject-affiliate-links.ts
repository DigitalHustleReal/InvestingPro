
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
            // Simple keyword matching: Partner Name
            // Avoid replacing already linked text like [HDFC](...)
            // Regex lookbehind is tricky in JS, so we'll use a safer approach:
            // Find "Partner Name" that is NOT followed by ] or ) inside a markdown link structure?
            // Actually, simplest is to look for ` Partner Name ` (words)
            
            const keyword = partner.name;
            const linkSlug = `${partner.slug}-auto-link-${article.id.substring(0, 8)}`;
            
            // Regex: \b(Keyword)\b(?![^\[]*\])(?![^\(]*\)) - rough attempt to avoid inside links
            // Better: Simple replace first occurrence if not already linked.
            
            // Check if already contains the specific link
            if (content.includes(`/api/out?link_id=`)) {
                // If we want to be sophisticated, we check if THIS partner is linked.
                // For MVP, if we find the text "HDFC Bank" and it's not part of a link...
            }

            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            const match = content.match(regex);

            if (match) {
                 // Check if it's already a markdown link
                 const index = match.index!;
                 const before = content.substring(Math.max(0, index - 2), index);
                 const after = content.substring(index + keyword.length, index + keyword.length + 2);
                 
                 if (before.includes('[') || after.includes(']')) {
                     // Likely already linked
                     continue;
                 }

                 console.log(`   Found '${keyword}' in '${article.title}'`);

                 // Create/Get Affiliate Link
                 // Check if link exists
                 const { data: existingLink } = await supabase
                    .from('affiliate_links')
                    .select('id')
                    .eq('slug', linkSlug)
                    .single();

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

                 // Perform Replacement (First occurrence only to be safe)
                 // Note: we use a direct string replacement for the first match found by regex
                 // to ensure we target what we matched.
                 
                 const replacement = `[${keyword}](/api/out?link_id=${linkId})`;
                 content = content.replace(regex, replacement);
                 hasChanges = true;
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
