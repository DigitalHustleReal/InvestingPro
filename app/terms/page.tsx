import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { ScrollText, FileCheck, Gavel, ShieldAlert, Zap } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20">
            <SEOHead
                title="Terms of Service - Platform Governance | InvestingPro"
                description="Terms and conditions for using InvestingPro.in. Learn about our user agreement, intellectual property, and community guidelines."
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Authority Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-2 mb-6 border border-blue-500/20">
                        <ScrollText className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700 font-black text-xs uppercase tracking-[0.2em]">Service Governance Protocol</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-slate-500 font-medium">Agreement Between the User and InvestingPro India</p>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 p-8 lg:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                            <div className="max-w-xl">
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <Gavel className="w-8 h-8 text-blue-400" />
                                    Operational Integrity
                                </h2>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    By accessing the InvestingPro platform, you acknowledge entering into a binding legal agreement
                                    governed by the laws of India.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 lg:p-12 prose prose-slate prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed max-w-none">

                        <h2 className="text-2xl mt-0">1. Acceptance of Protocol</h2>
                        <p>
                            By utilizing the InvestingPro.in website or mobile application, you agree to comply with these Terms
                            of Service. If you do not agree with any segment of this protocol, you must cease all interaction
                            with the platform immediately.
                        </p>

                        <h2 className="text-2xl">2. User Accounts & Infrastructure</h2>
                        <p>
                            To access certain authority features (Portfolio, Analysis Hub), you must create a verified account.
                            You are responsible for maintaining the confidentiality of your session tokens and credentials.
                            InvestingPro reserves the right to terminate accounts that interfere with platform integrity.
                        </p>

                        <h2 className="text-2xl">3. Intellectual Property Rights</h2>
                        <p>
                            All proprietary algorithms, UI/UX designs, data visualizations, and editorial content are the
                            exclusive property of InvestingPro. User-submitted content (articles, reviews) remains the
                            intellectual property of the contributor, but InvestingPro is granted a perpetual, global
                            license to display and distribute such content.
                        </p>

                        <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 my-10">
                            <div className="flex gap-4">
                                <Zap className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-black text-blue-900 mb-2 uppercase tracking-wide text-xs">Extraction Restriction</h4>
                                    <p className="text-blue-800 text-sm font-medium leading-relaxed">
                                        Automated data scraping, crawling, or extracting financial data from the platform for
                                        commercial use is strictly prohibited without written authorization.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl">4. Community Guidelines</h2>
                        <p>
                            Contributors to the platform must adhere to high standards of financial transparency.
                            Falsifying data, spamming reviews, or providing malicious financial misinformation will result in
                            immediate protocol suspension and removal of all badges.
                        </p>

                        <h2 className="text-2xl">5. Liability Limitation</h2>
                        <p>
                            InvestingPro shall not be liable for any direct, indirect, or consequential damages resulting
                            from financial losses incurred through the use of our comparison tools or AI analysis.
                            Users deploy capital at their own risk.
                        </p>

                        <h2 className="text-2xl text-slate-900">12. Governance Contact</h2>
                        <p className="text-slate-700">
                            For disputes or governance inquiries:<br /><br />
                            <strong className="text-slate-900">Email:</strong> terms@investingpro.in<br />
                            <strong className="text-slate-900">Governance:</strong> governance@investingpro.in
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
