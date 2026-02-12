"use client";

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';
import { AdminCard } from '@/components/admin/system/AdminCard';
import { ADMIN_THEME } from '@/lib/admin/theme';

interface ActivityItem {
    id: string;
    title: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export default function ActivityTimeline({ activities = [] }: { activities: ActivityItem[] }) {
    
    // Status color mapping using Theme
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'published': return ADMIN_THEME.colors.status.success.icon;
            case 'draft': return ADMIN_THEME.colors.text.light;
            default: return ADMIN_THEME.colors.accent.default;
        }
    };

    const headerStyle: React.CSSProperties = {
        padding: '20px 24px 12px',
        fontSize: '15px',
        fontWeight: 700,
        color: ADMIN_THEME.colors.text.main,
    };

    if (!activities.length) {
        return (
            <AdminCard noPadding style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={headerStyle}>Recent Activity</div>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px 0',
                    color: ADMIN_THEME.colors.text.light,
                }}>
                    <Clock style={{ width: 32, height: 32, opacity: 0.25, marginBottom: 8 }} />
                    <p style={{ fontSize: '14px' }}>No recent activity</p>
                </div>
            </AdminCard>
        );
    }

    return (
        <AdminCard noPadding style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={headerStyle}>Recent Activity</div>

            <div style={{
                padding: '8px 24px 24px',
                position: 'relative',
                flex: 1,
                overflowY: 'auto',
            }}>
                {/* Vertical timeline line */}
                <div style={{
                    position: 'absolute',
                    left: 28,
                    top: 16,
                    bottom: 16,
                    width: 1,
                    backgroundColor: ADMIN_THEME.colors.border.subtle,
                }} />

                {activities.map((item) => (
                    <div key={item.id} style={{
                        position: 'relative',
                        display: 'flex',
                        gap: 16,
                        paddingBottom: 20,
                    }}>
                        {/* Dot */}
                        <div style={{
                            position: 'relative',
                            zIndex: 1,
                            marginTop: 6,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: getStatusColor(item.status),
                            boxShadow: `0 0 0 4px ${ADMIN_THEME.colors.bg.surface}`,
                            flexShrink: 0,
                        }} />

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 8,
                            }}>
                                <p style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: ADMIN_THEME.colors.text.main,
                                }}>
                                    {item.status === 'published' ? 'Published' :
                                     item.status === 'draft' ? 'Created draft' : 'Updated'}
                                </p>
                                <span style={{
                                    fontSize: '11px',
                                    color: ADMIN_THEME.colors.text.light,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                }}>
                                    {formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}
                                </span>
                            </div>
                            <p style={{
                                fontSize: '13px',
                                color: ADMIN_THEME.colors.text.muted,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                marginTop: 2,
                            }}>{item.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </AdminCard>
    );
}

