import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Twitter, Linkedin, CheckCircle2, ShieldCheck, Newspaper } from 'lucide-react';

export const metadata = {
  title: 'Editorial Team | InvestingPro India',
  description: 'Meet the financial experts, analysts, and editors behind InvestingPro India - trusted by millions for unbiased financial advice.',
};

const TEAM_MEMBERS = [
  {
    id: 'rahul-kapoor',
    name: 'Rahul Kapoor',
    role: 'Editor-in-Chief',
    image: '/images/team/rahul-kapoor.png',
    bio: '18+ years in financial journalism, formerly with The Economic Times and Mint. Expert in macroeconomics, RBI policy, and banking regulations. Rahul leads our editorial vision with a focus on "Truth in Finance".',
    expertise: ['Macroeconomics', 'Banking Policy', 'Debt Markets'],
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 'priya-subramaniam',
    name: 'Priya Subramaniam',
    role: 'Lead Investment Analyst',
    image: '/images/team/priya-subramaniam.png',
    bio: 'CFA Charterholder and former Fund Manager with 12 years of experience managing equity portfolios. Priya specializes in decoding Mutual Fund strategies and simplifying SIPs for retail investors.',
    expertise: ['Mutual Funds', 'Equity Research', 'Portfolio Construction'],
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 'aditya-gokhale',
    name: 'Aditya Gokhale',
    role: 'Senior Credit Strategist',
    image: '/images/team/aditya-gokhale.png',
    bio: 'Ex-HDFC Bank Product Manager who knows the credit card industry from the inside out. Aditya decodes the fine print, reward points (miles/cashback), and hidden fees that banks don\'t tell you about.',
    expertise: ['Credit Cards', 'Rewards Optimization', 'Credit Scores'],
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 'zoya-khan',
    name: 'Zoya Khan',
    role: 'Consumer Finance Lead',
    image: '/images/team/zoya-khan.png',
    bio: 'The brain behind our "Smart Spender" series. Zoya finds the best shopping deals, loan interest hacks, and savings account arbitrage opportunities. She helps Indian families save ₹1 Lakh+ annually.',
    expertise: ['Personal Loans', 'Savings Hacks', 'E-commerce Deals'],
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 'vikram-singh',
    name: 'Vikram Singh',
    role: 'Head of Banking & Loans',
    image: '/images/team/vikram-singh.png',
    bio: 'With 20 years in retail banking across Punjab and Delhi, Vikram is our authority on Home Loans and Property Finance. He explains complex loan structures in simple "Desi" terms.',
    expertise: ['Home Loans', 'Mortgage', 'Real Estate Finance'],
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 'anjali-das',
    name: 'CA Anjali Das',
    role: 'Tax & Insurance Expert',
    image: '/images/team/anjali-das.png',
    bio: 'A practicing Chartered Accountant (CA) who hates jargon. Anjali makes Income Tax filing, GST, and Term Insurance clauses understandable for everyone. She ensures our advice is 100% compliant.',
    expertise: ['Income Tax', 'Term Insurance', 'GST'],
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 'david-sangma',
    name: 'David Sangma',
    role: 'Fintech & Tech Lead',
    image: '/images/team/david-sangma.png',
    bio: 'Covering the future of money. From UPI updates to the Digital Rupee and Neo-banking apps, David tracks how technology is changing the way Indians transact and invest.',
    expertise: ['Fintech', 'Digital Payments', 'Crypto Assets'],
    social: { twitter: '#', linkedin: '#' }
  }
];

export default function EditorialTeamPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/10 pointer-events-none" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/50 dark:text-primary-400">
              InvestingPro Editorial Board
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Expertise You Can Trust
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-600 leading-relaxed">
              We are a team of journalists, CAs, bankers, and analysts obsessed with one mission: 
              <strong> Making you wealthier, faster.</strong> Our content is fact-checked, unbiased, and data-driven.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Signals Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Editorial Independence</h3>
              <p className="text-sm text-slate-500 dark:text-slate-600">Our reviews are never influenced by partners.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-primary-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Fact-Checked Accuracy</h3>
              <p className="text-sm text-slate-500 dark:text-slate-600">Every rate and fee verified weekly.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Newspaper className="h-8 w-8 text-primary-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Expert Contributors</h3>
              <p className="text-sm text-slate-500 dark:text-slate-600">Written by CAs, Bankers & Analysts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Editor In Chief (Full Width on Mobile, Featured) */}
            <div className="lg:col-span-3 flex justify-center mb-8">
                <Card className="max-w-4xl w-full overflow-hidden border-primary-100 dark:border-primary-900/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 relative h-80 md:h-auto">
                            <Image 
                                src={TEAM_MEMBERS[0].image} 
                                alt={TEAM_MEMBERS[0].name}
                                fill
                                className="object-cover object-top"
                                priority
                            />
                        </div>
                        <div className="md:w-2/3 p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-primary-600 hover:bg-primary-700">{TEAM_MEMBERS[0].role}</Badge>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{TEAM_MEMBERS[0].name}</h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                                {TEAM_MEMBERS[0].bio}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {TEAM_MEMBERS[0].expertise.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Other Team Members */}
            {TEAM_MEMBERS.slice(1).map((member, index) => (
                <Link href={`/about/editorial-team/${member.id}`} key={index} className="block group">
                <Card className="h-full overflow-hidden hover:border-primary-200 dark:hover:border-primary-800 transition-colors duration-300">
                    <div className="relative h-64 w-full bg-slate-100 dark:bg-slate-800">
                        <Image 
                            src={member.image} 
                            alt={member.name}
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="text-primary-600 border-primary-200 dark:text-primary-400 dark:border-primary-800">
                                {member.role}
                            </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold group-hover:text-primary-600 transition-colors">{member.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-600 dark:text-slate-600 text-sm mb-4 line-clamp-3">
                            {member.bio}
                        </p>
                        <Separator className="my-4" />
                        <div className="flex flex-wrap gap-2 mb-4 h-16 overflow-hidden content-start">
                            {member.expertise.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-600">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <span className="text-primary-600 text-sm font-medium flex items-center">
                                Read Full Profile
                            </span>
                        </div>
                    </CardContent>
                </Card>
                </Link>
            ))}
        </div>

        {/* Join Us CTA */}
        <div className="mt-20 bg-primary-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-600 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-30" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Want to write for InvestingPro?</h2>
                <p className="text-primary-100 mb-8 text-lg">
                    We are always looking for certified financial experts (CAs, CFAs, Ex-Bankers) to join our contributor network.
                </p>
                <div className="flex justify-center gap-4">
                     <a href="/contact" className="bg-white text-primary-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors">
                        Apply as Contributor
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
