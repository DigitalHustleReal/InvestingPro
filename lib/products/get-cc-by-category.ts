import { getCreditCardsServer } from './get-credit-cards-server';
import { RichProduct } from '@/types/rich-product';

/**
 * Fetch credit cards filtered by a category keyword.
 * Falls back to all cards if no matches (fail open strategy).
 */
export async function getCreditCardsByCategory(keywords: string[]): Promise<RichProduct[]> {
    const all = await getCreditCardsServer();
    const lower = keywords.map(k => k.toLowerCase());

    const filtered = all.filter(card => {
        const searchable = [
            card.name,
            card.description,
            card.bestFor,
            card.category,
            JSON.stringify(card.features),
            JSON.stringify(card.pros),
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return lower.some(kw => searchable.includes(kw));
    });

    // Return filtered if we found matches, otherwise return all (graceful degradation)
    return filtered.length > 0 ? filtered : all;
}
