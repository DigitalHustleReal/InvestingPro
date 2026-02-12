"use client";

import React, { useState } from 'react';
import { FileText, CheckCircle2, Circle, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

interface DocumentChecklistProps {
  documents: Document[];
  productName: string;
  className?: string;
}

export default function DocumentChecklist({ documents, productName, className }: DocumentChecklistProps) {
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());

  const toggleDocument = (docId: string) => {
    const newChecked = new Set(checkedDocs);
    if (newChecked.has(docId)) {
      newChecked.delete(docId);
    } else {
      newChecked.add(docId);
    }
    setCheckedDocs(newChecked);
  };

  const progress = (checkedDocs.size / documents.length) * 100;

  return (
    <div className={cn("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="font-bold text-slate-900 dark:text-white">Required Documents</h3>
        </div>
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-600">
          {checkedDocs.size}/{documents.length} ready
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-3 mb-6">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => toggleDocument(doc.id)}
            className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
          >
            {/* Checkbox */}
            <div className="flex-shrink-0 mt-0.5">
              {checkedDocs.has(doc.id) ? (
                <CheckCircle2 className="w-5 h-5 text-success-600 dark:text-success-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className={cn(
                  "font-semibold text-sm",
                  checkedDocs.has(doc.id) 
                    ? "text-slate-500 dark:text-slate-600 line-through" 
                    : "text-slate-900 dark:text-white"
                )}>
                  {doc.name}
                </p>
                {doc.required && (
                  <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                    Required
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-600">
                {doc.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Download Checklist Button */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          // In production, this would generate a PDF
          alert('Checklist download feature coming soon!');
        }}
      >
        <Download className="w-4 h-4 mr-2" />
        Download Checklist as PDF
      </Button>

      {/* Helper Text */}
      <p className="text-xs text-slate-500 dark:text-slate-600 mt-4 text-center">
        Keep these documents ready before applying for {productName}
      </p>
    </div>
  );
}

// Default document templates
export const CREDIT_CARD_DOCUMENTS: Document[] = [
  {
    id: 'pan',
    name: 'PAN Card',
    description: 'Permanent Account Number card (mandatory for all applicants)',
    required: true
  },
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    description: 'Government-issued identity and address proof',
    required: true
  },
  {
    id: 'income',
    name: 'Income Proof',
    description: 'Last 3 months salary slips or ITR for last 2 years',
    required: true
  },
  {
    id: 'bank-statement',
    name: 'Bank Statement',
    description: 'Last 6 months bank statement showing salary credits',
    required: true
  },
  {
    id: 'address',
    name: 'Address Proof',
    description: 'Utility bill, rent agreement, or passport (if different from Aadhaar)',
    required: false
  },
  {
    id: 'photo',
    name: 'Passport-size Photographs',
    description: '2 recent passport-size photographs',
    required: false
  }
];

export const LOAN_DOCUMENTS: Document[] = [
  {
    id: 'pan',
    name: 'PAN Card',
    description: 'Permanent Account Number card',
    required: true
  },
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    description: 'Government-issued identity proof',
    required: true
  },
  {
    id: 'income',
    name: 'Income Proof',
    description: 'Salary slips (6 months) or ITR (2 years) for self-employed',
    required: true
  },
  {
    id: 'bank-statement',
    name: 'Bank Statement',
    description: 'Last 6 months bank statement',
    required: true
  },
  {
    id: 'employment',
    name: 'Employment Proof',
    description: 'Employment letter or business registration certificate',
    required: true
  },
  {
    id: 'property',
    name: 'Property Documents',
    description: 'For secured loans: property papers, valuation report',
    required: false
  }
];
