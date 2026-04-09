/**
 * Content Sensor — the autonomous brain
 *
 * SENSE → SCORE → DECIDE → return top topics to generate
 *
 * Called by cron job every 4 hours. No human input needed.
 * Feed sources come from DB (not hardcoded).
 */

import { createClient } from "@/lib/supabase/client";
import { DEFAULT_FEED_SOURCES, type FeedSource } from "./feed-sources";
import {
  fetchRSSFeed,
  fetchRedditFeed,
  fetchGoogleTrends,
  fetchXFinanceFeeds,
  type FeedItem,
} from "./feed-ingester";
import { scoreTopics, type ScoredTopic } from "./topic-scorer";
import { logger } from "@/lib/logger";

export interface SensorResult {
  topicsFound: number;
  topicsScoredAboveThreshold: number;
  topTopics: ScoredTopic[];
  sourcesChecked: number;
  errors: string[];
}

/**
 * Run the full sensing pipeline
 *
 * @param maxTopics - max topics to return (default 10)
 * @param minScore - minimum score threshold (default 12)
 */
export async function runContentSensor(
  maxTopics: number = 10,
  minScore: number = 12,
): Promise<SensorResult> {
  const errors: string[] = [];
  const supabase = createClient();

  // Step 1: Get feed sources from DB (fall back to defaults)
  let sources: FeedSource[] = [];
  try {
    const { data } = await supabase
      .from("feed_sources")
      .select("*")
      .eq("active", true)
      .order("priority", { ascending: true });

    sources = (data as FeedSource[]) || [];
  } catch {
    // Table might not exist yet — use defaults
  }

  if (sources.length === 0) {
    sources = DEFAULT_FEED_SOURCES;
    logger.info(
      "Using default feed sources (feed_sources table empty or missing)",
    );
  }

  // Step 2: Fetch all feeds in parallel
  const allItems: FeedItem[] = [];

  const fetchPromises = sources.map(async (source) => {
    try {
      let items: FeedItem[] = [];
      const id = source.id || source.name;

      if (source.type === "rss") {
        items = await fetchRSSFeed(
          id,
          source.name,
          source.url,
          source.category,
        );
      } else if (source.type === "api" && source.url.includes("reddit.com")) {
        items = await fetchRedditFeed(
          id,
          source.name,
          source.url,
          source.category,
        );
      }

      return items;
    } catch (err) {
      errors.push(`${source.name}: ${(err as Error).message?.slice(0, 50)}`);
      return [];
    }
  });

  // Also fetch Google Trends and X/Twitter finance accounts
  fetchPromises.push(fetchGoogleTrends("IN"));
  fetchPromises.push(fetchXFinanceFeeds());

  const results = await Promise.allSettled(fetchPromises);
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Step 2b: Inject financial calendar events as high-priority topics
  try {
    const calendarTopics = getUpcomingFinancialEvents();
    allItems.push(...calendarTopics);
    if (calendarTopics.length > 0) {
      logger.info(
        `Content Sensor: injected ${calendarTopics.length} calendar event topics`,
      );
    }
  } catch {
    // Calendar injection is non-critical
  }

  logger.info(
    `Content Sensor: fetched ${allItems.length} items from ${sources.length} sources`,
  );

  // Step 3: Get existing article slugs for dedup
  const { data: existingArticles } = await supabase
    .from("articles")
    .select("slug")
    .limit(1000);

  const existingSlugs = new Set<string>(
    (existingArticles || []).map((a: { slug: string }) => a.slug),
  );

  // Step 4: Score and rank topics
  const scored = scoreTopics(allItems, existingSlugs);
  const aboveThreshold = scored.filter((t) => t.score >= minScore);
  const topTopics = aboveThreshold.slice(0, maxTopics);

  logger.info(
    `Content Sensor: ${scored.length} scored, ${aboveThreshold.length} above threshold, returning top ${topTopics.length}`,
  );

  return {
    topicsFound: allItems.length,
    topicsScoredAboveThreshold: aboveThreshold.length,
    topTopics,
    sourcesChecked: sources.length + 3, // +Google Trends +X/Twitter +Calendar
    errors,
  };
}

// ─── Financial Calendar Integration ──────────────────────────────────────────

interface CalendarEvent {
  name: string;
  date: string; // MM-DD or YYYY-MM-DD
  category: string;
  topics: string[];
  leadDays: number; // publish this many days before
}

const FINANCIAL_CALENDAR: CalendarEvent[] = [
  // Tax deadlines
  {
    name: "Advance Tax Q1",
    date: "06-15",
    category: "tax",
    leadDays: 21,
    topics: [
      "How to Calculate Advance Tax for Salaried Employees",
      "Advance Tax Due Date June 15 — Who Needs to Pay",
    ],
  },
  {
    name: "ITR Filing Deadline",
    date: "07-31",
    category: "tax",
    leadDays: 45,
    topics: [
      "How to File ITR Online Step by Step Guide",
      "ITR Form Selection — ITR-1 vs ITR-2 vs ITR-3 Explained",
      "Last Date to File ITR — Penalties for Late Filing",
      "Best Tax Saving Investments Before March 31",
    ],
  },
  {
    name: "Advance Tax Q2",
    date: "09-15",
    category: "tax",
    leadDays: 21,
    topics: ["Advance Tax Second Instalment Due September 15"],
  },
  {
    name: "Tax Saving Deadline",
    date: "03-31",
    category: "tax",
    leadDays: 60,
    topics: [
      "Best Tax Saving Options Under Section 80C Before March 31",
      "ELSS vs PPF vs NPS — Which Tax Saver is Best",
      "Last Minute Tax Saving Tips Before Financial Year Ends",
    ],
  },
  {
    name: "Advance Tax Q3",
    date: "12-15",
    category: "tax",
    leadDays: 21,
    topics: ["Advance Tax Third Instalment Due December 15"],
  },
  {
    name: "Advance Tax Q4",
    date: "03-15",
    category: "tax",
    leadDays: 21,
    topics: ["Final Advance Tax Payment Due March 15"],
  },

  // Festivals (credit card offers, shopping)
  {
    name: "Diwali",
    date: "10-20",
    category: "credit-cards",
    leadDays: 30,
    topics: [
      "Best Credit Card Offers for Diwali Shopping",
      "Diwali Sale — How to Maximize Cashback and Rewards",
      "Top 10 Diwali Offers on Amazon and Flipkart Credit Cards",
    ],
  },
  {
    name: "Dussehra / Navratri",
    date: "10-02",
    category: "credit-cards",
    leadDays: 21,
    topics: [
      "Best Navratri Offers on Credit Cards and Loans",
      "Vehicle Loan Offers During Navratri Festival Season",
    ],
  },
  {
    name: "Dhanteras",
    date: "10-29",
    category: "investing-basics",
    leadDays: 14,
    topics: [
      "Dhanteras — Should You Buy Gold or Invest in Gold ETF",
      "Digital Gold vs Physical Gold on Dhanteras",
    ],
  },
  {
    name: "Akshaya Tritiya",
    date: "05-01",
    category: "investing-basics",
    leadDays: 14,
    topics: ["Akshaya Tritiya Gold Buying Guide — Physical vs Digital vs SGB"],
  },
  {
    name: "New Year",
    date: "01-01",
    category: "personal-finance",
    leadDays: 14,
    topics: [
      "New Year Financial Resolutions — 10 Money Goals for 2026",
      "How to Create a Financial Plan for the New Year",
    ],
  },
  {
    name: "Republic Day Sale",
    date: "01-26",
    category: "credit-cards",
    leadDays: 7,
    topics: ["Republic Day Sale — Best Credit Card Cashback Offers"],
  },
  {
    name: "Holi",
    date: "03-14",
    category: "credit-cards",
    leadDays: 7,
    topics: ["Holi Shopping Offers — Best Deals on Credit Cards"],
  },
  {
    name: "Amazon / Flipkart Sale",
    date: "10-08",
    category: "credit-cards",
    leadDays: 14,
    topics: [
      "Amazon Great Indian Festival — Best Credit Card for Maximum Discount",
      "Flipkart Big Billion Days — Which Card Gives Best Cashback",
    ],
  },
  {
    name: "Christmas + Year End",
    date: "12-25",
    category: "credit-cards",
    leadDays: 14,
    topics: [
      "Year End Credit Card Offers and Holiday Shopping Deals",
      "Year End Financial Checklist — Tax Review Before December 31",
    ],
  },

  // RBI MPC Meetings (6x/year)
  {
    name: "RBI MPC Feb",
    date: "02-05",
    category: "loans",
    leadDays: 7,
    topics: [
      "RBI MPC Meeting February — Will Repo Rate Change",
      "Impact of Repo Rate on Home Loan and Personal Loan EMI",
    ],
  },
  {
    name: "RBI MPC Apr",
    date: "04-07",
    category: "loans",
    leadDays: 7,
    topics: ["RBI April Policy — Repo Rate Impact on Your EMI"],
  },
  {
    name: "RBI MPC Jun",
    date: "06-06",
    category: "loans",
    leadDays: 7,
    topics: ["RBI June Monetary Policy — Rate Cut or Hold"],
  },
  {
    name: "RBI MPC Aug",
    date: "08-06",
    category: "loans",
    leadDays: 7,
    topics: ["RBI August Policy — Should You Lock FD Rates Now"],
  },
  {
    name: "RBI MPC Oct",
    date: "10-07",
    category: "loans",
    leadDays: 7,
    topics: ["RBI October Policy — Festival Season Loan Rate Outlook"],
  },
  {
    name: "RBI MPC Dec",
    date: "12-04",
    category: "loans",
    leadDays: 7,
    topics: ["RBI December Policy — Year End Rate Decision Impact"],
  },

  // Budget
  {
    name: "Union Budget",
    date: "02-01",
    category: "tax",
    leadDays: 14,
    topics: [
      "Union Budget 2026 — Key Expectations for Taxpayers",
      "Budget 2026 — What Changes for Mutual Fund Investors",
      "Budget Impact on Credit Card Rewards and Charges",
    ],
  },

  // Financial year events
  {
    name: "New Financial Year",
    date: "04-01",
    category: "personal-finance",
    leadDays: 7,
    topics: [
      "New Financial Year Checklist — What to Do in April",
      "Best SIP to Start in New Financial Year",
      "FD Rate Changes in April — Where to Park Money Now",
    ],
  },

  // Insurance
  {
    name: "Health Insurance Renewal",
    date: "03-15",
    category: "insurance",
    leadDays: 30,
    topics: [
      "Health Insurance Renewal Tips — How to Avoid Premium Hike",
      "Best Health Insurance Plans India 2026 Comparison",
    ],
  },
];

/**
 * Get upcoming financial events and convert them to FeedItems
 * so they flow through the same scoring pipeline as RSS/Reddit.
 */
function getUpcomingFinancialEvents(): FeedItem[] {
  const now = new Date();
  const items: FeedItem[] = [];

  for (const event of FINANCIAL_CALENDAR) {
    const [month, day] = event.date.split("-").map(Number);
    const eventDate = new Date(now.getFullYear(), month - 1, day);

    // If event already passed this year, check next year
    if (eventDate < now) {
      eventDate.setFullYear(eventDate.getFullYear() + 1);
    }

    const daysUntil = Math.floor(
      (eventDate.getTime() - now.getTime()) / 86400000,
    );

    // Only inject if within the lead window
    if (daysUntil <= event.leadDays && daysUntil >= 0) {
      for (const topic of event.topics) {
        items.push({
          sourceId: `calendar-${event.name.toLowerCase().replace(/\s+/g, "-")}`,
          sourceName: `Financial Calendar: ${event.name}`,
          title: topic,
          url: "",
          summary: `${event.name} is ${daysUntil} days away. High-intent seasonal content opportunity.`,
          publishedAt: now.toISOString(),
          category: event.category,
          raw: { calendarEvent: true, daysUntil, eventName: event.name },
        });
      }
    }
  }

  return items;
}
