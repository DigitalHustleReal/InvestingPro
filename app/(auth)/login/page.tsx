'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex flex-col items-center p-8 relative overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">

        {/* Logo Area */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-800/20">
            <span className="text-white text-xl font-bold tracking-tight">IP</span>
          </div>
          <p className="text-sm font-semibold text-green-700 dark:text-green-400 tracking-wide uppercase mb-1">InvestingPro</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
            Welcome back
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 text-center">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Google OAuth */}
        <div className="w-full space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="w-full my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Or continue with</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
        </div>

        {/* Email Form */}
        <form className="w-full space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">
              Email address
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-green-700 dark:group-focus-within:text-green-400 transition-colors" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-slate-400 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label htmlFor="password" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-green-700 dark:text-green-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-green-700 dark:group-focus-within:text-green-400 transition-colors" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-slate-400 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2.5 bg-green-800 hover:bg-green-900 text-white rounded-xl font-semibold shadow-lg shadow-green-800/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
            }
          </button>
        </form>

        <p className="mt-8 text-xs text-center text-slate-400">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-green-700 dark:hover:text-green-400">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy-policy" className="underline hover:text-green-700 dark:hover:text-green-400">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
