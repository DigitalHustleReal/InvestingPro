"use client";

import React, { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TickerItem {
  name: string;
  value: string;          // "₹93.26" or "8.5%" or "₹45,000"
  change: number;         // Percentage change (positive = green, negative = red)
  changeLabel?: string;   // "1D" or "1Y" etc.
  href?: string;
  category?: string;      // "MF" | "CC" | "FD" | "Loan"
}

interface ProductTickerProps {
  items: TickerItem[];
  speed?: number;         // pixels per second (default 50)
  className?: string;
  variant?: 'compact' | 'full';
}

function TickerCard({ item, variant }: { item: TickerItem; variant: string }) {
  const isPositive = item.change > 0;
  const isNeutral = item.change === 0;
  const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;

  const content = (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-lg border whitespace-nowrap transition-colors",
      "bg-white hover:bg-gray-50 border-gray-100",
      variant === 'compact' ? "gap-2 px-3 py-1.5" : ""
    )}>
      {item.category && (
        <span className={cn(
          "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
          item.category === 'MF' ? "bg-green-100 text-green-700" :
          item.category === 'FD' ? "bg-blue-100 text-blue-700" :
          item.category === 'CC' ? "bg-purple-100 text-purple-700" :
          "bg-gray-100 text-gray-600"
        )}>
          {item.category}
        </span>
      )}
      <span className={cn("font-medium text-gray-900 truncate", variant === 'compact' ? "text-xs max-w-[120px]" : "text-sm max-w-[180px]")}>
        {item.name}
      </span>
      <span className={cn("font-semibold tabular-nums text-gray-700", variant === 'compact' ? "text-xs" : "text-sm")}>
        {item.value}
      </span>
      <span className={cn(
        "flex items-center gap-0.5 font-semibold tabular-nums",
        variant === 'compact' ? "text-[11px]" : "text-xs",
        isPositive ? "text-green-600" : isNeutral ? "text-gray-400" : "text-red-500"
      )}>
        <Icon className="w-3 h-3" />
        {isPositive ? '+' : ''}{item.change.toFixed(2)}%
        {item.changeLabel && <span className="text-gray-400 font-normal ml-0.5">{item.changeLabel}</span>}
      </span>
    </div>
  );

  if (item.href) {
    return <a href={item.href} className="block">{content}</a>;
  }
  return content;
}

export default function ProductTicker({ items, speed = 50, className, variant = 'full' }: ProductTickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length === 0) return;

    let position = 0;
    const contentWidth = el.scrollWidth / 2; // We duplicate content

    const animate = () => {
      position -= speed / 60; // 60fps
      if (Math.abs(position) >= contentWidth) position = 0;
      el.style.transform = `translateX(${position}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Pause on hover
    const parent = el.parentElement;
    const pause = () => cancelAnimationFrame(animationRef.current);
    const resume = () => { animationRef.current = requestAnimationFrame(animate); };
    parent?.addEventListener('mouseenter', pause);
    parent?.addEventListener('mouseleave', resume);

    return () => {
      cancelAnimationFrame(animationRef.current);
      parent?.removeEventListener('mouseenter', pause);
      parent?.removeEventListener('mouseleave', resume);
    };
  }, [items, speed]);

  if (items.length === 0) return null;

  return (
    <div className={cn("overflow-hidden bg-gray-50 border-y border-gray-100", className)}>
      <div className="relative">
        <div ref={scrollRef} className="flex gap-3 py-2 px-2 will-change-transform">
          {/* Duplicate items for seamless loop */}
          {[...items, ...items].map((item, i) => (
            <TickerCard key={`${item.name}-${i}`} item={item} variant={variant} />
          ))}
        </div>
      </div>
    </div>
  );
}
