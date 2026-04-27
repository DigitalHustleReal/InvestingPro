// public/sw.js — minimal service worker for PWA installability.
//
// Purpose: this SW exists ONLY to satisfy the browser's PWA-installable
// criteria so the `beforeinstallprompt` event fires (Chrome / Edge / Brave).
// It does NOT cache anything yet. Pure pass-through.
//
// Caching strategies (per-resource-type — app shell cache-first, articles
// stale-while-revalidate, calculators offline-first, rates network-only)
// will be added carefully in Phase 6 when we ship the full PWA. Caching
// financial data wrong is dangerous — better to ship installability now
// and add caching deliberately later.
//
// Bumped on each deploy via the version constant. Browsers detect changes
// and trigger SW update.

const VERSION = "1.0.0-installability-only";

self.addEventListener("install", () => {
  // Take control on first install. Don't wait for the next navigation.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Become the active SW for all open clients immediately.
  event.waitUntil(self.clients.claim());
});

// Pass-through fetch handler: required by Chrome's installability heuristic.
// Doing nothing inside it is fine — browser default network behavior applies.
// Adding a real cache strategy here is a Phase 6 task.
self.addEventListener("fetch", () => {
  // Intentionally empty. See file header.
});
