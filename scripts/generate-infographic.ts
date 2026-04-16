/**
 * InvestingPro Infographic Generator
 * Generates branded HTML infographics and screenshots them as PNG
 * Usage: npx tsx scripts/generate-infographic.ts
 */

// Infographic templates — called by article pipeline
export const BRAND = {
  primary: "#166534",
  primaryLight: "#16A34A",
  accent: "#D97706",
  bg: "#FFFFFF",
  cardBg: "#F0FDF4",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
  font: "'Inter', -apple-system, sans-serif",
  fontDisplay: "'Outfit', 'Inter', sans-serif",
};

export function comparisonTableHTML(
  title: string,
  headers: string[],
  rows: string[][],
  highlightCol?: number,
  footer?: string,
): string {
  const headerCells = headers
    .map(
      (h, i) =>
        `<th style="padding:14px 18px;text-align:${i === 0 ? "left" : "center"};font-size:14px;font-weight:700;color:white;background:${BRAND.primary};${i === 0 ? "border-radius:8px 0 0 0" : ""}${i === headers.length - 1 ? "border-radius:0 8px 0 0" : ""}">${h}</th>`,
    )
    .join("");

  const bodyRows = rows
    .map(
      (row, ri) =>
        `<tr style="background:${ri % 2 === 0 ? BRAND.cardBg : BRAND.bg}">${row
          .map(
            (cell, ci) =>
              `<td style="padding:12px 18px;text-align:${ci === 0 ? "left" : "center"};font-size:14px;color:${BRAND.text};${highlightCol === ci ? `font-weight:700;color:${BRAND.primary}` : ""};border-bottom:1px solid ${BRAND.border}">${cell}</td>`,
          )
          .join("")}</tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:40px;background:${BRAND.bg};font-family:${BRAND.font}">
  <div style="max-width:800px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.primaryLight});padding:28px 32px;display:flex;align-items:center;gap:16px">
      <div style="width:40px;height:40px;background:white;border-radius:10px;display:flex;align-items:center;justify-content:center">
        <span style="font-size:20px;font-weight:800;color:${BRAND.primary}">IP</span>
      </div>
      <div>
        <h1 style="margin:0;font-family:${BRAND.fontDisplay};font-size:22px;color:white;font-weight:700">${title}</h1>
        <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.8)">InvestingPro.in</p>
      </div>
    </div>

    <!-- Table -->
    <div style="padding:24px 32px">
      <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden">
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
      ${footer ? `<p style="margin:16px 0 0;font-size:12px;color:${BRAND.textLight};text-align:center">${footer}</p>` : ""}
    </div>

    <!-- Footer -->
    <div style="background:${BRAND.cardBg};padding:12px 32px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${BRAND.border}">
      <span style="font-size:11px;color:${BRAND.textLight}">Source: InvestingPro.in | Data as of April 2026</span>
      <span style="font-size:11px;font-weight:600;color:${BRAND.primary}">investingpro.in</span>
    </div>
  </div>
</body>
</html>`;
}

export function statsCardHTML(
  title: string,
  stats: { label: string; value: string; highlight?: boolean }[],
  subtitle?: string,
): string {
  const statCards = stats
    .map(
      (s) => `
      <div style="flex:1;min-width:140px;padding:20px;background:${s.highlight ? BRAND.primary : BRAND.cardBg};border-radius:12px;text-align:center">
        <p style="margin:0 0 4px;font-size:28px;font-weight:700;color:${s.highlight ? "white" : BRAND.primary};font-family:${BRAND.fontDisplay}">${s.value}</p>
        <p style="margin:0;font-size:13px;color:${s.highlight ? "rgba(255,255,255,0.85)" : BRAND.textLight}">${s.label}</p>
      </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:40px;background:${BRAND.bg};font-family:${BRAND.font}">
  <div style="max-width:700px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.primaryLight});padding:24px 32px;text-align:center">
      <h1 style="margin:0;font-family:${BRAND.fontDisplay};font-size:22px;color:white">${title}</h1>
      ${subtitle ? `<p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85)">${subtitle}</p>` : ""}
    </div>
    <div style="padding:24px 32px;display:flex;gap:16px;flex-wrap:wrap">
      ${statCards}
    </div>
    <div style="background:${BRAND.cardBg};padding:10px 32px;text-align:right;border-top:1px solid ${BRAND.border}">
      <span style="font-size:11px;font-weight:600;color:${BRAND.primary}">investingpro.in</span>
    </div>
  </div>
</body>
</html>`;
}

export function stepsFlowHTML(
  title: string,
  steps: { step: string; title: string; desc: string }[],
): string {
  const stepCards = steps
    .map(
      (s, i) => `
      <div style="display:flex;gap:16px;align-items:flex-start;${i < steps.length - 1 ? "padding-bottom:20px;border-left:3px solid " + BRAND.primaryLight + ";margin-left:19px;padding-left:28px" : "margin-left:19px;padding-left:28px"}">
        <div style="width:40px;height:40px;background:${BRAND.primary};border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:-48px">
          <span style="color:white;font-weight:700;font-size:16px">${s.step}</span>
        </div>
        <div>
          <h3 style="margin:0 0 4px;font-size:16px;font-weight:700;color:${BRAND.text}">${s.title}</h3>
          <p style="margin:0;font-size:14px;color:${BRAND.textLight};line-height:1.5">${s.desc}</p>
        </div>
      </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:40px;background:${BRAND.bg};font-family:${BRAND.font}">
  <div style="max-width:650px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.primaryLight});padding:24px 32px;text-align:center">
      <h1 style="margin:0;font-family:${BRAND.fontDisplay};font-size:22px;color:white">${title}</h1>
    </div>
    <div style="padding:32px 32px 24px">
      ${stepCards}
    </div>
    <div style="background:${BRAND.cardBg};padding:10px 32px;text-align:right;border-top:1px solid ${BRAND.border}">
      <span style="font-size:11px;font-weight:600;color:${BRAND.primary}">investingpro.in</span>
    </div>
  </div>
</body>
</html>`;
}

export function socialCardHTML(
  title: string,
  subtitle: string,
  stat?: string,
  platform: "twitter" | "linkedin" | "instagram" = "twitter",
): string {
  const dimensions = {
    twitter: { w: 1200, h: 628 },
    linkedin: { w: 1200, h: 627 },
    instagram: { w: 1080, h: 1080 },
  };
  const { w, h } = dimensions[platform];

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#000;font-family:${BRAND.font}">
  <div style="width:${w}px;height:${h}px;background:linear-gradient(135deg,#0A1F14 0%,${BRAND.primary} 50%,${BRAND.primaryLight} 100%);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px;box-sizing:border-box;position:relative">
    <!-- Logo -->
    <div style="position:absolute;top:40px;left:40px;display:flex;align-items:center;gap:12px">
      <div style="width:44px;height:44px;background:white;border-radius:12px;display:flex;align-items:center;justify-content:center">
        <span style="font-size:22px;font-weight:800;color:${BRAND.primary}">IP</span>
      </div>
      <span style="font-size:18px;font-weight:700;color:white;opacity:0.9">InvestingPro.in</span>
    </div>

    <!-- Content -->
    <div style="text-align:center;max-width:${w - 200}px">
      ${stat ? `<p style="margin:0 0 20px;font-size:56px;font-weight:800;color:${BRAND.accent};font-family:${BRAND.fontDisplay}">${stat}</p>` : ""}
      <h1 style="margin:0 0 16px;font-size:${platform === "instagram" ? 42 : 48}px;font-weight:800;color:white;font-family:${BRAND.fontDisplay};line-height:1.2">${title}</h1>
      <p style="margin:0;font-size:22px;color:rgba(255,255,255,0.8);line-height:1.4">${subtitle}</p>
    </div>

    <!-- Footer -->
    <div style="position:absolute;bottom:40px;right:40px">
      <span style="font-size:16px;color:rgba(255,255,255,0.6)">investingpro.in</span>
    </div>
  </div>
</body>
</html>`;
}
