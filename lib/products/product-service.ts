import { createClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";

export type ProductCategory =
  | "credit_card"
  | "broker"
  | "loan"
  | "mutual_fund"
  | "insurance"
  | "demat_account"
  | "fixed_deposit"
  | "ppf"
  | "nps"
  | "ppf_nps"
  | "stock";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  provider_name: string;
  provider_slug: string; // Added for routing
  meta_title?: string;
  canonical_url?: string;
  description?: string;
  image_url?: string;
  rating: {
    overall: number;
    trust_score: number;
  };
  features: Record<string, any>;
  key_features: any[];
  pros: string[];
  cons: string[];
  affiliate_link?: string;
  official_link?: string;
  is_active: boolean;
  is_verified: boolean;
  trust_score: number;
  meta_description?: string;
  launch_date?: string;
  verification_status: "pending" | "verified" | "discrepancy" | "outdated";
  verification_notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at">;

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  includeInactive?: boolean;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

import { SupabaseClient } from "@supabase/supabase-js";

// ... (existing imports)

export class ProductService {
  async getProducts(
    params: ProductListParams = {},
    client?: SupabaseClient,
  ): Promise<Product[]> {
    const { category, includeInactive = false, limit } = params;
    const supabase = client || createClient();

    let query = supabase
      .from("products")
      .select(
        "id, slug, name, category, provider_name, provider_slug, description, image_url, rating, features, key_features, pros, cons, affiliate_link, official_link, is_active, trust_score, verification_status, updated_at, meta_title, canonical_url, meta_description",
      );

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (params.search) {
      const term = params.search.toLowerCase();
      // Search in name, description, provider_name OR in the JSONB features values
      query = query.or(
        `name.ilike.%${term}%,description.ilike.%${term}%,provider_name.ilike.%${term}%,features->>sub_category.ilike.%${term}%,features->>card_type.ilike.%${term}%`,
      );
    }

    query = query
      .order("rating", { ascending: false })
      .order("trust_score", { ascending: false, nullsFirst: false });

    // Always apply a limit to prevent unbounded queries
    query = query.limit(limit || 100);

    try {
      const { data, error } = await query;
      if (error) {
        logger.error("Failed to fetch products", error, { query: params });
        return [];
      }
      return (data || []).map((p: any) => this.normalizeProduct(p));
    } catch (e: any) {
      logger.error("Unexpected error in getProducts", e);
      return [];
    }
  }

  async getProductsPaginated(
    params: ProductListParams,
    client?: SupabaseClient,
  ): Promise<ProductListResult> {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      includeInactive = false,
    } = params;
    const supabase = client || createClient();

    let query = supabase.from("products").select("*", { count: "exact" });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      const term = search.toLowerCase();
      query = query.or(
        `name.ilike.%${term}%,description.ilike.%${term}%,provider_name.ilike.%${term}%`,
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query
      .order("rating", { ascending: false })
      .order("trust_score", { ascending: false, nullsFirst: false })
      .range(from, to);

    try {
      const { data, error, count } = await query;
      if (error) {
        logger.error("Failed to fetch paginated products", error, {
          query: params,
        });
        return { products: [], total: 0, page, limit, totalPages: 0 };
      }

      const total = count || 0;
      return {
        products: (data || []).map((p: any) => this.normalizeProduct(p)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (e: any) {
      logger.error("Unexpected error in getProductsPaginated", e);
      return { products: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    return this.getProducts({ limit });
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, slug, name, category, provider_name, provider_slug, description, image_url, rating, features, key_features, pros, cons, affiliate_link, official_link, is_active, trust_score, verification_status, updated_at, meta_title, canonical_url, meta_description",
        )
        .eq("slug", slug)
        .single();

      if (error) {
        logger.warn(`Product not found for slug: ${slug}`, { error });
        return null;
      }
      return this.normalizeProduct(data);
    } catch (e: any) {
      logger.error(`Error in getProductBySlug for ${slug}`, e);
      return null;
    }
  }

  async getProductById(
    id: string,
    client?: SupabaseClient,
  ): Promise<Product | null> {
    try {
      const supabase = client || createClient();
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, slug, name, category, provider_name, provider_slug, description, image_url, rating, features, key_features, pros, cons, affiliate_link, official_link, is_active, trust_score, verification_status, updated_at, meta_title, canonical_url, meta_description",
        )
        .eq("id", id)
        .single();

      if (error) {
        logger.warn(`Product not found for ID: ${id}`, { error });
        return null;
      }
      return this.normalizeProduct(data);
    } catch (e: any) {
      logger.error(`Error in getProductById for ${id}`, e);
      return null;
    }
  }

  async createProduct(input: Partial<ProductInput>): Promise<Product> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .insert({
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error("Failed to create product", error, { input });
        throw error;
      }
      return this.normalizeProduct(data);
    } catch (e: any) {
      logger.error("Unexpected error in createProduct", e);
      throw e;
    }
  }

  async updateProduct(
    id: string,
    updates: Partial<ProductInput>,
  ): Promise<Product> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        logger.error(`Failed to update product ${id}`, error, { updates });
        throw error;
      }
      return this.normalizeProduct(data);
    } catch (e: any) {
      logger.error(`Unexpected error in updateProduct for ${id}`, e);
      throw e;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        logger.error(`Failed to delete product ${id}`, error);
        throw error;
      }
    } catch (e: any) {
      logger.error(`Unexpected error in deleteProduct for ${id}`, e);
      throw e;
    }
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  public normalizeProduct(data: any): Product {
    if (!data) return data;
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
      provider_slug:
        data.provider_slug ||
        this.generateSlug(data.provider_name || "InvestingPro Partner"),
      meta_title: data.meta_title,
      canonical_url: data.canonical_url,
      meta_description:
        data.meta_description || data.description?.substring(0, 160),
      launch_date: data.launch_date || data.created_at,
    };
  }
}

export const productService = new ProductService();
