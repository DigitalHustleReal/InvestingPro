import { createClient } from "@supabase/supabase-js";
const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
async function find() {
  const { data: sbi } = await s
    .from("credit_cards")
    .select("slug, name")
    .ilike("name", "%sbi cashback%")
    .limit(5);
  console.log("SBI Cashback:", JSON.stringify(sbi));
  const { data: amazon } = await s
    .from("credit_cards")
    .select("slug, name")
    .ilike("name", "%amazon%")
    .limit(5);
  console.log("Amazon:", JSON.stringify(amazon));
  const { data: hdfc } = await s
    .from("credit_cards")
    .select("slug, name")
    .ilike("name", "%millennia%")
    .limit(5);
  console.log("HDFC Millennia:", JSON.stringify(hdfc));
}
find();
