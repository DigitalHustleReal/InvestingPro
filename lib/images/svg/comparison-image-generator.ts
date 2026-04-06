/**
 * SVG Comparison Table Image Generator
 *
 * Generates shareable comparison table images as pure SVG.
 * Clean table layout with green header row, alternating white/gray rows,
 * InvestingPro.in watermark.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ComparisonImageInput {
  title: string;
  headers: string[];
  rows: Array<{ name: string; values: string[] }>;
}

// ---------------------------------------------------------------------------
// Brand constants
// ---------------------------------------------------------------------------

const BRAND = {
  green900: "#14532d",
  green700: "#15803d",
  green600: "#166534",
  greenLight: "#16A34A",
  gold: "#D97706",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray700: "#374151",
  gray900: "#111827",
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen - 2) + "..";
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

/**
 * Generate a branded comparison table image as SVG.
 *
 * Width is fixed at 1200. Height adapts to row count.
 * Max 10 rows displayed; additional rows show a "+N more" note.
 */
export function generateComparisonImage(input: ComparisonImageInput): string {
  const { title, headers, rows } = input;

  const PADDING_X = 60;
  const TITLE_HEIGHT = 100;
  const ROW_HEIGHT = 48;
  const HEADER_HEIGHT = 52;
  const FOOTER_HEIGHT = 60;
  const MAX_ROWS = 10;

  const displayRows = rows.slice(0, MAX_ROWS);
  const overflowCount = Math.max(0, rows.length - MAX_ROWS);

  const tableHeight = HEADER_HEIGHT + displayRows.length * ROW_HEIGHT;
  const totalHeight = TITLE_HEIGHT + tableHeight + FOOTER_HEIGHT + 40;
  const WIDTH = 1200;

  // Column widths: first column (name) gets 30%, rest split evenly
  const totalCols = headers.length;
  const tableWidth = WIDTH - PADDING_X * 2;
  const nameColWidth = Math.floor(tableWidth * 0.3);
  const valueColWidth =
    totalCols > 1
      ? Math.floor((tableWidth - nameColWidth) / (totalCols - 1))
      : 0;

  function colX(colIndex: number): number {
    if (colIndex === 0) return PADDING_X;
    return PADDING_X + nameColWidth + (colIndex - 1) * valueColWidth;
  }

  function colWidth(colIndex: number): number {
    return colIndex === 0 ? nameColWidth : valueColWidth;
  }

  // Build header cells
  const headerCells = headers
    .map((h, i) => {
      const x = colX(i);
      const textX = x + 16;
      const maxChars = Math.floor(colWidth(i) / 10);
      return `<text x="${textX}" y="${TITLE_HEIGHT + HEADER_HEIGHT / 2 + 5}" fill="${BRAND.white}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700">${escapeXml(truncate(h, maxChars))}</text>`;
    })
    .join("\n    ");

  // Build data rows
  const dataRows = displayRows
    .map((row, ri) => {
      const y = TITLE_HEIGHT + HEADER_HEIGHT + ri * ROW_HEIGHT;
      const bgColor = ri % 2 === 0 ? BRAND.white : BRAND.gray50;
      const allValues = [row.name, ...row.values];

      const cells = allValues
        .map((val, ci) => {
          if (ci >= totalCols) return "";
          const textX = colX(ci) + 16;
          const maxChars = Math.floor(colWidth(ci) / 9);
          const fontWeight = ci === 0 ? "600" : "400";
          const fill = ci === 0 ? BRAND.gray900 : BRAND.gray700;
          return `<text x="${textX}" y="${y + ROW_HEIGHT / 2 + 5}" fill="${fill}" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="${fontWeight}">${escapeXml(truncate(val, maxChars))}</text>`;
        })
        .filter(Boolean)
        .join("\n      ");

      return `
    <!-- Row ${ri} -->
    <rect x="${PADDING_X}" y="${y}" width="${tableWidth}" height="${ROW_HEIGHT}" fill="${bgColor}"/>
    <line x1="${PADDING_X}" y1="${y + ROW_HEIGHT}" x2="${PADDING_X + tableWidth}" y2="${y + ROW_HEIGHT}" stroke="${BRAND.gray200}" stroke-width="1"/>
    ${cells}`;
    })
    .join("");

  const overflowNote =
    overflowCount > 0
      ? `<text x="${WIDTH / 2}" y="${TITLE_HEIGHT + HEADER_HEIGHT + displayRows.length * ROW_HEIGHT + 28}" text-anchor="middle" fill="${BRAND.gray700}" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-style="italic">+${overflowCount} more rows on investingpro.in</text>`
      : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${totalHeight}" width="${WIDTH}" height="${totalHeight}">
  <!-- Background -->
  <rect width="${WIDTH}" height="${totalHeight}" fill="${BRAND.white}"/>

  <!-- Title bar -->
  <rect width="${WIDTH}" height="${TITLE_HEIGHT}" fill="${BRAND.green900}"/>
  <text x="${PADDING_X}" y="58" fill="${BRAND.white}" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="800" letter-spacing="-0.5">${escapeXml(truncate(title, 60))}</text>
  <rect x="${PADDING_X}" y="72" width="40" height="3" rx="1.5" fill="${BRAND.gold}"/>

  <!-- Table header -->
  <rect x="${PADDING_X}" y="${TITLE_HEIGHT}" width="${tableWidth}" height="${HEADER_HEIGHT}" fill="${BRAND.green600}"/>
  ${headerCells}

  <!-- Data rows -->
  ${dataRows}

  ${overflowNote}

  <!-- Footer / watermark -->
  <rect x="0" y="${totalHeight - FOOTER_HEIGHT}" width="${WIDTH}" height="${FOOTER_HEIGHT}" fill="${BRAND.gray50}"/>
  <line x1="0" y1="${totalHeight - FOOTER_HEIGHT}" x2="${WIDTH}" y2="${totalHeight - FOOTER_HEIGHT}" stroke="${BRAND.gray200}" stroke-width="1"/>
  <text x="${WIDTH - PADDING_X}" y="${totalHeight - FOOTER_HEIGHT / 2 + 5}" text-anchor="end" fill="${BRAND.green600}" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600">investingpro.in</text>
  <rect x="${PADDING_X}" y="${totalHeight - FOOTER_HEIGHT / 2 - 1}" width="8" height="8" rx="4" fill="${BRAND.gold}"/>
  <text x="${PADDING_X + 16}" y="${totalHeight - FOOTER_HEIGHT / 2 + 5}" fill="${BRAND.gray700}" font-family="system-ui, -apple-system, sans-serif" font-size="12">Compare smarter. Invest better.</text>

  <!-- Bottom accent -->
  <rect x="0" y="${totalHeight - 4}" width="${WIDTH}" height="4" fill="${BRAND.gold}" opacity="0.6"/>
</svg>`;
}
