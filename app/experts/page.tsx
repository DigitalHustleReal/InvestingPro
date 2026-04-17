import { Metadata } from "next";
import { createClient } from "@/lib/supabase/static";
import ExpertTeam from "@/components/experts/ExpertTeam";
import SEOHead from "@/components/common/SEOHead";
import CategoryHero from "@/components/common/CategoryHero";
import { logger } from "@/lib/logger";

// ISR: revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Meet Our Expert Team - Financial Analysts & Advisors",
  description:
    "Meet the financial experts behind InvestingPro. Our team of CAs, CFAs, and financial analysts help you make informed financial decisions.",
};

export default async function ExpertsPage() {
  const supabase = createClient();

  const { data: expertsData, error } = await supabase
    .from("authors")
    .select(
      "id, name, slug, role, avatar, bio, credentials, is_expert, expert_order, linkedin_url, twitter_handle, articles_count, years_of_experience",
    )
    .eq("is_expert", true)
    .order("expert_order", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true })
    .limit(50);

  if (error) {
    logger.error(
      "Error fetching experts",
      error instanceof Error ? error : undefined,
      { details: String(error) },
    );
  }

  // Ensure experts is always an array
  const experts = Array.isArray(expertsData) ? expertsData : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title="Meet Our Expert Team - Financial Analysts & Advisors | InvestingPro"
        description="Meet the financial experts behind InvestingPro. Our team of CAs, CFAs, and financial analysts help you make informed financial decisions."
      />

      <CategoryHero
        title="Meet Our Expert Team"
        subtitle="Trusted Financial Advisors"
        description="Our team of certified financial professionals, including CAs, CFAs, and experienced analysts, brings decades of combined expertise to help you make smart financial decisions."
        primaryCta={{
          text: "Explore Articles",
          href: "/articles",
        }}
        secondaryCta={{
          text: "Read Our Methodology",
          href: "/methodology",
        }}
        stats={[
          { label: "Team Members", value: (experts?.length || 0).toString() },
          {
            label: "Combined Experience",
            value: `${experts?.reduce((sum, e) => sum + (e.years_of_experience || 0), 0) || 0}+ Years`,
          },
          {
            label: "Certifications",
            value: `${experts?.reduce((sum, e) => sum + (e.credentials?.length || 0), 0) || 0}+`,
          },
        ]}
        badge="Expert Team"
      />

      <div className="container mx-auto px-4 py-12">
        <ExpertTeam experts={experts || []} />
      </div>
    </div>
  );
}
