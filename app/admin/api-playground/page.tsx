"use client";

import React, { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Play,
  Copy,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Terminal,
  Clock,
  FileJson,
  BookOpen,
  Send,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface HeaderPair {
  key: string;
  value: string;
  id: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  body: string;
  time: number;
}

interface EndpointDoc {
  method: HttpMethod;
  path: string;
  description: string;
  parameters?: string;
  exampleResponse: string;
}

/* ------------------------------------------------------------------ */
/*  Quick endpoints                                                    */
/* ------------------------------------------------------------------ */

const QUICK_ENDPOINTS: { method: HttpMethod; path: string; label: string }[] = [
  { method: "GET", path: "/api/v1/articles", label: "GET /api/v1/articles" },
  {
    method: "GET",
    path: "/api/v1/articles/:id",
    label: "GET /api/v1/articles/:id",
  },
  { method: "GET", path: "/api/v1/products", label: "GET /api/v1/products" },
  {
    method: "GET",
    path: "/api/v1/calculators",
    label: "GET /api/v1/calculators",
  },
  {
    method: "GET",
    path: "/api/v1/categories",
    label: "GET /api/v1/categories",
  },
];

/* ------------------------------------------------------------------ */
/*  Mock responses removed — playground shows real API responses only   */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  API documentation                                                  */
/* ------------------------------------------------------------------ */

const API_DOCS: EndpointDoc[] = [
  {
    method: "GET",
    path: "/api/v1/articles",
    description:
      "List all articles with optional pagination and filtering. Returns published articles by default.",
    parameters:
      "page (int), per_page (int), status (string: draft|published|archived), category (string)",
    exampleResponse: JSON.stringify(
      { data: [], meta: { page: 1, total: 0 } },
      null,
      2,
    ),
  },
  {
    method: "GET",
    path: "/api/v1/articles/:id",
    description:
      "Retrieve a single article by ID. Returns full content body, metadata, and SEO score.",
    parameters: "id (string, required) — Article ID or slug",
    exampleResponse: JSON.stringify(
      { data: { id: "...", title: "...", status: "published" } },
      null,
      2,
    ),
  },
  {
    method: "POST",
    path: "/api/v1/articles",
    description:
      "Create a new article. Requires authentication and editor+ permissions.",
    parameters:
      "Body: { title (string, required), body (string), status (string), category (string), seo_keywords (string[]) }",
    exampleResponse: JSON.stringify(
      { data: { id: "art_new", title: "New Article", status: "draft" } },
      null,
      2,
    ),
  },
  {
    method: "GET",
    path: "/api/v1/products",
    description:
      "List financial products (credit cards, loans, mutual funds, etc.) with filters.",
    parameters:
      "page (int), per_page (int), category (string), sort_by (string: rating|name|created_at)",
    exampleResponse: JSON.stringify(
      { data: [], meta: { page: 1, total: 0 } },
      null,
      2,
    ),
  },
  {
    method: "GET",
    path: "/api/v1/calculators",
    description: "List available financial calculators and their metadata.",
    exampleResponse: JSON.stringify(
      { data: [{ id: "sip", name: "SIP Calculator" }] },
      null,
      2,
    ),
  },
  {
    method: "GET",
    path: "/api/v1/categories",
    description: "List all content categories with product counts.",
    exampleResponse: JSON.stringify(
      { data: [{ slug: "credit-cards", name: "Credit Cards", count: 0 }] },
      null,
      2,
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function methodColor(method: HttpMethod): string {
  switch (method) {
    case "GET":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    case "POST":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
    case "PUT":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
    case "DELETE":
      return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
  }
}

function statusColor(status: number): string {
  if (status >= 200 && status < 300)
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
  if (status >= 300 && status < 400)
    return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
  if (status >= 400 && status < 500)
    return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
  return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
}

let headerId = 0;
function nextHeaderId(): string {
  headerId += 1;
  return `hdr_${headerId}`;
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ApiPlaygroundPage() {
  /* Request state */
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [endpoint, setEndpoint] = useState("/api/v1/");
  const [headers, setHeaders] = useState<HeaderPair[]>([
    { key: "Content-Type", value: "application/json", id: nextHeaderId() },
  ]);
  const [body, setBody] = useState("{\n  \n}");
  const [loading, setLoading] = useState(false);

  /* Response state */
  const [response, setResponse] = useState<ApiResponse | null>(null);

  /* Docs accordion state */
  const [openDocs, setOpenDocs] = useState<Set<number>>(new Set());

  const abortRef = useRef<AbortController | null>(null);

  /* ------ Handlers ------ */

  const handleQuickEndpoint = useCallback(
    (ep: { method: HttpMethod; path: string }) => {
      setMethod(ep.method);
      setEndpoint(ep.path);
    },
    [],
  );

  const addHeader = useCallback(() => {
    setHeaders((prev) => [...prev, { key: "", value: "", id: nextHeaderId() }]);
  }, []);

  const removeHeader = useCallback((id: string) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const updateHeader = useCallback(
    (id: string, field: "key" | "value", val: string) => {
      setHeaders((prev) =>
        prev.map((h) => (h.id === id ? { ...h, [field]: val } : h)),
      );
    },
    [],
  );

  const toggleDoc = useCallback((idx: number) => {
    setOpenDocs((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const copyResponse = useCallback(() => {
    if (response) {
      navigator.clipboard.writeText(response.body);
      toast.success("Response copied to clipboard");
    }
  }, [response]);

  const sendRequest = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    const startTime = performance.now();

    /* Build headers object */
    const reqHeaders: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.key.trim()) reqHeaders[h.key.trim()] = h.value;
    });

    try {
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const url = `${baseUrl}${endpoint.trim()}`;

      const fetchOpts: RequestInit = {
        method,
        headers: reqHeaders,
        signal: controller.signal,
      };
      if (method !== "GET" && body.trim()) {
        fetchOpts.body = body;
      }

      const res = await fetch(url, fetchOpts);
      const elapsed = Math.round(performance.now() - startTime);
      const text = await res.text();

      let formatted = text;
      try {
        formatted = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* not JSON — use raw text */
      }
      setResponse({
        status: res.status,
        statusText: res.statusText,
        body: formatted,
        time: elapsed,
      });
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - startTime);

      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setResponse({
        status: 0,
        statusText: "Network Error",
        body: JSON.stringify(
          {
            error: "Failed to reach endpoint",
            detail: err instanceof Error ? err.message : "Unknown error",
          },
          null,
          2,
        ),
        time: elapsed,
      });
      toast.error("Request failed");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [method, endpoint, headers, body]);

  /* ------ Render ------ */

  return (
    <AdminLayout>
      <AdminPageContainer>
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Terminal className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                API Playground
              </h1>
              <p className="text-sm text-muted-foreground">
                Test headless CMS API endpoints
              </p>
            </div>
          </div>
        </div>

        {/* Quick Endpoints */}
        <div className="flex flex-wrap gap-2">
          {QUICK_ENDPOINTS.map((ep) => (
            <button
              key={ep.path}
              onClick={() => handleQuickEndpoint(ep)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono transition-colors",
                "hover:bg-muted/50 cursor-pointer",
                endpoint === ep.path
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-border",
              )}
            >
              <Badge
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  methodColor(ep.method),
                )}
              >
                {ep.method}
              </Badge>
              <span className="text-muted-foreground">{ep.path}</span>
            </button>
          ))}
        </div>

        {/* Main panels */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* ---- Left panel: Request builder (3/5 = 60%) ---- */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Send className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Method + URL row */}
              <div className="flex gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-semibold font-mono",
                    "bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
                    "w-28 shrink-0",
                  )}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="/api/v1/..."
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-mono",
                    "bg-background placeholder:text-muted-foreground/50",
                    "focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
                  )}
                />
                <Button
                  onClick={sendRequest}
                  disabled={loading || !endpoint.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Play className="h-3.5 w-3.5" />
                      Send Request
                    </span>
                  )}
                </Button>
              </div>

              {/* Headers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Headers
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addHeader}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Header
                  </Button>
                </div>
                <div className="space-y-2">
                  {headers.map((h) => (
                    <div key={h.id} className="flex gap-2">
                      <input
                        type="text"
                        value={h.key}
                        onChange={(e) =>
                          updateHeader(h.id, "key", e.target.value)
                        }
                        placeholder="Key"
                        className={cn(
                          "w-1/3 rounded-lg border px-2.5 py-1.5 text-xs font-mono",
                          "bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
                        )}
                      />
                      <input
                        type="text"
                        value={h.value}
                        onChange={(e) =>
                          updateHeader(h.id, "value", e.target.value)
                        }
                        placeholder="Value"
                        className={cn(
                          "flex-1 rounded-lg border px-2.5 py-1.5 text-xs font-mono",
                          "bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
                        )}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHeader(h.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Body (only for POST/PUT) */}
              {(method === "POST" || method === "PUT") && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Request Body
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    spellCheck={false}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-xs font-mono leading-relaxed",
                      "bg-background resize-y",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* ---- Right panel: Response viewer (2/5 = 40%) ---- */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileJson className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Response
                </CardTitle>
                {response && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyResponse}
                    className="h-7 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-3">
                  {/* Status + time */}
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "font-mono text-xs",
                        statusColor(response.status),
                      )}
                    >
                      {response.status} {response.statusText}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {response.time}ms
                    </span>
                  </div>

                  {/* Response body */}
                  <div className="relative">
                    <pre
                      className={cn(
                        "rounded-lg border bg-muted/30 p-3 text-xs font-mono leading-relaxed",
                        "overflow-auto max-h-[500px] whitespace-pre-wrap break-words",
                      )}
                    >
                      {response.body}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Zap className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No response yet</p>
                  <p className="text-xs mt-1">
                    Send a request to see the response here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ---- Bottom: API Documentation ---- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              API Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {API_DOCS.map((doc, idx) => {
              const isOpen = openDocs.has(idx);
              return (
                <div
                  key={`${doc.method}-${doc.path}`}
                  className="rounded-lg border"
                >
                  {/* Accordion header */}
                  <button
                    onClick={() => toggleDoc(idx)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                      "hover:bg-muted/50",
                      isOpen && "border-b",
                    )}
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <Badge
                      className={cn(
                        "font-mono text-[10px] px-1.5 py-0 shrink-0",
                        methodColor(doc.method),
                      )}
                    >
                      {doc.method}
                    </Badge>
                    <span className="font-mono text-sm">{doc.path}</span>
                    <span className="ml-auto text-xs text-muted-foreground hidden sm:block">
                      {doc.description.slice(0, 60)}
                      {doc.description.length > 60 ? "..." : ""}
                    </span>
                  </button>

                  {/* Accordion content */}
                  {isOpen && (
                    <div className="px-4 py-3 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {doc.description}
                      </p>

                      {doc.parameters && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Parameters
                          </p>
                          <p className="text-xs font-mono text-muted-foreground bg-muted/30 rounded-md px-3 py-2">
                            {doc.parameters}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Example Response
                        </p>
                        <pre className="rounded-lg border bg-muted/30 p-3 text-xs font-mono leading-relaxed overflow-auto max-h-[300px] whitespace-pre-wrap break-words">
                          {doc.exampleResponse}
                        </pre>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMethod(doc.method);
                          setEndpoint(doc.path);
                          toast.success(`Loaded ${doc.method} ${doc.path}`);
                        }}
                        className="text-xs"
                      >
                        <Play className="h-3 w-3 mr-1.5" />
                        Try this endpoint
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </AdminPageContainer>
    </AdminLayout>
  );
}
