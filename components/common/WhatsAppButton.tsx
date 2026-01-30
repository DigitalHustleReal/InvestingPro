"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';

// Simple Phone/Message Icon SVG because Lucide 'MessageCircle' is what we usually use
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const handleChat = () => {
    // Open WhatsApp Web/App with pre-filled message
    const message = encodeURIComponent("Hi InvestingPro team, I need help choosing a credit card.");
    window.open(`https://wa.me/919999999999?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-5 duration-700">
       <div className="relative group">
         <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with Experts
         </span>
         <Button 
            onClick={handleChat}
            className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-green-500/20 p-0 flex items-center justify-center transition-transform hover:scale-110"
         >
            <MessageCircle className="w-8 h-8 fill-white" />
         </Button>
         {/* Ping Badge */}
         <span className="absolute top-0 right-0 h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
         </span>
       </div>
    </div>
  );
}
