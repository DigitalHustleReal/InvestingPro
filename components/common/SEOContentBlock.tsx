"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils'; // Assuming you have a utils file for class merging

interface SEOContentBlockProps {
  title: string;
  content: string; // HTML string
  className?: string;
}

export default function SEOContentBlock({ title, content, className }: SEOContentBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={cn("bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8", className)}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
      
      <div 
        className={cn(
          "prose prose-slate dark:prose-invert max-w-none transition-all duration-300 overflow-hidden relative",
          !isExpanded && "max-h-[250px] mask-gradient-bottom" // Helper class/style needed or inline style
        )}
        style={{ maskImage: !isExpanded ? 'linear-gradient(to bottom, black 60%, transparent 100%)' : 'none' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Read More <ChevronDown className="w-4 h-4" /></>
          )}
        </Button>
      </div>
    </section>
  );
}
