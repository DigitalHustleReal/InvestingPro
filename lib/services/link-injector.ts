
import { createClient } from '@/lib/supabase/client';

/**
 * Service to inject affiliate links into content
 */
export class LinkInjector {
    private supabase = createClient();

    /**
     * Inject affiliate links into markdown content
     * @param content Markdown string
     * @returns Markdown string with links injected
     */
    async injectLinks(content: string): Promise<string> {
        // 1. Fetch active affiliate products
        const { data: products } = await this.supabase
            .from('products')
            .select('name, affiliate_link, slug')
            .not('affiliate_link', 'is', null);

        if (!products || products.length === 0) return content;

        let processedContent = content;

        // 2. Sort by name length (descending) to prevent partial matching issues
        // e.g. Match "HDFC Regalia Gold" before "HDFC Regalia"
        const sortedProducts = (products as any[] || []).filter((p: any) => p.name).sort((a: any, b: any) => (b.name?.length || 0) - (a.name?.length || 0));

        // 3. Iterate and replace (Case-insensitive, global)
        // We use a temporary placeholder to avoid double-linking
        const placeholders: Record<string, string> = {};

        for (const product of sortedProducts) {
            if (!product.affiliate_link) continue;

            const link = product.affiliate_link;
            const name = product.name;
            const regex = new RegExp(`\\b${this.escapeRegExp(name)}\\b(?![\\]\\(])`, 'gi'); // Avoid mapping if already in link

            // Check if content has the keyword
            if (regex.test(processedContent)) {
                 const placeholder = `__LINK__${product.slug}__`;
                 placeholders[placeholder] = `[${name}](${link})`;
                 
                 // Replace only the FIRST occurrence to avoid spamming links
                 processedContent = processedContent.replace(regex, placeholder);
            }
        }

        // 4. Restore placeholders
        for (const [placeholder, link] of Object.entries(placeholders)) {
            processedContent = processedContent.replace(new RegExp(placeholder, 'g'), link);
        }

        return processedContent;
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

export const linkInjector = new LinkInjector();
