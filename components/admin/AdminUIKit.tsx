'use client';

import { ReactNode } from 'react';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconColor?: 'teal' | 'purple' | 'blue' | 'amber' | 'rose';
    actions?: ReactNode;
    showBreadcrumb?: boolean;
}

const iconColorClasses = {
    teal: 'from-teal-500 to-emerald-500 shadow-teal-500/25',
    purple: 'from-secondary-500 to-pink-500 shadow-purple-500/25',
    blue: 'from-secondary-500 to-cyan-500 shadow-blue-500/25',
    amber: 'from-amber-500 to-orange-500 shadow-amber-500/25',
    rose: 'from-rose-500 to-red-500 shadow-rose-500/25',
};

export function AdminPageHeader({
    title,
    subtitle,
    icon: Icon,
    iconColor = 'teal',
    actions,
    showBreadcrumb = true,
}: AdminPageHeaderProps) {
    return (
        <div className="mb-8">
            {showBreadcrumb && <AdminBreadcrumb />}
            
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className={`
                            w-14 h-14 rounded-2xl bg-gradient-to-br ${iconColorClasses[iconColor]}
                            flex items-center justify-center shadow-lg
                        `}>
                            <Icon className="w-7 h-7 text-white" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-slate-400 mt-1 text-sm md:text-base">
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

export function StatCard({ label, value, change, changeType = 'neutral', icon: Icon, color = 'teal' }: StatCardProps) {
    const borderColors = {
        teal: 'border-teal-500/20 hover:border-teal-500/40',
        purple: 'border-secondary-500/20 hover:border-secondary-500/40',
        blue: 'border-secondary-500/20 hover:border-secondary-500/40',
        amber: 'border-amber-500/20 hover:border-amber-500/40',
        rose: 'border-rose-500/20 hover:border-rose-500/40',
    };

    const changeColors = {
        positive: 'text-emerald-400',
        negative: 'text-rose-400',
        neutral: 'text-slate-400',
    };

    return (
        <div className={`
            bg-slate-900/50 backdrop-blur-xl rounded-xl border ${borderColors[color]}
            p-5 transition-all duration-300 hover:bg-slate-900/70
        `}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                    {change && (
                        <p className={`text-xs mt-1 ${changeColors[changeType]}`}>{change}</p>
                    )}
                </div>
                {Icon && (
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-400" />
                    </div>
                )}
            </div>
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
        <section className="bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
            {(title || actions) && (
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <div>
                        {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
                        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
                    </div>
                    {actions}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </section>
    );
}

// Action button variants
interface ActionButtonProps {
    onClick?: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md';
    disabled?: boolean;
    icon?: LucideIcon;
}

export function ActionButton({ 
    onClick, 
    children, 
    variant = 'primary', 
    size = 'md',
    disabled = false,
    icon: Icon 
}: ActionButtonProps) {
    const variants = {
        primary: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40',
        secondary: 'bg-white/10 text-white border border-white/10 hover:bg-white/20',
        ghost: 'text-slate-400 hover:text-white hover:bg-white/10',
        danger: 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                ${variants[variant]} ${sizes[size]}
                rounded-lg font-medium transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
            `}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
}

// Table wrapper with consistent styling
interface DataTableProps {
    children: ReactNode;
}

export function DataTable({ children }: DataTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                {children}
            </table>
        </div>
    );
}

export function TableHeader({ children }: { children: ReactNode }) {
    return (
        <thead className="bg-slate-800/50">
            <tr className="border-b border-white/5">
                {children}
            </tr>
        </thead>
    );
}

export function TableHeaderCell({ children, className = '' }: { children?: ReactNode; className?: string }) {
    return (
        <th className={`px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${className}`}>
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
            className={`
                hover:bg-white/5 transition-colors
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
        >
            {children}
        </tr>
    );
}

export function TableCell({ children, className = '' }: { children?: ReactNode; className?: string }) {
    return (
        <td className={`px-4 py-4 text-sm text-slate-300 ${className}`}>
            {children}
        </td>
    );
}

// Badge component
interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function StatusBadge({ children, variant = 'default' }: BadgeProps) {
    const variants = {
        default: 'bg-slate-700 text-slate-300',
        success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        danger: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
        info: 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30',
    };

    return (
        <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${variants[variant]}
        `}>
            {children}
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
        <div className="text-center py-12">
            {Icon && (
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-slate-500" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            {description && <p className="text-slate-400 mb-6 max-w-md mx-auto">{description}</p>}
            {action}
        </div>
    );
}
