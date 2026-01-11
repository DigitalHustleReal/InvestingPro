"use client";

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableProps, SortConfig, ColumnDef } from './types';
import { DataTablePagination } from './DataTablePagination';
import { DataTableMobileCard } from './DataTableMobileCard';

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  onRowClick,
  selectable = false,
  onSelectionChange,
  pagination,
  sortable = true,
  defaultSort,
  emptyMessage = "No data available",
  className = ""
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(
    defaultSort || null
  );
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig || !sortable) return data;

    const sorted = [...data].sort((a, b) => {
      const column = columns.find(col => col.key === sortConfig.column);
      if (!column) return 0;

      // Get the raw values from the data object using the column key
      // This works better than using accessor which might return React elements
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];

      // Handle null/undefined values
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Compare values
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [data, sortConfig, sortable, columns]);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (!current || current.column !== columnKey) {
        return { column: columnKey, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { column: columnKey, direction: 'desc' };
      }
      return null; // Remove sorting
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(sortedData);
      onSelectionChange?.(sortedData);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const newSelection = checked
      ? [...selectedRows, row]
      : selectedRows.filter(r => r !== row);
    
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const isRowSelected = (row: T) => selectedRows.includes(row);
  const isAllSelected = selectedRows.length === sortedData.length && sortedData.length > 0;

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.column !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-primary-600" />
      : <ChevronDown className="w-4 h-4 text-primary-600" />;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (sortedData.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Desktop Table View - shown on md and above (≥768px) */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-4">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ${
                    column.sortable && sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors' : ''
                  } ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={`flex items-center gap-2 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : ''}`}>
                    {column.header}
                    {column.sortable && sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedData.map((row, rowIndex) => {
              const selected = isRowSelected(row);
              return (
                <tr
                  key={rowIndex}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800' : ''
                  } ${selected ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => handleSelectRow(row, checked as boolean)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-4 text-sm text-slate-700 dark:text-slate-300 ${
                        column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''
                      } ${column.className || ''}`}
                    >
                      {column.accessor(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - shown below md (<768px) */}
      <div className="md:hidden space-y-4">
        {sortedData.map((row, index) => (
          <DataTableMobileCard
            key={index}
            row={row}
            columns={columns}
            selected={isRowSelected(row)}
            onSelect={selectable ? (checked) => handleSelectRow(row, checked) : undefined}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <DataTablePagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalCount={pagination.totalCount}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
