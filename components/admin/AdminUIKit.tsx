'use client';

import { ReactNode } from 'react';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconColor?: 'teal' | 'purple' | 'blue' | 'amber' | 'rose';
    actions?: ReactNode;
    showBreadcrumb?: boolean;
}

const iconColorClasses = {
    teal: 'bg-admin-pro-accent-subtle text-admin-pro-accent',
    purple: 'bg-admin-pro-accent-subtle text-admin-pro-accent',
    blue: 'bg-admin-pro-accent-subtle text-admin-pro-accent',
    amber: 'bg-admin-pro-accent-subtle text-admin-pro-accent',
    rose: 'bg-admin-pro-danger-subtle text-admin-pro-danger',
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
                            w-14 h-14 rounded-xl bg-gradient-to-br ${iconColorClasses[iconColor]}
                            flex items-center justify-center shadow-lg
                        `}>
                            <Icon className="w-7 h-7 text-foreground dark:text-foreground" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-admin-pro-text tracking-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-admin-pro-text-muted mt-1 text-sm md:text-base">
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
    const changeColors = {
        positive: 'text-admin-pro-accent',
        negative: 'text-admin-pro-danger',
        neutral: 'text-admin-pro-text-muted',
    };

    return (
        <div className="rounded-xl border border-admin-pro-border bg-admin-pro-surface p-5 transition-colors hover:border-admin-pro-border-light hover:bg-admin-pro-surface-hover/50">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-medium text-admin-pro-text-muted uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-semibold text-admin-pro-text mt-1 tabular-nums">{value}</p>
                    {change && (
                        <p className={`text-xs mt-1 ${changeColors[changeType]}`}>{change}</p>
                    )}
                </div>
                {Icon && (
                    <div className="w-10 h-10 rounded-lg bg-admin-pro-border flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-admin-pro-text-muted" />
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
        <section className="rounded-xl border border-admin-pro-border bg-admin-pro-surface overflow-hidden">
            {(title || actions) && (
                <div className="px-5 py-4 border-b border-admin-pro-border flex items-center justify-between gap-4">
                    <div>
                        {title && <h2 className="text-sm font-semibold text-admin-pro-text">{title}</h2>}
                        {subtitle && <p className="text-xs text-admin-pro-text-muted mt-0.5">{subtitle}</p>}
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
    onClick?: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md';
    disabled?: boolean;
    icon?: LucideIcon;
}

/**
 * ActionButton - Consolidated to use main Button component
 * Maintains backward compatibility while using unified button system
 * Admin-specific styling preserved through className overrides
 */
export function ActionButton({ 
    onClick, 
    children, 
    variant = 'primary', 
    size = 'md',
    disabled = false,
    icon: Icon 
}: ActionButtonProps) {
    // Map ActionButton variants to Button component variants
    const buttonVariantMap: Record<typeof variant, 'default' | 'secondary' | 'ghost' | 'destructive'> = {
        primary: 'default',
        secondary: 'secondary',
        ghost: 'ghost',
        danger: 'destructive',
    };

    const buttonSizeMap: Record<typeof size, 'sm' | 'default'> = {
        sm: 'sm',
        md: 'default',
    };

    const adminStyles = {
        primary: 'bg-admin-pro-accent hover:bg-admin-pro-accent-hover text-white border-0 shadow-admin-pro-accent/20',
        secondary: 'bg-admin-pro-surface border border-admin-pro-border hover:bg-admin-pro-surface-hover text-admin-pro-text',
        ghost: 'hover:bg-admin-pro-surface text-admin-pro-text-muted hover:text-admin-pro-text',
        danger: 'bg-admin-pro-danger-subtle text-admin-pro-danger border border-admin-pro-danger/30 hover:bg-admin-pro-danger/20',
    };

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            variant={buttonVariantMap[variant]}
            size={buttonSizeMap[size]}
            className={adminStyles[variant]}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </Button>
    );
}

// Table wrapper with consistent styling
interface DataTableProps {
    children: ReactNode;
}

export function DataTable({ children }: DataTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-admin-pro-border bg-admin-pro-surface">
            <table className="w-full">
                {children}
            </table>
        </div>
    );
}

export function TableHeader({ children }: { children: ReactNode }) {
    return (
        <thead className="bg-admin-pro-surface">
            <tr className="border-b border-admin-pro-border">
                {children}
            </tr>
        </thead>
    );
}

export function TableHeaderCell({ children, className = '' }: { children?: ReactNode; className?: string }) {
    return (
        <th className={`px-4 py-3 text-left text-[11px] font-medium text-admin-pro-text-muted uppercase tracking-wider ${className}`}>
            {children}
        </th>
    );
}

export function TableBody({ children }: { children: ReactNode }) {
    return <tbody className="divide-y divide-admin-pro-border">{children}</tbody>;
}

export function TableRow({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
    return (
        <tr
            onClick={onClick}
            className={`hover:bg-admin-pro-surface-hover transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </tr>
    );
}

export function TableCell({ children, className = '' }: { children?: ReactNode; className?: string }) {
    return (
        <td className={`px-4 py-3 text-sm text-admin-pro-text ${className}`}>
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
        default: 'bg-admin-pro-surface text-admin-pro-text border border-admin-pro-border',
        success: 'bg-admin-pro-accent-subtle text-admin-pro-accent border border-admin-pro-accent/30',
        warning: 'bg-admin-pro-accent-subtle text-admin-pro-accent border border-admin-pro-accent/30',
        danger: 'bg-admin-pro-danger-subtle text-admin-pro-danger border border-admin-pro-danger/30',
        info: 'bg-admin-pro-accent-subtle text-admin-pro-accent border border-admin-pro-accent/30',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium ${variants[variant]}`}>
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
                <div className="w-16 h-16 rounded-xl bg-admin-pro-surface border border-admin-pro-border flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-admin-pro-text-muted" />
                </div>
            )}
            <h3 className="text-base font-semibold text-admin-pro-text mb-2">{title}</h3>
            {description && <p className="text-sm text-admin-pro-text-muted mb-6 max-w-md mx-auto">{description}</p>}
            {action}
        </div>
    );
}
