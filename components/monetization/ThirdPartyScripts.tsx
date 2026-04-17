"use client";

/**
 * ThirdPartyScripts — Lazy-loads affiliate & ad scripts WITHOUT blocking page render.
 *
 * Strategy:
 * 1. Scripts load ONLY after page is interactive (afterInteractive / lazyOnload)
 * 2. Affiliate scripts load only on product pages (not articles, calculators, about)
 * 3. Ad scripts (future AdSense) load only on content pages with enough text
 * 4. All scripts use Next.js <Script> component for optimal loading
 * 5. Only ONE affiliate network converts each link (Cuelinks gets priority)
 *
 * Performance budget: max 2 third-party scripts per page, total < 50KB
 */

import { usePathname } from "next/navigation";
import Script from "next/script";

// Pages where affiliate auto-monetization makes sense
// Basically everything public EXCEPT admin/auth pages
const AFFILIATE_PATHS = [
  "/credit-cards",
  "/loans",
  "/mutual-funds",
  "/insurance",
  "/demat-accounts",
  "/fixed-deposits",
  "/banking",
  "/investing",
  "/compare",
  "/product",
  "/products",
  "/best-mutual-funds",
  "/stocks",
  "/ppf-nps",
  "/articles",
  "/calculators",
  "/category",
  "/glossary",
  "/best-mutual-funds",
  "/reviews",
];

// Pages where display ads (AdSense) make sense — content-heavy pages
const AD_PATHS = [
  "/articles",
  "/calculators",
  "/glossary",
  "/category",
  "/credit-cards",
  "/loans",
  "/mutual-funds",
  "/insurance",
];

// Pages where NO third-party scripts should load
const EXCLUDED_PATHS = ["/admin", "/profile", "/login", "/signup", "/api"];

export default function ThirdPartyScripts() {
  const pathname = usePathname();

  // Never load on admin, auth, or API pages
  if (!pathname || EXCLUDED_PATHS.some((p) => pathname.startsWith(p))) {
    return null;
  }

  // Check if current page should load affiliate scripts
  const shouldLoadAffiliate = AFFILIATE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  // Check if current page should load ad scripts (future)
  const shouldLoadAds = AD_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  return (
    <>
      {/* Cuelinks — primary affiliate network, loads after page interactive */}
      {shouldLoadAffiliate && (
        <Script
          id="cuelinks-sdk"
          src="https://cdn.cuelinks.com/cuelinks-sdk.js"
          data-publisher-id="244238"
          strategy="lazyOnload"
        />
      )}

      {/*
       * EarnKaro — secondary affiliate network
       * Uses lazyOnload so it doesn't compete with Cuelinks for link conversion.
       * Cuelinks loads first (afterInteractive), EarnKaro loads later (lazyOnload).
       * If both try to convert a link, the first SDK wins.
       */}
      {shouldLoadAffiliate && (
        <Script
          id="earnkaro-sdk"
          src="https://ekaro.in/sdk.js"
          data-ek-id="5197986"
          strategy="lazyOnload"
        />
      )}

      {/*
       * Google AdSense — future (uncomment when approved)
       * Only loads on content pages, lazy to avoid CLS impact
       */}
      {/* {shouldLoadAds && (
        <Script
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client="ca-pub-XXXXXXXXX"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      )} */}
    </>
  );
}
