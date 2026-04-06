/**
 * SVG Infographic Templates
 *
 * Three reusable infographic layouts:
 * 1. Process/Steps — vertical numbered flow
 * 2. Comparison — side-by-side columns
 * 3. Stats/Numbers — grid of key statistics
 *
 * All produce pure SVG strings with InvestingPro branding.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StepItem {
  title: string;
  description: string;
}

export interface ProcessInfographicInput {
  title: string;
  steps: StepItem[];
  footnote?: string;
}

export interface ComparisonColumn {
  heading: string;
  points: string[];
  highlight?: boolean;
}

export interface ComparisonInfographicInput {
  title: string;
  columns: [ComparisonColumn, ComparisonColumn];
  verdict?: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon?: string; // optional single emoji/character
}

export interface StatsInfographicInput {
  title: string;
  subtitle?: string;
  stats: StatItem[];
}

export type InfographicInput =
  | { type: "process"; data: ProcessInfographicInput }
  | { type: "comparison"; data: ComparisonInfographicInput }
  | { type: "stats"; data: StatsInfographicInput };

// ---------------------------------------------------------------------------
// Brand constants
// ---------------------------------------------------------------------------

const B = {
  green900: "#14532d",
  green700: "#15803d",
  green600: "#166534",
  greenLight: "#16A34A",
  gold: "#D97706",
  goldLight: "#FEF3C7",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function trunc(text: string, max: number): string {
  return text.length <= max ? text : text.substring(0, max - 2) + "..";
}

function watermark(width: number, y: number): string {
  return `<text x="${width - 40}" y="${y}" text-anchor="end" fill="${B.green600}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" opacity="0.5">investingpro.in</text>`;
}

// ---------------------------------------------------------------------------
// 1. Process / Steps Infographic
// ---------------------------------------------------------------------------

function generateProcessInfographic(input: ProcessInfographicInput): string {
  const { title, steps, footnote } = input;
  const MAX_STEPS = 8;
  const displaySteps = steps.slice(0, MAX_STEPS);

  const WIDTH = 800;
  const HEADER_H = 100;
  const STEP_H = 90;
  const FOOTER_H = 60;
  const HEIGHT = HEADER_H + displaySteps.length * STEP_H + FOOTER_H + 20;

  const stepsSvg = displaySteps
    .map((step, i) => {
      const y = HEADER_H + i * STEP_H + 20;
      const circleY = y + 24;
      const isLast = i === displaySteps.length - 1;

      return `
    <!-- Step ${i + 1} -->
    ${!isLast ? `<line x1="80" y1="${circleY + 18}" x2="80" y2="${circleY + STEP_H - 8}" stroke="${B.green700}" stroke-width="2" stroke-dasharray="4 4" opacity="0.3"/>` : ""}
    <circle cx="80" cy="${circleY}" r="18" fill="${B.green600}"/>
    <text x="80" y="${circleY + 5}" text-anchor="middle" fill="${B.white}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700">${i + 1}</text>
    <text x="115" y="${circleY - 2}" fill="${B.gray900}" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="700">${esc(trunc(step.title, 50))}</text>
    <text x="115" y="${circleY + 22}" fill="${B.gray500}" font-family="system-ui, -apple-system, sans-serif" font-size="13">${esc(trunc(step.description, 75))}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${B.white}" rx="12"/>

  <!-- Header -->
  <rect width="${WIDTH}" height="${HEADER_H}" fill="${B.green900}" rx="12"/>
  <rect x="0" y="12" width="${WIDTH}" height="${HEADER_H - 12}" fill="${B.green900}"/>
  <text x="60" y="60" fill="${B.white}" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="800" letter-spacing="-0.5">${esc(trunc(title, 50))}</text>
  <rect x="60" y="74" width="40" height="3" rx="1.5" fill="${B.gold}"/>

  ${stepsSvg}

  ${footnote ? `<text x="${WIDTH / 2}" y="${HEIGHT - FOOTER_H + 10}" text-anchor="middle" fill="${B.gray500}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-style="italic">${esc(trunc(footnote, 80))}</text>` : ""}

  ${watermark(WIDTH, HEIGHT - 16)}
  <rect x="0" y="${HEIGHT - 4}" width="${WIDTH}" height="4" fill="${B.gold}" opacity="0.5" rx="0"/>
</svg>`;
}

// ---------------------------------------------------------------------------
// 2. Comparison Infographic (side-by-side)
// ---------------------------------------------------------------------------

function generateComparisonInfographic(
  input: ComparisonInfographicInput,
): string {
  const { title, columns, verdict } = input;
  const [left, right] = columns;

  const WIDTH = 1000;
  const HEADER_H = 100;
  const COL_HEADER_H = 50;
  const POINT_H = 36;
  const maxPoints = Math.max(left.points.length, right.points.length, 1);
  const BODY_H = COL_HEADER_H + maxPoints * POINT_H + 30;
  const VERDICT_H = verdict ? 60 : 0;
  const FOOTER_H = 50;
  const HEIGHT = HEADER_H + BODY_H + VERDICT_H + FOOTER_H;

  const COL_W = (WIDTH - 80) / 2; // 60 padding + 20 gap
  const LEFT_X = 40;
  const RIGHT_X = LEFT_X + COL_W + 20;

  function renderColumn(col: ComparisonColumn, x: number): string {
    const headerY = HEADER_H + 10;
    const hl = col.highlight;
    const headerBg = hl ? B.green600 : B.gray100;
    const headerFg = hl ? B.white : B.gray900;

    const pointsSvg = col.points
      .slice(0, 8)
      .map((p, i) => {
        const py = headerY + COL_HEADER_H + 16 + i * POINT_H;
        return `
      <circle cx="${x + 20}" cy="${py}" r="4" fill="${hl ? B.greenLight : B.gray500}"/>
      <text x="${x + 34}" y="${py + 4}" fill="${B.gray700}" font-family="system-ui, -apple-system, sans-serif" font-size="13">${esc(trunc(p, 48))}</text>`;
      })
      .join("");

    return `
    <rect x="${x}" y="${headerY}" width="${COL_W}" height="${COL_HEADER_H}" rx="8" fill="${headerBg}"/>
    <text x="${x + COL_W / 2}" y="${headerY + COL_HEADER_H / 2 + 6}" text-anchor="middle" fill="${headerFg}" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700">${esc(trunc(col.heading, 30))}</text>
    ${pointsSvg}`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${B.white}" rx="12"/>

  <!-- Header -->
  <rect width="${WIDTH}" height="${HEADER_H}" fill="${B.green900}" rx="12"/>
  <rect x="0" y="12" width="${WIDTH}" height="${HEADER_H - 12}" fill="${B.green900}"/>
  <text x="${WIDTH / 2}" y="55" text-anchor="middle" fill="${B.white}" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="800">${esc(trunc(title, 50))}</text>
  <rect x="${WIDTH / 2 - 20}" y="68" width="40" height="3" rx="1.5" fill="${B.gold}"/>

  <!-- VS divider -->
  <line x1="${WIDTH / 2}" y1="${HEADER_H + 10}" x2="${WIDTH / 2}" y2="${HEADER_H + BODY_H}" stroke="${B.gray200}" stroke-width="1" stroke-dasharray="6 4"/>
  <circle cx="${WIDTH / 2}" cy="${HEADER_H + 35}" r="16" fill="${B.gold}"/>
  <text x="${WIDTH / 2}" y="${HEADER_H + 40}" text-anchor="middle" fill="${B.white}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800">VS</text>

  ${renderColumn(left, LEFT_X)}
  ${renderColumn(right, RIGHT_X)}

  ${
    verdict
      ? `<!-- Verdict -->
  <rect x="40" y="${HEADER_H + BODY_H + 10}" width="${WIDTH - 80}" height="40" rx="8" fill="${B.goldLight}"/>
  <text x="${WIDTH / 2}" y="${HEADER_H + BODY_H + 36}" text-anchor="middle" fill="${B.gray900}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600">${esc(trunc(verdict, 80))}</text>`
      : ""
  }

  ${watermark(WIDTH, HEIGHT - 14)}
  <rect x="0" y="${HEIGHT - 4}" width="${WIDTH}" height="4" fill="${B.gold}" opacity="0.5"/>
</svg>`;
}

// ---------------------------------------------------------------------------
// 3. Stats / Numbers Infographic
// ---------------------------------------------------------------------------

function generateStatsInfographic(input: StatsInfographicInput): string {
  const { title, subtitle, stats } = input;

  const WIDTH = 1000;
  const HEADER_H = 110;
  const FOOTER_H = 50;
  const COLS = Math.min(stats.length, 3);
  const ROWS = Math.ceil(Math.min(stats.length, 9) / COLS);
  const CELL_W = (WIDTH - 80 - (COLS - 1) * 20) / COLS;
  const CELL_H = 120;
  const GRID_H = ROWS * CELL_H + (ROWS - 1) * 16;
  const HEIGHT = HEADER_H + GRID_H + FOOTER_H + 40;

  const displayStats = stats.slice(0, 9);

  const cells = displayStats
    .map((stat, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = 40 + col * (CELL_W + 20);
      const y = HEADER_H + 20 + row * (CELL_H + 16);

      return `
    <!-- Stat ${i + 1} -->
    <rect x="${x}" y="${y}" width="${CELL_W}" height="${CELL_H}" rx="10" fill="${B.gray50}" stroke="${B.gray200}" stroke-width="1"/>
    ${stat.icon ? `<text x="${x + CELL_W / 2}" y="${y + 30}" text-anchor="middle" font-size="20">${esc(stat.icon)}</text>` : ""}
    <text x="${x + CELL_W / 2}" y="${y + (stat.icon ? 68 : 52)}" text-anchor="middle" fill="${B.green600}" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800">${esc(trunc(stat.value, 15))}</text>
    <text x="${x + CELL_W / 2}" y="${y + (stat.icon ? 92 : 78)}" text-anchor="middle" fill="${B.gray500}" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500">${esc(trunc(stat.label, 30))}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${B.white}" rx="12"/>

  <!-- Header -->
  <rect width="${WIDTH}" height="${HEADER_H}" fill="${B.green900}" rx="12"/>
  <rect x="0" y="12" width="${WIDTH}" height="${HEADER_H - 12}" fill="${B.green900}"/>
  <text x="${WIDTH / 2}" y="50" text-anchor="middle" fill="${B.white}" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="800">${esc(trunc(title, 50))}</text>
  <rect x="${WIDTH / 2 - 20}" y="62" width="40" height="3" rx="1.5" fill="${B.gold}"/>
  ${subtitle ? `<text x="${WIDTH / 2}" y="88" text-anchor="middle" fill="${B.white}" font-family="system-ui, -apple-system, sans-serif" font-size="14" opacity="0.7">${esc(trunc(subtitle, 60))}</text>` : ""}

  ${cells}

  ${watermark(WIDTH, HEIGHT - 14)}
  <rect x="0" y="${HEIGHT - 4}" width="${WIDTH}" height="4" fill="${B.gold}" opacity="0.5"/>
</svg>`;
}

// ---------------------------------------------------------------------------
// Unified export
// ---------------------------------------------------------------------------

/**
 * Generate an infographic SVG from structured data.
 */
export function generateInfographic(input: InfographicInput): string {
  switch (input.type) {
    case "process":
      return generateProcessInfographic(input.data);
    case "comparison":
      return generateComparisonInfographic(input.data);
    case "stats":
      return generateStatsInfographic(input.data);
  }
}

// Also export individual generators for direct use
export {
  generateProcessInfographic,
  generateComparisonInfographic,
  generateStatsInfographic,
};
