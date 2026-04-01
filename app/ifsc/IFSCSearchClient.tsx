'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Loader2 } from 'lucide-react';

export default function IFSCSearchClient({ initialValue = '' }: { initialValue?: string }) {
    const [value, setValue] = useState(initialValue.toUpperCase());
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSearch = () => {
        const cleaned = value.trim().toUpperCase();
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleaned)) {
            setError('Invalid IFSC code. Format: 4 letters + 0 + 6 alphanumeric (e.g. HDFC0000001)');
            return;
        }
        setError('');
        startTransition(() => {
            router.push(`/ifsc/${cleaned}`);
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={value}
                        onChange={e => {
                            setValue(e.target.value.toUpperCase());
                            if (error) setError('');
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter IFSC code e.g. HDFC0000001"
                        maxLength={11}
                        className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        autoComplete="off"
                        spellCheck={false}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isPending || !value.trim()}
                    className="flex items-center gap-2 px-5 py-3 bg-green-700 hover:bg-green-800 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <ArrowRight className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">Look Up</span>
                </button>
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Find your IFSC on your cheque book, passbook, or bank's official website.
            </p>
        </div>
    );
}
