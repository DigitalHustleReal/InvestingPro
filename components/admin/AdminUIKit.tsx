"use client";

import React, { ReactNode } from 'react';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { LucideIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ADMIN_THEME } from '@/lib/admin/theme';
import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconColor?: 'teal' | 'purple' | 'blue' | 'amber' | 'rose';
    actions?: ReactNode;
    showBreadcrumb?: boolean;
}

const ICON_COLOR_CLASSES = {
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
};

export function AdminPageHeader({
    title,
    subtitle,
    icon: Icon,
    iconColor = 'teal',
    actions,
    showBreadcrumb = false,
}: AdminPageHeaderProps) {
    const colorClasses = ICON_COLOR_CLASSES[iconColor] || ICON_COLOR_CLASSES.teal;

    return (
        <div className="mb-8">
            {showBreadcrumb && <AdminBreadcrumb />}
            
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className={cn(
                            "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg border backdrop-blur-sm",
                            colorClasses
                        )}>
                            <Icon className="w-7 h-7" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-200 tracking-tight leading-tight m-0 font-inter">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-slate-300 mt-1 text-sm m-0 font-inter">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

// Quick stat card for dashboards
interface StatCardProps {
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: LucideIcon;
    color?: 'teal' | 'purple' | 'blue' | 'amber' | 'rose';
}

export function StatCard({ label, value, change, changeType = 'neutral', icon: Icon, color = 'blue' }: StatCardProps) {
    const isPositive = changeType === 'positive';
    const isNegative = changeType === 'negative';
    
    return (
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:border-white/15 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative flex items-start justify-between z-10">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-inter mb-2">
                        {label}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white tracking-tight font-inter tabular-nums">
                            {value}
                        </h3>
                    </div>
                    
                    {change && (
                        <div className={cn(
                            "flex items-center gap-1.5 mt-3 text-xs font-medium px-2 py-1 rounded-md w-fit backdrop-blur-md border",
                            isPositive ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : 
                            isNegative ? "text-rose-400 bg-rose-400/10 border-rose-400/20" : 
                            "text-slate-300 bg-slate-400/10 border-slate-400/20"
                        )}>
                            {isPositive && <span className="text-[10px] ">▲</span>}
                            {isNegative && <span className="text-[10px] ">▼</span>}
                            {change}
                        </div>
                    )}
                </div>

                {Icon && (
                    <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl border shadow-lg transition-transform group-hover:scale-110 duration-300",
                        color === 'teal' ? "bg-teal-500/10 border-teal-500/20 text-teal-400" :
                        color === 'purple' ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                        color === 'amber' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                        color === 'rose' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                        "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
            
            {/* Background Glow */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl group-hover:from-white/10 transition-colors duration-300" />
        </div>
    );
}

// Content section wrapper
interface ContentSectionProps {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
}

export function ContentSection({ title, subtitle, actions, children }: ContentSectionProps) {
    return (
        <section className="rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg mb-6">
            {(title || actions) && (
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between gap-4">
                    <div>
                        {title && <h2 className="text-sm font-semibold text-slate-200 m-0 font-inter tracking-wide">{title}</h2>}
                        {subtitle && <p className="text-xs text-slate-300 mt-0.5 m-0 font-inter">{subtitle}</p>}
                    </div>
                    {actions}
                </div>
            )}
            <div className="p-5">
                {children}
            </div>
        </section>
    );
}

// Action button variants
interface ActionButtonProps {
    onClick?: () => void | Promise<void> | any;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    isLoading?: boolean;
    icon?: LucideIcon;
    className?: string;
}

export function ActionButton({ 
    onClick, 
    children, 
    variant = 'primary', 
    size = 'md',
    disabled = false,
    isLoading = false,
    icon: Icon,
    className
}: ActionButtonProps) {
    // Map ActionButton variants to standard Button variants
    const buttonVariant = 
        variant === 'primary' ? 'default' : 
        variant === 'secondary' ? 'outline' : 
        variant === 'danger' ? 'destructive' : 
        'ghost';

    return (
        <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            variant={buttonVariant}
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            className={cn(
                "gap-2 font-bold transition-all duration-300 ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wt-gold/50",
                variant === 'primary' && "bg-wt-gold text-wt-navy-900 hover:bg-[#FFD700] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] border-none",
                variant === 'secondary' && "bg-wt-surface-dark border border-wt-border-strong text-wt-text hover:bg-wt-surface-hover hover:border-wt-gold/50 hover:-translate-y-0.5 hover:shadow-sm",
                variant === 'ghost' && "text-wt-text-muted hover:text-wt-text hover:bg-wt-surface-hover",
                variant === 'danger' && "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:-translate-y-0.5",
                className
            )}
        >
            {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
            ) : Icon && (
                <Icon className="w-4 h-4" />
            )}
            {children}
        </Button>
    );
}

// Table wrapper with consistent styling
interface DataTableProps {
    children: ReactNode;
}

export function DataTable({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-lg border border-white/10 overflow-hidden bg-white/10 backdrop-blur-sm">
            <table className="w-full border-collapse">
                {children}
            </table>
        </div>
    );
}

export function TableHeader({ children }: { children: ReactNode }) {
    return (
        <thead className="bg-white/10">
            <tr className="border-b border-white/10">
                {children}
            </tr>
        </thead>
    );
}

export function TableHeaderCell({ children, className = '' }: { children?: ReactNode; className?: string }) {
    return (
        <th className={cn("px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider", className)}>
            {children}
        </th>
    );
}

export function TableBody({ children }: { children: ReactNode }) {
    return <tbody className="divide-y divide-white/5">{children}</tbody>;
}

export function TableRow({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
    return (
        <tr
            onClick={onClick}
            className={cn(
                "border-b border-white/5 transition-colors",
                onClick ? "cursor-pointer hover:bg-white/10" : "cursor-default",
                className
            )}
        >
            {children}
        </tr>
    );
}

export function TableCell({ children, className = '' }: { children?: ReactNode; className?: string }) {
    return (
        <td className={cn("px-4 py-3 text-sm text-slate-200 align-middle", className)}>
            {children}
        </td>
    );
}

// Badge component
// Status indicator mapping
type StatusType = 'neutral' | 'completed' | 'processing' | 'warning' | 'error';

interface StatusBadgeProps {
    children?: ReactNode;
    status?: StatusType;
    label?: string;
    size?: 'sm' | 'md';
}

export function StatusBadge({ children, status = 'neutral', label, size = 'md' }: StatusBadgeProps) {
    const variants = {
        neutral: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
        completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        processing: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };

    return (
        <span className={cn(
            "inline-flex items-center rounded-full font-bold uppercase tracking-wider whitespace-nowrap border backdrop-blur-sm",
            size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]',
            variants[status]
        )}>
            {status === 'processing' && <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />}
            {label || children}
        </span>
    );
}

// Empty state
interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-12 px-6">
            {Icon && (
                <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Icon className="w-8 h-8 text-slate-300" />
                </div>
            )}
            <h3 className="text-base font-semibold text-slate-200 mb-2 m-0 font-inter">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-slate-300 mb-6 max-w-md mx-auto font-inter">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
