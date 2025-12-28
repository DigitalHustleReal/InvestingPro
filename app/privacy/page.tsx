import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Shield, Lock, Eye, FileLock2, Info } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20">
            <SEOHead
                title="Privacy Policy - InvestingPro India"
                description="Privacy Policy and Data Protection information for InvestingPro.in. Learn how we protect your financial data and personal information."
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Dynamic Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 rounded-full px-4 py-2 mb-6 border border-emerald-500/20">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-bold text-xs uppercase tracking-[0.2em]">Secure Data Architecture</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 font-medium">Last updated: December 10, 2025 • Version 2.0</p>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 p-8 lg:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                            <div className="max-w-xl">
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <Shield className="w-8 h-8 text-emerald-400" />
                                    Your Data, Your Control
                                </h2>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    At InvestingPro, we believe financial privacy is a fundamental right. Our platform is built on transparency,
                                    security, and the principle that you own your data.
                                </p>
                            </div>
                            <div className="shrink-0 flex gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <FileLock2 className="w-8 h-8 text-emerald-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 lg:p-12 prose prose-slate prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:font-medium prose-p:text-slate-600 prose-p:leading-relaxed prose-li:font-medium prose-li:text-slate-600 max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Personal Information</h3>
                        <p className="text-slate-700 mb-4">We collect information you provide directly:</p>
                        <ul className="list-disc pl-6 mb-4 text-slate-700">
                            <li>Name and email address (required for account creation)</li>
                            <li>Profile information (bio, profile picture, expertise)</li>
                            <li>Investment preferences and risk profile (Investment DNA)</li>
                            <li>Content you submit (analysis articles, reviews, community benchmarks)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 mb-4 text-slate-700">
                            <li>Device and browser parameters for security optimization</li>
                            <li>Internal IP address tracing for fraud prevention</li>
                            <li>Usage telemetry (pages analyzed, comparison tool utilization, clicks)</li>
                            <li>Persistent and session-based cookies</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 mb-4 text-slate-700">
                            <li>Propagating personalized investment recommendations</li>
                            <li>Maintaining and optimizing structural platform performance</li>
                            <li>Authentication and secure access to your Investment DNA</li>
                            <li>Analyzing market trends to improve community insights</li>
                            <li>Preventing financial fraud and platform exploits</li>
                            <li>Complying with SEBI and other regulatory frameworks in India</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Information Sharing</h2>
                        <p className="text-slate-700 mb-4">We do not sell your personal information. We may share data with:</p>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Service Providers</h3>
                        <p className="text-slate-700 mb-4">
                            Validated third-party infrastructure partners who help us operate (High-security hosting, encrypted email routing).
                        </p>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Affiliate Partners</h3>
                        <p className="text-slate-700 mb-4">
                            Interests in affiliate products are tracked via anonymized telemetry to ensure transactional integrity.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Mandatory Disclosure</h3>
                        <p className="text-slate-700 mb-4">
                            When mandated by law, Indian court orders, or to protect our legal rights.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Cookies and Tracking</h2>
                        <p className="text-slate-700 mb-4">We utilize cookies to:</p>
                        <ul className="list-disc pl-6 mb-4 text-slate-700">
                            <li>Maintain high-integrity session persistence</li>
                            <li>Store localized UI preferences</li>
                            <li>Monitor platform health and interaction density</li>
                            <li>Customize financial insights based on past analysis</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Tactical Data Security</h2>
                        <p className="text-slate-700 mb-4">
                            InvestingPro implements multi-layer defense mechanisms:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-slate-700">
                            <li>End-to-end encryption for all data in transit (TLS 1.3)</li>
                            <li>Encrypted database storage with AES-256 standards</li>
                            <li>Automated security perimeter monitoring</li>
                            <li>Strict compartmentalization of user data</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Your Rights</h2>
                        <p className="text-slate-700 mb-4">You maintain absolute sovereignty over your data:</p>
                        <ul className="list-disc pl-6 mb-4 text-slate-700">
                            <li><strong>Access:</strong> Request full extraction of your persona data</li>
                            <li><strong>Correction:</strong> Instantly update any metabolic profile data</li>
                            <li><strong>Deletion:</strong> Request complete disposal of your account and metadata</li>
                            <li><strong>Opt-out:</strong> Revoke consent for non-essential telemetry</li>
                        </ul>

                        <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100 italic font-medium text-slate-600">
                            <div className="flex items-start gap-4">
                                <Info className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                                <p>
                                    Any information submitted to the community hub (Reviews, Articles, Comments) becomes public.
                                    Users are advised not to share sensitive financial details like bank account numbers or
                                    portfolio values in public text areas.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">12. Contact Data Governance</h2>
                        <p className="text-slate-700">
                            For privacy-related directives or data disposal requests:<br /><br />
                            <strong className="text-slate-900">Email:</strong> privacy@investingpro.in<br />
                            <strong className="text-slate-900">Support:</strong> authority@investingpro.in
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
