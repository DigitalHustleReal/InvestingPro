import React from 'react';
import { Metadata } from 'next';
import SEOHead from '@/components/common/SEOHead';
import ContactForm from '@/components/support/ContactForm';
import { Mail, MessageSquare, Clock } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us | InvestingPro.in',
    description: 'Get in touch with the InvestingPro team for support, feedback, or business inquiries.',
};

const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact InvestingPro",
    "url": "https://investingpro.in/contact-us",
    "description": "Contact InvestingPro for support, feedback, or business inquiries.",
    "mainEntity": {
        "@type": "Organization",
        "name": "InvestingPro",
        "url": "https://investingpro.in",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "availableLanguage": ["English", "Hindi"],
            "areaServed": "IN",
        }
    }
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
            />

            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-24 pb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        Have a question about a financial product? Found a bug? Or just want to say hi? 
                        We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">Email Us</h4>
                                        <p className="text-sm text-slate-500 mb-1">For general inquiries</p>
                                        <a href="mailto:support@investingpro.in" className="text-primary-600 hover:underline font-medium">support@investingpro.in</a>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">Quick Support</h4>
                                        <p className="text-sm text-slate-500">
                                            Follow us on Twitter for quick updates and support.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">Response Time</h4>
                                        <p className="text-sm text-slate-500">
                                            We aim to respond to all inquiries within 24-48 business hours.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Not Financial Advice</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Please note that we cannot provide personalized investment advice or handle grievances related to specific bank accounts or products directly. Please contact the respective financial institution for account-specific issues.
                            </p>
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
