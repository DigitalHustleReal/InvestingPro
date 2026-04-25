import { MetadataRoute } from "next";

/**
 * Robots.txt Configuration
 * Controls search engine crawling
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in";

  // 2026 GEO policy: allow citation-surface crawlers even when they
  // double as training crawlers. GPTBot now powers ChatGPT web search
  // (which has 900M weekly users); blocking it means we're invisible to
  // that surface. Same for ClaudeBot (Claude web feature) and Google-
  // Extended (Gemini search citations). We still block training-only
  // scrapers (CCBot, Bytespider, Diffbot).
  //
  // See `claude-seo:seo-geo` skill for rationale + brand-mention
  // correlation data (Ahrefs Dec 2025: brand mentions correlate 3x more
  // with AI visibility than backlinks).
  return {
    rules: [
      // Default: all search engines
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          "/preview/",
          "/embed/",
        ],
      },
      // Google
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // OpenAI surfaces — allow all (search + browsing + training).
      // Blocking GPTBot also blocks ChatGPT web search inclusion.
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // Anthropic surfaces — allow all. ClaudeBot powers Claude web
      // citations; anthropic-ai is the training crawler (still allowing
      // since brand mentions in training corpora compound).
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // Perplexity
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // Apple Intelligence / Siri
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // Google Gemini — gates Search Generative + AI Overviews citations.
      // (It's only Gemini training that this controls in some regions;
      // citation impact is the trade-off we accept for AIO inclusion.)
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // Microsoft / Bing Copilot
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: "Bingbot-Adv",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // Block: pure training scrapers with no citation surface
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "Bytespider",
        disallow: ["/"],
      },
      {
        userAgent: "Diffbot",
        disallow: ["/"],
      },
      // Block: AI scrapers that ignore licensing
      {
        userAgent: "FacebookBot",
        disallow: ["/"],
      },
      {
        userAgent: "ImagesiftBot",
        disallow: ["/"],
      },
      {
        userAgent: "Omgilibot",
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
