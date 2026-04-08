import { createClient } from "@supabase/supabase-js";
const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
async function del() {
  const { count } = await s
    .from("articles")
    .delete({ count: "exact" })
    .neq("id", "00000000-0000-0000-0000-000000000000");
  console.log("Deleted:", count);
  const { count: remaining } = await s
    .from("articles")
    .select("id", { count: "exact" });
  console.log("Remaining:", remaining);
}
del();
