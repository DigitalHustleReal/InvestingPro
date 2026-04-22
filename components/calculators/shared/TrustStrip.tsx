"use client";

import React from "react";
import { ShieldCheck, Clock, Users, FileSearch } from "lucide-react";

/**
 * Trust strip under calculator page H1.
 * v3 Bold Redesign: mono uppercase labels with gold dot separators.
 * Removed vanity "75+ calculators" — replaced with factual signals only.
 */
export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-60 flex items-center gap-2">
        <ShieldCheck size={13} className="text-indian-gold" />
        SEBI-compliant formulas
      </span>
      <span className="text-ink/20">·</span>
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-60 flex items-center gap-2">
        <FileSearch size={13} className="text-indian-gold" />
        Methodology disclosed
      </span>
      <span className="text-ink/20">·</span>
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-60 flex items-center gap-2">
        <Clock size={13} className="text-indian-gold" />
        Updated April 2026
      </span>
      <span className="text-ink/20">·</span>
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-60 flex items-center gap-2">
        <Users size={13} className="text-indian-gold" />
        Free · No signup
      </span>
    </div>
  );
}
