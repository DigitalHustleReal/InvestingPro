/**
 * Stats Bar Component - Homepage Trust Signals
 * Purpose: Display platform credibility metrics
 */

import { formatLargeNumber } from "@/lib/utils/currency";
import { TrendingUp, Users, Building2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  iconColor: string;
}

function StatItem({ icon: Icon, value, label, iconColor }: StatItemProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
        iconColor
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-3xl md:text-4xl font-bold font-mono text-slate-900 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

export function StatsBar() {
  return (
    <div className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatItem
            icon={TrendingUp}
            value={formatLargeNumber(50000000) + '+'}
            label="Amount Compared"
            iconColor="bg-primary-600"
          />
          <StatItem
            icon={Users}
            value="10,000+"
            label="Happy Users"
            iconColor="bg-success-600"
          />
          <StatItem
            icon={Building2}
            value="500+"
            label="Products Listed"
            iconColor="bg-accent-600"
          />
          <StatItem
            icon={Shield}
            value="100%"
            label="Unbiased Reviews"
            iconColor="bg-secondary-600"
          />
        </div>
      </div>
    </div>
  );
}
