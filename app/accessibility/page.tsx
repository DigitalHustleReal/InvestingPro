export default function AccessibilityPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                    Accessibility Statement
                </h1>
                
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                        InvestingPro is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Conformance Status</h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. InvestingPro is partially conformant with WCAG 2.1 level AA.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Accessibility Features</h2>
                    <ul className="text-slate-600 dark:text-slate-300 space-y-2">
                        <li>Keyboard navigation support throughout the site</li>
                        <li>Screen reader compatibility</li>
                        <li>High contrast mode and dark mode options</li>
                        <li>Resizable text without loss of functionality</li>
                        <li>Clear focus indicators for interactive elements</li>
                        <li>Descriptive link text and alt text for images</li>
                        <li>Semantic HTML markup for proper structure</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Known Limitations</h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        Despite our best efforts to ensure accessibility, there may be some limitations. We are actively working to address these:
                    </p>
                    <ul className="text-slate-600 dark:text-slate-300 space-y-2">
                        <li>Some third-party content may not be fully accessible</li>
                        <li>Complex data visualizations may require alternative text descriptions</li>
                        <li>Some PDF documents may not be fully accessible</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Feedback</h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        We welcome your feedback on the accessibility of InvestingPro. Please let us know if you encounter accessibility barriers:
                    </p>
                    <ul className="text-slate-600 dark:text-slate-300 space-y-2">
                        <li>Email: <a href="mailto:accessibility@investingpro.in" className="text-primary-600 hover:text-primary-700">accessibility@investingpro.in</a></li>
                        <li>We try to respond to feedback within 2 business days</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Technical Specifications</h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        Accessibility of InvestingPro relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
                    </p>
                    <ul className="text-slate-600 dark:text-slate-300 space-y-2">
                        <li>HTML</li>
                        <li>WAI-ARIA</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                    </ul>

                    <p className="text-sm text-slate-500 dark:text-slate-600 mt-8">
                        This statement was last updated on January 10, 2026.
                    </p>
                </div>
            </div>
        </div>
    );
}
