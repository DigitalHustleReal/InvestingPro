import { permanentRedirect } from "next/navigation";

// Legacy duplicate route — canonical is /articles/[slug].
// 301s keep any old backlinks + Google-cached URLs intact.
export default async function LegacyArticleRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/articles/${slug}`);
}

// Ensure Next doesn't try to prerender this with ISR
export const dynamic = "force-dynamic";
