import React from 'react';
import Link from 'next/link';
import { Search, Map, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Visual Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20 mb-8 transform rotate-3">
             <span className="text-4xl font-black text-white italic">404</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Asset Not Found
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            The resource you're looking for has been moved, archived, or never existed in our directory.
          </p>
        </div>

        {/* Suggestion Links */}
        <div className="grid gap-4 mb-12">
          {[
            { title: 'Looking for a Credit Card?', description: 'Compare the best rewards and LTF cards.', href: '/credit-cards' },
            { title: 'Analyzing Mutual Funds?', description: 'Data-driven insights for long-term growth.', href: '/mutual-funds' },
            { title: 'Need a Loan?', description: 'Check eligibility across 20+ banks.', href: '/loans' },
          ].map((item, i) => (
            <Link 
              key={i}
              href={item.href}
              className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                  <Search className="w-5 h-5 text-slate-500 group-hover:text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-helper:text-blue-500 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button asChild className="w-full sm:w-auto px-8 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold gap-2">
                <Link href="/">
                    <Home className="w-4 h-4" />
                    Back to Command Center
                </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full sm:w-auto h-12 rounded-xl text-slate-500">
                <Link href="/glossary">
                    <Map className="w-4 h-4 mr-2" />
                    Explore Glossary
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
