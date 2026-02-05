import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDataStudyBySlug, getAllDataStudies } from '@/lib/linkable-assets/data-studies-service';
import DataStudyDetail from './DataStudyDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getDataStudyBySlug(slug);
  
  if (!study) {
    return { title: 'Study Not Found' };
  }

  return {
    title: `${study.title} | InvestingPro Data Studies`,
    description: study.description,
    openGraph: {
      title: study.title,
      description: study.description,
      type: 'article',
      publishedTime: study.lastUpdated.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: study.title,
      description: study.description,
    },
  };
}

export async function generateStaticParams() {
  try {
    const studies = await getAllDataStudies();
    return studies.map((study) => ({
      slug: study.slug,
    }));
  } catch (error) {
    // Return empty array during build if DB is unavailable
    console.warn('generateStaticParams: Unable to fetch data studies, using fallback');
    return [];
  }
}

export default async function DataStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await getDataStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  return <DataStudyDetail study={study} />;
}
