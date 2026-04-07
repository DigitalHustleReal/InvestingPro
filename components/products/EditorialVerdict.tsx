import { Award, Star, StarHalf, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorialVerdictProps {
  productName: string;
  rating: number;
  verdict: string;
  scores?: { label: string; score: number }[];
  className?: string;
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-6 h-6 fill-amber-500 text-amber-500"
        />
      ))}
      {hasHalf && (
        <StarHalf className="w-6 h-6 fill-amber-500 text-amber-500" />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="w-6 h-6 text-gray-300 dark:text-gray-600"
        />
      ))}
      <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function EditorialVerdict({
  productName,
  rating,
  verdict,
  scores,
  className,
}: EditorialVerdictProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/20 p-6 shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <span className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">
          InvestingPro Verdict
        </span>
      </div>

      {/* Product name + rating */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {productName}
      </h3>
      <div className="mb-5">
        <RatingStars rating={rating} />
      </div>

      {/* Score breakdown */}
      {scores && scores.length > 0 && (
        <div className="space-y-3 mb-5">
          {scores.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                  {item.score.toFixed(1)}/10
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-green-100 dark:bg-green-900/40">
                <div
                  className="h-2 rounded-full bg-green-600 dark:bg-green-500 transition-all"
                  style={{ width: `${Math.min(item.score, 10) * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verdict text */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {verdict}
      </p>

      {/* Bottom badge */}
      <div className="flex items-center gap-1.5 pt-3 border-t border-green-200/60 dark:border-green-800/40">
        <Shield className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
        <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
          Reviewed by InvestingPro Editorial Team
        </span>
      </div>
    </div>
  );
}
