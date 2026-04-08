import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function deleteAll() {
  console.log("=== DELETING ALL ARTICLES ===\n");

  const { error, count } = await supabase
    .from("articles")
    .delete({ count: "exact" })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log("Deleted:", count, "articles");

  const { count: remaining } = await supabase
    .from("articles")
    .select("id", { count: "exact" });
  console.log("Remaining:", remaining);
  console.log("\nClean slate. Ready for fresh content generation.");
}

deleteAll().catch(console.error);
