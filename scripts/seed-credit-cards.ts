/**
 * Credit Card Seed Script
 *
 * Loads all credit card data from data/seed/credit-cards-batch*.json
 * and upserts into the Supabase products table.
 *
 * Usage:
 *   npx tsx scripts/seed-credit-cards.ts
 *
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// ⚠️ ENVIRONMENT GUARD: Block running in production
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "";
if (
  baseUrl.includes("investingpro.in") ||
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production"
) {
  console.error(
    "SAFETY ABORT: This seed script should NEVER be run against a production database.",
  );
  console.error(
    `Detected environment: ${baseUrl || process.env.NODE_ENV || "unknown"}`,
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface CreditCardSeed {
  slug: string;
  name: string;
  product_type: string;
  provider_name: string;
  provider_slug: string;
  description: string;
  short_description: string;
  features: Record<string, any>;
  pros: string[];
  cons: string[];
  key_features: string[];
  tags: string[];
  is_active: boolean;
  is_featured?: boolean;
  data_source: string;
  image_url?: string;
  apply_url?: string;
  official_link?: string;
}

async function loadBatchFiles(): Promise<CreditCardSeed[]> {
  const seedDir = path.join(process.cwd(), "data", "seed");
  const allCards: CreditCardSeed[] = [];

  const files = fs
    .readdirSync(seedDir)
    .filter((f) => f.startsWith("credit-cards-batch") && f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(seedDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const cards = Array.isArray(data) ? data : [];
    console.log(`📄 ${file}: ${cards.length} cards`);
    allCards.push(...cards);
  }

  return allCards;
}

async function seedCreditCards() {
  console.log("\n🏦 InvestingPro Credit Card Seeder\n");

  const cards = await loadBatchFiles();

  if (cards.length === 0) {
    console.error(
      "No credit card data found in data/seed/credit-cards-batch*.json",
    );
    process.exit(1);
  }

  console.log(`\n📊 Total cards to seed: ${cards.length}\n`);

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const card of cards) {
    // Ensure product_type is set
    card.product_type = "credit_card";

    // Build the product record
    const record = {
      slug: card.slug,
      name: card.name,
      product_type: card.product_type,
      provider_name: card.provider_name,
      provider_slug: card.provider_slug,
      description: card.description,
      short_description: card.short_description,
      features: card.features,
      pros: card.pros,
      cons: card.cons,
      key_features: card.key_features,
      tags: card.tags,
      is_active: card.is_active ?? true,
      is_featured: card.is_featured ?? false,
      data_source: card.data_source || "manual",
      image_url: card.image_url || null,
      apply_url: card.apply_url || null,
      official_link: card.official_link || null,
      updated_at: new Date().toISOString(),
      last_data_refresh: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("products")
      .upsert(record, { onConflict: "slug" })
      .select("id")
      .single();

    if (error) {
      console.error(`  ❌ ${card.name}: ${error.message}`);
      errors++;
    } else {
      // Check if it was insert or update by trying to detect
      console.log(`  ✅ ${card.name} (${card.provider_name})`);
      inserted++;
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Seeded: ${inserted}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📊 Total: ${cards.length}`);
  console.log(`${"=".repeat(50)}\n`);

  // Print summary by provider
  const byProvider: Record<string, number> = {};
  for (const card of cards) {
    byProvider[card.provider_name] = (byProvider[card.provider_name] || 0) + 1;
  }

  console.log("Cards by provider:");
  Object.entries(byProvider)
    .sort((a, b) => b[1] - a[1])
    .forEach(([provider, count]) => {
      console.log(`  ${provider}: ${count}`);
    });
}

seedCreditCards().catch(console.error);
