import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CompareCategoryPage({ params }: { params: { category: string } }) {
    // Audit fix: Redirect 404 comparison pages to main listing
    // Future improvement: Implement category-based pre-filled comparison
    redirect('/credit-cards');
}
