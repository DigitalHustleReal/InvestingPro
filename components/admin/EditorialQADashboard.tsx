'use client';

/**
 * Editorial QA Dashboard
 * 
 * Purpose: Human review interface for AI-generated content before publishing
 * Features:
 * - View pending content assignments
 * - Review/edit content
 * - Approve or reject with feedback
 * - Track editorial metrics
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  ChevronRight,
  User,
  FileText,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

interface ContentAssignment {
  id: string;
  article_id: string;
  article_title: string;
  article_slug: string;
  category: string;
  status: 'pending_review' | 'in_review' | 'approved' | 'rejected' | 'published';
  author_name: string;
  editor_name: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  word_count: number;
  created_at: string;
  updated_at: string;
  review_notes: string | null;
}

interface QAStats {
  pending: number;
  in_review: number;
  approved_today: number;
  rejected_today: number;
  avg_review_time: string;
}

// Status badge colors
const statusColors: Record<string, string> = {
  pending_review: 'bg-wt-gold-subtle text-accent-500 border-accent-500/20',
  in_review: 'bg-wt-gold-subtle text-wt-gold border-wt-gold/20',
  approved: 'bg-wt-green-subtle text-wt-green border-success-500/20',
  rejected: 'bg-wt-danger/10 text-danger-500 border-danger-500/20',
  published: 'bg-wt-gold-subtle text-wt-gold border-wt-gold/20',
};

const priorityColors: Record<string, string> = {
  low: 'bg-wt-card text-wt-text-muted dark:text-wt-text-muted',
  medium: 'bg-wt-gold-subtle text-wt-gold',
  high: 'bg-wt-gold-subtle text-accent-400',
  urgent: 'bg-wt-danger/10 text-wt-danger',
};

export default function EditorialQADashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('pending_review');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch assignments
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['content-assignments', statusFilter],
    queryFn: async () => {
      const res = await fetch(`/api/admin/content-assignments?status=${statusFilter}`);
      if (!res.ok) throw new Error('Failed to fetch assignments');
      return res.json();
    },
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['qa-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/content-assignments/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const res = await fetch(`/api/admin/content-assignments/${assignmentId}/approve`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to approve');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['qa-stats'] });
      toast.success('Content approved and queued for publishing');
    },
    onError: () => {
      toast.error('Failed to approve content');
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ assignmentId, reason }: { assignmentId: string; reason: string }) => {
      const res = await fetch(`/api/admin/content-assignments/${assignmentId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['qa-stats'] });
      toast.success('Content rejected with feedback');
    },
  });

  const filteredAssignments = assignments?.filter((a: ContentAssignment) =>
    a.article_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wt-text/95 dark:text-wt-text/95">Editorial QA Dashboard</h1>
          <p className="text-wt-text-muted dark:text-wt-text-muted mt-1">Review and approve AI-generated content</p>
        </div>
        <Button variant="outline" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          View Analytics
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          label="Pending Review"
          value={stats?.pending || 0}
          icon={<Clock className="w-5 h-5 text-accent-500" />}
          color="yellow"
        />
        <StatCard
          label="In Review"
          value={stats?.in_review || 0}
          icon={<Eye className="w-5 h-5 text-wt-gold" />}
          color="blue"
        />
        <StatCard
          label="Approved Today"
          value={stats?.approved_today || 0}
          icon={<CheckCircle className="w-5 h-5 text-wt-green" />}
          color="green"
        />
        <StatCard
          label="Rejected Today"
          value={stats?.rejected_today || 0}
          icon={<XCircle className="w-5 h-5 text-danger-500" />}
          color="red"
        />
        <StatCard
          label="Avg Review Time"
          value={stats?.avg_review_time || 'â€”'}
          icon={<BarChart3 className="w-5 h-5 text-wt-gold" />}
          color="primary"
          isText
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wt-text-muted dark:text-wt-text-muted" />
          <Input
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface-darker dark:bg-surface-darker border-wt-border dark:border-wt-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-surface-darker dark:bg-surface-darker border-wt-border dark:border-wt-border">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content List */}
      <div className="bg-surface-darker/50 dark:bg-surface-darker/50 border border-wt-border dark:border-wt-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-wt-text-muted dark:text-wt-text-muted">Loading assignments...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-8 text-center text-wt-text-muted dark:text-wt-text-muted">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No content assignments found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredAssignments.map((assignment: ContentAssignment) => (
              <ContentRow
                key={assignment.id}
                assignment={assignment}
                onApprove={() => approveMutation.mutate(assignment.id)}
                onReject={(reason) => rejectMutation.mutate({ assignmentId: assignment.id, reason })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  label, 
  value, 
  icon, 
  color,
  isText = false 
}: { 
  label: string; 
  value: number | string; 
  icon: React.ReactNode;
  color: string;
  isText?: boolean;
}) {
  return (
    <div className="bg-surface-darker/50 dark:bg-surface-darker/50 border border-wt-border dark:border-wt-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-wt-text-muted dark:text-wt-text-muted text-sm">{label}</span>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${isText ? 'text-lg' : ''} text-wt-text/95 dark:text-wt-text/95`}>
        {value}
      </p>
    </div>
  );
}

// Content Row Component
function ContentRow({
  assignment,
  onApprove,
  onReject,
}: {
  assignment: ContentAssignment;
  onApprove: () => void;
  onReject: (reason: string) => void;
}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    onReject(rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <div className="p-4 hover:bg-wt-card dark:bg-wt-card transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Badge className={statusColors[assignment.status]}>
              {assignment.status.replace('_', ' ')}
            </Badge>
            <Badge className={priorityColors[assignment.priority]}>
              {assignment.priority}
            </Badge>
            <span className="text-wt-text-muted/70 dark:text-wt-text-muted/70 text-sm">{assignment.category}</span>
          </div>
          <h3 className="text-wt-text/95 dark:text-wt-text/95 font-medium truncate">
            {assignment.article_title}
          </h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-wt-text-muted dark:text-wt-text-muted">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {assignment.author_name}
            </span>
            <span>{assignment.word_count.toLocaleString()} words</span>
            <span>{new Date(assignment.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-wt-text-muted dark:text-wt-text-muted hover:text-wt-text/95 dark:text-wt-text/95"
            onClick={() => window.open(`/admin/articles/${assignment.article_id}/edit`, '_blank')}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-wt-text-muted dark:text-wt-text-muted hover:text-wt-text/95 dark:text-wt-text/95"
            onClick={() => window.open(`/articles/${assignment.article_slug}?preview=true`, '_blank')}
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          {assignment.status === 'pending_review' && (
            <>
              <Button
                size="sm"
                className="bg-success-600 hover:bg-success-700 text-wt-text dark:text-wt-text"
                onClick={onApprove}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowRejectModal(true)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          
          <ChevronRight className="w-4 h-4 text-wt-text-muted/70 dark:text-wt-text-muted/70" />
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-darker dark:bg-surface-darker border border-wt-border dark:border-wt-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-wt-text/95 dark:text-wt-text/95 mb-4">Reject Content</h3>
            <textarea
              className="w-full p-3 bg-muted dark:bg-muted border border-wt-border/70 dark:border-wt-border/70 rounded-lg text-wt-text/95 dark:text-wt-text/95 placeholder-gray-400"
              rows={4}
              placeholder="Provide feedback for the author..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject with Feedback
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
