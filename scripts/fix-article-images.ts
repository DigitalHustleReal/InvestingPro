/**
 * P0: Fix Article Images
 *
 * 1. Copy Grok images from Downloads → public/images/articles/
 * 2. Map each to best-matching article
 * 3. Replace 57 duplicate Unsplash stock photos
 * 4. Fill 21 missing featured images
 * 5. Generate branded cards for remaining articles without Grok match
 *
 * Usage: npx tsx scripts/fix-article-images.ts
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

const DOWNLOADS = "C:/Users/shivp/Downloads";
const ARTICLES_DIR = "public/images/articles";

// ============================================================================
// GROK IMAGE → ARTICLE MAPPING
// Based on visual review of all 51 downloaded images
// ============================================================================

const GROK_MAPPINGS: { file: string; slug: string; description: string }[] = [
  // CREDIT CARDS (replacing Unsplash photo-1563013544)
  {
    file: "MlmER.jpg",
    slug: "best-credit-cards-in-india-2026-rewards-cashback-travel-cards-compared",
    description: "Premium credit cards on dark marble with gold icons",
  },
  {
    file: "YODje.jpg",
    slug: "best-credit-cards-for-online-shopping-in-india-2026-amazon-flipkart-and-more",
    description: "Woman at cafe with credit card and phone",
  },
  {
    file: "B2eOB.jpg",
    slug: "best-cashback-credit-cards-in-india-2026",
    description: "Woman with credit card and phone at cafe",
  },
  {
    file: "2t25S.jpg",
    slug: "best-no-annual-fee-credit-cards-in-india-2026",
    description: "College girl with phone in cafeteria",
  },

  // Also map to credit_cards category (underscore variants)
  {
    file: "MlmER.jpg",
    slug: "credit-card-vs-debit-card-key-differences-and-which-is-better-for-you-in-india",
    description: "reuse: premium cards",
  },

  // INSURANCE (replacing Unsplash photo-1450101499163 — 18 articles sharing one photo!)
  {
    file: "Sdlxq.jpg",
    slug: "term-insurance-1-crore-age-wise-premium-comparison-all-companies-2026",
    description: "Father with sleeping daughter — family protection",
  },
  {
    file: "GefuO.jpg",
    slug: "best-health-insurance-for-parents-above-60-plans-premiums-and-what-to-look-for",
    description: "Elderly Indian couple in park",
  },
  {
    file: "7OhJ8.jpg",
    slug: "best-health-insurance-plans-in-india-2026-coverage-premiums-cashless-hospitals",
    description: "Indian family in hospital waiting area",
  },
  {
    file: "MEcAp.jpg",
    slug: "group-health-insurance-vs-individual-policy-which-is-better-for-your-family",
    description: "Indian family reading together",
  },
  {
    file: "kUUVq.jpg",
    slug: "how-to-choose-the-right-term-insurance-cover-amount-based-on-your-income",
    description: "Couple in office meeting discussing insurance",
  },
  {
    file: "0LzmK.jpg",
    slug: "car-insurance-renewal-online-how-to-get-the-cheapest-premium",
    description: "Car showroom with key and loan agreement",
  },

  // Reuse insurance images for remaining insurance articles
  {
    file: "Sdlxq.jpg",
    slug: "best-term-insurance-plans-in-india-2026-compare-premiums-claim-ratios",
    description: "reuse: father with daughter",
  },
  {
    file: "Sdlxq.jpg",
    slug: "term-insurance-vs-whole-life-insurance-which-should-you-buy",
    description: "reuse: family protection",
  },
  {
    file: "Sdlxq.jpg",
    slug: "term-insurance-vs-whole-life-insurance-which-should-you-buy-in-india",
    description: "reuse: family protection",
  },
  {
    file: "Sdlxq.jpg",
    slug: "claim-settlement-ratio-of-all-life-insurance-companies-in-india-2026-ranking",
    description: "reuse: family protection",
  },
  {
    file: "GefuO.jpg",
    slug: "health-insurance-with-no-waiting-period-for-pre-existing-diseases-complete-list",
    description: "reuse: elderly couple",
  },
  {
    file: "GefuO.jpg",
    slug: "cashless-health-insurance-hospital-network-size-comparison-top-10-insurers",
    description: "reuse: elderly couple",
  },
  {
    file: "GefuO.jpg",
    slug: "health-insurance-for-diabetic-patients-in-india-best-plans-and-what-they-cover",
    description: "reuse: elderly couple",
  },
  {
    file: "7OhJ8.jpg",
    slug: "maternity-health-insurance-india-which-plans-cover-pregnancy-and-delivery",
    description: "reuse: family in hospital",
  },
  {
    file: "7OhJ8.jpg",
    slug: "personal-accident-insurance-india-what-it-covers-and-why-you-need-it",
    description: "reuse: family health",
  },
  {
    file: "kUUVq.jpg",
    slug: "section-80d-tax-benefits-on-health-insurance-how-much-can-you-actually-save",
    description: "reuse: couple discussing insurance",
  },
  {
    file: "kUUVq.jpg",
    slug: "best-cancer-insurance-plans-in-india-2026-coverage-premiums-and-claim-process",
    description: "reuse: couple in office",
  },
  {
    file: "0LzmK.jpg",
    slug: "third-party-vs-comprehensive-two-wheeler-insurance-which-do-you-need",
    description: "reuse: vehicle insurance",
  },

  // INVESTING (replacing Unsplash photo-1611974765270 — 30 articles sharing one photo!)
  {
    file: "CCaUm.jpg",
    slug: "upstox-vs-zerodha-vs-groww-brokerage-charges-and-hidden-fees-compared-2026",
    description: "Man with 3 devices and stock charts",
  },
  {
    file: "qr4RX.jpg",
    slug: "how-to-read-stock-market-charts-for-beginners-in-india",
    description: "Man watching stock charts on Sony monitor",
  },
  {
    file: "m4oTQ.jpg",
    slug: "best-apps-for-stock-trading-in-india-2026-features-charges-and-reviews",
    description: "Man sipping coffee with stock charts",
  },
  {
    file: "URopu.jpg",
    slug: "what-is-a-demat-account-and-how-does-it-work-complete-guide-india",
    description: "Man looking at monitor thoughtfully",
  },
  {
    file: "BL7e8.jpg",
    slug: "gold-investment-in-india-etfs-vs-sgbs-vs-physical-gold-compared",
    description: "Gold bar and coins with phone",
  },
  {
    file: "hKSyj.jpg",
    slug: "what-happens-if-you-stop-sip-for-a-few-months-rules-and-penalties",
    description: "Phone with SIP growth chart + coin jar",
  },
  {
    file: "Tg7sb.jpg",
    slug: "how-much-to-invest-monthly-based-on-your-salary-in-india",
    description: "Couple at kitchen table with growth chart",
  },
  {
    file: "7caxa.jpg",
    slug: "goal-based-investing-in-india-step-by-step-plan-for-every-life-goal",
    description: "Indian couple in garden with laptop",
  },
  {
    file: "Xlp5e.jpg",
    slug: "ppf-vs-nps-which-is-better-for-retirement-savings",
    description: "PPF passbook vs NPS document",
  },
  {
    file: "B19vG.jpg",
    slug: "how-to-invest-in-us-stocks-from-india-step-by-step-guide-2026",
    description: "Flat lay passbook + phone + notes",
  },

  // Reuse investing images for remaining investing articles
  {
    file: "CCaUm.jpg",
    slug: "best-demat-accounts-in-india-2026-compare-brokers-charges-platforms",
    description: "reuse: trading comparison",
  },
  {
    file: "qr4RX.jpg",
    slug: "what-is-sensex-and-nifty-indian-stock-market-indices-explained-simply",
    description: "reuse: stock charts",
  },
  {
    file: "qr4RX.jpg",
    slug: "how-to-start-investing-in-stocks-in-india-beginner-s-complete-guide",
    description: "reuse: stock charts",
  },
  {
    file: "m4oTQ.jpg",
    slug: "dividend-investing-strategy-india-how-to-build-a-dividend-income-portfolio",
    description: "reuse: stock trading",
  },
  {
    file: "m4oTQ.jpg",
    slug: "portfolio-rebalancing-when-and-how-to-rebalance-your-investments-in-india",
    description: "reuse: stock analysis",
  },
  {
    file: "hKSyj.jpg",
    slug: "mutual-fund-sip-auto-debit-failed-what-happens-and-how-to-fix-it",
    description: "reuse: SIP",
  },
  {
    file: "Tg7sb.jpg",
    slug: "how-to-start-investing-at-age-40-in-india-it-s-not-too-late",
    description: "reuse: couple investing",
  },
  {
    file: "7caxa.jpg",
    slug: "passive-income-through-dividends-in-india-complete-strategy-guide",
    description: "reuse: couple with laptop",
  },
  {
    file: "BL7e8.jpg",
    slug: "gold-vs-ppf-vs-fd-vs-nps-where-to-invest-rs-1-lakh-for-10-years",
    description: "reuse: gold investment",
  },
  {
    file: "BL7e8.jpg",
    slug: "sgb-early-redemption-dates-2026-2027-complete-list-and-how-to-redeem",
    description: "reuse: gold",
  },
  {
    file: "URopu.jpg",
    slug: "smallcase-vs-mutual-funds-which-is-better-for-indian-investors",
    description: "reuse: man at monitor",
  },
  {
    file: "URopu.jpg",
    slug: "etf-vs-index-fund-in-india-key-differences-and-which-to-choose",
    description: "reuse: man analyzing",
  },
  {
    file: "B19vG.jpg",
    slug: "elss-vs-ppf-vs-fd-best-tax-saving-investment-under-section-80c-compared",
    description: "reuse: investing flat lay",
  },
  {
    file: "B19vG.jpg",
    slug: "how-to-invest-in-reits-in-india-real-estate-investment-without-buying-property",
    description: "reuse: investing overview",
  },
  {
    file: "Tg7sb.jpg",
    slug: "balanced-advantage-funds-explained-how-dynamic-asset-allocation-works-in-india",
    description: "reuse: couple investing",
  },
  {
    file: "hKSyj.jpg",
    slug: "how-to-read-a-mutual-fund-factsheet-nav-expense-ratio-sharpe-ratio-explained",
    description: "reuse: SIP/MF",
  },
  {
    file: "7caxa.jpg",
    slug: "best-flexi-cap-mutual-funds-2026-top-performers-for-diversified-growth",
    description: "reuse: couple garden",
  },
  {
    file: "m4oTQ.jpg",
    slug: "tax-harvesting-in-mutual-funds-india-how-to-save-ltcg-tax-legally",
    description: "reuse: stock analysis",
  },
  {
    file: "Tg7sb.jpg",
    slug: "best-multi-cap-mutual-funds-in-india-2026-top-performers-and-how-to-pick",
    description: "reuse: couple investing",
  },

  // LOANS
  {
    file: "vSwff.jpg",
    slug: "gold-loan-vs-personal-loan-which-is-better-for-your-situation",
    description: "Gold jewelry vs phone flat lay",
  },
  {
    file: "nSBV2.jpg",
    slug: "personal-loans-in-india-2026-interest-rates-eligibility-best-lenders",
    description: "Man with phone and papers",
  },
  {
    file: "qClbI.jpg",
    slug: "home-loan-eligibility-on-50-000-salary-how-much-can-you-borrow",
    description: "Couple in new home",
  },
  {
    file: "FBGn6.jpg",
    slug: "education-loan-for-studying-abroad-interest-rates-compared-all-banks-2026",
    description: "Girl at airport with parents waving",
  },

  // SAVINGS / BANKING / PERSONAL FINANCE
  {
    file: "ejEAS.jpg",
    slug: "best-savings-account-interest-rates-india-2026",
    description: "Man excited about salary credit on phone",
  },
  {
    file: "eP3e3.jpg",
    slug: "emergency-fund-how-much-money-to-keep-and-where-to-park-it-in-india",
    description: "Savings passbook + piggy bank + 6 months note",
  },
  {
    file: "yYb9e.jpg",
    slug: "50-30-20-budget-rule-india-examples-for-30k-50k-75k-and-1-lakh-salary",
    description: "Woman on sofa with pie chart tablet",
  },
  {
    file: "K805x.jpg",
    slug: "financial-planning-for-35-year-olds-are-you-on-track-india-checklist",
    description: "Woman in office with laptop and papers",
  },
  {
    file: "JFd5f.jpg",
    slug: "financial-planning-for-30-year-olds-in-india-complete-salary-based-guide",
    description: "Woman at home budgeting with calculator",
  },
  {
    file: "8FTvA.jpg",
    slug: "retirement-planning-in-india-how-much-money-do-you-really-need",
    description: "Man on balcony reading book, city skyline",
  },
  {
    file: "YNQvm.jpg",
    slug: "senior-citizen-fd-rates-april-2026-all-banks-compared",
    description: "Senior man with tablet and coffee",
  },
  {
    file: "Fz7Gx.jpg",
    slug: "ppf-loan-rules-how-to-borrow-against-your-ppf-balance",
    description: "PPF passbook + calculator + coins",
  },
  {
    file: "foMio.jpg",
    slug: "how-to-become-debt-free-in-india-step-by-step-repayment-plan",
    description: "Man frustrated reading papers with calculator",
  },
  {
    file: "lKLmU.jpg",
    slug: "best-business-credit-cards-in-india-2026-rewards-limits-and-annual-fees-compared",
    description: "Businessman showing bar chart on phone",
  },

  // DEMAT (missing images)
  {
    file: "NQ3zu.jpg",
    slug: "how-to-open-demat-account-online-india-step-by-step",
    description: "Man with phone + Aadhaar card KYC",
  },
  {
    file: "CCaUm.jpg",
    slug: "zerodha-vs-upstox-2026-brokerage-platform-and-features-compared",
    description: "reuse: trading comparison",
  },
  {
    file: "URopu.jpg",
    slug: "how-to-transfer-shares-from-one-demat-account-to-another-step-by-step-guide",
    description: "reuse: man at monitor",
  },
  {
    file: "NQ3zu.jpg",
    slug: "demat-account-charges-comparison-2026-amc-brokerage-and-hidden-fees-all-brokers",
    description: "reuse: KYC opening",
  },
  {
    file: "NQ3zu.jpg",
    slug: "best-demat-account-for-ipo-application-in-india-2026",
    description: "reuse: demat/KYC",
  },

  // SMALL BUSINESS (missing images)
  {
    file: "iLFqp.jpg",
    slug: "pos-machine-charges-comparison-india-2026-paytm-vs-phonepe-vs-pine-labs-vs-bharatpe",
    description: "Indian shopkeeper with POS tablet",
  },
  {
    file: "iLFqp.jpg",
    slug: "best-payment-gateway-for-small-business-in-india-2026-razorpay-vs-cashfree-vs-payu",
    description: "reuse: shopkeeper with digital payments",
  },
  {
    file: "lKLmU.jpg",
    slug: "working-capital-loan-for-small-business-india-types-rates-and-how-to-apply",
    description: "reuse: businessman with charts",
  },
  {
    file: "nSBV2.jpg",
    slug: "mudra-loan-2026-eligibility-interest-rate-how-to-apply-online",
    description: "reuse: man with loan app",
  },
  {
    file: "foMio.jpg",
    slug: "how-to-file-gst-return-online-step-by-step-guide-for-beginners-2026",
    description: "reuse: man with papers + calculator",
  },
  {
    file: "foMio.jpg",
    slug: "quarterly-vs-monthly-gst-filing-which-one-should-your-business-choose",
    description: "reuse: tax filing confusion",
  },
  {
    file: "foMio.jpg",
    slug: "input-tax-credit-itc-under-gst-how-to-claim-and-common-mistakes",
    description: "reuse: tax papers",
  },
  {
    file: "K805x.jpg",
    slug: "best-accounting-software-for-small-business-in-india-2026",
    description: "reuse: woman with laptop",
  },
  {
    file: "K805x.jpg",
    slug: "how-to-get-msme-udyam-registration-online-step-by-step-guide-2026",
    description: "reuse: professional at desk",
  },
  {
    file: "nSBV2.jpg",
    slug: "business-loan-emi-calculator-guide-how-much-will-your-monthly-payment-be",
    description: "reuse: man with loan app",
  },
  {
    file: "kUUVq.jpg",
    slug: "business-insurance-types-explained-india-fire-marine-liability-and-more",
    description: "reuse: office meeting",
  },
  {
    file: "foMio.jpg",
    slug: "how-to-create-gst-invoice-format-rules-and-free-template-2026",
    description: "reuse: paperwork",
  },
  {
    file: "foMio.jpg",
    slug: "tds-for-freelancers-and-consultants-in-india-rates-filing-and-how-to-claim-refund",
    description: "reuse: tax filing",
  },

  // MUTUAL FUND (missing images)
  {
    file: "hKSyj.jpg",
    slug: "best-large-cap-mutual-funds-in-india-2026-stable-returns-with-lower-risk",
    description: "reuse: SIP growth",
  },
  {
    file: "Tg7sb.jpg",
    slug: "how-to-switch-mutual-funds-without-tax-penalty-step-by-step-india-guide",
    description: "reuse: couple investing",
  },

  // CREDIT_CARDS underscore variant (replacing Unsplash)
  {
    file: "YODje.jpg",
    slug: "best-credit-cards-for-fuel-purchases-in-india-2026-surcharge-waiver-and-rewards",
    description: "reuse: woman with card",
  },
  {
    file: "B2eOB.jpg",
    slug: "how-credit-card-interest-is-calculated-in-india-billing-cycle-due-date-and-charges-explained",
    description: "reuse: credit card usage",
  },

  // CREDIT-CARDS (replacing Unsplash for remaining)
  {
    file: "MlmER.jpg",
    slug: "cibil-score-guide-what-it-means-and-how-to-improve-it",
    description: "reuse: premium cards",
  },
  {
    file: "YODje.jpg",
    slug: "best-travel-credit-cards-in-india-lounge-access-miles-airport-benefits",
    description: "reuse: woman shopping",
  },
];

// ============================================================================
// STEP 1: Copy unique Grok images to articles folder
// ============================================================================

async function processGrokImages() {
  const uniqueFiles = [...new Set(GROK_MAPPINGS.map((m) => m.file))];
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of uniqueFiles) {
    const src = path.join(DOWNLOADS, file);
    // Output as PNG (lossless, consistent with existing images)
    const destName = `grok-${file.replace(".jpg", ".png")}`;
    const dest = path.join(ARTICLES_DIR, destName);

    if (!fs.existsSync(src)) {
      console.log(`  MISSING: ${file}`);
      errors++;
      continue;
    }

    if (fs.existsSync(dest)) {
      skipped++;
      continue;
    }

    try {
      const metadata = await sharp(src).metadata();
      const w = metadata.width || 1200;
      const h = metadata.height || 800;

      // Grok watermark is in bottom-right corner, ~130px wide, ~40px tall
      // Strategy: crop the bottom 45px and right 140px, then
      // extend back to maintain aspect ratio with content-aware fill
      // Simpler: just paint over the watermark area with nearby pixels
      // Simplest reliable: crop 50px from bottom (watermark is at very bottom)

      await sharp(src)
        // Crop: remove bottom 50px to eliminate watermark
        .extract({
          left: 0,
          top: 0,
          width: w,
          height: Math.max(h - 50, h * 0.9),
        })
        // Resize to standard featured image dimensions (1200x675 = 16:9)
        .resize(1200, 675, { fit: "cover", position: "center" })
        // Convert to PNG
        .png({ quality: 90, compressionLevel: 6 })
        .toFile(dest);

      processed++;
      if (processed % 5 === 0)
        console.log(`  Processed ${processed}/${uniqueFiles.length}...`);
    } catch (err: any) {
      console.log(`  ERROR processing ${file}: ${err.message}`);
      errors++;
    }
  }

  console.log(
    `Processed ${processed} images, ${skipped} already existed, ${errors} errors`,
  );
}

// ============================================================================
// STEP 2: Update DB — set featured_image for all mapped articles
// ============================================================================

async function updateArticleImages() {
  let updated = 0;
  let errors = 0;

  // Deduplicate: if an article appears multiple times, use the first mapping
  const slugToFile = new Map<string, string>();
  for (const m of GROK_MAPPINGS) {
    if (!slugToFile.has(m.slug)) {
      slugToFile.set(m.slug, m.file);
    }
  }

  for (const [slug, file] of slugToFile) {
    const imagePath = `/images/articles/grok-${file.replace(".jpg", ".png")}`;

    const { error } = await supabase
      .from("articles")
      .update({ featured_image: imagePath })
      .eq("slug", slug);

    if (error) {
      console.log(`  ERROR ${slug}: ${error.message}`);
      errors++;
    } else {
      updated++;
    }
  }

  console.log(`Updated ${updated} articles, ${errors} errors`);
}

// ============================================================================
// STEP 3: Verify results
// ============================================================================

async function verify() {
  const { data: all } = await supabase
    .from("articles")
    .select("id", { count: "exact" })
    .eq("status", "published");

  const { data: withImg } = await supabase
    .from("articles")
    .select("id", { count: "exact" })
    .eq("status", "published")
    .not("featured_image", "is", null)
    .neq("featured_image", "");

  const { data: unsplash } = await supabase
    .from("articles")
    .select("slug, featured_image")
    .eq("status", "published")
    .like("featured_image", "%unsplash%");

  const { data: missing } = await supabase
    .from("articles")
    .select("slug, category")
    .eq("status", "published")
    .or("featured_image.is.null,featured_image.eq.");

  const { data: grok } = await supabase
    .from("articles")
    .select("slug")
    .eq("status", "published")
    .like("featured_image", "%grok-%");

  console.log("\n=== VERIFICATION ===");
  console.log("Total published:", all?.length);
  console.log("With featured_image:", withImg?.length);
  console.log("Using Grok images:", grok?.length);
  console.log("Still using Unsplash:", unsplash?.length);
  console.log("Still missing:", missing?.length);

  if (unsplash?.length) {
    console.log("\n--- Remaining Unsplash articles ---");
    unsplash.forEach((a) => console.log(`  ${a.slug}`));
  }
  if (missing?.length) {
    console.log("\n--- Still missing ---");
    missing.forEach((a) => console.log(`  ${a.category} | ${a.slug}`));
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log("=== P0: Fix Article Images ===\n");

  console.log("Step 1: Process Grok images (remove watermark + optimize)...");
  await processGrokImages();

  console.log("\nStep 2: Update DB...");
  await updateArticleImages();

  console.log("\nStep 3: Verify...");
  await verify();
}

main().catch(console.error);
