import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function audit() {
  const { count } = await supabase
    .from("articles")
    .select("id", { count: "exact" });
  console.log("Total articles:", count);

  for (const s of ["draft", "published", "review", "archived", "trash"]) {
    const { count: c } = await supabase
      .from("articles")
      .select("id", { count: "exact" })
      .eq("status", s);
    console.log(`  ${s}: ${c}`);
  }

  console.log("\n=== PUBLISHED (first 10) ===");
  const { data: pub } = await supabase
    .from("articles")
    .select("title, quality_score")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(10);
  (pub || []).forEach((a: any) =>
    console.log(`  [${a.quality_score || "?"}] ${a.title}`),
  );

  console.log("\n=== DRAFTS (first 10) ===");
  const { data: drafts } = await supabase
    .from("articles")
    .select("title, quality_score")
    .eq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(10);
  (drafts || []).forEach((a: any) =>
    console.log(`  [${a.quality_score || "?"}] ${a.title}`),
  );

  console.log("\n=== POSSIBLE JUNK (test/untitled/lorem) ===");
  const { data: junk } = await supabase
    .from("articles")
    .select("id, title, status")
    .or("title.ilike.%test%,title.ilike.%untitled%,title.ilike.%lorem%");
  console.log("Junk count:", (junk || []).length);
  (junk || []).forEach((a: any) =>
    console.log(`  [${a.status}] ${a.title} → ${a.id}`),
  );

  console.log("\n=== EMPTY BODY ===");
  const { data: nullBody, count: nc } = await supabase
    .from("articles")
    .select("id, title", { count: "exact" })
    .is("body_markdown", null);
  console.log("Null body:", nc);

  const { data: emptyBody, count: ec } = await supabase
    .from("articles")
    .select("id, title", { count: "exact" })
    .eq("body_markdown", "");
  console.log("Empty body:", ec);
}

audit().catch(console.error);
