import React from 'react';
import Link from 'next/link';
import SEOHead from "@/components/common/SEOHead";
import { AlertTriangle, ShieldCheck, Scale, Info, ExternalLink } from "lucide-react";

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20">
            <SEOHead
                title="Disclaimer - Investment Risk & Regulatory Information | InvestingPro"
                description="Important legal disclosures and financial disclaimers for InvestingPro.in users. Read our regulatory status and risk warnings."
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Authority Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 rounded-full px-4 py-2 mb-6 border border-amber-500/20">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-700 font-black text-xs uppercase tracking-[0.2em]">Mandatory Disclosure protocol</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Legal Disclaimer</h1>
                    <p className="text-slate-500 font-medium">Regulatory Status & Investment Risk Acknowledgement</p>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 p-8 lg:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                            <div className="max-w-xl">
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <Scale className="w-8 h-8 text-amber-400" />
                                    No Advice, Just Intelligence
                                </h2>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    InvestingPro is an information platform. We provide the tools for analysis, but the execution and
                                    responsibility of financial decisions reside entirely with the user.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 lg:p-12 prose prose-slate prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed max-w-none">

                        <h2 className="text-2xl mt-0">1. Not a SEBI Registered Advisor or Financial Advisor</h2>
                        <p>
                            <strong className="text-slate-900">InvestingPro.in is NOT a SEBI (Securities and Exchange Board of India) registered investment advisor, financial advisor, stockbroker, or financial planner.</strong> We are an independent research, education, and discovery platform. Our platform is designed to help you conduct your own research, learn about financial products, and discover investment options.
                        </p>
                        <p className="mt-4">
                            All content, tools, calculators, product comparisons, rankings, and information on this platform are provided for <strong className="text-slate-900">informational and educational purposes only</strong>. Nothing on this website should be construed as investment advice, financial advice, or personalized recommendations.
                        </p>
                        <div className="p-6 bg-red-50 rounded-2xl border-2 border-red-200 my-6">
                            <h4 className="font-black text-red-900 mb-3 uppercase tracking-wide text-sm">Critical Disclosure</h4>
                            <p className="text-red-800 font-semibold leading-relaxed">
                                We do NOT provide buy, sell, or hold recommendations. We do NOT offer personalized investment advice. We do NOT provide financial planning services. Our platform is for research, education, and discovery only.
                            </p>
                        </div>

                        <h2 className="text-2xl">2. No Investment Recommendations - Research & Education Only</h2>
                        <p>
                            <strong className="text-slate-900">InvestingPro.in does NOT provide investment recommendations, buy/sell/hold advice, or any form of investment guidance.</strong> Our platform is designed for research, education, and discovery purposes. We help you compare products, understand features, and make informed decisions through your own research.
                        </p>
                        <p className="mt-4">
                            <strong className="text-slate-900">Not Investment Advice:</strong> Product rankings, comparisons, reviews, and calculators on this platform are tools to assist your research. They are NOT recommendations to buy, sell, or hold any security or financial product. You must conduct your own due diligence and consult with a qualified, SEBI-registered financial advisor before making any investment decisions.
                        </p>
                        <p className="mt-4">
                            Investing in the stock market, mutual funds, and other financial instruments involves <strong className="text-slate-900">substantial risk of loss</strong>. Past performance is not indicative of future results. All investments carry the risk of capital loss.
                        </p>

                        <div className="p-8 bg-amber-50 rounded-3xl border-2 border-amber-200 my-10">
                            <div className="flex gap-4">
                                <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-black text-amber-900 mb-3 uppercase tracking-wide text-xs">Platform Purpose & Limitations</h4>
                                    <p className="text-amber-800 text-sm font-semibold leading-relaxed mb-3">
                                        InvestingPro.in is a research, education, and discovery platform. We provide tools and information to help you make informed decisions through your own research. We do NOT provide investment advice or recommendations.
                                    </p>
                                    <p className="text-amber-800 text-sm font-medium leading-relaxed">
                                        Market fluctuations can significantly impact the value of your investments. InvestingPro does not guarantee any specific returns, investment outcomes, or the accuracy of real-time data provided by third-party APIs. All investment decisions are your sole responsibility.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl">3. Platform Purpose: Research, Education & Discovery</h2>
                        <p>
                            <strong className="text-slate-900">InvestingPro.in is designed for research, education, and discovery purposes.</strong> Our platform helps you:
                        </p>
                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li><strong className="text-slate-900">Research:</strong> Compare financial products, understand features, fees, and terms</li>
                            <li><strong className="text-slate-900">Education:</strong> Learn about investment options, financial concepts, and market dynamics</li>
                            <li><strong className="text-slate-900">Discovery:</strong> Find and explore financial products that may suit your needs</li>
                        </ul>
                        <p className="mt-4">
                            <strong className="text-slate-900">We do NOT:</strong> Provide investment advice, make buy/sell/hold recommendations, offer personalized financial planning, or act as a financial advisor. All investment decisions are your sole responsibility.
                        </p>

                        <h2 className="text-2xl mt-8">4. Accuracy of Information</h2>
                        <p>
                            While we strive to provide high-integrity data, InvestingPro does not warrant the completeness,
                            accuracy, or timeliness of the information provided. Financial data like stock prices, interest
                            rates, and fund NAVs are subject to change and may vary from the actual quoted rates on
                            official exchanges. Always verify information with official sources before making decisions.
                        </p>

                        <h2 className="text-2xl">5. Affiliate Disclosure & How We Make Money</h2>
                        <p>
                            InvestingPro contains affiliate links to third-party financial products (Brokers, Insurance, Cards).
                            If you utilize these services, we may receive compensation at no additional cost to you.
                            However, our reviews and data remains objective and is not influenced by these partnerships.
                        </p>
                        <p className="mt-4">
                            <strong className="text-slate-900">Revenue Sources:</strong> We earn money through:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Affiliate commissions when users apply for financial products through our links</li>
                            <li>Advertising revenue from financial institutions</li>
                            <li>Sponsored content (clearly marked as such)</li>
                        </ul>
                        <p className="mt-4">
                            Our editorial team operates independently of our revenue team. Product rankings and reviews
                            are based solely on objective criteria and user value, not compensation received.
                        </p>

                        <h2 className="text-2xl">6. Editorial Independence</h2>
                        <p>
                            InvestingPro maintains strict editorial independence. Our product rankings, reviews, and
                            recommendations are determined by our proprietary methodology and are not influenced by
                            advertising relationships or affiliate partnerships.
                        </p>
                        <p className="mt-4">
                            <strong className="text-slate-900">Our Review Process:</strong>
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Products are evaluated using objective criteria (fees, features, rates, user reviews)</li>
                            <li>Our methodology is publicly disclosed on our <Link href="/methodology" className="text-teal-600 hover:text-teal-700 underline">Methodology page</Link></li>
                            <li>Editorial decisions are made by our content team, separate from revenue operations</li>
                            <li>We regularly update our reviews to reflect current market conditions</li>
                        </ul>

                        <h2 className="text-2xl">7. Third-Party Links & Services</h2>
                        <p>
                            InvestingPro may contain links to third-party websites, services, or financial institutions.
                            We are not responsible for the content, privacy practices, or terms of service of these
                            external sites. When you click on affiliate links or apply for products, you will be
                            redirected to the provider's website, and their terms and conditions will apply.
                        </p>

                        <h2 className="text-2xl">8. User-Generated Content</h2>
                        <p>
                            InvestingPro allows users to submit reviews, comments, and articles. We moderate all
                            user-generated content but are not responsible for the accuracy of user-submitted information.
                            User reviews reflect individual experiences and opinions, not necessarily those of InvestingPro.
                        </p>

                        <h2 className="text-2xl">9. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, InvestingPro and its affiliates shall not be liable
                            for any indirect, incidental, special, consequential, or punitive damages, or any loss of
                            profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill,
                            or other intangible losses resulting from your use of this platform.
                        </p>

                        <h2 className="text-2xl">10. Changes to Terms</h2>
                        <p>
                            InvestingPro reserves the right to modify this disclaimer and our Terms of Service at any time.
                            We will notify users of material changes via email or prominent notice on our website. Your
                            continued use of the platform after such modifications constitutes acceptance of the updated terms.
                        </p>

                        <h2 className="text-2xl">11. Contact & Regulatory Information</h2>
                        <p>
                            <strong className="text-slate-900">Regulatory Status:</strong> InvestingPro.in is NOT registered with SEBI as an investment advisor, research analyst, or any other regulated entity. We are an independent information platform providing research, education, and discovery tools.
                        </p>
                        <p className="mt-4">
                            <strong className="text-slate-900">Consult a Professional:</strong> Before making any investment decisions, please consult with a qualified, SEBI-registered financial advisor, investment advisor, or certified financial planner who can provide personalized advice based on your financial situation, risk tolerance, and investment objectives.
                        </p>
                        <p className="mt-4 text-slate-700">
                            For any legal inquiries regarding our status or documentation:<br /><br />
                            <strong className="text-slate-900">Email:</strong> legal@investingpro.in<br />
                            <strong className="text-slate-900">Compliance:</strong> compliance@investingpro.in
                        </p>
                        <p className="text-slate-700">
                            For any legal inquiries regarding our status or documentation:<br /><br />
                            <strong className="text-slate-900">Email:</strong> legal@investingpro.in<br />
                            <strong className="text-slate-900">Compliance:</strong> compliance@investingpro.in
                        </p>

                        <div className="mt-12 flex items-center gap-2 p-6 bg-slate-50 rounded-3xl text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">
                            <Info className="w-4 h-4 text-blue-500" />
                            This disclaimer is part of our integrated Terms of Service.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
