"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
  Share2,
  Code,
  ArrowLeft,
  CheckCircle,
  Info,
  ExternalLink,
} from "lucide-react";
import { type DataStudy } from "@/lib/linkable-assets/data-studies-service";
import { generateShareLinks, generateEmbedCode } from "@/lib/linkable-assets/embeddable-widget";

interface Props {
  study: DataStudy;
}

export default function DataStudyDetail({ study }: Props) {
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/data-studies/${study.slug}`
    : `https://investingpro.in/data-studies/${study.slug}`;

  const shareLinks = generateShareLinks({
    url: shareUrl,
    title: study.title,
    description: study.description,
    hashtags: ['InvestingPro', 'Finance', 'Data'],
  });

  // Export to CSV
  const handleExport = () => {
    const headers = ['Item', 'Value', 'Unit'];
    const csvData = study.dataPoints.map(dp => [
      dp.label,
      String(dp.value),
      dp.unit || '',
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${study.slug}-data.csv`;
    a.click();
  };

  // Copy share link
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: study.title,
        text: study.description,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  // Generate embed code for this study
  const embedCode = `<iframe 
  src="${shareUrl}/embed" 
  width="100%" 
  height="400" 
  frameborder="0"
  title="${study.title}"
></iframe>`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link 
          href="/data-studies" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          All Data Studies
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="capitalize">
              {study.category.replace('-', ' ')}
            </Badge>
            {study.isLive && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live Data
              </Badge>
            )}
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              Updates {study.updateFrequency}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {study.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {study.description}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date(study.lastUpdated).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
          <Button variant="outline" onClick={() => setShowEmbedCode(!showEmbedCode)}>
            <Code className="w-4 h-4 mr-2" />
            Embed
          </Button>
        </div>

        {/* Embed Code */}
        {showEmbedCode && (
          <Card className="mb-8 bg-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Embed This Study</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{embedCode}</code>
              </pre>
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-3"
                onClick={() => {
                  navigator.clipboard.writeText(embedCode);
                  alert('Embed code copied!');
                }}
              >
                Copy Code
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              Data Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {study.dataPoints.map((point, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {point.label}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-lg">
                          {point.value}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          {point.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {point.changeDirection && (
                          <span className={`inline-flex items-center ${
                            point.changeDirection === 'up' 
                              ? 'text-green-600' 
                              : point.changeDirection === 'down' 
                                ? 'text-red-600' 
                                : 'text-gray-500'
                          }`}>
                            {point.changeDirection === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                            {point.changeDirection === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                            {point.change !== undefined && (
                              <span>{point.change > 0 ? '+' : ''}{point.change.toFixed(2)}%</span>
                            )}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {study.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {insight}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Methodology */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Methodology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              {study.methodology}
            </p>
          </CardContent>
        </Card>

        {/* Social Share */}
        <Card>
          <CardHeader>
            <CardTitle>Share This Study</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
