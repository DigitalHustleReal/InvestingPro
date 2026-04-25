"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import {
  RotateCcw,
  Filter,
  ShoppingCart,
  Plane,
  Fuel as FuelIcon,
  Utensils,
  Clapperboard,
  ShoppingBag,
} from "lucide-react";

export interface CCFilterState {
  maxFee: number;
  minRewardRate: number;
  networks: string[];
  issuers: string[];
  features: string[];
  spendingCategories: string[];
  creditScore: string[];
  rewardsType: string[];
  cardType: string[];
}

interface FilterSidebarProps {
  filters: CCFilterState;
  setFilters: React.Dispatch<React.SetStateAction<CCFilterState>>;
}

const ISSUERS = [
  "HDFC",
  "SBI",
  "Axis",
  "ICICI",
  "Amex",
  "IDFC First",
  "Kotak",
  "IndusInd",
  "RBL",
  "Yes Bank",
  "Standard Chartered",
  "Citi",
];
const FEATURES = [
  "Lounge Access",
  "No Forex Fee",
  "Fuel Surcharge Waiver",
  "Golf Access",
  "Air Miles",
  "Concierge",
  "Insurance",
];
const CARD_TYPES = [
  "Rewards",
  "Travel",
  "Cashback",
  "Lifetime Free",
  "Premium",
  "Student",
  "Business",
];
const REWARDS_TYPES = ["Cashback", "Air Miles", "Points", "Vouchers", "Fuel"];
const CREDIT_SCORES = [
  { label: "Excellent (750+)", value: "excellent" },
  { label: "Good (700–749)", value: "good" },
  { label: "Fair (650–699)", value: "fair" },
  { label: "New to Credit", value: "new" },
];

const SPENDING_CATEGORIES = [
  { value: "groceries", label: "Groceries", icon: ShoppingCart },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "fuel", label: "Fuel", icon: FuelIcon },
  { value: "dining", label: "Dining", icon: Utensils },
  { value: "entertainment", label: "Movies", icon: Clapperboard },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
];

/**
 * V3 design tokens only — ink/canvas/indian-gold/action-green.
 * Eyebrow labels use the canonical pattern:
 *   font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold
 * Active filter pills = indian-gold (emphasis), inactive = bg-white + ink-12
 * border. No green-* (would conflict with the "indian-gold = emphasis" rule).
 */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold">
      {children}
    </div>
  );
}

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [showAllBanks, setShowAllBanks] = useState(false);
  const displayedIssuers = showAllBanks ? ISSUERS : ISSUERS.slice(0, 6);

  const handleReset = () => {
    setFilters({
      maxFee: 50000,
      minRewardRate: 0,
      networks: [],
      issuers: [],
      features: [],
      spendingCategories: [],
      creditScore: [],
      rewardsType: [],
      cardType: [],
    });
  };

  const toggleArrayItem = (key: keyof CCFilterState, value: string) => {
    setFilters((prev) => {
      const current = prev[key] as string[];
      const newArray = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: newArray };
    });
  };

  return (
    <div className="w-full bg-white rounded-sm border border-ink-12 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-ink-12 flex items-center justify-between">
        <h3 className="font-display font-black text-[15px] text-ink flex items-center gap-2">
          <Filter className="w-4 h-4 text-indian-gold" strokeWidth={1.75} />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 font-mono text-[10px] uppercase tracking-wider text-ink-60 hover:text-indian-gold hover:bg-transparent px-2"
        >
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>

      <div className="px-5 py-5 space-y-7">
        {/* 1. Eligibility */}
        <div className="space-y-3">
          <SectionLabel>Eligibility · Score</SectionLabel>
          <div className="space-y-2">
            {CREDIT_SCORES.map((score) => (
              <div className="flex items-center space-x-2" key={score.value}>
                <Checkbox
                  id={`score-${score.value}`}
                  checked={filters.creditScore.includes(score.value)}
                  onCheckedChange={() =>
                    toggleArrayItem("creditScore", score.value)
                  }
                />
                <Label
                  htmlFor={`score-${score.value}`}
                  className="text-[13px] text-ink-60 cursor-pointer"
                >
                  {score.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-ink-12" />

        {/* 2. Card Category */}
        <div className="space-y-3">
          <SectionLabel>Card category</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {CARD_TYPES.map((type) => {
              const active = filters.cardType.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleArrayItem("cardType", type)}
                  className={`text-[12px] px-3 py-1.5 rounded-sm border font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    active
                      ? "bg-indian-gold text-ink border-indian-gold"
                      : "bg-white text-ink-60 border-ink-12 hover:border-indian-gold hover:text-ink"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-px bg-ink-12" />

        {/* 3. Annual Fee Slider */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <SectionLabel>Max annual fee</SectionLabel>
            <span className="font-mono text-[14px] font-black text-ink tabular-nums">
              ₹{filters.maxFee.toLocaleString("en-IN")}
            </span>
          </div>
          <Slider
            defaultValue={[filters.maxFee]}
            max={50000}
            step={500}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, maxFee: val[0] }))
            }
          />
        </div>

        <div className="w-full h-px bg-ink-12" />

        {/* 4. Issuer Bank */}
        <div className="space-y-3">
          <SectionLabel>Issuer bank</SectionLabel>
          <div className="space-y-2">
            {displayedIssuers.map((issuer) => (
              <div className="flex items-center space-x-2" key={issuer}>
                <Checkbox
                  id={`issuer-${issuer}`}
                  checked={filters.issuers.includes(issuer)}
                  onCheckedChange={() => toggleArrayItem("issuers", issuer)}
                />
                <Label
                  htmlFor={`issuer-${issuer}`}
                  className="text-[13px] text-ink-60 cursor-pointer"
                >
                  {issuer} Bank
                </Label>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 font-mono text-[10px] uppercase tracking-wider text-indian-gold p-0 hover:bg-transparent hover:text-ink cursor-pointer"
              onClick={() => setShowAllBanks(!showAllBanks)}
              aria-expanded={showAllBanks}
            >
              {showAllBanks
                ? "Show less"
                : `See all banks (${ISSUERS.length - 6}+)`}
            </Button>
          </div>
        </div>

        <div className="w-full h-px bg-ink-12" />

        {/* 5. Rewards Type */}
        <div className="space-y-3">
          <SectionLabel>Rewards type</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {REWARDS_TYPES.map((type) => {
              const active = filters.rewardsType.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleArrayItem("rewardsType", type)}
                  className={`text-[12px] px-3 py-1.5 rounded-sm border font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    active
                      ? "bg-ink text-canvas border-ink"
                      : "bg-white text-ink-60 border-ink-12 hover:border-indian-gold hover:text-ink"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-px bg-ink-12" />

        {/* 6. Spending Categories */}
        <div className="space-y-3">
          <SectionLabel>Best for spending</SectionLabel>
          <div className="space-y-2">
            {SPENDING_CATEGORIES.map((category) => (
              <div className="flex items-center space-x-2" key={category.value}>
                <Checkbox
                  id={`spending-${category.value}`}
                  checked={filters.spendingCategories.includes(category.value)}
                  onCheckedChange={() =>
                    toggleArrayItem("spendingCategories", category.value)
                  }
                />
                <Label
                  htmlFor={`spending-${category.value}`}
                  className="text-[13px] text-ink-60 cursor-pointer flex items-center gap-2"
                >
                  <category.icon
                    className="w-4 h-4 text-indian-gold"
                    strokeWidth={1.75}
                  />
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-ink-12" />

        {/* 7. Premium Features */}
        <div className="space-y-3">
          <SectionLabel>Features</SectionLabel>
          <div className="space-y-2">
            {FEATURES.map((feat) => (
              <div className="flex items-center space-x-2" key={feat}>
                <Checkbox
                  id={`feat-${feat}`}
                  checked={filters.features.includes(feat)}
                  onCheckedChange={() => toggleArrayItem("features", feat)}
                />
                <Label
                  htmlFor={`feat-${feat}`}
                  className="text-[13px] text-ink-60 cursor-pointer"
                >
                  {feat}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
