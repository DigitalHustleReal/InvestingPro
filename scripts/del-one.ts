import { createClient } from "@supabase/supabase-js";
const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
s.from("articles")
  .delete()
  .eq("slug", "best-rewards-credit-cards-in-india-2026")
  .then((r) => console.log("Deleted test article"));
