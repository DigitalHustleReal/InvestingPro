"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Star, ArrowUpRight, ArrowUpDown } from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";

type SortKey = "name" | "fee" | "rate" | "rating";
type SortDir = "asc" | "desc";

interface CreditCardTableProps {
  cards: any[];
}

export function CreditCardTable({ cards }: CreditCardTableProps) {
  const { addProduct, removeProduct, isSelected } = useCompare();
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const sorted = useMemo(() => {
    return [...cards].sort((a, b) => {
      const mul = sortDir === "desc" ? -1 : 1;
      if (sortKey === "name")
        return mul * (a.name || "").localeCompare(b.name || "");
      if (sortKey === "fee") {
        const af =
          parseInt(
            String(a.features?.annual_fee || a.specs?.annualFee || "0").replace(
              /[^0-9]/g,
              "",
            ),
          ) || 0;
        const bf =
          parseInt(
            String(b.features?.annual_fee || b.specs?.annualFee || "0").replace(
              /[^0-9]/g,
              "",
            ),
          ) || 0;
        return mul * (af - bf);
      }
      if (sortKey === "rate") {
        const ar =
          parseFloat(
            String(
              a.features?.reward_rate || a.specs?.rewardRate || "1",
            ).replace(/[^0-9.]/g, ""),
          ) || 0;
        const br =
          parseFloat(
            String(
              b.features?.reward_rate || b.specs?.rewardRate || "1",
            ).replace(/[^0-9.]/g, ""),
          ) || 0;
        return mul * (ar - br);
      }
      if (sortKey === "rating") {
        const ar =
          typeof a.rating === "object" ? a.rating?.overall || 0 : a.rating || 0;
        const br =
          typeof b.rating === "object" ? b.rating?.overall || 0 : b.rating || 0;
        return mul * (ar - br);
      }
      return 0;
    });
  }, [cards, sortKey, sortDir]);

  function SH({ label, k }: { label: string; k: SortKey }) {
    const active = sortKey === k;
    return (
      <button
        onClick={() => toggleSort(k)}
        className={`inline-flex items-center gap-1 cursor-pointer transition-colors ${
          active ? "text-indian-gold" : "text-ink-60 hover:text-ink"
        }`}
      >
        {label}
        <ArrowUpDown size={10} className={active ? "" : "opacity-40"} />
      </button>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-ink-12 bg-white">
      <table className="w-full font-mono text-[13px]">
        <thead>
          <tr className="border-b border-ink-12">
            <th className="text-left px-4 py-3 text-[10px] font-normal uppercase tracking-[0.18em] text-ink-60 w-8" />
            <th className="text-left px-4 py-3 text-[10px] font-normal uppercase tracking-[0.18em] text-ink-60">
              <SH label="Card" k="name" />
            </th>
            <th className="text-right px-3 py-3 text-[10px] font-normal uppercase tracking-[0.18em] text-ink-60">
              <SH label="Fee" k="fee" />
            </th>
            <th className="text-right px-3 py-3 text-[10px] font-normal uppercase tracking-[0.18em] text-ink-60">
              <SH label="Rewards" k="rate" />
            </th>
            <th className="text-center px-3 py-3 text-[10px] font-normal uppercase tracking-[0.18em] text-ink-60">
              <SH label="Rating" k="rating" />
            </th>
            <th className="text-center px-3 py-3 text-[10px] font-normal uppercase tracking-[0.18em] text-ink-60">
              Best for
            </th>
            <th className="text-right px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((card) => {
            const selected = isSelected(card.id);
            const fee =
              card.features?.annual_fee ||
              card.features?.["Annual Fee"] ||
              card.specs?.annualFee ||
              "0";
            const feeNum =
              typeof fee === "string"
                ? parseInt(fee.replace(/[^0-9]/g, ""))
                : fee;
            const rate =
              card.features?.reward_rate ||
              card.features?.["Reward Rate"] ||
              card.specs?.rewardRate ||
              "1%";
            const bestFor = card.best_for || card.bestFor || "General";
            let ratingVal = 4.0;
            if (typeof card.rating === "number") ratingVal = card.rating;
            else if (typeof card.rating === "object" && card.rating?.overall)
              ratingVal = card.rating.overall;

            return (
              <tr
                key={card.id || card.slug}
                className={`border-b border-ink-12 last:border-0 transition-colors ${
                  selected ? "bg-indian-gold/10" : "hover:bg-ink/5"
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      selected ? removeProduct(card.id) : addProduct(card)
                    }
                    className="w-4 h-4 rounded-sm border-ink-12 text-indian-gold focus:ring-indian-gold/30 cursor-pointer accent-indian-gold"
                    aria-label={`Compare ${card.name}`}
                  />
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/credit-cards/${card.slug}`}
                    className="group block"
                  >
                    <p className="font-display text-[14px] font-black text-ink group-hover:text-authority-green transition-colors leading-tight">
                      {card.name}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mt-0.5">
                      {card.provider || card.provider_name || "Bank"}
                    </p>
                  </Link>
                </td>
                <td className="px-3 py-4 text-right">
                  <span
                    className={`text-[14px] font-black tabular-nums ${
                      feeNum === 0 ? "text-action-green" : "text-ink"
                    }`}
                  >
                    {feeNum === 0 ? "₹0" : `₹${feeNum.toLocaleString("en-IN")}`}
                  </span>
                  {feeNum === 0 && (
                    <p className="text-[9px] uppercase tracking-wider text-action-green font-bold">
                      Lifetime free
                    </p>
                  )}
                </td>
                <td className="px-3 py-4 text-right">
                  <span className="text-[14px] font-black text-indian-gold tabular-nums">
                    {rate}
                  </span>
                </td>
                <td className="px-3 py-4 text-center">
                  <div className="flex gap-0.5 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={
                          i < Math.round(ratingVal)
                            ? "text-indian-gold fill-indian-gold"
                            : "text-ink/15"
                        }
                      />
                    ))}
                  </div>
                </td>
                <td className="px-3 py-4 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-ink-60 border border-ink-12 px-2 py-1">
                    {bestFor}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    href={`/credit-cards/${card.slug}`}
                    className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors"
                  >
                    Details <ArrowUpRight size={11} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
