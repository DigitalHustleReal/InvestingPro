"use client";

/**
 * Premium Admin Login Page
 *
 * Features:
 * - Email/Password login
 * - Google OAuth login
 * - Magic link option
 * - Premium dark glassmorphic UI
 */

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Loader2,
  Lock,
  Mail,
  Zap,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const supabase = createClient();

  // On mount: check if user is already authenticated (e.g. returning from OAuth)
  // If they have admin role, redirect straight to /admin
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Check admin role
          const [profileResult, roleResult] = await Promise.all([
            supabase
              .from("user_profiles")
              .select("role")
              .eq("id", user.id)
              .single(),
            supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", user.id)
              .single(),
          ]);
          const isAdmin =
            profileResult.data?.role === "admin" ||
            roleResult.data?.role === "admin";
          if (isAdmin) {
            router.replace("/admin");
            return;
          }
        }
      } catch (e) {
        // Not authenticated, show login form
      } finally {
        setCheckingSession(false);
      }
    };
    checkExistingSession();
  }, []);

  // Check for error in URL params (from callback redirects)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Check admin role in BOTH tables (user_profiles and user_roles)
        const [profileResult, roleResult] = await Promise.all([
          supabase
            .from("user_profiles")
            .select("role")
            .eq("id", data.user.id)
            .single(),
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", data.user.id)
            .single(),
        ]);

        const isAdmin =
          profileResult.data?.role === "admin" ||
          roleResult.data?.role === "admin";

        if (isAdmin) {
          router.push("/admin");
          router.refresh();
        } else {
          await supabase.auth.signOut();
          setError("Access denied. Admin role required.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Redirect back to /admin/login — session check useEffect will detect auth and redirect to /admin
          redirectTo: `${window.location.origin}/admin/login`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        // Provide user-friendly error for disabled provider
        if (
          error.message.includes("provider") ||
          error.message.includes("not enabled")
        ) {
          setError(
            "Google login is not configured yet. Please use Email/Password or Magic Link instead.",
          );
        } else {
          setError(error.message);
        }
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Google login failed");
      setGoogleLoading(false);
    }
  };

  // Magic Link Login
  const handleMagicLink = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use the site URL directly for magic link redirect
      // Supabase will redirect to this URL after email verification
      // The callback handler will detect admin role and redirect to /admin
      const siteUrl = window.location.origin;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Point directly to /auth/callback with admin redirect
          // Important: Supabase must have this URL in the Redirect URLs allowlist
          // Redirect back to /admin/login — session check useEffect will detect auth and redirect to /admin
          emailRedirectTo: `${siteUrl}/admin/login`,
        },
      });

      if (error) {
        if (error.message.includes("rate") || error.message.includes("limit")) {
          setError(
            "Too many attempts. Please wait a few minutes and try again.",
          );
        } else {
          setError(error.message);
        }
      } else {
        setMessage(
          "✅ Check your email! Click the link to access the Admin Dashboard. (Check spam folder too)",
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-darkest dark:bg-surface-darkest flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 blur-[150px]" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 mb-4">
            <Zap className="w-8 h-8 text-foreground dark:text-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground dark:text-foreground">
            InvestingPro
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground text-sm mt-1">
            Authority CMS
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-darker/50 dark:bg-surface-darker/50 backdrop-blur-xl border border-border dark:border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground dark:text-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground dark:text-muted-foreground text-sm mt-1">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Error/Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-danger-500/10 border border-danger-500/20 rounded-lg flex items-center gap-2 text-danger-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-success-500/10 border border-success-500/20 rounded-lg flex items-center gap-2 text-success-400 text-sm">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              {message}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-muted dark:bg-muted hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-foreground dark:text-foreground font-medium rounded-xl transition-all duration-200 mb-4 disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-muted-foreground/70 dark:text-muted-foreground/70 text-sm">
              or
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground/80 dark:text-foreground/80 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70 dark:text-muted-foreground/70" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@investingpro.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-border dark:border-border rounded-xl text-foreground dark:text-foreground placeholder:text-muted-foreground/70 dark:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground/80 dark:text-foreground/80 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70 dark:text-muted-foreground/70" />
                <input
                  id="password"
                  type="password"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-border dark:border-border rounded-xl text-foreground dark:text-foreground placeholder:text-muted-foreground/70 dark:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-foreground dark:text-foreground font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Magic Link Option */}
          <div className="mt-4 text-center">
            <button
              onClick={handleMagicLink}
              disabled={loading || !email}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send me a magic link instead
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-border dark:border-border text-center">
            <p className="text-muted-foreground dark:text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link
                href="/admin/signup"
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground/70 dark:text-muted-foreground/70 text-xs mt-6">
          Protected by Supabase Auth â€¢ Secure & Encrypted
        </p>
      </div>
    </div>
  );
}
