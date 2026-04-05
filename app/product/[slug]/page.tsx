import React from "react";
import { notFound } from "next/navigation";
import { productService } from "@/lib/products/product-service";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ShieldCheck,
  Check,
  Info,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ISR: revalidate every hour
export const revalidate = 3600;

async function getProduct(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle(); // Use maybeSingle() to handle 0 rows gracefully
  if (!data) return null;
  return productService.normalizeProduct(data);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16 transition-colors">
      {/* Header / Hero */}
      <div className="container mx-auto px-4 mb-10">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col md:flex-row gap-8 items-start">
          {/* Image */}
          <div className="w-full md:w-64 aspect-square bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center p-6 border border-gray-100 dark:border-gray-800">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="max-w-full max-h-full object-contain drop-shadow-lg"
              />
            ) : (
              <span className="text-4xl font-bold text-gray-200">
                {product.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Main Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="text-primary-600 border-primary-200 bg-primary-50 dark:bg-primary-500/10"
              >
                {product.provider_name}
              </Badge>
              {product.is_verified && (
                <Badge className="bg-secondary-600 text-white gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Asset
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  {product.rating.overall}
                </span>
                <span>/ 5.0</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div
                className={`font-bold ${
                  product.rating.trust_score > 80
                    ? "text-primary-500"
                    : "text-amber-500"
                }`}
              >
                {product.rating.trust_score}% Trust Score
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
              {product.description ||
                "No description provided for this financial product."}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 h-12 rounded-xl text-lg shadow-lg shadow-primary-500/20"
                asChild
              >
                <a
                  href={product.affiliate_link || product.official_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 h-12 rounded-xl text-lg"
              >
                Comparison
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Validated Data (Pros/Cons/Features) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Features */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary-500" />
                Key Specs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
                {product.key_features.map((feat, i) => (
                  <div
                    key={i}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">
                      {feat.label}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feat.value}
                    </p>
                  </div>
                ))}
                {product.key_features.length === 0 && (
                  <div className="p-8 text-gray-400 italic">
                    No specific specs listed.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-primary-100 bg-primary-50/30 dark:bg-primary-900/10 dark:border-primary-500/20">
              <CardHeader>
                <CardTitle className="text-primary-700 dark:text-primary-400">
                  Pros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.pros.length > 0 ? (
                    product.pros.map((pro, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <Check className="w-5 h-5 text-primary-500 shrink-0" />
                        {pro}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">
                      No specific pros listed.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-danger-100 bg-danger-50/30 dark:bg-danger-900/10 dark:border-danger-500/20">
              <CardHeader>
                <CardTitle className="text-danger-700 dark:text-danger-400">
                  Cons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.cons.length > 0 ? (
                    product.cons.map((con, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <Info className="w-5 h-5 text-danger-500 shrink-0" />
                        {con}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">
                      No specific cons listed.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: Author Box & Disclaimer */}
        <div className="space-y-6">
          <Card className="bg-gray-900 text-white rounded-3xl border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-700" />
            <CardContent className="p-8">
              <h3 className="font-bold text-lg mb-4">
                Why trust InvestingPro?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                We analyze financial products with a standardized 45-point
                checklist verifying fees, rewards, and hidden terms. Our ratings
                are never influenced by commissions.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-bold">
                  IP
                </div>
                <div>
                  <p className="font-bold text-sm">Editorial Team</p>
                  <p className="text-xs text-gray-400">Verified Analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
