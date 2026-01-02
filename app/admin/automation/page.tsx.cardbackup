"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AutomationControls from '@/components/admin/AutomationControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Database, Rss, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function AutomationPage() {
    // Fetch pipeline stats for the header
    const { data: pipelineStatus = { completed: 0, failed: 0, lastRun: null } } = useQuery({
        queryKey: ['pipeline-status-summary'],
        queryFn: async () => {
            const response = await fetch('/api/pipeline/runs?limit=100');
            if (!response.ok) return { completed: 0, failed: 0 };
            const data = await response.json();
            const runs = data.runs || [];
            return {
                completed: runs.filter((r: any) => r.status === 'completed').length,
                failed: runs.filter((r: any) => r.status === 'failed').length,
                lastRun: runs[0]?.started_at
            };
        },
        refetchInterval: 30000
    });

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Automation Factory</h1>
                    <p className="text-slate-600">Control and monitor the AI-driven content generation pipeline.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                Successful Jobs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{pipelineStatus.completed}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                                <XCircleIcon className="w-4 h-4 text-red-500" />
                                Failed Jobs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{pipelineStatus.failed}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                                <ClockIcon className="w-4 h-4 text-blue-500" />
                                Last Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold text-slate-900">
                                {pipelineStatus.lastRun ? new Date(pipelineStatus.lastRun).toLocaleTimeString() : 'Never'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <AutomationControls />
            </div>
        </AdminLayout>
    );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function XCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
