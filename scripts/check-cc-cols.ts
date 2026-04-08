import { createClient } from "@supabase/supabase-js";
const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
async function check() {
  const { data, error } = await s.from("credit_cards").select("*").limit(1);
  if (error) {
    console.log("Error:", error.message);
    return;
  }
  if (data && data[0]) {
    console.log("Columns:", Object.keys(data[0]).join(", "));
    console.log("Sample:", JSON.stringify(data[0], null, 2));
  }
}
check();
