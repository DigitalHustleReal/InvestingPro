/**
 * Enhanced Comparison Table Component - Week 3, Task 3.2
 * Purpose: Side-by-side product comparison with sorting, highlighting
 * 
 * Features:
 * - Side-by-side product comparison
 * - Zebra striping for readability
 * - Best value highlighting
 * - Sticky header
 * - Responsive (horizontal scroll on mobile)
 * - Currency formatting
 * - Sort indicators
 */

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatINR, formatPercentage } from "@/lib/utils/currency";
import { Check, X, ArrowUpDown, Award, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ComparisonTableColumn {
  id: string;
  productName: string;
  provider: string;
  isBestValue?: boolean;
  logo?: string;
  applyUrl?: string;
}

export interface ComparisonTableRow {
  category?: string;  // Optional category header
  feature: string;
  type: 'text' | 'currency' | 'percentage' | 'boolean' | 'rating';
  values: (string | number | boolean | null)[];
  highlight?: boolean;  // Highlight this row
  tooltip?: string;
}

interface ComparisonTableProps {
  columns: ComparisonTableColumn[];
  rows: ComparisonTableRow[];
  className?: string;
}

export function ComparisonTable({
  columns,
  rows,
  className,
}: ComparisonTableProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // Format cell value based on type
  const formatValue = (
    value: string | number | boolean | null,
    type: ComparisonTableRow['type']
  ): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-slate-400 dark:text-slate-500">—</span>;
    }

    switch (type) {
      case 'currency':
        return (
          <span className="font-mono font-medium">
            {formatINR(value as number)}
          </span>
        );
      
      case 'percentage':
        return (
          <span className="font-mono font-medium">
            {formatPercentage(value as number)}
          </span>
        );
      
      case 'boolean':
        return value ? (
          <Check className="w-5 h-5 text-success-600 mx-auto" />
        ) : (
          <X className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />
        );
      
      case 'rating':
        return (
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={cn(
                  "text-base",
                  i < (value as number) ? "text-accent-500" : "text-slate-300 dark:text-slate-600"
                )}
              >
                ★
              </span>
            ))}
          </div>
        );
      
      default:
        return <span>{value.toString()}</span>;
    }
  };

  // Check if a column has the best value for a numeric row
  const isBestValue = (rowIndex: number, colIndex: number): boolean => {
    const row = rows[rowIndex];
    if (row.type !== 'currency' && row.type !== 'percentage' && row.type !== 'rating') {
      return false;
    }

    const values = row.values.filter(v => typeof v === 'number') as number[];
    if (values.length === 0) return false;

    const currentValue = row.values[colIndex];
    if (typeof currentValue !== 'number') return false;

    // For currency/percentage: lower is better (fees, interest rates)
    // For ratings: higher is better
    if (row.type === 'rating') {
      return currentValue === Math.max(...values);
    } else {
      // Assume lower is better for fees/rates
      return currentValue === Math.min(...values);
    }
  };

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full border-collapse">
          {/* Header */}
          <thead className="bg-primary-700 text-white sticky top-0 z-10">
            <tr>
              {/* Feature column header */}
              <th
                className="px-4 py-4 text-left text-sm font-semibold"
                style={{ minWidth: '200px' }}
              >
                Feature
              </th>
              
              {/* Product column headers */}
              {columns.map((col, index) => (
                <th
                  key={col.id}
                  className={cn(
                    "px-4 py-4 text-center text-sm font-semibold transition-colors",
                    hoveredCol === index && "bg-primary-700",
                    col.isBestValue && "bg-accent-600"
                  )}
                  style={{ minWidth: '180px' }}
                  onMouseEnter={() => setHoveredCol(index)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  <div className="space-y-1">
                    {col.isBestValue && (
                      <div className="flex items-center justify-center gap-1">
                        <Award className="w-4 h-4" />
                        <span className="text-xs font-bold">Best Value</span>
                      </div>
                    )}
                    <div className="font-bold">{col.productName}</div>
                    <div className="text-xs opacity-90">{col.provider}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.map((row, rowIndex) => {
              // Category header row
              if (row.category) {
                return (
                  <tr key={`category-${rowIndex}`}>
                    <td
                      colSpan={columns.length + 1}
                      className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-700"
                    >
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                        {row.category}
                      </h3>
                    </td>
                  </tr>
                );
              }

              // Regular data row
              return (
                <tr
                  key={`row-${rowIndex}`}
                  className={cn(
                    "border-b border-slate-200 dark:border-slate-700",
                    rowIndex % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800",
                    row.highlight && "bg-accent-50 dark:bg-accent-950"
                  )}
                >
                  {/* Feature name */}
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        row.highlight && "font-semibold"
                      )}>
                        {row.feature}
                      </span>
                      {row.tooltip && (
                        <span title={row.tooltip}>
                          <AlertCircle
                            className="w-4 h-4 text-slate-400 dark:text-slate-500"
                          />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Product values */}
                  {row.values.map((value, colIndex) => {
                    const isColumnBestValue = columns[colIndex].isBestValue;
                    const isRowBestValue = isBestValue(rowIndex, colIndex);

                    return (
                      <td
                        key={`cell-${rowIndex}-${colIndex}`}
                        className={cn(
                          "px-4 py-3 text-sm text-center transition-colors",
                          hoveredCol === colIndex && "bg-primary-50",
                          isColumnBestValue && "bg-accent-50",
                          isRowBestValue && "bg-success-50 border-l-2 border-success-600"
                        )}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {formatValue(value, row.type)}
                          {isRowBestValue && (
                            <Award className="w-4 h-4 text-success-600" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          {/* Footer with CTA buttons */}
          <tfoot className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                Ready to apply?
              </td>
              {columns.map((col) => (
                <td key={`footer-${col.id}`} className="px-4 py-4 text-center">
                  {col.applyUrl ? (
                    <Button
                      size="sm"
                      className="w-full bg-primary-700 hover:bg-primary-800"
                      asChild
                    >
                      <a href={col.applyUrl} target="_blank" rel="noopener noreferrer">
                        Apply Now
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      disabled
                    >
                      Not Available
                    </Button>
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile Notice */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 md:hidden">
        <Info className="w-3.5 h-3.5 text-primary-500" />
        <span>Swipe horizontally to see all products</span>
      </div>
    </div>
  );
}

/**
 * Helper to create comparison table rows with categories
 */
export function createComparisonSection(
  categoryName: string,
  rows: Omit<ComparisonTableRow, 'category'>[]
): ComparisonTableRow[] {
  return [
    { category: categoryName, feature: '', type: 'text', values: [] },
    ...rows,
  ];
}
