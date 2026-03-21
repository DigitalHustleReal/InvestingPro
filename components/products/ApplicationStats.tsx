"use client";

import React from 'react';
import { TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicationStatsProps {
  productName: string;
  className?: string;
  // Optional: pass real data when available
  applicationsThisMonth?: number;
  approvalRate?: number;
  avgProcessingTime?: string;
}

export default function ApplicationStats({ 
  productName, 
  className,
  applicationsThisMonth,
  approvalRate,
  avgProcessingTime 
}: ApplicationStatsProps) {
  // Mock data (replace with real analytics when available)
  const stats = {
    applications: applicationsThisMonth || Math.floor(Math.random() * 5000) + 8000, // 8000-13000
    approvalRate: approvalRate || Math.floor(Math.random() * 15) + 75, // 75-90%
    processingTime: avgProcessingTime || "24-48 hours",
    trending: Math.random() > 0.5 // 50% chance of trending
  };

  return (
    <div className={cn(
      "bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/20 dark:to-slate-900 border border-primary-200 dark:border-primary-800/30 rounded-2xl p-6 shadow-lg",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-bold text-slate-900 dark:text-white">Application Statistics</h3>
        {stats.trending && (
          <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-950/30 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            Trending
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Applications This Month */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-slate-500" />
            <p className="text-xs text-slate-500 dark:text-slate-600 font-medium">This Month</p>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.applications.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">applications</p>
        </div>

        {/* Approval Rate */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-success-500" />
            <p className="text-xs text-slate-500 dark:text-slate-600 font-medium">Approval Rate</p>
          </div>
          <p className="text-2xl font-black text-success-600 dark:text-success-400">
            {stats.approvalRate}%
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">avg. approval</p>
        </div>

        {/* Processing Time */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary-500" />
            <p className="text-xs text-slate-500 dark:text-slate-600 font-medium">Processing</p>
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">
            {stats.processingTime}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">avg. time</p>
        </div>
      </div>

      {/* Social Proof Message */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
          <span className="font-semibold text-slate-900 dark:text-white">
            {Math.floor(stats.applications / 30)}+ people
          </span>
          {" "}applied for {productName} today
        </p>
      </div>
    </div>
  );
}
