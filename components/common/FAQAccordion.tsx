"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  title?: string;
  items: FAQItem[];
  className?: string;
}

export default function FAQAccordion({ title = "Frequently Asked Questions", items, className }: FAQAccordionProps) {
  
  // JSON-LD Schema Generation
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl px-4 md:px-6">
            <AccordionTrigger className="text-left font-semibold text-gray-800 dark:text-gray-200 hover:no-underline hover:text-primary-600 dark:hover:text-primary-400 py-4">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-400 leading-relaxed pb-4">
              <div dangerouslySetInnerHTML={{ __html: item.answer }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
