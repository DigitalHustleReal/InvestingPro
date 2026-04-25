"use client";

import React, { useState } from "react";
import { Search, Zap, LayoutGrid, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { RichProductCard } from "@/components/products/RichProductCard";
import { RichProduct } from "@/types/rich-product";
import {
  FilterSidebar,
  CCFilterState,
} from "@/components/credit-cards/FilterSidebar";
import { ResponsiveFilterContainer } from "@/components/products/ResponsiveFilterContainer";
import { CreditCardTable } from "@/components/credit-cards/CreditCardTable";
import dynamic from "next/dynamic";
const CompareTray = dynamic(
  () =>
    import("@/components/compare/CompareTray").then((mod) => mod.CompareTray),
  { ssr: false },
);
import FilterPresets from "@/components/filters/FilterPresets";
import { ScoringWeights, scoreCreditCard } from "@/lib/products/scoring-rules";

interface CreditCardsClientProps {
  initialAssets: RichProduct[];
}

export default function CreditCardsClient({
  initialAssets,
}: CreditCardsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter State
  const [filters, setFilters] = useState<CCFilterState>({
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

  // View Mode State
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Sort State - NEW
  const [sortBy, setSortBy] = useState<
    "match" | "popularity" | "trending" | "rating"
  >("match");

  // Filter Logic
  const filteredAssets = initialAssets.filter((asset) => {
    const name = (asset.name || "").toLowerCase();
    const provider = (asset.provider_name || "").toLowerCase();
    const searchMatch =
      name.includes(searchTerm.toLowerCase()) ||
      provider.includes(searchTerm.toLowerCase());

    // Issuer Filter
    const issuerMatch =
      filters.issuers.length === 0 ||
      filters.issuers.some((i) => provider.includes(i.toLowerCase()));

    // Network Filter - look in specs or description
    const featuresStr =
      JSON.stringify(asset.features || {}).toLowerCase() +
      (asset.description || "").toLowerCase();
    const networkMatch =
      filters.networks.length === 0 ||
      filters.networks.some((n) => featuresStr.includes(n.toLowerCase()));

    // Features Filter
    const featureMatch =
      filters.features.length === 0 ||
      filters.features.some((f) => featuresStr.includes(f.toLowerCase()));

    // Spending Categories
    const spendingMatch =
      filters.spendingCategories.length === 0 ||
      filters.spendingCategories.some((category) => {
        const term = category.toLowerCase().replace(/([a-z])([A-Z])/g, "$1 $2");
        return (
          featuresStr.includes(term) ||
          name.includes(term) ||
          (asset.bestFor?.toLowerCase() || "").includes(term)
        );
      });

    // NEW: Card Type Filter (Rewards, Travel, etc.)
    const cardTypeMatch =
      filters.cardType.length === 0 ||
      filters.cardType.some((type) => {
        const t = type.toLowerCase();
        return (
          featuresStr.includes(t) ||
          name.includes(t) ||
          (asset.category || "").toLowerCase().includes(t)
        );
      });

    // NEW: Rewards Type Filter (Cashback, Miles, etc.)
    const rewardsTypeMatch =
      filters.rewardsType.length === 0 ||
      filters.rewardsType.some((type) => {
        const t = type.toLowerCase();
        return (
          featuresStr.includes(t) ||
          (asset.specs?.rewardsType || "").toLowerCase().includes(t)
        );
      });

    // Credit Score Filter — match against min_income as proxy for card tier
    const scoreMatch =
      filters.creditScore.length === 0 ||
      filters.creditScore.some((score) => {
        const minIncome =
          parseInt(
            String(
              asset.specs?.min_income || asset.specs?.minIncome || "0",
            ).replace(/[^0-9]/g, ""),
          ) || 0;
        if (score === "excellent") return true; // 750+ qualifies for all
        if (score === "good") return minIncome <= 600000; // Mid-tier cards
        if (score === "fair") return minIncome <= 300000; // Entry-level cards
        if (score === "new")
          return (
            minIncome <= 200000 ||
            (asset.bestFor || "").toLowerCase().includes("student")
          );
        return true;
      });

    // Fee logic — check both specs.annual_fee and specs.annualFee
    const annualFeeStr =
      asset.specs?.annual_fee || asset.specs?.annualFee || "0";
    const annualFee =
      parseInt(String(annualFeeStr).replace(/[^0-9]/g, "")) || 0;
    const feeMatch =
      filters.maxFee === 0 ? annualFee === 0 : annualFee <= filters.maxFee;

    return (
      searchMatch &&
      issuerMatch &&
      networkMatch &&
      featureMatch &&
      spendingMatch &&
      cardTypeMatch &&
      feeMatch &&
      rewardsTypeMatch &&
      scoreMatch
    );
  });

  // ---------------------------------------------------------
  // DYNAMIC SCORING LOGIC (Tier 3)
  // ---------------------------------------------------------
  const [weights, setWeights] = useState<ScoringWeights>({
    rewards: 0.35,
    fees: 0.3,
    travel: 0.35,
  });

  const scoredAssets = React.useMemo(() => {
    return filteredAssets
      .map((asset) => {
        const rawFee =
          asset.features?.["annual_fee"] || asset.specs?.annualFee || "500";
        const feeVal =
          typeof rawFee === "number"
            ? rawFee
            : parseInt(String(rawFee).replace(/[^0-9]/g, "")) || 0;
        const rawRate =
          asset.features?.["reward_rate"] || asset.specs?.rewardRate || "1%";

        const type = (
          asset.category === "credit_card"
            ? asset.bestFor || "standard"
            : "standard"
        ).toLowerCase();
        const normalizedType = type.includes("travel")
          ? "travel"
          : type.includes("shop")
            ? "shopping"
            : type.includes("free")
              ? "lifetime_free"
              : "standard";

        const dummyCard: any = {
          rewardRate: String(rawRate),
          loungeAccess: asset.features?.["lounge_access"] || "Nil",
          type: normalizedType,
          annualFee: feeVal,
        };

        const scoreResult = scoreCreditCard(dummyCard, weights);
        const matchScore = Math.round(scoreResult.overall * 10);
        // Derive popularity from match score + index position (deterministic, no Math.random)
        const popularity =
          matchScore * 100 + (asset.rating?.overall || 4) * 500;
        const trending = matchScore >= 8 && feeVal <= 1000;

        return {
          ...asset,
          matchScore,
          scoreBreakdown: scoreResult.breakdown,
          rawScore: scoreResult.overall,
          popularity,
          trending,
        };
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "popularity":
            return (b.popularity || 0) - (a.popularity || 0);
          case "trending":
            return (
              (b.trending ? 1000 : 0) -
              (a.trending ? 1000 : 0) +
              ((b.popularity || 0) - (a.popularity || 0))
            );
          case "rating":
            return (b.rating?.overall || 0) - (a.rating?.overall || 0);
          case "match":
          default:
            return b.matchScore - a.matchScore;
        }
      });
  }, [filteredAssets, weights, sortBy]);

  // ---------------------------------------------------------

  const activeFiltersCount =
    (filters.issuers.length > 0 ? 1 : 0) +
    (filters.networks.length > 0 ? 1 : 0) +
    (filters.features.length > 0 ? 1 : 0) +
    (filters.spendingCategories.length > 0 ? 1 : 0) +
    (filters.cardType.length > 0 ? 1 : 0) +
    (filters.rewardsType.length > 0 ? 1 : 0);

  const [visibleCount, setVisibleCount] = useState(6);
  const displayedAssets = scoredAssets.slice(0, visibleCount);
  const hasMore = visibleCount < scoredAssets.length;

  React.useEffect(() => {
    setVisibleCount(6);
  }, [filters, searchTerm, weights]);

  // Quick filter pill state
  const [activeQuickFilter, setActiveQuickFilter] = useState("all");

  const QUICK_FILTERS = [
    { label: "All Cards", key: "all" },
    { label: "Rewards", key: "rewards" },
    { label: "Cashback", key: "cashback" },
    { label: "Travel", key: "travel" },
    { label: "No Annual Fee", key: "no-fee" },
    { label: "Fuel", key: "fuel" },
    { label: "Shopping", key: "shopping" },
    { label: "Premium", key: "premium" },
  ];

  const handleQuickFilter = (key: string) => {
    setActiveQuickFilter(key);
    if (key === "all") {
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
    } else if (key === "no-fee") {
      setFilters((prev) => ({ ...prev, maxFee: 0, cardType: [] }));
    } else if (key === "premium") {
      setFilters((prev) => ({ ...prev, cardType: ["Premium"], maxFee: 50000 }));
    } else {
      setFilters((prev) => ({
        ...prev,
        cardType: [key.charAt(0).toUpperCase() + key.slice(1)],
        maxFee: 50000,
      }));
    }
  };

  return (
    <div>
      {/* Quick Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {QUICK_FILTERS.map((pill) => {
          const active = activeQuickFilter === pill.key;
          return (
            <button
              key={pill.key}
              onClick={() => handleQuickFilter(pill.key)}
              className={`inline-flex items-center px-4 py-2 font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer rounded-sm border ${
                active
                  ? "bg-indian-gold text-ink border-indian-gold"
                  : "bg-white text-ink-60 border-ink-12 hover:border-indian-gold hover:text-ink"
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filter Sidebar */}
        <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <div className="mt-4 p-5 border border-ink-12 bg-white rounded-sm">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              Personalised
            </div>
            <h3 className="font-display text-[18px] font-black text-ink leading-tight mb-2">
              Find your perfect card
            </h3>
            <p className="text-[12px] text-ink-60 mb-4 leading-[1.55]">
              3 questions · 30 seconds · no email needed.
            </p>
            <Link href="/credit-cards/find-your-card">
              <Button
                size="sm"
                className="w-full bg-indian-gold text-ink font-bold hover:bg-indian-gold/90 font-mono text-[11px] uppercase tracking-wider rounded-sm"
              >
                Find my card <Zap className="w-3 h-3 ml-1.5" />
              </Button>
            </Link>
          </div>
        </ResponsiveFilterContainer>

        {/* Results Grid */}
        <div className="flex-1 w-full">
          <div className="mb-6 lg:hidden">
            <Input
              placeholder="Search cards..."
              className="w-full h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search credit cards"
            />
          </div>

          <FilterPresets
            onPresetClick={(presetFilters) => {
              setFilters((prev) => ({
                ...prev,
                ...presetFilters,
              }));
            }}
            className="mb-6"
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-ink-12">
            <div>
              <h2 className="font-display font-black text-[22px] text-ink leading-tight">
                Compare cards
              </h2>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mt-1">
                {filteredAssets.length} match
                {filteredAssets.length === 1 ? "" : "es"} · sorted by{" "}
                {sortBy === "match"
                  ? "best match"
                  : sortBy === "popularity"
                    ? "most applied"
                    : sortBy === "trending"
                      ? "trending"
                      : "top rated"}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort cards by"
                className="px-4 py-2 bg-white border border-ink-12 rounded-sm font-mono text-[11px] uppercase tracking-wider text-ink focus:outline-none focus:ring-2 focus:ring-indian-gold/30 focus:border-indian-gold cursor-pointer"
              >
                <option value="match">Best match</option>
                <option value="popularity">Most applied</option>
                <option value="trending">Trending</option>
                <option value="rating">Top rated</option>
              </select>

              <div className="flex items-center gap-0 border border-ink-12 rounded-sm p-0.5">
                <button
                  onClick={() => setViewMode("table")}
                  aria-pressed={viewMode === "table"}
                  aria-label="Table view"
                  className={`p-2 rounded-sm transition-colors cursor-pointer ${
                    viewMode === "table"
                      ? "bg-ink text-canvas"
                      : "text-ink-60 hover:text-ink"
                  }`}
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                  aria-label="Card view"
                  className={`p-2 rounded-sm transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-ink text-canvas"
                      : "text-ink-60 hover:text-ink"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredAssets.length === 0 ? (
            <div className="text-center py-16 bg-white border border-ink-12 rounded-sm">
              <div className="w-12 h-12 mx-auto mb-5 border border-ink-12 flex items-center justify-center rounded-sm">
                <Search className="w-5 h-5 text-ink-60" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
                No matches
              </div>
              <h3 className="font-display font-black text-[22px] text-ink mb-3">
                No cards fit those filters
              </h3>
              <p className="text-[13px] text-ink-60 mb-6 max-w-md mx-auto leading-[1.55]">
                Loosen one filter — or let us match you with 3 questions
                instead.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
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
                    setSearchTerm("");
                  }}
                  className="px-5 py-2.5 bg-ink text-canvas font-mono text-[11px] uppercase tracking-wider rounded-sm hover:bg-ink/90 transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
                <Link
                  href="/credit-cards/find-your-card"
                  className="px-5 py-2.5 bg-indian-gold text-ink font-mono text-[11px] uppercase tracking-wider rounded-sm hover:bg-indian-gold/90 transition-colors"
                >
                  Try card finder quiz →
                </Link>
              </div>
            </div>
          ) : (
            <>
              {viewMode === "table" ? (
                <CreditCardTable cards={displayedAssets} />
              ) : (
                <div className="flex flex-col gap-5">
                  {displayedAssets.map((product) => (
                    <RichProductCard
                      key={product.id}
                      product={product}
                      matchScore={product.matchScore}
                      scoreBreakdown={product.scoreBreakdown}
                      rawScore={product.rawScore}
                      isScored={true}
                      layout="list"
                    />
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="pt-8 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-3 bg-white border border-ink-12 rounded-sm font-mono text-[11px] uppercase tracking-wider text-ink hover:border-indian-gold hover:text-indian-gold transition-colors cursor-pointer"
                  >
                    Show {Math.min(6, scoredAssets.length - visibleCount)} more
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <CompareTray />
      </div>
    </div>
  );
}
