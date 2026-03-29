"use client";

import Link from "next/link";
import SEOHead from "@/components/common/SEOHead";
import { CalculatorResultCTA } from '@/components/calculators/CalculatorResultCTA';
import { EMICalculatorEnhanced } from "@/components/calculators/EMICalculatorEnhanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, TrendingUp, Zap, CheckCircle2 } from "lucide-react";
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';

export default function EMICalculatorPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "EMI Calculator",
        "description": "Free EMI calculator for home loans, car loans, personal loans, and education loans. Calculate loan EMI, total interest, and amortization schedule. Compare different loan offers.",
        "provider": {
            "@type": "Organization",
            "name": "InvestingPro",
            "url": "https://investingpro.in"
        },
        "serviceType": "FinancialCalculator",
        "areaServed": { "@type": "Country", "name": "India" },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How to calculate EMI?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "EMI is calculated using the formula: EMI = [P Ã— r Ã— (1+r)^n] / [(1+r)^n - 1], where P is principal loan amount, r is monthly interest rate (annual rate/12), and n is number of monthly installments."
                }
            },
            {
                "@type": "Question",
                "name": "What is EMI calculator?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "EMI calculator helps you calculate Equated Monthly Installment (EMI) for loans. It shows monthly payment amount, total interest payable, and principal vs interest breakdown. Useful for home loans, car loans, personal loans, and education loans."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="EMI Calculator India 2026 - Home Loan, Car Loan EMI Calculator | InvestingPro"
                description="Free EMI calculator for home loans, car loans, personal loans, and education loans. Calculate loan EMI, total interest, principal vs interest breakdown, and amortization schedule. Compare different loan offers."
                structuredData={[structuredData, faqSchema]}
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
                <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/calculators" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Calculators</Link>
                    <span>/</span>
                    <span className="text-slate-900 dark:text-white font-medium">EMI Calculator</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        EMI Calculator - Calculate Loan EMI Online
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Calculate EMI for home loans, car loans, personal loans, and education loans. See principal vs interest breakdown and total interest paid over loan tenure.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <EMICalculatorEnhanced />
                <CalculatorResultCTA calculatorType="emi" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
                {/* Comprehensive Content Section */}
                <div className="space-y-12">
                     {/* What is EMI Section */}
                    <Card className="border-0 shadow-lg rounded-2xl bg-white dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">What is Equated Monthly Installment (EMI)?</CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed">
                                An <strong>Equated Monthly Installment (EMI)</strong> is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. Equated monthly installments are used to pay off both interest and principal each month so that over a specified number of years, the loan is paid off in full.
                            </p>
                            <p className="text-lg leading-relaxed">
                                EMIs allow borrowers to finance large expenses like a house, car, or education without the financial burden of a one-time lump sum payment. The most common loans where EMI is applicable are Home Loans, Car Loans, and Personal Loans.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Key Benefits Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary-700 dark:text-primary-400">
                                    <TrendingUp className="w-5 h-5" />
                                    Financial Planning
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Knowing your exact EMI amount helps you plan your monthly budget effectively. You know exactly how much to set aside for loan repayment.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary-700 dark:text-primary-400">
                                    <Zap className="w-5 h-5" />
                                    Flexibility
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-300">
                                    You can choose a tenure that suits your repayment capacity. Longer tenure means lower EMI but higher total interest; shorter tenure means higher EMI but lower interest.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary-700 dark:text-primary-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Accessibility
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-300">
                                    EMIs make expensive assets like homes and cars accessible to the middle class by breaking down the cost into manageable monthly payments.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-accent-50 to-white dark:from-slate-800 dark:to-slate-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-bold text-accent-700 dark:text-accent-400">
                                    <Info className="w-5 h-5" />
                                    Reducing Balance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Most loans work on a reducing balance method. As you pay EMIs, the principal reduces, and the interest component decreases over time.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                     {/* Formula Section */}
                    <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
                         <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">How is EMI Calculated?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-600 dark:text-slate-300">
                                The mathematical formula for calculating EMI is:
                            </p>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-center text-lg font-bold text-primary-700 dark:text-primary-400 border border-slate-200 dark:border-slate-700">
                                EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                                <div><span className="font-bold text-slate-900 dark:text-white">P</span> = Principal Loan Amount</div>
                                <div><span className="font-bold text-slate-900 dark:text-white">R</span> = Monthly Interest Rate (Annual Rate/12/100)</div>
                                <div><span className="font-bold text-slate-900 dark:text-white">N</span> = Loan Tenure in Months</div>
                            </div>
                            <p className="text-sm text-slate-500 italic mt-4">
                                *Note: This formula assumes interest is compounded monthly, which is the standard for most retail loans in India.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Expanded FAQ Section */}
                <Card className="border-0 shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-6 md:p-8">
                            <Info className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            EMI Calculator - Frequently Asked Questions (FAQs)
                        </CardTitle>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Find answers to the most common questions about EMI calculator and loan repayments</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[
                                {
                                    q: "What is EMI calculator?",
                                    a: "EMI calculator is an online financial tool that helps you calculate Equated Monthly Installment (EMI) for loans like home loans, car loans, personal loans, etc. It calculates monthly loan payment amount based on loan amount, interest rate, and tenure. EMI calculator shows total interest cost, principal vs interest breakdown, and helps you plan loan repayment strategy effectively."
                                },
                                {
                                    q: "How to calculate EMI?",
                                    a: "EMI is calculated using formula: EMI = [P Ã— r Ã— (1+r)^n] / [(1+r)^n - 1], where P is principal (loan amount), r is monthly interest rate (annual rate Ã· 12), and n is loan tenure in months. For example, â‚¹50 lakhs at 8.5% for 20 years: EMI = [50L Ã— 0.7083% Ã— (1.007083)^240] / [(1.007083)^240 - 1] = â‚¹43,391. Our EMI calculator does this automatically and shows detailed breakdown."
                                },
                                {
                                    q: "What factors affect EMI?",
                                    a: "Three main factors affect EMI: 1) Loan amount - higher amount means higher EMI, 2) Interest rate - higher rate means higher EMI (1% increase can increase EMI by 5-7%), 3) Loan tenure - longer tenure means lower EMI but higher total interest. You can reduce EMI by increasing down payment (reduces loan amount), negotiating lower interest rate, or extending tenure (though this increases total interest cost)."
                                },
                                {
                                    q: "How to reduce EMI?",
                                    a: "Ways to reduce EMI: 1) Increase down payment to reduce loan amount - higher down payment means lower principal and lower EMI, 2) Negotiate for lower interest rate - even 0.25-0.5% reduction significantly reduces EMI, 3) Extend loan tenure - longer tenure means lower EMI but increases total interest paid, 4) Make part prepayments - reduces principal and subsequent EMIs. Use our calculator to see impact of different options."
                                },
                                {
                                    q: "EMI calculator for home loan?",
                                    a: "Yes, our EMI calculator works perfectly for home loans. Enter loan amount (after down payment), interest rate (typically 7-9% for home loans in India), and tenure (usually 15-30 years). Calculator shows monthly EMI, total interest over loan period, year-by-year breakdown, and helps you plan home loan repayment. You can also see impact of prepayments on interest savings."
                                },
                                {
                                    q: "What is the maximum EMI I can afford?",
                                    a: "Generally, EMI should not exceed 40-50% of your monthly take-home income. For example, if monthly income is â‚¹1 lakh, EMI should be â‚¹40,000-50,000 maximum. Consider other expenses (living costs, savings, investments, emergency fund) before deciding EMI amount. Banks typically approve loans where EMI is 40-60% of income. Use our calculator to find affordable loan amount based on your income."
                                },
                                {
                                    q: "EMI calculator for car loan?",
                                    a: "Yes, our EMI calculator works for car loans. Enter loan amount (car price minus down payment), interest rate (typically 8-11% for car loans), and tenure (usually 3-7 years). Calculator shows monthly EMI, total interest, and helps you compare different car loan offers. Car loans have shorter tenure than home loans, so EMI is typically higher for same loan amount."
                                },
                                {
                                    q: "How does EMI work?",
                                    a: "EMI (Equated Monthly Installment) is a fixed amount paid monthly to repay loan. Each EMI consists of both principal repayment and interest payment. Initially, interest component is higher (70-80% of EMI), but as loan progresses, principal component increases. For example, â‚¹1L EMI for home loan: Month 1 might have â‚¹70K interest + â‚¹30K principal, Month 120 might have â‚¹40K interest + â‚¹60K principal. This is called amortization."
                                },
                                {
                                    q: "What is prepayment in EMI?",
                                    a: "Prepayment means paying extra amount over and above regular EMI to reduce principal loan amount. Prepayments reduce remaining principal, which reduces future interest and can reduce EMI or shorten loan tenure. Some banks charge prepayment penalty (0-2%) for prepaying before certain period. Prepayments help save significant interest, especially in early years when interest component is high."
                                },
                                {
                                    q: "EMI calculator for personal loan?",
                                    a: "Yes, our EMI calculator works for personal loans. Enter loan amount, interest rate (typically 10-24% for personal loans depending on credit score), and tenure (usually 1-5 years). Personal loans have higher interest rates and shorter tenure than secured loans, resulting in higher EMIs. Calculator helps you compare personal loan offers and plan repayment."
                                },
                                {
                                    q: "Can I change EMI amount?",
                                    a: "Yes, you can change EMI in some cases: 1) Increase EMI to repay loan faster and save interest, 2) Reduce EMI by extending tenure (if bank allows), 3) After prepayment, choose to reduce EMI or reduce tenure. Some banks allow EMI restructuring based on income changes. Check with your bank for EMI modification options and charges."
                                },
                                {
                                    q: "What happens if I miss EMI payment?",
                                    a: "Missing EMI payment results in: 1) Late payment charges (typically â‚¹500-2000), 2) Penal interest on overdue amount (2-3% extra), 3) Negative impact on credit score, 4) Risk of loan default if missed for 3+ months. Banks may send legal notices and can initiate recovery proceedings. Always pay EMI on time. Set up auto-debit or reminders to avoid missing payments."
                                },
                                {
                                    q: "EMI calculator accuracy?",
                                    a: "Our EMI calculator is highly accurate as it uses standard EMI formula used by banks and financial institutions. However, actual EMI may vary slightly due to: 1) Processing fees and charges, 2) Insurance premiums (if included), 3) Floating interest rate changes, 4) Different calculation methods (daily/rest vs monthly rest). Calculator provides close estimate - final EMI is confirmed by bank at loan sanction."
                                },
                                {
                                    q: "Fixed vs floating interest rate EMI?",
                                    a: "Fixed rate: EMI remains constant throughout tenure regardless of market rate changes. Floating rate: EMI changes when base rate changes (RBI repo rate, MCLR changes). Floating rates typically 0.25-0.5% lower initially but can increase/decrease. For fixed rate, calculator shows exact EMI for entire tenure. For floating rate, EMI shown is for current rate and may change."
                                },
                                {
                                    q: "How to calculate total interest on loan?",
                                    a: "Total interest = (EMI Ã— Total Months) - Principal Amount. For example, â‚¹50L loan at 8.5% for 20 years: EMI = â‚¹43,391, Total payment = â‚¹43,391 Ã— 240 = â‚¹1.04 Cr, Total interest = â‚¹1.04 Cr - â‚¹50L = â‚¹54L. Our EMI calculator shows total interest automatically. Higher interest rate and longer tenure increase total interest significantly."
                                },
                                {
                                    q: "EMI calculator for business loan?",
                                    a: "Yes, our EMI calculator works for business loans. Enter loan amount, interest rate (typically 10-18% for business loans), and tenure (usually 1-7 years). Business loans have higher rates than secured loans due to risk. Calculator helps you plan business loan repayment and compare different loan offers. Consider cash flow while planning business loan EMI."
                                },
                                {
                                    q: "What is step-up EMI?",
                                    a: "Step-up EMI means EMI increases gradually over time (typically 5-10% annually). This helps borrowers with increasing income start with lower EMI and increase as income grows. Step-up EMI is beneficial for young earners. Our calculator shows standard EMI - for step-up EMI, calculate for different amounts at different stages."
                                },
                                {
                                    q: "EMI vs full payment - which is better?",
                                    a: "EMI is better when: 1) You don't have full amount, 2) You can invest money elsewhere at higher returns than loan rate, 3) You need liquidity. Full payment is better when: 1) You have sufficient funds, 2) Investment returns < loan rate, 3) You want to avoid interest cost. Generally, if investment returns > loan rate, EMI is better. Otherwise, full payment saves interest."
                                },
                                {
                                    q: "How to calculate loan eligibility?",
                                    a: "Loan eligibility depends on: 1) Income (40-60% can go towards EMI), 2) Age (affects maximum tenure), 3) Credit score, 4) Existing loans. Formula: Eligible Loan = (Monthly Income Ã— EMI Ratio Ã— Loan Tenure) / (1 + (Rate Ã— Tenure)). Banks use different formulas. Use our calculator in reverse - enter affordable EMI to find eligible loan amount. Banks provide precise eligibility based on documents."
                                },
                                {
                                    q: "What is reducing balance method in EMI?",
                                    a: "Reducing balance method calculates interest on remaining principal (balance) each month. As you pay EMI and principal reduces, interest component decreases and principal component increases. This is standard method used in India. Our calculator uses reducing balance method. Some banks may use flat rate method (interest on full principal throughout), which results in higher effective interest."
                                },
                                {
                                    q: "EMI calculator for education loan?",
                                    a: "Yes, our EMI calculator works for education loans. Education loans typically have: Interest rate 8-12%, Moratorium period (no EMI during course + 6 months), Tenure 5-15 years. Calculator helps you understand post-moratorium EMI. Some banks offer lower rates for top institutions. Consider tax benefits under Section 80E for education loan interest."
                                },
                                {
                                    q: "Can I prepay entire loan?",
                                    a: "Yes, you can prepay entire loan anytime. Prepayment saves all future interest. However, banks may charge prepayment penalty (0-2% of principal) if prepaid within 1-3 years (varies by bank and loan type). Floating rate home loans typically have no prepayment penalty. Fixed rate loans may have penalty. Check your loan agreement for prepayment terms."
                                },
                                {
                                    q: "How does loan tenure affect EMI?",
                                    a: "Longer tenure = Lower EMI but Higher total interest. Shorter tenure = Higher EMI but Lower total interest. For example, â‚¹50L at 8.5%: 15 years = â‚¹49,200 EMI (â‚¹38.5L interest), 20 years = â‚¹43,391 EMI (â‚¹54L interest), 25 years = â‚¹40,083 EMI (â‚¹70L interest). Choose tenure based on EMI affordability and interest cost. Our calculator shows comparison for different tenures."
                                },
                                {
                                    q: "EMI calculator for gold loan?",
                                    a: "Yes, our EMI calculator works for gold loans. Gold loans typically have: Interest rate 10-15%, Short tenure 1-3 years, Loan amount 70-80% of gold value. EMI is calculated same way as other loans. Gold loans are secured loans with quick processing. Calculator helps you plan gold loan repayment and compare different gold loan offers."
                                },
                                {
                                    q: "What is amortization schedule?",
                                    a: "Amortization schedule is a table showing month-by-month or year-by-year breakdown of EMI payments, showing principal and interest components, and remaining balance. It helps you understand: 1) How much principal vs interest you pay each period, 2) Remaining loan balance, 3) Impact of prepayments. Our EMI calculator provides amortization schedule showing first 12 months and year-by-year summary."
                                },
                                {
                                    q: "How to save interest on loan?",
                                    a: "Ways to save interest: 1) Make part prepayments regularly (especially in early years when interest is high), 2) Choose shorter tenure if affordable, 3) Negotiate lower interest rate, 4) Make lump sum prepayments when possible, 5) Use bonuses/windfalls for prepayment. Even 1-2 prepayments can save lakhs in interest. Use our calculator to see interest savings from prepayments."
                                }
                            ].map((faq, idx) => (
                                <div key={idx} className="border-b border-slate-200 dark:border-slate-800 pb-8 last:border-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-xl flex items-start gap-3">
                                        <span className="text-primary-600 font-bold text-lg">Q{idx + 1}.</span>
                                        <span>{faq.q}</span>
                                    </h3>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg ml-8">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Share & Disclaimer */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <SocialShareButtons
                    title="EMI Calculator India - Home, Car & Personal Loan EMI | InvestingPro"
                    url="https://investingpro.in/calculators/emi"
                    description="Free emi calculator india - home, car & personal loan emi - use this free tool from InvestingPro"
                />
                <FinancialDisclaimer variant="compact" className="mt-4" />
            </div>
        </div>
    );
}