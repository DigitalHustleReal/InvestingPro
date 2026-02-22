/**
 * Chart Theme
 *
 * Single source of truth for all chart colors and shared style configs.
 * Works with both Chart.js and Recharts.
 *
 * Brand palette:
 *   primary  — Teal  #14B8A6  (brand primary)
 *   secondary — Indigo #6366F1
 *   positive — Emerald #10B981
 *   warning  — Amber  #F59E0B
 *   negative  — Rose  #F43F5E
 *   neutral  — Slate  #64748B
 */

// ─── Core palette ────────────────────────────────────────────────────────────

export const CHART_COLORS = {
    /** Brand teal — primary data series */
    primary:   '#14B8A6',
    /** Indigo — secondary series */
    secondary: '#6366F1',
    /** Emerald — positive / growth */
    positive:  '#10B981',
    /** Amber — caution / interest / warning */
    warning:   '#F59E0B',
    /** Rose — negative / loss */
    negative:  '#F43F5E',
    /** Slate — neutral / muted */
    neutral:   '#64748B',
} as const;

/** Ordered sequence for multi-series charts (Pie cells, stacked bars, etc.) */
export const CHART_PALETTE: string[] = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.positive,
    CHART_COLORS.warning,
    CHART_COLORS.negative,
    CHART_COLORS.neutral,
];

// ─── Alpha variants ───────────────────────────────────────────────────────────

export const CHART_COLORS_ALPHA = {
    primary:   'rgba(20, 184, 166, 0.2)',
    secondary: 'rgba(99, 102, 241, 0.2)',
    positive:  'rgba(16, 185, 129, 0.2)',
    warning:   'rgba(245, 158, 11, 0.2)',
    negative:  'rgba(244, 63, 94, 0.2)',
    neutral:   'rgba(100, 116, 139, 0.1)',
} as const;

// ─── Recharts shared props ────────────────────────────────────────────────────

/** Drop this into all <Tooltip> contentStyle props */
export const RECHARTS_TOOLTIP_STYLE: React.CSSProperties = {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '12px',
};

/** Drop this into all <CartesianGrid> stroke props */
export const RECHARTS_GRID_STROKE = 'rgba(255,255,255,0.06)';

/** Drop this into axis tick fill props */
export const RECHARTS_TICK_FILL = '#64748b';

// ─── Chart.js shared defaults ─────────────────────────────────────────────────

/** Shared tooltip plugin config for Chart.js datasets */
export const CHARTJS_TOOLTIP_DEFAULTS = {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    padding: 12,
    cornerRadius: 12,
    titleFont: { size: 12, weight: 'bold' as const },
    bodyFont: { size: 12 },
} as const;

/** Grid line color for Chart.js scales */
export const CHARTJS_GRID_COLOR = 'rgba(0, 0, 0, 0.06)';

// ─── React import needed by inline type ──────────────────────────────────────
import type React from 'react';
