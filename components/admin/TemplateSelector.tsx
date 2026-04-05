"use client";

import { useState } from "react";
import { CONTENT_TEMPLATES, type ContentTemplate } from "@/lib/cms/templates";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: ContentTemplate) => void;
}

export default function TemplateSelector({
  open,
  onClose,
  onSelect,
}: TemplateSelectorProps) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = CONTENT_TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.contentType.toLowerCase().includes(search.toLowerCase()),
  );

  const getIcon = (iconName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Start from Template
            </h2>
            <p className="text-sm text-gray-500">
              Choose a template to get started quickly
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelect(template);
                  onClose();
                }}
                className={cn(
                  "text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700",
                  "hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20",
                  "transition-all duration-150 group",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    {getIcon(template.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {template.contentType}
                      </span>
                      <span className="text-xs text-gray-400">
                        {template.wordCountRange[0]}–
                        {template.wordCountRange[1]} words
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No templates match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
