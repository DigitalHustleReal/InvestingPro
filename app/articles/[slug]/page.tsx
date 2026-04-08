import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("articles")
      .select("slug")
      .eq("status", "published")
      .order("views", { ascending: false })
      .limit(100);
    return (data || []).map((a: any) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt, seo_title, seo_description")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) return { title: "Article Not Found | InvestingPro" };

  return {
    title: article.seo_title || `${article.title} | InvestingPro`,
    description: article.seo_description || article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article || error) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-primary">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href="/articles" className="hover:text-primary">
          Articles
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground">{article.title}</span>
      </nav>

      <h1 className="text-4xl font-bold text-foreground mb-4">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="text-lg text-muted-foreground mb-8 border-l-4 border-primary/30 pl-4">
          {article.excerpt}
        </p>
      )}

      <div className="text-sm text-muted-foreground mb-8 flex gap-4">
        <span>{article.category?.replace(/-/g, " ")}</span>
        <span>{article.read_time || "5"} min read</span>
        {article.published_at && (
          <span>
            {new Date(article.published_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      <article
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html:
            article.body_html ||
            article.content ||
            "<p>Content not available</p>",
        }}
      />
    </div>
  );
}
