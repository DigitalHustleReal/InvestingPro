"use client";

import React, { useState, useCallback, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useRouter } from "next/navigation";
// @ts-expect-error -- papaparse has no bundled type declarations
import Papa from "papaparse";
import { toast } from "sonner";
import {
  Upload,
  FileSpreadsheet,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Article field definitions for column mapping ---

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

export default function CsvImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState<string>("");
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(
    {},
  );
  const [isDragging, setIsDragging] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  // --- File Handling ---

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: {
        errors: { message: string }[];
        meta: { fields?: string[] };
        data: Record<string, string>[];
      }) => {
        if (results.errors.length > 0) {
          toast.error(`CSV parse error: ${results.errors[0].message}`);
          return;
        }

        const headers = results.meta.fields || [];
        const data = results.data as Record<string, string>[];

        if (headers.length === 0 || data.length === 0) {
          toast.error("CSV file is empty or has no valid rows");
          return;
        }

        setCsvHeaders(headers);
        setCsvData(data);

        // Auto-map columns by fuzzy matching
        const autoMap: Record<string, string> = {};
        for (const field of ARTICLE_FIELDS) {
          const match = headers.find(
            (h: string) =>
              h.toLowerCase().trim() === field.key ||
              h.toLowerCase().trim() === field.label.toLowerCase() ||
              h.toLowerCase().includes(field.key),
          );
          if (match) {
            autoMap[field.key] = match;
          }
        }
        setColumnMapping(autoMap);

        setStep("mapping");
        toast.success(`Parsed ${data.length} rows from ${file.name}`);
      },
      error: (err: { message: string }) => {
        toast.error(`Failed to parse CSV: ${err.message}`);
      },
    });
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

  const updateMapping = (fieldKey: string, csvColumn: string) => {
    setColumnMapping((prev) => {
      const next = { ...prev };
      if (csvColumn === "") {
        delete next[fieldKey];
      } else {
        next[fieldKey] = csvColumn;
      }
      return next;
    });
  };

  const requiredFieldsMapped = ARTICLE_FIELDS.filter((f) => f.required).every(
    (f) => columnMapping[f.key],
  );

  // --- Preview Data ---

  const previewRows = csvData.slice(0, 5);

  const getMappedValue = (
    row: Record<string, string>,
    fieldKey: string,
  ): string => {
    const csvCol = columnMapping[fieldKey];
    return csvCol ? row[csvCol] || "" : "";
  };

  // --- Import ---

  const handleImport = async () => {
    setStep("importing");

    // Build mapped articles
    const articles = csvData.map((row) => {
      const article: Record<string, string> = {};
      for (const field of ARTICLE_FIELDS) {
        const value = getMappedValue(row, field.key);
        if (value) article[field.key] = value;
      }
      return article;
    });

    // Simulate import with a brief delay (replace with real API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setImportedCount(articles.length);
      setStep("done");
      toast.success(`Successfully imported ${articles.length} articles`);
    } catch {
      toast.error("Import failed. Please try again.");
      setStep("preview");
    }
  };

  // --- Reset ---

  const handleReset = () => {
    setStep("upload");
    setFileName("");
    setCsvHeaders([]);
    setCsvData([]);
    setColumnMapping({});
    setImportedCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Mapped field keys for preview table
  const mappedFields = ARTICLE_FIELDS.filter((f) => columnMapping[f.key]);

  return (
    <AdminLayout>
      <AdminPageContainer>
        {/* Header */}
        <AdminPageHeader
          title="CSV Import"
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
            Upload a CSV file, map columns to article fields, preview, and
            import.
          </p>
        </AdminPageHeader>

        {/* Step Progress */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {(["upload", "mapping", "preview", "done"] as const).map((s, i) => {
            const labels = ["Upload", "Map Columns", "Preview", "Done"];
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
              accept=".csv"
              className="hidden"
              onChange={onFileInputChange}
            />
            <div className="p-4 rounded-xl bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
              <Upload className="w-8 h-8" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-semibold text-foreground font-inter">
                Drag & drop your CSV file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse. Supports{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  .csv
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
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate font-mono">
                  {fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {csvData.length} rows &middot; {csvHeaders.length} columns
                </p>
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-muted-foreground hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Column Mapping */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground font-inter">
                Map CSV Columns to Article Fields
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
                      value={columnMapping[field.key] || ""}
                      onChange={(e) => updateMapping(field.key, e.target.value)}
                      className={cn(
                        "flex-1 text-sm rounded-lg border px-3 py-2 bg-background text-foreground transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                        columnMapping[field.key]
                          ? "border-green-300 dark:border-green-700"
                          : "border-border",
                      )}
                    >
                      <option value="">-- Skip --</option>
                      {csvHeaders.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Required fields warning */}
            {!requiredFieldsMapped && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
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
                Preview (first {previewRows.length} of {csvData.length} rows)
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
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
              <Check className="w-4 h-4 shrink-0" />
              Ready to import <strong>{csvData.length}</strong> articles with{" "}
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
                Import {csvData.length} Articles
              </button>
            </div>
          </div>
        )}

        {/* ============ STEP: IMPORTING ============ */}
        {step === "importing" && (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-medium text-foreground font-inter">
              Importing {csvData.length} articles...
            </p>
            <p className="text-xs text-muted-foreground">
              This may take a moment.
            </p>
          </div>
        )}

        {/* ============ STEP: DONE ============ */}
        {step === "done" && (
          <div className="flex flex-col items-center justify-center gap-6 py-16">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/40">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
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
