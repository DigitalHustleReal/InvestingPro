import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEOHead from '@/components/common/SEOHead';
import { FileText, Shield, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Editorial Policy | InvestingPro',
    description: 'Our editorial standards, content review process, and commitment to transparency and accuracy in financial information.',
};

/**
 * Editorial Policy Page
 * 
 * Outlines content standards, AI usage policy, and review process.
 * Critical for YMYL compliance and user trust.
 */
export default function EditorialPolicyPage() {
    return (
        <>
            <SEOHead
                title="Editorial Policy | InvestingPro"
                description="Our editorial standards, content review process, and commitment to transparency and accuracy in financial information."
                url="https://investingpro.in/editorial-policy"
            />
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">
                            Editorial Policy
                        </h1>
                        <p className="text-xl text-slate-600">
                            Our commitment to accuracy, transparency, and independence
                        </p>
                    </div>

                    {/* Core Principles */}
                    <Card className="mb-8 border-2 border-teal-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-6 md:p-8">
                                <Shield className="w-6 h-6 text-teal-600" />
                                Core Principles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Authoritative & Neutral</h3>
                                    <p className="text-sm text-slate-600">
                                        All content is research-driven and neutral. We do not favor any provider or product.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Data-Driven</h3>
                                    <p className="text-sm text-slate-600">
                                        Every claim is backed by verified data with full provenance (source, timestamp, update frequency).
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Transparent</h3>
                                    <p className="text-sm text-slate-600">
                                        Our methodology, data sources, and ranking calculations are publicly disclosed.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Independent</h3>
                                    <p className="text-sm text-slate-600">
                                        Rankings and content are not influenced by monetization, affiliate relationships, or advertising.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Usage Policy */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-6 md:p-8">
                                <Eye className="w-6 h-6 text-teal-600" />
                                AI Usage Policy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-6 md:p-8 bg-slate-50 rounded-lg">
                                    <p className="text-sm text-slate-700 mb-3">
                                        <strong>Important:</strong> InvestingPro is NOT an AI content generator.
                                        We are an authoritative financial comparison and ranking engine.
                                        AI is used ONLY as a support tool under strict limitations.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">AI May ONLY Be Used For:</h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <span>Drafting summaries from verified data (human review required)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <span>FAQ extraction from source documents (human review required)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <span>Metadata generation (titles, descriptions) (human review required)</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">AI Guardrails:</h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <span>Must use RAG (retrieval from scraped data)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <span>Must include citations for all factual claims</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <span>Must be human-reviewable before publication</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <span>No financial advice phrasing</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <span>Informational language only</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">NOT Allowed:</h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                                            <span>Bulk article generation</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                                            <span>AI-first content workflows</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                                            <span>Unreviewed AI content</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                                            <span>Financial advice or recommendations</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                                            <span>Claims of expertise or regulatory registration</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Review Process */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-6 md:p-8">
                                <FileText className="w-6 h-6 text-teal-600" />
                                Content Review Process
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">1. Data Verification</h3>
                                    <p className="text-sm text-slate-600">
                                        All data points are verified against source documents with full provenance tracking.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">2. Draft Generation</h3>
                                    <p className="text-sm text-slate-600">
                                        If AI is used for drafting, it must be based on verified data and include citations.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">3. Human Review (MANDATORY)</h3>
                                    <p className="text-sm text-slate-600">
                                        All content, including AI-generated drafts, must be reviewed by a human editor before publication.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">4. Compliance Check</h3>
                                    <p className="text-sm text-slate-600">
                                        Content is checked for compliance with informational language requirements and disclaimers.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">5. Publication</h3>
                                    <p className="text-sm text-slate-600">
                                        Only reviewed and approved content is published. All published content includes data provenance.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Language Standards */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Language Standards</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Informational Language Only</h3>
                                    <p className="text-sm text-slate-600 mb-2">
                                        All content uses informational, educational language. We do not provide financial advice.
                                    </p>
                                    <div className="p-3 bg-slate-50 rounded">
                                        <p className="text-xs font-mono text-slate-700">
                                            ✅ "This product offers..."<br />
                                            ✅ "According to the data..."<br />
                                            ✅ "Users may consider..."<br />
                                            ❌ "We recommend..."<br />
                                            ❌ "You should..."<br />
                                            ❌ "Best option..."
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">No Advisory Claims</h3>
                                    <p className="text-sm text-slate-600">
                                        We do not claim to be registered investment advisors. All content is clearly marked as informational.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Corrections Policy */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Corrections & Updates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 mb-4">
                                We are committed to accuracy. If you find an error:
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span>Contact us at support@investingpro.in</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span>We will investigate and correct verified errors promptly</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span>All corrections are documented with timestamps</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Disclaimer */}
                    <div className="mt-8 p-6 md:p-8 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-900">
                            <strong>Important:</strong> InvestingPro.in is not registered with SEBI as an investment advisor.
                            All information on this platform is for educational and informational purposes only.
                            Users should consult with qualified financial advisors before making financial decisions.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
