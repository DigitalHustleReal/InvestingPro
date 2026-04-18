"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  HERO_QUESTIONS,
  CONSTELLATION_NODES,
} from "@/lib/content/hero-questions";

/* ── Constellation layout (% positions within container) ── */
const CORE_POSITIONS: Record<string, { x: number; y: number }> = {
  retirement: { x: 46.7, y: 9.7 },
  tax: { x: 75, y: 29 },
  "mutual-funds": { x: 26.7, y: 35.5 },
  "credit-cards": { x: 58.3, y: 48.4 },
  insurance: { x: 36.7, y: 61.3 },
  "kids-education": { x: 81.7, y: 72.6 },
};

const SUB_POSITIONS: Record<string, { x: number; y: number }> = {
  nps: { x: 16.7, y: 19.4 },
  "old-vs-new": { x: 91.7, y: 16.1 },
  "sip-calculator": { x: 13.3, y: 48.4 },
  "term-plan": { x: 65, y: 6.5 },
  "home-loan": { x: 93.3, y: 45.2 },
  "80c": { x: 90, y: 27.4 },
  "emergency-fund": { x: 18.3, y: 67.7 },
  hra: { x: 46.7, y: 29 },
  fire: { x: 53.3, y: 83.9 },
  "tax-harvesting": { x: 81.7, y: 4.8 },
  esops: { x: 26.7, y: 82.3 },
  "pension-gap": { x: 91.7, y: 62.9 },
};

/* ── Core-to-core static links ── */
const CORE_LINKS: [string, string][] = [
  ["retirement", "tax"],
  ["retirement", "mutual-funds"],
  ["tax", "credit-cards"],
  ["mutual-funds", "insurance"],
  ["credit-cards", "kids-education"],
  ["mutual-funds", "credit-cards"],
  ["insurance", "kids-education"],
  ["tax", "mutual-funds"],
];

/* ── Sub-to-nearest-core mapping ── */
function nearestCore(subId: string): string {
  const s = SUB_POSITIONS[subId];
  if (!s) return "retirement";
  let best = "";
  let bestDist = Infinity;
  for (const [coreId, pos] of Object.entries(CORE_POSITIONS)) {
    const d = (pos.x - s.x) ** 2 + (pos.y - s.y) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = coreId;
    }
  }
  return best;
}

const ROTATE_MS = 7000;

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = HERO_QUESTIONS[idx];

  const goTo = useCallback((i: number) => {
    setFading(true);
    setTimeout(() => {
      setIdx(i);
      setFading(false);
    }, 300);
  }, []);

  const next = useCallback(() => {
    goTo((idx + 1) % HERO_QUESTIONS.length);
  }, [idx, goTo]);

  // Auto-rotate
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!paused) next();
    }, ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next]);

  const handleDotClick = (i: number) => {
    goTo(i);
    // Reset timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!paused) next();
    }, ROTATE_MS);
  };

  return (
    <section
      className="bg-[#FAFAF9]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-[60px] pt-16 pb-10 lg:pt-20 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[60px] min-h-[620px] lg:min-h-[720px]">
          {/* ── LEFT: Rotating question ── */}
          <div className="flex flex-col" aria-live="polite">
            {/* Kicker */}
            <div className="mb-3">
              <span className="text-[13px] font-bold tracking-[1px] text-[#D97706]">
                {q.kicker}
              </span>
              <div className="w-[60px] h-[2px] bg-[#D97706] mt-2.5" />
            </div>

            {/* Question */}
            <div
              className={`min-h-[180px] sm:min-h-[220px] mb-6 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
            >
              <h1 className="font-serif text-[48px] sm:text-[64px] lg:text-[78px] leading-[1.0] text-[#0A1F14] font-semibold">
                {q.questionLine1}
              </h1>
              <span className="font-serif italic text-[48px] sm:text-[64px] lg:text-[78px] leading-[1.0] text-[#D97706] font-semibold">
                {q.questionLine2}
              </span>
              <div className="font-data text-[13px] text-[#64748B] mt-3">
                Q{q.id} of {HERO_QUESTIONS.length} · most-asked this month
              </div>
            </div>

            {/* Preview card */}
            <div
              className={`bg-[#F5F2EA] border border-[#EDE8DF] rounded-[10px] p-[18px_20px] mb-7 max-w-[540px] transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
            >
              <div className="text-[11px] font-bold tracking-[0.5px] text-[#D97706] mb-2.5">
                {q.answerKicker}
              </div>
              <div className="text-[16px] font-medium text-[#0A1F14] mb-1">
                {q.answerLine1}
              </div>
              <div className="text-[14px] font-light text-[#40514A] mb-3.5">
                {q.answerLine2}
              </div>
              <Link
                href={q.toolLink}
                className="text-[13px] font-medium text-[#16A34A] hover:underline"
              >
                {q.ctaText} →
              </Link>
            </div>

            {/* CTAs */}
            <div className="flex gap-4 mb-7">
              <Link
                href={q.toolLink}
                className="px-[30px] py-[15px] bg-[#16A34A] text-[#FAFAF9] text-[13px] font-bold tracking-[0.5px] rounded-[6px] hover:bg-[#166534] transition-colors"
              >
                ANSWER MY QUESTION
              </Link>
              <Link
                href="/calculators"
                className="px-[28px] py-[13px] border-2 border-[#0A1F14] text-[#0A1F14] text-[13px] font-bold tracking-[0.5px] rounded-[6px] hover:bg-[#0A1F14] hover:text-white transition-colors"
              >
                BROWSE ALL TOOLS
              </Link>
            </div>

            {/* Dots + next label */}
            <div className="flex items-center gap-5">
              <div className="flex gap-2.5">
                {HERO_QUESTIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    aria-label={`Go to question ${i + 1}: ${HERO_QUESTIONS[i].questionLine1} ${HERO_QUESTIONS[i].questionLine2}`}
                    className={`w-[7px] h-[7px] rounded-full border-none cursor-pointer transition-colors duration-300 ${
                      i === idx ? "bg-[#D97706]" : "bg-[#D4CEC0]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[12px] font-light text-[#64748B]">
                next: {q.nextPreview}
              </span>
            </div>
          </div>

          {/* ── RIGHT: Constellation ── */}
          <div className="hidden lg:block relative min-h-[620px]">
            {/* Gold accent corner */}
            <div className="absolute top-[10px] right-[40px] w-[28px] h-[18px] border-t-2 border-r-2 border-[#D97706]" />

            {/* Constellation container */}
            <div className="relative w-full h-[620px]">
              {/* SVG lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Core-to-core lines */}
                {CORE_LINKS.map(([a, b]) => {
                  const pa = CORE_POSITIONS[a];
                  const pb = CORE_POSITIONS[b];
                  if (!pa || !pb) return null;
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={pa.x}
                      y1={pa.y}
                      x2={pb.x}
                      y2={pb.y}
                      stroke="#DDD6C5"
                      strokeWidth="0.15"
                    />
                  );
                })}
                {/* Sub-to-core lines */}
                {CONSTELLATION_NODES.sub.map((s) => {
                  const sp = SUB_POSITIONS[s.id];
                  const coreId = nearestCore(s.id);
                  const cp = CORE_POSITIONS[coreId];
                  if (!sp || !cp) return null;
                  const isActive =
                    coreId === q.activeCore && q.activeSubTopics.includes(s.id);
                  return (
                    <line
                      key={`sub-${s.id}`}
                      x1={sp.x}
                      y1={sp.y}
                      x2={cp.x}
                      y2={cp.y}
                      stroke={isActive ? "rgba(217,119,6,0.4)" : "#EDE8DF"}
                      strokeWidth={isActive ? "0.2" : "0.12"}
                      className="transition-all duration-500 ease-out"
                    />
                  );
                })}
              </svg>

              {/* Sub-topic pills (rendered first so cores are on top) */}
              {CONSTELLATION_NODES.sub.map((s, i) => {
                const pos = SUB_POSITIONS[s.id];
                if (!pos) return null;
                const isActive = q.activeSubTopics.includes(s.id);
                return (
                  <div
                    key={s.id}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[11.5px] font-medium border cursor-default transition-all duration-500 ease-out ${
                      isActive
                        ? "text-[#0A1F14] border-[#D97706] scale-[1.06]"
                        : "text-[#64748B] border-[#D4CEC0] bg-[#FAFAF9]"
                    }`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      animation: isActive
                        ? "none"
                        : `float-${i % 2 === 0 ? "a" : "b"} ${6 + (i % 2)}s ease-in-out infinite`,
                    }}
                  >
                    {s.label}
                  </div>
                );
              })}

              {/* Core category pills */}
              {CONSTELLATION_NODES.core.map((c) => {
                const pos = CORE_POSITIONS[c.id];
                if (!pos) return null;
                const isActive = c.id === q.activeCore;
                const isGreen = c.style === "green";
                return (
                  <div
                    key={c.id}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-semibold tracking-[0.2px] cursor-default transition-all duration-500 ease-out ${
                      isGreen
                        ? "bg-[#EEF7F1] text-[#166534] border-[#16A34A]"
                        : "bg-[#FDF2E0] text-[#A55C04] border-[#D97706]"
                    } ${
                      isActive
                        ? "scale-[1.12] border-[3px] shadow-[0_0_0_1px_rgba(217,119,6,0.15)]"
                        : "border-2"
                    }`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                  >
                    {c.label}
                  </div>
                );
              })}
            </div>

            {/* Bottom caption */}
            <div className="text-center text-[13px] font-light text-[#64748B] mt-2">
              Every money decision. One platform. Disclosed methodology.
            </div>
          </div>
        </div>
      </div>

      {/* Float animation keyframes */}
      <style jsx>{`
        @keyframes float-a {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-4px);
          }
        }
        @keyframes float-b {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(3px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
