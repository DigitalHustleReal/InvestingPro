import { createClient } from "@supabase/supabase-js";
const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
async function check() {
  const { data: cats } = await s.from("products").select("category").limit(100);
  const unique = [...new Set((cats || []).map((c: any) => c.category))];
  console.log("Categories:", unique);
  console.log("Total products per category:");
  for (const cat of unique) {
    const { count } = await s
      .from("products")
      .select("id", { count: "exact" })
      .eq("category", cat);
    console.log(`  ${cat}: ${count}`);
  }
  // Check credit_cards table
  const { count: ccCount } = await s
    .from("credit_cards")
    .select("id", { count: "exact" });
  console.log("\ncredit_cards table:", ccCount);
  if (ccCount && ccCount > 0) {
    const { data: cc } = await s
      .from("credit_cards")
      .select("slug, name")
      .limit(5);
    console.log("First 5:", JSON.stringify(cc));
  }
}
check();
