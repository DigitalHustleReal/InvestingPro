"use client";

import React from "react";
import { Trophy, ArrowRight } from "lucide-react";
import { formatINR } from "./charts";

interface ComparisonMetric {
  label: string;
  optionA: string;
  optionB: string;
  winner?: "A" | "B" | "tie";
}

interface VSComparisonLayoutProps {
  titleA: string;
  titleB: string;
  colorA?: string;
  colorB?: string;
  valueA: string;
  valueLabelA: string;
  valueB: string;
  valueLabelB: string;
  metrics: ComparisonMetric[];
  verdict: {
    winner: "A" | "B" | "tie";
    title: string;
    description: string;
  };
}

export function VSComparisonLayout({
  titleA,
  titleB,
  colorA = "#166534",
  colorB = "#d97706",
  valueA,
  valueLabelA,
  valueB,
  valueLabelB,
  metrics,
  verdict,
}: VSComparisonLayoutProps) {
  const winsA = metrics.filter((m) => m.winner === "A").length;
  const winsB = metrics.filter((m) => m.winner === "B").length;

  return (
    <div className="space-y-4">
      {/* Head-to-Head Result Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl p-4 border-2 text-center"
          style={{
            borderColor: verdict.winner === "A" ? colorA : "#e5e7eb",
            backgroundColor: verdict.winner === "A" ? `${colorA}08` : "white",
          }}
        >
          {verdict.winner === "A" && (
            <div className="flex justify-center mb-2">
              <Trophy className="w-5 h-5" style={{ color: colorA }} />
            </div>
          )}
          <p className="text-xs font-medium text-gray-500 mb-1">
            {valueLabelA}
          </p>
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ color: colorA }}
          >
            {valueA}
          </p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{titleA}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {winsA} of {metrics.length} wins
          </p>
        </div>

        <div
          className="rounded-2xl p-4 border-2 text-center"
          style={{
            borderColor: verdict.winner === "B" ? colorB : "#e5e7eb",
            backgroundColor: verdict.winner === "B" ? `${colorB}08` : "white",
          }}
        >
          {verdict.winner === "B" && (
            <div className="flex justify-center mb-2">
              <Trophy className="w-5 h-5" style={{ color: colorB }} />
            </div>
          )}
          <p className="text-xs font-medium text-gray-500 mb-1">
            {valueLabelB}
          </p>
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ color: colorB }}
          >
            {valueB}
          </p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{titleB}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {winsB} of {metrics.length} wins
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-[1fr_auto_1fr] text-center text-xs font-semibold border-b border-gray-100">
          <div className="py-2.5 px-3" style={{ color: colorA }}>
            {titleA}
          </div>
          <div className="py-2.5 px-3 text-gray-400 border-x border-gray-100">
            VS
          </div>
          <div className="py-2.5 px-3" style={{ color: colorB }}>
            {titleB}
          </div>
        </div>
        {metrics.map((m, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_auto_1fr] text-center text-sm border-b border-gray-50 last:border-0"
          >
            <div
              className={`py-2.5 px-3 ${m.winner === "A" ? "font-semibold" : "text-gray-600"}`}
              style={m.winner === "A" ? { color: colorA } : {}}
            >
              {m.optionA}
              {m.winner === "A" && <span className="text-[10px] ml-1">✓</span>}
            </div>
            <div className="py-2.5 px-3 text-[11px] text-gray-400 border-x border-gray-50 flex items-center justify-center min-w-[80px]">
              {m.label}
            </div>
            <div
              className={`py-2.5 px-3 ${m.winner === "B" ? "font-semibold" : "text-gray-600"}`}
              style={m.winner === "B" ? { color: colorB } : {}}
            >
              {m.optionB}
              {m.winner === "B" && <span className="text-[10px] ml-1">✓</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Verdict Box */}
      <div
        className="rounded-2xl p-4 border"
        style={{
          borderColor:
            verdict.winner === "A"
              ? colorA
              : verdict.winner === "B"
                ? colorB
                : "#d1d5db",
          backgroundColor:
            verdict.winner === "A"
              ? `${colorA}08`
              : verdict.winner === "B"
                ? `${colorB}08`
                : "#f9fafb",
        }}
      >
        <div className="flex items-start gap-3">
          <Trophy
            className="w-5 h-5 mt-0.5 shrink-0"
            style={{
              color:
                verdict.winner === "A"
                  ? colorA
                  : verdict.winner === "B"
                    ? colorB
                    : "#6b7280",
            }}
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {verdict.title}
            </p>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              {verdict.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
