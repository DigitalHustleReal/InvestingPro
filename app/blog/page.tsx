import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Rss } from 'lucide-react';
import BlogClient from './BlogClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog — Financial Insights & Updates | InvestingPro',
  description: 'Latest financial news, market updates, product reviews, and expert analysis for Indian investors. Updated daily.',
  openGraph: { title: 'Blog — InvestingPro', url: 'https://investingpro.in/blog' },
};

export default function BlogPage() {
  return (
    <>
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-[13px] text-gray-400">
              <li><Link href="/" className="hover:text-green-600 transition-colors">Home</Link></li>
              <li><ChevronRight size={12} /></li>
              <li className="text-gray-700 font-medium">Blog</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-[32px] font-bold text-[--v2-ink] tracking-tight leading-tight">Blog</h1>
              <p className="text-[15px] text-gray-500 mt-2 max-w-xl leading-relaxed">Financial insights, market updates, and product reviews. Updated daily.</p>
            </div>
            <Link href="/feed.xml" className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-green-600 transition-colors flex-shrink-0">
              <Rss size={13} /> RSS Feed
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['All Posts','Credit Cards','Mutual Funds','Loans','Insurance','Tax','Market Updates','Reviews'].map((p, i) => (
              <Link key={p} href={i === 0 ? '/blog' : `/blog?category=${p.toLowerCase().replace(' ', '-')}`} className={`inline-flex items-center px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8">
          <BlogClient />
        </div>
      </section>
    </>
  );
}
