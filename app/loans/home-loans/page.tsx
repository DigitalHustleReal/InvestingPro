"use client";

import React from 'react';
import EditorialPageTemplate from "@/components/common/EditorialPageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function HomeLoansPage() {
    return (
        <EditorialPageTemplate
            title="Home Loans in India"
            description="Understand how home loans work in India, typical costs, eligibility criteria, and key considerations when choosing a home loan lender."
            pageType="subcategory"
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Loans", href: "/loans" }
            ]}
            relatedLinks={[
                {
                    label: "Home Loan EMI Calculator",
                    href: "/calculators/emi",
                    description: "Calculate your home loan EMI and total interest"
                },
                {
                    label: "Home Loan Interest Rates Comparison",
                    href: "/loans/home-loans/interest-rates",
                    description: "Compare interest rates from top lenders"
                },
                {
                    label: "Home Loan Tax Benefits Guide",
                    href: "/guides/home-loan-tax-benefits",
                    description: "Understand Section 24 and Section 80EEA tax deductions"
                }
            ]}
            glossaryTerms={["EMI", "Interest Rate", "Principal Amount", "Loan Tenure", "Processing Fee", "Prepayment"]}
            lastReviewed={new Date()}
            structuredData={{
                "@context": "https://schema.org",
                "@type": "FinancialProduct",
                "name": "Home Loan",
                "description": "A secured loan used to purchase residential property in India",
                "provider": {
                    "@type": "FinancialService",
                    "name": "Various Banks and NBFCs"
                }
            }}
        >
            {/* Main Content */}
            <article className="prose prose-slate max-w-none">
                {/* Definition Section */}
                <section className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Home Loans in India</h1>
                    <p className="text-lg text-slate-700 leading-relaxed mb-6">
                        A home loan, also known as a housing loan or home mortgage, is a secured loan provided by banks 
                        and non-banking financial companies (NBFCs) in India to help individuals purchase residential 
                        property. The property serves as collateral for the loan, and borrowers repay the amount through 
                        Equated Monthly Installments (EMI) over a specified tenure, typically ranging from 5 to 30 years.
                    </p>
                </section>

                {/* How It Works Section */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">How Home Loans Work in India</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Home loans in India operate under guidelines set by the Reserve Bank of India (RBI). The loan 
                        amount typically covers up to 80-90% of the property value, depending on the property cost and 
                        borrower profile. The remaining amount must be paid as a down payment from the borrower's own funds.
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        The interest rate on home loans can be fixed, floating, or a hybrid of both. Fixed rates remain 
                        constant throughout the loan tenure, while floating rates fluctuate based on the lender's base rate 
                        or repo-linked lending rate (RLLR). Most Indian lenders offer floating rate home loans linked to 
                        their Marginal Cost of Funds Based Lending Rate (MCLR) or RLLR.
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        The loan repayment happens through EMIs, which include both principal and interest components. 
                        In the initial years, a larger portion of the EMI goes toward interest payment, while the principal 
                        component increases over time. This is known as the amortization schedule.
                    </p>
                </section>

                {/* Key Factors to Consider */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Factors to Consider</h2>
                    
                    <div className="space-y-4 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Interest Rate</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Compare interest rates across lenders, but also consider the type of rate (fixed vs floating), 
                                the lender's MCLR or RLLR, and how frequently rates reset. Even a 0.25% difference can 
                                significantly impact the total interest paid over the loan tenure.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Loan Amount and Tenure</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Determine the loan amount based on your repayment capacity, not just the maximum amount 
                                offered. Longer tenures reduce EMI but increase total interest, while shorter tenures have 
                                higher EMIs but lower total interest cost.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Processing Fees and Charges</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Evaluate processing fees, administrative charges, prepayment penalties, and other hidden costs. 
                                Some lenders waive processing fees during promotional offers, while others charge 0.5% to 1% 
                                of the loan amount.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Prepayment and Foreclosure</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Check the lender's policy on prepayment and foreclosure. Most floating rate home loans in 
                                India allow prepayment without charges, but fixed rate loans may have prepayment penalties. 
                                Partial prepayments can reduce your loan tenure or EMI burden.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Typical Costs, Risks, and Limitations */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Typical Costs, Risks, and Limitations</h2>
                    
                    <Card className="border-slate-200 mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-slate-900">Costs Involved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-slate-400 mt-1">•</span>
                                    <span><strong>Processing Fee:</strong> Typically 0.5% to 1% of the loan amount, plus applicable GST</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-slate-400 mt-1">•</span>
                                    <span><strong>Legal and Technical Fees:</strong> For property valuation and legal verification</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-slate-400 mt-1">•</span>
                                    <span><strong>Stamp Duty and Registration:</strong> State-specific charges for property registration</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-slate-400 mt-1">•</span>
                                    <span><strong>Insurance:</strong> Home loan insurance may be required by some lenders</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-200 bg-amber-50 mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-6 md:p-8">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                                Risks and Limitations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span><strong>Interest Rate Risk:</strong> Floating rates can increase over time, raising your EMI or extending the loan tenure</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span><strong>Property Value Risk:</strong> Property prices may decline, affecting your loan-to-value ratio</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span><strong>Repayment Risk:</strong> Inability to pay EMIs can lead to property foreclosure</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span><strong>Eligibility Constraints:</strong> Age, income, credit score, and existing liabilities affect loan approval</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span><strong>Long Commitment:</strong> Home loans typically span 15-30 years, requiring consistent income</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                {/* Comparison Context */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">When Home Loans Make Sense vs Alternatives</h2>
                    
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Home loans are appropriate when you have stable income, good credit history, and require financing 
                        to purchase a property. They are generally more cost-effective than other forms of borrowing due to 
                        lower interest rates and tax benefits.
                    </p>
                    
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Consider alternatives such as:
                    </p>
                    
                    <ul className="space-y-2 text-slate-700 mb-4">
                        <li className="flex items-start gap-2">
                            <span className="text-slate-400 mt-1">•</span>
                            <span><strong>Personal Loans:</strong> For smaller amounts or when you don't have property to offer as collateral, though interest rates are typically higher</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-slate-400 mt-1">•</span>
                            <span><strong>Loan Against Property:</strong> When you already own property and need funds, using existing property as collateral</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-slate-400 mt-1">•</span>
                            <span><strong>Self-Funding:</strong> If you have sufficient savings and the opportunity cost of using those funds is lower than loan interest</span>
                        </li>
                    </ul>
                </section>

                {/* Related Tools */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Calculators and Tools</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Use our <Link href="/calculators/emi" className="text-teal-600 hover:text-teal-700 underline">EMI Calculator</Link> to 
                        estimate your monthly home loan installment based on loan amount, interest rate, and tenure. This helps 
                        determine your repayment capacity before applying for a loan.
                    </p>
                </section>

                {/* Who It's For / Not For */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Home Loans Are For</h2>
                    <ul className="space-y-2 text-slate-700 mb-6">
                        <li className="flex items-start gap-2">
                            <span className="text-primary-600 mt-1">✓</span>
                            <span>Individuals with stable income and employment</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary-600 mt-1">✓</span>
                            <span>First-time homebuyers and property investors</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary-600 mt-1">✓</span>
                            <span>Those with good credit scores (typically 750+)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary-600 mt-1">✓</span>
                            <span>Individuals seeking long-term wealth building through property ownership</span>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Home Loans Are NOT For</h2>
                    <ul className="space-y-2 text-slate-700">
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">✗</span>
                            <span>Individuals with irregular income or unstable employment</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">✗</span>
                            <span>Those with poor credit history or existing high debt</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">✗</span>
                            <span>Borrowers who cannot afford the down payment and associated costs</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">✗</span>
                            <span>Individuals near retirement age (typically above 60-65 years) may face restrictions</span>
                        </li>
                    </ul>
                </section>

                {/* FAQ Section */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">What is the maximum loan amount I can get for a home loan?</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Most lenders in India offer up to 80-90% of the property value as a loan. The exact amount 
                                depends on factors such as property location, your income, credit score, and existing liabilities. 
                                For properties above a certain value (typically ₹75 lakhs), the loan-to-value ratio may be lower.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">What documents are required for a home loan application?</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Common documents include identity proof (Aadhaar, PAN), address proof, income proof (salary slips, 
                                IT returns), bank statements (6-12 months), property documents, and photographs. Self-employed 
                                applicants may need additional business documents.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I get tax benefits on home loan interest?</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Yes, under Section 24(b) of the Income Tax Act, you can claim a deduction of up to ₹2 lakhs 
                                per year on home loan interest for self-occupied property. Additional deductions are available 
                                under Section 80EEA for first-time homebuyers. Principal repayment qualifies for deduction 
                                under Section 80C up to ₹1.5 lakhs per year.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">What happens if I default on home loan payments?</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Defaulting on home loan EMIs can lead to penalties, increased interest rates, legal action, 
                                and eventually property foreclosure. Lenders typically provide a grace period, but consistent 
                                defaults can severely impact your credit score and financial stability. It's important to 
                                communicate with your lender if you face repayment difficulties.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Should I choose a fixed or floating interest rate?</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Fixed rates provide certainty but are typically 0.5-1% higher than floating rates. Floating 
                                rates can change but generally offer lower initial rates and allow prepayment flexibility. 
                                The choice depends on your risk tolerance, interest rate outlook, and financial situation. 
                                Most borrowers in India opt for floating rates due to lower costs and flexibility.
                            </p>
                        </div>
                    </div>
                </section>
            </article>
        </EditorialPageTemplate>
    );
}

