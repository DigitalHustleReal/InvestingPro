
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Calculator, BarChart3, Scale, ArrowRight, Target, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tools = [
    {
        name: "SIP Analytics",
        description: "Project multi-year wealth growth with inflation indexing and dynamic rebalancing alpha.",
        icon: Calculator,
        color: "text-primary-500",
        bg: "bg-primary-500/10",
        border: "border-primary-500/20",
        href: "/calculators"
    },
    {
        name: "Lending Arbitrage",
        description: "Calculate EMIs and identify balance transfer arbitrage opportunities across top lenders.",
        icon: BarChart3,
        color: "text-primary-500",
        bg: "bg-primary-500/10",
        border: "border-primary-500/20",
        href: "/calculators"
    },
    {
        name: "Asset Comparator",
        description: "Side-by-side institutional analysis of mutual funds, ETFs, and index trackers.",
        icon: Scale,
        color: "text-primary-500",
        bg: "bg-primary-500/10",
        border: "border-primary-500/20",
        href: "/mutual-funds"
    },
    {
        name: "Risk Profiler",
        description: "Map your investment DNA via our psychometric risk assessment engine.",
        icon: Target,
        color: "text-primary-500",
        bg: "bg-primary-500/10",
        border: "border-primary-500/20",
        href: "/tools/risk-analyzer"
    }
];

export default function FeaturedTools() {
    return (
        <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
                    <div>
                        <Badge variant="outline" className="mb-4 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest text-xs">
                            <Sparkles size={12} className="mr-2 text-primary-500" />
                            Quant Utilities
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                            Smarter <span className="text-primary-600 dark:text-primary-400">Decision</span> Engines
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
                            Professional instruments for precision wealth planning.
                            Zero bias, 100% data-driven.
                        </p>
                    </div>
                    <Link href="/calculators">
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-primary-600 hover:border-slate-900 dark:hover:border-primary-600 font-bold transition-all group">
                            Full Tool Inventory
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, index) => (
                        <Link
                            key={index}
                            href={tool.href}
                            className="group"
                        >
                            <div className="h-full bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:shadow-primary-500/5 hover:border-primary-500/20 transition-all duration-500 flex flex-col justify-between">
                                <div>
                                    <div className={`w-14 h-14 rounded-2xl ${tool.bg} ${tool.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                        <tool.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors tracking-tight">
                                        {tool.name}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">
                                        {tool.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-st group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    Launch Module <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Background Accent */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] -mb-48 -mr-48" />
        </section>
    );
}
