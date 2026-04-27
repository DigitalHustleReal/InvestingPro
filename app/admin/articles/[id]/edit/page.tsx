"use client";

import React, { useState, useEffect, useMemo } from "react";
import { logger } from "@/lib/logger";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ArticleInspector from "@/components/admin/ArticleInspector";
import ShortcodeCheatsheet from "@/components/admin/ShortcodeCheatsheet";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { Input } from "@/components/ui/input";
import type { ArticleData } from "@/lib/cms/article-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  CheckCheck,
  Eye,
  ArrowLeft,
  Save,
  Globe,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { PreviewPane } from "@/components/admin/preview/PreviewPane";
import Link from "next/link";
import { FormField } from "@/components/forms/FormField";
import {
  validateForm,
  articleValidationRules,
  getCharacterCount,
} from "@/lib/forms/validation";
import { useAutoSave } from "@/lib/hooks/useAutoSave";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { formatErrorForUI } from "@/lib/errors/user-friendly-messages";
import { ArticleCardSkeleton } from "@/components/loading/ArticleCardSkeleton";
import { cn } from "@/lib/utils";

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

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [editorContent, setEditorContent] = useState<{
    markdown: string;
    html: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isProofreading, setIsProofreading] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showInspector, setShowInspector] = useState(true);

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

      // Update editor content
      // We force remount to apply new content
      const newContent = json.polished_content;

      // Update article query data locally to reflect change
      queryClient.setQueryData(["article", id], (old: any) => ({
        ...old,
        body_markdown: newContent,
        content: newContent,
      }));

      setEditorKey((prev) => prev + 1);
      toast.success("Content Proofread & Polished!");
    } catch (e: any) {
      toast.error(formatErrorForUI(e));
    } finally {
      setIsProofreading(false);
    }
  };

  // CRITICAL: Fetch article BEFORE editor mounts
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/articles/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Article not found");
        }
        throw new Error("Failed to fetch article");
      }
      const articleData = await response.json();
      return articleData as ArticleData;
    },
    enabled: !!id,
    retry: 1,
  });

  // Initialize form when article loads
  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setExcerpt(article.excerpt || "");
      // Initialize editor content state so we can save without editing the body
      setEditorContent({
        markdown: article.body_markdown || article.content || "",
        html: article.body_html || "",
      });
    }
  }, [article]);

  // Validate form on change
  useEffect(() => {
    const errors = validateForm({ title, excerpt }, articleValidationRules);
    setValidationErrors(errors);
  }, [title, excerpt]);

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
    saveFn: async (data) => {
      if (!data.content || !title.trim()) return;
      await saveMutation.mutateAsync({});
    },
    enabled: !!article && !!editorContent && title.trim().length > 0,
    interval: 30000, // 30 seconds
    onSaveStart: () => {
      // Silent auto-save
    },
    onSaveSuccess: () => {
      // Silent success (don't show toast for auto-save)
    },
    onSaveError: (error) => {
      // Log but don't show toast for auto-save errors
      logger.error("Auto-save failed:", error);
    },
  });

  // Use the most recent save timestamp
  const effectiveLastSaved = autoSaveLastSaved || lastSaved;

  // Unsaved changes warning
  useUnsavedChanges({
    enabled: hasUnsavedChanges && !isAutoSaving,
    message: "You have unsaved changes. Are you sure you want to leave?",
  });

  // Publish mutation (defined early for use in useEffect)
  const publishMutation = useMutation({
    mutationFn: async (metadata: Partial<ArticleData>) => {
      if (!editorContent) {
        throw new Error("No content to publish");
      }

      const response = await fetch(`/api/admin/articles/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            body_markdown: editorContent.markdown,
            body_html: editorContent.html,
            content: editorContent.markdown,
          },
          metadata: {
            title,
            slug: article?.slug || "",
            excerpt,
            ...metadata,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to publish article");
      }

      return await response.json();
    },
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["article", id] });
      await queryClient.cancelQueries({ queryKey: ["articles", "admin"] });
      await queryClient.cancelQueries({ queryKey: ["articles", "public"] });

      const previousArticle = queryClient.getQueryData(["article", id]);
      const previousArticles = queryClient.getQueryData(["articles", "admin"]);

      // Optimistically update to published
      if (previousArticle) {
        queryClient.setQueryData(["article", id], {
          ...previousArticle,
          status: "published",
          published_at: new Date().toISOString(),
        });
      }

      return { previousArticle, previousArticles };
    },
    onSuccess: async (result) => {
      setSaving(false);
      // CRITICAL: Revalidate public routes
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paths: [
              `/articles/${result.slug}`,
              `/category/${article?.category || "investing-basics"}`,
              `/articles`,
              `/`,
            ],
            tags: [
              `article-${result.id}`,
              `article-${result.slug}`,
              `blog-articles`,
              `homepage-content`,
            ],
          }),
        });
      } catch (revalidateError) {
        logger.error("Revalidation failed:", revalidateError);
      }

      setLastSaved(new Date());

      // Invalidate all queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["article", id] }),
        queryClient.invalidateQueries({ queryKey: ["articles", "admin"] }),
        queryClient.invalidateQueries({ queryKey: ["articles", "public"] }),
        queryClient.invalidateQueries({ queryKey: ["articles", "category"] }),
      ]);

      router.refresh();
      toast.success(`Article published! Available at /articles/${result.slug}`);
    },
    onError: (error, variables, context) => {
      // Rollback
      if (context?.previousArticle) {
        queryClient.setQueryData(["article", id], context.previousArticle);
      }
      if (context?.previousArticles) {
        queryClient.setQueryData(
          ["articles", "admin"],
          context.previousArticles,
        );
      }

      setSaving(false);
      toast.error(formatErrorForUI(error));
    },
  });

  // Keyboard shortcuts for save and publish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S or Ctrl+S - Save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (!saving && !isAutoSaving) {
          handleSave({});
        }
      }
      // Cmd+P or Ctrl+P - Publish (prevent browser print)
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        e.preventDefault();
        if (
          !publishMutation.isPending &&
          !saving &&
          article?.status !== "published"
        ) {
          handlePublish({});
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saving, isAutoSaving, publishMutation.isPending, article?.status]);

  // Save mutation (does NOT change status)
  const saveMutation = useMutation({
    mutationFn: async (metadata: Partial<ArticleData>) => {
      if (!editorContent) {
        throw new Error("No content to save");
      }

      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            body_markdown: editorContent.markdown,
            body_html: editorContent.html,
            content: editorContent.markdown, // Legacy
          },
          metadata: {
            title,
            slug: article?.slug || "",
            excerpt,
            ...metadata,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save article");
      }

      return await response.json();
    },
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["article", id] });
      await queryClient.cancelQueries({ queryKey: ["articles", "admin"] });

      const previousArticle = queryClient.getQueryData(["article", id]);
      const previousArticles = queryClient.getQueryData(["articles", "admin"]);

      return { previousArticle, previousArticles };
    },
    onSuccess: async (result) => {
      setSaving(false);
      setLastSaved(new Date());

      // Update local state with server response
      if (article) {
        // Refresh article data
        await queryClient.invalidateQueries({ queryKey: ["article", id] });
      }

      // Invalidate and refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["article", id] }),
        queryClient.invalidateQueries({ queryKey: ["articles", "admin"] }),
      ]);

      router.refresh();
      toast.success("Article saved successfully");
    },
    onError: (error, variables, context) => {
      // Rollback
      if (context?.previousArticle) {
        queryClient.setQueryData(["article", id], context.previousArticle);
      }
      if (context?.previousArticles) {
        queryClient.setQueryData(
          ["articles", "admin"],
          context.previousArticles,
        );
      }

      setSaving(false);
      toast.error(formatErrorForUI(error));
    },
  });

  const handleSave = async (metadata: any) => {
    // Ensure metadata is an object if called without args
    const meta = typeof metadata === "object" ? metadata : {};

    // Validate before save
    // CRITICAL: Merge current state, metadata, and existing article data to ensure all required fields (like category) are present
    const validationValues = {
      title,
      excerpt,
      slug: article?.slug,
      category: meta.category || article?.category,
      ...meta,
    };

    const errors = validateForm(validationValues, articleValidationRules);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      logger.error("Validation errors:", errors); // Debugging
      toast.error("Please fix the form errors before saving");
      return;
    }

    if (!editorContent) {
      toast.error("No content to save");
      return;
    }

    setSaving(true);
    await saveMutation.mutateAsync(meta);
  };

  const handlePublish = async (metadata: any = {}) => {
    // Ensure metadata is an object if called without args
    const meta = typeof metadata === "object" ? metadata : {};

    // Validate before publish
    const validationValues = {
      title,
      excerpt,
      slug: article?.slug,
      category: meta.category || article?.category,
      ...meta,
    };

    const errors = validateForm(validationValues, articleValidationRules);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      logger.error("Validation errors:", errors);
      toast.error("Please fix the form errors before publishing");
      return;
    }

    if (!editorContent) {
      toast.error("No content to publish");
      return;
    }

    // Confirm publish
    const confirmed = window.confirm(
      "Are you sure you want to publish this article? It will be visible to all users.",
    );
    if (!confirmed) return;

    setSaving(true);
    await publishMutation.mutateAsync(meta);
  };

  const handlePreview = () => {
    if (!article?.slug) {
      toast.error("Please save the article first to generate a slug");
      return;
    }
    // Preview uses same route with preview token
    window.open(`/articles/${article.slug}?preview=true`, "_blank");
  };

  // CRITICAL: Don't render editor until article is loaded
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-4xl space-y-4">
            {/* Title Skeleton */}
            <div className="h-12 bg-muted rounded-lg animate-pulse" />
            {/* Editor Skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-64 bg-muted rounded-lg animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !article) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Article Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            {formatErrorForUI(error || new Error("Article not found"))}
          </p>
          <Button
            onClick={() => router.push("/admin/articles")}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      showInspector={showInspector}
      onInspectorClose={() => setShowInspector(false)}
      inspectorContent={
        <>
          <ArticleInspector
            article={{
              ...article,
              title,
              excerpt, // Sync excerpt from main editor
              category: (article.category as any) || "investing-basics",
              language: (article.language as any) || "en",
              body_markdown: editorContent?.markdown || article.body_markdown,
              body_html: editorContent?.html || article.body_html,
              content: editorContent?.markdown || article.content,
            }}
            onSave={(metadata) => {
              // Update excerpt from inspector if changed
              if (metadata.excerpt !== undefined) {
                setExcerpt(metadata.excerpt);
              }
              handleSave(metadata);
            }}
            onPublish={handlePublish}
            onPreview={handlePreview}
            onUpdateContent={(updatedHtml) => {
              // Bridge between Inspector and Tiptap Editor
              // Force refresh by updating cache and incrementing key
              queryClient.setQueryData(["article", id], (old: any) => ({
                ...old,
                body_html: updatedHtml,
              }));
              setEditorKey((prev) => prev + 1);
            }}
            saving={saving || isAutoSaving}
          />
          {/* Visual shortcode reference — paste into editor for rich components */}
          <div className="mt-4 px-1">
            <ShortcodeCheatsheet />
          </div>
        </>
      }
    >
      <div className="flex flex-col h-screen bg-gray-950 transition-colors duration-300">
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md px-8 py-4 transition-colors duration-300">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/admin/articles"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Articles
              </Link>
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
                    onChange={(e) => {
                      setTitle(e.target.value);
                      // Clear error on change
                      if (validationErrors.title) {
                        setValidationErrors({ ...validationErrors, title: "" });
                      }
                    }}
                    placeholder="Add title..."
                    className="text-3xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-2 text-gray-100 placeholder:text-muted-foreground/50 transition-colors"
                    aria-invalid={!!validationErrors.title}
                    aria-describedby={
                      validationErrors.title ? "title-error" : undefined
                    }
                  />
                </FormField>
              </div>
              <div className="flex items-center gap-3">
                {/* Auto-save indicator with aria-live for screen readers */}
                {(isAutoSaving || hasUnsavedChanges) && (
                  <div
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {isAutoSaving ? (
                      <>
                        <Loader2
                          className="w-3 h-3 animate-spin"
                          aria-hidden="true"
                        />
                        <span>Saving...</span>
                      </>
                    ) : effectiveLastSaved ? (
                      <>
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>Saved {formatTimeAgo(effectiveLastSaved)}</span>
                      </>
                    ) : (
                      <>
                        <span
                          className="w-2 h-2 rounded-full bg-warning-500"
                          aria-hidden="true"
                        />
                        <span>Unsaved changes</span>
                      </>
                    )}
                  </div>
                )}

                {/* Inspector Toggle (New) */}
                <Button
                  variant="outline"
                  onClick={() => setShowInspector(!showInspector)}
                  className={cn(
                    "gap-2 border-gray-700 text-gray-300 hover:text-foreground transition-colors",
                    showInspector ? "bg-muted" : "hover:bg-muted",
                  )}
                  aria-label="Toggle inspector"
                  title="Toggle Inspector (Settings & SEO)"
                >
                  <Clock className="w-4 h-4 hidden" />{" "}
                  {/* Hidden icon just for spacing/consistency if needed */}
                  {showInspector ? "Hide Info" : "Show Info"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="gap-2 border-gray-700 text-gray-300 hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Preview article"
                >
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  Preview
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || isAutoSaving}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  aria-label="Save article (⌘S)"
                >
                  {saving || isAutoSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {article?.status === "published"
                        ? "Update"
                        : "Save Draft"}
                    </>
                  )}
                </Button>
                {article?.status !== "published" && (
                  <Button
                    onClick={handlePublish}
                    disabled={
                      publishMutation.isPending || saving || isAutoSaving
                    }
                    className="gap-2 bg-secondary-600 hover:bg-secondary-700 text-white"
                    aria-label="Publish article (⌘P)"
                  >
                    {publishMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        Publish
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-auto bg-gray-950 transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-8 py-8">
            <ArticleEditor
              key={editorKey}
              initialContent={{
                body_markdown: article.body_markdown,
                body_html: article.body_html,
                content: article.content,
              }}
              onChange={(content) => {
                setEditorContent(content);
              }}
              placeholder="Start writing or type / to insert a block..."
              editable={true}
            />
          </div>
        </div>

        {/* Live Preview Pane */}
        <PreviewPane
          content={editorContent?.markdown || article.body_markdown || ""}
          title={title}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      </div>
    </AdminLayout>
  );
}
