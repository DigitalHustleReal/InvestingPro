"use client";

import React, { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, TrendingUp, Star } from 'lucide-react';

// Sample data type
interface SampleFund {
  id: string;
  name: string;
  category: string;
  returns_1y: number;
  returns_3y: number;
  returns_5y: number;
  expenseRatio: number;
  aum: number;
  rating: number;
  risk: string;
}

// Sample dataset
const SAMPLE_FUNDS: SampleFund[] = [
  {
    id: '1',
    name: 'HDFC Mid-Cap Opportunities Fund',
    category: 'Mid Cap',
    returns_1y: 18.5,
    returns_3y: 22.3,
    returns_5y: 19.8,
    expenseRatio: 0.92,
    aum: 45000,
    rating: 4.5,
    risk: 'High'
  },
  {
    id: '2',
    name: 'Axis Bluechip Fund',
    category: 'Large Cap',
    returns_1y: 12.4,
    returns_3y: 16.8,
    returns_5y: 15.2,
    expenseRatio: 0.65,
    aum: 38000,
    rating: 4,
    risk: 'Moderate'
  },
  {
    id: '3',
    name: 'SBI Small Cap Fund',
    category: 'Small Cap',
    returns_1y: 24.6,
    returns_3y: 28.1,
    returns_5y: 25.3,
    expenseRatio: 1.15,
    aum: 15000,
    rating: 5,
    risk: 'Very High'
  },
  {
    id: '4',
    name: 'ICICI Prudential Balanced Advantage',
    category: 'Hybrid',
    returns_1y: 10.2,
    returns_3y: 12.5,
    returns_5y: 11.8,
    expenseRatio: 0.88,
    aum: 52000,
    rating: 4,
    risk: 'Low to Moderate'
  },
  {
    id: '5',
    name: 'Parag Parikh Flexi Cap Fund',
    category: 'Flexi Cap',
    returns_1y: 16.7,
    returns_3y: 20.4,
    returns_5y: 18.9,
    expenseRatio: 0.72,
    aum: 35000,
    rating: 4.5,
    risk: 'Moderately High'
  },
  {
    id: '6',
    name: 'Mirae Asset Large Cap Fund',
    category: 'Large Cap',
    returns_1y: 14.3,
    returns_3y: 17.6,
    returns_5y: 16.1,
    expenseRatio: 0.58,
    aum: 42000,
    rating: 4,
    risk: 'Moderate'
  },
  {
    id: '7',
    name: 'Kotak Emerging Equity Fund',
    category: 'Mid Cap',
    returns_1y: 19.8,
    returns_3y: 23.7,
    returns_5y: 21.2,
    expenseRatio: 0.95,
    aum: 28000,
    rating: 4.5,
    risk: 'High'
  },
  {
    id: '8',
    name: 'Nippon India Small Cap Fund',
    category: 'Small Cap',
    returns_1y: 26.4,
    returns_3y: 30.2,
    returns_5y: 27.5,
    expenseRatio: 1.22,
    aum: 18000,
    rating: 5,
    risk: 'Very High'
  }
];

export default function DataTableDemo() {
  const [selectedFunds, setSelectedFunds] = useState<SampleFund[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Define columns
  const columns: ColumnDef<SampleFund>[] = [
    {
      key: 'name',
      header: 'Fund Name',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{row.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-600">{row.category}</div>
        </div>
      ),
      sortable: true,
      width: '30%'
    },
    {
      key: 'rating',
      header: 'Rating',
      accessor: (row) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-accent-400 fill-accent-400" />
          <span className="font-bold text-slate-900 dark:text-white">{row.rating}</span>
        </div>
      ),
      sortable: true,
      align: 'center',
      width: '10%'
    },
    {
      key: 'returns_1y',
      header: '1Y Returns',
      accessor: (row) => (
        <span className={`font-semibold ${row.returns_1y > 15 ? 'text-success-600' : 'text-slate-700 dark:text-slate-300'}`}>
          {row.returns_1y.toFixed(1)}%
        </span>
      ),
      sortable: true,
      align: 'right',
      width: '12%',
      mobileHidden: true
    },
    {
      key: 'returns_3y',
      header: '3Y Returns',
      accessor: (row) => (
        <span className={`font-semibold ${row.returns_3y > 18 ? 'text-success-600' : 'text-slate-700 dark:text-slate-300'}`}>
          {row.returns_3y.toFixed(1)}%
        </span>
      ),
      sortable: true,
      align: 'right',
      width: '12%'
    },
    {
      key: 'returns_5y',
      header: '5Y Returns',
      accessor: (row) => (
        <span className={`font-semibold ${row.returns_5y > 17 ? 'text-success-600' : 'text-slate-700 dark:text-slate-300'}`}>
          {row.returns_5y.toFixed(1)}%
        </span>
      ),
      sortable: true,
      align: 'right',
      width: '12%',
      mobileHidden: true
    },
    {
      key: 'expenseRatio',
      header: 'Expense Ratio',
      accessor: (row) => (
        <span className="text-sm text-slate-600 dark:text-slate-600">
          {row.expenseRatio.toFixed(2)}%
        </span>
      ),
      sortable: true,
      align: 'right',
      width: '12%',
      mobileHidden: true
    },
    {
      key: 'risk',
      header: 'Risk',
      accessor: (row) => {
        const riskColors: Record<string, string> = {
          'Low to Moderate': 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400',
          'Moderate': 'bg-accent-100 text-accent-700 dark:bg-accent-900/20 dark:text-accent-400',
          'Moderately High': 'bg-accent-100 text-accent-700 dark:bg-accent-900/20 dark:text-accent-400',
          'High': 'bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400',
          'Very High': 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
        };
        return (
          <Badge className={`${riskColors[row.risk] || ''} border-0`}>
            {row.risk}
          </Badge>
        );
      },
      sortable: false,
      align: 'center',
      width: '12%'
    }
  ];

  // Pagination
  const paginatedData = SAMPLE_FUNDS.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            DataTable Component Demo
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-600">
            Universal table component with sorting, pagination, and mobile responsiveness
          </p>
        </div>

        {/* Selected funds info */}
        {selectedFunds.length > 0 && (
          <Card className="p-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-primary-900 dark:text-primary-100">
                {selectedFunds.length} fund{selectedFunds.length > 1 ? 's' : ''} selected
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedFunds([])}
              >
                Clear Selection
              </Button>
            </div>
          </Card>
        )}

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={paginatedData}
          selectable={true}
          onSelectionChange={setSelectedFunds}
          sortable={true}
          defaultSort={{ column: 'returns_3y', direction: 'desc' }}
          pagination={{
            currentPage,
            pageSize,
            totalCount: SAMPLE_FUNDS.length,
            onPageChange: setCurrentPage
          }}
          onRowClick={(fund) => {
            console.log('Clicked fund:', fund.name);
            alert(`Clicked: ${fund.name}`);
          }}
        />

        {/* Features list */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Desktop Features
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-600">
              <li>âœ… Sortable columns (click headers)</li>
              <li>âœ… Row selection with checkboxes</li>
              <li>âœ… Pagination with page numbers</li>
              <li>âœ… Row click handlers</li>
              <li>âœ… Custom cell renderers</li>
              <li>âœ… Dark mode support</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary-600" />
              Mobile Features
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-600">
              <li>âœ… Automatic card layout on mobile</li>
              <li>âœ… Hide non-essential columns</li>
              <li>âœ… Touch-friendly interactions</li>
              <li>âœ… Responsive pagination</li>
              <li>âœ… Grid layout for secondary info</li>
              <li>âœ… Optimized for small screens</li>
            </ul>
          </Card>
        </div>

        {/* Code example */}
        <Card className="p-6 bg-slate-900 text-slate-100">
          <h3 className="font-bold mb-4">Usage Example:</h3>
          <pre className="text-xs overflow-x-auto">
{`import { DataTable, ColumnDef } from '@/components/data-table';

const columns: ColumnDef<Fund>[] = [
  {
    key: 'name',
    header: 'Fund Name',
    accessor: (row) => row.name,
    sortable: true
  },
  // ... more columns
];

<DataTable
  columns={columns}
  data={funds}
  selectable={true}
  sortable={true}
  pagination={{ /* ... */ }}
/>`}
          </pre>
        </Card>
      </div>
    </div>
  );
}
