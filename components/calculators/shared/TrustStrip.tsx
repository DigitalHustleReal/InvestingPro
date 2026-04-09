"use client";

import React from "react";
import { ShieldCheck, Star, Clock, Users } from "lucide-react";

/**
 * Trust signals strip — addresses trust gap vs Groww/ET Money.
 * Shows credibility without requiring login.
 */
export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-gray-500 py-3">
      <span className="flex items-center gap-1.5">
        <ShieldCheck size={13} className="text-green-600" />
        SEBI-compliant formulas
      </span>
      <span className="flex items-center gap-1.5">
        <Star size={13} className="text-amber-500 fill-amber-500" />
        Trusted by 50,000+ users
      </span>
      <span className="flex items-center gap-1.5">
        <Clock size={13} className="text-green-600" />
        Updated April 2026
      </span>
      <span className="flex items-center gap-1.5">
        <Users size={13} className="text-green-600" />
        Free · No signup required
      </span>
    </div>
  );
}
