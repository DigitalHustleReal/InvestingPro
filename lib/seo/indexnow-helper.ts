/**
 * IndexNow helper — fire-and-forget URL submission to Bing/Yandex.
 *
 * Called from publish flows (cron content generation, admin "Publish"
 * button) to nudge search engines to re-crawl new content within
 * minutes instead of waiting for the next routine sitemap parse.
 *
 * Behavior:
 *   - Fire-and-forget (returns immediately; submission runs async)
 *   - Wrapped in try/catch so any IndexNow failure never blocks the
 *     publish flow
 *   - Production-only — no-op in dev to avoid spam
 *
 * Note: Google deprecated their /ping sitemap endpoint in 2023 but
 * IndexNow (Bing + Yandex + Naver + Seznam + Tencent) is still very
 * much active and gives faster indexing than waiting for crawlers.
 */

import { logger } from "@/lib/logger";

const INDEXNOW_KEY = "c6fbbb8cdaa8f1927d27388185cc953f";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in";
const HOST = BASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * Submit a single URL or path to IndexNow.
 * Path must start with `/` (e.g. `/articles/best-credit-cards-2026`).
 */
export function pingIndexNow(pathOrUrl: string): void {
  if (process.env.NODE_ENV !== "production") {
    return; // Skip in dev
  }

  const fullUrl = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${BASE_URL}${pathOrUrl}`;

  // Fire-and-forget — no await, no return promise
  fetch(
    `https://api.indexnow.org/IndexNow?url=${encodeURIComponent(fullUrl)}&key=${INDEXNOW_KEY}`,
    { method: "GET" },
  )
    .then((res) => {
      logger.info(`[indexnow] ${fullUrl} → ${res.status}`);
    })
    .catch((err) => {
      logger.warn(`[indexnow] ping failed for ${fullUrl}: ${err}`);
    });
}

/**
 * Submit multiple URLs / paths in a single batch (more efficient
 * for cron runs that publish a batch of articles).
 */
export function pingIndexNowBatch(pathsOrUrls: string[]): void {
  if (process.env.NODE_ENV !== "production" || pathsOrUrls.length === 0) {
    return;
  }

  const urlList = pathsOrUrls.map((p) =>
    p.startsWith("http") ? p : `${BASE_URL}${p}`,
  );

  fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urlList.slice(0, 10000),
    }),
  })
    .then((res) => {
      logger.info(`[indexnow] batch ${urlList.length} URLs → ${res.status}`);
    })
    .catch((err) => {
      logger.warn(`[indexnow] batch ping failed: ${err}`);
    });
}
