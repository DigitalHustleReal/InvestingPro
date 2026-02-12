"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Code,
  Copy,
  Check,
  ExternalLink,
  Calculator,
  Palette,
  Settings,
  Eye,
} from "lucide-react";
import { 
  EMBEDDABLE_CALCULATORS, 
  generateEmbedCode, 
  getEmbedPreviewUrl,
  type EmbedConfig 
} from "@/lib/linkable-assets/embeddable-widget";

export default function EmbedPage() {
  const [selectedCalculator, setSelectedCalculator] = useState('sip');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showBranding, setShowBranding] = useState(true);
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState(500);
  const [primaryColor, setPrimaryColor] = useState('');
  const [borderRadius, setBorderRadius] = useState(8);
  const [copied, setCopied] = useState<string | null>(null);

  const config: EmbedConfig = {
    calculatorSlug: selectedCalculator,
    width,
    height,
    theme,
    showBranding,
    primaryColor: primaryColor || undefined,
    borderRadius,
  };

  const embedCodes = generateEmbedCode(config);
  const previewUrl = getEmbedPreviewUrl(selectedCalculator, theme);
  const calculatorInfo = EMBEDDABLE_CALCULATORS[selectedCalculator];

  const handleCopy = async (code: string, type: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">
            <Code className="w-3 h-3 mr-1" />
            Embeddable Widgets
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Embed Our Calculators
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-600 max-w-2xl mx-auto">
            Add powerful financial calculators to your website with just a few lines of code. 
            Free to use with attribution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Calculator Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary-500" />
                  Select Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCalculator} onValueChange={setSelectedCalculator}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EMBEDDABLE_CALCULATORS).map(([slug, info]) => (
                      <SelectItem key={slug} value={slug}>
                        {info.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {calculatorInfo && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {calculatorInfo.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary-500" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={(v: string) => setTheme(v as 'light' | 'dark')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Primary Color</Label>
                    <Input 
                      type="text" 
                      placeholder="#6366F1"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show InvestingPro Branding</Label>
                  <Switch checked={showBranding} onCheckedChange={setShowBranding} />
                </div>
              </CardContent>
            </Card>

            {/* Size Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary-500" />
                  Size & Layout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Width</Label>
                    <Input 
                      type="text" 
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="100% or 500px"
                    />
                  </div>
                  <div>
                    <Label>Height (px)</Label>
                    <Input 
                      type="number" 
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Border Radius (px)</Label>
                  <Input 
                    type="number" 
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Code */}
          <div className="space-y-6">
            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary-500" />
                    Live Preview
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                      Open Full Preview
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border rounded-lg overflow-hidden"
                  style={{ 
                    height: Math.min(height, 400),
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <iframe
                    src={previewUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Calculator Preview"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Embed Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary-500" />
                  Embed Code
                </CardTitle>
                <CardDescription>
                  Copy the code below and paste it into your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="iframe">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="iframe">iFrame</TabsTrigger>
                    <TabsTrigger value="script">Script</TabsTrigger>
                    <TabsTrigger value="wordpress">WordPress</TabsTrigger>
                    <TabsTrigger value="react">React</TabsTrigger>
                  </TabsList>

                  <TabsContent value="iframe" className="mt-4">
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{embedCodes.iframe}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(embedCodes.iframe, 'iframe')}
                      >
                        {copied === 'iframe' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="script" className="mt-4">
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{embedCodes.script}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(embedCodes.script, 'script')}
                      >
                        {copied === 'script' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="wordpress" className="mt-4">
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{embedCodes.wordpress}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(embedCodes.wordpress, 'wordpress')}
                      >
                        {copied === 'wordpress' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Note: Requires InvestingPro WordPress plugin (coming soon)
                    </p>
                  </TabsContent>

                  <TabsContent value="react" className="mt-4">
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{embedCodes.react}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(embedCodes.react, 'react')}
                      >
                        {copied === 'react' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      npm install @investingpro/widgets (coming soon)
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Usage Guidelines */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <ul>
              <li>Widgets are free to use on any website with proper attribution</li>
              <li>Do not remove the "Powered by InvestingPro" branding unless you have a premium license</li>
              <li>Widgets are responsive and work on mobile devices</li>
              <li>Data is fetched from InvestingPro servers and cached for performance</li>
              <li>For high-traffic websites, please contact us for enterprise solutions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
