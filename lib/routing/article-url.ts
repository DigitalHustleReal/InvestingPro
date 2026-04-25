/**
 * Canonical article URL helper.
 *
 * Phase 3a (Apr 2026): articles with a real DB category live at
 * /[urlCat]/learn/[slug] (NerdWallet-style). Articles whose category maps
 * to "learn" (cross-cutting personal-finance content) keep the legacy
 * flat /articles/[slug] path.
 *
 * Use this single helper everywhere we emit an article link — pages,
 * sitemap, news sitemap, RSS feed, related-article lists, search results.
 * That keeps internal links one hop ahead of the 308 redirect chain.
 */

import { dbCategoryToUrl } from "./category-map";

type ArticleLike = {
  slug: string;
  category?: string | null;
};

export function articleUrl(article: ArticleLike): string {
  const urlCat = dbCategoryToUrl(article.category);
  if (article.category && urlCat !== "learn") {
    return `/${urlCat}/learn/${article.slug}`;
  }
  return `/articles/${article.slug}`;
}
