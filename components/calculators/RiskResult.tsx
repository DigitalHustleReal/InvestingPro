"use client";

import React from "react";
import { RiskProfile } from "@/lib/risk-calculator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ArrowRight, RefreshCcw, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RiskResultProps {
  score: number;
  profile: RiskProfile;
  onRetake: () => void;
}

export default function RiskResult({
  score,
  profile,
  onRetake,
}: RiskResultProps) {
  // Data for Pie Chart
  const data = [
    { name: "Equity", value: profile.allocation.equity, color: "#14B8A6" }, // Primary
    { name: "Debt", value: profile.allocation.debt, color: "#0EA5E9" }, // Info
    { name: "Gold", value: profile.allocation.gold, color: "#F59E0B" }, // Accent
    { name: "Cash", value: profile.allocation.cash, color: "#E2E8F0" }, // Slate
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Score & Profile Header */}
      <div className="text-center space-y-4">
        <div className="inline-block">
          <span className="text-sm font-bold text-ink-60 uppercase tracking-wider">
            Your Risk Score
          </span>
          <div className="text-6xl font-bold text-primary-600 my-2">
            {score}
            <span className="text-2xl text-ink-60">/48</span>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-display font-bold text-ink dark:text-white mb-2">
            {profile.label} Investor
          </h2>
          <p className="text-ink-60 dark:text-ink-60 max-w-2xl mx-auto">
            {profile.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Asset Allocation Chart */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 border-t-4 border-t-primary-500">
          <CardHeader>
            <CardTitle>Recommended Allocation</CardTitle>
            <CardDescription>
              How you should maximize your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={
                    ((value: number | undefined) => `${value || 0}%`) as never
                  }
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 border-t-4 border-t-secondary-500">
          <CardHeader>
            <CardTitle>Where to Invest?</CardTitle>
            <CardDescription>Products matching your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              {profile.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-3 bg-canvas dark:bg-gray-800 rounded-lg border border-ink/5 dark:border-gray-700"
                >
                  <div className="bg-success-100 dark:bg-success-900/30 p-2 rounded-full mr-3">
                    <ArrowRight className="w-4 h-4 text-success-600 dark:text-success-400" />
                  </div>
                  <span className="font-medium text-ink dark:text-gray-200">
                    {rec}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-ink/5 dark:border-gray-800">
              <h4 className="text-sm font-semibold text-ink-60 mb-3 uppercase tracking-wider">
                Example Portfolio
              </h4>
              <div className="flex gap-2 flex-wrap">
                {profile.allocation.equity > 0 && (
                  <Badge
                    variant="outline"
                    className="border-primary-200 text-primary-700 bg-primary-50"
                  >
                    Equity {profile.allocation.equity}%
                  </Badge>
                )}
                {profile.allocation.debt > 0 && (
                  <Badge
                    variant="outline"
                    className="border-secondary-200 text-secondary-700 bg-secondary-50"
                  >
                    Debt {profile.allocation.debt}%
                  </Badge>
                )}
                {profile.allocation.gold > 0 && (
                  <Badge
                    variant="outline"
                    className="border-accent-200 text-accent-700 bg-accent-50"
                  >
                    Gold {profile.allocation.gold}%
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTAs */}
      <div className="flex justify-center gap-4 pt-8">
        <Button variant="outline" onClick={onRetake} className="gap-2">
          <RefreshCcw className="w-4 h-4" /> Retake Quiz
        </Button>
        <Button className="bg-primary-600 hover:bg-primary-700 text-white gap-2">
          <Share2 className="w-4 h-4" /> Share Result
        </Button>
      </div>
    </div>
  );
}
