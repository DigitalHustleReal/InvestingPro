/**
 * Schema.org JSON-LD helpers for editorial desks.
 *
 * Emits Organization schema (not Person — desks are named teams, not
 * individuals) so Google understands which unit reviewed a piece of
 * content. Rich-result eligible via E-E-A-T signals + visible byline.
 *
 * Use on glossary terms, category hubs, and any landing page where a
 * specific desk is responsible for the editorial quality.
 */

import type { TeamMember } from "@/lib/data/team";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in";

/**
 * Emit an Organization schema fragment for a desk — used as `reviewedBy`
 * or `author` in parent content schemas, or standalone on hub pages.
 *
 * Returns a plain object; caller stringifies + wraps in <script>.
 */
export function deskOrganizationSchema(
  desk: TeamMember,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/about/editorial-team#${desk.slug}`,
    name: desk.name,
    url: `${BASE_URL}/about/editorial-team`,
    description: desk.shortBio,
    parentOrganization: {
      "@type": "Organization",
      name: "InvestingPro",
      url: BASE_URL,
    },
    knowsAbout: desk.expertise,
    memberOf: {
      "@type": "Organization",
      name: "InvestingPro Editorial",
      url: `${BASE_URL}/about/editorial-team`,
    },
    ...(desk.social?.email && {
      contactPoint: {
        "@type": "ContactPoint",
        email: desk.social.email,
        contactType: "editorial",
      },
    }),
  };
}
