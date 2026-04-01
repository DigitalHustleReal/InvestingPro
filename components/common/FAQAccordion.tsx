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
  // NOTE: FAQPage schema removed — Google restricted it to government/healthcare
  // sites in August 2023. Finance/comparison sites must not use it.
  // HTML FAQ content below still benefits UX and may appear in featured snippets.

  return (
    <section className={className}>
      
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl px-4 md:px-6">
            <AccordionTrigger className="text-left font-semibold text-slate-800 dark:text-slate-200 hover:no-underline hover:text-primary-600 dark:hover:text-primary-400 py-4">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed pb-4">
              <div dangerouslySetInnerHTML={{ __html: item.answer }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
