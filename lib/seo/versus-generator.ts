
import { createClient } from '@/lib/supabase/service';
import { productService } from '@/lib/products/product-service';
import { getComparisonVerdict } from '@/lib/products/comparison-service';
import { logger } from '@/lib/logger';

const supabase = createClient();

/**
 * Systematic SEO Engine for Versus Pages
 * Automatically generates comparison pages for high-value product pairs.
 */
export class VersusGenerator {
    
    /**
     * Generate pairs for a specific category and ensure they exist in DB
     */
    async generatePairsForCategory(category: string, limit: number = 50): Promise<{ created: number; skipped: number; errors: number }> {
        logger.info(`Starting Versus Generation for ${category}...`);
        
        // 1. Fetch all products in category
        const { data: products } = await supabase
            .from('products') // Assuming central products table or use specific tables if separated
            .select('*')
            .eq('category', category)
            .limit(100); // Limit pool size for now

        if (!products || products.length < 2) {
            logger.warn(`Not enough products in ${category} to compare.`);
            return { created: 0, skipped: 0, errors: 0 };
        }

        let created = 0;
        let skipped = 0;
        let errors = 0;

        // 2. Generate all unique pairs
        for (let i = 0; i < products.length; i++) {
            for (let j = i + 1; j < products.length; j++) {
                if (created >= limit) break;

                const p1 = products[i];
                const p2 = products[j];
                
                // Sort slugs to ensure A-vs-B is same as B-vs-A
                const sortedSlugs = [p1.slug, p2.slug].sort();
                const slug = `${sortedSlugs[0]}-vs-${sortedSlugs[1]}`;

                try {
                    // 3. Check if page already exists
                    const { data: existing } = await supabase
                        .from('versus_pages')
                        .select('id')
                        .eq('slug', slug)
                        .single();

                    if (existing) {
                        skipped++;
                        continue;
                    }

                    // 4. Create new Versus Page
                    logger.info(`Generating ${slug}...`);
                    
                    // Generate AI Content
                    // Note: We cast to 'any' because product service types might need alignment
                    const verdict = await getComparisonVerdict(p1 as any, p2 as any);
                    
                    const title = `${p1.name} vs ${p2.name} Comparison (2026): Key Differences & Winner`;
                    const description = `Compare ${p1.name} and ${p2.name} side-by-side. We analyze fees, rewards, and hidden charges to help you decide.`;

                    // 5. Insert into DB
                    const { error } = await supabase
                        .from('versus_pages')
                        .insert({
                            slug,
                            product1_id: p1.slug, // Storing slug as ID reference for now, or UUID if schema requires
                            product2_id: p2.slug,
                            category,
                            title,
                            meta_description: description,
                            verdict,
                            is_programmatic: true,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });

                    if (error) throw error;
                    
                    created++;
                    // Rate limiting protection
                    await new Promise(r => setTimeout(r, 2000));
                    
                } catch (err) {
                    logger.error(`Failed to generate ${slug}`, err as Error);
                    errors++;
                }
            }
        }

        return { created, skipped, errors };
    }

    /**
     * Run batch generation across all categories
     */
    async runBatch(limitPerCategory: number = 10) {
        const categories = ['credit_cards', 'mutual_funds']; // Add more as needed
        const results = {};

        for (const cat of categories) {
            results[cat] = await this.generatePairsForCategory(cat, limitPerCategory);
        }

        return results;
    }
}
