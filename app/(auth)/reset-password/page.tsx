'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Supabase sends the recovery token as a URL hash fragment.
  // The client-side Supabase listener will exchange it automatically.
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is now in a password recovery session — allow them to set new password
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
      } else {
        setIsSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => router.push('/login'), 3000);
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

        {isSuccess ? (
          <div className="w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-700 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Password updated!</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Your password has been changed successfully. Redirecting you to sign in&hellip;
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-800 hover:bg-green-900 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Go to Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
              Set new password
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8 leading-relaxed">
              Choose a strong password for your InvestingPro account.
            </p>

            <form className="w-full space-y-4" onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">
                  New password
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-green-700 dark:group-focus-within:text-green-400 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-slate-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">
                  Confirm new password
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-green-700 dark:group-focus-within:text-green-400 transition-colors" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your new password"
                    autoComplete="new-password"
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
                disabled={isLoading || !password || !confirmPassword}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-800 hover:bg-green-900 text-white rounded-xl font-semibold shadow-lg shadow-green-800/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><span>Update password</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-6 h-6 animate-spin text-green-700" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
