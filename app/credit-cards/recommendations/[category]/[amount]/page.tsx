import { logger } from "@/lib/logger";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SpendingPatternPage from "@/components/credit-cards/SpendingPatternPage";
import { createServiceClient } from "@/lib/supabase/service";

interface PageProps {
  params: Promise<{
    category: string;
    amount: string;
  }>;
}

// Map URL categories to spending input fields
const CATEGORY_MAP: Record<
  string,
  keyof {
    groceries: number;
    fuel: number;
    travel: number;
    onlineShopping: number;
    dining: number;
    utilities: number;
    other: number;
  }
> = {
  groceries: "groceries",
  fuel: "fuel",
  travel: "travel",
  "online-shopping": "onlineShopping",
  dining: "dining",
  utilities: "utilities",
  other: "other",
};

const CATEGORY_LABELS: Record<string, string> = {
  groceries: "Groceries & Supermarkets",
  fuel: "Fuel & Petrol",
  travel: "Travel & Flights",
  "online-shopping": "Online Shopping",
  dining: "Dining & Restaurants",
  utilities: "Utilities & Bills",
  other: "Other Expenses",
};

/**
 * Generate static params for spending-based recommendation pages
 * Creates pages for common spending categories and amounts
 */
export async function generateStaticParams() {
  const categories = [
    "groceries",
    "fuel",
    "travel",
    "online-shopping",
    "dining",
    "utilities",
  ];
  // Common spending amounts in ₹
  const amounts = [
    5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000,
    150000, 200000,
  ];

  const params = categories.flatMap((category) =>
    amounts.map((amount) => ({
      category,
      amount: amount.toString(),
    })),
  );

  logger.info(
    `[generateStaticParams] Generating ${params.length} spending-based pages`,
  );
  return params;
}

// Force static generation with ISR
export const dynamic = "force-static";
// Revalidate daily (spending patterns don't change as frequently as product data)
export const revalidate = 86400; // 24 hours

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category, amount } = resolvedParams;
  const categoryLabel = CATEGORY_LABELS[category] || category;
  const amountNum = parseInt(amount) || 0;
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountNum);

  return {
    title: `Best Credit Cards for ${categoryLabel} - Spend ${formattedAmount}/Month`,
    description: `Find the best credit cards if you spend ${formattedAmount}/month on ${categoryLabel.toLowerCase()}. Compare rewards, fees, and features. Apply instantly.`,
    openGraph: {
      title: `Best Credit Cards for ${categoryLabel} - ${formattedAmount}/Month`,
      description: `Get personalized credit card recommendations based on your ${categoryLabel.toLowerCase()} spending. Maximize your rewards.`,
    },
  };
}

export default async function SpendingPatternDetailPage({ params }: PageProps) {
  const { category, amount } = await params;

  if (!CATEGORY_MAP[category]) {
    notFound();
  }

  const amountNum = parseInt(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    notFound();
  }

  const spendingField = CATEGORY_MAP[category];
  const categoryLabel = CATEGORY_LABELS[category] || category;

  // Fetch credit cards - use service client for static generation
  // Service client bypasses RLS which is needed for build-time static generation
  // For ISR revalidation, this will also work correctly
  const supabase = createServiceClient();

  const { data: cards, error } = await supabase
    .from("credit_cards")
    .select(
      "id, slug, name, bank, type, description, annual_fee, joining_fee, interest_rate, rewards, rating, image_url, apply_link, source_url, pros, cons, features, best_for, updated_at, metadata",
    )
    .order("rating", { ascending: false })
    .limit(50);

  if (error || !cards) {
    logger.error("Error fetching credit cards:", error as Error);
  }

  return (
    <SpendingPatternPage
      category={category}
      categoryLabel={categoryLabel}
      amount={amountNum}
      spendingField={spendingField}
      cards={cards || []}
    />
  );
}
