"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, GripVertical, Minimize2, Maximize2 } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface DraggableTableOfContentsProps {
  className?: string;
}

export default function DraggableTableOfContents({ className = '' }: DraggableTableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const tocRef = useRef<HTMLDivElement>(null);

  // Initialize headings with Retry Logic (to handle hydration/content delay)
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20; // Try for 2-3 seconds

    const scanHeadings = () => {
        // Target specifically the prose container (Content)
        // This avoids picking up "Related Articles", "Newsletter", etc. which are outside .prose
        const contentContainer = document.querySelector('.prose');
        if (!contentContainer) return false;

        const headingElements = contentContainer.querySelectorAll('h1, h2, h3, h4');
        // If only h1 is found, content usually isn't ready if we expect h2s
        if (headingElements.length <= 1) return false;

        const items: TOCItem[] = [];
        headingElements.forEach((heading, index) => {
          // Skip H1 (Main Title)
          if (heading.tagName === 'H1') return;

          const id = heading.id || `section-${index}`;
          heading.id = id; // Enforce ID injection

          items.push({
            id,
            text: heading.textContent || '',
            level: parseInt(heading.tagName[1]),
          });
        });

        if (items.length > 0) {
            setHeadings(items);
            // Default active to first item
            if (activeId === '') setActiveId(items[0].id);
            return true;
        }
        return false;
    };

    // Initial scan
    scanHeadings();

    // Polling interval
    const interval = setInterval(() => {
        if (scanHeadings() || attempts > maxAttempts) {
            clearInterval(interval);
        }
        attempts++;
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      // Find all heading elements
      const headingElements = headings
        .map(h => document.getElementById(h.id))
        .filter((el): el is HTMLElement => el !== null);
      
      // Determine which one is active
      // Logic: The last heading that spans above the visual center or top third
      const offset = 180; // px from top
      
      let currentActiveId = '';
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        const rect = element.getBoundingClientRect();
        
        // If the heading is above the threshold line
        if (rect.top <= offset) {
          currentActiveId = element.id;
          break;
        }
      }
      
      if (currentActiveId && currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, activeId]);

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.toc-drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      // Prevent selection during drag
      document.body.style.userSelect = 'none';
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Constraints? Maybe keep on screen
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const scrollToHeading = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    let element = document.getElementById(id);

    // ROBUST FALLBACK: If element ID was wiped by React re-render, find it by text
    if (!element) {
        const targetHeading = headings.find(h => h.id === id);
        if (targetHeading) {
             const allHeadings = Array.from(document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4'));
             const found = allHeadings.find(h => h.textContent?.trim() === targetHeading.text.trim());
             if (found) {
                 element = found as HTMLElement;
                 element.id = id; // Re-inject ID
             }
        }
    }

    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileOpen(false);
      setActiveId(id);
      
      // Update URL hash without jumping
      history.pushState(null, '', `#${id}`);
    }
  };

  /**
   * SUB-COMPONENTS
   */

  const StaticMobileTOC = () => (
    <div className="lg:hidden mb-10 p-6 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <Menu className="w-5 h-5 text-emerald-600" /> 
            Table of Contents
        </h3>
        <div className="space-y-3 relative pl-2">
             {/* Vertical Track */}
             <div className="absolute left-[3px] top-2 bottom-2 w-0.5 bg-slate-200 rounded-full" />
             
             {headings.map((heading) => (
               <button
                 key={heading.id}
                 onClick={() => scrollToHeading(heading.id)}
                 className={`relative block w-full text-left text-sm transition-all duration-200 pl-6 ${
                   heading.level === 3 ? 'ml-2' : ''
                 } ${
                   activeId === heading.id 
                    ? 'text-emerald-700 font-semibold' 
                    : 'text-slate-600'
                 }`}
               >
                 {/* Dot */}
                 <span className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                     activeId === heading.id 
                     ? 'bg-emerald-500 border-white ring-2 ring-emerald-100' 
                     : 'bg-white border-slate-300'
                 }`} />
                 {heading.text}
               </button>
             ))}
        </div>
    </div>
  );

  const DesktopTOC = () => (
    <div
      ref={tocRef}
      className={`hidden lg:block fixed z-30 transition-all duration-300 ${className}`}
      style={{
        left: isCollapsed ? 'auto' : `${position.x}px`,
        top: `${position.y}px`,
        right: isCollapsed ? '24px' : 'auto', 
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-12 h-12 rounded-full cursor-pointer hover:bg-emerald-50' : 'w-80'}`}>
        
        {/* Header (Draggable) */}
        {!isCollapsed && (
            <div className="bg-slate-50 border-b border-slate-100 p-3 flex items-center justify-between cursor-grab toc-drag-handle group">
            <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-700 transition-colors">
                <GripVertical className="w-5 h-5" />
                <span className="font-semibold text-xs uppercase tracking-wider">Contents</span>
            </div>
            <button
                onClick={() => setIsCollapsed(true)}
                className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors"
            >
                <Minimize2 className="w-4 h-4" />
            </button>
            </div>
        )}

        {/* Collapsed State Toggle */}
        {isCollapsed && (
             <div onClick={() => setIsCollapsed(false)} className="w-full h-full flex items-center justify-center text-emerald-600">
                 <Menu className="w-6 h-6" />
             </div>
        )}

        {/* List Content */}
        {!isCollapsed && (
          <div className="max-h-[70vh] overflow-y-auto p-5 relative custom-scrollbar">
            {/* Thread Line */}
            <div className="absolute left-[29px] top-5 bottom-5 w-0.5 bg-slate-100" />

            <div className="space-y-4">
                {headings.map((heading) => {
                    const isActive = activeId === heading.id;
                    return (
                        <div key={heading.id} className="relative flex items-start group">
                            {/* Node */}
                            <div className={`relative z-10 flex-shrink-0 mt-1.5 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                                isActive 
                                    ? 'bg-emerald-500 border-white shadow-md scale-125' 
                                    : 'bg-slate-200 border-white group-hover:border-emerald-200'
                            }`} />
                            
                            {/* Link */}
                            <button
                                onClick={() => scrollToHeading(heading.id)}
                                className={`ml-4 text-left text-sm leading-relaxed transition-all duration-200 ${
                                    heading.level === 3 ? 'pl-2 text-xs opacity-90' : ''
                                } ${
                                    isActive 
                                        ? 'text-emerald-700 font-bold translate-x-1' 
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {heading.text}
                            </button>
                        </div>
                    );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // If no headings found yet, don't render anything (avoid layout shift? or show skeleton?)
  if (headings.length === 0) return null;

  return (
    <>
      <StaticMobileTOC />
      
      {/* Mobile Floating Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-white text-emerald-600 border border-emerald-100 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all duration-300"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Modal Overlay */}
      <div className={`lg:hidden fixed inset-0 z-[150] transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className={`absolute right-4 bottom-24 w-80 max-h-[60vh] bg-white rounded-2xl shadow-2xl transition-transform duration-300 flex flex-col ${isMobileOpen ? 'translate-y-0' : 'translate-y-10'}`}>
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Table of Contents</h3>
                  <button onClick={() => setIsMobileOpen(false)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <div className="overflow-y-auto p-4 flex-1">
                 {/* Re-use logic for list or simplify */}
                 <div className="space-y-3 relative pl-2">
                    <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-slate-100" />
                    {headings.map(h => (
                        <button key={h.id} onClick={() => scrollToHeading(h.id)} className={`relative block w-full text-left pl-6 py-1 ${activeId === h.id ? 'text-emerald-600 font-medium' : 'text-slate-600'}`}>
                            <span className={`absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full ${activeId === h.id ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            {h.text}
                        </button>
                    ))}
                 </div>
              </div>
          </div>
      </div>

      <DesktopTOC />
    </>
  );
}
