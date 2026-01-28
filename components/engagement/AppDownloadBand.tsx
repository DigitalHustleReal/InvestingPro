import React from 'react';
import { Smartphone, Apple, PlayCircle, Star, ShieldCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AppDownloadBand() {
  return (
    <div className="w-full bg-slate-900 overflow-hidden relative group">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(20,184,166,0.15),transparent)] opacity-70" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left: Value Prop */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary-500/20 rounded-2xl blur-xl group-hover:bg-primary-500/30 transition-all" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center relative shadow-2xl border border-white/10">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl font-black text-white font-heading tracking-tight mb-1">
                Take InvestingPro Everywhere
              </h4>
              <p className="text-slate-400 text-sm md:text-base font-medium">
                Get real-time alerts, compare cards on the go, and track your portfolio.
              </p>
            </div>
          </div>

          {/* Center: Social Proof */}
          <div className="hidden xl:flex items-center gap-8 border-x border-white/5 px-8">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-white font-bold text-sm leading-none">4.9 / 5.0</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">App Store</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm leading-none">50K+</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Downloads</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-12 px-6 gap-3 group">
              <Apple className="w-5 h-5" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-black leading-none opacity-50">Download on the</p>
                <p className="text-sm font-bold leading-none mt-1">App Store</p>
              </div>
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl h-12 px-6 gap-3">
              <PlayCircle className="w-5 h-5" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-black leading-none opacity-50">Get it on</p>
                <p className="text-sm font-bold leading-none mt-1">Google Play</p>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle border top to separate from footer content */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
