"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  MapPin,
  Users,
  Heart,
  TrendingUp,
} from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  formatINR,
} from "./shared/charts";
import { cn } from "@/lib/utils";

type CityTier = "metro" | "tier2" | "tier3";

const CITY_MULTIPLIER: Record<CityTier, { label: string; factor: number }> = {
  metro: { label: "Metro (Delhi/Mumbai/Bangalore)", factor: 1.5 },
  tier2: { label: "Tier 2 (Pune/Jaipur/Lucknow)", factor: 1.0 },
  tier3: { label: "Tier 3 / Town", factor: 0.6 },
};

export function MarriageCostCalculator() {
  const [guests, setGuests] = useState(300);
  const [cityTier, setCityTier] = useState<CityTier>("tier2");
  const [yearsFromNow, setYearsFromNow] = useState(3);
  const [inflation, setInflation] = useState(8); // Wedding inflation is higher than CPI

  const result = useMemo(() => {
    const factor = CITY_MULTIPLIER[cityTier].factor;

    // Base costs per guest (Tier 2 baseline, 2026 prices)
    const venuePerGuest = 800 * factor;
    const foodPerGuest = 1200 * factor;
    const decorPerGuest = 300 * factor;

    // Fixed costs (not per guest)
    const photography = 150000 * factor;
    const entertainment = 100000 * factor;
    const invitation = 50000 * factor;
    const makeup = 80000 * factor;
    const clothing = 200000 * factor; // Bride + groom outfits
    const jewellery = 300000 * factor;
    const travel = 100000 * factor; // Baarat, guest transport
    const miscellaneous = 100000 * factor;

    const venueTotal = venuePerGuest * guests;
    const foodTotal = foodPerGuest * guests;
    const decorTotal = decorPerGuest * guests;
    const fixedTotal =
      photography +
      entertainment +
      invitation +
      makeup +
      clothing +
      jewellery +
      travel +
      miscellaneous;

    const todayCost = venueTotal + foodTotal + decorTotal + fixedTotal;
    const futureCost = todayCost * Math.pow(1 + inflation / 100, yearsFromNow);

    // Monthly SIP needed to save this amount
    const sipReturn = 0.12; // 12% equity return
    const r = sipReturn / 12;
    const n = yearsFromNow * 12;
    const monthlySIP =
      n > 0 && r > 0
        ? futureCost / (((Math.pow(1 + r, n) - 1) / r) * (1 + r))
        : futureCost / Math.max(n, 1);

    const breakdown = [
      {
        name: "Food & Catering",
        value: Math.round(foodTotal),
        color: "#dc2626",
      },
      {
        name: "Venue & Halls",
        value: Math.round(venueTotal),
        color: "#d97706",
      },
      { name: "Jewellery", value: Math.round(jewellery), color: "#f59e0b" },
      { name: "Clothing", value: Math.round(clothing), color: "#22c55e" },
      { name: "Photography", value: Math.round(photography), color: "#3b82f6" },
      { name: "Decoration", value: Math.round(decorTotal), color: "#8b5cf6" },
      {
        name: "Entertainment",
        value: Math.round(entertainment),
        color: "#ec4899",
      },
      {
        name: "Others",
        value: Math.round(invitation + makeup + travel + miscellaneous),
        color: "#6b7280",
      },
    ];

    return {
      todayCost: Math.round(todayCost),
      futureCost: Math.round(futureCost),
      monthlySIP: Math.round(monthlySIP),
      breakdown,
    };
  }, [guests, cityTier, yearsFromNow, inflation]);

  const scenarios = useMemo(() => {
    const calc = (g: number, tier: CityTier) => {
      const f = CITY_MULTIPLIER[tier].factor;
      return Math.round((800 + 1200 + 300) * g * f + 1080000 * f);
    };
    return [
      {
        label: `${guests} Guests`,
        description: CITY_MULTIPLIER[cityTier].label,
        value: formatINR(result.todayCost),
        subtext: `SIP: ${formatINR(result.monthlySIP)}/mo`,
        type: "moderate" as const,
      },
      {
        label: "Budget Wedding",
        description: "150 guests, Tier 3",
        value: formatINR(calc(150, "tier3")),
        subtext: "Simple & intimate",
        type: "conservative" as const,
      },
      {
        label: "Grand Wedding",
        description: "500 guests, Metro",
        value: formatINR(calc(500, "metro")),
        subtext: "Big fat Indian wedding",
        type: "aggressive" as const,
      },
    ];
  }, [guests, cityTier, result]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `Aaj ki cost: ${formatINR(result.todayCost)}. ${yearsFromNow} saal baad (${inflation}% wedding inflation): ${formatINR(result.futureCost)}. Fark: ${formatINR(result.futureCost - result.todayCost)}.`,
    );
    ins.push(
      `Food is king: ₹${Math.round(1200 * CITY_MULTIPLIER[cityTier].factor)} per guest × ${guests} guests = ${formatINR(Math.round(1200 * CITY_MULTIPLIER[cityTier].factor * guests))}. 100 guests kam karne se ${formatINR(Math.round(2300 * CITY_MULTIPLIER[cityTier].factor * 100))} bach sakte hain.`,
    );
    ins.push(
      `Har mahine ${formatINR(result.monthlySIP)} SIP karein (12% equity return mein) toh ${yearsFromNow} saal mein full amount ready. Start today, stress-free shaadi!`,
    );
    return ins;
  }, [result, guests, cityTier, yearsFromNow, inflation]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="lg:hidden">
        <ResultCard
          title="Total Wedding Cost"
          value={formatINR(
            yearsFromNow > 0 ? result.futureCost : result.todayCost,
          )}
          ratingLabel={
            yearsFromNow > 0
              ? `Today: ${formatINR(result.todayCost)}`
              : "At today's prices"
          }
          ratingType="neutral"
          metrics={[
            { label: "Guests", value: `${guests}` },
            {
              label: "City",
              value: CITY_MULTIPLIER[cityTier].label.split("(")[0].trim(),
            },
            {
              label: "Start SIP",
              value: `${formatINR(result.monthlySIP)}/mo`,
              highlight: true,
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <Heart size={18} className="text-pink-500" /> Wedding Details
          </h2>

          <div className="mb-5">
            <label className="text-[13px] font-medium text-gray-600 mb-2 block">
              City Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                Object.entries(CITY_MULTIPLIER) as [
                  CityTier,
                  (typeof CITY_MULTIPLIER)[CityTier],
                ][]
              ).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setCityTier(key)}
                  className={cn(
                    "py-2.5 rounded-xl text-[11px] font-medium transition-all border text-center",
                    cityTier === key
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-300",
                  )}
                >
                  {val.label.split("(")[0].trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <SliderInput
              label="Number of Guests"
              icon={Users}
              value={guests}
              onChange={setGuests}
              min={50}
              max={1000}
              step={25}
              suffix=" guests"
            />
            <SliderInput
              label="Wedding in"
              icon={Calendar}
              value={yearsFromNow}
              onChange={setYearsFromNow}
              min={0}
              max={10}
              step={1}
              formatDisplay={(v) =>
                v === 0 ? "This year" : `${v} year${v > 1 ? "s" : ""}`
              }
            />
            <SliderInput
              label="Wedding Inflation"
              icon={TrendingUp}
              value={inflation}
              onChange={setInflation}
              min={5}
              max={15}
              step={1}
              suffix="% p.a."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Total Wedding Cost"
              value={formatINR(
                yearsFromNow > 0 ? result.futureCost : result.todayCost,
              )}
              ratingLabel={
                yearsFromNow > 0
                  ? `Today: ${formatINR(result.todayCost)}`
                  : "At today's prices"
              }
              ratingType="neutral"
              metrics={[
                { label: "Guests", value: `${guests}` },
                {
                  label: "City",
                  value: CITY_MULTIPLIER[cityTier].label.split("(")[0].trim(),
                },
                {
                  label: "Start SIP",
                  value: `${formatINR(result.monthlySIP)}/mo`,
                  highlight: true,
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Cost Breakdown
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={result.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {result.breakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatINR(Number(value))}
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {result.breakdown.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-1.5 text-[10px]"
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-gray-500 truncate">
                  {d.name}: {formatINR(d.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Saving Plan
          </h3>
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">
                Start SIP today to be ready
              </p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {formatINR(result.monthlySIP)}
                <span className="text-sm font-normal text-gray-400">/mo</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                At 12% equity return for {yearsFromNow} years
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Today&apos;s Cost</span>
                <span className="font-semibold">
                  {formatINR(result.todayCost)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">
                  Cost in {yearsFromNow} years
                </span>
                <span className="font-semibold text-red-600">
                  {formatINR(result.futureCost)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Inflation Impact</span>
                <span className="font-semibold text-red-600">
                  +{formatINR(result.futureCost - result.todayCost)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-600">Per Guest Cost</span>
                <span className="font-semibold">
                  {formatINR(Math.round(result.todayCost / guests))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="marriage-cost" variant="strip" />
      </div>
    </div>
  );
}
