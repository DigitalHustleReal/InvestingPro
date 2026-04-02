import { createServiceClient } from '@/lib/supabase/service';
import ProductTicker from '@/components/common/ProductTicker';

/**
 * Live Product Ticker for Homepage
 *
 * Server component that fetches top mutual funds and credit cards,
 * then renders a scrolling ticker bar with real-time-looking data.
 */
export default async function LiveTicker() {
  let items: Array<{
    name: string;
    value: string;
    change: number;
    changeLabel?: string;
    href?: string;
    category?: string;
  }> = [];

  try {
    const supabase = createServiceClient();

    // Fetch top mutual funds with returns data
    const { data: funds } = await supabase
      .from('products')
      .select('slug, name, provider_name, features')
      .eq('category', 'mutual_fund')
      .eq('is_active', true)
      .limit(200);

    if (funds && funds.length > 0) {
      // Get funds with returns data, sort by absolute 1D change (most interesting)
      const fundItems = funds
        .map((f: any) => {
          const feat = f.features || {};
          const nav = Number(feat.nav) || 0;
          const return1Y = feat.returns_1y != null ? Number(feat.returns_1y) : null;
          const return1M = feat.returns_1m != null ? Number(feat.returns_1m) : null;
          if (!nav || return1Y === null) return null;

          // Clean name: remove "- Direct Plan - Growth" etc
          const cleanName = f.name
            .replace(/\s*-?\s*Direct\s+Plan\s*-?\s*Growth/i, '')
            .replace(/\s*-?\s*DIRECT\s+PLAN\s*-?\s*GROWTH/i, '')
            .trim()
            .substring(0, 30);

          return {
            name: cleanName,
            value: `₹${nav.toFixed(2)}`,
            change: return1M ?? return1Y,
            changeLabel: return1M !== null ? '1M' : '1Y',
            href: `/mutual-funds/${f.slug}`,
            category: 'MF' as const,
            sortKey: Math.abs(return1M ?? return1Y ?? 0),
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.sortKey - a.sortKey)
        .slice(0, 20)
        .map(({ sortKey, ...rest }: any) => rest);

      items = [...items, ...fundItems];
    }

    // Fetch credit cards
    const { data: cards } = await supabase
      .from('products')
      .select('slug, name, features, rating')
      .eq('category', 'credit_card')
      .eq('is_active', true)
      .limit(10);

    if (cards && cards.length > 0) {
      const cardItems = cards.map((c: any) => {
        const feat = c.features || {};
        return {
          name: c.name.substring(0, 25),
          value: `★ ${c.rating || feat.rating || '4.0'}`,
          change: 0,
          href: `/credit-cards/${c.slug}`,
          category: 'CC' as const,
        };
      });
      items = [...items, ...cardItems];
    }

  } catch (error) {
    // Silently fail — ticker is non-critical
    console.error('[LiveTicker] Failed to fetch data:', error);
  }

  if (items.length === 0) return null;

  return <ProductTicker items={items} speed={40} variant="compact" />;
}
