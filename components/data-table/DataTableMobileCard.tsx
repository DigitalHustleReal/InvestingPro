"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from './types';

interface DataTableMobileCardProps<T> {
  row: T;
  columns: ColumnDef<T>[];
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  onClick?: () => void;
}

export function DataTableMobileCard<T>({
  row,
  columns,
  selected = false,
  onSelect,
  onClick
}: DataTableMobileCardProps<T>) {
  // Filter out mobile-hidden columns
  const visibleColumns = columns.filter(col => !col.mobileHidden);

  // Primary column (first non-hidden column)
  const primaryColumn = visibleColumns[0];
  // Secondary columns (rest)
  const secondaryColumns = visibleColumns.slice(1);

  return (
    <Card
      className={`p-3 cursor-pointer transition-all hover:shadow-md ${
        selected ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/10' : ''
      }`}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header with checkbox and primary info */}
        <div className="flex items-start gap-3">
          {onSelect && (
            <div onClick={e => e.stopPropagation()}>
              <Checkbox
                checked={selected}
                onCheckedChange={onSelect}
              />
            </div>
          )}
          <div className="flex-1">
            {primaryColumn && (
              <div className="font-semibold text-slate-900 dark:text-white text-base">
                {primaryColumn.accessor(row)}
              </div>
            )}
          </div>
        </div>

        {/* Secondary info grid */}
        {secondaryColumns.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {secondaryColumns.map((column) => (
              <div key={column.key}>
                <div className="text-xs text-slate-500 dark:text-slate-600 font-medium mb-1">
                  {column.header}
                </div>
                <div className="text-sm text-slate-900 dark:text-white font-medium">
                  {column.accessor(row)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
