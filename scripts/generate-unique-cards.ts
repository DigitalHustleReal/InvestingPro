/**
 * Generate Unique Branded Featured Image Cards
 *
 * Creates a unique 1200x675 branded card for every article
 * that is currently sharing an image with another article.
 *
 * Design: Green gradient background + article title + category badge + IP branding
 * Tech: Sharp with SVG text overlay (no Playwright needed)
 *
 * Usage: npx tsx scripts/generate-unique-cards.ts
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const ARTICLES_DIR = "public/images/articles";

// Category color accents
const CATEGORY_COLORS: Record<
  string,
  { bg1: string; bg2: string; accent: string; icon: string }
> = {
  "credit-cards": {
    bg1: "#0F172A",
    bg2: "#1E3A5F",
    accent: "#F59E0B",
    icon: "💳",
  },
  credit_cards: {
    bg1: "#0F172A",
    bg2: "#1E3A5F",
    accent: "#F59E0B",
    icon: "💳",
  },
  banking: { bg1: "#064E3B", bg2: "#065F46", accent: "#34D399", icon: "🏦" },
  loans: { bg1: "#1E1B4B", bg2: "#312E81", accent: "#A78BFA", icon: "📋" },
  insurance: { bg1: "#1C1917", bg2: "#44403C", accent: "#FB923C", icon: "🛡️" },
  investing: { bg1: "#052E16", bg2: "#14532D", accent: "#4ADE80", icon: "📈" },
  "investing-basics": {
    bg1: "#052E16",
    bg2: "#14532D",
    accent: "#4ADE80",
    icon: "📊",
  },
  "mutual-funds": {
    bg1: "#0C4A6E",
    bg2: "#075985",
    accent: "#38BDF8",
    icon: "📊",
  },
  mutual_fund: {
    bg1: "#0C4A6E",
    bg2: "#075985",
    accent: "#38BDF8",
    icon: "📊",
  },
  "mutual-fund": {
    bg1: "#0C4A6E",
    bg2: "#075985",
    accent: "#38BDF8",
    icon: "📊",
  },
  "demat-accounts": {
    bg1: "#1A1A2E",
    bg2: "#16213E",
    accent: "#E94560",
    icon: "📱",
  },
  demat_account: {
    bg1: "#1A1A2E",
    bg2: "#16213E",
    accent: "#E94560",
    icon: "📱",
  },
  "fixed-deposits": {
    bg1: "#3B0764",
    bg2: "#581C87",
    accent: "#D946EF",
    icon: "🏧",
  },
  fixed_deposit: {
    bg1: "#3B0764",
    bg2: "#581C87",
    accent: "#D946EF",
    icon: "🏧",
  },
  tax: { bg1: "#1A1A2E", bg2: "#0F3460", accent: "#E94560", icon: "📑" },
  "tax-planning": {
    bg1: "#1A1A2E",
    bg2: "#0F3460",
    accent: "#E94560",
    icon: "📑",
  },
  "personal-finance": {
    bg1: "#134E4A",
    bg2: "#115E59",
    accent: "#2DD4BF",
    icon: "💰",
  },
  ipo: { bg1: "#431407", bg2: "#7C2D12", accent: "#FB923C", icon: "🚀" },
  stocks: { bg1: "#0F172A", bg2: "#1E293B", accent: "#22D3EE", icon: "📉" },
  retirement: { bg1: "#1C1917", bg2: "#292524", accent: "#FBBF24", icon: "🏖️" },
  "small-business": {
    bg1: "#1E3A5F",
    bg2: "#2D5A8E",
    accent: "#F59E0B",
    icon: "🏪",
  },
  small_business: {
    bg1: "#1E3A5F",
    bg2: "#2D5A8E",
    accent: "#F59E0B",
    icon: "🏪",
  },
  tools: { bg1: "#064E3B", bg2: "#065F46", accent: "#34D399", icon: "🧮" },
};

const DEFAULT_COLORS = {
  bg1: "#166534",
  bg2: "#16A34A",
  accent: "#D97706",
  icon: "📝",
};

// Wrap title text to fit within width
function wrapText(title: string, maxCharsPerLine: number): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = (currentLine + " " + word).trim();
    }
  }
  if (currentLine) lines.push(currentLine.trim());

  // Max 4 lines
  if (lines.length > 4) {
    lines.length = 4;
    lines[3] = lines[3].substring(0, lines[3].length - 3) + "...";
  }

  return lines;
}

// Escape XML special characters
function escXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateCardSVG(title: string, category: string): string {
  const colors = CATEGORY_COLORS[category] || DEFAULT_COLORS;
  const lines = wrapText(title, 32);
  const lineHeight = 52;
  const startY = 280 - ((lines.length - 1) * lineHeight) / 2;

  const titleLines = lines
    .map(
      (line, i) =>
        `<text x="600" y="${startY + i * lineHeight}" font-family="Inter, Segoe UI, sans-serif" font-size="40" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${escXml(line)}</text>`,
    )
    .join("\n    ");

  const categoryLabel = category
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg1}" />
      <stop offset="100%" style="stop-color:${colors.bg2}" />
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.08)" />
      <stop offset="50%" style="stop-color:rgba(255,255,255,0)" />
      <stop offset="100%" style="stop-color:rgba(255,255,255,0.04)" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bg)" />
  <rect width="1200" height="675" fill="url(#shine)" />

  <!-- Decorative circles -->
  <circle cx="1100" cy="100" r="200" fill="${colors.accent}" opacity="0.08" />
  <circle cx="100" cy="600" r="150" fill="${colors.accent}" opacity="0.06" />
  <circle cx="900" cy="550" r="100" fill="white" opacity="0.03" />

  <!-- Top accent line -->
  <rect x="0" y="0" width="1200" height="4" fill="${colors.accent}" />

  <!-- Category badge -->
  <rect x="${600 - (categoryLabel.length * 14 + 40) / 2}" y="120" width="${categoryLabel.length * 14 + 40}" height="36" rx="18" fill="${colors.accent}" opacity="0.9" />
  <text x="600" y="142" font-family="Inter, Segoe UI, sans-serif" font-size="16" font-weight="600" fill="white" text-anchor="middle" letter-spacing="1">${escXml(categoryLabel.toUpperCase())}</text>

  <!-- Title -->
  ${titleLines}

  <!-- Divider line -->
  <rect x="525" y="${startY + lines.length * lineHeight + 20}" width="150" height="3" rx="1.5" fill="${colors.accent}" />

  <!-- Bottom branding -->
  <rect x="0" y="620" width="1200" height="55" fill="rgba(0,0,0,0.3)" />

  <!-- Logo mark -->
  <rect x="40" y="632" width="34" height="34" rx="8" fill="white" />
  <text x="57" y="656" font-family="Inter, Segoe UI, sans-serif" font-size="18" font-weight="800" fill="${colors.bg1}" text-anchor="middle">IP</text>

  <text x="86" y="655" font-family="Inter, Segoe UI, sans-serif" font-size="18" font-weight="600" fill="rgba(255,255,255,0.9)">InvestingPro.in</text>

  <text x="1160" y="655" font-family="Inter, Segoe UI, sans-serif" font-size="14" fill="rgba(255,255,255,0.5)" text-anchor="end">India's Independent Finance Platform</text>
</svg>`;
}

async function main() {
  console.log("=== Generate Unique Article Cards ===\n");

  // Get all articles
  const { data: articles } = await supabase
    .from("articles")
    .select("id, slug, title, category, featured_image")
    .eq("status", "published");

  if (!articles) {
    console.error("Failed to fetch");
    return;
  }

  // Find which images are used by multiple articles
  const imgCount: Record<string, number> = {};
  articles.forEach((a) => {
    const img = a.featured_image || "";
    imgCount[img] = (imgCount[img] || 0) + 1;
  });

  // Articles that need unique cards: sharing an image with others
  const needsCard = articles.filter((a) => {
    const img = a.featured_image || "";
    return imgCount[img] > 1;
  });

  console.log(`Articles sharing images: ${needsCard.length}`);
  console.log(`Generating unique branded cards...\n`);

  let generated = 0;
  let errors = 0;

  for (const article of needsCard) {
    const filename = `card-${article.slug.substring(0, 80)}.png`;
    const filepath = path.join(ARTICLES_DIR, filename);

    // Skip if already generated
    if (fs.existsSync(filepath)) {
      generated++;
      continue;
    }

    try {
      const svg = generateCardSVG(article.title, article.category);
      const svgBuffer = Buffer.from(svg);

      await sharp(svgBuffer)
        .resize(1200, 675)
        .png({ compressionLevel: 6 })
        .toFile(filepath);

      // Update DB
      const { error } = await supabase
        .from("articles")
        .update({ featured_image: `/images/articles/${filename}` })
        .eq("id", article.id);

      if (error) {
        console.log(`  DB ERROR ${article.slug}: ${error.message}`);
        errors++;
      } else {
        generated++;
      }

      if (generated % 20 === 0) {
        console.log(`  Generated ${generated}/${needsCard.length}...`);
      }
    } catch (err: any) {
      console.log(`  ERROR ${article.slug}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nGenerated: ${generated}`);
  console.log(`Errors: ${errors}`);

  // Verify
  const { data: verify } = await supabase
    .from("articles")
    .select("featured_image")
    .eq("status", "published");

  const imgCount2: Record<string, number> = {};
  verify?.forEach((a) => {
    const img = a.featured_image || "";
    imgCount2[img] = (imgCount2[img] || 0) + 1;
  });

  const uniqueNow = Object.keys(imgCount2).length;
  const stillShared = Object.entries(imgCount2).filter(([_, c]) => c > 1);

  console.log(`\n=== FINAL STATE ===`);
  console.log(`Unique image paths: ${uniqueNow}`);
  console.log(
    `Still shared: ${stillShared.length} images used by ${stillShared.reduce((a, [_, c]) => a + c, 0)} articles`,
  );
}

main().catch(console.error);
