import { createClient } from "@supabase/supabase-js";
const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
async function check() {
  const { data: sbi } = await s
    .from("products")
    .select("slug, name")
    .eq("category", "credit-cards")
    .ilike("name", "%sbi%")
    .limit(5);
  console.log("SBI cards:", JSON.stringify(sbi));
  const { data: amazon } = await s
    .from("products")
    .select("slug, name")
    .eq("category", "credit-cards")
    .ilike("name", "%amazon%")
    .limit(5);
  console.log("Amazon cards:", JSON.stringify(amazon));
  const { data: hdfc } = await s
    .from("products")
    .select("slug, name")
    .eq("category", "credit-cards")
    .ilike("name", "%millennia%")
    .limit(5);
  console.log("HDFC Millennia:", JSON.stringify(hdfc));
  const { data: all } = await s
    .from("products")
    .select("slug")
    .eq("category", "credit-cards")
    .limit(5);
  console.log("First 5 CC slugs:", JSON.stringify(all));
}
check();
