/**
 * Minimal test page — isolate the 500 error
 * Access at: /articles/{slug}?test=1
 */
import { createServiceClient } from "@/lib/supabase/service";

export default async function TestArticlePage({ slug }: { slug: string }) {
  const supabase = createServiceClient();
  const { data: article, error } = await supabase
    .from("articles")
    .select("id, title, slug, status, category, body_html, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article || error) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Article not found</h1>
        <p>Slug: {slug}</p>
        <p>Error: {error?.message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1>{article.title}</h1>
      <p style={{ color: "gray" }}>
        {article.category} | {article.slug}
      </p>
      <p>{article.excerpt}</p>
      <hr />
      <div
        dangerouslySetInnerHTML={{
          __html: article.body_html || "<p>No HTML body</p>",
        }}
      />
    </div>
  );
}
