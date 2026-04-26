"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  searchParamsPromise: Promise<{ email?: string; token?: string }>;
}

type State = "form" | "loading" | "success" | "error";

export default function UnsubscribeClient({ searchParamsPromise }: Props) {
  const initialParams = use(searchParamsPromise);
  const [email, setEmail] = useState(initialParams.email || "");
  const [state, setState] = useState<State>("form");
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-unsubscribe if URL has both email + token (one-click from email footer)
  useEffect(() => {
    if (initialParams.email && initialParams.token) {
      doUnsubscribe(initialParams.email);
    }
    // We deliberately exclude doUnsubscribe from the dep array — it's
    // a stable function and re-running on each render is wrong.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialParams.email, initialParams.token]);

  async function doUnsubscribe(targetEmail: string) {
    setState("loading");
    try {
      const res = await fetch(
        `/api/newsletter?email=${encodeURIComponent(targetEmail)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (data.success) {
        setState("success");
      } else {
        setErrorMessage(data.message || "Unable to unsubscribe right now.");
        setState("error");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Network error. Try again.",
      );
      setState("error");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    doUnsubscribe(email);
  }

  if (state === "success") {
    return (
      <div className="text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
          Unsubscribed
        </div>
        <h1 className="font-display text-[36px] md:text-[44px] font-black text-ink leading-[1.1] mb-6">
          We&apos;re sorry to see you go.
        </h1>
        <p className="text-[16px] text-ink-80 leading-relaxed mb-8">
          {email} has been removed from our newsletter list. You won&apos;t
          receive any more emails from us. If you change your mind, you can
          re-subscribe anytime from any article footer or our homepage.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-wider px-5 py-3 border-2 border-ink text-ink hover:bg-ink hover:text-canvas transition-colors"
          >
            Back to homepage
          </Link>
          <Link
            href="/articles"
            className="font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
          >
            Read latest articles &rarr;
          </Link>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warning-red mb-4">
          Something went wrong
        </div>
        <h1 className="font-display text-[32px] md:text-[40px] font-black text-ink leading-[1.1] mb-6">
          We couldn&apos;t process that.
        </h1>
        <p className="text-[15px] text-ink-80 leading-relaxed mb-6">
          {errorMessage}
        </p>
        <p className="text-[14px] text-ink-60 leading-relaxed mb-8">
          You can try again, or email{" "}
          <a
            href="mailto:contact@investingpro.in"
            className="text-indian-gold hover:underline"
          >
            contact@investingpro.in
          </a>{" "}
          and we&apos;ll remove you manually.
        </p>
        <button
          onClick={() => {
            setState("form");
            setErrorMessage("");
          }}
          className="font-mono text-[11px] uppercase tracking-wider px-5 py-3 border-2 border-ink text-ink hover:bg-ink hover:text-canvas transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
        Newsletter
      </div>
      <h1 className="font-display text-[36px] md:text-[44px] font-black text-ink leading-[1.1] mb-6">
        Unsubscribe.
      </h1>
      <p className="text-[16px] text-ink-80 leading-relaxed mb-8">
        Confirm your email address below and we&apos;ll remove you from the
        InvestingPro newsletter immediately. No survey, no &quot;why are you
        leaving&quot; popup — we respect your time.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-60 mb-2 block">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rahul@gmail.com"
            className="w-full px-4 py-3 border-2 border-ink/20 focus:border-ink focus:outline-none font-mono text-[14px] bg-canvas"
            disabled={state === "loading"}
          />
        </label>
        <button
          type="submit"
          disabled={state === "loading" || !email}
          className="w-full sm:w-auto font-mono text-[11px] uppercase tracking-wider px-6 py-3 bg-ink text-canvas hover:bg-warning-red transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {state === "loading" ? "Removing…" : "Unsubscribe me"}
        </button>
      </form>
      <p className="mt-8 text-[13px] text-ink-60 leading-relaxed">
        Changed your mind?{" "}
        <Link href="/" className="text-indian-gold hover:underline">
          Visit the homepage
        </Link>{" "}
        — there&apos;s a re-subscribe form in the footer of every article.
      </p>
    </div>
  );
}
