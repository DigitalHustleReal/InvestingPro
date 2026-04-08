import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function cleanup() {
  console.log("=== ARTICLE CLEANUP ===\n");

  // 1. Delete test/junk articles
  const { error: e1, count: c1 } = await supabase
    .from("articles")
    .delete({ count: "exact" })
    .or("title.ilike.%test%,title.ilike.%untitled%,title.ilike.%lorem%");
  console.log("Deleted junk/test:", c1, e1?.message || "");

  // 2. Delete articles with null body
  const { error: e2, count: c2 } = await supabase
    .from("articles")
    .delete({ count: "exact" })
    .is("body_markdown", null);
  console.log("Deleted null body:", c2, e2?.message || "");

  // 3. Delete articles with empty string body
  const { error: e3, count: c3 } = await supabase
    .from("articles")
    .delete({ count: "exact" })
    .eq("body_markdown", "");
  console.log("Deleted empty body:", c3, e3?.message || "");

  // 4. Count remaining
  const { count } = await supabase
    .from("articles")
    .select("id", { count: "exact" });
  console.log("\n=== REMAINING:", count, "articles ===\n");

  // 5. Show what survived
  const { data } = await supabase
    .from("articles")
    .select("title, status, quality_score")
    .order("quality_score", { ascending: false })
    .limit(20);

  (data || []).forEach((a: any) =>
    console.log(`  [${a.status} q:${a.quality_score || "?"}] ${a.title}`),
  );
}

cleanup().catch(console.error);
