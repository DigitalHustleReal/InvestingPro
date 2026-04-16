"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

/**
 * TableEnhancer — hydrates static HTML tables inside #article-content
 * with client-side sorting. No changes needed to article HTML.
 *
 * How it works:
 * 1. Finds all <table> elements inside #article-content
 * 2. Parses their data into a sortable structure
 * 3. Adds click handlers to <th> elements for sorting
 * 4. Re-renders tbody on sort
 */
export default function TableEnhancer() {
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    if (enhanced) return;

    // Wait for article content to render
    const timer = setTimeout(() => {
      const container = document.getElementById("article-content");
      if (!container) return;

      const tables = container.querySelectorAll("table");
      tables.forEach((table) => {
        wrapTable(table);
        enhanceTable(table);
      });
      setEnhanced(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [enhanced]);

  return null; // This component renders nothing — it enhances existing DOM
}

function wrapTable(table: HTMLTableElement) {
  // Skip if already wrapped
  if (table.parentElement?.classList.contains("table-scroll-wrapper")) return;

  // Wrap in scrollable container for mobile
  const wrapper = document.createElement("div");
  wrapper.className = "table-scroll-wrapper";
  wrapper.style.cssText =
    "overflow-x:auto;-webkit-overflow-scrolling:touch;margin:40px 0;border-radius:12px;border:1px solid var(--prose-borders, #e2e8f0);box-shadow:0 2px 12px rgba(0,0,0,0.06);";
  table.parentElement?.insertBefore(wrapper, table);
  wrapper.appendChild(table);
  table.style.margin = "0";
  table.style.borderRadius = "0";
  table.style.border = "none";
  table.style.boxShadow = "none";

  // Mark long tables (10+ rows) for vertical scroll
  const rows = table.querySelectorAll("tbody tr");
  if (rows.length > 12) {
    wrapper.style.maxHeight = "520px";
    wrapper.style.overflowY = "auto";
  }
}

function enhanceTable(table: HTMLTableElement) {
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  if (!thead || !tbody) return;

  const headers = Array.from(thead.querySelectorAll("th"));
  if (headers.length < 2) return;

  // Parse all rows into data
  const rows = Array.from(tbody.querySelectorAll("tr"));
  if (rows.length < 2) return; // Need at least 2 rows to sort

  const rowData = rows.map((tr) => ({
    cells: Array.from(tr.querySelectorAll("td")).map((td) => ({
      text: td.textContent?.trim() || "",
      html: td.innerHTML,
    })),
    element: tr,
  }));

  let sortCol = -1;
  let sortAsc = true;

  // Add sort indicators and click handlers to headers
  headers.forEach((th, colIdx) => {
    // Skip first column (usually labels)
    if (colIdx === 0 && headers.length > 2) return;

    th.style.cursor = "pointer";
    th.style.userSelect = "none";
    th.title = "Click to sort";

    // Add sort icon
    const icon = document.createElement("span");
    icon.className = "sort-icon";
    icon.style.cssText =
      "display:inline-flex;margin-left:6px;opacity:0.4;vertical-align:middle;font-size:10px;";
    icon.textContent = "↕";
    th.appendChild(icon);

    th.addEventListener("click", () => {
      if (sortCol === colIdx) {
        sortAsc = !sortAsc;
      } else {
        sortCol = colIdx;
        sortAsc = true;
      }

      // Update all sort icons
      headers.forEach((h) => {
        const si = h.querySelector(".sort-icon");
        if (si) {
          si.textContent = "↕";
          (si as HTMLElement).style.opacity = "0.4";
        }
      });

      // Update active sort icon
      const activeIcon = th.querySelector(".sort-icon");
      if (activeIcon) {
        activeIcon.textContent = sortAsc ? "↑" : "↓";
        (activeIcon as HTMLElement).style.opacity = "1";
      }

      // Sort rows
      const sorted = [...rowData].sort((a, b) => {
        const aVal = a.cells[colIdx]?.text || "";
        const bVal = b.cells[colIdx]?.text || "";

        // Try numeric sort first
        const aNum = parseNumeric(aVal);
        const bNum = parseNumeric(bVal);

        if (aNum !== null && bNum !== null) {
          return sortAsc ? aNum - bNum : bNum - aNum;
        }

        // Fallback to string sort
        return sortAsc
          ? aVal.localeCompare(bVal, "en-IN")
          : bVal.localeCompare(aVal, "en-IN");
      });

      // Re-render tbody
      tbody.innerHTML = "";
      sorted.forEach((row) => {
        tbody.appendChild(row.element);
      });
    });
  });

  // Add a subtle "sortable" indicator to the table
  const caption = document.createElement("div");
  caption.style.cssText =
    "text-align:right;font-size:11px;color:#94a3b8;margin-top:4px;padding-right:4px;";
  caption.textContent = "Click column headers to sort";
  table.parentElement?.insertBefore(caption, table.nextSibling);
}

function parseNumeric(val: string): number | null {
  // Remove ₹, %, commas, lakh, crore, "years" etc.
  const cleaned = val
    .replace(/[₹,%]/g, "")
    .replace(/,/g, "")
    .replace(/\s*(lakh|crore|years?|months?|days?|mins?)\s*/gi, "")
    .replace(/[~≈]/g, "")
    .trim();

  // Handle ranges like "6.5-7.5" — use midpoint
  const range = cleaned.match(/^(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)$/);
  if (range) {
    return (parseFloat(range[1]) + parseFloat(range[2])) / 2;
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}
