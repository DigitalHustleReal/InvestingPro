/**
 * Feed Sources Registry
 *
 * All content sources are stored in DB, not hardcoded.
 * This module provides the DB schema and default seed sources.
 * Sources can be added/removed via admin UI.
 */

export interface FeedSource {
  id?: string;
  name: string;
  url: string;
  type: "rss" | "api" | "scrape";
  category: string;
  priority: number; // 1=highest
  active: boolean;
  lastFetched?: string;
  itemCount?: number;
}

/**
 * Default seed sources — used ONLY for initial setup.
 * After first run, all sources come from Supabase `feed_sources` table.
 */
export const DEFAULT_FEED_SOURCES: FeedSource[] = [
  // Indian Finance News
  {
    name: "ET Markets",
    url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
    type: "rss",
    category: "markets",
    priority: 1,
    active: true,
  },
  {
    name: "Moneycontrol",
    url: "https://www.moneycontrol.com/rss/latestnews.xml",
    type: "rss",
    category: "news",
    priority: 1,
    active: true,
  },
  {
    name: "Mint",
    url: "https://www.livemint.com/rss/money",
    type: "rss",
    category: "personal-finance",
    priority: 1,
    active: true,
  },
  {
    name: "RBI Press",
    url: "https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx",
    type: "scrape",
    category: "regulatory",
    priority: 1,
    active: true,
  },

  // Mutual Funds
  {
    name: "AMFI Updates",
    url: "https://www.amfiindia.com/modules/RSSFeed/RSSFeed.aspx",
    type: "rss",
    category: "mutual-funds",
    priority: 2,
    active: true,
  },
  {
    name: "Value Research",
    url: "https://www.valueresearchonline.com/rss/",
    type: "rss",
    category: "mutual-funds",
    priority: 2,
    active: true,
  },

  // Credit Cards & Banking
  {
    name: "CardExpert",
    url: "https://www.cardexpert.in/feed/",
    type: "rss",
    category: "credit-cards",
    priority: 2,
    active: true,
  },

  // Reddit
  {
    name: "r/IndianPersonalFinance",
    url: "https://www.reddit.com/r/IndiaInvestments/.json?limit=25",
    type: "api",
    category: "community",
    priority: 3,
    active: true,
  },
  {
    name: "r/CreditCardsIndia",
    url: "https://www.reddit.com/r/CreditCardsIndia/.json?limit=25",
    type: "api",
    category: "credit-cards",
    priority: 3,
    active: true,
  },

  // Tax & Regulatory
  {
    name: "ClearTax Blog",
    url: "https://cleartax.in/s/blog/feed",
    type: "rss",
    category: "tax",
    priority: 2,
    active: true,
  },
];
