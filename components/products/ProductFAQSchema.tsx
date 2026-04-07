import { cn } from "@/lib/utils";

interface FAQ {
  q: string;
  a: string;
}

interface ProductFAQSchemaProps {
  faqs: FAQ[];
}

export function ProductFAQSchema({ faqs }: ProductFAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section aria-labelledby="faq-heading" className="mt-12">
        <h2
          id="faq-heading"
          className={cn(
            "text-2xl font-bold mb-6",
            "text-gray-900 dark:text-gray-100",
          )}
        >
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className={cn(
                "group rounded-xl border",
                "border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-900",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                "transition-colors duration-200",
              )}
            >
              <summary
                className={cn(
                  "flex cursor-pointer items-center justify-between",
                  "px-5 py-4 text-left font-medium",
                  "text-gray-900 dark:text-gray-100",
                  "list-none [&::-webkit-details-marker]:hidden",
                  "select-none",
                )}
              >
                <span className="pr-4">{faq.q}</span>
                <span
                  className={cn(
                    "shrink-0 text-green-600 dark:text-green-400",
                    "transition-transform duration-200",
                    "group-open:rotate-45",
                  )}
                  aria-hidden="true"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="10" y1="4" x2="10" y2="16" />
                    <line x1="4" y1="10" x2="16" y2="10" />
                  </svg>
                </span>
              </summary>

              <div
                className={cn(
                  "px-5 pb-4 pt-0",
                  "text-gray-600 dark:text-gray-300",
                  "text-sm leading-relaxed",
                  "border-t border-gray-100 dark:border-gray-700/50",
                )}
              >
                <p className="pt-3">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
