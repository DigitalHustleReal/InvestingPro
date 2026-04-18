import Image from "next/image";

const PARTNERS = [
  {
    name: "SBI",
    logo: "https://logo.clearbit.com/sbi.co.in",
    href: "/credit-cards",
  },
  {
    name: "HDFC Bank",
    logo: "https://logo.clearbit.com/hdfcbank.com",
    href: "/credit-cards",
  },
  {
    name: "ICICI Bank",
    logo: "https://logo.clearbit.com/icicibank.com",
    href: "/loans",
  },
  {
    name: "Axis Bank",
    logo: "https://logo.clearbit.com/axisbank.com",
    href: "/credit-cards",
  },
  {
    name: "Kotak",
    logo: "https://logo.clearbit.com/kotak.com",
    href: "/loans",
  },
  {
    name: "LIC",
    logo: "https://logo.clearbit.com/licindia.in",
    href: "/insurance",
  },
  {
    name: "Bajaj Finserv",
    logo: "https://logo.clearbit.com/bajajfinserv.in",
    href: "/loans",
  },
  {
    name: "Zerodha",
    logo: "https://logo.clearbit.com/zerodha.com",
    href: "/demat-accounts",
  },
  {
    name: "Groww",
    logo: "https://logo.clearbit.com/groww.in",
    href: "/mutual-funds",
  },
  {
    name: "SBI Card",
    logo: "https://logo.clearbit.com/sbicard.com",
    href: "/credit-cards",
  },
  {
    name: "HDFC Life",
    logo: "https://logo.clearbit.com/hdfclife.com",
    href: "/insurance",
  },
  {
    name: "Nippon India",
    logo: "https://logo.clearbit.com/nipponindiamf.com",
    href: "/mutual-funds",
  },
];

export default function PartnerLogos() {
  return (
    <section className="py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-sm text-gray-400 mb-6">
          Comparing products from India&apos;s top financial institutions
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              title={p.name}
            >
              <Image
                src={p.logo}
                alt={p.name}
                width={80}
                height={40}
                className="h-8 w-auto object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
