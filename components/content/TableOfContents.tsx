"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface TOCItem {
    id: string;
    text: string;
    level: number; // 2 (h2) or 3 (h3)
}

interface TableOfContentsProps {
    items: TOCItem[];
    activeId?: string;
}

export default function TableOfContents({ items }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    // Scroll Spy Logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100, // Offset for sticky header
                behavior: 'smooth'
            });
            setActiveId(id);
        }
    };

    if (items.length === 0) return null;

    return (
        <nav className="hidden lg:block sticky top-24 self-start max-w-[260px] pl-4 border-l border-gray-200">
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4">
                On this page
            </h4>
            <ul className="space-y-1">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => handleClick(e, item.id)}
                            className={cn(
                                "block text-sm py-1.5 transition-colors border-l-2 -ml-[17px] pl-4",
                                activeId === item.id
                                    ? "border-secondary-600 text-secondary-600 font-medium"
                                    : "border-transparent text-gray-500 hover:text-gray-900 group"
                            )}
                        >
                            <span className={cn("block truncate", item.level === 3 && "pl-3 text-xs opacity-90")}>
                                {item.text}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
