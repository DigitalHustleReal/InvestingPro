import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data available",
  className,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof T];
      const bValue = b[sortColumn as keyof T];

      if (aValue === bValue) return 0;
      
      const comparison = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "overflow-x-auto",
      "border border-white/10 rounded-xl",
      "bg-white/5 backdrop-blur-sm",
      className
    )}>
      <table className="min-w-full divide-y divide-white/10">
        {/* Header */}
        <thead className="bg-white/5">
          <tr className="border-b-2 border-white/10">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-6 py-3 text-left",
                  "text-xs font-semibold uppercase tracking-wider",
                  "text-slate-300 font-inter",
                  column.sortable && "cursor-pointer hover:text-slate-200 select-none",
                  column.className
                )}
                onClick={() => column.sortable && handleSort(String(column.key))}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && (
                    <span className="inline-flex">
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Body */}
        <tbody className="bg-transparent divide-y divide-white/5">
          {sortedData.length > 0 ? (
            sortedData.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "transition-colors duration-150",
                  "hover:bg-white/5",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      "px-6 py-4 whitespace-nowrap",
                      "text-sm text-slate-200 font-inter",
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key as keyof T], row)
                      : String(row[column.key as keyof T] || '-')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-slate-600 font-inter"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Status Badge Component (commonly used in tables)
export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const statusClasses = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    neutral: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full",
      "text-xs font-semibold uppercase tracking-wider",
      "border backdrop-blur-sm",
      statusClasses[status]
    )}>
      {children}
    </span>
  );
}
