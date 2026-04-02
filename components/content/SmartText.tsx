"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { GlossaryTooltip } from './GlossaryTooltip';
import { api } from '@/lib/api';

interface SmartTextProps {
  children: string;
  className?: string;
}

interface Term {
    id: string;
    term: string;
    definition: string;
    category: string;
}

export function SmartText({ children, className = "" }: SmartTextProps) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch matchable terms on mount (with simple caching strategy in future)
  useEffect(() => {
    const fetchTerms = async () => {
        try {
            // In a real app, this would be a specialized lightweight endpoint "list_terms_only"
            const data = await api.entities.Glossary.list();
            setTerms(data || []);
        } catch (e) {
            console.error("SmartText failed to load glossary", e);
        } finally {
            setLoading(false);
        }
    };
    fetchTerms();
  }, []);

  const processedContent = useMemo(() => {
    if (loading || terms.length === 0) return children;

    // Create a regex pattern to match all terms
    // Sort by length (descending) to match "Mutual Fund" before "Fund"
    const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
    
    // We only want to match specific known high-value keywords to avoid noise
    // For this demo, we'll match all, but strictly exact matches (case insensitive)
    
    const parts: (string | React.ReactNode)[] = [children];

    sortedTerms.forEach(termObj => {
        for (let i = 0; i < parts.length; i++) {
            if (typeof parts[i] === 'string') {
                const text = parts[i] as string;
                // Simple case-insensitive match, but careful not to replace inside words (word boundary)
                const regex = new RegExp(`\\b(${termObj.term})\\b`, 'gi');
                
                if (regex.test(text)) {
                    const newParts: (string | React.ReactNode)[] = [];
                    const lastIndex = 0;
                    
                    // We only want to replace the FIRST occurrence in a block of text to avoid clutter
                    // So we'll use replace with a callback once, or split carefully.
                    // Let's use split for global replacement for now, or maybe limit to 1 per paragraph in V2.
                    
                    const matches = Array.from(text.matchAll(regex));
                    
                    if (matches.length > 0) {
                        // Just process matches
                        let cursor = 0;
                        matches.forEach(match => {
                             if (match.index === undefined) return;
                             
                             // Add text before
                             if (match.index > cursor) {
                                 newParts.push(text.slice(cursor, match.index));
                             }
                             
                             // Add tooltip component
                             newParts.push(
                                <GlossaryTooltip 
                                    key={`${termObj.id}-${match.index}`} 
                                    term={termObj.term} 
                                    definition={termObj.definition}
                                    category={termObj.category}
                                >
                                    {match[0]}
                                </GlossaryTooltip>
                             );
                             
                             cursor = match.index + match[0].length;
                        });
                        
                        // Add text remaining
                        if (cursor < text.length) {
                             newParts.push(text.slice(cursor));
                        }
                        
                        // Replace the current string part with the new array of parts
                        parts.splice(i, 1, ...newParts);
                        // Skip the indices we just added
                        i += newParts.length - 1; 
                    }
                }
            }
        }
    });

    return parts;
  }, [children, terms, loading]);

  return (
    <p className={`text-gray-600 dark:text-gray-400 leading-relaxed ${className}`}>
        {processedContent}
    </p>
  );
}
