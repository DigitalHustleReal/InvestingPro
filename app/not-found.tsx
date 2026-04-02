import React from 'react';
import Link from 'next/link';
import { Search, Map, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Visual Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-secondary-500 to-secondary-600 shadow-xl shadow-secondary-500/20 mb-8 transform rotate-3">
             <span className="text-4xl font-black text-white italic">404</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It may have been moved or no longer exists.
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
              className="group flex items-center justify-between p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-secondary-500 dark:hover:border-secondary-500/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-secondary-500/10 transition-colors">
                  <Search className="w-5 h-5 text-gray-500 group-hover:text-secondary-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-helper:text-secondary-500 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button asChild className="w-full sm:w-auto px-8 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold gap-2">
                <Link href="/">
                    <Home className="w-4 h-4" />
                    Back to Home
                </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full sm:w-auto h-12 rounded-xl text-gray-500">
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
