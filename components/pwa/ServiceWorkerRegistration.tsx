"use client";

// ServiceWorkerRegistration — registers /public/sw.js on production-only.
//
// Mounted once in app/layout.tsx. Renders nothing (returns null). Side-effect
// only: registers the service worker after page load so PWA installability
// criteria are satisfied (manifest + SW + HTTPS + engagement heuristic).
//
// Skipped in dev to avoid SW caching getting stuck during HMR cycles.

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    // Defer until window load so SW registration doesn't compete with LCP.
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // Silent fail — PWA installability is an enhancement, not a hard
        // requirement. Errors here mean the user gets a non-installable
        // site (still fully functional in browser).
      });
    };

    if (document.readyState === "complete") {
      onLoad();
      return;
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
