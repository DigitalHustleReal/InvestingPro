"use client";

import React from "react";
import SEOHead from "@/components/common/SEOHead";
import { GSTCalculator } from "@/components/calculators/GSTCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Calculator, Percent, Receipt, CheckCircle2 } from "lucide-react";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import { generateSchema } from "@/lib/linking/schema";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import { generateBreadcrumbSchema } from "@/lib/linking/breadcrumbs";
import Link from "next/link";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import SocialShareButtons from "@/components/common/SocialShareButtons";

export default function GSTCalculatorPage() {
  // Generate automated schema
  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Calculators", url: "/calculators" },
    { label: "GST Calculator", url: "/calculators/gst" },
  ];

  const calculatorSchema: any = generateSchema({
    pageType: "calculator",
    title: "GST Calculator India - Calculate GST Online",
    description:
      "Free GST calculator to calculate GST for goods and services in India. Calculate CGST, SGST, IGST with GST exclusive and inclusive options.",
    url: "/calculators/gst",
    breadcrumbs,
    category: "small-business",
  });

  const structuredData = [
    calculatorSchema,
    generateBreadcrumbSchema(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: "GST Calculator",
      description:
        "Free GST calculator to calculate GST for goods and services in India. Calculate CGST, SGST, IGST with GST exclusive and inclusive options.",
      provider: {
        "@type": "Organization",
        name: "InvestingPro",
        url: "https://investingpro.in",
      },
      serviceType: "FinancialCalculator",
      areaServed: { "@type": "Country", name: "India" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How to calculate GST in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GST is calculated by multiplying the base amount by the GST rate. For example, if the base amount is ₹10,000 and GST rate is 18%, GST = ₹10,000 × 18% = ₹1,800. Total amount = ₹11,800. GST is split into CGST (9%) and SGST (9%) for intra-state transactions, or IGST (18%) for inter-state transactions.",
          },
        },
        {
          "@type": "Question",
          name: "What are the GST rates in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GST rates in India are: 0% (exempt), 5%, 12%, 18% (standard rate), and 28% (luxury items). Most goods and services fall under 18% GST rate. Essential items like food grains are at 0% or 5%, while luxury items attract 28% GST.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between CGST, SGST, and IGST?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CGST (Central GST) and SGST (State GST) apply to intra-state transactions (within same state). Each is half of the GST rate. IGST (Integrated GST) applies to inter-state transactions (between different states) and equals the full GST rate. For example, 18% GST = 9% CGST + 9% SGST (intra-state) or 18% IGST (inter-state).",
          },
        },
        {
          "@type": "Question",
          name: "How to calculate GST inclusive amount?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "To calculate base amount from GST inclusive price: Base Amount = (Total Amount × 100) / (100 + GST Rate). For example, if total is ₹11,800 with 18% GST: Base = (11,800 × 100) / 118 = ₹10,000. GST Amount = ₹11,800 - ₹10,000 = ₹1,800.",
          },
        },
        {
          "@type": "Question",
          name: "Is GST calculator free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, our GST calculator is completely free to use. No registration required, no hidden charges. You can calculate GST for any amount and any GST rate instantly. The calculator supports both GST exclusive and GST inclusive calculations.",
          },
        },
      ],
    },
  ];

  // Generate canonical URL
  const canonicalUrl = generateCanonicalUrl("/calculators/gst");

  // Generate automated internal links
  const linkingContext = {
    contentType: "calculator" as const,
    category: "small-business",
    slug: "gst",
    relatedCalculators: ["tax", "emi"],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="GST Calculator India 2026 - Calculate GST Online (CGST, SGST, IGST) | InvestingPro"
        description="Free GST calculator to calculate GST for goods and services in India. Calculate CGST, SGST, IGST with GST exclusive and inclusive options. Supports all GST rates (0%, 5%, 12%, 18%, 28%)."
        structuredData={structuredData}
        url={canonicalUrl}
      />

      {/* Automated Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
        <AutoBreadcrumbs />
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-ink mb-4">
            GST Calculator - Calculate GST Online
          </h1>
          <p className="text-xl text-ink-60 max-w-3xl mx-auto leading-relaxed mb-4">
            Calculate GST for goods and services in India. Supports GST
            exclusive and inclusive calculations with CGST, SGST, and IGST
            breakdown.
          </p>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <GSTCalculator />
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        {/* Introduction */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white">
          <CardContent className="p-8 lg:p-6 md:p-8">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-ink mb-6">
              GST Calculator India - Calculate Goods and Services Tax
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-ink-60 leading-relaxed mb-6">
                GST (Goods and Services Tax) is a comprehensive indirect tax
                levied on the supply of goods and services in India. Our free
                GST calculator helps you calculate GST for any amount, whether
                you need to add GST to a base amount (GST exclusive) or extract
                GST from a total amount (GST inclusive).
              </p>
              <p className="text-lg text-ink-60 leading-relaxed mb-6">
                The calculator automatically breaks down GST into CGST (Central
                GST) and SGST (State GST) for intra-state transactions, or IGST
                (Integrated GST) for inter-state transactions. This helps
                businesses, freelancers, and individuals accurately calculate
                GST for invoicing, tax filing, and financial planning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[
                  "Calculate GST for any amount",
                  "Support for all GST rates (0%, 5%, 12%, 18%, 28%)",
                  "GST exclusive and inclusive calculations",
                  "CGST, SGST, and IGST breakdown",
                  "Instant results with visual charts",
                  "Free to use, no registration required",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 font-medium">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GST Rates Information */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold text-ink flex items-center gap-6 md:p-8">
              <Percent className="w-6 h-6 text-primary-600" />
              GST Rates in India
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  rate: "0%",
                  items:
                    "Essential items like food grains, fresh vegetables, milk, etc.",
                },
                {
                  rate: "5%",
                  items:
                    "Essential goods like packaged food, medicines, transport services",
                },
                {
                  rate: "12%",
                  items:
                    "Processed foods, computers, mobile phones, restaurant services",
                },
                {
                  rate: "18%",
                  items:
                    "Most goods and services (standard rate) - electronics, services, etc.",
                },
                {
                  rate: "28%",
                  items:
                    "Luxury items like cars, aerated drinks, tobacco products",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-primary-100 text-primary-700 border-0 font-bold">
                      {item.rate}
                    </Badge>
                    <span className="text-sm font-display font-semibold text-ink">
                      GST Rate
                    </span>
                  </div>
                  <p className="text-sm text-ink-60">{item.items}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold text-ink flex items-center gap-6 md:p-8">
              <Info className="w-6 h-6 text-primary-600" />
              GST Calculator - Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                {
                  q: "How to calculate GST in India?",
                  a: "GST is calculated by multiplying the base amount by the GST rate. For example, if the base amount is ₹10,000 and GST rate is 18%, GST = ₹10,000 × 18% = ₹1,800. Total amount = ₹11,800. GST is split into CGST (9%) and SGST (9%) for intra-state transactions, or IGST (18%) for inter-state transactions.",
                },
                {
                  q: "What are the GST rates in India?",
                  a: "GST rates in India are: 0% (exempt), 5%, 12%, 18% (standard rate), and 28% (luxury items). Most goods and services fall under 18% GST rate. Essential items like food grains are at 0% or 5%, while luxury items attract 28% GST.",
                },
                {
                  q: "What is the difference between CGST, SGST, and IGST?",
                  a: "CGST (Central GST) and SGST (State GST) apply to intra-state transactions (within same state). Each is half of the GST rate. IGST (Integrated GST) applies to inter-state transactions (between different states) and equals the full GST rate. For example, 18% GST = 9% CGST + 9% SGST (intra-state) or 18% IGST (inter-state).",
                },
                {
                  q: "How to calculate GST inclusive amount?",
                  a: "To calculate base amount from GST inclusive price: Base Amount = (Total Amount × 100) / (100 + GST Rate). For example, if total is ₹11,800 with 18% GST: Base = (11,800 × 100) / 118 = ₹10,000. GST Amount = ₹11,800 - ₹10,000 = ₹1,800.",
                },
                {
                  q: "Is GST calculator free to use?",
                  a: "Yes, our GST calculator is completely free to use. No registration required, no hidden charges. You can calculate GST for any amount and any GST rate instantly. The calculator supports both GST exclusive and GST inclusive calculations.",
                },
                {
                  q: "When to use CGST/SGST vs IGST?",
                  a: "Use CGST and SGST when the supplier and recipient are in the same state (intra-state transaction). Each is half of the GST rate. Use IGST when the supplier and recipient are in different states (inter-state transaction). IGST equals the full GST rate and is collected by the central government.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-200 pb-6 last:border-0"
                >
                  <h3 className="font-display font-bold text-ink mb-2 text-lg">
                    {faq.q}
                  </h3>
                  <p className="text-ink-60 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Calculators */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold text-ink">
              Related Business Calculators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Tax Calculator",
                  href: "/calculators/tax",
                  desc: "Calculate income tax",
                },
                {
                  name: "EMI Calculator",
                  href: "/calculators/emi",
                  desc: "Calculate loan EMIs",
                },
                {
                  name: "Business Loans",
                  href: "/loans?type=business",
                  desc: "Compare business loans",
                },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
                    <span className="font-display font-semibold text-ink group-hover:text-primary-600">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-sm text-ink-60">{item.desc}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automated Internal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AutoInternalLinks context={linkingContext} />
      </div>

      {/* Share & Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SocialShareButtons
          title="GST Calculator India - Calculate GST Inclusive/Exclusive | InvestingPro"
          url="https://investingpro.in/calculators/gst"
          description="Free gst calculator india - calculate gst inclusive/exclusive - use this free tool from InvestingPro"
        />
        <FinancialDisclaimer variant="compact" className="mt-4" />
      </div>
    </div>
  );
}
