"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Sparkles } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border-emerald-500/20 shadow-2xl">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold">
          {label}
        </p>
        <div className="space-y-1">
          <p className="text-sm font-bold text-emerald-400 flex items-center justify-between gap-4">
            Views{" "}
            <span className="text-foreground">
              {payload[0].value.toLocaleString()}
            </span>
          </p>
          <p className="text-sm font-bold text-emerald-400 flex items-center justify-between gap-4">
            Articles{" "}
            <span className="text-foreground">{payload[1]?.value || 0}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function ContentVelocityChart({ data = [] }: { data: any[] }) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bento-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold premium-gradient-text tracking-tight flex items-center gap-2">
            Content Velocity
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h3>
          <p className="text-xs text-muted-foreground">
            Publishing frequency vs Reader engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Views
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Articles
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] h-[300px] mt-6 min-w-0 relative">
        {isMounted && data && data.length > 0 ? (
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%" debounce={1}>
              <AreaChart
                data={data}
                margin={{ top: 30, right: 20, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorArticles"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "rgba(255,255,255,0.4)",
                    fontWeight: 600,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "rgba(255,255,255,0.4)",
                    fontWeight: 600,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="articles"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorArticles)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : !isMounted ? (
          <div className="h-full w-full bg-white/5 animate-pulse rounded-xl" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
            <p className="text-xs text-muted-foreground font-bold">
              Waiting for Momentum Data...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
