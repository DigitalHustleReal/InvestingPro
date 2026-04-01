"use client";

import * as React from "react";
import { Globe, Check, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { useLanguage, SUPPORTED_LANGUAGES, type LangCode } from "@/lib/i18n/language-context";

export default function LanguageSwitcher({ isMobile = false }: { isMobile?: boolean }) {
  const { lang, setLang, isLoading } = useLanguage();

  const handleChange = (code: string) => setLang(code as LangCode);

  if (isMobile) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {SUPPORTED_LANGUAGES.map((l) => (
          <Button
            key={l.code}
            variant={lang === l.code ? "default" : "outline"}
            size="sm"
            onClick={() => handleChange(l.code)}
            className="w-full justify-start text-xs gap-1"
            disabled={isLoading}
          >
            <span className="font-semibold">{l.label}</span>
            <span className="truncate opacity-80">{l.nativeName}</span>
            {lang === l.code && <Check className="ml-auto w-3 h-3 shrink-0" />}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Select value={lang} onValueChange={handleChange} disabled={isLoading}>
      <SelectTrigger className="w-[120px] h-9 text-xs font-medium border-slate-200 bg-transparent hover:bg-slate-50 focus:ring-0">
        {isLoading
          ? <Loader2 className="w-3 h-3 animate-spin" />
          : <Globe className="w-3 h-3 mr-1 opacity-50" />
        }
        <SelectValue>
          {SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.nativeName ?? "English"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {SUPPORTED_LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code} className="text-xs">
            <span className="font-semibold mr-2 text-slate-400">{l.label}</span>
            {l.nativeName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
