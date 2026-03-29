'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setIsSubmitted(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex flex-col items-center p-8 ring-1 ring-slate-200 dark:ring-slate-800">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-800/20">
            <span className="text-white text-xl font-bold tracking-tight">IP</span>
          </div>
          <p className="text-sm font-semibold text-green-700 dark:text-green-400 tracking-wide uppercase mb-1">InvestingPro</p>
        </div>

        {isSubmitted ? (
          /* Success state */
          <div className="w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-700 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              We&apos;ve sent a password reset link to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>.
              Check your inbox and follow the link to reset your password.
            </p>
            <p className="text-xs text-slate-400 mb-6">
              Didn&apos;t receive the email? Check your spam folder, or{' '}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-green-700 dark:text-green-400 hover:underline"
              >
                try a different email address
              </button>.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          /* Form state */
          <>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
              Forgot your password?
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8 leading-relaxed">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <form className="w-full space-y-4" onSubmit={handleSubmit}>
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

              {error && (
                <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 border border-red-200 dark:border-red-800">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-800 hover:bg-green-900 text-white rounded-xl font-semibold shadow-lg shadow-green-800/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><span>Send reset link</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>

            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
