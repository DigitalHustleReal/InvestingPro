"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Clock,
  TrendingUp,
  Percent,
  Home,
  MapPin,
} from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { VSComparisonLayout } from "./shared/VSComparisonLayout";
import { AIInsight } from "./shared/AIInsight";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import { formatINR } from "./shared/charts";

function calcEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number,
): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / tenureMonths;
  return (
    (principal * r * Math.pow(1 + r, tenureMonths)) /
    (Math.pow(1 + r, tenureMonths) - 1)
  );
}

export function RentVsBuyComparisonCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(8000000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanRate, setLoanRate] = useState(8.5);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [rentIncrease, setRentIncrease] = useState(5);
  const [propertyAppreciation, setPropertyAppreciation] = useState(5);
  const [investmentReturn, setInvestmentReturn] = useState(12);

  // Fixed analysis periods
  const periods = [10, 15, 20];

  const result = useMemo(() => {
    const dp = propertyPrice * (downPaymentPct / 100);
    const loanAmount = propertyPrice - dp;
    const stampDuty = propertyPrice * 0.07; // stamp duty + registration ~7%
    const upfrontBuyCost = dp + stampDuty;
    const loanTenure = 20; // standard 20 year loan
    const emi = Math.round(calcEMI(loanAmount, loanRate, loanTenure * 12));
    const annualMaintenance = propertyPrice * 0.01; // 1% per year
    const monthlyMaintenance = annualMaintenance / 12;
    const monthlyPropertyTax = (propertyPrice * 0.002) / 12; // ~0.2% per year
    const totalMonthlyBuyCost = emi + monthlyMaintenance + monthlyPropertyTax;
    const r = loanRate / 100 / 12;
    const sipRate = investmentReturn / 100 / 12;

    // Price-to-rent ratio (annual)
    const annualRent = monthlyRent * 12;
    const priceToRent = Math.round((propertyPrice / annualRent) * 10) / 10;

    // Calculate for each period
    const periodResults = periods.map((years) => {
      // --- BUYING ---
      const propertyValueEnd =
        propertyPrice * Math.pow(1 + propertyAppreciation / 100, years);
      const totalEMIPaid = emi * Math.min(years, loanTenure) * 12;

      // Outstanding loan after `years` years
      let outstanding = loanAmount;
      for (let m = 0; m < Math.min(years, loanTenure) * 12; m++) {
        const interest = outstanding * r;
        const principal = emi - interest;
        outstanding = Math.max(0, outstanding - principal);
      }

      const totalInterestPaid = totalEMIPaid - (loanAmount - outstanding);
      const totalMaintenancePaid = annualMaintenance * years;
      const totalPropertyTax = propertyPrice * 0.002 * years;
      const totalBuyCost =
        dp +
        stampDuty +
        totalInterestPaid +
        totalMaintenancePaid +
        totalPropertyTax;
      // Net wealth = property value - outstanding loan - total costs incurred beyond equity
      const buyNetWealth = Math.round(
        propertyValueEnd -
          outstanding -
          totalInterestPaid -
          totalMaintenancePaid -
          totalPropertyTax -
          stampDuty,
      );

      // --- RENTING ---
      // Invest upfront cost (DP + stamp duty) as lumpsum + monthly saving difference as SIP
      const lumpsumInvested = upfrontBuyCost;
      const lumpsumFV =
        lumpsumInvested * Math.pow(1 + investmentReturn / 100, years);

      let totalRentPaid = 0;
      let sipCorpus = 0;
      let currentRent = monthlyRent;

      for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
          totalRentPaid += currentRent;
          const monthlySaving = Math.max(0, totalMonthlyBuyCost - currentRent);
          sipCorpus = (sipCorpus + monthlySaving) * (1 + sipRate);
        }
        currentRent *= 1 + rentIncrease / 100;
      }

      const rentNetWealth = Math.round(lumpsumFV + sipCorpus - totalRentPaid);

      const winner = buyNetWealth > rentNetWealth ? "buy" : "rent";
      const diff = Math.abs(buyNetWealth - rentNetWealth);

      return {
        years,
        buyNetWealth,
        rentNetWealth,
        propertyValueEnd: Math.round(propertyValueEnd),
        totalRentPaid: Math.round(totalRentPaid),
        totalBuyCost: Math.round(totalBuyCost),
        investmentCorpus: Math.round(lumpsumFV + sipCorpus),
        winner,
        diff: Math.round(diff),
      };
    });

    // Break-even year: find when buy overtakes rent (or vice-versa)
    let breakEvenYear = 0;
    for (let y = 1; y <= 30; y++) {
      const propVal =
        propertyPrice * Math.pow(1 + propertyAppreciation / 100, y);
      let outst = loanAmount;
      for (let m = 0; m < Math.min(y, loanTenure) * 12; m++) {
        const int = outst * r;
        const princ = emi - int;
        outst = Math.max(0, outst - princ);
      }
      const intPaid = emi * Math.min(y, loanTenure) * 12 - (loanAmount - outst);
      const maint = annualMaintenance * y;
      const ptax = propertyPrice * 0.002 * y;
      const bNW = propVal - outst - intPaid - maint - ptax - stampDuty;

      const lumFV = upfrontBuyCost * Math.pow(1 + investmentReturn / 100, y);
      let tRent = 0;
      let sCorp = 0;
      let cRent = monthlyRent;
      for (let yr = 0; yr < y; yr++) {
        for (let m = 0; m < 12; m++) {
          tRent += cRent;
          const ms = Math.max(0, totalMonthlyBuyCost - cRent);
          sCorp = (sCorp + ms) * (1 + sipRate);
        }
        cRent *= 1 + rentIncrease / 100;
      }
      const rNW = lumFV + sCorp - tRent;

      if (bNW >= rNW && breakEvenYear === 0) {
        breakEvenYear = y;
        break;
      }
    }

    // Use 15-year as primary comparison
    const primary =
      periodResults.find((p) => p.years === 15) || periodResults[1];

    return {
      dp: Math.round(dp),
      stampDuty: Math.round(stampDuty),
      emi,
      totalMonthlyBuyCost: Math.round(totalMonthlyBuyCost),
      priceToRent,
      breakEvenYear,
      periodResults,
      primary,
    };
  }, [
    propertyPrice,
    downPaymentPct,
    loanRate,
    monthlyRent,
    rentIncrease,
    propertyAppreciation,
    investmentReturn,
  ]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Monthly Cost",
        optionA: formatINR(monthlyRent),
        optionB: formatINR(result.totalMonthlyBuyCost),
        winner:
          monthlyRent < result.totalMonthlyBuyCost
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: `Net Wealth (${result.primary.years}Y)`,
        optionA: formatINR(result.primary.rentNetWealth),
        optionB: formatINR(result.primary.buyNetWealth),
        winner:
          result.primary.rentNetWealth > result.primary.buyNetWealth
            ? ("A" as const)
            : result.primary.buyNetWealth > result.primary.rentNetWealth
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Total Cost (15Y)",
        optionA: formatINR(result.primary.totalRentPaid),
        optionB: formatINR(result.primary.totalBuyCost),
        winner:
          result.primary.totalRentPaid < result.primary.totalBuyCost
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: "Upfront Cost",
        optionA: formatINR(monthlyRent * 2), // security deposit
        optionB: formatINR(result.dp + result.stampDuty),
        winner: "A" as const,
      },
      {
        label: "Price-to-Rent",
        optionA: `${result.priceToRent}x`,
        optionB: `${result.priceToRent}x`,
        winner:
          result.priceToRent > 20
            ? ("A" as const)
            : result.priceToRent < 15
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Break-Even",
        optionA:
          result.breakEvenYear > 0
            ? `Buy wins after Y${result.breakEvenYear}`
            : "Buy never catches up",
        optionB:
          result.breakEvenYear > 0 ? `Y${result.breakEvenYear} onwards` : "N/A",
        winner:
          result.breakEvenYear > 0 && result.breakEvenYear <= 10
            ? ("B" as const)
            : result.breakEvenYear === 0
              ? ("A" as const)
              : ("tie" as const),
      },
      {
        label: "Flexibility",
        optionA: "High (relocate anytime)",
        optionB: "Low (locked in)",
        winner: "A" as const,
      },
      {
        label: "Emotional Value",
        optionA: "None (landlord's house)",
        optionB: "High (apna ghar)",
        winner: "B" as const,
      },
    ],
    [result, monthlyRent],
  );

  const verdict = useMemo(() => {
    const p = result.primary;
    if (result.priceToRent > 20) {
      return {
        winner: "A" as const,
        title: `Renting wins — Price-to-Rent ratio is ${result.priceToRent}x (overpriced property)`,
        description: `At ${result.priceToRent}x price-to-rent ratio, this property is overpriced for buying. Renting + investing the savings gives ${formatINR(p.diff)} more wealth over ${p.years} years. Rent karo, SIP mein paisa lagao, aur 5 saal baad reassess karo.`,
      };
    } else if (result.priceToRent < 15) {
      return {
        winner: "B" as const,
        title: `Buying wins — Price-to-Rent ratio is ${result.priceToRent}x (fairly priced)`,
        description: `At ${result.priceToRent}x, this property is reasonably priced. Buying creates ${formatINR(p.diff)} more net wealth over ${p.years} years. Property appreciation of ${propertyAppreciation}% p.a. makes buying viable${result.breakEvenYear > 0 ? ` — break-even in ${result.breakEvenYear} years` : ""}.`,
      };
    }
    // 15-20 range — use net wealth as tiebreaker
    if (p.winner === "buy") {
      return {
        winner: "B" as const,
        title: `Buying slightly wins by ${formatINR(p.diff)} over ${p.years} years`,
        description: `Price-to-rent ratio is ${result.priceToRent}x (borderline). Buying wins marginally. If you plan to stay 10+ years and property appreciation stays at ${propertyAppreciation}%+, buying makes sense. Otherwise, renting is equally good.`,
      };
    }
    return {
      winner: "A" as const,
      title: `Renting + investing wins by ${formatINR(p.diff)} over ${p.years} years`,
      description: `Price-to-rent ratio is ${result.priceToRent}x (borderline zone). Investing ${formatINR(result.dp + result.stampDuty)} at ${investmentReturn}% return beats property appreciation of ${propertyAppreciation}%. But if you value stability and apna ghar, buying is fine too.`,
    };
  }, [result, propertyAppreciation, investmentReturn]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `India mein ghar lena emotion hai, par maths check karo. Price-to-rent ratio ${result.priceToRent}x hai — ${
        result.priceToRent > 20
          ? "20 se zyada toh rent karo aur SIP mein paisa lagao"
          : result.priceToRent < 15
            ? "15 se kam toh buying makes sense"
            : "15-20 ke beech hai, dono theek hain — lifestyle pe depend karta hai"
      }.`,
    );
    ins.push(
      `Down payment (${formatINR(result.dp)}) + stamp duty (${formatINR(result.stampDuty)}) = ${formatINR(result.dp + result.stampDuty)} upfront. Itna paisa ${investmentReturn}% pe invest karo toh 15 saal mein ${formatINR(Math.round((result.dp + result.stampDuty) * Math.pow(1 + investmentReturn / 100, 15)))} ban jaata hai.`,
    );
    ins.push(
      `EMI ${formatINR(result.emi)}/mo + maintenance + property tax = ${formatINR(result.totalMonthlyBuyCost)}/mo vs rent ${formatINR(monthlyRent)}/mo. Fark: ${formatINR(Math.abs(result.totalMonthlyBuyCost - monthlyRent))}/mo — ${
        result.totalMonthlyBuyCost > monthlyRent
          ? "yeh savings SIP mein invest hoti hai"
          : "buying actually cheaper hai monthly"
      }.`,
    );
    if (result.breakEvenYear > 0) {
      ins.push(
        `Break-even: ${result.breakEvenYear} saal baad buying rent se better ho jaata hai. Agar itne saal rehne ka plan hai toh buy karo, otherwise rent karo.`,
      );
    } else {
      ins.push(
        `Is scenario mein buying kabhi rent se better nahi hota. Property appreciation kam hai ya rent bahut sasta hai — rent karo aur invest karo.`,
      );
    }
    return ins;
  }, [result, monthlyRent, investmentReturn]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Inputs */}
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5 flex items-center gap-2">
            <Home size={18} className="text-action-green" />
            Property & Rent Details
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Property Price"
              icon={IndianRupee}
              value={propertyPrice}
              onChange={setPropertyPrice}
              min={2000000}
              max={50000000}
              step={500000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Down Payment"
              icon={Percent}
              value={downPaymentPct}
              onChange={setDownPaymentPct}
              min={10}
              max={30}
              step={5}
              suffix="%"
            />
            <SliderInput
              label="Home Loan Rate"
              icon={Percent}
              value={loanRate}
              onChange={setLoanRate}
              min={7}
              max={12}
              step={0.1}
              suffix="%"
            />
            <SliderInput
              label="Monthly Rent"
              icon={MapPin}
              value={monthlyRent}
              onChange={setMonthlyRent}
              min={5000}
              max={200000}
              step={1000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Annual Rent Increase"
              icon={TrendingUp}
              value={rentIncrease}
              onChange={setRentIncrease}
              min={3}
              max={10}
              step={0.5}
              suffix="%"
            />
            <SliderInput
              label="Property Appreciation"
              icon={TrendingUp}
              value={propertyAppreciation}
              onChange={setPropertyAppreciation}
              min={3}
              max={10}
              step={0.5}
              suffix="%"
            />
            <SliderInput
              label="SIP Return (if renting)"
              icon={TrendingUp}
              value={investmentReturn}
              onChange={setInvestmentReturn}
              min={10}
              max={15}
              step={0.5}
              suffix="%"
            />
          </div>

          <div className="mt-5 p-3 bg-action-green/10 border border-green-100 rounded-sm space-y-1">
            <p className="text-xs text-green-800">
              <strong>EMI:</strong> {formatINR(result.emi)}/mo (20 yr loan)
            </p>
            <p className="text-xs text-green-800">
              <strong>Total Monthly (Buy):</strong>{" "}
              {formatINR(result.totalMonthlyBuyCost)}/mo
            </p>
            <p className="text-xs text-green-800">
              <strong>Price-to-Rent Ratio:</strong> {result.priceToRent}x
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="Rent + Invest"
            titleB="Buy Property"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.primary.rentNetWealth)}
            valueLabelA="Net Wealth (15Y)"
            valueB={formatINR(result.primary.buyNetWealth)}
            valueLabelB="Net Wealth (15Y)"
            metrics={comparisonMetrics}
            verdict={verdict}
          />

          {/* Multi-Period Snapshot */}
          <div className="bg-white border border-ink/10 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-display font-semibold text-ink mb-3">
              Net Wealth Over Time
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {result.periodResults.map((p) => (
                <div
                  key={p.years}
                  className={`rounded-sm p-3 border text-center ${
                    p.winner === "rent"
                      ? "bg-action-green/10 border-green-200"
                      : "bg-indian-gold/10 border-indian-gold/30"
                  }`}
                >
                  <p className="text-[10px] font-bold text-ink-60 uppercase">
                    {p.years} Years
                  </p>
                  <div className="mt-2 space-y-1">
                    <div>
                      <p className="text-[10px] text-ink-60">Rent+Invest</p>
                      <p className="text-xs font-bold text-authority-green">
                        {formatINR(p.rentNetWealth)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-ink-60">Buy</p>
                      <p className="text-xs font-bold text-amber-700">
                        {formatINR(p.buyNetWealth)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-[9px] font-bold mt-1.5 px-1.5 py-0.5 rounded ${
                      p.winner === "rent"
                        ? "bg-action-green/20 text-authority-green"
                        : "bg-indian-gold/20 text-amber-700"
                    }`}
                  >
                    {p.winner === "rent" ? "RENT" : "BUY"} +{formatINR(p.diff)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price-to-Rent Guide */}
          <div className="bg-white border border-ink/10 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-display font-semibold text-ink mb-2">
              Price-to-Rent Ratio Guide
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div
                className={`rounded-lg p-2.5 border ${
                  result.priceToRent < 15
                    ? "bg-indian-gold/10 border-amber-300 ring-2 ring-amber-200"
                    : "bg-canvas border-ink/10"
                }`}
              >
                <p className="text-lg font-bold text-amber-700">&lt; 15x</p>
                <p className="text-[10px] text-ink-60 font-medium">Buy</p>
                <p className="text-[9px] text-ink-60">Fairly priced</p>
              </div>
              <div
                className={`rounded-lg p-2.5 border ${
                  result.priceToRent >= 15 && result.priceToRent <= 20
                    ? "bg-gray-100 border-gray-400 ring-2 ring-gray-300"
                    : "bg-canvas border-ink/10"
                }`}
              >
                <p className="text-lg font-bold text-ink">15-20x</p>
                <p className="text-[10px] text-ink-60 font-medium">Toss-up</p>
                <p className="text-[9px] text-ink-60">Depends on you</p>
              </div>
              <div
                className={`rounded-lg p-2.5 border ${
                  result.priceToRent > 20
                    ? "bg-action-green/10 border-green-300 ring-2 ring-green-200"
                    : "bg-canvas border-ink/10"
                }`}
              >
                <p className="text-lg font-bold text-authority-green">&gt; 20x</p>
                <p className="text-[10px] text-ink-60 font-medium">Rent</p>
                <p className="text-[9px] text-ink-60">Overpriced</p>
              </div>
            </div>
            <p className="text-[10px] text-ink-60 mt-2 text-center">
              Your ratio: <strong>{result.priceToRent}x</strong> — property
              price / annual rent
            </p>
          </div>

          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators
          currentSlug="rent-vs-buy-comparison"
          variant="strip"
        />
      </div>
    </div>
  );
}
