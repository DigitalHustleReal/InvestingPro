"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricBentoCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  data?: any[];
  dataKey?: string;
  variant?: "blue" | "emerald" | "amber" | "purple" | "rose" | "cyan";
  className?: string;
  href?: string;
}

const VARIANTS = {
  blue: "from-blue-500/10 to-transparent text-blue-400 border-blue-500/20",
  emerald:
    "from-emerald-500/10 to-transparent text-emerald-400 border-emerald-500/20",
  amber: "from-amber-500/10 to-transparent text-amber-400 border-amber-500/20",
  purple:
    "from-purple-500/10 to-transparent text-purple-400 border-purple-500/20",
  rose: "from-rose-500/10 to-transparent text-rose-400 border-rose-500/20",
  cyan: "from-cyan-500/10 to-transparent text-cyan-400 border-cyan-500/20",
};

const CHART_COLORS = {
  blue: "#3b82f6",
  emerald: "#10b981",
  amber: "#f59e0b",
  purple: "#a855f7",
  rose: "#f43f5e",
  cyan: "#06b6d4",
};

export default function MetricBentoCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  data,
  dataKey = "value",
  variant = "emerald",
  className,
  href,
}: MetricBentoCardProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 250);
    return () => clearTimeout(timer);
  }, []);

  const isPositive = trend === "up";
  const isNegative = trend === "down";
  const colorClass = VARIANTS[variant];
  const chartColor = CHART_COLORS[variant];

  const cardContent = (
    <div
      className={cn(
        "bento-card group h-full flex flex-col p-5 overflow-hidden",
        className,
      )}
    >
      {/* Background Glow */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500",
          colorClass,
        )}
      />

      <div className="relative z-10 flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
            {label}
          </p>
          <h3 className="text-2xl font-bold premium-gradient-text tabular-nums tracking-tight">
            {value}
          </h3>
        </div>
        <div
          className={cn(
            "p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
            colorClass,
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div
        className="mt-4 w-full relative"
        style={{ height: "80px", minWidth: "0" }}
      >
        {isMounted && data && data.length > 0 ? (
          <ResponsiveContainer
            width="99%"
            height="100%"
            minWidth={0}
            minHeight={0}
          >
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${variant}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={chartColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#gradient-${variant})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : !isMounted ? (
          <div className="h-[80px] w-full bg-white/5 animate-pulse rounded-lg" />
        ) : (
          <div className="h-[80px] flex items-center gap-2 pt-8">
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 font-bold text-xs truncate",
                  isPositive
                    ? "text-emerald-400"
                    : isNegative
                      ? "text-rose-400"
                      : "text-gray-400",
                )}
              >
                {isPositive && <ArrowUpRight className="w-3.5 h-3.5" />}
                {isNegative && <ArrowDownRight className="w-3.5 h-3.5" />}
                {trend === "neutral" && <Minus className="w-3.5 h-3.5" />}
                {trendValue}
              </div>
            )}
            {subtext && (
              <span className="text-xs text-muted-foreground/60 font-medium truncate">
                {subtext}
              </span>
            )}
          </div>
        )}
      </div>

      {data && data.length > 0 && (subtext || trendValue) && (
        <div className="relative z-10 flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-muted-foreground/60 font-medium">
            {subtext}
          </span>
          {trendValue && (
            <span
              className={cn(
                "text-[10px] font-bold",
                isPositive ? "text-emerald-400" : "text-rose-400",
              )}
            >
              {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block h-full transition-transform active:scale-[0.98]"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
