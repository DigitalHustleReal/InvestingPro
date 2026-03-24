import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CreditCard, CheckCircle2, XCircle, ArrowRight,
  Minus, Trophy, ShieldCheck, AlertCircle,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import {
  CARD_SEED, POPULAR_PAIRS, parsePairSlug, buildPairSlug,
  getCardBySlug, COMPARISON_DIMENSIONS, CardSeedData,
} from '@/lib/data/card-vs-card';
import { createServiceClient } from '@/lib/supabase/service';

export const revalidate = 86400;

interface Props { params: { pair: string } }

/** Try Supabase first, fall back to seed data */
async function fetchCard(slug: string): Promise<CardSeedData | null> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      return {
        slug: data.slug,
        name: data.name,
        issuer: data.provider ?? data.issuer ?? '',
        network: data.network ?? 'Visa',
        annualFee: data.annual_fee ?? data.annualFee ?? 0,
        joiningFee: data.joining_fee ?? data.joiningFee ?? 0,
        annualFeeWaiver: data.annual_fee_waiver ?? '',
        rewardRate: data.reward_rate ?? data.rewardRate ?? '',
        welcomeOffer: data.welcome_offer ?? '',
        loungeAccess: data.lounge_access ?? 'None',
        fuelSurcharge: Boolean(data.fuel_surcharge),
        category: Array.isArray(data.features) ? [] : [],
        minCibilScore: data.min_credit_score ?? 720,
        minIncome: data.min_income ?? '₹30,000/month',
        bestFor: data.best_for ?? '',
        pros: Array.isArray(data.pros) ? data.pros : [],
        cons: Array.isArray(data.cons) ? data.cons : [],
        rating: data.rating ?? 4.0,
        applyLink: data.apply_link ?? `/apply/${slug}`,
      };
    }
  } catch { /* fallthrough */ }

  return getCardBySlug(slug) ?? null;
}

export async function generateStaticParams() {
  return POPULAR_PAIRS.map(([a, b]) => ({ pair: buildPairSlug(a, b) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parsePairSlug(params.pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const cardA = getCardBySlug(slugA);
  const cardB = getCardBySlug(slugB);
  if (!cardA || !cardB) return {};
  return {
    title: `${cardA.name} vs ${cardB.name} — Which is Better? | InvestingPro`,
    description: `${cardA.name} vs ${cardB.name} — detailed comparison of annual fee, rewards, lounge access, eligibility. Find out which credit card wins for you.`,
  };
}

const WinnerBadge = ({ winner, side }: { winner: 'a' | 'b' | 'tie'; side: 'a' | 'b' }) => {
  if (winner === 'tie') return <Minus className="h-3.5 w-3.5 text-slate-400 mx-auto" />;
  if (winner === side) return <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />;
  return <XCircle className="h-4 w-4 text-red-400 mx-auto" />;
};

export default async function CardVsCardPage({ params }: Props) {
  const parsed = parsePairSlug(params.pair);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const [cardA, cardB] = await Promise.all([fetchCard(slugA), fetchCard(slugB)]);
  if (!cardA || !cardB) notFound();

  // Tally wins
  const wins = { a: 0, b: 0, tie: 0 };
  for (const dim of COMPARISON_DIMENSIONS) {
    wins[dim.winner(cardA, cardB)]++;
  }
  const overallWinner = wins.a > wins.b ? cardA : wins.b > wins.a ? cardB : null;

  // Other popular comparisons
  const relatedPairs = POPULAR_PAIRS
    .filter(([a, b]) => (a === slugA || b === slugA || a === slugB || b === slugB) && buildPairSlug(a, b) !== params.pair)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title={`${cardA.name} vs ${cardB.name} — Which Credit Card Wins? | InvestingPro`}
        description={`Detailed ${cardA.name} vs ${cardB.name} comparison. Annual fee, rewards rate, lounge access, eligibility — see which card is better for your spending.`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `${cardA.name} vs ${cardB.name}`,
          description: `Credit card comparison: ${cardA.name} vs ${cardB.name}`,
          url: `https://investingpro.in/credit-cards/vs/${params.pair}`,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://investingpro.in' },
              { '@type': 'ListItem', position: 2, name: 'Credit Cards', item: 'https://investingpro.in/credit-cards' },
              { '@type': 'ListItem', position: 3, name: `${cardA.name} vs ${cardB.name}`, item: `https://investingpro.in/credit-cards/vs/${params.pair}` },
            ],
          },
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 pt-24 pb-14">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-4 [&_*]:text-slate-300 [&_a]:text-slate-400" />

          <div className="inline-flex items-center gap-2 bg-green-400/20 border border-green-400/30 text-green-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Independent comparison · No sponsored rankings
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display mb-6">
            {cardA.name} <span className="text-slate-400">vs</span> {cardB.name}
          </h1>

          {/* Card header cards */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            {[
              { card: cardA, side: 'a' as const },
              { card: cardB, side: 'b' as const },
            ].map(({ card, side }) => (
              <div key={card.slug}
                className={`rounded-xl border p-5 ${overallWinner?.slug === card.slug
                  ? 'bg-green-900/40 border-green-500/50'
                  : 'bg-white/10 border-white/20'}`}>
                {overallWinner?.slug === card.slug && (
                  <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-green-300">
                    <Trophy className="h-3.5 w-3.5" /> Our Pick
                  </div>
                )}
                <div className="font-bold text-white mb-0.5">{card.name}</div>
                <div className="text-xs text-slate-300 mb-3">{card.issuer} · {card.network}</div>
                <div className="text-2xl font-bold text-amber-300 font-display">
                  {card.annualFee === 0 ? 'Free' : `₹${card.annualFee.toLocaleString('en-IN')}`}
                  <span className="text-xs font-normal text-slate-300 ml-1">/year</span>
                </div>
                <div className="text-xs text-slate-300 mt-1">Rating: {card.rating}/5</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-10 max-w-4xl">

        {/* Winner callout */}
        {overallWinner ? (
          <div className="flex items-start gap-3 p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <Trophy className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-green-900 dark:text-green-200 mb-1">
                {overallWinner.name} wins — {wins[overallWinner.slug === cardA.slug ? 'a' : 'b']} vs {wins[overallWinner.slug === cardA.slug ? 'b' : 'a']} dimensions
              </div>
              <p className="text-sm text-green-800 dark:text-green-300">
                Best for: {overallWinner.bestFor}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              These cards are closely matched — the right choice depends on your spending pattern. See the breakdown below.
            </p>
          </div>
        )}

        {/* Comparison table */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5">
            Head-to-Head Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Feature</th>
                  <th className="py-3 px-4 text-center font-semibold text-green-700 dark:text-green-400">
                    {cardA.issuer.split(' ')[0]} {cardA.name.split(' ').slice(-2).join(' ')}
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-blue-700 dark:text-blue-400">
                    {cardB.issuer.split(' ')[0]} {cardB.name.split(' ').slice(-2).join(' ')}
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-slate-500">Winner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {COMPARISON_DIMENSIONS.map(dim => {
                  const valA = dim.keyA(cardA);
                  const valB = dim.keyA(cardB);
                  const winner = dim.winner(cardA, cardB);
                  const fmt = dim.format ?? (v => String(v));
                  return (
                    <tr key={dim.label} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-4 font-medium text-slate-700 dark:text-slate-300">{dim.label}</td>
                      <td className={`py-2.5 px-4 text-center text-sm ${winner === 'a' ? 'font-semibold text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {fmt(valA)}
                      </td>
                      <td className={`py-2.5 px-4 text-center text-sm ${winner === 'b' ? 'font-semibold text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {fmt(valB)}
                      </td>
                      <td className="py-2.5 px-4">
                        <WinnerBadge winner={winner} side="a" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pros/cons per card */}
        <section className="grid sm:grid-cols-2 gap-6">
          {[cardA, cardB].map((card, i) => (
            <div key={card.slug} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <div className={`font-bold text-base mb-4 ${i === 0 ? 'text-green-800 dark:text-green-300' : 'text-blue-800 dark:text-blue-300'}`}>
                {card.name}
              </div>
              {card.pros.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Pros</div>
                  <ul className="space-y-1.5">
                    {card.pros.map(p => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {card.cons.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Cons</div>
                  <ul className="space-y-1.5">
                    {card.cons.map(c => (
                      <li key={c} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href={`/credit-cards/${card.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 dark:text-green-400 hover:underline">
                Full review <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </section>

        {/* Who should pick which */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display mb-5">
            Which Card is Right for You?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { card: cardA, color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
              { card: cardB, color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
            ].map(({ card, color }) => (
              <div key={card.slug} className={`rounded-xl border p-4 ${color}`}>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">Choose {card.name.split(' ').slice(-2).join(' ')} if…</div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{card.bestFor}</p>
                <div className="mt-3 text-xs text-slate-500">
                  Min CIBIL: {card.minCibilScore} · Min Income: {card.minIncome}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Apply CTAs */}
        <section className="grid sm:grid-cols-2 gap-4">
          {[cardA, cardB].map(card => (
            <a key={card.slug} href={card.applyLink}
              className="flex items-center justify-between p-5 bg-green-700 hover:bg-green-600 rounded-xl transition-colors">
              <div>
                <div className="text-xs text-green-200 mb-0.5">Apply Now</div>
                <div className="font-bold text-white">{card.name}</div>
                <div className="text-xs text-green-200 mt-0.5">
                  {card.annualFee === 0 ? 'Lifetime Free' : `₹${card.annualFee.toLocaleString('en-IN')}/year`}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-green-200" />
            </a>
          ))}
        </section>

        {/* Related comparisons */}
        {relatedPairs.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display mb-4">
              Related Comparisons
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedPairs.map(([a, b]) => {
                const cA = getCardBySlug(a);
                const cB = getCardBySlug(b);
                if (!cA || !cB) return null;
                return (
                  <Link key={`${a}-${b}`} href={`/credit-cards/vs/${buildPairSlug(a, b)}`}
                    className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-300 hover:shadow-md transition-all">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                      {cA.name.split(' ').slice(-2).join(' ')} vs {cB.name.split(' ').slice(-2).join(' ')}
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 shrink-0 ml-2" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
