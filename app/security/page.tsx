/**
 * /security — Security & Data Practices.
 * Required by trust signals + linked from footer. Was 404 before.
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Shield,
  Lock,
  KeyRound,
  Eye,
  AlertTriangle,
  Server,
} from "lucide-react";

const LAST_UPDATED = "2026-04-26";

export const metadata: Metadata = {
  title: "Security & Data Practices | InvestingPro",
  description:
    "How InvestingPro secures user data, processes affiliate clicks, and protects against common vulnerabilities. Encryption, RLS, audit-log, and disclosure policy.",
  alternates: { canonical: "https://investingpro.in/security" },
};

const PILLARS = [
  {
    icon: Lock,
    title: "Encryption in transit + at rest",
    body: "All traffic uses TLS 1.3. User data and authentication tokens are stored on Supabase Postgres with AES-256 at rest. Service-role credentials never reach the browser.",
  },
  {
    icon: KeyRound,
    title: "Row-Level Security (RLS) on every table",
    body: "Postgres RLS policies gate every read + write. Anonymous traffic can only INSERT to public-tracking tables (newsletter, web_vitals, affiliate_clicks); admin tables require authenticated admin role enforced upstream in middleware.",
  },
  {
    icon: Eye,
    title: "No third-party tracking pixels in production",
    body: "We use first-party PostHog + Sentry for error/perf telemetry. No Facebook Pixel, no Hotjar session-replay, no advertising SDKs. Affiliate-network scripts (Cuelinks/EarnKaro) load only on user-initiated apply-now click.",
  },
  {
    icon: Server,
    title: "Hardened deployment surface",
    body: "Hosted on Vercel with Fluid Compute, Node 24 LTS, structured logging, request rate-limiting on all /api/* and /admin/* routes via Upstash Redis. Cron secrets rotated quarterly.",
  },
];

const PRACTICES = [
  "Quarterly secret rotation: CRON_SECRET, Supabase JWT signing key, third-party API keys",
  "RLS policies tested in CI + verified post-migration",
  "DOMPurify sanitization on user-generated and AI-generated HTML rendering",
  "Audit log on every admin action (article publish, product edit, user role change)",
  "Sentry alerts on 5xx spikes, Slack notifications on cron failures",
  "Defence-in-depth: middleware auth + layout-level guards + route-level admin checks",
  "Regular dependency audits via `npm audit` + GitHub Dependabot",
  "No PII in logs or analytics_events — emails are hashed for ip_hash columns",
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <section className="surface-ink pt-12 pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-canvas-70">
              <li>
                <Link
                  href="/"
                  className="hover:text-indian-gold transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-3 h-3" />
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-canvas-70" />
              <li className="text-canvas">Security</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Trust · Last updated {LAST_UPDATED}
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            Security &amp;{" "}
            <span className="text-indian-gold">data practices</span>.
          </h1>
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            How we secure user data, encrypt traffic, sandbox third-party
            scripts, and disclose vulnerabilities. We treat security as an
            editorial standard — not a back-office concern.
          </p>
        </div>
      </section>

      <section className="bg-canvas py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Four pillars
          </div>
          <h2 className="font-display text-[30px] md:text-[36px] font-black text-ink leading-tight mb-10 max-w-[820px]">
            What we protect, and how.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 max-w-[1000px]">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-l-2 border-indian-gold pl-5">
                <Icon className="w-5 h-5 text-indian-gold mb-3" />
                <h3 className="font-display text-[20px] font-bold text-ink mb-2 leading-tight">
                  {title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-ink-80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Operating practices
          </div>
          <h2 className="font-display text-[28px] md:text-[34px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            Day-to-day discipline.
          </h2>
          <ul className="space-y-3 text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
            {PRACTICES.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Responsible disclosure
          </div>
          <h2 className="font-display text-[28px] md:text-[34px] font-black text-ink leading-tight mb-4 max-w-[820px]">
            Found a vulnerability?
          </h2>
          <p className="text-[16px] leading-[1.7] text-ink-80 max-w-[820px] mb-4">
            Email{" "}
            <a
              href="mailto:security@investingpro.in"
              className="text-indian-gold hover:underline"
            >
              security@investingpro.in
            </a>{" "}
            with a description, reproduction steps, and the impact you observed.
            Please do not run automated scanners against production. We
            acknowledge reports within 48 hours and aim to remediate critical
            issues within 7 days. We do not currently run a paid bug bounty but
            will publicly credit security researchers who help us improve.
          </p>
          <div className="border-l-2 border-warning-red pl-5 mt-6">
            <div className="font-mono text-[11px] uppercase tracking-wider text-warning-red mb-1">
              Out of scope
            </div>
            <p className="text-[14px] leading-[1.6] text-ink-80">
              Subdomain takeover of marketing-only properties, missing HTTP
              security headers without proven impact, social-engineering of
              staff, denial-of-service.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-10 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-60">
          <div>Security policy v1.0 · last updated {LAST_UPDATED}</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="hover:text-indian-gold transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-indian-gold transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/about/editorial-standards"
              className="hover:text-indian-gold transition-colors"
            >
              Editorial standards
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
