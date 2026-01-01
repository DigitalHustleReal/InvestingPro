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

  // Extract headings from article
  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const headingElements = article.querySelectorAll('h2, h3, h4');
    const items: TOCItem[] = [];

    headingElements.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }

      items.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1]),
      });
    });

    setHeadings(items);
  }, []);

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveId(headings[i].id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.toc-drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
      setIsMobileOpen(false);
    }
  };

  if (headings.length === 0) return null;

  // Mobile floating button
  const MobileButton = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 animate-bounce-slow"
      aria-label="Toggle Table of Contents"
    >
      {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );

  // Mobile modal
  const MobileModal = () => (
    <div
      className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsMobileOpen(false)}
      />
      <div className="absolute inset-x-4 top-20 bottom-20 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-4 text-white">
            <h3 className="font-bold text-lg">Table of Contents</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-200 ${
                  heading.level === 2 ? 'font-semibold' : 'text-sm'
                } ${
                  heading.level === 3 ? 'ml-4' : ''
                } ${
                  heading.level === 4 ? 'ml-8' : ''
                } ${
                  activeId === heading.id
                    ? 'bg-gradient-to-r from-emerald-50 to-blue-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {heading.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop draggable TOC
  const DesktopTOC = () => (
    <div
      ref={tocRef}
      className={`hidden lg:block fixed z-30 ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300"
        style={{ width: isCollapsed ? '60px' : '320px' }}
      >
        {/* Header with drag handle */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 flex items-center justify-between cursor-grab toc-drag-handle">
          <div className="flex items-center gap-2 text-white">
            <GripVertical className="w-5 h-5" />
            {!isCollapsed && <span className="font-semibold text-sm">Table of Contents</span>}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm ${
                  heading.level === 2 ? 'font-semibold' : 'text-xs'
                } ${
                  heading.level === 3 ? 'ml-3' : ''
                } ${
                  heading.level === 4 ? 'ml-6' : ''
                } ${
                  activeId === heading.id
                    ? 'bg-gradient-to-r from-emerald-50 to-blue-50 text-emerald-700 font-semibold border-l-4 border-emerald-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {heading.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <MobileButton />
      <MobileModal />
      <DesktopTOC />
    </>
  );
}
