import { Metadata } from "next";
import { PolicyPageShell } from "@/components/layout/PolicyPageShell";

export const metadata: Metadata = {
  title: "Accessibility Statement | InvestingPro",
  description:
    "InvestingPro's accessibility commitment, WCAG 2.1 AA conformance, supported features, known limitations, and feedback channel.",
  alternates: { canonical: "https://investingpro.in/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <PolicyPageShell
      title="Accessibility statement"
      highlight="statement"
      lead="InvestingPro is committed to digital accessibility for people with disabilities. WCAG 2.1 Level AA partial conformance, with concrete features documented and known limitations disclosed."
      lastUpdated="2026-01-10"
      breadcrumbLabel="Accessibility"
    >
      <p className="lead">
        InvestingPro is committed to ensuring digital accessibility for people
        with disabilities. We are continually improving the user experience for
        everyone and applying the relevant accessibility standards.
      </p>

      <h2>Conformance status</h2>
      <p>
        The Web Content Accessibility Guidelines (WCAG) defines requirements for
        designers and developers to improve accessibility for people with
        disabilities. WCAG 2.1 defines three levels of conformance: Level A,
        Level AA, and Level AAA. InvestingPro is{" "}
        <strong>partially conformant with WCAG 2.1 Level AA</strong>.
      </p>

      <h2>Accessibility features</h2>
      <ul>
        <li>Keyboard navigation support throughout the site</li>
        <li>Screen reader compatibility (tested with NVDA + VoiceOver)</li>
        <li>High contrast and dark mode options</li>
        <li>Resizable text without loss of functionality</li>
        <li>Clear focus indicators for interactive elements</li>
        <li>Descriptive link text and alt text for images</li>
        <li>Semantic HTML markup for proper document structure</li>
        <li>ARIA landmarks for major sections</li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        Despite our best efforts to ensure accessibility, there may be some
        limitations. We are actively working to address these:
      </p>
      <ul>
        <li>
          Some third-party affiliate-network content may not be fully accessible
        </li>
        <li>
          Complex chart visualisations require alternative text descriptions (in
          progress)
        </li>
        <li>Some legacy PDF policy documents may not be fully accessible</li>
      </ul>

      <h2>Feedback</h2>
      <p>
        We welcome your feedback on the accessibility of InvestingPro. Please
        let us know if you encounter accessibility barriers:
      </p>
      <ul>
        <li>
          Email:{" "}
          <a href="mailto:accessibility@investingpro.in">
            accessibility@investingpro.in
          </a>
        </li>
        <li>We try to respond to feedback within 2 business days</li>
      </ul>

      <h2>Technical specifications</h2>
      <p>
        Accessibility of InvestingPro relies on the following technologies to
        work with the particular combination of web browser and any assistive
        technologies or plugins installed on your computer:
      </p>
      <ul>
        <li>HTML5 / Semantic markup</li>
        <li>WAI-ARIA</li>
        <li>CSS3</li>
        <li>JavaScript (React + Next.js)</li>
      </ul>
    </PolicyPageShell>
  );
}
