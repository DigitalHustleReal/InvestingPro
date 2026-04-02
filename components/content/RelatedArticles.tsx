import React from 'react';
import { ArrowRight, BookOpen, TrendingUp, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function RelatedArticles() {
  // Mock Data
  const articles = [
    {
      title: "HDFC Regalia Gold vs HDFC Diners Club Privilege: Full Comparison",
      category: "Comparison",
      readTime: "5 min read",
      icon: <CreditCard className="w-4 h-4 text-blue-500" />
    },
    {
      title: "How to maximize reward points on fuel spends in 2026",
      category: "Guides",
      readTime: "4 min read",
      icon: <TrendingUp className="w-4 h-4 text-green-500" />
    },
    {
      title: "7 Best Lifetime Free Credit Cards for Beginners",
      category: "Top Picks",
      readTime: "6 min read",
      icon: <BookOpen className="w-4 h-4 text-purple-500" />
    }
  ];

  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm mt-8">
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                Related Guides & Comparisons
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {articles.map((article, i) => (
                    <Link key={i} href="#" className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                            {article.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-200 text-sm group-hover:text-primary-600 transition-colors">{article.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{article.category}</span>
                                <span className="text-[10px] text-gray-600">•</span>
                                <span className="text-xs text-gray-600">{article.readTime}</span>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                ))}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 text-center">
                <Button variant="link" className="text-primary-600 h-auto p-0 text-sm font-semibold">
                    View All Articles
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}

import { Button } from '@/components/ui/Button';
