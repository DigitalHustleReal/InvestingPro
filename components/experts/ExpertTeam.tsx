"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Linkedin, Twitter, Globe, Mail, TrendingUp, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Expert {
    id: string;
    name: string;
    role: string;
    avatar_url?: string;
    bio?: string;
    credentials?: string[];
    years_of_experience?: number;
    specialization?: string[];
    linkedin_url?: string;
    twitter_url?: string;
    website_url?: string;
    slug?: string;
}

interface ExpertTeamProps {
    experts: Expert[];
}

export default function ExpertTeam({ experts }: ExpertTeamProps) {
    // Ensure experts is always an array (prevents prerendering errors)
    const safeExperts = Array.isArray(experts) ? experts : [];
    
    if (safeExperts.length === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                    Our expert team profiles are being updated. Check back soon!
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Introduction */}
            <div className="mb-12 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Trusted Financial Experts
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Our team combines decades of experience in Indian financial markets, 
                    regulatory compliance, and personal finance to bring you accurate, 
                    actionable advice.
                </p>
            </div>

            {/* Expert Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {safeExperts.map((expert) => (
                    <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-full border-4 border-primary-200 dark:border-primary-800 overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                                    {expert.avatar_url ? (
                                        <Image
                                            src={expert.avatar_url}
                                            alt={expert.name}
                                            width={96}
                                            height={96}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                                            {expert.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Name & Role */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    {expert.name}
                                </h3>
                                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                                    {expert.role}
                                </p>

                                {/* Credentials */}
                                {expert.credentials && expert.credentials.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                                        {expert.credentials.map((cred, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                            >
                                                <Award className="w-3 h-3 mr-1" />
                                                {cred}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Experience */}
                                {expert.years_of_experience && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {expert.years_of_experience}+ years of experience
                                    </p>
                                )}

                                {/* Specialization */}
                                {expert.specialization && expert.specialization.length > 0 && (
                                    <div className="w-full mb-4">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-600 uppercase tracking-wide mb-2">
                                            Expertise
                                        </p>
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {expert.specialization.slice(0, 3).map((spec, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Bio Preview */}
                                {expert.bio && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                                        {expert.bio}
                                    </p>
                                )}

                                {/* Social Links */}
                                <div className="flex gap-2 mt-2">
                                    {expert.linkedin_url && (
                                        <a
                                            href={expert.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </a>
                                    )}
                                    {expert.twitter_url && (
                                        <a
                                            href={expert.twitter_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <Twitter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </a>
                                    )}
                                    {expert.website_url && (
                                        <a
                                            href={expert.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </a>
                                    )}
                                </div>

                                {/* View Profile Link */}
                                {expert.slug && (
                                    <Link
                                        href={`/author/${expert.slug}`}
                                        className="mt-4 text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                                    >
                                        View Full Profile →
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Trust Signals */}
            <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
                            <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Editorial Integrity & Expertise
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                All content published on InvestingPro is reviewed by our expert team 
                                to ensure accuracy, compliance, and actionable insights. Our experts 
                                hold professional certifications including CA, CFA, CFP, and have 
                                extensive experience in Indian financial markets.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                    <span className="text-gray-600 dark:text-gray-400">Data-driven research</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                    <span className="text-gray-600 dark:text-gray-400">Market expertise</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                    <span className="text-gray-600 dark:text-gray-400">Professional certifications</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
