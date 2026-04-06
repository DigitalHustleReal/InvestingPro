"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import dynamic from "next/dynamic";

// Lazy-load calculators — only loads the one actually used in the article
const SIPCalculator = dynamic(
  () =>
    import("@/components/calculators/SIPCalculator").then(
      (m) => m.SIPCalculator,
    ),
  { ssr: false },
);
const EMICalculator = dynamic(
  () =>
    import("@/components/calculators/EMICalculatorEnhanced").then(
      (m) => m.EMICalculatorEnhanced,
    ),
  { ssr: false },
);
const FDCalculator = dynamic(
  () =>
    import("@/components/calculators/FDCalculator").then((m) => m.FDCalculator),
  { ssr: false },
);
const PPFCalculator = dynamic(
  () =>
    import("@/components/calculators/PPFCalculator").then(
      (m) => m.PPFCalculator,
    ),
  { ssr: false },
);
const NPSCalculator = dynamic(
  () =>
    import("@/components/calculators/NPSCalculator").then(
      (m) => m.NPSCalculator,
    ),
  { ssr: false },
);
const TaxCalculator = dynamic(
  () =>
    import("@/components/calculators/TaxCalculator").then(
      (m) => m.TaxCalculator,
    ),
  { ssr: false },
);
const SSYCalculator = dynamic(
  () =>
    import("@/components/calculators/SSYCalculator").then(
      (m) => m.SSYCalculator,
    ),
  { ssr: false },
);
const RDCalculator = dynamic(
  () =>
    import("@/components/calculators/RDCalculator").then((m) => m.RDCalculator),
  { ssr: false },
);
const SWPCalculator = dynamic(
  () =>
    import("@/components/calculators/SWPCalculator").then(
      (m) => m.SWPCalculator,
    ),
  { ssr: false },
);
const RetirementCalculator = dynamic(
  () =>
    import("@/components/calculators/RetirementCalculator").then(
      (m) => m.RetirementCalculator,
    ),
  { ssr: false },
);
const CompoundInterestCalculator = dynamic(
  () =>
    import("@/components/calculators/CompoundInterestCalculator").then(
      (m) => m.CompoundInterestCalculator,
    ),
  { ssr: false },
);

// Map widget names to components
const CALCULATOR_MAP: Record<string, React.ComponentType> = {
  "sip-calculator": SIPCalculator,
  "emi-calculator": EMICalculator,
  "fd-calculator": FDCalculator,
  "ppf-calculator": PPFCalculator,
  "nps-calculator": NPSCalculator,
  "tax-calculator": TaxCalculator,
  "ssy-calculator": SSYCalculator,
  "rd-calculator": RDCalculator,
  "swp-calculator": SWPCalculator,
  "retirement-calculator": RetirementCalculator,
  "compound-interest-calculator": CompoundInterestCalculator,
};

// Map categories/URL segments to default calculator types
const CATEGORY_CALCULATOR_MAP: Record<string, string> = {
  "mutual-funds": "sip-calculator",
  "mutual-fund": "sip-calculator",
  investment: "sip-calculator",
  investing: "sip-calculator",
  sip: "sip-calculator",
  loans: "emi-calculator",
  loan: "emi-calculator",
  "home-loan": "emi-calculator",
  "personal-loan": "emi-calculator",
  "credit-cards": "emi-calculator",
  "credit-card": "emi-calculator",
  "fixed-deposits": "fd-calculator",
  "fixed-deposit": "fd-calculator",
  fd: "fd-calculator",
  ppf: "ppf-calculator",
  nps: "nps-calculator",
  retirement: "retirement-calculator",
  tax: "tax-calculator",
  "tax-planning": "tax-calculator",
  insurance: "sip-calculator",
  banking: "fd-calculator",
};

/**
 * Hydrates static HTML placeholders with interactive React calculator widgets.
 *
 * Supported placeholder formats:
 *   <div data-widget="sip-calculator"></div>
 *   <div data-widget="emi-calculator"></div>
 *   <div data-widget="fd-calculator"></div>
 *   <div data-widget="auto-calculator"></div>  (picks based on page URL)
 *   ... and all other calculator types
 */
export default function CalculatorHydrator() {
  useEffect(() => {
    // Hydrate all specific calculator widgets
    for (const [widgetName, Component] of Object.entries(CALCULATOR_MAP)) {
      const elements = document.querySelectorAll(
        `[data-widget="${widgetName}"]`,
      );
      elements.forEach((el) => {
        if (el.getAttribute("data-hydrated")) return;
        try {
          const root = createRoot(el);
          root.render(<Component />);
          el.setAttribute("data-hydrated", "true");
        } catch {
          // Silently skip failed hydrations
        }
      });
    }

    // Hydrate auto-calculator (picks based on URL path)
    const autoCalculators = document.querySelectorAll(
      '[data-widget="auto-calculator"]',
    );
    autoCalculators.forEach((el) => {
      if (el.getAttribute("data-hydrated")) return;
      try {
        const path = window.location.pathname.toLowerCase();

        // Find matching calculator from path segments
        let calcName = "sip-calculator"; // default
        for (const [keyword, calc] of Object.entries(CATEGORY_CALCULATOR_MAP)) {
          if (path.includes(keyword)) {
            calcName = calc;
            break;
          }
        }

        const Component = CALCULATOR_MAP[calcName] || SIPCalculator;
        const root = createRoot(el);
        root.render(<Component />);
        el.setAttribute("data-hydrated", "true");
      } catch {
        // Silently skip
      }
    });
  }, []);

  return null;
}
