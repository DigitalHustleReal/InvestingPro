"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
    getCategorySections, 
    getActiveCategory,
    type NavSection 
} from '@/lib/admin/navigation-config';

interface AdminSidebarProps {
    /**
     * Active category - filters sidebar sections
     * If not provided, auto-detects from pathname
     */
    activeCategory?: string;
}

export default function AdminSidebar({ activeCategory }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(true); // Default to collapsed for thinner sidebar

    // Auto-detect category from pathname if not provided
    const currentCategory = activeCategory || getActiveCategory(pathname);
    
    // Get contextual sections based on active category
    const navSections = getCategorySections(currentCategory);

    return (
        <div 
            className={cn(
                "text-foreground/95 dark:text-foreground/95 h-full flex flex-col relative transition-all duration-300 ease-in-out w-full",
                // Ensure width is explicit and respected by parent
                isCollapsed ? "min-w-[64px] max-w-[64px]" : "min-w-[224px] max-w-[224px]" // Thinner sidebar: 64px collapsed, 224px expanded
            )}
        >

            {/* Navigation Sections */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-6 space-y-8 no-scrollbar" aria-label="Main navigation">
                {navSections.map((section) => (
                    <div key={section.title} className="animate-in fade-in slide-in-from-left-2 duration-500">
                        {!isCollapsed && (
                             <h3 className="text-[10px] font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-[0.2em] mb-4 px-3 whitespace-nowrap">
                                {section.title}
                            </h3>
                        )}
                        {/* Divider for collapsed mode */}
                        {isCollapsed && <div className="h-px bg-white/5 my-4 mx-2" />}

                        <ul className="space-y-1.5">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                                
                                return (
                                    <li key={item.href} className="relative group/item">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                                                isCollapsed ? "justify-center px-2" : "px-3",
                                                isActive
                                                    ? "bg-primary-600/10 text-foreground dark:text-foreground shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] border border-primary-500/20"
                                                    : "text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:text-foreground hover:bg-white/5"
                                            )}
                                            aria-label={item.label}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            {/* Active Glow Indicator */}
                                            {isActive && (
                                                <div className={cn("absolute top-1/2 -translate-y-1/2 bg-primary-500 rounded-r-full shadow-[0_0_10px_#10b981]", isCollapsed ? "left-0 w-1 h-2" : "left-0 w-1 h-6")} />
                                            )}
                                            
                                            <Icon className={cn(
                                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                                                isActive ? "text-primary-400" : "text-muted-foreground/70 dark:text-muted-foreground/70 group-hover:text-foreground/80 dark:text-foreground/80"
                                            )} />
                                            
                                            <span className={cn("transition-all duration-300 overflow-hidden whitespace-nowrap", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 flex-1")}>
                                                {item.label}
                                            </span>
                                            
                                            {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-primary-500 text-foreground dark:text-foreground rounded-full shadow-lg shadow-primary-500/30 animate-pulse">
                                                    {item.badge}
                                                </span>
                                            )}

                                            {/* Tooltip for Collapsed State */}
                                            {isCollapsed && (
                                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-muted dark:bg-muted text-foreground dark:text-foreground text-xs rounded opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-[60] shadow-xl border border-border dark:border-border">
                                                    {item.label}
                                                </div>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Collapse Toggle Button */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    "mb-4 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:text-foreground transition-colors flex items-center justify-center border border-border/50 dark:border-border/50 shadow-sm group",
                    isCollapsed ? "mx-2 p-2" : "mx-4 p-2.5"
                )}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
               {isCollapsed ? (
                   <span className="text-sm font-bold group-hover:scale-110 transition-transform">»</span> 
               ) : (
                   <span className="flex items-center gap-2 text-xs font-medium w-full justify-center">
                       « <span className="text-[10px] uppercase tracking-wider">Collapse</span>
                   </span>
               )}
            </button>


            {/* Bottom Profile Area */}
            <div className={cn("border-t border-border/50 dark:border-border/50 bg-surface-darker/50 dark:bg-surface-darker/50 backdrop-blur-md transition-all duration-300", isCollapsed ? "p-2" : "p-4")}>
                <div className={cn("flex items-center gap-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group", isCollapsed ? "justify-center p-1" : "p-2")}>
                    <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-border dark:border-border flex items-center justify-center text-foreground/80 dark:text-foreground/80 text-sm font-bold shadow-inner group-hover:border-primary-500/50 transition-colors">
                        DH
                    </div>
                    <div className={cn("transition-all duration-300 overflow-hidden whitespace-nowrap", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 flex-1")}>
                        <p className="text-sm font-bold text-foreground dark:text-foreground truncate">Digital Hustle</p>
                        <p className="text-[10px] text-muted-foreground/70 dark:text-muted-foreground/70 truncate font-medium uppercase tracking-wider">Super Admin</p>
                    </div>
                    {!isCollapsed && <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_#10b981]" />}
                </div>
            </div>
        </div>
    );

}
