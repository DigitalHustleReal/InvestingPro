import React from "react";
import { Metadata } from "next";
import { productService } from "@/lib/products/product-service";
import SEOHead from "@/components/common/SEOHead";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Link as LinkIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} Review 2026`,
    description: product.description,
  };
}

export default async function ProductReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-400">Product Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={`${product.name} Review`}
        description={product.description}
      />

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="shrink-0 w-48 h-32 bg-gray-50 rounded-lg p-4 flex items-center justify-center border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge>{product.category.replace("_", " ")}</Badge>
                <Badge variant="secondary">{product.provider_name}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name} Review
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {product.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  {product.rating.overall}/5
                </div>
                <Link href={product.affiliate_link || "#"}>
                  <Button className="gap-2 bg-primary-600 hover:bg-primary-700">
                    Visit Site <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-primary-700 flex items-center gap-2">
                  <Check className="w-5 h-5 bg-primary-100 rounded-full p-1" />{" "}
                  Pros
                </h3>
                <ul className="space-y-3">
                  {(product.pros || []).map((pro) => (
                    <li key={pro} className="text-gray-700 text-sm flex gap-2">
                      <span className="text-primary-500">•</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-danger-700 flex items-center gap-2">
                  <X className="w-5 h-5 bg-danger-100 rounded-full p-1" /> Cons
                </h3>
                <ul className="space-y-3">
                  {(product.cons || []).map((con) => (
                    <li key={con} className="text-gray-700 text-sm flex gap-2">
                      <span className="text-danger-500">•</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Features Table */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(product.features || {}).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-2">
                    <p className="text-sm text-gray-500 capitalize mb-1">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-600 to-secondary-700 rounded-xl p-6 text-white text-center">
              <h3 className="font-bold text-xl mb-2">Ready to Apply?</h3>
              <p className="text-primary-100 mb-6 text-sm">
                Get exclusive benefits when you apply through InvestingPro.
              </p>
              <Link href={product.affiliate_link || "#"}>
                <Button
                  size="lg"
                  className="w-full bg-white text-primary-700 hover:bg-primary-50"
                >
                  Apply Now
                </Button>
              </Link>
              <p className="text-[10px] text-white/70 mt-2">
                Secure application · No impact on CIBIL score
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
