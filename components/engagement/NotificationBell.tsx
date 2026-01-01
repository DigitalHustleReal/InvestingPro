"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, ExternalLink, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // Fetch notifications
    const { data, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await fetch('/api/notifications?limit=10');
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        },
        refetchInterval: 60000, // Refresh every minute
        enabled: isOpen
    });

    // Fetch unread count
    const { data: countData } = useQuery({
        queryKey: ['notification-count'],
        queryFn: async () => {
            const response = await fetch('/api/notifications?countOnly=true');
            if (!response.ok) return { count: 0 };
            return response.json();
        },
        refetchInterval: 30000 // Refresh every 30 seconds
    });

    const unreadCount = countData?.count || 0;
    const notifications: Notification[] = data?.notifications || [];

    // Mark as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notification-count'] });
        }
    });

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            await fetch('/api/notifications/read-all', { method: 'POST' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notification-count'] });
        }
    });

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'new_article': return '📄';
            case 'price_alert': return '📈';
            case 'update': return '🔔';
            case 'promotion': return '🎉';
            default: return '📢';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    isOpen 
                        ? "bg-indigo-500/10 text-indigo-500" 
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-500 hover:bg-slate-200 dark:hover:bg-white/10"
                )}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10">
                        <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAllAsReadMutation.mutate()}
                                className="text-xs text-indigo-600 dark:text-indigo-400"
                            >
                                <Check className="w-3 h-3 mr-1" />
                                Mark all read
                            </Button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="py-8 text-center">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer",
                                            !notification.is_read && "bg-indigo-50/50 dark:bg-indigo-500/5"
                                        )}
                                        onClick={() => {
                                            if (!notification.is_read) {
                                                markAsReadMutation.mutate(notification.id);
                                            }
                                            if (notification.link) {
                                                window.location.href = notification.link;
                                            }
                                        }}
                                    >
                                        <div className="flex gap-3">
                                            <span className="text-lg">{getTypeIcon(notification.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
                                                        {notification.title}
                                                    </span>
                                                    {!notification.is_read && (
                                                        <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <span className="text-[10px] text-slate-400 mt-1 block">
                                                    {formatTime(notification.created_at)}
                                                </span>
                                            </div>
                                            {notification.link && (
                                                <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                <p className="text-sm text-slate-500">No notifications yet</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-slate-200 dark:border-white/10 text-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-slate-500 hover:text-indigo-600"
                                onClick={() => {
                                    setIsOpen(false);
                                    window.location.href = '/notifications';
                                }}
                            >
                                View all notifications
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
