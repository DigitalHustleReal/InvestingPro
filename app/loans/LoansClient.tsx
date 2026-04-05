"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  LayoutGrid,
  List,
  ArrowRight,
  Calculator,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { RichProduct } from "@/types/rich-product";
import {
  LoanFilterSidebar,
  LoanFilterState,
} from "@/components/loans/FilterSidebar";
import { ResponsiveFilterContainer } from "@/components/products/ResponsiveFilterContainer";

/* ─── EMI utility ─── */
function calcEMI(principal: number, annualRate: number, tenureYears: number) {
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return Math.round(principal / n);
  return Math.round(
    (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1),
  );
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface LoansClientProps {
  initialLoans: RichProduct[];
}

export default function LoansClient({ initialLoans }: LoansClientProps) {
  const [assets] = useState<RichProduct[]>(initialLoans);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortBy, setSortBy] = useState<"rate" | "amount" | "name">("rate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (key: typeof sortBy) => {
    if (sortBy === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortBy(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  function SH({ label, k }: { label: string; k: typeof sortBy }) {
    return (
      <button
        onClick={() => toggleSort(k)}
        className="inline-flex items-center gap-1 cursor-pointer hover:text-green-700 transition-colors"
      >
        {label}
        <ArrowUpDown
          size={10}
          className={sortBy === k ? "text-green-600" : "text-gray-300"}
        />
      </button>
    );
  }

  const [filters, setFilters] = useState<LoanFilterState>({
    maxRate: 15,
    maxProcessingFee: 2,
    loanTypes: [],
    banks: [],
  });

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const name = (asset.name || "").toLowerCase();
      const provider = (asset.provider_name || "").toLowerCase();
      const searchMatch =
        name.includes(searchTerm.toLowerCase()) ||
        provider.includes(searchTerm.toLowerCase());
      const bankMatch =
        filters.banks.length === 0 ||
        filters.banks.some((b) => provider.includes(b.toLowerCase()));
      const type = (asset.specs?.type || "").toLowerCase();
      const typeMatch =
        filters.loanTypes.length === 0 ||
        filters.loanTypes.some((t) => type.includes(t.toLowerCase()));
      return searchMatch && bankMatch && typeMatch;
    });
  }, [assets, searchTerm, filters]);

  useEffect(() => {
    setVisibleCount(6);
  }, [searchTerm, filters]);

  const visibleAssets = filteredAssets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAssets.length;
  const activeFiltersCount =
    (filters.loanTypes.length > 0 ? 1 : 0) +
    (filters.banks.length > 0 ? 1 : 0) +
    (filters.maxRate < 15 ? 1 : 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
        <LoanFilterSidebar filters={filters} setFilters={setFilters} />
        {/* Inline EMI calculator in sidebar */}
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
          <InlineEMICalc />
        </div>
      </ResponsiveFilterContainer>

      <div className="flex-1 w-full space-y-4">
        {/* Search + controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search loans..."
              className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search loans"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort loans"
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer"
            >
              <option value="rate">Lowest Rate</option>
              <option value="amount">Highest Amount</option>
              <option value="name">Bank Name</option>
            </select>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                aria-pressed={viewMode === "table"}
                className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === "table" ? "bg-green-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === "grid" ? "bg-green-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
            <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No loans match your filters
            </h3>
            <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
              Try adjusting your filters or explore popular loan types.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
                onClick={() =>
                  setFilters({
                    banks: [],
                    loanTypes: [],
                    maxRate: 30,
                    maxProcessingFee: 5,
                  })
                }
              >
                Clear All Filters
              </button>
              <Link
                href="/calculators/emi"
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
              >
                Try EMI Calculator →
              </Link>
            </div>
          </div>
        ) : viewMode === "table" ? (
          /* ── Table view ── */
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <SH label="Lender" k="name" />
                  </th>
                  <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <SH label="Rate" k="rate" />
                  </th>
                  <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Processing Fee
                  </th>
                  <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <SH label="Amount" k="amount" />
                  </th>
                  <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    EMI (₹5L/3yr)
                  </th>
                  <th className="text-right px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleAssets.map((loan) => {
                  const rate =
                    parseFloat(
                      loan.specs?.interestRate || loan.specs?.rate || "12",
                    ) || 12;
                  const emi = calcEMI(500000, rate, 3);
                  return (
                    <tr
                      key={loan.id}
                      className="hover:bg-green-50/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link href={`/loans/${loan.slug}`} className="group">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                            {loan.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {loan.provider_name} ·{" "}
                            {loan.specs?.type || "Personal Loan"}
                          </p>
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-sm font-bold text-green-600 tabular-nums">
                          {loan.specs?.interestRate ||
                            loan.specs?.rate ||
                            "N/A"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-sm text-gray-700 tabular-nums">
                          {loan.specs?.processingFee || "1-2%"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-sm text-gray-700">
                          {loan.specs?.loanAmount ||
                            loan.specs?.maxAmount ||
                            "Up to ₹40L"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900 tabular-nums">
                          {formatINR(emi)}/mo
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/loans/${loan.slug}`}
                          className="text-xs font-medium text-green-600 hover:text-green-700"
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── Grid view — loan-specific cards ── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleAssets.map((loan) => {
              const rate =
                parseFloat(
                  loan.specs?.interestRate || loan.specs?.rate || "12",
                ) || 12;
              const emi5L3Y = calcEMI(500000, rate, 3);
              const emi10L5Y = calcEMI(1000000, rate, 5);
              return (
                <Link
                  key={loan.id}
                  href={`/loans/${loan.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-sm transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors leading-tight">
                        {loan.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {loan.provider_name}
                      </p>
                    </div>
                    <Badge className="text-[9px] bg-gray-100 text-gray-600 border-0">
                      {loan.specs?.type || "Personal"}
                    </Badge>
                  </div>

                  {/* Key specs — BankBazaar pattern */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                    <div>
                      <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-medium">
                        Interest Rate
                      </p>
                      <p className="text-sm font-bold text-green-600">
                        {loan.specs?.interestRate ||
                          loan.specs?.rate ||
                          "10.5% - 18%"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-medium">
                        Processing Fee
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {loan.specs?.processingFee || "1-2%"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-medium">
                        Loan Amount
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {loan.specs?.loanAmount ||
                          loan.specs?.maxAmount ||
                          "₹25K - ₹40L"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-medium">
                        Tenure
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {loan.specs?.tenure || "1 - 5 years"}
                      </p>
                    </div>
                  </div>

                  {/* EMI preview — key differentiator */}
                  <div className="bg-green-50 rounded-lg p-3 mb-3">
                    <p className="text-[9px] text-green-600 uppercase font-semibold mb-1">
                      Sample EMI
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">₹5L for 3 years</p>
                        <p className="text-lg font-bold text-gray-900 tabular-nums">
                          {formatINR(emi5L3Y)}
                          <span className="text-xs font-normal text-gray-500">
                            /mo
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">
                          ₹10L for 5 years
                        </p>
                        <p className="text-lg font-bold text-gray-900 tabular-nums">
                          {formatINR(emi10L5Y)}
                          <span className="text-xs font-normal text-gray-500">
                            /mo
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      {loan.specs?.prepayment !== "Yes" && (
                        <span className="text-green-600 font-medium">
                          No prepayment penalty
                        </span>
                      )}
                      {loan.specs?.instantApproval && (
                        <span>Instant approval</span>
                      )}
                    </div>
                    <span className="text-[11px] text-green-600 font-medium group-hover:underline flex items-center gap-0.5">
                      Apply <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {hasMore && (
          <div className="pt-6 text-center">
            <button
              onClick={() => setVisibleCount((p) => p + 6)}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors cursor-pointer"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Inline EMI Calculator (sidebar widget) ─── */
function InlineEMICalc() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(3);
  const emi = calcEMI(amount, rate, tenure);
  const totalInterest = emi * tenure * 12 - amount;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
        <Calculator size={14} className="text-green-600" />
        Quick EMI Calculator
      </h3>
      <div className="space-y-3">
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-medium">
            Loan Amount
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-9 mt-1 text-sm tabular-nums"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-medium">
              Rate (%)
            </label>
            <Input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="h-9 mt-1 text-sm tabular-nums"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-medium">
              Years
            </label>
            <Input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="h-9 mt-1 text-sm tabular-nums"
            />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-green-600 uppercase font-semibold">
            Monthly EMI
          </p>
          <p className="text-xl font-black text-gray-900 tabular-nums">
            {formatINR(emi)}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Total interest: {formatINR(totalInterest)}
          </p>
        </div>
        <Link
          href="/calculators/emi"
          className="block text-center text-xs text-green-600 font-medium hover:text-green-700"
        >
          Full EMI Calculator with amortization →
        </Link>
      </div>
    </div>
  );
}
