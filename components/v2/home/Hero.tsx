"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import {
  HERO_QUESTIONS,
  CONSTELLATION_NODES,
} from "@/lib/content/hero-questions";

/* ── Node links ── */
const NODE_LINKS: Record<string, string> = {
  retirement: "/calculators/retirement",
  tax: "/calculators/tax",
  "mutual-funds": "/mutual-funds",
  "credit-cards": "/credit-cards",
  insurance: "/insurance",
  "kids-education": "/calculators/child-education",
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

/* ── Rest positions (used when a node is NOT the focus) ── */
const CORE_REST: Record<string, { x: number; y: number }> = {
  retirement: { x: 46, y: 10 },
  tax: { x: 78, y: 28 },
  "mutual-funds": { x: 24, y: 34 },
  "credit-cards": { x: 60, y: 48 },
  insurance: { x: 34, y: 62 },
  "kids-education": { x: 82, y: 72 },
};

const SUB_REST: Record<string, { x: number; y: number }> = {
  nps: { x: 15, y: 18 },
  "old-vs-new": { x: 92, y: 15 },
  "sip-calculator": { x: 12, y: 48 },
  "term-plan": { x: 66, y: 6 },
  "home-loan": { x: 94, y: 44 },
  "80c": { x: 90, y: 26 },
  "emergency-fund": { x: 16, y: 68 },
  hra: { x: 46, y: 28 },
  fire: { x: 54, y: 84 },
  "tax-harvesting": { x: 82, y: 4 },
  esops: { x: 24, y: 82 },
  "pension-gap": { x: 92, y: 62 },
};

/* ── Nearest core for each sub ── */
const SUB_PARENT: Record<string, string> = {};
for (const s of CONSTELLATION_NODES.sub) {
  let best = "";
  let bestD = Infinity;
  const sp = SUB_REST[s.id];
  if (!sp) continue;
  for (const [cid, cp] of Object.entries(CORE_REST)) {
    const d = (cp.x - sp.x) ** 2 + (cp.y - sp.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = cid;
    }
  }
  SUB_PARENT[s.id] = best;
}

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

const FOCAL = { x: 50, y: 38 };
const ROTATE_MS = 7000;

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const q = HERO_QUESTIONS[idx];
  const activeCore = q.activeCore;
  const activeSubs = q.activeSubTopics;

  const goTo = useCallback((i: number) => {
    setFading(true);
    setTimeout(() => {
      setIdx(i);
      setFading(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setFading(true);
        setTimeout(() => {
          setIdx((p) => (p + 1) % HERO_QUESTIONS.length);
          setFading(false);
        }, 300);
      }
    }, ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleDot = (i: number) => {
    goTo(i);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setFading(true);
        setTimeout(() => {
          setIdx((p) => (p + 1) % HERO_QUESTIONS.length);
          setFading(false);
        }, 300);
      }
    }, ROTATE_MS);
  };

  /* ── Compute contextual positions ── */
  const positions = useMemo(() => {
    const cores: Record<string, { x: number; y: number }> = {};
    const subs: Record<string, { x: number; y: number }> = {};

    // Active core → moves to focal dominant position
    for (const [id, rest] of Object.entries(CORE_REST)) {
      if (id === activeCore) {
        cores[id] = {
          x: rest.x + (FOCAL.x - rest.x) * 0.55,
          y: rest.y + (FOCAL.y - rest.y) * 0.5,
        };
      } else {
        // Inactive cores push outward from focal
        const dx = rest.x - FOCAL.x;
        const dy = rest.y - FOCAL.y;
        cores[id] = { x: rest.x + dx * 0.12, y: rest.y + dy * 0.12 };
      }
    }

    // Active subs cluster around the active core
    const coreFocal = cores[activeCore] || FOCAL;
    const activeSubList = activeSubs.filter((s) => SUB_REST[s]);
    const angleStep =
      activeSubList.length > 0 ? (2 * Math.PI) / activeSubList.length : 0;
    const orbitR = 16; // % radius for orbit

    for (const [id, rest] of Object.entries(SUB_REST)) {
      const activeIdx = activeSubList.indexOf(id);
      if (activeIdx >= 0) {
        // Orbit around active core
        const angle = angleStep * activeIdx - Math.PI / 2;
        subs[id] = {
          x: coreFocal.x + Math.cos(angle) * orbitR,
          y: coreFocal.y + Math.sin(angle) * (orbitR * 0.7),
        };
      } else {
        // Inactive subs push to edges
        const dx = rest.x - FOCAL.x;
        const dy = rest.y - FOCAL.y;
        subs[id] = { x: rest.x + dx * 0.08, y: rest.y + dy * 0.08 };
      }
    }

    return { cores, subs };
  }, [activeCore, activeSubs]);

  /* ── Bezier path between two points ── */
  function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    // Perpendicular offset for curve
    const off = Math.min(Math.abs(dx), Math.abs(dy)) * 0.15;
    const cx = mx + (dy > 0 ? off : -off);
    const cy = my + (dx > 0 ? -off : off);
    return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
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
                    onClick={() => handleDot(i)}
                    aria-label={`Go to question ${i + 1}`}
                    className={`w-[7px] h-[7px] rounded-full border-none cursor-pointer transition-all duration-500 ${i === idx ? "bg-[#D97706] scale-125" : "bg-[#D4CEC0]"}`}
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

            <div className="relative w-full h-[620px] constellation-container">
              {/* Background dot mesh */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.15]"
                viewBox="0 0 100 100"
              >
                {Array.from({ length: 120 }).map((_, i) => {
                  const gx = (i % 12) * 9 + 5;
                  const gy = Math.floor(i / 12) * 10 + 5;
                  const distToFocal = Math.sqrt(
                    (gx - FOCAL.x) ** 2 + (gy - FOCAL.y) ** 2,
                  );
                  const warp = Math.max(0, 1 - distToFocal / 40);
                  return (
                    <circle
                      key={i}
                      cx={gx}
                      cy={gy}
                      r={0.2 + warp * 0.3}
                      fill={warp > 0.3 ? "rgba(217,119,6,0.4)" : "#D4CEC0"}
                      className="transition-all duration-1000"
                    />
                  );
                })}
              </svg>

              {/* Connection lines + particles */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <circle id="p" r="0.35" fill="#D97706" opacity="0.9" />
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1.2" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient
                    id="goldLine"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="rgba(217,119,6,0.1)" />
                    <stop offset="50%" stopColor="rgba(217,119,6,0.5)" />
                    <stop offset="100%" stopColor="rgba(217,119,6,0.1)" />
                  </linearGradient>
                </defs>

                {/* Core-to-core bezier curves */}
                {CORE_LINKS.map(([a, b]) => {
                  const pa = positions.cores[a];
                  const pb = positions.cores[b];
                  if (!pa || !pb) return null;
                  const isRelevant = a === activeCore || b === activeCore;
                  const d = bezierPath(pa.x, pa.y, pb.x, pb.y);
                  return (
                    <g key={`cc-${a}-${b}`}>
                      <path
                        d={d}
                        fill="none"
                        stroke={isRelevant ? "url(#goldLine)" : "#E5E0D4"}
                        strokeWidth={isRelevant ? "0.18" : "0.08"}
                        className="transition-all duration-700 ease-out"
                      />
                      {isRelevant && (
                        <circle r="0.3" fill="#D97706" opacity="0.8">
                          <animateMotion
                            dur={`${3.5 + (a.length % 3) * 0.5}s`}
                            repeatCount="indefinite"
                            path={d}
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Sub-to-core bezier curves */}
                {CONSTELLATION_NODES.sub.map((s) => {
                  const sp = positions.subs[s.id];
                  const coreId = SUB_PARENT[s.id];
                  const cp = positions.cores[coreId];
                  if (!sp || !cp) return null;
                  const isActive =
                    coreId === activeCore && activeSubs.includes(s.id);
                  const d = bezierPath(sp.x, sp.y, cp.x, cp.y);
                  return (
                    <g key={`sc-${s.id}`}>
                      <path
                        d={d}
                        fill="none"
                        stroke={
                          isActive
                            ? "rgba(217,119,6,0.45)"
                            : "rgba(237,232,223,0.5)"
                        }
                        strokeWidth={isActive ? "0.18" : "0.06"}
                        strokeDasharray={isActive ? "none" : "0.4 0.6"}
                        className="transition-all duration-700 ease-out"
                      />
                      {isActive && (
                        <>
                          <circle r="0.25" fill="#16A34A" opacity="0.7">
                            <animateMotion
                              dur={`${2.5 + (s.id.length % 3) * 0.4}s`}
                              repeatCount="indefinite"
                              path={d}
                            />
                          </circle>
                          <circle r="0.2" fill="#D97706" opacity="0.6">
                            <animateMotion
                              dur={`${4 + (s.id.length % 2)}s`}
                              repeatCount="indefinite"
                              path={d}
                              begin="1s"
                            />
                          </circle>
                        </>
                      )}
                    </g>
                  );
                })}

                {/* Pulsing rings around active core */}
                {(() => {
                  const cp = positions.cores[activeCore];
                  if (!cp) return null;
                  return (
                    <>
                      <circle
                        cx={cp.x}
                        cy={cp.y}
                        r="4"
                        fill="none"
                        stroke="rgba(217,119,6,0.12)"
                        strokeWidth="0.12"
                        filter="url(#glow)"
                      >
                        <animate
                          attributeName="r"
                          values="3;6;3"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.25;0.05;0.25"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx={cp.x}
                        cy={cp.y}
                        r="5"
                        fill="none"
                        stroke="rgba(22,163,74,0.08)"
                        strokeWidth="0.08"
                      >
                        <animate
                          attributeName="r"
                          values="5;8;5"
                          dur="4.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.15;0.02;0.15"
                          dur="4.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </>
                  );
                })()}
              </svg>

              {/* Sub-topic pills */}
              {CONSTELLATION_NODES.sub.map((s, i) => {
                const pos = positions.subs[s.id];
                if (!pos) return null;
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
                        ? "text-[#0A1F14] border-[#D97706] bg-white shadow-md scale-[1.08] z-10"
                        : "text-[#94A3B8] border-[#E2DED3] bg-[#FAFAF9]/80 opacity-50 hover:opacity-100 scale-[0.92]"
                    }`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      animation: isActive
                        ? "none"
                        : `hero-float-${i % 3 === 0 ? "a" : i % 3 === 1 ? "b" : "c"} ${5.5 + (i % 4) * 0.7}s ease-in-out infinite`,
                    }}
                  >
                    {s.label}
                  </a>
                );
              })}

              {/* Core category pills */}
              {CONSTELLATION_NODES.core.map((c) => {
                const pos = positions.cores[c.id];
                if (!pos) return null;
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
                        ? "scale-[1.22] border-[3px] shadow-xl shadow-[rgba(217,119,6,0.2)]"
                        : "border-2 opacity-60 hover:opacity-100 scale-[0.95]"
                    }`}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
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

      <style jsx>{`
        @keyframes hero-float-a {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0) translateX(0)
              scale(0.92);
          }
          25% {
            transform: translate(-50%, -50%) translateY(-4px) translateX(2px)
              scale(0.92);
          }
          50% {
            transform: translate(-50%, -50%) translateY(1px) translateX(-1px)
              scale(0.93);
          }
          75% {
            transform: translate(-50%, -50%) translateY(3px) translateX(1px)
              scale(0.92);
          }
        }
        @keyframes hero-float-b {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0) translateX(0)
              scale(0.92);
          }
          30% {
            transform: translate(-50%, -50%) translateY(3px) translateX(-2px)
              scale(0.93);
          }
          60% {
            transform: translate(-50%, -50%) translateY(-2px) translateX(3px)
              scale(0.92);
          }
        }
        @keyframes hero-float-c {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0) translateX(0)
              scale(0.92);
          }
          20% {
            transform: translate(-50%, -50%) translateY(-3px) translateX(-1px)
              scale(0.92);
          }
          50% {
            transform: translate(-50%, -50%) translateY(2px) translateX(2px)
              scale(0.93);
          }
          80% {
            transform: translate(-50%, -50%) translateY(-1px) translateX(-2px)
              scale(0.92);
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
