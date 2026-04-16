import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Linkedin,
  ShieldCheck,
  CheckCircle2,
  Newspaper,
  Award,
  BookOpen,
  Users,
} from "lucide-react";
import { TEAM_MEMBERS } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Our Authors & Research Team | InvestingPro India",
  description:
    "Meet the research teams behind InvestingPro. Every article is fact-checked against official sources — RBI, SEBI, Income Tax Act, and product issuer terms.",
  openGraph: {
    title: "Our Authors & Research Team | InvestingPro India",
    description:
      "InvestingPro's editorial teams: Tax Desk, Credit Team, Investment Research, and Lending Desk. Process-driven, source-verified content.",
    url: "https://investingpro.in/authors",
    type: "website",
  },
};

// Build JSON-LD Person schema for each team member
function buildPersonSchemas() {
  return TEAM_MEMBERS.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    description: member.shortBio,
    url: `https://investingpro.in/about/editorial-team/${member.id}`,
    image: `https://investingpro.in${member.image}`,
    worksFor: {
      "@type": "Organization",
      name: "InvestingPro India",
      url: "https://investingpro.in",
    },
    knowsAbout: member.expertise,
    alumniOf: member.education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu,
    })),
    sameAs: [member.social.linkedin, member.social.twitter].filter(Boolean),
  }));
}

export default function AuthorsPage() {
  const personSchemas = buildPersonSchemas();
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "InvestingPro India",
    url: "https://investingpro.in",
    description:
      "India's independent financial comparison and research platform.",
    member: personSchemas.map((p) => ({
      "@type": "Person",
      name: p.name,
      jobTitle: p.jobTitle,
    })),
  };

  return (
    <>
      {/* JSON-LD Person schemas */}
      {personSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/10 pointer-events-none" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge
                variant="outline"
                className="mb-4 bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/50 dark:text-primary-400"
              >
                InvestingPro Research Team
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Research-Driven. <br className="hidden sm:block" />
                Source-Verified.
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Every article on InvestingPro is researched from official
                sources, fact-checked against regulatory documents, and written
                with real INR calculations.
                <strong> No sponsored content. No paid rankings.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Signals Bar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="h-7 w-7 text-primary-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Editorial Independence
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No paid rankings. Ever.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="h-7 w-7 text-primary-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  5-Step Review Process
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Every article fact-checked.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Award className="h-7 w-7 text-primary-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Certified Experts
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  CAs, CFAs, ex-bankers.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Newspaper className="h-7 w-7 text-primary-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  160+ Years Experience
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Combined team expertise.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* InvestingPro Research Team — Primary Author Card */}
        <div className="container mx-auto px-4 py-12">
          <Card className="border-2 border-primary-100 dark:border-primary-900/50 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-950/30 dark:to-primary-900/20 px-8 py-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <Badge className="bg-primary-600 hover:bg-primary-700 mb-2">
                    Primary Author
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    InvestingPro Research Team
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                    Our research team is the collective byline for data-driven
                    comparisons, product reviews, and financial guides published
                    on InvestingPro. Every piece published under this byline is
                    fact-checked against official sources, and reviewed for
                    accuracy before publishing. Our specialist desks cover tax
                    planning, credit analysis, investment research, and lending
                    comparison.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Articles Published", count: "51+" },
                  { label: "Calculators Built", count: "75" },
                  { label: "Products Compared", count: "2,500+" },
                  { label: "Glossary Terms", count: "101" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-3 bg-white/60 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="text-2xl font-bold text-primary-600">
                      {stat.count}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Individual Team Members */}
        <div className="container mx-auto px-4 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Meet the Individual Experts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Each expert brings deep domain knowledge in their area of
              specialization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <Link
                href={`/about/editorial-team/${member.id}`}
                key={member.id}
                className="block group"
              >
                <Card className="h-full overflow-hidden hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-56 w-full bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-1">
                      <Badge
                        variant="outline"
                        className="text-primary-600 border-primary-200 dark:text-primary-400 dark:border-primary-800 text-xs"
                      >
                        {member.role}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary-600 transition-colors">
                      {member.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {member.shortBio}
                    </p>
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {member.expertise.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-[10px] bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        {member.social.linkedin && (
                          <Linkedin className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <span className="text-primary-600 text-xs font-semibold">
                        View Profile
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Our Standards */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Our Editorial Standards
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Every article goes through a rigorous 5-step process before
                publication.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link
                href="/about/editorial-standards"
                className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
              >
                <BookOpen className="w-8 h-8 text-primary-600 mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                  Editorial Methodology
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our 5-step review process and fact-checking standards.
                </p>
              </Link>
              <Link
                href="/about-our-data"
                className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
              >
                <ShieldCheck className="w-8 h-8 text-primary-600 mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                  About Our Data
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data sources, freshness commitments, and scoring methodology.
                </p>
              </Link>
              <Link
                href="/corrections"
                className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
              >
                <CheckCircle2 className="w-8 h-8 text-primary-600 mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                  Corrections Policy
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How we handle errors, corrections, and transparency.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="container mx-auto px-4 py-8">
          <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Important:</strong> InvestingPro.in is not registered with
              SEBI as an investment advisor. All information on this platform is
              for educational and informational purposes only. Users should
              consult with qualified financial advisors before making financial
              decisions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
