import { createClient } from "@/lib/supabase/client";
import { createClient as createStaticClient } from "@/lib/supabase/static";
import { Product, ProductCategory } from "./product-service";
import { logger } from "@/lib/logger";

/**
 * Table-specific fallback queries for when a slug isn't found in the unified `products` table.
 * Each product type lives in its own table with different column names.
 */
const TABLE_FALLBACKS: {
  table: string;
  category: ProductCategory;
  providerCol: string;
  imageCol: string;
  affiliateCol: string;
  officialCol: string;
}[] = [
  {
    table: "credit_cards",
    category: "credit_card",
    providerCol: "bank",
    imageCol: "image_url",
    affiliateCol: "apply_link",
    officialCol: "apply_link",
  },
  {
    table: "loans",
    category: "loan",
    providerCol: "bank_name",
    imageCol: "image_url",
    affiliateCol: "apply_link",
    officialCol: "official_link",
  },
  {
    table: "brokers",
    category: "broker",
    providerCol: "name",
    imageCol: "logo_url",
    affiliateCol: "affiliate_link",
    officialCol: "official_link",
  },
  {
    table: "fixed_deposits",
    category: "fixed_deposit",
    providerCol: "bank_name",
    imageCol: "image_url",
    affiliateCol: "apply_link",
    officialCol: "official_link",
  },
  {
    table: "mutual_funds",
    category: "mutual_fund",
    providerCol: "fund_house",
    imageCol: "image_url",
    affiliateCol: "",
    officialCol: "",
  },
  {
    table: "savings_accounts",
    category: "savings_account" as ProductCategory,
    providerCol: "bank_name",
    imageCol: "image_url",
    affiliateCol: "apply_link",
    officialCol: "official_link",
  },
  {
    table: "govt_schemes",
    category: "govt_scheme" as ProductCategory,
    providerCol: "provider",
    imageCol: "image_url",
    affiliateCol: "",
    officialCol: "official_link",
  },
];

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // 1. Try unified products table first
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, slug, name, category, provider_name, description, image_url, rating, features, pros, cons, affiliate_link, official_link, is_active, trust_score, verification_status, updated_at",
      )
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return normalizeProduct(data);
    }
  } catch (err) {
    logger.warn(
      "[getProductBySlug] Products table query failed, trying fallback tables",
    );
  }

  // 2. Fallback: search individual product tables
  const supabase = createStaticClient();
  for (const fb of TABLE_FALLBACKS) {
    try {
      const { data, error } = await supabase
        .from(fb.table)
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return normalizeFromTable(data, fb);
      }
    } catch {
      // Table might not exist — try next
    }
  }

  logger.warn(`[getProductBySlug] No product found for slug: ${slug}`);
  return null;
}

export async function getProductsByCategory(
  category: ProductCategory,
): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, category, provider_name, description, image_url, rating, features, pros, cons, affiliate_link, official_link, is_active, trust_score, verification_status, updated_at, meta_title, canonical_url, meta_description",
    )
    .eq("category", category)
    .eq("is_active", true)
    .order("trust_score", { ascending: false })
    .limit(200);

  if (error) return [];
  return (data || []).map(normalizeProduct);
}

function normalizeProduct(data: any): Product {
  return {
    ...data,
    category: data.category || "credit_card",
    rating: {
      overall: Number(data.rating) || 0,
      trust_score: Number(data.trust_score) || 0,
    },
    features: data.features || {},
    key_features: data.key_features || [],
    pros: data.pros || [],
    cons: data.cons || [],
    trust_score: data.trust_score || 0,
    is_active: data.is_active ?? true,
    is_verified: data.verification_status === "verified",
    verification_status: data.verification_status || "pending",
    provider_name: data.provider_name || "InvestingPro Partner",
  };
}

/**
 * Normalize data from an individual product table into the unified Product shape.
 */
function normalizeFromTable(
  data: any,
  fb: (typeof TABLE_FALLBACKS)[number],
): Product {
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    category: fb.category,
    provider_name: data[fb.providerCol] || data.name || "InvestingPro Partner",
    provider_slug: data.slug,
    description: data.description || "",
    image_url: data[fb.imageCol] || null,
    rating: {
      overall: Number(data.rating) || 0,
      trust_score: 0,
    },
    features: data.features || {},
    key_features: [],
    pros: data.pros || [],
    cons: data.cons || [],
    affiliate_link: (fb.affiliateCol && data[fb.affiliateCol]) || "#",
    official_link: (fb.officialCol && data[fb.officialCol]) || "",
    is_active: data.is_active ?? true,
    is_verified: false,
    verification_status: "pending",
    trust_score: 0,
    updated_at: data.updated_at,
  };
}
