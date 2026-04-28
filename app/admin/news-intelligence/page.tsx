'use client';
/**
 * News Intelligence Admin Dashboard
 *
 * 3-panel real-time dashboard:
 *   Panel 1: Live event feed (last 48h, refreshes every 30s)
 *   Panel 2: SERP credit meter (today's budget vs used)
 *   Panel 3: Source health grid (all sources + add form)
 */

import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface NewsEvent {
  id: string;
  headline: string;
  category: string;
  source_name: string;
  importance_score: number;
  trends_spike: boolean;
  gsc_spike: boolean;
  internal_spike: boolean;
  spike_count: number;
  serp_credit_used: boolean;
  status: string;
  article_id: string | null;
  detected_at: string;
  published_at: string | null;
  skip_reason: string | null;
}

interface NewsSource {
  id: string;
  name: string;
  type: string;
  active: boolean;
  last_polled_at: string | null;
  error_count: number;
  last_error: string | null;
  category_tags: string[];
  base_importance: number;
  poll_interval_m: number;
}

interface CreditData {
  daily_budget: number;
  news_used: number;
}

const STATUS_COLORS: Record<string, string> = {
  detected: 'bg-gray-100 text-gray-700 border-gray-200',
  screening: 'bg-blue-50 text-blue-700 border-blue-200',
  analyzing: 'bg-amber-50 text-amber-700 border-amber-200',
  writing: 'bg-orange-50 text-orange-700 border-orange-200',
  editing: 'bg-purple-50 text-purple-700 border-purple-200',
  publishing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  published: 'bg-green-50 text-green-700 border-green-200',
  skipped: 'bg-red-50 text-red-600 border-red-200',
};

const CATEGORY_COLORS: Record<string, string> = {
  repo_rate: 'bg-red-100 text-red-700',
  da_announcement: 'bg-amber-100 text-amber-700',
  lpg: 'bg-orange-100 text-orange-700',
  fuel_price: 'bg-orange-100 text-orange-700',
  gold_silver: 'bg-yellow-100 text-yellow-800',
  tax_change: 'bg-purple-100 text-purple-700',
  budget: 'bg-indigo-100 text-indigo-700',
  mutual_fund: 'bg-blue-100 text-blue-700',
  ipo: 'bg-cyan-100 text-cyan-700',
  banking: 'bg-teal-100 text-teal-700',
  insurance_regulation: 'bg-green-100 text-green-700',
  epfo: 'bg-lime-100 text-lime-700',
  markets: 'bg-pink-100 text-pink-700',
  general_finance: 'bg-gray-100 text-gray-600',
};

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

function ImportanceDot({ score }: { score: number }) {
  const color =
    score >= 8
      ? 'bg-red-500'
      : score >= 6
      ? 'bg-amber-500'
      : score >= 4
      ? 'bg-yellow-400'
      : 'bg-gray-300';
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${color} mr-1`} title={`Importance: ${score}`} />
  );
}

export default function NewsIntelligencePage() {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [credits, setCredits] = useState<CreditData>({ daily_budget: 10, news_used: 0 });
  const [loading, setLoading] = useState(true);
  const [addingSource, setAddingSource] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    type: 'rss',
    url: '',
    base_importance: 5,
    poll_interval_m: 15,
    category_tags: '',
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/news-intelligence');
      if (!res.ok) return;
      const data = await res.json();
      setEvents(data.events ?? []);
      setSources(data.sources ?? []);
      setCredits(data.credits ?? { daily_budget: 10, news_used: 0 });
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleForce = async (id: string) => {
    await fetch(`/api/admin/news-events/${id}/force`, { method: 'POST' });
    await fetchData();
  };

  const handleSkip = async (id: string) => {
    await fetch(`/api/admin/news-events/${id}/skip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Dismissed by admin' }),
    });
    await fetchData();
  };

  const handleAddSource = async () => {
    const tags = newSource.category_tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    await fetch('/api/admin/news-sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newSource, category_tags: tags }),
    });
    setAddingSource(false);
    setNewSource({ name: '', type: 'rss', url: '', base_importance: 5, poll_interval_m: 15, category_tags: '' });
    await fetchData();
  };

  const handleToggleSource = async (id: string, active: boolean) => {
    await fetch(`/api/admin/news-sources/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    await fetchData();
  };

  const remaining = credits.daily_budget - credits.news_used;
  const creditPct = credits.daily_budget > 0
    ? Math.round((credits.news_used / credits.daily_budget) * 100)
    : 0;

  const filteredEvents =
    filterStatus === 'all' ? events : events.filter((e) => e.status === filterStatus);

  const statusCounts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 font-mono text-sm animate-pulse">Loading news intelligence…</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            News Intelligence
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Live event feed · SERP credits · Source health ·{' '}
            <span className="text-gray-400">Updated {relTime(lastRefresh.toISOString())}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="text-xs font-mono bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
            {events.filter((e) => e.status === 'published').length} published today
          </div>
          <div className="text-xs font-mono bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200">
            {events.filter((e) => !['published', 'skipped'].includes(e.status)).length} in pipeline
          </div>
        </div>
      </div>

      {/* ── SERP Credit Meter ─────────────────────────────────────────── */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono text-gray-500 uppercase tracking-wide">
            SERP Credits — Today
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  creditPct > 80 ? 'bg-red-500' : creditPct > 50 ? 'bg-amber-400' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, creditPct)}%` }}
              />
            </div>
            <span className="font-mono text-sm text-gray-700 whitespace-nowrap shrink-0">
              <span className="font-bold">{credits.news_used}</span> / {credits.daily_budget} used ·{' '}
              <span className={remaining > 3 ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>
                {remaining} remaining
              </span>
            </span>
          </div>
          <div className="flex gap-4 text-xs text-gray-400 font-mono">
            <span>Breaking reserve: 4 (importance 9-10)</span>
            <span>·</span>
            <span>Spike confirmed: 4 (score 7-8, 2+ signals)</span>
            <span>·</span>
            <span>Float: 2</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Live Event Feed ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">
            Events{' '}
            <span className="text-gray-400 font-normal text-sm">(last 48h · {events.length} total)</span>
          </h2>
          {/* Status filter tabs */}
          <div className="flex gap-1 flex-wrap">
            {['all', 'analyzing', 'writing', 'editing', 'publishing', 'published', 'skipped'].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    filterStatus === s
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {s} {s !== 'all' && statusCounts[s] ? `(${statusCounts[s]})` : ''}
                </button>
              )
            )}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No events{filterStatus !== 'all' ? ` with status "${filterStatus}"` : ''}.
            {filterStatus === 'all' && ' News sources are polled every 15 minutes.'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="border border-gray-200 rounded-xl p-4 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Headline row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <ImportanceDot score={ev.importance_score} />
                      <p className="font-medium text-gray-900 text-sm leading-snug">
                        {ev.headline}
                      </p>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <span className="text-xs text-gray-400">{ev.source_name}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{relTime(ev.detected_at)}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                          CATEGORY_COLORS[ev.category] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {ev.category}
                      </span>
                      <span className="text-xs font-mono text-amber-700">
                        ⚡ {ev.importance_score}
                      </span>
                    </div>

                    {/* Spike signals */}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span
                        className={`text-xs ${ev.trends_spike ? 'text-green-600 font-medium' : 'text-gray-300'}`}
                      >
                        📈 Trends {ev.trends_spike ? '✓' : '✗'}
                      </span>
                      <span
                        className={`text-xs ${ev.gsc_spike ? 'text-green-600 font-medium' : 'text-gray-300'}`}
                      >
                        🔍 GSC {ev.gsc_spike ? '✓' : '✗'}
                      </span>
                      <span
                        className={`text-xs ${ev.internal_spike ? 'text-green-600 font-medium' : 'text-gray-300'}`}
                      >
                        📊 Internal {ev.internal_spike ? '✓' : '✗'}
                      </span>
                      {ev.serp_credit_used && (
                        <span className="text-xs text-purple-600 font-medium">SERP credit used</span>
                      )}
                    </div>

                    {/* Skip reason */}
                    {ev.skip_reason && (
                      <p className="text-xs text-red-500 mt-1 italic">{ev.skip_reason}</p>
                    )}
                  </div>

                  {/* Right column: status + actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                        STATUS_COLORS[ev.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {ev.status}
                    </span>
                    <div className="flex gap-1">
                      {ev.article_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2.5"
                          asChild
                        >
                          <a href={`/admin/articles/${ev.article_id}`} target="_blank" rel="noreferrer">
                            View ↗
                          </a>
                        </Button>
                      )}
                      {['detected', 'screening', 'skipped'].includes(ev.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2.5 text-green-700 hover:bg-green-50"
                          onClick={() => handleForce(ev.id)}
                        >
                          Force ▶
                        </Button>
                      )}
                      {!['published', 'skipped'].includes(ev.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2.5 text-red-500 hover:bg-red-50"
                          onClick={() => handleSkip(ev.id)}
                        >
                          Skip ✕
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Source Health Grid ────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">
            Sources{' '}
            <span className="text-gray-400 font-normal text-sm">
              ({sources.filter((s) => s.active).length} active · {sources.filter((s) => !s.active).length} disabled)
            </span>
          </h2>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8"
            onClick={() => setAddingSource((v) => !v)}
          >
            {addingSource ? '✕ Cancel' : '+ Add Source'}
          </Button>
        </div>

        {/* Add source form */}
        {addingSource && (
          <Card className="border-dashed border-gray-300">
            <CardContent className="pt-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Source name (e.g. PPAC LPG Prices)"
                  value={newSource.name}
                  onChange={(e) => setNewSource((s) => ({ ...s, name: e.target.value }))}
                />
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                  value={newSource.type}
                  onChange={(e) => setNewSource((s) => ({ ...s, type: e.target.value }))}
                >
                  <option value="rss">RSS Feed</option>
                  <option value="price_poll">Price Poll API</option>
                  <option value="scrape">Web Scrape</option>
                </select>
                <Input
                  placeholder="URL (RSS feed or API endpoint)"
                  className="col-span-2"
                  value={newSource.url}
                  onChange={(e) => setNewSource((s) => ({ ...s, url: e.target.value }))}
                />
                <Input
                  placeholder="Category tags (comma-separated: lpg,fuel_price)"
                  value={newSource.category_tags}
                  onChange={(e) => setNewSource((s) => ({ ...s, category_tags: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Importance (1-10)"
                    min={1}
                    max={10}
                    value={newSource.base_importance}
                    onChange={(e) => setNewSource((s) => ({ ...s, base_importance: +e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Poll interval (min)"
                    value={newSource.poll_interval_m}
                    onChange={(e) => setNewSource((s) => ({ ...s, poll_interval_m: +e.target.value }))}
                  />
                </div>
                <Button
                  onClick={handleAddSource}
                  disabled={!newSource.name || !newSource.url}
                  className="col-span-2 bg-green-700 hover:bg-green-800 text-white"
                >
                  Add Source
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Source cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sources.map((src) => (
            <div
              key={src.id}
              className={`border rounded-xl p-3.5 transition-all ${
                src.active
                  ? src.error_count > 0
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-gray-200 bg-white'
                  : 'border-gray-100 bg-gray-50 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{src.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                        src.type === 'rss'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-orange-50 text-orange-600'
                      }`}
                    >
                      {src.type}
                    </span>
                    <span className="text-xs text-gray-400">⚡{src.base_importance}</span>
                    <span className="text-xs text-gray-400">{src.poll_interval_m}m</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs h-6 px-2 shrink-0 ${src.active ? 'text-gray-500 hover:text-red-500' : 'text-green-600 hover:text-green-700'}`}
                  onClick={() => handleToggleSource(src.id, src.active)}
                >
                  {src.active ? 'Disable' : 'Enable'}
                </Button>
              </div>

              {src.last_polled_at && (
                <p className="text-xs text-gray-400 mt-1.5">
                  Polled {relTime(src.last_polled_at)}
                </p>
              )}
              {!src.last_polled_at && (
                <p className="text-xs text-gray-400 mt-1.5 italic">Never polled</p>
              )}
              {src.error_count > 0 && (
                <p className="text-xs text-amber-700 mt-1">
                  ⚠ {src.error_count} error{src.error_count > 1 ? 's' : ''} ·{' '}
                  <span className="text-amber-600 truncate">{src.last_error?.substring(0, 40)}</span>
                </p>
              )}
              {src.category_tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {src.category_tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                      {tag}
                    </span>
                  ))}
                  {src.category_tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{src.category_tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
