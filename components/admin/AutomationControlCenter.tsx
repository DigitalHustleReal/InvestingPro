/**
 * Automation Control Center Component
 * Phase 1: Critical Security & Stability
 */

"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Play,
    Pause,
    AlertTriangle,
    CheckCircle2,
    Clock,
    XCircle,
    Activity,
    Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface AutomationStatus {
    isRunning: boolean;
    isPaused: boolean;
    runningWorkflows: number;
    failedWorkflows: number;
    stuckWorkflows: number;
    lastCycleTime?: string;
    nextCycleTime?: string;
}

interface WorkflowStatus {
    id: string;
    workflowId: string;
    state: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
    startedAt: string;
    currentStep?: string;
    error?: string;
    duration?: number;
    isStuck: boolean;
}

export default function AutomationControlCenter() {
    const [status, setStatus] = useState<AutomationStatus | null>(null);
    const [workflows, setWorkflows] = useState<WorkflowStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchStatus = async () => {
        try {
            const response = await fetch('/api/v1/admin/automation/status');
            if (!response.ok) throw new Error('Failed to fetch status');
            
            const data = await response.json();
            setStatus(data.status);
            setWorkflows(data.workflows || []);
        } catch (error) {
            toast.error('Failed to load automation status');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handlePause = async () => {
        setActionLoading(true);
        try {
            const response = await fetch('/api/v1/admin/automation/pause', { method: 'POST' });
            if (!response.ok) throw new Error('Failed to pause');
            toast.success('Automation paused');
            await fetchStatus();
        } catch (error) {
            toast.error('Failed to pause automation');
        } finally {
            setActionLoading(false);
        }
    };

    const handleResume = async () => {
        setActionLoading(true);
        try {
            const response = await fetch('/api/v1/admin/automation/resume', { method: 'POST' });
            if (!response.ok) throw new Error('Failed to resume');
            toast.success('Automation resumed');
            await fetchStatus();
        } catch (error) {
            toast.error('Failed to resume automation');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEmergencyStop = async () => {
        if (!confirm('Are you sure you want to execute an emergency stop? This will pause all automation and cancel running workflows.')) {
            return;
        }
        
        setActionLoading(true);
        try {
            const response = await fetch('/api/v1/admin/automation/emergency-stop', { method: 'POST' });
            if (!response.ok) throw new Error('Failed to execute emergency stop');
            toast.success('Emergency stop executed');
            await fetchStatus();
        } catch (error) {
            toast.error('Failed to execute emergency stop');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div>Loading automation status...</div>;
    }

    if (!status) {
        return <Alert><AlertDescription>Failed to load automation status</AlertDescription></Alert>;
    }

    const getStateColor = (state: string) => {
        switch (state) {
            case 'completed': return 'bg-green-500';
            case 'running': return 'bg-secondary-500';
            case 'failed': return 'bg-red-500';
            case 'paused': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6">
            {/* Status Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Automation Status
                    </CardTitle>
                    <CardDescription>Real-time automation and workflow status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{status.runningWorkflows}</div>
                            <div className="text-sm text-muted-foreground">Running</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">{status.failedWorkflows}</div>
                            <div className="text-sm text-muted-foreground">Failed (24h)</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">{status.stuckWorkflows}</div>
                            <div className="text-sm text-muted-foreground">Stuck</div>
                        </div>
                        <div className="text-center">
                            <Badge variant={status.isPaused ? 'destructive' : 'default'}>
                                {status.isPaused ? 'Paused' : 'Active'}
                            </Badge>
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex gap-2">
                        {status.isPaused ? (
                            <Button onClick={handleResume} disabled={actionLoading}>
                                <Play className="h-4 w-4 mr-2" />
                                Resume Automation
                            </Button>
                        ) : (
                            <Button onClick={handlePause} disabled={actionLoading} variant="outline">
                                <Pause className="h-4 w-4 mr-2" />
                                Pause Automation
                            </Button>
                        )}
                        <Button 
                            onClick={handleEmergencyStop} 
                            disabled={actionLoading}
                            variant="destructive"
                        >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Emergency Stop
                        </Button>
                    </div>

                    {/* Alerts */}
                    {status.stuckWorkflows > 0 && (
                        <Alert className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                {status.stuckWorkflows} workflow(s) have been running for over 1 hour. Consider investigating.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Workflow List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Workflows</CardTitle>
                    <CardDescription>Latest workflow executions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {workflows.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                No workflows found
                            </div>
                        ) : (
                            workflows.map((workflow) => (
                                <div
                                    key={workflow.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getStateColor(workflow.state)}`} />
                                        <div>
                                            <div className="font-medium">{workflow.workflowId}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {workflow.currentStep && `Step: ${workflow.currentStep}`}
                                                {workflow.duration && ` • ${Math.round(workflow.duration / 1000)}s`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={workflow.isStuck ? 'destructive' : 'outline'}>
                                            {workflow.state}
                                        </Badge>
                                        {workflow.isStuck && (
                                            <Badge variant="destructive">Stuck</Badge>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
