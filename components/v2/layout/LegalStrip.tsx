import Link from 'next/link';

export default function LegalStrip() {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-1.5 text-[11px] text-gray-500 text-center leading-relaxed">
      InvestingPro is an independent research platform. Not a SEBI-registered advisor. Not affiliated with Investing.com.{' '}
      <Link href="/disclaimer" className="text-green-700 font-medium underline underline-offset-2">
        Full Disclaimer
      </Link>
    </div>
  );
}
