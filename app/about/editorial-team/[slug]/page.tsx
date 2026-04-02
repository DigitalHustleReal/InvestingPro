
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { TEAM_MEMBERS } from '@/lib/data/team';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Twitter, Linkedin, Mail, ArrowLeft, Quote, Briefcase, GraduationCap, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const author = TEAM_MEMBERS.find((m) => m.id === slug);
  
  if (!author) {
    return {
      title: 'Author Not Found - InvestingPro India',
    };
  }

  return {
    title: `${author.name} - ${author.role} | InvestingPro India`,
    description: author.shortBio,
  };
}

export default async function AuthorProfilePage({ params }: Props) {
  const { slug } = await params;
  const author = TEAM_MEMBERS.find((m) => m.id === slug);

  if (!author) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Breadcrumb / Back Link */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
            <Link href="/about/editorial-team" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Editorial Team
            </Link>
        </div>
      </div>

      {/* Hero Profile Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-12 pt-8">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center max-w-5xl mx-auto">
                {/* Image */}
                <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
                    <Image 
                        src={author.image} 
                        alt={author.name}
                        fill
                        className="object-cover object-top"
                        priority
                    />
                </div>
                
                {/* Info */}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <Badge className="bg-primary-600 hover:bg-primary-700">{author.role}</Badge>
                        <span className="flex items-center text-gray-500 text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {author.location}
                        </span>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                        {author.name}
                    </h1>
                    
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mb-6">
                        {author.shortBio}
                    </p>

                    <div className="flex gap-4">
                        {author.social.twitter && (
                            <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        )}
                        {author.social.linkedin && (
                            <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                        {author.social.email && (
                            <a href={`mailto:${author.social.email}`} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-12">
                
                {/* My Story Section */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-8 h-1 bg-primary-500 rounded-full block"></span>
                        My Story
                    </h2>
                    <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300">
                        <p className="italic text-lg border-l-4 border-primary-200 pl-4 mb-6">
                            "{author.quote}"
                        </p>
                        <p className="whitespace-pre-line leading-relaxed">
                            {author.story}
                        </p>
                    </div>
                </section>

                <hr className="border-gray-200 dark:border-gray-800" />

                {/* Professional Bio */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-8 h-1 bg-primary-500 rounded-full block"></span>
                         Professional Profile
                    </h2>
                    <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300">
                        <p>{author.fullBio}</p>
                    </div>
                </section>
                
                 {/* Experience & Education Mobile/Tablet View (hidden on Desktop usually, but good to keep inline for consistency if sidebar is too small) */}
                 <div className="lg:hidden space-y-8 mt-8">
                     {/* Mobile Creds here if needed, but sidebar handles it responsively below */}
                 </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
                
                {/* Credentials Card */}
                <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardContent className="p-6 space-y-8">
                        
                        {/* Expertise */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300 mb-4">Areas of Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {author.expertise.map(skill => (
                                    <Badge key={skill} variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Experience
                            </h3>
                            <ul className="space-y-4">
                                {author.experience.map((exp, i) => (
                                    <li key={i} className="text-sm border-l-2 border-gray-200 pl-3">
                                        <span className="text-gray-700 dark:text-gray-200 block font-medium">{exp.split(',')[0]}</span>
                                        <span className="text-gray-500 dark:text-gray-400 block text-xs mt-0.5">{exp.split(',').slice(1).join(',')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Education */}
                         <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" /> Education
                            </h3>
                            <ul className="space-y-4">
                                {author.education.map((edu, i) => (
                                    <li key={i} className="text-sm">
                                        <span className="text-gray-700 dark:text-gray-200 block font-medium">{edu.split(',')[0]}</span>
                                        <span className="text-gray-500 dark:text-gray-400 block text-xs mt-0.5">{edu.split(',').slice(1).join(',')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </CardContent>
                </Card>

                {/* Newsletter Box */}
                <Card className="bg-primary-600 text-white border-none">
                    <CardContent className="p-6">
                         <div className="mb-4">
                            <Quote className="w-8 h-8 opacity-30 invert" />
                         </div>
                        <h3 className="font-bold text-lg mb-2">Get {author.name.split(' ')[0]}'s Best Tips</h3>
                        <p className="text-primary-100 text-sm mb-4">
                            Join 10,000+ Indians receiving {author.name.split(' ')[0]}'s weekly financial breakdown.
                        </p>
                         <button className="w-full bg-white text-primary-700 text-sm font-bold py-2 rounded-lg hover:bg-primary-50 transition-colors">
                            Subscribe for Free
                        </button>
                    </CardContent>
                </Card>

            </div>
        </div>
      </div>
    </div>
  );
}
