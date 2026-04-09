"use client";

import React, { useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";

/**
 * Editable Slider Input — Groww-pattern reusable component
 *
 * Features:
 * - Label + icon on left, editable value badge on right
 * - Click badge → inline text input with green border
 * - Press Enter or blur → validates and clamps to min/max
 * - Slider below synced with input
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
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-gray-600 flex items-center gap-2">
          <Icon size={15} className="text-green-600" />
          {label}
        </label>
        {editing ? (
          <input
            type="text"
            className="w-32 text-right text-sm font-semibold text-green-700 bg-green-50 border border-green-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-green-200"
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
            className="text-sm font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg px-3 py-1.5 transition-colors cursor-text"
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
      />
      <div className="flex justify-between text-[10px] text-gray-400 -mt-0.5">
        <span>
          {prefix}
          {min.toLocaleString("en-IN")}
          {suffix}
        </span>
        <span>
          {prefix}
          {max.toLocaleString("en-IN")}
          {suffix}
        </span>
      </div>
    </div>
  );
}
