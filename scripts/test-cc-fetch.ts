import { createClient } from "@supabase/supabase-js";

// Test with service role (bypasses RLS)
const service = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Test with anon key (subject to RLS)
const anon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

async function test() {
  console.log("=== SERVICE ROLE (bypasses RLS) ===");
  const { data: d1, error: e1 } = await service
    .from("credit_cards")
    .select("id, name")
    .limit(3);
  console.log("Error:", e1?.message || "none");
  console.log("Count:", d1?.length);
  if (d1) d1.forEach((c: any) => console.log("  ", c.name));

  console.log("\n=== ANON KEY (subject to RLS) ===");
  const { data: d2, error: e2 } = await anon
    .from("credit_cards")
    .select("id, name")
    .limit(3);
  console.log("Error:", e2?.message || "none");
  console.log("Count:", d2?.length);
  if (d2) d2.forEach((c: any) => console.log("  ", c.name));

  console.log("\n=== STATIC CLIENT (what the page uses) ===");
  // Check what createClient from static returns
  const { createClient: createStatic } = await import("../lib/supabase/static");
  const staticClient = createStatic();
  const { data: d3, error: e3 } = await staticClient
    .from("credit_cards")
    .select("id, name")
    .limit(3);
  console.log("Error:", e3?.message || "none");
  console.log("Count:", d3?.length);
  if (d3) d3.forEach((c: any) => console.log("  ", c.name));
}
test();
