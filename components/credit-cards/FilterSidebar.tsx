"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import {
  RotateCcw,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Plane,
  Fuel as FuelIcon,
  Utensils,
  Clapperboard,
  ShoppingBag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface CCFilterState {
  maxFee: number;
  minRewardRate: number;
  networks: string[];
  issuers: string[];
  features: string[];
  spendingCategories: string[];
  creditScore: string[]; // NEW
  rewardsType: string[]; // NEW
  cardType: string[]; // NEW
}

interface FilterSidebarProps {
  filters: CCFilterState;
  setFilters: React.Dispatch<React.SetStateAction<CCFilterState>>;
}

const NETWORKS = ["Visa", "Mastercard", "Amex", "Rupay"];
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
  { label: "Good (700-749)", value: "good" },
  { label: "Fair (650-699)", value: "fair" },
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
    <div className="w-full bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
        <h3 className="font-semibold text-ink flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4 text-green-600" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 text-xs text-ink-60 hover:text-green-600"
        >
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>

      <div className="p-5 space-y-6">
        {/* 1. Credit Score (NEW - High Priority) */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-60 uppercase tracking-wider flex items-center gap-2">
            Eligibility (Score)
            <Badge
              variant="outline"
              className="text-[9px] h-4 px-1 border-green-200 text-green-600"
            >
              New
            </Badge>
          </label>
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
                  className="text-sm font-medium text-ink-60 cursor-pointer"
                >
                  {score.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100" />

        {/* 2. Card Type (NEW) */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-60 uppercase tracking-wider">
            Card Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CARD_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleArrayItem("cardType", type)}
                className={`text-xs px-3.5 py-2 rounded-lg border transition-all font-semibold cursor-pointer ${
                  filters.cardType.includes(type)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-ink-60 border-gray-200 hover:border-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100" />

        {/* 3. Annual Fee Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-ink-60 uppercase tracking-wider">
              Max Annual Fee
            </label>
            <span className="text-sm font-bold text-ink">
              ₹{filters.maxFee}
            </span>
          </div>
          <Slider
            defaultValue={[filters.maxFee]}
            max={50000} // Increased range
            step={500}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, maxFee: val[0] }))
            }
          />
        </div>

        {/* 4. Issuer Bank (Expanded) */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-60 uppercase tracking-wider">
            Issuer Bank
          </label>
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
                  className="text-sm text-ink-60 cursor-pointer"
                >
                  {issuer} Bank
                </Label>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-green-600 p-0 hover:bg-transparent hover:text-green-700 cursor-pointer"
              onClick={() => setShowAllBanks(!showAllBanks)}
              aria-expanded={showAllBanks}
            >
              {showAllBanks
                ? "Show Less"
                : `See All Banks (${ISSUERS.length - 6}+)`}
            </Button>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100" />

        {/* 5. Rewards Type (NEW) */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-60 uppercase tracking-wider">
            Rewards Type
          </label>
          <div className="flex flex-wrap gap-2">
            {REWARDS_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleArrayItem("rewardsType", type)}
                className={`text-xs px-3.5 py-2 rounded-full border transition-all cursor-pointer ${
                  filters.rewardsType.includes(type)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-ink-60 border-gray-200 hover:border-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Spending Categories */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-60 uppercase tracking-wider">
            Best For Spending
          </label>
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
                  className="text-sm font-medium text-ink-60 cursor-pointer flex items-center gap-2"
                >
                  <category.icon className="w-4 h-4 text-green-500" />
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Premium Features */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-60 uppercase tracking-wider">
            Features
          </label>
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
                  className="text-sm font-medium text-ink-60 cursor-pointer"
                >
                  {feat}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Mobile apply button typically rendered by parent container, but we keep this clean here */}
    </div>
  );
}
