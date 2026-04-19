"use client";

import Link from "next/link";
import { Smartphone, TrendingUp, Bell, Calculator, Star } from "lucide-react";

export default function AppTeaser() {
  return (
    <section className="py-14 md:py-20 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-20">
          {/* Left — Copy */}
          <div className="flex-1 text-center lg:text-left max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full mb-5">
              <Smartphone size={12} className="text-green-600" />
              <span className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">
                Coming Soon
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
              Track, compare, and save — all in one app
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              Monitor your net worth across mutual funds, FDs, and PPF. Get
              instant rate change alerts. Run any calculator on the go. Free
              forever.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
              {[
                { icon: TrendingUp, label: "Net worth tracker" },
                { icon: Bell, label: "Rate alerts" },
                { icon: Calculator, label: "25+ calculators" },
                { icon: Star, label: "Saved comparisons" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <f.icon size={15} className="text-green-600" />
                  </div>
                  <span className="text-[13px] text-gray-700 font-medium">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (
                    typeof window !== "undefined" &&
                    (window as any).__pwaInstallPrompt
                  ) {
                    (window as any).__pwaInstallPrompt.prompt();
                    return;
                  }
                  window.location.href = "/app";
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Install Web App
              </button>
              <Link
                href="/app"
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:border-gray-300 transition-colors text-center"
              >
                Join the waitlist
              </Link>
            </div>
            <p className="mt-3 text-[11px] text-gray-400">
              Works on any device. No app store needed.
            </p>
          </div>

          {/* Right — Phone */}
          <div className="flex-shrink-0">
            <div className="relative w-[260px] md:w-[280px]">
              {/* Phone shell */}
              <div className="rounded-[40px] bg-gradient-to-b from-gray-800 to-gray-900 p-[5px] shadow-2xl">
                <div className="rounded-[35px] overflow-hidden bg-white">
                  {/* Dynamic island */}
                  <div className="flex justify-center pt-2 bg-[#0A1F14]">
                    <div className="w-[90px] h-[24px] bg-black rounded-full" />
                  </div>

                  {/* App header */}
                  <div className="bg-[#0A1F14] px-4 pb-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] text-white font-bold tracking-tight">
                          InvestingPro
                        </p>
                        <p className="text-[9px] text-white/35 mt-0.5">
                          Good morning
                        </p>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                        <Bell size={12} className="text-green-400" />
                      </div>
                    </div>
                  </div>

                  {/* Net worth card */}
                  <div className="mx-3 mt-3 p-3.5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl">
                    <p className="text-[8px] text-green-600 font-semibold uppercase tracking-wider">
                      Total Net Worth
                    </p>
                    <p className="text-[20px] font-black text-gray-900 tracking-tight mt-0.5">
                      ₹24,85,200
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <TrendingUp size={10} className="text-green-600" />
                      <span className="text-[9px] font-semibold text-green-600">
                        +₹1,89,400 (+8.2%)
                      </span>
                    </div>
                    {/* Breakdown bars */}
                    <div className="mt-3 space-y-2">
                      {[
                        {
                          label: "Mutual Funds",
                          value: "₹14.2L",
                          pct: 57,
                          color: "bg-green-500",
                        },
                        {
                          label: "Fixed Deposits",
                          value: "₹6.8L",
                          pct: 27,
                          color: "bg-emerald-400",
                        },
                        {
                          label: "PPF + NPS",
                          value: "₹3.7L",
                          pct: 16,
                          color: "bg-green-300",
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[8px] text-gray-600">
                              {item.label}
                            </span>
                            <span className="text-[8px] font-bold text-gray-900">
                              {item.value}
                            </span>
                          </div>
                          <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color} rounded-full`}
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rate alerts */}
                  <div className="mx-3 mt-2.5 p-3 bg-white border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] font-semibold text-gray-900">
                        Rate Alerts
                      </p>
                      <span className="text-[8px] text-green-600 font-medium">
                        View all
                      </span>
                    </div>
                    {[
                      {
                        bank: "SBI",
                        type: "FD 1yr",
                        rate: "6.90%",
                        delta: "-0.20%",
                        down: true,
                      },
                      {
                        bank: "HDFC",
                        type: "Home Loan",
                        rate: "8.50%",
                        delta: "0.00%",
                        down: false,
                      },
                      {
                        bank: "Axis",
                        type: "CC Rewards",
                        rate: "5x pts",
                        delta: "New",
                        down: false,
                      },
                    ].map((r) => (
                      <div
                        key={r.bank + r.type}
                        className="flex items-center justify-between py-1.5 border-t border-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                            <span className="text-[7px] font-bold text-gray-600">
                              {r.bank[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-[9px] font-semibold text-gray-900">
                              {r.bank} {r.type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-900">
                            {r.rate}
                          </p>
                          <p
                            className={`text-[7px] font-semibold ${r.down ? "text-red-500" : "text-gray-400"}`}
                          >
                            {r.delta}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom spacing */}
                  <div className="h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
