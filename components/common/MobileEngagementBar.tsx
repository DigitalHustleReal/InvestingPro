"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { 
    TrendingUp, 
    TrendingDown,
    Clock, 
    CreditCard, 
    Newspaper,
    ChevronRight,
    X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";

interface MobileEngagementBarProps {
    category?: 'credit_card' | 'loans' | 'mutual_fund' | 'investing' | 'general';
    className?: string;
}

interface MiniWidget {
    id: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    subtext?: string;
    color: string;
    detailComponent?: React.ReactNode;
}

// Mini widget data based on category
const getWidgetsForCategory = (category: string): MiniWidget[] => {
    const baseWidgets: MiniWidget[] = [];
    
    // CIBIL widget for credit cards and loans
    if (category === 'credit_card' || category === 'loans') {
        baseWidgets.push({
            id: 'cibil',
            icon: <CreditCard className="w-4 h-4" />,
            label: 'CIBIL Score',
            value: '750+',
            subtext: 'Check Free',
            color: 'bg-gradient-to-r from-emerald-500 to-emerald-500'
        });
    }
    
    // Tax widget for investing
    if (category === 'investing' || category === 'mutual_fund') {
        baseWidgets.push({
            id: 'tax',
            icon: <Clock className="w-4 h-4" />,
            label: 'Tax Deadline',
            value: '45d',
            subtext: 'ITR Filing',
            color: 'bg-gradient-to-r from-amber-500 to-orange-500'
        });
    }
    
    // Rates widget - always show
    baseWidgets.push({
        id: 'rates',
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Gold',
        value: '₹72.5k',
        subtext: '+0.8%',
        color: 'bg-gradient-to-r from-yellow-500 to-amber-500'
    });
    
    // News widget - always show
    baseWidgets.push({
        id: 'news',
        icon: <Newspaper className="w-4 h-4" />,
        label: 'Updates',
        value: '3 New',
        subtext: 'View All',
        color: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    });
    
    return baseWidgets;
};

function MiniWidgetCard({ widget, onClick }: { widget: MiniWidget; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex-shrink-0 w-[120px] rounded-2xl p-3 text-white text-left transition-transform active:scale-95",
                widget.color
            )}
        >
            <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
                {widget.icon}
                <span className="text-[10px] font-semibold uppercase tracking-wide truncate">
                    {widget.label}
                </span>
            </div>
            <div className="text-lg font-black leading-none mb-0.5">
                {widget.value}
            </div>
            {widget.subtext && (
                <div className="text-[10px] opacity-80 font-medium">
                    {widget.subtext}
                </div>
            )}
        </button>
    );
}

export default function MobileEngagementBar({ category = 'general', className }: MobileEngagementBarProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const widgets = getWidgetsForCategory(category);
    
    // Auto-hide after scroll down, show on scroll up
    const [lastScrollY, setLastScrollY] = useState(0);
    
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Show when scrolling up or near top
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                setIsVisible(true);
            } 
            // Hide when scrolling down significantly
            else if (currentScrollY > lastScrollY + 50) {
                setIsVisible(false);
            }
            
            setLastScrollY(currentScrollY);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <>
            {/* Mobile Only - Fixed Bottom Bar */}
            <div 
                className={cn(
                    "lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-out",
                    isVisible ? "translate-y-0" : "translate-y-full",
                    className
                )}
            >
                {/* Gradient fade at top */}
                <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none" />
                
                {/* Main bar */}
                <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-2xl shadow-gray-900/20">
                    {/* Dismiss hint */}
                    <div className="flex justify-center pt-2">
                        <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    </div>
                    
                    {/* Scrollable widgets */}
                    <div 
                        ref={scrollRef}
                        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-3 snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {widgets.map((widget) => (
                            <div key={widget.id} className="snap-start">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <div>
                                            <MiniWidgetCard 
                                                widget={widget} 
                                                onClick={() => setSelectedWidget(widget.id)}
                                            />
                                        </div>
                                    </SheetTrigger>
                                    <SheetContent 
                                        side="bottom" 
                                        className="h-[60vh] rounded-t-3xl p-0 border-t border-gray-200 dark:border-gray-800"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-xl font-bold flex items-center gap-2">
                                                    <span className={cn("p-2 rounded-xl text-white", widget.color)}>
                                                        {widget.icon}
                                                    </span>
                                                    {widget.label}
                                                </h3>
                                            </div>
                                            
                                            {/* Widget-specific content */}
                                            <WidgetExpandedContent widgetId={widget.id} category={category} />
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        ))}
                        
                        {/* Spacer for last item scroll */}
                        <div className="flex-shrink-0 w-4" />
                    </div>
                    
                    {/* Safe area padding for iOS */}
                    <div className="h-safe-area-inset-bottom bg-white dark:bg-gray-950" />
                </div>
            </div>
            
            {/* Spacer to prevent content being hidden behind fixed bar */}
            <div className="lg:hidden h-28" />
        </>
    );
}

// Expanded content for each widget type
function WidgetExpandedContent({ widgetId, category }: { widgetId: string; category: string }) {
    switch (widgetId) {
        case 'cibil':
            return <CibilExpandedContent />;
        case 'tax':
            return <TaxExpandedContent />;
        case 'rates':
            return <RatesExpandedContent category={category} />;
        case 'news':
            return <NewsExpandedContent category={category} />;
        default:
            return null;
    }
}

function CibilExpandedContent() {
    return (
        <div className="space-y-6">
            {/* Score Gauge */}
            <div className="flex flex-col items-center py-6">
                <div className="relative w-48 h-24 mb-4">
                    <svg viewBox="0 0 200 100" className="w-full h-full">
                        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="16" />
                        <path 
                            d="M 20 100 A 80 80 0 0 1 180 100" 
                            fill="none" 
                            className="stroke-emerald-500"
                            strokeWidth="16" 
                            strokeDasharray="251"
                            strokeDashoffset={251 - (251 * 0.75)}
                        />
                    </svg>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                        <span className="text-4xl font-black text-emerald-600">750</span>
                    </div>
                </div>
                <p className="text-lg font-bold text-emerald-600">Excellent Score</p>
                <p className="text-sm text-gray-500">You qualify for premium cards</p>
            </div>
            
            {/* CTA */}
            <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-bold text-base">
                Check Your Score Free
                <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-xs text-center text-gray-600">
                No impact on your credit score. Powered by CIBIL.
            </p>
        </div>
    );
}

function TaxExpandedContent() {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-6 text-center">
                <div className="text-5xl font-black text-amber-600 mb-2">45</div>
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">Days Left</div>
                <div className="text-sm text-gray-500 mt-1">ITR Filing Deadline: July 31</div>
            </div>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <span className="font-medium">Advance Tax (Q1)</span>
                    <span className="text-sm text-gray-500">Jun 15</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <span className="font-medium">ITR Filing</span>
                    <span className="text-sm text-amber-600 font-bold">Jul 31</span>
                </div>
            </div>
            
            <Button variant="outline" className="w-full h-12 rounded-xl font-semibold">
                View Tax Calendar
            </Button>
        </div>
    );
}

function RatesExpandedContent({ category }: { category: string }) {
    const rates = [
        { label: 'Gold (10g)', value: '₹72,450', trend: 'up', change: '+0.8%' },
        { label: 'Silver (1kg)', value: '₹85,200', trend: 'up', change: '+1.2%' },
        { label: 'FD Rate (SBI)', value: '7.10%', trend: 'stable', change: '' },
        { label: 'Repo Rate', value: '6.50%', trend: 'stable', change: '' },
    ];
    
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                {rates.map((rate, idx) => (
                    <div 
                        key={idx}
                        className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl"
                    >
                        <div className="text-xs text-gray-500 mb-1">{rate.label}</div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{rate.value}</span>
                            {rate.change && (
                                <span className={cn(
                                    "text-xs font-semibold flex items-center",
                                    rate.trend === 'up' ? 'text-emerald-600' : 
                                    rate.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                                )}>
                                    {rate.trend === 'up' && <TrendingUp className="w-3 h-3 mr-0.5" />}
                                    {rate.trend === 'down' && <TrendingDown className="w-3 h-3 mr-0.5" />}
                                    {rate.change}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="text-xs text-center text-gray-600 pt-2">
                Last updated: 2 minutes ago
            </div>
        </div>
    );
}

function NewsExpandedContent({ category }: { category: string }) {
    const news = [
        { title: 'HDFC Bank Launches New Rewards Program', time: '2h ago', source: 'LiveMint' },
        { title: 'RBI Keeps Repo Rate Unchanged at 6.5%', time: '5h ago', source: 'ET' },
        { title: 'Gold Prices Hit All-Time High', time: '1d ago', source: 'CNBC' },
    ];
    
    return (
        <div className="space-y-4">
            {news.map((item, idx) => (
                <div 
                    key={idx}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <h4 className="font-semibold text-gray-900 dark:text-white leading-snug mb-2">
                        {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">{item.source}</span>
                        <span>{item.time}</span>
                    </div>
                </div>
            ))}
            
            <Button variant="outline" className="w-full h-12 rounded-xl font-semibold">
                View All News
                <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
        </div>
    );
}
