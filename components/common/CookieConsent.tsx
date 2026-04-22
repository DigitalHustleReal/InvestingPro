"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

// Cookie consent — slim single-line bar bottom-fixed.
// v3 Bold Redesign: ink bg, gold accent, mono copy, sharp corners.
// Replaces earlier 3-line card that was too tall on mobile (bug #11).

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Delay reveal slightly so it doesn't compete with first paint
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShow(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] pb-safe"
    >
      <div className="bg-ink text-canvas border-t-2 border-indian-gold">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-canvas-70 text-center sm:text-left flex-1">
            We use cookies for analytics &amp; affiliate tracking.{" "}
            <Link
              href="/cookie-policy"
              className="text-indian-gold hover:underline"
            >
              Learn more
            </Link>
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="font-mono text-[10px] uppercase tracking-wider text-canvas-70 hover:text-canvas px-3 py-1.5 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="font-mono text-[11px] uppercase tracking-wider bg-indian-gold text-ink px-4 py-1.5 rounded-sm hover:bg-canvas transition-colors font-semibold"
            >
              Accept
            </button>
            <button
              onClick={declineCookies}
              aria-label="Close"
              className="text-canvas-70 hover:text-canvas transition-colors p-1 -mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
