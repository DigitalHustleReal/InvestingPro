"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Quick Links to stock market education guides
 * Replaces fake watchlist with random sparkline data
 */

const GUIDES = [
  {
    title: "How to Invest in Stocks",
    desc: "Beginner guide for Indian investors",
    href: "/articles/how-to-invest-in-stocks-india-beginners-guide",
  },
  {
    title: "How to Apply for IPO",
    desc: "Step-by-step UPI mandate process",
    href: "/articles/how-to-apply-for-ipo-india-beginners-guide",
  },
  {
    title: "Best Demat Accounts",
    desc: "Compare Zerodha, Groww, Upstox",
    href: "/articles/best-demat-account-for-beginners-india-2026",
  },
  {
    title: "SIP vs Lumpsum",
    desc: "Which investment style suits you?",
    href: "/articles/sip-vs-lumpsum-investment-which-is-better",
  },
];

export default function WatchlistSparklines() {
  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" /> Getting Started
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {GUIDES.map((guide, idx) => (
            <Link
              key={idx}
              href={guide.href}
              className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors block"
            >
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">
                  {guide.title}
                </div>
                <div className="text-xs text-gray-500">{guide.desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
