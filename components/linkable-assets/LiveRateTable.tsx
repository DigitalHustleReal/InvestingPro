"use client";

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  RefreshCw,
  Download,
  ExternalLink,
  Clock,
  TrendingUp,
  Building2,
  Share2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export interface RateData {
  id: string;
  provider: string;
  providerLogo?: string;
  rate: number;
  previousRate?: number;
  tenure?: string;
  minAmount?: number;
  maxAmount?: number;
  features?: string[];
  applyUrl?: string;
  lastUpdated: Date;
  category?: string;
}

export interface LiveRateTableProps {
  title: string;
  description?: string;
  rateType: 'fd' | 'rd' | 'savings' | 'loan' | 'credit-card';
  data?: RateData[];
  fetchUrl?: string;
  showSearch?: boolean;
  showExport?: boolean;
  showShare?: boolean;
  maxRows?: number;
  sortable?: boolean;
  highlightBest?: boolean;
  updateInterval?: number; // in milliseconds
  onRateClick?: (rate: RateData) => void;
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'provider' | 'rate' | 'tenure' | 'minAmount';

// =============================================================================
// COMPONENT
// =============================================================================

export function LiveRateTable({
  title,
  description,
  rateType,
  data: initialData,
  fetchUrl,
  showSearch = true,
  showExport = true,
  showShare = true,
  maxRows,
  sortable = true,
  highlightBest = true,
  updateInterval = 60000, // 1 minute default
  onRateClick,
}: LiveRateTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('rate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Fetch data if URL provided
  const { data: fetchedData, isLoading, refetch, dataUpdatedAt } = useQuery<RateData[]>({
    queryKey: ['live-rates', rateType, fetchUrl],
    queryFn: async () => {
      if (!fetchUrl) return initialData || [];
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error('Failed to fetch rates');
      return response.json();
    },
    enabled: !!fetchUrl,
    refetchInterval: updateInterval,
    initialData: initialData,
  });

  const rates = fetchedData || initialData || [];

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = rates.filter(rate => 
      rate.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        
        if (aVal == null || bVal == null) return 0;
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (maxRows) {
      filtered = filtered.slice(0, maxRows);
    }

    return filtered;
  }, [rates, searchTerm, sortField, sortDirection, maxRows]);

  // Find best rate
  const bestRate = useMemo(() => {
    if (!highlightBest || rates.length === 0) return null;
    return rates.reduce((best, current) => 
      current.rate > best.rate ? current : best
    );
  }, [rates, highlightBest]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (!sortable) return;
    
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['Provider', 'Rate', 'Tenure', 'Min Amount', 'Last Updated'];
    const csvData = processedData.map(rate => [
      rate.provider,
      `${rate.rate}%`,
      rate.tenure || '-',
      rate.minAmount ? formatCurrency(rate.minAmount) : '-',
      new Date(rate.lastUpdated).toLocaleDateString(),
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rateType}-rates-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Share functionality
  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || `Compare ${rateType} rates on InvestingPro`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  // Render sort indicator
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    if (sortDirection === 'asc') return <ArrowUp className="w-4 h-4 ml-1 text-primary-500" />;
    if (sortDirection === 'desc') return <ArrowDown className="w-4 h-4 ml-1 text-primary-500" />;
    return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
  };

  // Rate change indicator
  const RateChange = ({ current, previous }: { current: number; previous?: number }) => {
    if (!previous || current === previous) return null;
    const change = current - previous;
    const isUp = change > 0;
    
    return (
      <span className={`text-xs ml-1 ${isUp ? 'text-green-600' : 'text-red-600'}`}>
        {isUp ? <ArrowUp className="w-3 h-3 inline" /> : <ArrowDown className="w-3 h-3 inline" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              {title}
              <Badge variant="outline" className="ml-2 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showShare && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            )}
            {showExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Last updated */}
        {dataUpdatedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead 
                  className={sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700' : ''}
                  onClick={() => handleSort('provider')}
                >
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Provider
                    {sortable && <SortIndicator field="provider" />}
                  </div>
                </TableHead>
                <TableHead 
                  className={sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700' : ''}
                  onClick={() => handleSort('rate')}
                >
                  <div className="flex items-center">
                    Interest Rate
                    {sortable && <SortIndicator field="rate" />}
                  </div>
                </TableHead>
                <TableHead 
                  className={sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700' : ''}
                  onClick={() => handleSort('tenure')}
                >
                  <div className="flex items-center">
                    Tenure
                    {sortable && <SortIndicator field="tenure" />}
                  </div>
                </TableHead>
                <TableHead 
                  className={sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700' : ''}
                  onClick={() => handleSort('minAmount')}
                >
                  <div className="flex items-center">
                    Min Amount
                    {sortable && <SortIndicator field="minAmount" />}
                  </div>
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && processedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading rates...
                  </TableCell>
                </TableRow>
              ) : processedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No rates found
                  </TableCell>
                </TableRow>
              ) : (
                processedData.map((rate, index) => (
                  <TableRow 
                    key={rate.id}
                    className={`
                      hover:bg-slate-50 dark:hover:bg-slate-800/50 
                      ${highlightBest && rate.id === bestRate?.id ? 'bg-green-50 dark:bg-green-900/20' : ''}
                      ${onRateClick ? 'cursor-pointer' : ''}
                    `}
                    onClick={() => onRateClick?.(rate)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {rate.providerLogo && (
                          <img 
                            src={rate.providerLogo} 
                            alt={rate.provider}
                            className="w-8 h-8 rounded-full object-contain"
                          />
                        )}
                        <div>
                          <span className="font-medium">{rate.provider}</span>
                          {highlightBest && rate.id === bestRate?.id && (
                            <Badge className="ml-2 bg-green-500 text-xs">Best Rate</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-lg">{rate.rate}%</span>
                      <RateChange current={rate.rate} previous={rate.previousRate} />
                      <span className="text-xs text-muted-foreground ml-1">p.a.</span>
                    </TableCell>
                    <TableCell>
                      {rate.tenure || '-'}
                    </TableCell>
                    <TableCell>
                      {rate.minAmount ? formatCurrency(rate.minAmount) : '-'}
                    </TableCell>
                    <TableCell>
                      {rate.applyUrl ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(rate.applyUrl, '_blank');
                          }}
                        >
                          Apply
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with source attribution */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Data sourced from official bank/institution websites. 
            Rates may vary based on amount and tenure.
          </span>
          <span>
            Showing {processedData.length} of {rates.length} providers
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default LiveRateTable;
