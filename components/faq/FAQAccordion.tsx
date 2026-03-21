'use client';

/**
 * FAQ Accordion Component
 * Displays frequently asked questions in an accordion
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Search } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQAccordionProps {
  category?: string;
  limit?: number;
  searchable?: boolean;
  title?: string;
  subtitle?: string;
}

export default function FAQAccordion({
  category = 'general',
  limit,
  searchable = true,
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions"
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch FAQs
  const { data: faqs = [], isLoading } = useQuery<FAQ[]>({
    queryKey: ['faqs', category, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (limit) params.append('limit', limit.toString());
      
      const response = await fetch(`/api/faqs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      return response.json();
    }
  });

  // Filter FAQs based on search query
  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-4xl mx-auto py-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            {subtitle}
          </p>
        )}

        {/* Search */}
        {searchable && (
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <p className="text-center text-slate-600 dark:text-slate-400 py-8">
            No FAQs found matching your search.
          </p>
        ) : (
          filteredFAQs.map((faq, index) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => toggleFAQ(index)}
            />
          ))
        )}
      </div>

      {/* Schema.org FAQ Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": filteredFAQs.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </section>
  );
}

function FAQItem({
  faq,
  isOpen,
  onToggle
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all hover:border-primary-300 dark:hover:border-primary-700">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white pr-4">
          {faq.question}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 dark:text-slate-600 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
