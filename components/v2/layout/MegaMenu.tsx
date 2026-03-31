'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useCallback } from 'react';
import {
  CreditCard, Landmark, TrendingUp, Shield, Calculator,
  Briefcase, Receipt, Wallet, ChevronRight, ArrowRight,
  Star, Flame, Sparkles, BarChart3, Home, Receipt as ReceiptIcon,
  PiggyBank, Building2, Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─── Data types ─── */

interface SubItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: 'popular' | 'trending' | 'new';
}

interface MenuColumn {
  heading: string;
  icon: LucideIcon;
  links: SubItem[];
}

interface Featured {
  label: string;
  href: string;
  desc: string;
  stat?: string;
  statLabel?: string;
}

interface MenuCategory {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
  colorBg: string;
  desc: string;
  featured?: Featured;
  columns: MenuColumn[];
}

/* ─── Badge component ─── */

function Badge({ type }: { type: 'popular' | 'trending' | 'new' }) {
  const config = {
    popular: { label: 'Popular', class: 'bg-blue-50 text-blue-600' },
    trending: { label: 'Trending', class: 'bg-orange-50 text-orange-600' },
    new: { label: 'New', class: 'bg-green-50 text-green-600' },
  };
  const c = config[type];
  return (
    <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${c.class}`}>
      {c.label}
    </span>
  );
}

/* ─── Menu data ─── */

const MENU: MenuCategory[] = [
  {
    label: 'Credit Cards',
    href: '/credit-cards',
    icon: CreditCard,
    color: 'text-green-600',
    colorBg: 'bg-green-50',
    desc: 'Compare 500+ cards from every major Indian bank',
    featured: {
      label: 'Find Your Perfect Card',
      href: '/credit-cards/find-your-card',
      desc: 'Answer 3 questions. Get a personalized recommendation in 30 seconds.',
      stat: '500+',
      statLabel: 'cards compared',
    },
    columns: [
      {
        heading: 'Best Cards',
        icon: Star,
        links: [
          { label: 'Best Credit Cards', href: '/credit-cards', badge: 'popular' },
          { label: 'Best Rewards Cards', href: '/credit-cards?filter=rewards' },
          { label: 'Best Cashback Cards', href: '/credit-cards?filter=cashback', badge: 'trending' },
          { label: 'Best Travel Cards', href: '/credit-cards?filter=travel' },
          { label: 'Best Fuel Cards', href: '/credit-cards?filter=fuel' },
          { label: 'No Annual Fee Cards', href: '/credit-cards?filter=no-fee' },
        ],
      },
      {
        heading: 'Tools & Compare',
        icon: BarChart3,
        links: [
          { label: 'Compare Cards Side-by-Side', href: '/credit-cards/compare' },
          { label: 'Rewards Calculator', href: '/calculators?type=rewards' },
          { label: 'Credit Card Reviews', href: '/credit-cards/reviews' },
          { label: 'Credit Card Guide', href: '/credit-cards/guides' },
        ],
      },
    ],
  },
  {
    label: 'Investing',
    href: '/investing',
    icon: TrendingUp,
    color: 'text-blue-600',
    colorBg: 'bg-blue-50',
    desc: 'Mutual funds, FDs, PPF, demat — all compared independently',
    featured: {
      label: 'SIP Calculator',
      href: '/calculators/sip',
      desc: 'See how ₹10K/month grows with inflation-adjusted projections.',
      stat: '2,000+',
      statLabel: 'funds tracked',
    },
    columns: [
      {
        heading: 'Products',
        icon: TrendingUp,
        links: [
          { label: 'Mutual Funds', href: '/mutual-funds', icon: TrendingUp, badge: 'popular' },
          { label: 'Fixed Deposits', href: '/fixed-deposits', icon: PiggyBank },
          { label: 'PPF & NPS', href: '/ppf-nps', icon: Building2 },
          { label: 'Demat Accounts', href: '/demat-accounts', icon: BarChart3 },
          { label: 'Stocks & IPOs', href: '/stocks', badge: 'trending' },
        ],
      },
      {
        heading: 'Calculators',
        icon: Calculator,
        links: [
          { label: 'SIP Calculator', href: '/calculators/sip', badge: 'popular' },
          { label: 'FD Calculator', href: '/calculators/fd' },
          { label: 'PPF Calculator', href: '/calculators/ppf' },
          { label: 'Retirement Planner', href: '/calculators/retirement' },
          { label: 'Compare Funds', href: '/mutual-funds/compare' },
        ],
      },
    ],
  },
  {
    label: 'Loans',
    href: '/loans',
    icon: Landmark,
    color: 'text-red-600',
    colorBg: 'bg-red-50',
    desc: 'Personal, home, car, education loans — lowest rates compared',
    featured: {
      label: 'EMI Calculator',
      href: '/calculators/emi',
      desc: 'Calculate EMI instantly. See prepayment savings.',
      stat: '60+',
      statLabel: 'lenders compared',
    },
    columns: [
      {
        heading: 'Loan Types',
        icon: Landmark,
        links: [
          { label: 'Personal Loans', href: '/loans?type=personal', badge: 'popular' },
          { label: 'Home Loans', href: '/loans?type=home' },
          { label: 'Car Loans', href: '/loans?type=car' },
          { label: 'Education Loans', href: '/loans?type=education' },
          { label: 'Gold Loans', href: '/loans?type=gold' },
          { label: 'Business Loans', href: '/loans?type=business' },
        ],
      },
      {
        heading: 'Tools & Guides',
        icon: Calculator,
        links: [
          { label: 'EMI Calculator', href: '/calculators/emi', badge: 'popular' },
          { label: 'Eligibility Checker', href: '/loans/eligibility-checker', badge: 'new' },
          { label: 'Home Loan vs SIP', href: '/calculators/home-loan-vs-sip' },
          { label: 'Loan Comparison', href: '/loans/compare' },
        ],
      },
    ],
  },
  {
    label: 'Insurance',
    href: '/insurance',
    icon: Shield,
    color: 'text-teal-600',
    colorBg: 'bg-teal-50',
    desc: 'Term, health, life, car insurance — claims data that matters',
    featured: {
      label: 'Coverage Calculator',
      href: '/calculators/insurance',
      desc: 'Find out how much coverage you actually need.',
      stat: '20+',
      statLabel: 'insurers compared',
    },
    columns: [
      {
        heading: 'Insurance Types',
        icon: Shield,
        links: [
          { label: 'Term Insurance', href: '/insurance?type=term', badge: 'popular' },
          { label: 'Health Insurance', href: '/insurance?type=health', badge: 'trending' },
          { label: 'Life Insurance', href: '/insurance?type=life' },
          { label: 'Car Insurance', href: '/insurance?type=car' },
          { label: 'Travel Insurance', href: '/insurance?type=travel' },
        ],
      },
      {
        heading: 'Tools & Guides',
        icon: Calculator,
        links: [
          { label: 'Coverage Calculator', href: '/calculators/insurance' },
          { label: 'Compare Plans', href: '/insurance/compare' },
          { label: 'Insurance Guide', href: '/insurance/guides' },
          { label: 'Claim Settlement Data', href: '/insurance/claims', badge: 'new' },
        ],
      },
    ],
  },
  {
    label: 'Tools',
    href: '/calculators',
    icon: Calculator,
    color: 'text-green-600',
    colorBg: 'bg-green-50',
    desc: '25 free financial calculators — no sign-up needed',
    featured: {
      label: 'Tax Calculator',
      href: '/calculators/tax',
      desc: 'Old vs New regime. Updated for Budget 2026.',
      stat: '25',
      statLabel: 'free calculators',
    },
    columns: [
      {
        heading: 'Popular Calculators',
        icon: Flame,
        links: [
          { label: 'SIP Calculator', href: '/calculators/sip', badge: 'popular' },
          { label: 'EMI Calculator', href: '/calculators/emi', badge: 'popular' },
          { label: 'FD Calculator', href: '/calculators/fd' },
          { label: 'Tax Calculator', href: '/calculators/tax', badge: 'trending' },
          { label: 'PPF Calculator', href: '/calculators/ppf' },
          { label: 'NPS Calculator', href: '/calculators/nps' },
        ],
      },
      {
        heading: 'Planning Tools',
        icon: Sparkles,
        links: [
          { label: 'Retirement Planner', href: '/calculators/retirement' },
          { label: 'Goal Planning', href: '/calculators/goal-planning' },
          { label: 'Portfolio Rebalancer', href: '/calculators/portfolio-rebalancing' },
          { label: 'Compare Products', href: '/compare' },
          { label: 'All 25 Calculators →', href: '/calculators' },
        ],
      },
    ],
  },
];

const MORE_LINKS: { label: string; href: string; icon: LucideIcon; desc: string }[] = [
  { label: 'Small Business', href: '/small-business', icon: Briefcase, desc: 'Loans, cards, GST for MSMEs' },
  { label: 'Taxes', href: '/taxes', icon: Receipt, desc: 'Income tax, GST, TDS guides' },
  { label: 'Personal Finance', href: '/personal-finance', icon: Wallet, desc: 'Budgeting, debt, retirement' },
];

/* ─── Component ─── */

export default function MegaMenu() {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback((index: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenIndex(index);
    setActiveTab(0);
  }, []);

  const closeMenu = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenIndex(null), 200);
  }, []);

  const keepOpen = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const isActive = (href: string) => {
    if (href === '/calculators') return pathname?.startsWith('/calculators') || pathname?.startsWith('/compare');
    if (href === '/investing') return ['/mutual-funds', '/fixed-deposits', '/ppf-nps', '/demat-accounts', '/stocks', '/investing'].some(p => pathname?.startsWith(p));
    return pathname?.startsWith(href);
  };

  // Single mega panel for all categories (tab-based)
  const showPanel = openIndex !== null && openIndex < MENU.length;
  const currentCat = showPanel ? MENU[openIndex!] : null;

  return (
    <div className="hidden lg:flex items-center gap-0.5 ml-8 flex-1">
      {/* Category triggers */}
      {MENU.map((cat, i) => (
        <div
          key={cat.label}
          onMouseEnter={() => openMenu(i)}
          onMouseLeave={closeMenu}
        >
          <Link
            href={cat.href}
            aria-current={isActive(cat.href) ? 'page' : undefined}
            aria-expanded={openIndex === i}
            aria-haspopup="true"
            className={`px-3 py-2.5 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap ${
              openIndex === i
                ? 'text-green-700 bg-green-50/50'
                : isActive(cat.href)
                ? 'text-green-700 font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {cat.label}
          </Link>
        </div>
      ))}

      {/* More trigger */}
      <div
        onMouseEnter={() => openMenu(MENU.length)}
        onMouseLeave={closeMenu}
        className="relative"
      >
        <button
          aria-expanded={openIndex === MENU.length}
          className="px-3 py-2.5 text-[13px] font-medium rounded-md text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          More
        </button>
        {openIndex === MENU.length && (
          <div
            className="absolute top-full right-0 pt-2 z-50"
            onMouseEnter={keepOpen}
            onMouseLeave={closeMenu}
          >
            <div className="w-[260px] bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/[.08] py-2">
              {MORE_LINKS.map((link) => {
                const MIcon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpenIndex(null)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-green-50 flex items-center justify-center flex-shrink-0 transition-colors">
                      <MIcon size={15} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-800">{link.label}</p>
                      <p className="text-[11px] text-gray-400">{link.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── Scrim overlay ─── */}
      {showPanel && (
        <div
          className="fixed inset-0 top-14 bg-black/10 z-40 transition-opacity duration-200"
          onMouseEnter={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* ─── Full-width mega panel ─── */}
      {showPanel && currentCat && (
        <div
          className="fixed left-0 right-0 top-14 z-50 pt-0 animate-in fade-in slide-in-from-top-1 duration-200"
          onMouseEnter={keepOpen}
          onMouseLeave={closeMenu}
        >
          <div className="bg-white border-b border-gray-200 shadow-2xl shadow-black/[.08]">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
              <div className="flex min-h-[360px]">

                {/* Left — category tabs */}
                <div className="w-[200px] border-r border-gray-100 py-4 pr-2 flex-shrink-0">
                  {MENU.map((cat, i) => {
                    const Icon = cat.icon;
                    const isTab = openIndex === i;
                    return (
                      <button
                        key={cat.label}
                        onMouseEnter={() => { setOpenIndex(i); setActiveTab(0); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150 border-l-[3px] ${
                          isTab
                            ? `${cat.colorBg} font-semibold border-l-green-600`
                            : 'hover:bg-gray-50 text-gray-500 border-l-transparent'
                        }`}
                      >
                        <Icon size={16} className={isTab ? cat.color : 'text-gray-400'} />
                        <span className={`text-[13px] ${isTab ? 'text-gray-900' : ''}`}>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Center — links in columns */}
                <div className="flex-1 py-5 px-6">
                  {/* Category header */}
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <p className="text-[13px] font-semibold text-gray-900">{currentCat.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{currentCat.desc}</p>
                  </div>

                  {/* Two columns */}
                  <div className="grid grid-cols-2 gap-8">
                    {currentCat.columns.map((col) => {
                      const ColIcon = col.icon;
                      return (
                        <div key={col.heading}>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <ColIcon size={12} />
                            {col.heading}
                          </p>
                          <ul className="space-y-0.5">
                            {col.links.map((link) => {
                              const LinkIcon = link.icon;
                              return (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setOpenIndex(null)}
                                    className="flex items-center gap-2 px-2 py-2 rounded-lg text-[13px] text-gray-700 hover:bg-gray-50 hover:text-green-700 transition-colors group"
                                  >
                                    {LinkIcon && (
                                      <LinkIcon size={14} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                                    )}
                                    <span>{link.label}</span>
                                    {link.badge && <Badge type={link.badge} />}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right — featured sidebar */}
                {currentCat.featured && (
                  <div className="w-[220px] border-l border-gray-100 p-5 flex-shrink-0 bg-gray-50/30">
                    {/* Stat highlight */}
                    {currentCat.featured.stat && (
                      <div className="mb-4">
                        <p className="text-[28px] font-black text-gray-900 tracking-tight leading-none">
                          {currentCat.featured.stat}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{currentCat.featured.statLabel}</p>
                      </div>
                    )}

                    {/* Featured CTA card */}
                    <div className={`p-3.5 rounded-xl ${currentCat.colorBg} border border-gray-200/50`}>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{currentCat.featured.label}</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{currentCat.featured.desc}</p>
                      <Link
                        href={currentCat.featured.href}
                        onClick={() => setOpenIndex(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 transition-colors"
                      >
                        Try it free <ArrowRight size={12} />
                      </Link>
                    </div>

                    {/* View all */}
                    <Link
                      href={currentCat.href}
                      onClick={() => setOpenIndex(null)}
                      className="mt-4 flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-700 transition-colors"
                    >
                      View all {currentCat.label} <ChevronRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
