"use client";

import React, { useState, useCallback, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Upload,
  FileJson,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Article field definitions for key mapping ---

interface ArticleField {
  key: string;
  label: string;
  required: boolean;
}

const ARTICLE_FIELDS: ArticleField[] = [
  { key: "title", label: "Title", required: true },
  { key: "body", label: "Body / Content", required: true },
  { key: "slug", label: "Slug", required: false },
  { key: "category", label: "Category", required: false },
  { key: "tags", label: "Tags", required: false },
  { key: "status", label: "Status (draft/published)", required: false },
  { key: "meta_title", label: "Meta Title", required: false },
  { key: "meta_description", label: "Meta Description", required: false },
  { key: "author", label: "Author", required: false },
  { key: "featured_image", label: "Featured Image URL", required: false },
];

// --- Steps ---

type Step = "upload" | "mapping" | "preview" | "importing" | "done";

export default function JsonImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState<string>("");
  const [jsonKeys, setJsonKeys] = useState<string[]>([]);
  const [jsonData, setJsonData] = useState<Record<string, unknown>[]>([]);
  const [keyMapping, setKeyMapping] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [importProgress, setImportProgress] = useState(0);

  // --- File Handling ---

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".json")) {
      toast.error("Please upload a JSON file");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Support array of objects or { articles: [...] }
        let items: Record<string, unknown>[];
        if (Array.isArray(parsed)) {
          items = parsed;
        } else if (
          parsed &&
          typeof parsed === "object" &&
          Array.isArray(parsed.articles)
        ) {
          items = parsed.articles;
        } else {
          toast.error(
            'JSON must be an array of objects or an object with an "articles" array',
          );
          return;
        }

        if (items.length === 0) {
          toast.error("JSON file contains no items");
          return;
        }

        // Extract all unique keys from the items
        const keysSet = new Set<string>();
        for (const item of items) {
          if (item && typeof item === "object") {
            for (const k of Object.keys(item)) {
              keysSet.add(k);
            }
          }
        }
        const keys = Array.from(keysSet);

        if (keys.length === 0) {
          toast.error("JSON items have no keys");
          return;
        }

        setJsonKeys(keys);
        setJsonData(items);

        // Auto-map keys by fuzzy matching
        const autoMap: Record<string, string> = {};
        for (const field of ARTICLE_FIELDS) {
          const match = keys.find(
            (k) =>
              k.toLowerCase().trim() === field.key ||
              k.toLowerCase().trim() === field.label.toLowerCase() ||
              k.toLowerCase().includes(field.key),
          );
          if (match) {
            autoMap[field.key] = match;
          }
        }
        setKeyMapping(autoMap);

        setStep("mapping");
        toast.success(`Parsed ${items.length} items from ${file.name}`);
      } catch {
        toast.error("Failed to parse JSON file. Check the file format.");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
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
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // --- Mapping ---

  const updateMapping = (fieldKey: string, jsonKey: string) => {
    setKeyMapping((prev) => {
      const next = { ...prev };
      if (jsonKey === "") {
        delete next[fieldKey];
      } else {
        next[fieldKey] = jsonKey;
      }
      return next;
    });
  };

  const requiredFieldsMapped = ARTICLE_FIELDS.filter((f) => f.required).every(
    (f) => keyMapping[f.key],
  );

  // --- Preview Data ---

  const previewRows = jsonData.slice(0, 5);

  const getMappedValue = (
    row: Record<string, unknown>,
    fieldKey: string,
  ): string => {
    const jsonKey = keyMapping[fieldKey];
    if (!jsonKey) return "";
    const val = row[jsonKey];
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val.join(", ");
    return String(val);
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

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      setImportProgress(i + 1);

      const title = getMappedValue(row, "title");
      const body = getMappedValue(row, "body");
      const slug = getMappedValue(row, "slug") || generateSlug(title);
      const category = getMappedValue(row, "category") || "investing-basics";
      const tagsRaw = getMappedValue(row, "tags");
      const tags = tagsRaw
        ? tagsRaw
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [];
      const seoTitle = getMappedValue(row, "meta_title") || title;
      const seoDescription = getMappedValue(row, "meta_description") || "";
      const status = getMappedValue(row, "status") || "draft";

      const payload = {
        content: {
          body_markdown: body,
          body_html: "",
          content: body,
        },
        metadata: {
          title,
          slug,
          excerpt: "",
          category,
          tags,
          seo_title: seoTitle,
          seo_description: seoDescription,
          language: "en",
          status,
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
            `Failed to import item ${i + 1}: ${errData.error || res.statusText}`,
          );
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error(`Network error importing item ${i + 1}:`, err);
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
    setFileName("");
    setJsonKeys([]);
    setJsonData([]);
    setKeyMapping({});
    setImportedCount(0);
    setFailedCount(0);
    setImportProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Mapped field keys for preview table
  const mappedFields = ARTICLE_FIELDS.filter((f) => keyMapping[f.key]);

  return (
    <AdminLayout>
      <AdminPageContainer>
        {/* Header */}
        <AdminPageHeader
          title="JSON Import"
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
            Upload a JSON file, map keys to article fields, preview, and import.
            Supports arrays of objects or{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
              {"{ articles: [...] }"}
            </code>{" "}
            format.
          </p>
        </AdminPageHeader>

        {/* Step Progress */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {(["upload", "mapping", "preview", "done"] as const).map((s, i) => {
            const labels = ["Upload", "Map Keys", "Preview", "Done"];
            const stepIndex = ["upload", "mapping", "preview", "done"].indexOf(
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
                    isComplete && "text-green-400",
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
              accept=".json"
              className="hidden"
              onChange={onFileInputChange}
            />
            <div className="p-4 rounded-xl bg-amber-900/40 text-amber-400">
              <Upload className="w-8 h-8" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-semibold text-foreground font-inter">
                Drag & drop your JSON file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse. Supports{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  .json
                </code>{" "}
                files.
              </p>
            </div>
          </div>
        )}

        {/* ============ STEP: MAPPING ============ */}
        {step === "mapping" && (
          <div className="space-y-6">
            {/* File info */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
              <FileJson className="w-5 h-5 text-amber-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate font-mono">
                  {fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {jsonData.length} items &middot; {jsonKeys.length} keys
                </p>
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-muted-foreground hover:text-red-600 rounded-md hover:bg-red-900/20 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Key Mapping */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground font-inter">
                Map JSON Keys to Article Fields
              </h3>
              <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
                {ARTICLE_FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center gap-4 px-4 py-3"
                  >
                    <div className="w-48 shrink-0">
                      <span className="text-sm font-medium text-foreground font-inter">
                        {field.label}
                      </span>
                      {field.required && (
                        <span className="ml-1 text-red-500 text-xs">*</span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <select
                      value={keyMapping[field.key] || ""}
                      onChange={(e) => updateMapping(field.key, e.target.value)}
                      className={cn(
                        "flex-1 text-sm rounded-lg border px-3 py-2 bg-background text-foreground transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                        keyMapping[field.key]
                          ? "border-green-700"
                          : "border-border",
                      )}
                    >
                      <option value="">-- Skip --</option>
                      {jsonKeys.map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Required fields warning */}
            {!requiredFieldsMapped && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-900/20 border border-amber-800 text-amber-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Map all required fields (marked with *) to continue.
              </div>
            )}

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
                onClick={() => setStep("preview")}
                disabled={!requiredFieldsMapped}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors",
                  requiredFieldsMapped
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed",
                )}
              >
                Preview Import
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============ STEP: PREVIEW ============ */}
        {step === "preview" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground font-inter">
                Preview (first {previewRows.length} of {jsonData.length} items)
              </h3>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground font-inter w-10">
                          #
                        </th>
                        {mappedFields.map((field) => (
                          <th
                            key={field.key}
                            className="text-left px-4 py-3 font-medium text-muted-foreground font-inter whitespace-nowrap"
                          >
                            {field.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-muted-foreground tabular-nums">
                            {idx + 1}
                          </td>
                          {mappedFields.map((field) => (
                            <td
                              key={field.key}
                              className="px-4 py-3 text-foreground max-w-xs truncate"
                              title={getMappedValue(row, field.key)}
                            >
                              {getMappedValue(row, field.key) || (
                                <span className="text-muted-foreground italic">
                                  empty
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-900/20 border border-green-800 text-green-400 text-sm">
              <Check className="w-4 h-4 shrink-0" />
              Ready to import <strong>{jsonData.length}</strong> articles with{" "}
              <strong>{mappedFields.length}</strong> mapped fields.
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep("mapping")}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Edit Mapping
              </button>
              <button
                onClick={handleImport}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import {jsonData.length} Articles
              </button>
            </div>
          </div>
        )}

        {/* ============ STEP: IMPORTING ============ */}
        {step === "importing" && (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-medium text-foreground font-inter">
              Importing {importProgress}/{jsonData.length} articles...
            </p>
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width: `${jsonData.length > 0 ? (importProgress / jsonData.length) * 100 : 0}%`,
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
                  ? "bg-green-900/40"
                  : importedCount === 0
                    ? "bg-red-900/40"
                    : "bg-amber-900/40",
              )}
            >
              {failedCount === 0 ? (
                <Check className="w-10 h-10 text-green-400" />
              ) : importedCount === 0 ? (
                <X className="w-10 h-10 text-red-400" />
              ) : (
                <AlertCircle className="w-10 h-10 text-amber-400" />
              )}
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-foreground font-inter">
                Import Complete
              </h3>
              <p className="text-sm text-muted-foreground">
                Successfully imported <strong>{importedCount}</strong> articles
                from{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  {fileName}
                </code>
              </p>
              {failedCount > 0 && (
                <p className="text-sm text-red-400">
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
                Import Another File
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
