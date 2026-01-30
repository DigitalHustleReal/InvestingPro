"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Bell, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WhatsAppAlertsProps {
  productName?: string;
  trigger?: React.ReactNode;
}

export default function WhatsAppAlerts({ productName, trigger }: WhatsAppAlertsProps) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid WhatsApp number");
      return;
    }

    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubscribed(true);
    setLoading(false);
    toast.success("Subscribed to WhatsApp alerts!");

    // Redirect to WhatsApp with a pre-filled message (optional, but good for engagement)
    const message = encodeURIComponent(`Hi InvestingPro! I want to receive alerts for ${productName || 'financial products'}. My number is ${phone}.`);
    const whatsappUrl = `https://wa.me/919999999999?text=${message}`; // Replace with actual support number
    
    // In a real app, you might not redirect immediately if you just want to collect the lead
    // window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger || (
          <Button variant="outline" className="gap-2 border-success-600 text-success-600 hover:bg-success-50 rounded-xl font-bold">
            <MessageCircle size={18} />
            Get WhatsApp Alerts
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
          <div className="bg-success-600 p-8 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <MessageCircle size={28} />
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                ))}
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              Instant Updates <br />on WhatsApp
            </h2>
            <p className="text-success-100 text-xs font-bold mt-2 uppercase tracking-widest">
              Join 50,000+ Smart Investors
            </p>
          </div>

          {!subscribed ? (
            <div className="p-8 space-y-6">
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Be the first to know about interest rate changes, new card launches, and exclusive offers for 
                <span className="font-bold text-slate-900 dark:text-white"> {productName || 'top financial products'}</span>.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-phone" className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">WhatsApp Number</Label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">+91</span>
                    <Input
                      id="whatsapp-phone"
                      type="tel"
                      placeholder="9876543210"
                      className="pl-14 h-14 bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-success-500 font-bold text-lg transition-all"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-success-600 hover:bg-success-700 text-white font-black rounded-xl shadow-xl shadow-success-500/20 transition-all hover:-translate-y-1"
                >
                  {loading ? "Activating Alerts..." : "Start Receiving Alerts"}
                </Button>
              </form>

              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200" />
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  <span className="text-success-600">4.9/5</span> Rated by Active Users
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center animate-in zoom-in-95 duration-500">
              <div className="mx-auto w-20 h-20 bg-success-50 dark:bg-success-900/20 rounded-full flex items-center justify-center text-success-600 mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 underline decoration-success-500 decoration-4 underline-offset-4">
                You're In!
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                We've activated your WhatsApp alerts for <span className="font-bold text-slate-900 dark:text-white">{productName || 'financial products'}</span>. 
                Expect high-value updates twice a week. No Spam. Guaranteed.
              </p>
              <Button 
                onClick={() => setOpen(false)}
                className="w-full h-14 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-xl"
              >
                Return to Dashboard
              </Button>
            </div>
          )}

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-6">
            <div className="flex items-center gap-1.5 opacity-60">
              <ShieldCheck size={12} className="text-success-600" />
              <span className="text-[10px] font-bold uppercase text-slate-500">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
              <Sparkles size={12} className="text-primary-600" />
              <span className="text-[10px] font-bold uppercase text-slate-500">Opt-out Anytime</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
