const PHRASES = [
  "Independent research.",
  "No paid rankings.",
  "Methodology disclosed.",
  "Every opinion backed by data.",
  "SEBI-compliant.",
  "1,000+ products compared.",
  "75 free calculators.",
  "228 researched articles.",
];

export default function BrandMarquee() {
  // Double the phrases for seamless infinite scroll
  const items = [...PHRASES, ...PHRASES];

  return (
    <section className="py-5 bg-gray-900 overflow-hidden">
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {items.map((phrase, i) => (
            <span key={i} className="mx-8 text-sm font-medium text-white/50">
              {phrase}
              <span className="ml-8 text-green-500">·</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
