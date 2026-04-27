import { createClient } from "@/lib/supabase/static";

/**
 * Google News Sitemap
 *
 * Requirements:
 * - Only articles published in the last 48 hours (Google News spec)
 * - Maximum 1,000 URLs
 * - Must include publication name, language, title, publication_date
 *
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 */
export const revalidate = 3600; // ISR: rebuild hourly

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in";

  try {
    const supabase = createClient();

    // Google News requires articles from last 48 hours
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data: articles } = await supabase
      .from("articles")
      .select("slug, title, published_at, tags, category")
      .eq("status", "published")
      .gte("published_at", twoDaysAgo)
      .order("published_at", { ascending: false })
      .limit(1000);

    const urls = (articles || [])
      .map((article) => {
        const pubDate = new Date(article.published_at).toISOString();
        const keywords = (article.tags || []).slice(0, 5).join(", ");

        return `  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>InvestingPro</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
      ${keywords ? `<news:keywords>${escapeXml(keywords)}</news:keywords>` : ""}
    </news:news>
  </url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=900, s-maxage=900",
      },
    });
  } catch {
    // Return empty valid sitemap on error
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`,
      { headers: { "Content-Type": "application/xml" } },
    );
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
