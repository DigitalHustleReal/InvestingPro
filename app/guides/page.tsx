import { redirect } from 'next/navigation';

// Redirect /guides to /blog since guides are published as blog articles
export default function GuidesPage() {
    redirect('/blog');
}
