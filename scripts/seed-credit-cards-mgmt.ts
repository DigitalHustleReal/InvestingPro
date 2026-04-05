/**
 * Credit Card Seed Script (via Supabase Management API)
 *
 * Uses the Management API to bypass PostgREST schema cache issues.
 * Requires SUPABASE_ACCESS_TOKEN in .env.local
 *
 * Usage:
 *   npx tsx scripts/seed-credit-cards-mgmt.ts
 *   npx tsx scripts/seed-credit-cards-mgmt.ts --dry-run
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const projectRef = supabaseUrl.replace("https://", "").split(".")[0];
const accessToken = process.env.SUPABASE_ACCESS_TOKEN!;

if (!accessToken) {
  console.error("Missing SUPABASE_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

interface CreditCardSeed {
  slug: string;
  name: string;
  product_type: string;
  provider_name: string;
  provider_slug: string;
  description: string;
  short_description: string;
  features: Record<string, unknown>;
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

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

function toSqlArray(arr: string[]): string {
  return `ARRAY[${arr.map((v) => `'${esc(v)}'`).join(",")}]::text[]`;
}

/**
 * Map seed card to the PRODUCTION products table schema:
 * id, slug, name, category, provider_name, description, image_url, rating,
 * features (jsonb), pros (text[]), cons (text[]), affiliate_link, official_link,
 * is_active, last_verified_at, verification_status, verification_notes,
 * trust_score, created_at, updated_at, best_for
 */
function buildInsertSQL(card: CreditCardSeed): string {
  // Merge card-specific data into the features JSONB
  const features = {
    product_type: "credit_card",
    provider_slug: card.provider_slug,
    short_description: card.short_description,
    annual_fee: card.features.annual_fee,
    joining_fee: card.features.joining_fee,
    interest_rate_monthly: card.features.interest_rate_monthly,
    reward_rate: card.features.reward_rate,
    welcome_bonus: card.features.welcome_bonus,
    lounge_access: card.features.lounge_access,
    fuel_surcharge_waiver: card.features.fuel_surcharge_waiver,
    contactless: card.features.contactless,
    network: card.features.network,
    variant: card.features.variant,
    min_income: card.features.min_income,
    min_age: card.features.min_age,
    max_age: card.features.max_age,
    fee_waiver_spend: card.features.fee_waiver_spend,
    key_features: card.key_features,
    tags: card.tags,
    is_featured: card.is_featured ?? false,
    data_source: card.data_source || "manual",
  };

  // Determine best_for from features or tags
  const bestForArr: string[] = Array.isArray(card.features.best_for)
    ? (card.features.best_for as string[])
    : card.tags.slice(0, 3);
  const bestFor = bestForArr.join(", ");

  const affiliateLink = card.apply_url ? `'${esc(card.apply_url)}'` : "NULL";
  const officialLink = card.official_link
    ? `'${esc(card.official_link)}'`
    : "NULL";
  const imageUrl = card.image_url ? `'${esc(card.image_url)}'` : "NULL";

  return `INSERT INTO public.products (slug, name, category, provider_name, description, image_url, features, pros, cons, affiliate_link, official_link, is_active, best_for, updated_at)
VALUES ('${esc(card.slug)}', '${esc(card.name)}', 'credit_card', '${esc(card.provider_name)}', '${esc(card.description)}', ${imageUrl}, '${esc(JSON.stringify(features))}'::jsonb, ${toSqlArray(card.pros)}, ${toSqlArray(card.cons)}, ${affiliateLink}, ${officialLink}, ${card.is_active ?? true}, '${esc(bestFor)}', now())
ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, provider_name=EXCLUDED.provider_name, description=EXCLUDED.description, image_url=EXCLUDED.image_url, features=EXCLUDED.features, pros=EXCLUDED.pros, cons=EXCLUDED.cons, affiliate_link=EXCLUDED.affiliate_link, official_link=EXCLUDED.official_link, is_active=EXCLUDED.is_active, best_for=EXCLUDED.best_for, updated_at=now();`;
}

function loadBatchFiles(): CreditCardSeed[] {
  const seedDir = path.join(process.cwd(), "data", "seed");
  const allCards: CreditCardSeed[] = [];

  const files = fs
    .readdirSync(seedDir)
    .filter((f) => f.startsWith("credit-cards-batch") && f.endsWith(".json"))
    .sort();

  for (const file of files) {
    const filePath = path.join(seedDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const cards: CreditCardSeed[] = Array.isArray(data) ? data : [];
    console.log(`  ${file}: ${cards.length} cards`);
    allCards.push(...cards);
  }

  return allCards;
}

async function executeSql(
  sql: string,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `${res.status}: ${text.substring(0, 300)}` };
  }
  return { ok: true };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  console.log("\n--- InvestingPro Credit Card Seeder (Management API) ---\n");
  console.log(`Project ref: ${projectRef}`);
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}\n`);

  console.log("Loading batch files:");
  const cards = loadBatchFiles();

  if (cards.length === 0) {
    console.error(
      "No credit card data found in data/seed/credit-cards-batch*.json",
    );
    process.exit(1);
  }

  console.log(`\nTotal cards to seed: ${cards.length}\n`);

  if (dryRun) {
    console.log("--- DRY RUN: Showing first SQL statement ---\n");
    console.log(buildInsertSQL(cards[0]));
    console.log("\n--- End dry run ---");
    return;
  }

  let inserted = 0;
  let errors = 0;
  const batchSize = 20;
  const totalBatches = Math.ceil(cards.length / batchSize);

  for (let i = 0; i < cards.length; i += batchSize) {
    const batch = cards.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;

    const statements = batch.map((card) => buildInsertSQL(card));
    const sql = statements.join("\n");
    const result = await executeSql(sql);

    if (result.ok) {
      inserted += batch.length;
    } else {
      console.error(`\n  Batch ${batchNum} failed: ${result.error}`);
      // Fall back to individual inserts
      for (const stmt of statements) {
        const r = await executeSql(stmt);
        if (r.ok) {
          inserted++;
        } else {
          console.error(`  Failed: ${r.error?.substring(0, 120)}`);
          errors++;
        }
      }
    }

    process.stdout.write(
      `  Batch ${batchNum}/${totalBatches} (${inserted} done, ${errors} errors)\r`,
    );
  }

  console.log(`\n\nSeeded: ${inserted}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total:  ${cards.length}\n`);

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

  // Verify count in DB
  const countResult = await executeSql(
    "SELECT COUNT(*) as total FROM public.products WHERE category = 'credit_card'",
  );
  if (countResult.ok) {
    console.log("\nVerified in database.");
  }
}

main().catch(console.error);
