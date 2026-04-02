"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SimilarFund {
  slug: string;
  name: string;
  provider: string;
  returns1Y: number | null;
  returns3Y: number | null;
  nav: number;
  riskLevel: string;
  category: string;
}

interface CompareSimilarFundsProps {
  currentFund: {
    name: string;
    slug: string;
    returns1Y: number;
    returns3Y: number;
  };
  similarFunds: SimilarFund[];
  className?: string;
}

function formatReturn(val: number | null): React.ReactNode {
  if (val === null || val === undefined) return <span className="text-gray-400">—</span>;
  const isPositive = val >= 0;
  return (
    <span className={cn("flex items-center gap-0.5 font-semibold tabular-nums", isPositive ? "text-green-600" : "text-red-500")}>
      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {isPositive ? '+' : ''}{val.toFixed(1)}%
    </span>
  );
}

export default function CompareSimilarFunds({ currentFund, similarFunds, className }: CompareSimilarFundsProps) {
  if (!similarFunds || similarFunds.length === 0) return null;

  // Show top 4 similar funds
  const topFunds = similarFunds.slice(0, 4);

  return (
    <Card className={cn("", className)} id="compare-funds">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Scale className="w-5 h-5 text-green-600" />
          Compare Similar Funds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 text-gray-500 font-medium min-w-[200px]">Fund Name</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">1Y Return</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">3Y Return</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">NAV</th>
              </tr>
            </thead>
            <tbody>
              {/* Current fund row - highlighted */}
              <tr className="bg-green-50 border-b border-green-100">
                <td className="py-3 pr-4">
                  <div>
                    <p className="font-semibold text-green-700 text-xs line-clamp-1">{currentFund.name}</p>
                    <p className="text-[10px] text-green-600">This fund</p>
                  </div>
                </td>
                <td className="py-3 px-3 text-right">{formatReturn(currentFund.returns1Y)}</td>
                <td className="py-3 px-3 text-right">{formatReturn(currentFund.returns3Y)}</td>
                <td className="py-3 px-3 text-right text-gray-500">—</td>
              </tr>

              {/* Similar funds */}
              {topFunds.map((fund, i) => (
                <tr key={fund.slug} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/mutual-funds/${fund.slug}`} className="group">
                      <p className="font-medium text-gray-900 text-xs line-clamp-1 group-hover:text-green-600 transition-colors">
                        {fund.name}
                      </p>
                      <p className="text-[10px] text-gray-400">{fund.provider}</p>
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-right text-xs">{formatReturn(fund.returns1Y)}</td>
                  <td className="py-3 px-3 text-right text-xs">{formatReturn(fund.returns3Y)}</td>
                  <td className="py-3 px-3 text-right text-xs text-gray-600 tabular-nums">₹{fund.nav.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {similarFunds.length > 4 && (
          <div className="mt-3 text-center">
            <Link href="/mutual-funds" className="text-xs text-green-600 hover:text-green-700 font-medium">
              View all {similarFunds.length} similar funds →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
