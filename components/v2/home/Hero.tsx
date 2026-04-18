"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  HERO_QUESTIONS,
  CONSTELLATION_NODES,
} from "@/lib/content/hero-questions";

/* ── Node links — every node opens its relevant page ── */
const NODE_LINKS: Record<string, string> = {
  // Core
  retirement: "/calculators/retirement",
  tax: "/calculators/tax",
  "mutual-funds": "/mutual-funds",
  "credit-cards": "/credit-cards",
  insurance: "/insurance",
  "kids-education": "/calculators/child-education",
  // Sub
  nps: "/calculators/nps",
  "old-vs-new": "/calculators/old-vs-new-tax",
  "sip-calculator": "/calculators/sip",
  "term-plan": "/insurance?type=term-life",
  "home-loan": "/calculators/home-loan-emi",
  "80c": "/articles/section-80c",
  "emergency-fund": "/calculators/goal-planning",
  hra: "/calculators/hra",
  fire: "/calculators/fire",
  "tax-harvesting": "/articles/tax-harvesting",
  esops: "/articles/esops",
  "pension-gap": "/calculators/retirement",
};

/* ── Base positions (% of container) ── */
const CORE_BASE: Record<string, { x: number; y: number }> = {
  retirement: { x: 46.7, y: 9.7 },
  tax: { x: 75, y: 29 },
  "mutual-funds": { x: 26.7, y: 35.5 },
  "credit-cards": { x: 58.3, y: 48.4 },
  insurance: { x: 36.7, y: 61.3 },
  "kids-education": { x: 81.7, y: 72.6 },
};

const SUB_BASE: Record<string, { x: number; y: number }> = {
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

/* ── Core-to-core lattice ── */
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

/* ── Nearest core for each sub ── */
function nearestCore(subId: string): string {
  const s = SUB_BASE[subId];
  if (!s) return "retirement";
  let best = "";
  let bestDist = Infinity;
  for (const [coreId, pos] of Object.entries(CORE_BASE)) {
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
  const pausedRef = useRef(false);

  // Keep ref in sync so interval closure reads latest value
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const q = HERO_QUESTIONS[idx];

  const goTo = useCallback((i: number) => {
    setFading(true);
    setTimeout(() => {
      setIdx(i);
      setFading(false);
    }, 300);
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setFading(true);
        setTimeout(() => {
          setIdx((prev) => (prev + 1) % HERO_QUESTIONS.length);
          setFading(false);
        }, 300);
      }
    }, ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleDotClick = (i: number) => {
    goTo(i);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setFading(true);
        setTimeout(() => {
          setIdx((prev) => (prev + 1) % HERO_QUESTIONS.length);
          setFading(false);
        }, 300);
      }
    }, ROTATE_MS);
  };

  // Contextual positions: active core pulls to focal point, active subs orbit closer
  const activeCore = q.activeCore;
  const activeSubs = q.activeSubTopics;
  const focalX = 50;
  const focalY = 45;

  function getCorePos(id: string) {
    const base = CORE_BASE[id];
    if (!base) return { x: 50, y: 50 };
    if (id === activeCore) {
      // Pull active core toward center
      return {
        x: base.x + (focalX - base.x) * 0.25,
        y: base.y + (focalY - base.y) * 0.2,
      };
    }
    // Push inactive cores slightly away from center
    return {
      x: base.x + (base.x - focalX) * 0.05,
      y: base.y + (base.y - focalY) * 0.05,
    };
  }

  function getSubPos(id: string) {
    const base = SUB_BASE[id];
    if (!base) return { x: 50, y: 50 };
    const coreId = nearestCore(id);
    const corePos = getCorePos(coreId);
    if (activeSubs.includes(id)) {
      // Pull active subs 15% closer to their core
      return {
        x: base.x + (corePos.x - base.x) * 0.15,
        y: base.y + (corePos.y - base.y) * 0.15,
      };
    }
    return base;
  }

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
            <div className="mb-3">
              <span className="text-[13px] font-bold tracking-[1px] text-[#D97706]">
                {q.kicker}
              </span>
              <div className="w-[60px] h-[2px] bg-[#D97706] mt-2.5" />
            </div>

            <div
              className={`min-h-[180px] sm:min-h-[220px] mb-6 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
            >
              <h1 className="font-serif text-[48px] sm:text-[64px] lg:text-[78px] leading-[1.0] text-[#0A1F14] font-semibold">
                {q.questionLine1}
              </h1>
              <span className="font-serif italic text-[48px] sm:text-[64px] lg:text-[78px] leading-[1.0] text-[#D97706] font-semibold block">
                {q.questionLine2}
              </span>
              <div className="font-data text-[13px] text-[#64748B] mt-3">
                Q{q.id} of {HERO_QUESTIONS.length} · most-asked this month
              </div>
            </div>

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

            <div className="flex flex-wrap gap-4 mb-7">
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

          {/* ── RIGHT: Contextual Constellation ── */}
          <div className="hidden lg:block relative min-h-[620px]">
            <div className="absolute top-[10px] right-[40px] w-[28px] h-[18px] border-t-2 border-r-2 border-[#D97706]" />

            <div className="relative w-full h-[620px]">
              {/* SVG lines + animated particles */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Animated particle along active lines */}
                  <circle id="particle" r="0.4" fill="#D97706" opacity="0.8" />
                  {/* Glow filter for active core */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Core-to-core lines */}
                {CORE_LINKS.map(([a, b]) => {
                  const pa = getCorePos(a);
                  const pb = getCorePos(b);
                  const isRelevant = a === activeCore || b === activeCore;
                  return (
                    <g key={`cc-${a}-${b}`}>
                      <line
                        x1={pa.x}
                        y1={pa.y}
                        x2={pb.x}
                        y2={pb.y}
                        stroke={isRelevant ? "rgba(217,119,6,0.25)" : "#DDD6C5"}
                        strokeWidth={isRelevant ? "0.18" : "0.1"}
                        className="transition-all duration-700 ease-out"
                      />
                      {isRelevant && (
                        <use href="#particle">
                          <animateMotion
                            dur={`${3 + Math.random() * 2}s`}
                            repeatCount="indefinite"
                            path={`M${pa.x},${pa.y} L${pb.x},${pb.y}`}
                          />
                        </use>
                      )}
                    </g>
                  );
                })}

                {/* Sub-to-core lines */}
                {CONSTELLATION_NODES.sub.map((s) => {
                  const sp = getSubPos(s.id);
                  const coreId = nearestCore(s.id);
                  const cp = getCorePos(coreId);
                  const isActive =
                    coreId === activeCore && activeSubs.includes(s.id);
                  return (
                    <g key={`sc-${s.id}`}>
                      <line
                        x1={sp.x}
                        y1={sp.y}
                        x2={cp.x}
                        y2={cp.y}
                        stroke={isActive ? "rgba(217,119,6,0.4)" : "#EDE8DF"}
                        strokeWidth={isActive ? "0.2" : "0.08"}
                        strokeDasharray={isActive ? "none" : "0.5 0.5"}
                        className="transition-all duration-700 ease-out"
                      />
                      {isActive && (
                        <use href="#particle">
                          <animateMotion
                            dur={`${2 + Math.random() * 1.5}s`}
                            repeatCount="indefinite"
                            path={`M${sp.x},${sp.y} L${cp.x},${cp.y}`}
                          />
                        </use>
                      )}
                    </g>
                  );
                })}

                {/* Pulsing ring around active core */}
                {(() => {
                  const cp = getCorePos(activeCore);
                  return (
                    <circle
                      cx={cp.x}
                      cy={cp.y}
                      r="4"
                      fill="none"
                      stroke="rgba(217,119,6,0.15)"
                      strokeWidth="0.15"
                      filter="url(#glow)"
                    >
                      <animate
                        attributeName="r"
                        values="3;5.5;3"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.3;0.08;0.3"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                })()}
              </svg>

              {/* Sub-topic pills — clickable, contextual position */}
              {CONSTELLATION_NODES.sub.map((s, i) => {
                const pos = getSubPos(s.id);
                const isActive = activeSubs.includes(s.id);
                const link = NODE_LINKS[s.id] || "/calculators";
                return (
                  <a
                    key={s.id}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[11.5px] font-medium border cursor-pointer transition-all duration-700 ease-out hover:border-[#D97706] hover:text-[#0A1F14] hover:scale-110 ${
                      isActive
                        ? "text-[#0A1F14] border-[#D97706] bg-white shadow-sm scale-[1.06] z-10"
                        : "text-[#64748B] border-[#D4CEC0] bg-[#FAFAF9] opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      animation: isActive
                        ? "none"
                        : `hero-float-${i % 2 === 0 ? "a" : "b"} ${6 + (i % 2)}s ease-in-out infinite`,
                    }}
                  >
                    {s.label}
                  </a>
                );
              })}

              {/* Core category pills — clickable, contextual pull */}
              {CONSTELLATION_NODES.core.map((c) => {
                const pos = getCorePos(c.id);
                const isActive = c.id === activeCore;
                const isGreen = c.style === "green";
                const link = NODE_LINKS[c.id] || "/";
                return (
                  <a
                    key={c.id}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-semibold tracking-[0.2px] cursor-pointer transition-all duration-700 ease-out hover:scale-110 z-20 ${
                      isGreen
                        ? "bg-[#EEF7F1] text-[#166534] border-[#16A34A]"
                        : "bg-[#FDF2E0] text-[#A55C04] border-[#D97706]"
                    } ${
                      isActive
                        ? "scale-[1.18] border-[3px] shadow-lg shadow-[rgba(217,119,6,0.15)]"
                        : "border-2 opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                  >
                    {c.label}
                  </a>
                );
              })}
            </div>

            <div className="text-center text-[13px] font-light text-[#64748B] mt-2">
              Every money decision. One platform. Disclosed methodology.
            </div>
          </div>
        </div>
      </div>

      {/* Constellation animations — unique, hard to copy */}
      <style jsx>{`
        @keyframes hero-float-a {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          33% {
            transform: translate(-50%, -50%) translateY(-5px) translateX(2px);
          }
          66% {
            transform: translate(-50%, -50%) translateY(2px) translateX(-1px);
          }
        }
        @keyframes hero-float-b {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          40% {
            transform: translate(-50%, -50%) translateY(3px) translateX(-2px);
          }
          70% {
            transform: translate(-50%, -50%) translateY(-3px) translateX(1px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition-duration: 0s !important;
          }
        }
      `}</style>
    </section>
  );
}
