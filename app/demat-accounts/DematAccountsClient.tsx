"use client";

import React, { useState } from "react";
import {
  Search,
  Star,
  ArrowRight,
  LayoutGrid,
  List,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { apiClient as api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface DematAccountsClientProps {
  initialBrokers?: any[];
}

export default function DematAccountsClient({
  initialBrokers = [],
}: DematAccountsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const toggleSort = (k: string) => {
    if (sortKey === k) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(k);
      setSortDir(k === "name" ? "asc" : "desc");
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
        className={sortKey === k ? "text-green-600" : "text-gray-300"}
      />
    </button>
  );

  const { data: brokers = [], isLoading } = useQuery({
    queryKey: ["demat-accounts"],
    queryFn: async () => {
      try {
        const res = (await api.entities.Broker?.list()) || [];
        return Array.isArray(res) ? res : (res as any)?.data || [];
      } catch {
        return [];
      }
    },
    initialData: initialBrokers.length > 0 ? initialBrokers : undefined,
    staleTime: initialBrokers.length > 0 ? 60 * 1000 : 0,
  });

  const filtered = brokers.filter((b: any) =>
    (b.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search brokers..."
            className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search demat accounts"
          />
        </div>
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

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            Loading brokers...
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No brokers found.</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <SH label="Broker" k="name" />
                </th>
                <th className="text-center px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <SH label="Rating" k="rating" />
                </th>
                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Brokerage
                </th>
                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  AMC
                </th>
                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Opening Fee
                </th>
                <th className="text-right px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.slice(0, visibleCount).map((broker: any) => (
                <tr
                  key={broker.id || broker.slug}
                  className="hover:bg-green-50/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/demat-accounts/${broker.slug || broker.id}`}
                      className="group"
                    >
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                        {broker.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {broker.type || "Discount Broker"}
                      </p>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex gap-0.5 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={
                            i < (broker.rating || 0)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm font-bold text-green-600">
                      {broker.specs?.brokerage ||
                        broker.brokerage ||
                        "₹20/trade"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm text-gray-700">
                      {broker.specs?.amc || broker.amc || "₹0"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm text-gray-700">
                      {broker.specs?.accountOpening || "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/demat-accounts/${broker.slug || broker.id}`}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.slice(0, visibleCount).map((broker: any) => (
            <Link
              key={broker.id || broker.slug}
              href={`/demat-accounts/${broker.slug || broker.id}`}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    {broker.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {broker.type || "Discount Broker"}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={
                        i < (broker.rating || 0)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">
                    Brokerage
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {broker.specs?.brokerage || broker.brokerage || "₹20/trade"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">AMC</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {broker.specs?.amc || broker.amc || "₹0"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">Opening</p>
                  <p className="text-sm font-semibold text-green-600">
                    {broker.specs?.accountOpening || "Free"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filtered.length > visibleCount && (
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
