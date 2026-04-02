'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Play, RefreshCw, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Scraper {
  id: string;
  name: string;
  description: string;
  sources: string[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastRun: string | null;
  itemsScraped: number;
  errors: string[];
  duration: number | null;
}

interface ScraperMonitorProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export default function ScraperMonitor({ 
  autoRefresh = true, 
  refreshInterval = 5000 
}: ScraperMonitorProps) {
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [activeScrapers, setActiveScrapers] = useState(0);

  // Fetch scraper status
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/scrapers/status');
      const data = await response.json();
      
      if (data.success) {
        setScrapers(data.scrapers);
        setActiveScrapers(data.activeScrapers);
      }
    } catch (error) {
      console.error('Error fetching scraper status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger a scraper
  const triggerScraper = async (scraperId: string) => {
    setTriggering(scraperId);
    
    try {
      const response = await fetch('/api/scrapers/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scraperId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh status immediately
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error triggering scraper:', error);
    } finally {
      setTriggering(null);
    }
  };

  // Trigger all scrapers
  const triggerAll = async () => {
    setTriggering('all');
    
    try {
      const response = await fetch('/api/scrapers/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerAll: true })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error triggering all scrapers:', error);
    } finally {
      setTriggering(null);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(fetchStatus, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-300" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-300 border-gray-500/20';
    }
  };

  // Format duration
  const formatDuration = (ms: number | null) => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-wt-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-wt-text dark:text-wt-text">Scraper Monitor</h2>
          <p className="text-sm text-gray-300 mt-1">
            {activeScrapers} of {scrapers.length} scrapers running
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchStatus}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          
          <Button
            onClick={triggerAll}
            disabled={triggering !== null}
            className="gap-2 bg-wt-gold hover:bg-wt-gold-hover"
          >
            {triggering === 'all' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Trigger All Scrapers
          </Button>
        </div>
      </div>

      {/* Scrapers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scrapers.map((scraper) => (
          <Card key={scraper.id} className="p-6 bg-surface-darker/50 dark:bg-surface-darker/50 border-wt-border">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(scraper.status)}
                <div>
                  <h3 className="font-semibold text-wt-text dark:text-wt-text">{scraper.name}</h3>
                  <p className="text-sm text-gray-300 mt-1">{scraper.description}</p>
                </div>
              </div>
              
              <Button
                onClick={() => triggerScraper(scraper.id)}
                disabled={triggering !== null || scraper.status === 'running'}
                size="sm"
                variant="ghost"
                className="gap-2"
              >
                {triggering === scraper.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Status Badge */}
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4",
              getStatusColor(scraper.status)
            )}>
              {scraper.status.toUpperCase()}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-300">Items Scraped</p>
                <p className="text-lg font-semibold text-wt-text dark:text-wt-text mt-1">
                  {scraper.itemsScraped.toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-300">Last Run</p>
                <p className="text-sm font-medium text-wt-text dark:text-wt-text mt-1">
                  {formatDate(scraper.lastRun)}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-300">Duration</p>
                <p className="text-sm font-medium text-wt-text dark:text-wt-text mt-1">
                  {formatDuration(scraper.duration)}
                </p>
              </div>
            </div>

            {/* Sources */}
            <div className="mb-4">
              <p className="text-xs text-gray-300 mb-2">Sources:</p>
              <div className="flex flex-wrap gap-2">
                {scraper.sources.map((source) => (
                  <span
                    key={source}
                    className="px-2 py-1 bg-muted dark:bg-muted text-xs text-gray-300 rounded"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* Errors */}
            {scraper.errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs font-medium text-red-400 mb-2">Errors:</p>
                <ul className="space-y-1">
                  {scraper.errors.map((error, idx) => (
                    <li key={idx} className="text-xs text-red-300">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
