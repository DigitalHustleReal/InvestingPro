"use client";

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Clock,
  ArrowRight,
  Database,
  RefreshCw,
  CreditCard,
  Building2,
  PiggyBank,
  Landmark,
  Shield,
  Search,
  Coins,
  GraduationCap,
  Home,
  Car,
  Briefcase,
  Heart,
  FileText,
  Wallet,
  CircleDollarSign,
} from "lucide-react";
import { getAllDataStudies, type DataStudy, type StudyCategory } from "@/lib/linkable-assets/data-studies-service";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'credit-cards': <CreditCard className="w-5 h-5" />,
  'mutual-funds': <TrendingUp className="w-5 h-5" />,
  'fixed-deposits': <PiggyBank className="w-5 h-5" />,
  'loans': <Building2 className="w-5 h-5" />,
  'insurance': <Shield className="w-5 h-5" />,
  'policy-rates': <Landmark className="w-5 h-5" />,
  'banking': <Wallet className="w-5 h-5" />,
  'investments': <CircleDollarSign className="w-5 h-5" />,
  'gold-silver': <Coins className="w-5 h-5" />,
  'government-schemes': <FileText className="w-5 h-5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  'credit-cards': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'mutual-funds': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'fixed-deposits': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'loans': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'insurance': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'policy-rates': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'banking': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'investments': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'gold-silver': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'government-schemes': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
};

const CATEGORY_LABELS: Record<string, string> = {
  'credit-cards': 'Credit Cards',
  'mutual-funds': 'Mutual Funds',
  'fixed-deposits': 'Fixed Deposits',
  'loans': 'Loans',
  'insurance': 'Insurance',
  'policy-rates': 'RBI Policy Rates',
  'banking': 'Banking',
  'investments': 'Investments',
  'gold-silver': 'Gold & Silver',
  'government-schemes': 'Govt Schemes',
};

export default function DataStudiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const { data: studies, isLoading, error } = useQuery({
    queryKey: ['data-studies'],
    queryFn: getAllDataStudies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get unique categories
  const categories = useMemo(() => {
    if (!studies || !Array.isArray(studies)) return [];
    const cats = [...new Set(studies.map(s => s.category))];
    return cats.sort();
  }, [studies]);

  // Filter studies
  const filteredStudies = useMemo(() => {
    if (!studies || !Array.isArray(studies)) return [];
    return studies.filter(study => {
      const matchesSearch = searchTerm === '' || 
        study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || study.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [studies, searchTerm, activeCategory]);

  // Group studies by category
  const studiesByCategory = useMemo(() => {
    if (!filteredStudies) return {};
    return filteredStudies.reduce((acc, study) => {
      if (!acc[study.category]) {
        acc[study.category] = [];
      }
      acc[study.category].push(study);
      return acc;
    }, {} as Record<string, DataStudy[]>);
  }, [filteredStudies]);

  const liveStudiesCount = Array.isArray(studies) ? studies.filter(s => s.isLive).length : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            <Database className="w-3 h-3 mr-1" />
            Data-Driven Insights
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            India Finance Data Studies
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Authoritative data on loans, insurance, investments, banking, and government schemes. 
            Updated from official RBI, IRDAI, SEBI, and government sources.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-600">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-green-500" />
              {liveStudiesCount} Live Data Studies
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {studies?.length || 0} Total Studies
            </span>
            <span className="flex items-center gap-1">
              <Database className="w-4 h-4" />
              {categories.length} Categories
            </span>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search studies (e.g., home loan, term insurance, PPF...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All Studies
              <Badge variant="secondary" className="ml-2">
                {studies?.length || 0}
              </Badge>
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="gap-2"
              >
                {CATEGORY_ICONS[cat]}
                {CATEGORY_LABELS[cat] || cat}
                <Badge variant="secondary" className="ml-1">
                  {Array.isArray(studies) ? studies.filter(s => s.category === cat).length : 0}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Studies by Category */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              Error loading studies. Please try again.
            </div>
          ) : filteredStudies.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No studies found matching your search.
            </div>
          ) : activeCategory === 'all' ? (
            // Show by category when "All" is selected
            Object.entries(studiesByCategory).map(([category, categoryStudies]) => (
              <div key={category} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`p-2 rounded-lg ${CATEGORY_COLORS[category]}`}>
                    {CATEGORY_ICONS[category]}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {CATEGORY_LABELS[category] || category}
                  </h2>
                  <Badge variant="outline">
                    {categoryStudies.length} studies
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryStudies.map((study) => (
                    <StudyCard key={study.id} study={study} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Show flat grid when specific category is selected
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudies.map((study) => (
                <StudyCard key={study.id} study={study} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Studies Highlight */}
      {!searchTerm && activeCategory === 'all' && (
        <section className="py-12 px-4 bg-slate-100 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Most Popular Data Studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <QuickLinkCard 
                title="Home Loan Rates" 
                href="/data-studies/home-loan-interest-rates-india"
                icon={<Home className="w-5 h-5" />}
              />
              <QuickLinkCard 
                title="Term Insurance" 
                href="/data-studies/best-term-insurance-plans-india"
                icon={<Shield className="w-5 h-5" />}
              />
              <QuickLinkCard 
                title="Gold Price Today" 
                href="/data-studies/gold-silver-price-today-india"
                icon={<Coins className="w-5 h-5" />}
              />
              <QuickLinkCard 
                title="PPF Interest Rate" 
                href="/data-studies/ppf-interest-rate-history-india"
                icon={<FileText className="w-5 h-5" />}
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Use Our Data in Your Content
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Journalists, bloggers, and researchers can cite our data studies. 
            All data is sourced from official government and regulatory bodies (RBI, IRDAI, SEBI, AMFI).
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild>
              <Link href="/embed">
                Get Embed Code
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/api/data-studies">
                API Access
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuickLinkCard({ title, href, icon }: { title: string; href: string; icon: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <span className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
        {icon}
      </span>
      <span className="font-medium text-slate-900 dark:text-white">{title}</span>
      <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
    </Link>
  );
}

function StudyCard({ study }: { study: DataStudy }) {
  const categoryColor = CATEGORY_COLORS[study.category] || 'bg-slate-100 text-slate-700';
  const categoryIcon = CATEGORY_ICONS[study.category] || <BarChart3 className="w-5 h-5" />;

  // Get top 3 data points for preview
  const topDataPoints = study.dataPoints.slice(0, 3);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge className={categoryColor}>
            {categoryIcon}
            <span className="ml-1 capitalize">{study.category.replace('-', ' ')}</span>
          </Badge>
          {study.isLive && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Live
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-primary-600 transition-colors">
          {study.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {study.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Data Preview */}
        <div className="space-y-2 mb-4">
          {topDataPoints.map((point, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <span className="text-slate-600 dark:text-slate-400 truncate max-w-[60%]">
                {point.label}
              </span>
              <span className="font-semibold">
                {point.value}{point.unit}
              </span>
            </div>
          ))}
          {study.dataPoints.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{study.dataPoints.length - 3} more items
            </p>
          )}
        </div>

        {/* Key Insight */}
        {study.insights[0] && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mb-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-600 mb-1">
              Key Insight
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {study.insights[0]}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Updated: {new Date(study.lastUpdated).toLocaleDateString()}
          </span>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/data-studies/${study.slug}`}>
              View Study
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
