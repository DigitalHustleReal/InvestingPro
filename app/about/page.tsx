export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                    About InvestingPro
                </h1>
                
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                        InvestingPro is India's most trusted financial comparison platform, helping millions make smarter money decisions.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Our Mission</h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        We believe everyone deserves access to unbiased, data-driven financial advice. Our mission is to empower Indians with the tools and knowledge to make informed decisions about credit cards, loans, investments, and insurance.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">What We Do</h2>
                    <ul className="text-slate-600 dark:text-slate-300 space-y-2">
                        <li>Compare 1000+ financial products from top Indian banks and institutions</li>
                        <li>Provide expert reviews and ratings based on real data</li>
                        <li>Offer free financial calculators and planning tools</li>
                        <li>Publish educational content to improve financial literacy</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Our Values</h2>
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Transparency</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">We clearly disclose how we make money and never compromise our editorial integrity.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Accuracy</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Our data is verified daily and our reviews are based on rigorous testing.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Independence</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">We maintain editorial independence from financial institutions we review.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">User-First</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Every decision we make prioritizes what's best for our users.</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Contact Us</h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        Have questions or feedback? Reach out to us at{' '}
                        <a href="mailto:hello@investingpro.in" className="text-primary-600 hover:text-primary-700">
                            hello@investingpro.in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
