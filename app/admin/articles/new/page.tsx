"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ArticleInspector from "@/components/admin/ArticleInspector";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { Input } from "@/components/ui/input";
import type { ArticleData } from "@/lib/cms/article-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  Loader2,
  ArrowLeft,
  Eye,
  Globe,
  Sparkles,
  Clock,
  CheckCheck,
} from "lucide-react";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FormField } from "@/components/forms/FormField";
import {
  validateForm,
  articleValidationRules,
  getCharacterCount,
} from "@/lib/forms/validation";
import { useAutoSave } from "@/lib/hooks/useAutoSave";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { PreviewPane } from "@/components/admin/preview/PreviewPane";
import { cn } from "@/lib/utils";
import { formatErrorForUI } from "@/lib/errors/user-friendly-messages";
import TemplateSelector from "@/components/admin/TemplateSelector";
import type { ContentTemplate } from "@/lib/cms/templates";
import { LayoutTemplate } from "lucide-react";

// Helper to format time ago
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewArticlePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [editorContent, setEditorContent] = useState<{
    markdown: string;
    html: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showInspector, setShowInspector] = useState(true);
  const [isProofreading, setIsProofreading] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const pendingPublishRef = React.useRef(false);

  // Validate form on change
  useEffect(() => {
    const errors = validateForm({ title, excerpt }, articleValidationRules);
    setValidationErrors(errors);
  }, [title, excerpt]);

  // Handle Proofread
  const handleProofread = async () => {
    if (!editorContent?.markdown) return;

    if (
      !confirm(
        "This will replace current content with AI-polished version. Continue?",
      )
    )
      return;

    setIsProofreading(true);
    try {
      const res = await fetch("/api/admin/editor-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "proofread",
          content: editorContent.markdown,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setEditorContent({
        markdown: json.polished_content,
        html: editorContent.html, // TipTap will re-generate HTML on mount
      });

      setEditorKey((prev) => prev + 1);
      toast.success("Content Proofread & Polished!");
    } catch (e: any) {
      toast.error(formatErrorForUI(e));
    } finally {
      setIsProofreading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            body_markdown: data.body_markdown || "",
            body_html: data.body_html || "",
            content: data.body_markdown || "",
          },
          metadata: {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || "",
            category: data.category || "investing-basics",
            tags: data.tags || [],
            seo_title: data.seo_title || data.title,
            seo_description: data.meta_description || data.excerpt,
            featured_image: data.featured_image,
            read_time: data.read_time,
            language: data.language || "en",
            author_id: data.author_id || undefined,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create article");
      }

      return await response.json();
    },
    onSuccess: async (result) => {
      setSaving(false);
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ["articles", "admin"] });

      if (result && result.id) {
        setArticleId(result.id);

        // If publish was requested, do it now that we have an ID
        if (pendingPublishRef.current) {
          pendingPublishRef.current = false;
          try {
            const response = await fetch(`/api/admin/articles/${result.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                metadata: {
                  status: "published",
                  published_at: new Date().toISOString(),
                },
              }),
            });
            if (!response.ok) {
              const err = await response
                .json()
                .catch(() => ({ error: "Failed to publish" }));
              throw new Error(err.error || "Failed to publish");
            }
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            toast.success("Article published!");
            router.push("/admin/articles");
            return;
          } catch (error: any) {
            toast.error(
              "Created as draft, but publish failed: " +
                formatErrorForUI(error),
            );
          }
        } else {
          toast.success("Article created and saved as draft");
        }
        // We stay on the page now as it supports auto-save once articleId is set
      }
    },
    onError: (error: any) => {
      setSaving(false);
      const errorMessage = formatErrorForUI(error);

      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate")
      ) {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        toast.error("Article with this title exists. Redirecting...");
        setTimeout(() => router.push(`/admin/articles?slug=${slug}`), 1500);
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!articleId) throw new Error("Article ID not found");

      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            body_markdown: data.body_markdown || "",
            body_html: data.body_html || "",
            content: data.body_markdown || "",
          },
          metadata: {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || "",
            category: data.category || "investing-basics",
            tags: data.tags || [],
            seo_title: data.seo_title || data.title,
            seo_description: data.meta_description || data.excerpt,
            featured_image: data.featured_image,
            read_time: data.read_time,
            language: data.language || "en",
            author_id: data.author_id || undefined,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update article");
      }

      return await response.json();
    },
    onSuccess: () => {
      setSaving(false);
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ["articles", "admin"] });
    },
    onError: (error: any) => {
      setSaving(false);
      toast.error(formatErrorForUI(error));
    },
  });

  const handleSave = async (metadata: any = {}) => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const meta = typeof metadata === "object" ? metadata : {};

    // Generate slug early so validation can check it
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Validate with slug and category included
    const validationValues = {
      title,
      excerpt,
      slug,
      category: meta.category || "investing-basics",
      ...meta,
    };
    const errors = validateForm(validationValues, articleValidationRules);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fix the form errors before saving");
      return;
    }

    if (!editorContent) {
      toast.error("No content to save");
      return;
    }

    setSaving(true);

    const saveData = {
      title,
      slug,
      body_markdown: editorContent.markdown,
      body_html: editorContent.html,
      excerpt,
      ...meta,
    };

    if (articleId) {
      await updateMutation.mutateAsync(saveData);
    } else {
      await createMutation.mutateAsync(saveData);
    }
  };

  // Auto-save hook
  const formData = useMemo(
    () => ({
      title,
      excerpt,
      content: editorContent,
    }),
    [title, excerpt, editorContent],
  );

  const {
    isSaving: isAutoSaving,
    lastSaved: autoSaveLastSaved,
    hasUnsavedChanges,
  } = useAutoSave(formData, {
    saveFn: async () => {
      if (!articleId) return; // Only auto-save once we have an ID
      await handleSave({});
    },
    enabled: !!articleId && !!editorContent && title.trim().length > 0,
    interval: 30000,
  });

  const effectiveLastSaved = autoSaveLastSaved || lastSaved;

  useUnsavedChanges({
    enabled: hasUnsavedChanges && !isAutoSaving,
    message: "You have unsaved changes. Are you sure you want to leave?",
  });

  const handlePublish = async (metadata: any = {}) => {
    const confirmed = window.confirm(
      "Publish this article? It will be visible to all users.",
    );
    if (!confirmed) return;

    // If we already have an articleId, save content first then publish via PATCH
    if (articleId) {
      // First save the latest content
      await handleSave({ ...metadata });
      // Then publish via PATCH (uses quickSaveMetadata which respects status)
      try {
        const response = await fetch(`/api/admin/articles/${articleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metadata: {
              status: "published",
              published_at: new Date().toISOString(),
            },
          }),
        });
        if (!response.ok) {
          const err = await response
            .json()
            .catch(() => ({ error: "Failed to publish" }));
          throw new Error(err.error || "Failed to publish");
        }
        queryClient.invalidateQueries({ queryKey: ["articles", "admin"] });
        toast.success("Article published!");
        router.push("/admin/articles");
      } catch (error: any) {
        toast.error(formatErrorForUI(error));
      }
    } else {
      // No articleId yet — create as draft first, then publish in onSuccess
      pendingPublishRef.current = true;
      await handleSave({ ...metadata });
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <AdminLayout
      showInspector={showInspector}
      onInspectorClose={() => setShowInspector(false)}
      inspectorContent={
        <ArticleInspector
          article={{
            title,
            excerpt,
            body_markdown: editorContent?.markdown || "",
            body_html: editorContent?.html || "",
            content: editorContent?.markdown || "",
            category: "investing-basics",
          }}
          onSave={(metadata) => {
            if (metadata.excerpt !== undefined) setExcerpt(metadata.excerpt);
            handleSave(metadata);
          }}
          onPublish={handlePublish}
          onPreview={handlePreview}
          saving={saving || isAutoSaving}
        />
      }
    >
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-surface-darkest transition-colors duration-300">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-surface-darker/50 backdrop-blur-md px-8 py-4">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/admin/articles"
                className="flex items-center gap-2 text-muted-foreground/70 hover:text-gray-900 dark:hover:text-foreground transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Articles
              </Link>
              {!articleId && !editorContent?.markdown && (
                <button
                  onClick={() => setShowTemplates(true)}
                  className="flex items-center gap-1.5 text-sm text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors ml-auto"
                >
                  <LayoutTemplate className="w-4 h-4" />
                  Start from Template
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <FormField
                  label=""
                  name="title"
                  error={validationErrors.title}
                  required
                  showCharCount
                  maxLength={100}
                  currentLength={getCharacterCount(title)}
                  className="mb-0"
                >
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add title..."
                    className="text-3xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-2 text-gray-900 dark:text-gray-100 placeholder:text-muted-foreground dark:placeholder:text-muted-foreground/50 transition-colors"
                  />
                </FormField>
              </div>
              <div className="flex items-center gap-3">
                {(isAutoSaving || hasUnsavedChanges) && (
                  <div
                    className="flex items-center gap-2 text-xs text-muted-foreground/70"
                    role="status"
                  >
                    {isAutoSaving ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : effectiveLastSaved ? (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>Saved {formatTimeAgo(effectiveLastSaved)}</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-warning-500" />
                        <span>Unsaved changes</span>
                      </>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setShowInspector(!showInspector)}
                  className={cn(
                    "gap-2 border-gray-200 dark:border-border text-gray-700 dark:text-foreground/80 hover:text-gray-900 dark:hover:text-foreground transition-colors",
                    showInspector
                      ? "bg-gray-100 dark:bg-muted"
                      : "hover:bg-gray-100 dark:bg-transparent",
                  )}
                >
                  {showInspector ? "Hide Info" : "Show Info"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handlePreview}
                  className="gap-2 border-gray-200 dark:border-border text-gray-700 dark:text-foreground/80 hover:text-gray-900 dark:hover:text-foreground transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>

                <Button
                  onClick={() => handleSave({})}
                  disabled={saving || isAutoSaving}
                  className="gap-2 bg-wt-gold hover:bg-wt-gold-hover text-wt-nav"
                >
                  {saving || isAutoSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Draft
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-surface-darkest transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-8 py-8">
            <ArticleEditor
              key={editorKey}
              initialContent={{
                body_markdown: editorContent?.markdown || "",
                body_html: editorContent?.html || "",
                content: editorContent?.markdown || "",
              }}
              onChange={(content) => {
                setEditorContent(content);
              }}
              placeholder="Start writing your article..."
              editable={true}
            />
          </div>
        </div>

        {/* AI Tools Bar (New) */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-gray-900 dark:bg-gray-800 text-white p-2 px-4 rounded-full shadow-2xl flex items-center gap-4 border border-gray-700">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 border-r border-gray-700 pr-4">
              <Sparkles className="w-4 h-4 text-wt-gold" />
              <span>AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProofread}
              disabled={isProofreading || !editorContent?.markdown}
              className="text-wt-gold hover:text-wt-gold-hover hover:bg-white/10 gap-2 h-8"
            >
              {isProofreading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              Proofread & Polish
            </Button>
          </div>
        </div>

        {/* Live Preview Pane */}
        <PreviewPane
          content={editorContent?.markdown || ""}
          title={title}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />

        <TemplateSelector
          open={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelect={(template: ContentTemplate) => {
            setEditorContent({ markdown: template.structure, html: "" });
            setEditorKey((k) => k + 1);
            toast.success(`Template "${template.name}" loaded`);
          }}
        />
      </div>
    </AdminLayout>
  );
}
