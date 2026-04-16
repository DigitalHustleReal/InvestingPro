"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Loan comparison CTA widget — replaces fake eligibility checker
 * Directs users to real EMI calculator and loan comparison page
 */
export default function InlineEligibilityWidget() {
  return (
    <Card className="w-full max-w-sm bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200">
      <div className="bg-primary h-1.5 rounded-t-2xl" />
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Calculate Your EMI
            </h3>
            <p className="text-xs text-gray-500">
              Free calculator — no signup needed
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Use our EMI calculator to find out how much house you can afford based
          on your income. Then compare rates from 25+ lenders.
        </p>

        <div className="space-y-2">
          <Link href="/calculators/home-loan-emi" className="block">
            <Button className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm">
              EMI Calculator
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/loans" className="block">
            <Button
              variant="outline"
              className="w-full h-10 rounded-xl text-sm font-medium"
            >
              Compare Loan Rates
            </Button>
          </Link>
        </div>

        <p className="text-[10px] text-gray-400 mt-3 text-center">
          InvestingPro does not process loan applications. You apply directly on
          the lender&apos;s website.
        </p>
      </CardContent>
    </Card>
  );
}
