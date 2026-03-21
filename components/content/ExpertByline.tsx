/**
 * Expert Byline Component - Week 2, Task 2.3
 * Purpose: Display author credentials, expertise, and last updated date
 * Critical for E-A-T (Expertise, Authoritativeness, Trustworthiness)
 */

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Calendar, Award } from "lucide-react";

export interface ExpertBylineProps {
  name: string;
  credentials?: string;  // e.g., "CFA, CFP"
  title: string;         // e.g., "Senior Financial Analyst"
  photoUrl?: string;
  lastUpdated?: Date;
  expertise?: string[];  // e.g., ["Credit Cards", "Personal Loans"]
  className?: string;
  variant?: 'full' | 'compact';
}

export function ExpertByline({
  name,
  credentials,
  title,
  photoUrl,
  lastUpdated,
  expertise,
  className,
  variant = 'full',
}: ExpertBylineProps) {
  const isCompact = variant === 'compact';

  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 border-l-4 border-primary-600 rounded-lg",
        isCompact && "p-3 gap-2",
        className
      )}
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Photo */}
      {photoUrl ? (
        <div className={cn(
          "flex-shrink-0 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800",
          isCompact ? "w-10 h-10" : "w-12 h-12"
        )}>
          <Image
            src={photoUrl}
            alt={name}
            width={isCompact ? 40 : 48}
            height={isCompact ? 40 : 48}
            className="object-cover"
            itemProp="image"
          />
        </div>
      ) : (
        <div className={cn(
          "flex-shrink-0 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center",
          isCompact ? "w-10 h-10" : "w-12 h-12"
        )}>
          <span className={cn(
            "text-primary-700 font-bold",
            isCompact ? "text-sm" : "text-base"
          )}>
            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name and Credentials */}
        <div className="flex items-center gap-2 flex-wrap">
          <span 
            className={cn(
              "font-semibold text-slate-900 dark:text-white",
              isCompact ? "text-sm" : "text-base"
            )}
            itemProp="name"
          >
            {name}
          </span>
          {credentials && (
            <span 
              className={cn(
                "font-semibold text-primary-600",
                isCompact ? "text-xs" : "text-sm"
              )}
              itemProp="honorificSuffix"
            >
              {credentials}
            </span>
          )}
        </div>

        {/* Title */}
        <p 
          className={cn(
            "text-slate-600 dark:text-slate-400",
            isCompact ? "text-xs" : "text-sm"
          )}
          itemProp="jobTitle"
        >
          {title}
        </p>

        {/* Expertise Tags (Full variant only) */}
        {!isCompact && expertise && expertise.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {expertise.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-[10px] font-medium"
              >
                <Award className="w-3 h-3" aria-hidden="true" />
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center gap-1 mt-2">
            <Calendar className={cn(
              "text-slate-500 dark:text-slate-600",
              isCompact ? "w-3 h-3" : "w-3.5 h-3.5"
            )} aria-hidden="true" />
            <span className={cn(
              "text-slate-500 dark:text-slate-600",
              isCompact ? "text-[10px]" : "text-xs"
            )}>
              Last updated: {lastUpdated.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact expert byline for article headers
 */
export function CompactExpertByline(props: Omit<ExpertBylineProps, 'variant'>) {
  return <ExpertByline {...props} variant="compact" />;
}

/**
 * Expert byline with review/rating (for product reviews)
 */
export function ExpertReviewByline(
  props: ExpertBylineProps & { 
    rating?: number;
    reviewDate?: Date;
  }
) {
  const { rating, reviewDate, ...bylineProps } = props;

  return (
    <div className="space-y-3">
      <ExpertByline {...bylineProps} />
      
      {(rating || reviewDate) && (
        <div className="flex items-center gap-4 px-4 py-2 bg-accent-50 border border-accent-200 rounded-lg">
          {rating && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Expert Rating:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i}
                    className={cn(
                      "text-base",
                      i < rating ? "text-accent-500" : "text-slate-300 dark:text-slate-600"
                    )}
                    aria-hidden="true"
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm font-bold text-slate-900 dark:text-white ml-1">
                  {(typeof rating === 'number' ? rating : Number(rating) || 4.5).toFixed(1)}
                </span>
              </div>
            </div>
          )}
          
          {reviewDate && (
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              Reviewed: {reviewDate.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
