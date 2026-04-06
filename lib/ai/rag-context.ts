import { createClient } from "@/lib/supabase/client";

export interface RAGProduct {
  name: string;
  provider_name: string;
  category: string;
  features: Record<string, unknown> | null;
  pros: string[] | null;
  cons: string[] | null;
  rating: number | null;
  best_for: string | null;
  affiliate_link: string | null;
}

export interface RAGContext {
  products: RAGProduct[];
  calculatorLinks: { name: string; path: string }[];
  relatedArticles: { title: string; slug: string }[];
}

const CATEGORY_MAP: Record<string, string> = {
  "credit card": "credit-cards",
  "credit cards": "credit-cards",
  "mutual fund": "mutual-funds",
  "mutual funds": "mutual-funds",
  loan: "loans",
  loans: "loans",
  "home loan": "loans",
  "personal loan": "loans",
  "fixed deposit": "fixed-deposits",
  fd: "fixed-deposits",
  demat: "demat-accounts",
  insurance: "insurance",
  banking: "banking",
};

const CALCULATOR_MAP: Record<string, { name: string; path: string }[]> = {
  "credit-cards": [{ name: "EMI Calculator", path: "/calculators/emi" }],
  "mutual-funds": [
    { name: "SIP Calculator", path: "/calculators/sip" },
    { name: "SWP Calculator", path: "/calculators/swp" },
    { name: "Lumpsum Calculator", path: "/calculators/lumpsum" },
  ],
  loans: [
    { name: "EMI Calculator", path: "/calculators/emi" },
    { name: "Home Loan Calculator", path: "/calculators/home-loan" },
  ],
  "fixed-deposits": [{ name: "FD Calculator", path: "/calculators/fd" }],
  insurance: [
    { name: "Term Insurance Calculator", path: "/calculators/term-insurance" },
  ],
};

function detectCategory(topic: string): string | null {
  const lower = topic.toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) return category;
  }
  return null;
}

export async function fetchRAGContext(
  topic: string,
  category?: string,
): Promise<RAGContext> {
  const supabase = createClient();
  const detectedCategory = category || detectCategory(topic) || "";

  // Fetch relevant products
  let products: RAGProduct[] = [];
  if (detectedCategory) {
    const { data } = await supabase
      .from("products")
      .select(
        "name, provider_name, category, features, pros, cons, rating, best_for, affiliate_link",
      )
      .eq("category", detectedCategory)
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .limit(10);
    products = (data || []) as RAGProduct[];
  }

  // If no category match, try fuzzy search on name
  if (products.length === 0) {
    const keywords = topic
      .split(" ")
      .filter((w) => w.length > 3)
      .slice(0, 3);
    for (const kw of keywords) {
      const { data } = await supabase
        .from("products")
        .select(
          "name, provider_name, category, features, pros, cons, rating, best_for, affiliate_link",
        )
        .ilike("name", `%${kw}%`)
        .eq("is_active", true)
        .limit(10);
      if (data && data.length > 0) {
        products = data as RAGProduct[];
        break;
      }
    }
  }

  // Fetch related published articles
  const { data: articles } = await supabase
    .from("articles")
    .select("title, slug")
    .eq("status", "published")
    .ilike("title", `%${topic.split(" ").slice(0, 2).join("%")}%`)
    .limit(5);

  return {
    products,
    calculatorLinks: CALCULATOR_MAP[detectedCategory] || [],
    relatedArticles: (articles || []) as { title: string; slug: string }[],
  };
}
