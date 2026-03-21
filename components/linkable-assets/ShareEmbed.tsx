"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Share2,
  Code,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Link2,
} from "lucide-react";
import { 
  generateShareLinks, 
  generateEmbedCode,
  type ShareConfig,
  type EmbedConfig,
} from "@/lib/linkable-assets/embeddable-widget";

interface ShareEmbedProps {
  /** Share configuration */
  shareConfig: ShareConfig;
  /** Calculator slug for embed (optional) */
  calculatorSlug?: string;
  /** Trigger button variant */
  variant?: 'default' | 'outline' | 'ghost';
  /** Trigger button size */
  size?: 'default' | 'sm' | 'lg';
  /** Show as icon only */
  iconOnly?: boolean;
  /** Custom trigger element */
  trigger?: React.ReactNode;
}

export function ShareEmbed({
  shareConfig,
  calculatorSlug,
  variant = 'outline',
  size = 'default',
  iconOnly = false,
  trigger,
}: ShareEmbedProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const shareLinks = generateShareLinks(shareConfig);
  
  const embedCodes = calculatorSlug 
    ? generateEmbedCode({
        calculatorSlug,
        width: '100%',
        height: 500,
        theme: 'light',
        showBranding: true,
      })
    : null;

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareConfig.title,
          text: shareConfig.description,
          url: shareConfig.url,
        });
        setOpen(false);
      } catch (err) {
        // User cancelled
      }
    }
  };

  const CopyButton = ({ text, type }: { text: string; type: string }) => (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => handleCopy(text, type)}
    >
      {copied === type ? (
        <>
          <Check className="w-4 h-4 mr-1" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-1" />
          Copy
        </>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={variant} size={size}>
            <Share2 className="w-4 h-4" />
            {!iconOnly && <span className="ml-2">Share</span>}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share & Embed</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="share">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="share">Share</TabsTrigger>
            {embedCodes && <TabsTrigger value="embed">Embed</TabsTrigger>}
          </TabsList>

          {/* Share Tab */}
          <TabsContent value="share" className="space-y-4">
            {/* Native Share (Mobile) */}
            {'share' in navigator && (
              <Button onClick={handleNativeShare} className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share via...
              </Button>
            )}

            {/* Social Links */}
            <div className="grid grid-cols-3 gap-3">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                <span className="text-xs">Twitter</span>
              </a>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Facebook className="w-6 h-6 text-[#4267B2]" />
                <span className="text-xs">Facebook</span>
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Linkedin className="w-6 h-6 text-[#0077B5]" />
                <span className="text-xs">LinkedIn</span>
              </a>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
                <span className="text-xs">WhatsApp</span>
              </a>
              <a
                href={shareLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-[#0088CC]" />
                <span className="text-xs">Telegram</span>
              </a>
              <a
                href={shareLinks.email}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Mail className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <span className="text-xs">Email</span>
              </a>
            </div>

            {/* Copy Link */}
            <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                value={shareConfig.url}
                readOnly
                className="flex-1 bg-transparent text-sm truncate outline-none"
              />
              <CopyButton text={shareConfig.url} type="url" />
            </div>
          </TabsContent>

          {/* Embed Tab */}
          {embedCodes && (
            <TabsContent value="embed" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Copy the code below to embed this calculator on your website.
              </p>

              {/* iFrame Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">iFrame Embed</span>
                  <CopyButton text={embedCodes.iframe} type="iframe" />
                </div>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs">
                  <code>{embedCodes.iframe}</code>
                </pre>
              </div>

              {/* Script Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Script Embed (Auto-resize)</span>
                  <CopyButton text={embedCodes.script} type="script" />
                </div>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs">
                  <code>{embedCodes.script}</code>
                </pre>
              </div>

              <p className="text-xs text-muted-foreground">
                By embedding, you agree to display the "Powered by InvestingPro" attribution.
              </p>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ShareEmbed;
