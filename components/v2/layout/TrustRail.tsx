"use client";

import { usePathname } from "next/navigation";

const PILLS = [
  "No paid rankings",
  "Methodology disclosed",
  "SEBI-compliant",
  "228+ researched articles",
];

export default function TrustRail() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="surface-ink border-t-2 border-indian-gold">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-0 gap-y-3 py-3 md:h-12 md:py-0">
          {PILLS.map((pill, i) => (
            <div key={pill} className="flex items-center">
              {i > 0 && (
                <div className="hidden md:block w-px h-4 bg-canvas-15 mx-5" />
              )}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-action-green flex-shrink-0" />
                <span className="text-label font-sans text-canvas-70">
                  {pill}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
