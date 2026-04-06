"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  Workflow,
  ChevronLeft,
  Save,
  Play,
  Pause,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  History,
  Settings,
} from "lucide-react";
import {
  WorkflowBuilder,
  WorkflowCondition,
  WorkflowAction,
} from "@/components/admin/WorkflowBuilder";
import { TriggerType } from "@/lib/automation/workflow-triggers";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface WorkflowRun {
  id: string;
  status: string;
  trigger_type: string;
  actions_executed: number;
  actions_total: number;
  error_message?: string;
  duration_ms?: number;
  created_at: string;
  completed_at?: string;
}

export default function WorkflowDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workflowId = params.id as string;
  const queryClient = useQueryClient();
  const supabase = createClient();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] =
    useState<TriggerType>("article_created");
  const [triggerConfig, setTriggerConfig] = useState<Record<string, any>>({});
  const [conditions, setConditions] = useState<WorkflowCondition[]>([]);
  const [actions, setActions] = useState<WorkflowAction[]>([]);
  const [priority, setPriority] = useState(50);
  const [errors, setErrors] = useState<string[]>([]);

  // Fetch workflow
  const { data: workflow, isLoading } = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("id", workflowId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch runs
  const { data: runs = [] } = useQuery({
    queryKey: ["workflow-runs", workflowId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflow_runs")
        .select("*")
        .eq("workflow_id", workflowId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) return [];
      return data as WorkflowRun[];
    },
  });

  // Populate form when workflow loads
  useEffect(() => {
    if (workflow) {
      setName(workflow.name);
      setDescription(workflow.description || "");
      setTriggerType(workflow.trigger_type);
      setTriggerConfig(workflow.trigger_config || {});
      setConditions(
        (workflow.conditions || []).map((c: any, i: number) => ({
          id: `cond_${i}`,
          ...c,
        })),
      );
      setActions(
        (workflow.actions || []).map((a: any, i: number) => ({
          id: `action_${i}`,
          ...a,
        })),
      );
      setPriority(workflow.priority || 50);
    }
  }, [workflow]);

  // Toggle enabled
  const toggleMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await supabase
        .from("workflows")
        .update({ is_enabled: enabled, updated_at: new Date().toISOString() })
        .eq("id", workflowId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow", workflowId] });
    },
  });

  // Save workflow
  const saveMutation = useMutation({
    mutationFn: async () => {
      const validationErrors: string[] = [];
      if (!name.trim()) validationErrors.push("Workflow name is required");
      if (actions.length === 0)
        validationErrors.push("At least one action is required");

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        throw new Error("Validation failed");
      }

      const { error } = await supabase
        .from("workflows")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          trigger_type: triggerType,
          trigger_config: triggerConfig,
          conditions: conditions.map((c) => ({
            field: c.field,
            operator: c.operator,
            value: c.value,
          })),
          actions: actions.map((a) => ({
            type: a.type,
            config: a.config,
            continue_on_error: a.continue_on_error,
          })),
          priority,
          updated_at: new Date().toISOString(),
        })
        .eq("id", workflowId);

      if (error) throw error;
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["workflow", workflowId] });
    },
    onError: (error) => {
      if ((error as Error).message !== "Validation failed") {
        setErrors(["Failed to save: " + (error as Error).message]);
      }
    },
  });

  // Delete workflow
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("workflows")
        .delete()
        .eq("id", workflowId)
        .eq("is_system", false);
      if (error) throw error;
    },
    onSuccess: () => {
      router.push("/admin/workflows");
    },
  });

  // Run workflow
  const runMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/workflows/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId }),
      });
      if (!response.ok) throw new Error("Failed to run");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workflow-runs", workflowId],
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success-500/20 text-success-400 border-success-500/30";
      case "running":
        return "bg-primary-500/20 text-primary-400 border-primary-500/30";
      case "failed":
        return "bg-danger-500/20 text-danger-400 border-danger-500/30";
      case "skipped":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success-400" />;
      case "running":
        return <RefreshCw className="w-4 h-4 text-primary-400 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-danger-400" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen p-8 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (!workflow) {
    return (
      <AdminLayout>
        <div className="min-h-screen p-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-warning-400" />
              <h2 className="text-xl font-bold text-foreground mb-2">
                Workflow Not Found
              </h2>
              <p className="text-muted-foreground mb-4">
                The workflow you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link href="/admin/workflows">
                <Button>Back to Workflows</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen p-8 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin/workflows">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/25 flex items-center justify-center">
              <Workflow className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {workflow.name}
                </h1>
                <Badge
                  className={
                    workflow.is_enabled
                      ? "bg-success-500/20 text-success-400"
                      : "bg-gray-500/20 text-gray-400"
                  }
                >
                  {workflow.is_enabled ? "Enabled" : "Disabled"}
                </Badge>
                {workflow.is_system && (
                  <Badge className="bg-gray-500/20 text-gray-400">System</Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                {workflow.description || "No description"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {workflow.trigger_type === "manual" && (
              <Button
                variant="outline"
                onClick={() => runMutation.mutate()}
                disabled={runMutation.isPending || !workflow.is_enabled}
                className="gap-2"
              >
                <Play className="w-4 h-4" />
                Run Now
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => toggleMutation.mutate(!workflow.is_enabled)}
              disabled={toggleMutation.isPending}
              className="gap-2"
            >
              {workflow.is_enabled ? (
                <>
                  <Pause className="w-4 h-4" />
                  Disable
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Enable
                </>
              )}
            </Button>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={workflow.is_system}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <Card className="bg-danger-500/10 border-danger-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-danger-400 shrink-0" />
                <ul className="text-sm text-danger-400 list-disc list-inside">
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Stats & Runs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/10 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {workflow.total_runs}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Runs
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/10 rounded-lg">
                    <div className="text-2xl font-bold text-success-400">
                      {workflow.successful_runs}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Successful
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/10 rounded-lg">
                    <div className="text-2xl font-bold text-danger-400">
                      {workflow.failed_runs}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center p-3 bg-muted/10 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {workflow.total_runs > 0
                        ? Math.round(
                            (workflow.successful_runs / workflow.total_runs) *
                              100,
                          )
                        : 100}
                      %
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Success Rate
                    </div>
                  </div>
                </div>

                {workflow.last_run_at && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="text-sm text-muted-foreground">
                      Last Run
                    </div>
                    <div className="text-sm text-foreground">
                      {new Date(workflow.last_run_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Run History */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <History className="w-5 h-5 text-secondary-400" />
                  Recent Runs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {runs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No runs yet
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {runs.map((run) => (
                      <div
                        key={run.id}
                        className="p-3 bg-muted/10 rounded-lg border border-border/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(run.status)}
                            <Badge className={getStatusColor(run.status)}>
                              {run.status}
                            </Badge>
                          </div>
                          {run.duration_ms && (
                            <span className="text-xs text-muted-foreground">
                              {run.duration_ms}ms
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(run.created_at).toLocaleString()}
                        </div>
                        {run.error_message && (
                          <div className="mt-2 p-2 bg-danger-500/10 rounded text-xs text-danger-400">
                            {run.error_message}
                          </div>
                        )}
                        <div className="mt-2 text-xs text-muted-foreground">
                          Actions: {run.actions_executed}/{run.actions_total}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delete */}
            {!workflow.is_system && (
              <Card className="bg-danger-500/10 border-danger-500/30">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-2">
                    Danger Zone
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Deleting this workflow cannot be undone.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this workflow?",
                        )
                      ) {
                        deleteMutation.mutate();
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="gap-2 border-danger-500/50 text-danger-400 hover:bg-danger-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Workflow
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Workflow Builder */}
          <div className="lg:col-span-2">
            {isEditing && (
              <Card className="bg-card/50 border-border/50 mb-6">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Workflow Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <WorkflowBuilder
              triggerType={triggerType}
              triggerConfig={triggerConfig}
              conditions={conditions}
              actions={actions}
              onTriggerTypeChange={setTriggerType}
              onTriggerConfigChange={setTriggerConfig}
              onConditionsChange={setConditions}
              onActionsChange={setActions}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
