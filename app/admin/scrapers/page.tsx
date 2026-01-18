import ScraperMonitor from '@/components/admin/ScraperMonitor';

export const metadata = {
  title: 'Scraper Monitor | Admin',
  description: 'Monitor and control all data scrapers'
};

export default function ScraperMonitorPage() {
  return (
    <div className="p-8">
      <ScraperMonitor autoRefresh={true} refreshInterval={5000} />
    </div>
  );
}
