"use client";

import React, { useState } from "react";
import {
  Search,
  ArrowRight,
  ArrowUpDown,
  LayoutGrid,
  List,
  Smartphone,
  Wifi,
  CreditCard,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface SavingsAccountsClientProps {
  initialAccounts?: any[];
}

export default function SavingsAccountsClient({
  initialAccounts = [],
}: SavingsAccountsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rate" | "balance" | "bank">("rate");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (k: string) => {
    if (sortBy === k) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortBy(k as any);
      setSortDir("desc");
    }
  };

  const SH = ({ label, k }: { label: string; k: string }) => (
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

  const filtered = initialAccounts.filter((sa: any) =>
    (sa.name || sa.bank_name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const sorted = [...filtered].sort((a: any, b: any) => {
    const dir = sortDir === "desc" ? -1 : 1;
    if (sortBy === "rate")
      return ((b.interest_rate || 0) - (a.interest_rate || 0)) * dir;
    if (sortBy === "balance")
      return ((a.min_balance || 0) - (b.min_balance || 0)) * dir;
    if (sortBy === "bank")
      return (a.bank_name || "").localeCompare(b.bank_name || "") * dir;
    return 0;
  });

  function formatBalance(amount: number | null): string {
    if (!amount) return "Zero";
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(0)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  if (initialAccounts.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
        <p className="text-gray-500">
          Savings account data is being updated. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search banks..."
            className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search savings accounts"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort accounts"
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer"
          >
            <option value="rate">Highest Rate</option>
            <option value="balance">Min Balance</option>
            <option value="bank">Bank Name</option>
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

      {sorted.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No accounts match your search.</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <SH label="Bank" k="bank" />
                </th>
                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <SH label="Interest Rate" k="rate" />
                </th>
                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <SH label="Min Balance" k="balance" />
                </th>
                <th className="text-center px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Features
                </th>
                <th className="text-right px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.slice(0, visibleCount).map((sa: any) => (
                <tr
                  key={sa.id || sa.slug}
                  className="hover:bg-green-50/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {sa.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {sa.bank_name} · {sa.type || "Savings"}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm font-bold text-green-600 tabular-nums">
                      {sa.interest_rate || "N/A"}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm font-semibold text-gray-700 tabular-nums">
                      {formatBalance(sa.min_balance)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {sa.mobile_banking && (
                        <Smartphone size={14} className="text-green-600" />
                      )}
                      {sa.upi_support && (
                        <Wifi size={14} className="text-green-600" />
                      )}
                      {sa.debit_card_type && (
                        <Badge className="text-[9px] bg-gray-100 text-gray-600 border-0">
                          {sa.debit_card_type}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/banking/${sa.slug || sa.id}`}
                      className="text-xs font-medium text-green-600 hover:text-green-700"
                    >
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.slice(0, visibleCount).map((sa: any) => (
            <Link
              key={sa.id || sa.slug}
              href={`/banking/${sa.slug || sa.id}`}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-sm transition-all group"
            >
              <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                {sa.name}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{sa.bank_name}</p>
              <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-gray-100 text-center">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">Rate</p>
                  <p className="text-lg font-bold text-green-600 tabular-nums">
                    {sa.interest_rate || "N/A"}%
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">Min Bal</p>
                  <p className="text-sm font-bold text-gray-700 tabular-nums">
                    {formatBalance(sa.min_balance)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">ATM</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {sa.monthly_free_atm || "N/A"}/mo
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  {sa.mobile_banking && (
                    <Smartphone size={12} className="text-green-600" />
                  )}
                  {sa.upi_support && (
                    <Wifi size={12} className="text-green-600" />
                  )}
                  {sa.free_neft_rtgs && (
                    <CreditCard size={12} className="text-green-600" />
                  )}
                </div>
                <span className="text-[11px] text-green-600 font-medium flex items-center gap-0.5">
                  Details <ArrowRight size={10} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {sorted.length > visibleCount && (
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
  );
}
