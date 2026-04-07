import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface SimilarProductsProps {
  category: string;
  currentProductId: string;
  maxProducts?: number;
  className?: string;
}

interface SimilarProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  key_features: any[];
  provider_slug: string;
}

async function fetchSimilarProducts(
  category: string,
  currentProductId: string,
  limit: number,
): Promise<SimilarProduct[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name, category, rating, key_features, provider_slug")
      .eq("category", category)
      .eq("is_active", true)
      .neq("id", currentProductId)
      .order("trust_score", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((p: any) => ({
      ...p,
      rating: Number(p.rating) || 0,
      key_features: p.key_features || [],
    }));
  } catch {
    return [];
  }
}

function getCategoryPath(category: string): string {
  const map: Record<string, string> = {
    credit_card: "credit-cards",
    broker: "demat-accounts",
    loan: "loans",
    mutual_fund: "mutual-funds",
    insurance: "insurance",
    demat_account: "demat-accounts",
    fixed_deposit: "fixed-deposits",
    ppf: "ppf",
    nps: "nps",
    ppf_nps: "ppf-nps",
    stock: "stocks",
  };
  return map[category] || category;
}

function getFirstFeature(keyFeatures: any[]): string | null {
  if (!keyFeatures || keyFeatures.length === 0) return null;
  const first = keyFeatures[0];
  if (typeof first === "string") return first;
  if (typeof first === "object" && first !== null) {
    return first.label || first.name || first.text || null;
  }
  return null;
}

export default async function SimilarProducts({
  category,
  currentProductId,
  maxProducts = 3,
  className,
}: SimilarProductsProps) {
  const products = await fetchSimilarProducts(
    category,
    currentProductId,
    maxProducts,
  );

  if (products.length === 0) return null;

  const categoryPath = getCategoryPath(category);

  return (
    <section className={cn("py-6", className)}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Similar Products
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => {
          const feature = getFirstFeature(product.key_features);
          return (
            <div
              key={product.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300">
                  {product.rating.toFixed(1)}
                </span>
              </div>

              {/* Key feature */}
              {feature && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                  {feature}
                </p>
              )}

              {/* Compare link */}
              <Link
                href={`/${categoryPath}/${product.slug}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Compare
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
