"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/utils/currency";
import { Shield, Star, Heart, CheckCircle, AlertCircle } from "lucide-react";
import {
  calculateDefencePension,
  DEFENCE_PENSION_DEFAULTS,
  type DefencePensionInputs,
  type DefenceService,
  type DefenceRank,
} from "@/lib/calculators/pension";

const SERVICES: DefenceService[] = ["Army", "Navy", "Air Force", "Para Military"];

const OFFICER_RANKS: DefenceRank[] = [
  "Lieutenant", "Captain", "Major", "Lieutenant Colonel",
  "Colonel", "Brigadier", "Major General", "Lieutenant General", "General",
];

const PBOR_RANKS: DefenceRank[] = [
  "Sepoy/Constable", "Naik/Lance Corporal", "Havildar/Corporal",
  "Naib Subedar", "Subedar", "Subedar Major",
];

// 7th CPC approximate basic pay for defence ranks
const RANK_PAY: Record<DefenceRank, { basicPay: number; msp: number }> = {
  "Sepoy/Constable":     { basicPay: 21700, msp: 5200 },
  "Naik/Lance Corporal": { basicPay: 25500, msp: 5200 },
  "Havildar/Corporal":   { basicPay: 29200, msp: 5200 },
  "Naib Subedar":        { basicPay: 35400, msp: 5200 },
  "Subedar":             { basicPay: 44900, msp: 5200 },
  "Subedar Major":       { basicPay: 47600, msp: 5200 },
  "Lieutenant":          { basicPay: 56100, msp: 15500 },
  "Captain":             { basicPay: 61300, msp: 15500 },
  "Major":               { basicPay: 69400, msp: 15500 },
  "Lieutenant Colonel":  { basicPay: 121200, msp: 15500 },
  "Colonel":             { basicPay: 130600, msp: 15500 },
  "Brigadier":           { basicPay: 139600, msp: 15500 },
  "Major General":       { basicPay: 144200, msp: 15500 },
  "Lieutenant General":  { basicPay: 182200, msp: 15500 },
  "General":             { basicPay: 250000, msp: 15500 },
};

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors focus:outline-none",
          value ? "bg-primary-600" : "bg-slate-300"
        )}
      >
        <span className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
          value && "translate-x-5"
        )} />
      </button>
    </div>
  );
}

export function DefencePensionCalculator() {
  const [inputs, setInputs] = useState<DefencePensionInputs>(DEFENCE_PENSION_DEFAULTS);
  const set = <K extends keyof DefencePensionInputs>(k: K) => (v: DefencePensionInputs[K]) =>
    setInputs((p) => ({ ...p, [k]: v }));

  const handleRankChange = (rank: DefenceRank) => {
    const pay = RANK_PAY[rank];
    setInputs((p) => ({
      ...p,
      rank,
      basicPay: pay.basicPay,
      mspdaPay: pay.msp + pay.basicPay * (p.daPercent / 100),
    }));
  };

  const r = useMemo(() => calculateDefencePension(inputs), [inputs]);

  const isOfficer = OFFICER_RANKS.includes(inputs.rank);
  const minService = isOfficer ? 20 : 15;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Defence Pension Calculator
              </CardTitle>
              <p className="text-sm text-slate-500">Army · Navy · Air Force · OROP · Disability Pension</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Service picker */}
          <div className="grid grid-cols-4 gap-2">
            {SERVICES.map((s) => (
              <button
                key={s}
                onClick={() => set("service")(s)}
                className={cn(
                  "py-2 px-3 rounded-lg text-sm font-semibold border transition-all",
                  inputs.service === s
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Rank picker */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Rank
            </label>
            <div className="mb-1">
              <p className="text-xs text-slate-400 mb-1.5">Officers</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {OFFICER_RANKS.map((rank) => (
                  <button key={rank} onClick={() => handleRankChange(rank)}
                    className={cn(
                      "py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center",
                      inputs.rank === rank
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    )}>
                    {rank}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-400 mb-1.5">Personnel Below Officer Rank (PBOR)</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {PBOR_RANKS.map((rank) => (
                  <button key={rank} onClick={() => handleRankChange(rank)}
                    className={cn(
                      "py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center",
                      inputs.rank === rank
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    )}>
                    {rank}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Service years */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Years of Service
                </label>
                <span className="text-sm font-bold text-primary-600">{inputs.yearsOfService} yrs</span>
              </div>
              <input type="range" min={minService} max={40} step={1} value={inputs.yearsOfService}
                onChange={(e) => set("yearsOfService")(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600" />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                <span>{minService} yrs (minimum)</span><span>40 yrs</span>
              </div>
            </div>

            {/* DA */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">DA %</label>
                <span className="text-sm font-bold text-primary-600">{inputs.daPercent}%</span>
              </div>
              <input type="range" min={0} max={100} step={1} value={inputs.daPercent}
                onChange={(e) => set("daPercent")(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600" />
            </div>

            {/* Disability */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Disability %
                </label>
                <span className="text-sm font-bold text-amber-600">{inputs.disabilityPercent}%</span>
              </div>
              <input type="range" min={0} max={100} step={25} value={inputs.disabilityPercent}
                onChange={(e) => set("disabilityPercent")(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-amber-500" />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                <span>None</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Toggle label="War Injury (1.5× disability rate)" value={inputs.isWarInjury}
              onChange={set("isWarInjury")} />
            <Toggle label="Gallantry Award (VrC/MVC/PVC)" value={inputs.hasGallantryAward}
              onChange={set("hasGallantryAward")} />
            <Toggle label="OROP Benefit Applied" value={inputs.orpEnabled}
              onChange={set("orpEnabled")} />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4 animate-in fade-in duration-300">
        {/* Main pension summary */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Monthly Pension Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Service Pension", value: formatINR(r.servicePension), sub: "/month", accent: "text-primary-600" },
                { label: "+ DA on Pension", value: formatINR(r.daPension), sub: `${inputs.daPercent}% DA` },
                { label: "Disability Element", value: formatINR(r.disabilityElement), sub: `${inputs.disabilityPercent}% disability`, accent: inputs.disabilityPercent > 0 ? "text-amber-600" : undefined },
                { label: "Total Monthly", value: formatINR(r.totalMonthlyPension), sub: "all components", accent: "text-green-600" },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                  <p className={cn("text-lg font-bold", item.accent ?? "text-slate-900 dark:text-white")}>{item.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Family Pension</p>
                <p className="text-lg font-bold text-blue-700">{formatINR(r.familyPension)}</p>
                <p className="text-xs text-slate-400">60% for 7 yrs, then 30%</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Retirement Gratuity</p>
                <p className="text-lg font-bold text-green-700">{formatINR(r.retirementGratuity)}</p>
                <p className="text-xs text-slate-400">lump sum on retirement</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">ECHS Healthcare Saving</p>
                <p className="text-lg font-bold text-amber-700">~{formatINR(r.estimatedMonthlySavingECHS)}</p>
                <p className="text-xs text-slate-400">/month vs private</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ex-servicemen benefits */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Ex-Servicemen Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-2">
              {r.exServicemenBenefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{b}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* OROP note */}
        {inputs.orpEnabled && (
          <Card className="border border-primary-200 bg-primary-50 rounded-2xl shadow-sm">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-primary-800">
                <p className="font-semibold mb-1">One Rank One Pension (OROP)</p>
                <p className="text-xs">{r.orpNote}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center px-4">
        Based on 7th CPC rates. MSP, DA, and OROP are subject to periodic revision.
        Contact PCDA (Pensions) Allahabad or your unit records office for exact entitlements.
      </p>
    </div>
  );
}
