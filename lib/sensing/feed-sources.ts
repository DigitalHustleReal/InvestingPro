/**
 * Feed Sources Registry
 *
 * All content sources are stored in DB, not hardcoded.
 * This module provides the DB schema and default seed sources.
 * Sources can be added/removed via admin UI.
 *
 * Sources organized by:
 *   Priority 1: High-authority Indian finance (ET, Moneycontrol, Mint, NDTV)
 *   Priority 2: Category-specific (MF, credit cards, tax, insurance)
 *   Priority 3: Community & social (Reddit, X/Twitter)
 *   Priority 4: Regulatory & government (RBI, SEBI, AMFI)
 *   Priority 5: International context (Investing.com, Bloomberg)
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
 * Default seed sources — used ONLY when `feed_sources` table is empty.
 * After first run, all sources come from Supabase `feed_sources` table.
 */
export const DEFAULT_FEED_SOURCES: FeedSource[] = [
  // ═══════════════════════════════════════════════════════════════
  // PRIORITY 1: Major Indian Finance News (high authority, daily updates)
  // ═══════════════════════════════════════════════════════════════

  {
    name: "Moneycontrol — Latest",
    url: "https://www.moneycontrol.com/rss/latestnews.xml",
    type: "rss",
    category: "news",
    priority: 1,
    active: true,
  },
  {
    name: "Moneycontrol — Personal Finance",
    url: "https://www.moneycontrol.com/rss/personalfinance.xml",
    type: "rss",
    category: "personal-finance",
    priority: 1,
    active: true,
  },
  {
    name: "Moneycontrol — Mutual Funds",
    url: "https://www.moneycontrol.com/rss/mutualfunds.xml",
    type: "rss",
    category: "mutual-funds",
    priority: 1,
    active: true,
  },
  {
    name: "ET Markets",
    url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
    type: "rss",
    category: "markets",
    priority: 1,
    active: true,
  },
  {
    name: "ET Personal Finance",
    url: "https://economictimes.indiatimes.com/wealth/rssfeeds/837555174.cms",
    type: "rss",
    category: "personal-finance",
    priority: 1,
    active: true,
  },
  {
    name: "ET Mutual Funds",
    url: "https://economictimes.indiatimes.com/mf/rssfeeds/48231286.cms",
    type: "rss",
    category: "mutual-funds",
    priority: 1,
    active: true,
  },
  {
    name: "Mint — Money",
    url: "https://www.livemint.com/rss/money",
    type: "rss",
    category: "personal-finance",
    priority: 1,
    active: true,
  },
  {
    name: "Mint — Insurance",
    url: "https://www.livemint.com/rss/insurance",
    type: "rss",
    category: "insurance",
    priority: 1,
    active: true,
  },
  {
    name: "NDTV Profit",
    url: "https://feeds.feedburner.com/ndtvprofit-latest",
    type: "rss",
    category: "markets",
    priority: 1,
    active: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // PRIORITY 2: Category-Specific Finance Sources
  // ═══════════════════════════════════════════════════════════════

  // Credit Cards & Banking
  {
    name: "CardExpert",
    url: "https://www.cardexpert.in/feed/",
    type: "rss",
    category: "credit-cards",
    priority: 2,
    active: true,
  },
  {
    name: "BankBazaar Blog",
    url: "https://blog.bankbazaar.com/feed/",
    type: "rss",
    category: "credit-cards",
    priority: 2,
    active: true,
  },
  {
    name: "Paisabazaar Blog",
    url: "https://www.paisabazaar.com/blog/feed/",
    type: "rss",
    category: "loans",
    priority: 2,
    active: true,
  },

  // Mutual Funds
  {
    name: "Value Research",
    url: "https://www.valueresearchonline.com/rss/",
    type: "rss",
    category: "mutual-funds",
    priority: 2,
    active: true,
  },
  {
    name: "AMFI Updates",
    url: "https://www.amfiindia.com/modules/RSSFeed/RSSFeed.aspx",
    type: "rss",
    category: "mutual-funds",
    priority: 2,
    active: true,
  },
  {
    name: "Morningstar India",
    url: "https://www.morningstar.in/posts/rss.aspx",
    type: "rss",
    category: "mutual-funds",
    priority: 2,
    active: true,
  },

  // Tax & Financial Planning
  {
    name: "ClearTax Blog",
    url: "https://cleartax.in/s/blog/feed",
    type: "rss",
    category: "tax",
    priority: 2,
    active: true,
  },
  {
    name: "Groww Blog",
    url: "https://groww.in/blog/feed/",
    type: "rss",
    category: "investing-basics",
    priority: 2,
    active: true,
  },
  {
    name: "Zerodha Varsity",
    url: "https://zerodha.com/varsity/feed/",
    type: "rss",
    category: "investing-basics",
    priority: 2,
    active: true,
  },

  // Fixed Deposits & Banking
  {
    name: "BankBazaar FD",
    url: "https://blog.bankbazaar.com/category/fixed-deposit/feed/",
    type: "rss",
    category: "fixed-deposits",
    priority: 2,
    active: true,
  },

  // Insurance
  {
    name: "Policybazaar Blog",
    url: "https://www.policybazaar.com/blog/feed/",
    type: "rss",
    category: "insurance",
    priority: 2,
    active: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // PRIORITY 3: International Context (India-relevant sections)
  // ═══════════════════════════════════════════════════════════════

  {
    name: "Investing.com India",
    url: "https://in.investing.com/rss/news.rss",
    type: "rss",
    category: "markets",
    priority: 3,
    active: true,
  },
  {
    name: "Google Finance — India",
    url: "https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNREpmTjNRU0JXVnVMVWRDS0FBUAE?hl=en-IN&gl=IN&ceid=IN:en",
    type: "rss",
    category: "markets",
    priority: 3,
    active: true,
  },
  {
    name: "Google News — Personal Finance India",
    url: "https://news.google.com/rss/search?q=personal+finance+india+when:7d&hl=en-IN&gl=IN&ceid=IN:en",
    type: "rss",
    category: "personal-finance",
    priority: 3,
    active: true,
  },
  {
    name: "Google News — Credit Card India",
    url: "https://news.google.com/rss/search?q=credit+card+india+when:7d&hl=en-IN&gl=IN&ceid=IN:en",
    type: "rss",
    category: "credit-cards",
    priority: 3,
    active: true,
  },
  {
    name: "Google News — Mutual Fund India",
    url: "https://news.google.com/rss/search?q=mutual+fund+SIP+india+when:7d&hl=en-IN&gl=IN&ceid=IN:en",
    type: "rss",
    category: "mutual-funds",
    priority: 3,
    active: true,
  },
  {
    name: "Google News — RBI Policy",
    url: "https://news.google.com/rss/search?q=RBI+repo+rate+policy+when:30d&hl=en-IN&gl=IN&ceid=IN:en",
    type: "rss",
    category: "regulatory",
    priority: 3,
    active: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // PRIORITY 4: Reddit & Community
  // ═══════════════════════════════════════════════════════════════

  {
    name: "r/IndiaInvestments",
    url: "https://www.reddit.com/r/IndiaInvestments/.json?limit=25&sort=hot",
    type: "api",
    category: "community",
    priority: 4,
    active: true,
  },
  {
    name: "r/CreditCardsIndia",
    url: "https://www.reddit.com/r/CreditCardsIndia/.json?limit=25&sort=hot",
    type: "api",
    category: "credit-cards",
    priority: 4,
    active: true,
  },
  {
    name: "r/IndiaPersonalFinance",
    url: "https://www.reddit.com/r/IndiaPersonalFinance/.json?limit=25&sort=hot",
    type: "api",
    category: "personal-finance",
    priority: 4,
    active: true,
  },
  {
    name: "r/MutualFundsIndia",
    url: "https://www.reddit.com/r/mutualfunds/.json?limit=25&sort=hot",
    type: "api",
    category: "mutual-funds",
    priority: 4,
    active: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // PRIORITY 5: Regulatory & Government
  // ═══════════════════════════════════════════════════════════════

  {
    name: "RBI Press Releases",
    url: "https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx",
    type: "scrape",
    category: "regulatory",
    priority: 5,
    active: true,
  },
  {
    name: "SEBI Circulars",
    url: "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListingAll=yes&sid=1&ssid=1&smession=No",
    type: "scrape",
    category: "regulatory",
    priority: 5,
    active: true,
  },
];
