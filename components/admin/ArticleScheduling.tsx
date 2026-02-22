"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface ArticleSchedulingProps {
    articleId: string;
    currentStatus: string;
    scheduledPublishAt?: string;
    onScheduled?: () => void;
}

/**
 * Article Scheduling Component
 * 
 * Allows admins to:
 * - Schedule articles for future publication
 * - View current scheduled date
 * - Cancel scheduled publication
 */
export default function ArticleScheduling({
    articleId,
    currentStatus,
    scheduledPublishAt,
    onScheduled
}: ArticleSchedulingProps) {
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [isScheduled, setIsScheduled] = useState(false);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (scheduledPublishAt) {
            const date = new Date(scheduledPublishAt);
            setScheduledDate(date.toISOString().split('T')[0]);
            setScheduledTime(date.toTimeString().split(' ')[0].slice(0, 5));
            setIsScheduled(true);
        } else {
            setIsScheduled(false);
            // Set default to tomorrow at 9 AM
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setScheduledDate(tomorrow.toISOString().split('T')[0]);
            setScheduledTime('09:00');
        }
    }, [scheduledPublishAt]);

    const scheduleMutation = useMutation({
        mutationFn: async (dateTime: string) => {
            const response = await fetch(`/api/admin/articles/${articleId}/schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scheduled_publish_at: dateTime })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to schedule article');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['article', articleId] });
            toast.success('Article scheduled successfully!');
            setIsScheduled(true);
            onScheduled?.();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to schedule article');
        }
    });

    const unscheduleMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/admin/articles/${articleId}/schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scheduled_publish_at: null })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to unschedule article');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['article', articleId] });
            toast.success('Schedule cancelled');
            setIsScheduled(false);
            onScheduled?.();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to cancel schedule');
        }
    });

    const handleSchedule = () => {
        if (!scheduledDate || !scheduledTime) {
            toast.error('Please select both date and time');
            return;
        }

        const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        const now = new Date();

        if (dateTime <= now) {
            toast.error('Scheduled time must be in the future');
            return;
        }

        scheduleMutation.mutate(dateTime.toISOString());
    };

    const handleUnschedule = () => {
        unscheduleMutation.mutate();
    };

    const scheduledDateTime = scheduledDate && scheduledTime 
        ? new Date(`${scheduledDate}T${scheduledTime}`)
        : null;

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Publication
            </h3>

            {isScheduled && scheduledPublishAt ? (
                <div className="bg-wt-gold-subtle bg-wt-gold-subtle border border-wt-border-light border-wt-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-wt-gold dark:text-wt-gold mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-wt-text text-wt-text">
                                    Scheduled for Publication
                                </p>
                                <p className="text-sm text-wt-gold text-wt-text-muted mt-1">
                                    {new Date(scheduledPublishAt).toLocaleString('en-IN', {
                                        dateStyle: 'full',
                                        timeStyle: 'short'
                                    })}
                                </p>
                                <p className="text-xs text-wt-gold dark:text-wt-gold mt-2">
                                    Article will be published automatically at the scheduled time.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleUnschedule}
                            disabled={unscheduleMutation.isPending}
                            className="text-wt-gold dark:text-wt-gold hover:text-wt-gold dark:hover:text-primary-300"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="schedule-date" className="text-slate-700 dark:text-slate-200">
                            Publication Date
                        </Label>
                        <Input
                            id="schedule-date"
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="mt-1 bg-white dark:bg-surface-darker border-wt-border text-slate-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <Label htmlFor="schedule-time" className="text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Publication Time (IST)
                        </Label>
                        <Input
                            id="schedule-time"
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="mt-1 bg-white dark:bg-surface-darker border-wt-border text-slate-900 dark:text-white"
                        />
                    </div>

                    {scheduledDateTime && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Will publish on:{' '}
                            <span className="font-semibold">
                                {scheduledDateTime.toLocaleString('en-IN', {
                                    dateStyle: 'full',
                                    timeStyle: 'short'
                                })}
                            </span>
                        </div>
                    )}

                    <Button
                        onClick={handleSchedule}
                        disabled={scheduleMutation.isPending || !scheduledDate || !scheduledTime}
                        className="w-full bg-wt-gold hover:bg-wt-gold-hover text-slate-900 hover:text-black"
                    >
                        {scheduleMutation.isPending ? 'Scheduling...' : 'Schedule Publication'}
                    </Button>
                </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">
                Scheduled articles will be published automatically every 15 minutes by the cron job.
            </p>
        </div>
    );
}
