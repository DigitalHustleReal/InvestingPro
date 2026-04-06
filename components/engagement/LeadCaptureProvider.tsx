"use client";

/**
 * Global Lead Capture Provider
 *
 * Wraps the app to provide site-wide lead capture popups
 * Add this to your root layout
 */

import React from "react";
import { LeadMagnetPopup } from "./LeadMagnetPopup";

interface LeadCaptureProviderProps {
  children: React.ReactNode;
  // Feature flags
  enableExitIntent?: boolean;
  enableTimedPopup?: boolean;
  timedPopupDelay?: number;
}

export function LeadCaptureProvider({
  children,
  enableExitIntent = true,
  enableTimedPopup = true,
  timedPopupDelay = 45000, // 45 seconds
}: LeadCaptureProviderProps) {
  return (
    <>
      {children}

      {/* Exit Intent Popup - Newsletter */}
      {enableExitIntent && (
        <LeadMagnetPopup
          trigger="exit-intent"
          variant="newsletter"
          title="Wait! Don't miss out 👋"
          description="Get our best finance tips delivered weekly. 100% free, no spam."
          buttonText="Yes, Subscribe Me"
          cookieKey="ip_exit_popup"
          cookieDays={7}
        />
      )}

      {/* Timed Popup - Guide Offer */}
      {enableTimedPopup && (
        <LeadMagnetPopup
          trigger="timed"
          delay={timedPopupDelay}
          variant="guide"
          guideTitle="2026 Credit Card Guide"
          title="Free: Best Credit Cards 2026"
          description="Expert picks based on your spending style. Rewards, cashback, travel - we've got you covered."
          buttonText="Download Free Guide"
          cookieKey="ip_timed_popup"
          cookieDays={14}
        />
      )}
    </>
  );
}

export default LeadCaptureProvider;
