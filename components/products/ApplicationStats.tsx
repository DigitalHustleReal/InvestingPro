"use client";

import React from "react";
import { Clock, ShieldCheck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationStatsProps {
  productName: string;
  className?: string;
}

/**
 * Product application info — shows factual application details
 * No fake stats, no random numbers, no fabricated data
 */
export default function ApplicationStats({
  productName,
  className,
}: ApplicationStatsProps) {
  return (
    <div
      className={cn(
        "bg-gray-50 border border-gray-200 rounded-xl p-5",
        className,
      )}
    >
      <h3 className="font-bold text-sm text-gray-900 mb-3">
        How to Apply for {productName}
      </h3>
      <div className="space-y-2.5 text-sm text-gray-600">
        <div className="flex items-start gap-2.5">
          <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <span>
            Compare features and rewards on this page, then click "Apply Now" to
            go to the issuer&apos;s official website
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <span>
            Most applications are processed within 24-72 hours. Instant approval
            available for pre-qualified applicants
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <span>
            You apply directly on the bank&apos;s website — InvestingPro never
            collects your personal or financial details
          </span>
        </div>
      </div>
    </div>
  );
}
