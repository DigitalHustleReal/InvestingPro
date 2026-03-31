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
  // 1. Credit Cards — highest search + revenue
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
  // 2. Banking — user journey stage 1 (everyone needs a bank)
  {
    label: 'Banking',
    href: '/banking',
    icon: Building2,
    color: 'text-blue-600',
    colorBg: 'bg-blue-50',
    desc: 'Savings accounts, FDs, RDs — best rates from top banks',
    featured: {
      label: 'FD Calculator',
      href: '/calculators/fd',
      desc: 'Calculate maturity amount for any FD tenure and rate.',
      stat: '50+',
      statLabel: 'banks compared',
    },
    columns: [
      {
        heading: 'Bank Products',
        icon: Building2,
        links: [
          { label: 'Savings Accounts', href: '/banking?type=savings', badge: 'popular' },
          { label: 'Fixed Deposits', href: '/fixed-deposits', icon: PiggyBank, badge: 'popular' },
          { label: 'Recurring Deposits', href: '/banking?type=rd' },
          { label: 'Current Accounts', href: '/banking?type=current' },
          { label: 'Senior Citizen FDs', href: '/fixed-deposits?filter=senior' },
          { label: 'Tax-Saving FDs', href: '/fixed-deposits?filter=tax-saving' },
        ],
      },
      {
        heading: 'Tools & Compare',
        icon: Calculator,
        links: [
          { label: 'FD Calculator', href: '/calculators/fd', badge: 'popular' },
          { label: 'RD Calculator', href: '/calculators/rd' },
          { label: 'Compare FD Rates', href: '/fixed-deposits/compare' },
          { label: 'Banking Guide', href: '/banking/guides' },
        ],
      },
    ],
  },
  // 3. Loans — high revenue + search
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
          { label: 'CIBIL Score Simulator', href: '/loans#cibil-simulator' },
        ],
      },
    ],
  },
  // 4. Investing — wealth building (MFs, PPF, Stocks)
  {
    label: 'Investing',
    href: '/investing',
    icon: TrendingUp,
    color: 'text-green-600',
    colorBg: 'bg-green-50',
    desc: 'Mutual funds, PPF, NPS, stocks — build wealth independently',
    featured: {
      label: 'SIP Calculator',
      href: '/calculators/sip',
      desc: 'See how ₹10K/month grows with inflation-adjusted projections.',
      stat: '2,000+',
      statLabel: 'funds tracked',
    },
    columns: [
      {
        heading: 'Investment Products',
        icon: TrendingUp,
        links: [
          { label: 'Mutual Funds', href: '/mutual-funds', icon: TrendingUp, badge: 'popular' },
          { label: 'PPF & NPS', href: '/ppf-nps', icon: Building2 },
          { label: 'ELSS Tax Saving', href: '/mutual-funds?type=elss' },
          { label: 'Stocks & IPOs', href: '/stocks', badge: 'trending' },
          { label: 'Index Funds', href: '/mutual-funds?type=index' },
        ],
      },
      {
        heading: 'Tools & Compare',
        icon: Calculator,
        links: [
          { label: 'SIP Calculator', href: '/calculators/sip', badge: 'popular' },
          { label: 'PPF Calculator', href: '/calculators/ppf' },
          { label: 'Retirement Planner', href: '/calculators/retirement' },
          { label: 'Compare Funds', href: '/mutual-funds/compare' },
          { label: 'Overlap Checker', href: '/mutual-funds/overlap-checker', badge: 'new' },
        ],
      },
    ],
  },
  // 5. Insurance — protection
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
          { label: 'Claim Settlement Data', href: '/insurance/claims', badge: 'new' },
          { label: 'Insurance Guide', href: '/insurance/guides' },
        ],
      },
    ],
  },
  // 6. Demat Accounts — high commission, active trading
  {
    label: 'Demat Accounts',
    href: '/demat-accounts',
    icon: BarChart3,
    color: 'text-purple-600',
    colorBg: 'bg-purple-50',
    desc: 'Compare brokers — brokerage, platforms, charges',
    featured: {
      label: 'Open Demat Account',
      href: '/demat-accounts',
      desc: 'Compare discount and full-service brokers. Zero brokerage on delivery.',
      stat: '15+',
      statLabel: 'brokers compared',
    },
    columns: [
      {
        heading: 'Broker Types',
        icon: BarChart3,
        links: [
          { label: 'Best Demat Accounts', href: '/demat-accounts', badge: 'popular' },
          { label: 'Discount Brokers', href: '/demat-accounts?type=discount', badge: 'trending' },
          { label: 'Full Service Brokers', href: '/demat-accounts?type=full-service' },
          { label: 'Zero Brokerage', href: '/demat-accounts?type=zero-brokerage' },
          { label: 'Best for Beginners', href: '/demat-accounts?type=beginners' },
        ],
      },
      {
        heading: 'Tools & Compare',
        icon: Calculator,
        links: [
          { label: 'Brokerage Calculator', href: '/calculators/brokerage' },
          { label: 'Compare Brokers', href: '/demat-accounts/compare' },
          { label: 'IPO Calendar', href: '/stocks/ipo' },
          { label: 'Demat Guide', href: '/demat-accounts/guide' },
        ],
      },
    ],
  },
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
    if (href === '/banking') return ['/banking', '/fixed-deposits'].some(p => pathname?.startsWith(p));
    if (href === '/investing') return ['/mutual-funds', '/ppf-nps', '/stocks', '/investing'].some(p => pathname?.startsWith(p));
    if (href === '/demat-accounts') return pathname?.startsWith('/demat-accounts');
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

      {/* "More" removed — Small Business, Taxes, Personal Finance accessible via footer + search */}

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
