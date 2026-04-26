import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import axios from "axios";
import fs from "fs";
import path from "path";

// Lazy client init — module-level construction with non-null bangs would
// throw at import time if any env var is missing, producing an opaque 500.
// We construct inside the handler so a missing OPENAI_API_KEY returns a
// clean 200 with a "skipped" message instead.
let _supabase: SupabaseClient | null = null;
let _openai: OpenAI | null = null;

function getClients(): {
  supabase: SupabaseClient | null;
  openai: OpenAI | null;
  missing: string[];
} {
  const missing: string[] = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!openaiKey) missing.push("OPENAI_API_KEY");

  if (missing.length > 0) {
    return { supabase: null, openai: null, missing };
  }

  if (!_supabase) _supabase = createClient(supabaseUrl!, supabaseKey!);
  if (!_openai) _openai = new OpenAI({ apiKey: openaiKey! });

  return { supabase: _supabase, openai: _openai, missing: [] };
}

// Same helper functions as main endpoint
const BRAND_COLORS: Record<
  string,
  { primary: string; secondary: string; accent: string }
> = {
  HDFC: { primary: "#1F4E7C", secondary: "#E31E24", accent: "#FFD700" },
  ICICI: { primary: "#F37021", secondary: "#1D428A", accent: "#FFB81C" },
  Axis: { primary: "#800000", secondary: "#000000", accent: "#C0C0C0" },
  SBI: { primary: "#004B87", secondary: "#FDB913", accent: "#FFFFFF" },
  Default: { primary: "#1E293B", secondary: "#0EA5E9", accent: "#10B981" },
};

function extractProvider(providerName: string): string {
  for (const provider of Object.keys(BRAND_COLORS)) {
    if (providerName.toLowerCase().includes(provider.toLowerCase()))
      return provider;
  }
  return "Default";
}

function buildPrompt(product: any): string {
  const provider = extractProvider(product.provider_name || product.name);
  const colors = BRAND_COLORS[provider];
  const cat = product.category?.toLowerCase() || "";

  if (cat.includes("card")) {
    return `Ultra-realistic premium credit card for "${product.name}". ${colors.primary} to ${colors.secondary} gradient, ${colors.accent} accents. Professional studio lighting.`;
  } else if (cat.includes("loan")) {
    return `Modern financial product for "${product.name}". Gradient ${colors.primary} to ${colors.secondary}. Professional design with ${colors.accent} highlights.`;
  } else if (cat.includes("insurance")) {
    return `Professional insurance product for "${product.name}". Shield theme, ${colors.primary} with ${colors.secondary} accents.`;
  } else {
    return `Investment product for "${product.name}". Growth theme, ${colors.primary} to ${colors.secondary} gradient.`;
  }
}

async function downloadImage(url: string, product: any): Promise<string> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);
  const category = product.category || "general";
  const dir = path.join(
    process.cwd(),
    "public",
    "images",
    "products",
    category,
  );
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `${product.slug}.png`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/images/products/${category}/${filename}`;
}

export async function GET(request: NextRequest) {
  try {
    // Security: Check cron secret
    const authHeader = request.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lazy client init — return clean 200 if env keys are missing rather
    // than throwing 500. This makes the cron observable as "skipped" in
    // monitoring instead of a generic failure.
    const { supabase, openai, missing } = getClients();
    if (missing.length > 0 || !supabase || !openai) {
      logger.warn(
        `[cron generate-missing-images] skipped — missing env: ${missing.join(", ")}`,
      );
      return Response.json({
        skipped: true,
        message: `Skipped — missing env vars: ${missing.join(", ")}`,
        generated: 0,
      });
    }

    logger.info("\n🤖 CRON: Checking for products without images...");

    // Find products without images (limit 5 per run to avoid timeout)
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .or("image_url.is.null,image_url.like.%default%")
      .limit(5);

    if (error) {
      throw error;
    }

    if (!products || products.length === 0) {
      logger.info("✅ All products have images!");
      return Response.json({
        message: "All products have images",
        generated: 0,
      });
    }

    logger.info(`📊 Found ${products.length} products needing images\n`);

    let generated = 0;
    const results = [];

    for (const product of products) {
      try {
        logger.info(`🎨 Generating for: ${product.name}`);

        const prompt = buildPrompt(product);
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        });

        const imageUrl = response.data?.[0]?.url;
        if (!imageUrl) throw new Error("No URL returned");

        const localPath = await downloadImage(imageUrl, product);

        await supabase
          .from("products")
          .update({ image_url: localPath })
          .eq("id", product.id);

        logger.info(`✅ Success: ${localPath}`);
        generated++;
        results.push({
          productId: product.id,
          success: true,
          imageUrl: localPath,
        });

        // Rate limit: 2s between requests
        if (generated < products.length) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      } catch (error: any) {
        logger.error(`❌ Failed for ${product.name}:`, error.message);
        results.push({
          productId: product.id,
          success: false,
          error: error.message,
        });
      }
    }

    logger.info(
      `\n📈 CRON Complete: ${generated}/${products.length} generated\n`,
    );

    return Response.json({
      generated,
      total: products.length,
      cost: generated * 0.04,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error("❌ CRON failed:", error);
    return Response.json(
      {
        error: "Cron job failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
