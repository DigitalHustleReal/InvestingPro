// TypeScript interfaces for DataTable component

export interface ColumnDef<T = any> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode; // Cell renderer function
  sortable?: boolean;
  width?: string; // e.g., "200px", "20%", "auto"
  align?: 'left' | 'center' | 'right';
  mobileHidden?: boolean; // Hide this column on mobile
  className?: string; // Additional CSS classes for the column
}

export interface PaginationConfig {
  pageSize: number;
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T = any> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  selectable?: boolean; // Enable row selection checkboxes
  onSelectionChange?: (selectedRows: T[]) => void;
  pagination?: PaginationConfig;
  sortable?: boolean; // Enable column sorting
  defaultSort?: { column: string; direction: 'asc' | 'desc' };
  emptyMessage?: string;
  className?: string;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}
