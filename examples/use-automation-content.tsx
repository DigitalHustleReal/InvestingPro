/**
 * Example: How to use automation content retrieval utilities
 * 
 * This is a React component example showing how to retrieve and display
 * automation content in your admin dashboard or pages.
 */

'use client';

import { useEffect, useState } from 'react';
import { 
  getAutomationSummary, 
  getPendingRSSItems,
  getRSSGeneratedArticles,
  getArticleAutomationData,
  getRecentPipelineRuns,
  type AutomationContentSummary
} from '@/lib/automation/get-automation-content';

export default function AutomationContentExample() {
  const [summary, setSummary] = useState<AutomationContentSummary | null>(null);
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [generatedArticles, setGeneratedArticles] = useState<any[]>([]);
  const [pipelineRuns, setPipelineRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load all automation data
        const [summaryData, items, articles, runs] = await Promise.all([
          getAutomationSummary(),
          getPendingRSSItems(10),
          getRSSGeneratedArticles(10),
          getRecentPipelineRuns(10),
        ]);

        setSummary(summaryData);
        setPendingItems(items);
        setGeneratedArticles(articles);
        setPipelineRuns(runs);
      } catch (error) {
        console.error('Error loading automation content:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div>Loading automation content...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Automation Content Dashboard</h1>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold">RSS Feeds</h3>
            <p>Total: {summary.rssFeeds.total}</p>
            <p>Active: {summary.rssFeeds.active}</p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-semibold">RSS Items</h3>
            <p>Total: {summary.rssItems.total}</p>
            <p>Pending: {summary.rssItems.pending}</p>
            <p>Generated Articles: {summary.rssItems.articleGenerated}</p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-semibold">Generated Articles</h3>
            <p>Total: {summary.generatedArticles.total}</p>
            <p>Published: {summary.generatedArticles.published}</p>
            <p>Draft: {summary.generatedArticles.draft}</p>
          </div>
        </div>
      )}

      {/* Pending RSS Items */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pending RSS Items</h2>
        <div className="space-y-2">
          {pendingItems.length === 0 ? (
            <p className="text-gray-500">No pending items</p>
          ) : (
            pendingItems.map((item) => (
              <div key={item.id} className="p-3 border rounded">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-xs text-gray-500">
                  From: {item.rss_feeds?.name || 'Unknown feed'}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Generated Articles */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recently Generated Articles</h2>
        <div className="space-y-2">
          {generatedArticles.length === 0 ? (
            <p className="text-gray-500">No generated articles</p>
          ) : (
            generatedArticles.map((article) => (
              <div key={article.id} className="p-3 border rounded">
                <h3 className="font-medium">{article.title}</h3>
                <p className="text-sm text-gray-600">Status: {article.status}</p>
                {article.rss_source && (
                  <p className="text-xs text-gray-500">
                    Source: {article.rss_source.rss_feeds?.name}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Pipeline Runs */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Pipeline Runs</h2>
        <div className="space-y-2">
          {pipelineRuns.length === 0 ? (
            <p className="text-gray-500">No pipeline runs</p>
          ) : (
            pipelineRuns.map((run) => (
              <div key={run.id} className="p-3 border rounded">
                <h3 className="font-medium">{run.pipeline_type}</h3>
                <p className="text-sm">Status: {run.status}</p>
                <p className="text-xs text-gray-500">
                  Triggered: {new Date(run.triggered_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Example: Get automation data for a specific article
 */
export async function ArticleAutomationDataExample({ articleId }: { articleId: string }) {
  // This would be used in a server component or API route
  const automationData = await getArticleAutomationData(articleId);

  return (
    <div>
      <h3>Automation Data for Article</h3>
      <p>Keywords: {automationData.keywords.length}</p>
      <p>Images: {automationData.images.length}</p>
      <p>Graphics: {automationData.graphics.length}</p>
      <p>Repurposed Content: {automationData.repurposedContent.length}</p>
      {automationData.rssSource && (
        <p>RSS Source: {automationData.rssSource.title}</p>
      )}
    </div>
  );
}



