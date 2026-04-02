"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Bookmark, Check } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { toast } from 'sonner';

export default function SaveComparisonButton() {
  const { selectedProducts } = useCompare();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (selectedProducts.length === 0) return;

    // Logic to save to 'saved_comparisons' in localStorage
    // For now, we just simulate saving effectively by notifying the user
    // Since CompareContext already persists 'comparison-storage', this explicitly confirms the user's intent.
    // In a future update, we could move this to a 'bookmarks' key.
    
    // Simulating a "Pin/Save" action to a permanent list
    const currentSaved = localStorage.getItem('pinned-comparisons');
    let savedList = currentSaved ? JSON.parse(currentSaved) : [];
    
    // Avoid duplicates based on the exact combination of IDs
    const currentIds = selectedProducts.map(p => p.id).sort().join('-');
    const exists = savedList.some((s: any) => s.ids === currentIds);
    
    if (!exists) {
        savedList.push({
            ids: currentIds,
            products: selectedProducts,
            date: new Date().toISOString()
        });
        localStorage.setItem('pinned-comparisons', JSON.stringify(savedList));
    }

    setIsSaved(true);
    toast.success("Comparison saved for later!");
    
    // Reset icon after 2 seconds
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSave} 
        className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 text-xs font-semibold px-2"
        disabled={selectedProducts.length === 0}
    >
      {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
}
