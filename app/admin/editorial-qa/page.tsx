import EditorialQADashboard from '@/components/admin/EditorialQADashboard';
import AdminLayout from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'Editorial QA | Admin',
  description: 'Review and approve AI-generated content',
};

export default function EditorialQAPage() {
  return (
    <AdminLayout>
      <EditorialQADashboard />
    </AdminLayout>
  );
}
