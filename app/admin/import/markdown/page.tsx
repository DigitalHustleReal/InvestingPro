"use client";

import React, { useState, useCallback, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Parsed Markdown File ---

interface ParsedMarkdown {
  filename: string;
  title: string;
  body: string;
  wordCount: number;
  category: string;
  tags: string[];
  description: string;
}

// --- Steps ---

type Step = "upload" | "preview" | "importing" | "done";

// --- Frontmatter parser ---

function parseFrontmatter(text: string): {
  frontmatter: Record<string, string>;
  content: string;
} {
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = text.match(fmRegex);

  if (!match) {
    return { frontmatter: {}, content: text };
  }

  const fmBlock = match[1];
  const content = match[2];
  const frontmatter: Record<string, string> = {};

  for (const line of fmBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim().toLowerCase();
      const value = line
        .slice(colonIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (key && value) {
        frontmatter[key] = value;
      }
    }
  }

  return { frontmatter, content };
}

function extractTitle(content: string): { title: string; rest: string } {
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("# ")) {
      const title = line.replace(/^#\s+/, "").trim();
      const rest = [...lines.slice(0, i), ...lines.slice(i + 1)]
        .join("\n")
        .trim();
      return { title, rest };
    }
    // Skip empty lines at the top
    if (line !== "") break;
  }
  return { title: "", rest: content };
}

function countWords(text: string): number {
  return text
    .replace(/[#*_`~>\-\[\]()!|]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export default function MarkdownImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [step, setStep] = useState<Step>("upload");
  const [files, setFiles] = useState<ParsedMarkdown[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [importProgress, setImportProgress] = useState(0);

  // --- File Handling ---

  const processFiles = useCallback((fileList: FileList) => {
    const mdFiles = Array.from(fileList).filter((f) => f.name.endsWith(".md"));

    if (mdFiles.length === 0) {
      toast.error("Please upload .md (Markdown) files");
      return;
    }

    const parsed: ParsedMarkdown[] = [];
    let loaded = 0;

    for (const file of mdFiles) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawText = e.target?.result as string;
        const { frontmatter, content } = parseFrontmatter(rawText);
        const { title: headingTitle, rest } = extractTitle(content);

        const title =
          frontmatter.title || headingTitle || file.name.replace(/\.md$/, "");
        const body = rest || content;
        const category = frontmatter.category || "";
        const tagsRaw = frontmatter.tags || "";
        const tags = tagsRaw
          ? tagsRaw
              .replace(/^\[|\]$/g, "")
              .split(",")
              .map((t) => t.trim().replace(/^["']|["']$/g, ""))
              .filter(Boolean)
          : [];
        const description =
          frontmatter.description || frontmatter.excerpt || "";

        parsed.push({
          filename: file.name,
          title,
          body,
          wordCount: countWords(body),
          category,
          tags,
          description,
        });

        loaded++;
        if (loaded === mdFiles.length) {
          // Sort by filename for consistent ordering
          parsed.sort((a, b) => a.filename.localeCompare(b.filename));
          setFiles(parsed);
          setStep("preview");
          toast.success(
            `Parsed ${parsed.length} Markdown file${parsed.length !== 1 ? "s" : ""}`,
          );
        }
      };
      reader.onerror = () => {
        loaded++;
        console.error(`Failed to read ${file.name}`);
        if (loaded === mdFiles.length && parsed.length > 0) {
          parsed.sort((a, b) => a.filename.localeCompare(b.filename));
          setFiles(parsed);
          setStep("preview");
          toast.warning(`Parsed ${parsed.length} files, some failed to read`);
        } else if (loaded === mdFiles.length) {
          toast.error("Failed to read any files");
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles],
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
    },
    [processFiles],
  );

  const removeFile = (idx: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length === 0) {
        setStep("upload");
      }
      return next;
    });
  };

  // --- Import ---

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleImport = async () => {
    setStep("importing");
    setImportProgress(0);
    setImportedCount(0);
    setFailedCount(0);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setImportProgress(i + 1);

      const payload = {
        content: {
          body_markdown: file.body,
          body_html: "",
          content: file.body,
        },
        metadata: {
          title: file.title,
          slug: generateSlug(file.title),
          excerpt: file.description,
          category: file.category || "investing-basics",
          tags: file.tags,
          seo_title: file.title,
          seo_description: file.description,
          language: "en",
          status: "draft",
        },
      };

      try {
        const res = await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error(
            `Failed to import ${file.filename}: ${errData.error || res.statusText}`,
          );
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error(`Network error importing ${file.filename}:`, err);
        errorCount++;
      }
    }

    setImportedCount(successCount);
    setFailedCount(errorCount);
    setStep("done");

    if (errorCount === 0) {
      toast.success(`Successfully imported ${successCount} articles`);
    } else if (successCount === 0) {
      toast.error(`Import failed: all ${errorCount} articles failed`);
    } else {
      toast.warning(`Imported ${successCount} articles, ${errorCount} failed`);
    }
  };

  // --- Reset ---

  const handleReset = () => {
    setStep("upload");
    setFiles([]);
    setImportedCount(0);
    setFailedCount(0);
    setImportProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const totalWords = files.reduce((sum, f) => sum + f.wordCount, 0);

  return (
    <AdminLayout>
      <AdminPageContainer>
        {/* Header */}
        <AdminPageHeader
          title="Markdown Import"
          actions={
            <button
              onClick={() => router.push("/admin/import")}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Import Hub
            </button>
          }
        >
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Upload Markdown files to import as articles. YAML frontmatter
            (title, category, tags, description) is automatically extracted.
          </p>
        </AdminPageHeader>

        {/* Step Progress */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {(["upload", "preview", "done"] as const).map((s, i) => {
            const labels = ["Upload", "Preview", "Done"];
            const stepIndex = ["upload", "preview", "done"].indexOf(
              step === "importing" ? "done" : step,
            );
            const isActive = i === stepIndex;
            const isComplete = i < stepIndex;
            return (
              <React.Fragment key={s}>
                {i > 0 && <div className="w-8 h-px bg-border" />}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors",
                    isActive && "bg-primary/10 text-primary font-semibold",
                    isComplete && "text-green-600 dark:text-green-400",
                    !isActive && !isComplete && "text-muted-foreground",
                  )}
                >
                  {isComplete ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-4 text-center">{i + 1}</span>
                  )}
                  {labels[i]}
                </span>
              </React.Fragment>
            );
          })}
        </div>

        {/* ============ STEP: UPLOAD ============ */}
        {step === "upload" && (
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center gap-4 p-12 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:border-primary/40 hover:bg-muted/30",
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".md"
              multiple
              className="hidden"
              onChange={onFileInputChange}
            />
            <div className="p-4 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
              <Upload className="w-8 h-8" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-semibold text-foreground font-inter">
                Drag & drop Markdown files here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse. Supports multiple{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  .md
                </code>{" "}
                files.
              </p>
            </div>
          </div>
        )}

        {/* ============ STEP: PREVIEW ============ */}
        {step === "preview" && (
          <div className="space-y-6">
            {/* Summary bar */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
              <FileText className="w-5 h-5 text-purple-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground font-inter">
                  {files.length} file{files.length !== 1 ? "s" : ""} ready to
                  import
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalWords.toLocaleString()} total words
                </p>
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-muted-foreground hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Clear all files"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* File list */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter w-10">
                        #
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter">
                        Filename
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter">
                        Title
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter">
                        Tags
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground font-inter">
                        Words
                      </th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-foreground max-w-[200px] truncate">
                          {file.filename}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground max-w-[250px] truncate">
                          {file.title || (
                            <span className="text-muted-foreground italic">
                              no title
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {file.category || (
                            <span className="text-muted-foreground italic">
                              none
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-foreground max-w-[200px] truncate">
                          {file.tags.length > 0 ? (
                            file.tags.join(", ")
                          ) : (
                            <span className="text-muted-foreground italic">
                              none
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-foreground tabular-nums">
                          {file.wordCount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeFile(idx)}
                            className="p-1 text-muted-foreground hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ready summary */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
              <Check className="w-4 h-4 shrink-0" />
              Ready to import <strong>{files.length}</strong> article
              {files.length !== 1 ? "s" : ""} as drafts.
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Start Over
              </button>
              <button
                onClick={handleImport}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import {files.length} Article{files.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}

        {/* ============ STEP: IMPORTING ============ */}
        {step === "importing" && (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-medium text-foreground font-inter">
              Importing {importProgress}/{files.length} articles...
            </p>
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width: `${files.length > 0 ? (importProgress / files.length) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Please do not close this page.
            </p>
          </div>
        )}

        {/* ============ STEP: DONE ============ */}
        {step === "done" && (
          <div className="flex flex-col items-center justify-center gap-6 py-16">
            <div
              className={cn(
                "p-4 rounded-full",
                failedCount === 0
                  ? "bg-green-100 dark:bg-green-900/40"
                  : importedCount === 0
                    ? "bg-red-100 dark:bg-red-900/40"
                    : "bg-amber-100 dark:bg-amber-900/40",
              )}
            >
              {failedCount === 0 ? (
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              ) : importedCount === 0 ? (
                <X className="w-10 h-10 text-red-600 dark:text-red-400" />
              ) : (
                <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-foreground font-inter">
                Import Complete
              </h3>
              <p className="text-sm text-muted-foreground">
                Successfully imported <strong>{importedCount}</strong> article
                {importedCount !== 1 ? "s" : ""} from {files.length} Markdown
                file{files.length !== 1 ? "s" : ""}
              </p>
              {failedCount > 0 && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  <strong>{failedCount}</strong> article
                  {failedCount !== 1 ? "s" : ""} failed to import. Check the
                  browser console for details.
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Import More Files
              </button>
              <button
                onClick={() => router.push("/admin/articles")}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                View Articles
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </AdminPageContainer>
    </AdminLayout>
  );
}
