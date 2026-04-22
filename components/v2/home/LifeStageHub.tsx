"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Briefcase,
  Umbrella,
  Receipt,
  HeartHandshake,
  GraduationCap,
  ArrowRight,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Life Stage Hub — replaces MoreResources with intent-driven discovery.
// Grid of 6 life moments, each opening a curated bundle (3 articles + 3
// calculators + 2 products). Users click because the card matches their
// actual life, not because we have "lots of content."
//
// Why this beats the old MoreResources tabs:
//  - Life-stage > topic — people search "buying my first home", not "loans"
//  - Curated bundles > long lists — we're saying "these 8 things are what you need"
//  - Open-in-place — no page jump, keeps users on the homepage longer

interface Stage {
  key: string;
  icon: LucideIcon;
  title: string;
  teaser: string;
  articles: { label: string; href: string }[];
  calculators: { label: string; href: string }[];
  products: { label: string; href: string }[];
}

const STAGES: Stage[] = [
  {
    key: "first-job",
    icon: Briefcase,
    title: "I just started working",
    teaser: "First salary, first tax return, first credit score.",
    articles: [
      { label: "First job money checklist", href: "/articles/first-job-money-checklist" },
      { label: "Choosing old vs new tax regime", href: "/articles/old-vs-new-tax-regime-which-to-choose" },
      { label: "Building a credit score from scratch", href: "/articles/how-to-build-credit-score-india" },
    ],
    calculators: [
      { label: "Old vs New Regime", href: "/calculators/old-vs-new-tax" },
      { label: "Starter SIP plan", href: "/calculators/sip" },
      { label: "HRA exemption", href: "/calculators/hra" },
    ],
    products: [
      { label: "No-fee starter cards", href: "/credit-cards?filter=no-fee" },
      { label: "First-time investor ELSS", href: "/mutual-funds?type=elss" },
    ],
  },
  {
    key: "buying-home",
    icon: Home,
    title: "I'm buying a home",
    teaser: "Down payment, EMI strategy, tax benefits, all of it.",
    articles: [
      { label: "Home-buying checklist (first-timer)", href: "/articles/home-buying-checklist-india" },
      { label: "Down payment vs EMI trade-off", href: "/articles/down-payment-vs-emi" },
      { label: "80EE and 24(b) deductions explained", href: "/articles/home-loan-tax-benefits" },
    ],
    calculators: [
      { label: "Home loan EMI", href: "/calculators/home-loan-emi" },
      { label: "Prepayment savings", href: "/calculators/loan-prepayment" },
      { label: "Stamp duty calculator", href: "/calculators/stamp-duty" },
    ],
    products: [
      { label: "Compare home loan rates", href: "/loans?type=home" },
      { label: "Home loan protection", href: "/insurance?type=home" },
    ],
  },
  {
    key: "retirement",
    icon: Umbrella,
    title: "I'm planning retirement",
    teaser: "Corpus target, withdrawal strategy, NPS, annuities.",
    articles: [
      { label: "How much do you need to retire in India?", href: "/articles/retirement-corpus-india" },
      { label: "PPF vs NPS — which for retirement?", href: "/articles/ppf-vs-nps-which-is-better-for-retirement-savings" },
      { label: "FIRE in India — is it realistic?", href: "/articles/fire-india-feasibility" },
    ],
    calculators: [
      { label: "Retirement corpus", href: "/calculators/retirement" },
      { label: "NPS projection", href: "/calculators/nps" },
      { label: "SWP drawdown", href: "/calculators/swp" },
    ],
    products: [
      { label: "Senior citizen FDs", href: "/fixed-deposits?filter=senior" },
      { label: "Debt mutual funds", href: "/mutual-funds?type=debt" },
    ],
  },
  {
    key: "taxes",
    icon: Receipt,
    title: "It's tax season",
    teaser: "Maximise 80C, pick a regime, file without drama.",
    articles: [
      { label: "Complete 80C guide (ranked by return)", href: "/articles/section-80c-complete-guide" },
      { label: "HRA exemption — common mistakes", href: "/articles/hra-exemption-complete-guide" },
      { label: "ITR filing checklist", href: "/articles/itr-filing-checklist" },
    ],
    calculators: [
      { label: "Income tax calculator", href: "/calculators/tax" },
      { label: "80C optimiser", href: "/calculators/80c" },
      { label: "Capital gains (LTCG)", href: "/calculators/ltcg" },
    ],
    products: [
      { label: "ELSS funds (₹46,800 saved)", href: "/mutual-funds?type=elss" },
      { label: "Tax-saving 5-yr FDs", href: "/fixed-deposits?filter=tax-saving" },
    ],
  },
  {
    key: "ageing-parents",
    icon: HeartHandshake,
    title: "My parents are ageing",
    teaser: "Health cover, senior FDs, medical emergencies, wills.",
    articles: [
      { label: "Best health insurance for senior parents", href: "/articles/health-insurance-senior-citizens" },
      { label: "Senior citizen FD rates compared", href: "/articles/best-senior-citizen-fd-rates" },
      { label: "Writing a will — Indian law basics", href: "/articles/will-writing-india-guide" },
    ],
    calculators: [
      { label: "Senior health cover size", href: "/calculators/health-cover" },
      { label: "Senior FD returns", href: "/calculators/fd" },
      { label: "Critical illness cover", href: "/calculators/critical-illness" },
    ],
    products: [
      { label: "Senior health plans", href: "/insurance?type=health&filter=senior" },
      { label: "SCSS / Senior savings scheme", href: "/articles/scss-senior-citizens" },
    ],
  },
  {
    key: "kids-future",
    icon: GraduationCap,
    title: "I'm planning for my kids",
    teaser: "Education corpus, Sukanya, PPF, mindset calculators.",
    articles: [
      { label: "Education cost projection (IIT/IIM/abroad)", href: "/articles/child-education-cost-india" },
      { label: "Sukanya Samriddhi vs PPF for daughters", href: "/articles/sukanya-samriddhi-vs-ppf" },
      { label: "Kid's first bank account — how?", href: "/articles/childs-first-bank-account" },
    ],
    calculators: [
      { label: "Education corpus target", href: "/calculators/education-planning" },
      { label: "Sukanya Samriddhi", href: "/calculators/sukanya-samriddhi" },
      { label: "Child PPF corpus", href: "/calculators/ppf" },
    ],
    products: [
      { label: "Child education ULIPs", href: "/insurance?type=child" },
      { label: "Long-term SIP funds", href: "/mutual-funds?type=equity" },
    ],
  },
];

export default function LifeStageHub() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openStage = STAGES.find((s) => s.key === openKey);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-8">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
            Life stages · Curated bundles
          </div>
          <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink">
            Pick your moment.{" "}
            <em className="italic text-indian-gold">We&apos;ll pick the rest.</em>
          </h2>
          <p className="text-sm text-ink-60 mt-3 leading-relaxed">
            Each life stage comes with a curated bundle — 3 articles, 3
            calculators, 2 products. No browsing 228 things to find what you
            actually need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isOpen = openKey === stage.key;
            return (
              <button
                key={stage.key}
                onClick={() => setOpenKey(isOpen ? null : stage.key)}
                className={`group text-left border-2 rounded-sm p-5 transition-all ${
                  isOpen
                    ? "border-indian-gold bg-indian-gold/5"
                    : "border-ink/10 bg-white hover:border-ink/30"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-indian-gold/10 rounded-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indian-gold" />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 border border-ink/15 px-1.5 py-0.5">
                    {stage.articles.length + stage.calculators.length + stage.products.length} items
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-ink mb-1 leading-snug">
                  {stage.title}
                </h3>
                <p className="text-[13px] text-ink-60 leading-relaxed mb-3">
                  {stage.teaser}
                </p>
                <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold flex items-center gap-1">
                  {isOpen ? "Close" : "Open bundle"}{" "}
                  <ArrowRight
                    className={`w-3 h-3 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded bundle — shown below grid, full-width */}
        {openStage && (
          <div className="mt-6 bg-white border-2 border-indian-gold rounded-sm p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-2">
                  Bundle · {openStage.title}
                </div>
                <h3 className="font-display font-bold text-2xl text-ink">
                  Everything you need, nothing you don&apos;t.
                </h3>
              </div>
              <button
                onClick={() => setOpenKey(null)}
                className="w-8 h-8 border border-ink/20 rounded-sm flex items-center justify-center hover:border-ink transition-colors"
                aria-label="Close bundle"
              >
                <X className="w-4 h-4 text-ink" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Articles */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-3 pb-2 border-b border-ink/10">
                  Read first
                </div>
                <ul className="space-y-2">
                  {openStage.articles.map((a) => (
                    <li key={a.href}>
                      <Link
                        href={a.href}
                        className="group flex items-start gap-2 text-[14px] text-ink hover:text-authority-green transition-colors"
                      >
                        <ArrowRight className="w-3 h-3 text-indian-gold flex-shrink-0 mt-1" />
                        <span className="group-hover:underline">{a.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Calculators */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-3 pb-2 border-b border-ink/10">
                  Run the numbers
                </div>
                <ul className="space-y-2">
                  {openStage.calculators.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        className="group flex items-start gap-2 text-[14px] text-ink hover:text-authority-green transition-colors"
                      >
                        <ArrowRight className="w-3 h-3 text-indian-gold flex-shrink-0 mt-1" />
                        <span className="group-hover:underline">{c.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Products */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-3 pb-2 border-b border-ink/10">
                  Products to consider
                </div>
                <ul className="space-y-2">
                  {openStage.products.map((p) => (
                    <li key={p.href}>
                      <Link
                        href={p.href}
                        className="group flex items-start gap-2 text-[14px] text-ink hover:text-authority-green transition-colors"
                      >
                        <ArrowRight className="w-3 h-3 text-indian-gold flex-shrink-0 mt-1" />
                        <span className="group-hover:underline">{p.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
