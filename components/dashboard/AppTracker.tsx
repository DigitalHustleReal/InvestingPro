"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ApplicationStatus {
  id: string;
  productName: string;
  provider: string;
  status: 'applied' | 'under_review' | 'approved' | 'dispatched' | 'action_required';
  updatedAt: string;
}

const STATUS_CONFIG = {
  applied: { label: 'Application Received', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  under_review: { label: 'Under Review', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  dispatched: { label: 'Card Dispatched', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/40' },
  action_required: { label: 'Action Required', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' }
};

const STEPS = ['applied', 'under_review', 'approved', 'dispatched'];

export default function AppTracker() {
  // Mock data for now
  const applications: ApplicationStatus[] = [
    {
      id: 'app-1',
      productName: 'HDFC Regalia Gold',
      provider: 'HDFC Bank',
      status: 'under_review',
      updatedAt: '2026-01-28T10:00:00Z'
    },
    {
      id: 'app-2',
      productName: 'SBI Cashback Card',
      provider: 'SBI Card',
      status: 'applied',
      updatedAt: '2026-01-29T14:30:00Z'
    }
  ];

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id} className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl", STATUS_CONFIG[app.status].bg)}>
                  {React.createElement(STATUS_CONFIG[app.status].icon, { 
                    className: cn("w-6 h-6", STATUS_CONFIG[app.status].color) 
                  })}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{app.productName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{app.provider}</p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="flex-grow max-w-md">
                <div className="relative flex justify-between">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
                  {STEPS.map((step, idx) => {
                    const isCompleted = STEPS.indexOf(app.status) >= idx;
                    const isCurrent = app.status === step;
                    
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full transition-all duration-500",
                          isCompleted ? "bg-primary-600 scale-125" : "bg-slate-200 dark:bg-slate-700"
                        )} />
                        <span className={cn(
                          "text-[8px] font-bold uppercase mt-2 tracking-tighter",
                          isCurrent ? "text-primary-600" : "text-slate-400"
                        )}>
                          {step.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center">
                  Track on Bank Site <ExternalLink size={12} className="ml-1" />
                </button>
              </div>
            </div>

            {app.status === 'under_review' && (
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  The bank is currently verifying your documents. This usually takes <span className="font-bold">2-3 business days</span>. 
                  We'll notify you on WhatsApp once there's an update.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
