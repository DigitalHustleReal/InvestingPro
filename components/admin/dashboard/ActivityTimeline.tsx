"use client";

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';
import { AdminCard } from '@/components/admin/system/AdminCard';
import { cn } from '@/lib/utils';

interface ActivityItem {
    id: string;
    title: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export default function ActivityTimeline({ activities = [] }: { activities: ActivityItem[] }) {
    
    // Status color mapping
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'published': return 'bg-success';
            case 'draft': return 'bg-muted-foreground';
            default: return 'bg-primary';
        }
    };

    if (!activities.length) {
        return (
            <AdminCard noPadding className="h-full flex flex-col">
                <div className="px-6 py-5 pb-3 text-[15px] font-bold text-foreground">Recent Activity</div>
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Clock className="w-8 h-8 opacity-25 mb-2" />
                    <p className="text-sm">No recent activity</p>
                </div>
            </AdminCard>
        );
    }

    return (
        <AdminCard noPadding glass className="h-full flex flex-col animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
            <div className="px-5 py-4 pb-2 text-[15px] font-bold text-white uppercase tracking-wider">Recent Activity</div>

            <div className="px-5 py-2 pb-5 relative flex-1 overflow-y-auto min-h-[300px] flex flex-col justify-center">
                {activities.length > 0 ? (
                    <>
                        {/* Vertical timeline line */}
                        <div className="absolute left-6 top-4 bottom-4 w-px bg-border" />

                        {activities.map((item) => (
                            <div key={item.id} className="relative flex gap-3 pb-4">
                                {/* Dot */}
                                <div className={cn(
                                    "relative z-10 mt-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-card shrink-0",
                                    getStatusColor(item.status)
                                )} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-[13px] font-bold text-white">
                                            {item.status === 'published' ? 'Published' :
                                            item.status === 'draft' ? 'Created draft' : 'Updated'}
                                        </p>
                                        <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                                            {formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-slate-300 font-medium overflow-hidden text-ellipsis whitespace-nowrap mt-0.5">
                                        {item.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-10 opacity-40">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <Clock className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-300">No recent activity</p>
                        <p className="text-[11px] text-slate-500 mt-1">Sync your pipeline to see updates here.</p>
                    </div>
                )}
            </div>
        </AdminCard>
    );
}

