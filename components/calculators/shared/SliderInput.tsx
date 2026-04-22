"use client";

import React, { useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";

/**
 * Slider + editable value input. v3 Bold Redesign matching the
 * gold-standard investment-calculator prototype:
 *   - Mono uppercase label (+ optional icon)
 *   - Mono value pill with ink border, tabular-nums
 *   - Click pill → inline number input with gold focus ring
 *   - Slider with gold accent thumb, mono min/max bounds below
 *
 * Used by every calculator widget. One upgrade lifts all 84.
 */
export function SliderInput({
  label,
  icon: Icon,
  value,
  onChange,
  min,
  max,
  step,
  prefix = "",
  suffix = "",
  formatDisplay,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  formatDisplay?: (v: number) => string;
}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(value));

  const handleBlur = useCallback(() => {
    setEditing(false);
    const parsed = parseFloat(inputVal.replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed)) {
      onChange(Math.min(Math.max(parsed, min), max));
    } else {
      setInputVal(String(value));
    }
  }, [inputVal, min, max, onChange, value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleBlur();
    },
    [handleBlur],
  );

  const display = formatDisplay
    ? formatDisplay(value)
    : `${prefix}${value.toLocaleString("en-IN")}${suffix}`;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <label className="font-mono text-[11px] uppercase tracking-wider text-ink-60 flex items-center gap-2">
          <Icon size={14} className="text-indian-gold" />
          {label}
        </label>
        {editing ? (
          <input
            type="text"
            className="w-32 text-right font-mono text-[13px] font-semibold text-ink bg-canvas border-2 border-indian-gold rounded-sm px-2.5 py-1 outline-none tabular-nums"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <button
            onClick={() => {
              setEditing(true);
              setInputVal(String(value));
            }}
            className="font-mono text-[13px] font-semibold text-ink bg-white border-2 border-ink/15 hover:border-ink rounded-sm px-2.5 py-1 transition-colors cursor-text tabular-nums"
          >
            {display}
          </button>
        )}
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="[&_[role=slider]]:bg-indian-gold [&_[role=slider]]:border-canvas"
      />
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-ink-60/70">
        <span className="tabular-nums">
          {prefix}
          {min.toLocaleString("en-IN")}
          {suffix}
        </span>
        <span className="tabular-nums">
          {prefix}
          {max.toLocaleString("en-IN")}
          {suffix}
        </span>
      </div>
    </div>
  );
}
