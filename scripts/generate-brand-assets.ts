/**
 * scripts/generate-brand-assets.ts
 *
 * Renders favicon kit + downloadable brand assets from SVG masters.
 *
 * Reads:
 *   public/favicon.svg                   (adaptive, primary browser favicon)
 *   public/brand/pro-mark-light.svg      (square mark, light bg)
 *   public/brand/pro-mark-dark.svg       (square mark, dark bg)
 *   public/brand/wordmark-light.svg      (horizontal lockup, transparent bg, ink text)
 *   public/brand/wordmark-dark.svg       (horizontal lockup, transparent bg, canvas text)
 *
 * Writes (favicon kit):
 *   public/favicon.ico                   (32×32 PNG renamed; modern browsers accept)
 *   public/apple-touch-icon.png          (180×180, iOS home screen)
 *   public/icons/icon-192x192.png        (PWA / Android)
 *   public/icons/icon-512x512.png        (PWA / Android)
 *   public/icons/icon-512x512-maskable.png (Android adaptive, dark variant w/ safe-zone)
 *
 * Writes (downloadable social kit):
 *   public/brand/pro-mark-light-256.png
 *   public/brand/pro-mark-light-512.png  (Telegram/WhatsApp/Twitter avatar)
 *   public/brand/pro-mark-light-1080.png (Instagram, retina)
 *   public/brand/pro-mark-dark-256.png
 *   public/brand/pro-mark-dark-512.png
 *   public/brand/pro-mark-dark-1080.png
 *   public/brand/wordmark-light-1024.png (LinkedIn cover, email signature)
 *   public/brand/wordmark-dark-1024.png
 *
 * Run: npx tsx scripts/generate-brand-assets.ts
 *
 * Note on fonts: SVG references "Inter" with system fallbacks. The browser
 * loads Inter from Google Fonts at runtime — favicon.svg always renders
 * correctly in tabs. For sharp PNG generation, the rendering machine uses
 * its system font fallback (typically Segoe UI Black on Windows, SF Pro
 * on Mac). Visual variance is minor for a 3-letter mark.
 */
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const BRAND = path.join(PUBLIC, "brand");
const ICONS = path.join(PUBLIC, "icons");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function render(
  svgPath: string,
  width: number,
  height: number,
  outPath: string,
) {
  const svg = await fs.readFile(svgPath);
  // density: higher density → sharper rendering for raster output
  const density = Math.max(72, Math.ceil((width / 64) * 96));
  await sharp(svg, { density })
    .resize(width, height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  const stats = await fs.stat(outPath);
  console.log(
    `✓ ${path.relative(ROOT, outPath)} (${width}×${height}, ${(stats.size / 1024).toFixed(1)}KB)`,
  );
}

async function main() {
  console.log("━━━ InvestingPro brand asset generator ━━━\n");

  await ensureDir(BRAND);
  await ensureDir(ICONS);

  const proLight = path.join(BRAND, "pro-mark-light.svg");
  const proDark = path.join(BRAND, "pro-mark-dark.svg");
  const wordLight = path.join(BRAND, "wordmark-light.svg");
  const wordDark = path.join(BRAND, "wordmark-dark.svg");

  // === Favicon kit (browser/PWA) ===
  console.log("FAVICON KIT");
  await render(proLight, 32, 32, path.join(PUBLIC, "favicon.ico"));
  await render(proLight, 180, 180, path.join(PUBLIC, "apple-touch-icon.png"));
  await render(proLight, 192, 192, path.join(ICONS, "icon-192x192.png"));
  await render(proLight, 512, 512, path.join(ICONS, "icon-512x512.png"));
  await render(
    proDark,
    512,
    512,
    path.join(ICONS, "icon-512x512-maskable.png"),
  );

  // === Social media kit ===
  console.log("\nSOCIAL KIT — square Pro. mark");
  await render(proLight, 256, 256, path.join(BRAND, "pro-mark-light-256.png"));
  await render(proLight, 512, 512, path.join(BRAND, "pro-mark-light-512.png"));
  await render(
    proLight,
    1080,
    1080,
    path.join(BRAND, "pro-mark-light-1080.png"),
  );
  await render(proDark, 256, 256, path.join(BRAND, "pro-mark-dark-256.png"));
  await render(proDark, 512, 512, path.join(BRAND, "pro-mark-dark-512.png"));
  await render(proDark, 1080, 1080, path.join(BRAND, "pro-mark-dark-1080.png"));

  console.log("\nSOCIAL KIT — horizontal wordmark");
  await render(
    wordLight,
    1024,
    256,
    path.join(BRAND, "wordmark-light-1024.png"),
  );
  await render(wordDark, 1024, 256, path.join(BRAND, "wordmark-dark-1024.png"));

  console.log("\n━━━ Done. ━━━");
}

main().catch((err) => {
  console.error("Generation failed:", err);
  process.exit(1);
});
