// About InvestingPro — founding story + editorial team + trust links.
//
// v3 redesign (2026-04-27). Replaces previous v1/v2 page that used
// gray-*/primary-* tokens, vague "Helping India Make Better Financial
// Decisions" headline, and a sales-y "Join the Revolution" CTA.
//
// Voice: founder-first, humanistic, anti-push-selling. Built from inputs
// the founder provided + research patterns from NerdWallet ("Why trust us"),
// Bankrate ("About"), Investopedia ("Reviewed by") + Wise (founder-voice).
//
// Preserved from previous version:
//   - Supabase editorial-team fetch (live data, not hardcoded)
//   - Live article count fetch with safe fallback
//   - Investing.com legal disclaimer at the bottom (legally important —
//     clarifies we are NOT affiliated with the unrelated Investing.com /
//     InvestingPro™ by Investing.com)

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  BookOpen,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  Languages,
} from "lucide-react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const revalidate = 86400; // ISR: 24h — about page rarely changes

export const metadata: Metadata = {
  title: "About InvestingPro — Built to Empower, Not to Sell",
  description:
    "InvestingPro was built to empower Indians, not sell to them. Independent ratings, methodology disclosed, and a roadmap to vernacular financial literacy. Founded by an MBA Finance graduate from NMIMS, Mumbai.",
  alternates: { canonical: "https://www.investingpro.in/about" },
  openGraph: {
    title: "About InvestingPro — Built to Empower, Not to Sell",
    description:
      "Independent. Methodology disclosed. Vernacular financial literacy roadmap. Built from Visakhapatnam, for India.",
    url: "https://www.investingpro.in/about",
    type: "website",
  },
};

const BELIEFS = [
  {
    label: "RESPECT",
    headline: "Money decisions deserve respect.",
    body: "Your job, your savings, your retirement — these aren't background noise. They're the texture of your life.",
  },
  {
    label: "TRANSPARENCY",
    headline: "Math should be public.",
    body: "If we can't show our work, we shouldn't expect you to trust the answer. Methodology lives at /methodology, not in a 30-page PDF.",
  },
  {
    label: "STRUCTURE",
    headline: "Independence is structural.",
    body: "Affiliate revenue exists; it just has to be walled off from editorial. Policy, not intention.",
  },
  {
    label: "ACCESS",
    headline: "Vernacular is a right.",
    body: "Indians who think in Hindi, Telugu, Bengali, Kannada, Tamil deserve the same depth of financial advice as Indians who think in English.",
  },
] as const;

const VISION_PERSONAS = [
  "A 22-year-old in Hyderabad compares 81 credit cards in 3 minutes and picks one they actually understand",
  "A grandmother in Bhopal reads about mutual funds in Hindi and decides if SIP makes sense for her",
  "A first-time founder in Vijayawada structures their CTC like they negotiated at a Fortune 500",
  "An NRI in Dubai compares Indian FDs against gulf bank rates with full clarity, in their preferred language",
] as const;

const TRUST_LINKS = [
  {
    icon: Shield,
    label: "How we make money",
    href: "/about/how-we-make-money",
  },
  { icon: BookOpen, label: "Read methodology", href: "/methodology" },
  {
    icon: Clock,
    label: "Editorial standards",
    href: "/about/editorial-standards",
  },
] as const;

export default async function AboutPage() {
  // Live editorial-team fetch (preserved from v1/v2 version).
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: teamMembers } = await supabase
    .from("authors")
    .select("id, name, slug, role, avatar, bio, is_expert, expert_order")
    .eq("is_expert", true)
    .order("expert_order")
    .limit(20);

  const members = teamMembers || [
    {
      name: "Shiv Pratap",
      role: "Founder & Editor-in-Chief",
      slug: "shiv-pratap",
      avatar: null,
    },
    {
      name: "InvestingPro Editorial",
      role: "Research & Analysis",
      slug: "investingpro",
      avatar: null,
    },
  ];

  return (
    <div className="bg-canvas">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="border-b-2 border-ink/10">
        <div className="max-w-[920px] mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-5">
            The InvestingPro Story · 2026
          </div>
          <h1 className="font-display font-black text-[42px] sm:text-[64px] lg:text-[80px] text-ink leading-[1.02] tracking-tight mb-6">
            Built to empower<span className="text-indian-gold">,</span> not to
            sell.
          </h1>
          <p className="text-[18px] sm:text-[20px] text-ink-60 leading-relaxed max-w-[680px]">
            Most Indian financial platforms aren&apos;t built to help you.
            They&apos;re built to sell to you. That&apos;s the gap we&apos;re
            closing — independently, transparently, and eventually in every
            Indian language.
          </p>
        </div>
      </section>

      {/* ── Founding Story Narrative ────────────────────────────── */}
      <section>
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-16 md:py-24">
          <article className="prose prose-lg max-w-none article-prose">
            <h2 className="font-display font-black text-[32px] md:text-[40px] text-ink leading-tight tracking-tight mb-6">
              It started with curiosity, not a business plan.
            </h2>

            <p className="text-[17px] text-ink leading-relaxed mb-5">
              I&apos;d just finished my MBA in Finance from{" "}
              <strong>NMIMS, Mumbai</strong>. Like every Indian household, mine
              had its share of money confusion — relatives making policy
              decisions on a salesperson&apos;s word, friends choosing mutual
              funds because of a friend&apos;s friend, parents locking savings
              in products they didn&apos;t fully understand.
            </p>

            <p className="text-[17px] text-ink leading-relaxed mb-5">
              I knew the math. They didn&apos;t. And I noticed something: the
              answer wasn&apos;t <em>missing</em> — it was <em>gatekept</em>.
              Sales-first comparison sites with paid placements.
              &ldquo;Methodology&rdquo; hidden as a trade secret. Comparison
              engines that ranked products by who paid the most for the slot,
              not by who served the user best.
            </p>

            <p className="text-[17px] text-ink leading-relaxed mb-8">
              But that wasn&apos;t the worst part.
            </p>

            <h3 className="font-display font-black text-[26px] md:text-[32px] text-ink leading-tight tracking-tight mt-12 mb-5">
              The worst part was the language.
            </h3>

            <p className="text-[17px] text-ink leading-relaxed mb-5">
              A 22-year-old in Visakhapatnam reads Telugu. A grandmother in
              Bhopal reads Hindi. A migrant worker in Bengaluru reads Kannada.
              Yet every quality money-advice site in India publishes only in
              English — leaving 90%+ of the country to navigate financial
              decisions through second-best translations or word-of-mouth from
              people just as lost.
            </p>

            {/* Pull quote — gold accent, Playfair italic */}
            <blockquote className="border-l-4 border-indian-gold pl-6 my-10 italic font-display text-[24px] md:text-[28px] text-ink leading-snug tracking-tight">
              &ldquo;Financial literacy in your own language isn&apos;t a
              nice-to-have. It&apos;s a right.&rdquo;
            </blockquote>

            <h3 className="font-display font-black text-[26px] md:text-[32px] text-ink leading-tight tracking-tight mt-12 mb-5">
              So I built InvestingPro.
            </h3>

            <p className="text-[17px] text-ink leading-relaxed mb-5">
              A comparison platform where the math is published. Where the
              methodology lives at{" "}
              <Link
                href="/methodology"
                className="text-indian-gold underline hover:no-underline"
              >
                /methodology
              </Link>{" "}
              — not buried in a 30-page PDF. Where every product has a disclosed
              editorial weight, anchored to a real regulator (RBI for banking,
              SEBI for securities, IRDAI for insurance, AMFI for funds). Where
              affiliate commissions never move scores or rankings, and where
              editorial and commercial teams are separated by policy, not just
              by intention.
            </p>

            <p className="text-[17px] text-ink leading-relaxed mb-8">
              We&apos;re starting in English. But the real goal is for
              InvestingPro to be the most-trusted personal finance comparison
              platform in <strong>every Indian language</strong>. Hindi first.
              Telugu and Tamil close behind. Then the others.
            </p>
          </article>
        </div>
      </section>

      {/* ── What we believe ─────────────────────────────────────── */}
      <section className="border-y-2 border-ink/10 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3 text-center">
            What we believe
          </div>
          <h2 className="font-display font-black text-[32px] md:text-[40px] text-ink leading-tight tracking-tight mb-12 text-center">
            Four convictions that shape every page.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/10 border-2 border-ink/10 rounded-sm overflow-hidden">
            {BELIEFS.map((b) => (
              <div key={b.label} className="bg-canvas p-6 md:p-8">
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-3">
                  {b.label}
                </div>
                <h3 className="font-display font-black text-[24px] md:text-[26px] text-ink leading-tight tracking-tight mb-3">
                  {b.headline}
                </h3>
                <p className="text-[14px] md:text-[15px] text-ink-60 leading-relaxed">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we're not (yet) ────────────────────────────────── */}
      <section>
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
            What we&apos;re not (yet)
          </div>
          <h2 className="font-display font-black text-[32px] md:text-[40px] text-ink leading-tight tracking-tight mb-6">
            We&apos;re the index, not the trade.
          </h2>
          <div className="space-y-4 text-[16px] text-ink leading-relaxed">
            <p>
              We&apos;re not licensed. We&apos;re not a SEBI-registered
              investment advisor. We&apos;re not a stockbroker. We&apos;re not
              your financial planner.
            </p>
            <p>
              We&apos;re a <strong>comparison + research platform</strong> — the
              index, not the trade.
            </p>
            <p className="text-ink-60">
              If you need licensed advice, talk to a SEBI-registered investment
              advisor. If you need protection planning, talk to a licensed
              insurance agent. We help you walk into those conversations more
              informed than you walked out the last time.
            </p>
          </div>
        </div>
      </section>

      {/* ── Where we're going ───────────────────────────────────── */}
      <section className="bg-ink text-canvas">
        <div className="max-w-[920px] mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
            <Languages className="w-3.5 h-3.5" />
            Where we&apos;re going
          </div>
          <h2 className="font-display font-black text-[36px] md:text-[52px] text-canvas leading-[1.05] tracking-tight mb-10">
            One promise<span className="text-indian-gold">,</span> in every
            Indian language.
          </h2>
          <p className="text-[17px] md:text-[18px] text-canvas-70 leading-relaxed mb-10 max-w-[700px]">
            In 12–24 months, we want to be the platform where <em>every</em>{" "}
            Indian — regardless of city, language, or starting knowledge — can
            make the next money decision with the same confidence as someone who
            studied finance.
          </p>
          <ul className="space-y-4">
            {VISION_PERSONAS.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2
                  className="w-5 h-5 text-indian-gold flex-shrink-0 mt-1"
                  strokeWidth={2.5}
                />
                <span className="text-[15px] md:text-[16px] text-canvas leading-relaxed">
                  {p}
                </span>
              </li>
            ))}
          </ul>
          <p className="font-display font-black text-[24px] md:text-[28px] text-indian-gold leading-tight tracking-tight mt-12">
            That&apos;s the promise of &ldquo;Money, Decoded.&rdquo;
          </p>
        </div>
      </section>

      {/* ── Trust links strip (echo of homepage PromiseStrip) ──── */}
      <section className="border-y-2 border-ink/10 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-4 text-center">
            Read the receipts
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TRUST_LINKS.map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between gap-4 border-2 border-ink/10 rounded-sm p-5 hover:border-indian-gold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="w-5 h-5 text-indian-gold flex-shrink-0"
                    strokeWidth={2}
                  />
                  <span className="font-mono text-[12px] uppercase tracking-wider text-ink font-semibold">
                    {label}
                  </span>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-ink-60 group-hover:text-indian-gold transition-colors flex-shrink-0"
                  strokeWidth={2}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial team (preserved data, redesigned UI) ─────── */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
              The Editorial Desk
            </div>
            <h2 className="font-display font-black text-[32px] md:text-[40px] text-ink leading-tight tracking-tight mb-3">
              Built by people you can name.
            </h2>
            <p className="text-ink-60 max-w-[560px] mx-auto leading-relaxed">
              Every article is researched from official sources and fact-checked
              before publishing. No anonymous &ldquo;industry experts.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map((member: any) => (
              <Link
                key={member.slug}
                href={`/author/${member.slug}`}
                className="group bg-canvas border-2 border-ink/10 rounded-sm overflow-hidden hover:border-indian-gold transition-colors"
              >
                <div className="aspect-square relative overflow-hidden bg-ink/5 flex items-center justify-center">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="font-display font-black text-[44px] md:text-[56px] text-ink select-none">
                      {member.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p: string) => p[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-black text-[16px] text-ink leading-tight mb-1 group-hover:text-indian-gold transition-colors">
                    {member.name}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
                    {member.role}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder block ──────────────────────────────────────── */}
      <section className="border-y-2 border-ink/10 bg-canvas">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-16">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
            The Founder
          </div>
          <h2 className="font-display font-black text-[28px] md:text-[36px] text-ink leading-tight tracking-tight mb-4">
            Shiv Pratap
          </h2>
          <p className="font-mono text-[12px] uppercase tracking-wider text-ink-60 mb-6">
            Founder &amp; Editor-in-Chief
          </p>
          <p className="text-[16px] text-ink leading-relaxed mb-4">
            MBA Finance, NMIMS Mumbai. Building InvestingPro from Visakhapatnam
            after watching too many friends and family members make financial
            decisions on incomplete information.
          </p>
          <p className="text-[16px] text-ink-60 leading-relaxed">
            Reach me at{" "}
            <a
              href="mailto:contact@investingpro.in"
              className="text-indian-gold underline hover:no-underline"
            >
              contact@investingpro.in
            </a>
            .
          </p>
        </div>
      </section>

      {/* ── Investing.com legal disclaimer (PRESERVED — legally important) ── */}
      <section className="bg-ink/5 border-t-2 border-ink/10">
        <div className="max-w-[920px] mx-auto px-4 sm:px-6 py-10 text-center">
          <p className="font-mono text-[11px] text-ink-60 leading-relaxed">
            <strong className="text-ink">Independence note:</strong>{" "}
            InvestingPro.in is an independent platform owned and operated in
            India. It is <strong>not</strong> affiliated with, endorsed by, or
            associated in any way with Investing.com, InvestingPro™ by
            Investing.com, or any of their parent companies, subsidiaries, or
            affiliates. All trademarks belong to their respective owners.
          </p>
        </div>
      </section>
    </div>
  );
}
