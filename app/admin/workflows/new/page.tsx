"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Workflow, ChevronLeft, Save, Play, AlertTriangle } from "lucide-react";
import {
  WorkflowBuilder,
  WorkflowCondition,
  WorkflowAction,
} from "@/components/admin/WorkflowBuilder";
import { TriggerType } from "@/lib/automation/workflow-triggers";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewWorkflowPage() {
  const router = useRouter();
  const supabase = createClient();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] =
    useState<TriggerType>("article_created");
  const [triggerConfig, setTriggerConfig] = useState<Record<string, any>>({});
  const [conditions, setConditions] = useState<WorkflowCondition[]>([]);
  const [actions, setActions] = useState<WorkflowAction[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [priority, setPriority] = useState(50);

  // Validation
  const [errors, setErrors] = useState<string[]>([]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      // Validate
      const validationErrors: string[] = [];
      if (!name.trim()) validationErrors.push("Workflow name is required");
      if (actions.length === 0)
        validationErrors.push("At least one action is required");

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        throw new Error("Validation failed");
      }

      // Create workflow
      const { data, error } = await supabase
        .from("workflows")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          slug: name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
          is_enabled: isEnabled,
          is_system: false,
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      router.push(`/admin/workflows/${data.id}`);
    },
    onError: (error) => {
      if ((error as Error).message !== "Validation failed") {
        setErrors(["Failed to create workflow: " + (error as Error).message]);
      }
    },
  });

  // Test run mutation
  const testMutation = useMutation({
    mutationFn: async () => {
      // For now, just validate
      const validationErrors: string[] = [];
      if (!name.trim()) validationErrors.push("Workflow name is required");
      if (actions.length === 0)
        validationErrors.push("At least one action is required");

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        throw new Error("Validation failed");
      }

      // In real implementation, this would run the workflow in dry-run mode
      return { success: true, message: "Workflow is valid!" };
    },
  });

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
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Create Workflow
              </h1>
              <p className="text-muted-foreground mt-1">
                Build an automated workflow with triggers, conditions, and
                actions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => testMutation.mutate()}
              disabled={testMutation.isPending}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Test
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? "Saving..." : "Save Workflow"}
            </Button>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <Card className="bg-danger-500/10 border-danger-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-danger-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-danger-400 mb-1">
                    Please fix the following:
                  </h4>
                  <ul className="text-sm text-danger-400 list-disc list-inside">
                    {errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Basic Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Workflow Name <span className="text-danger-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Auto-Publish Quality Content"
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
                    placeholder="What does this workflow do?"
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Priority
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={priority}
                      onChange={(e) => setPriority(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-8">
                      {priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher priority workflows run first when multiple match
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => setIsEnabled(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-foreground">
                      Enable workflow immediately
                    </span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-primary-500/10 border-primary-500/20">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-2">Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    • <strong>Trigger</strong>: What starts the workflow
                  </li>
                  <li>
                    • <strong>Conditions</strong>: Filter when to run (optional)
                  </li>
                  <li>
                    • <strong>Actions</strong>: What to do when triggered
                  </li>
                  <li>• Actions run in order, top to bottom</li>
                  <li>• Use "Test" to validate before saving</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right: Workflow Builder */}
          <div className="lg:col-span-2">
            <WorkflowBuilder
              triggerType={triggerType}
              triggerConfig={triggerConfig}
              conditions={conditions}
              actions={actions}
              onTriggerTypeChange={setTriggerType}
              onTriggerConfigChange={setTriggerConfig}
              onConditionsChange={setConditions}
              onActionsChange={setActions}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
