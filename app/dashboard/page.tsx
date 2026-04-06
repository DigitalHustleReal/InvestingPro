"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/hooks/useProfile";
import SavedProducts from "@/components/dashboard/SavedProducts";
import AppTracker from "@/components/dashboard/AppTracker";
import dynamic from "next/dynamic";
const MarketOverview = dynamic(
  () => import("@/components/market/MarketOverview"),
  { ssr: false },
);
import PersonalizedPicks from "@/components/products/PersonalizedPicks";
import WhatsAppAlerts from "@/components/common/WhatsAppAlerts";
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  Target,
  Bell,
  Settings,
  LogOut,
  Plus,
  CreditCard,
  Landmark,
  ArrowUpRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function WealthDashboard() {
  const { user, loading: profileLoading } = useProfile();
  const [activeTab, setActiveTab] = useState("overview");

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const income = user?.profile_data?.income || 0;
  const creditScore = user?.profile_data?.creditScore || 750;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Profile Info */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              {user?.full_name ? (
                <span className="text-2xl font-black">{user.full_name[0]}</span>
              ) : (
                <Wallet size={28} />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Namaste, {user?.full_name?.split(" ")[0] || "Investor"}!
              </h1>
              <p className="text-gray-500 dark:text-gray-600 font-medium flex items-center gap-2 mt-1">
                <ShieldCheck size={14} className="text-success-600" />
                {income
                  ? `Profile Level: Silver (₹${(income / 100000).toFixed(1)}L/yr)`
                  : "Complete your profile for better insights"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-gray-200 dark:border-gray-800"
            >
              <Bell size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-gray-200 dark:border-gray-800"
            >
              <Settings size={18} />
            </Button>
            <Button className="bg-gray-900 dark:bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl px-6">
              Contact Expert
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: "overview", label: "Dashboard Overview", icon: Wallet },
              { id: "saved", label: "Saved Products", icon: Target },
              {
                id: "applications",
                label: "My Applications",
                icon: ArrowUpRight,
              },
              {
                id: "recommendations",
                label: "Personalized Picks",
                icon: TrendingUp,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all text-sm",
                  activeTab === tab.id
                    ? "bg-primary-600 text-white shadow-xl shadow-primary-500/20"
                    : "text-gray-500 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900",
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
              <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-gray-600 hover:text-danger-500 transition-all text-sm">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-none bg-gradient-to-br from-primary-700 to-primary-500 text-white shadow-xl shadow-primary-500/20">
                    <CardContent className="p-6">
                      <p className="text-xs font-bold uppercase opacity-80 mb-1">
                        Credit Score
                      </p>
                      <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black">{creditScore}</h3>
                        <span className="text-xs font-bold mb-1 opacity-90">
                          Excellent
                        </span>
                      </div>
                      <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full"
                          style={{ width: `${(creditScore / 900) * 100}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-white dark:bg-gray-900 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-1">
                        <p className="text-xs font-bold uppercase text-gray-600">
                          Monthly Potential
                        </p>
                        <TrendingUp size={14} className="text-primary-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        ₹4,250
                      </h3>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">
                        Extra savings with top-tier cards
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-white dark:bg-gray-900 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-1">
                        <p className="text-xs font-bold uppercase text-gray-600">
                          Applications
                        </p>
                        <ArrowUpRight size={14} className="text-primary-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        02
                      </h3>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">
                        Pending verification
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest">
                        Saved Products
                      </h4>
                      <button
                        onClick={() => setActiveTab("saved")}
                        className="text-[10px] font-bold text-primary-600"
                      >
                        View All
                      </button>
                    </div>
                    <SavedProducts />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest">
                        Active Applications
                      </h4>
                      <button
                        onClick={() => setActiveTab("applications")}
                        className="text-[10px] font-bold text-primary-600"
                      >
                        View All
                      </button>
                    </div>
                    <AppTracker />
                  </div>
                </div>

                {/* Market Overview Tier */}
                <MarketOverview />
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <header className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    Your Shortlist
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl font-bold"
                    >
                      Compare All
                    </Button>
                  </div>
                </header>
                <SavedProducts />
              </div>
            )}

            {activeTab === "applications" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  Application Status
                </h2>
                <AppTracker />
              </div>
            )}

            {activeTab === "recommendations" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <header>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    Smart Recommendations
                  </h2>
                  <p className="text-gray-500 dark:text-gray-600 font-medium">
                    Top products matched to your financial profile.
                  </p>
                </header>
                <PersonalizedPicks />

                {/* Referral Section - NEW */}
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Plus size={120} className="rotate-45" />
                  </div>
                  <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                      <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                        <Plus className="text-primary-500" /> Refer & Earn ₹500
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Love InvestingPro? Refer a friend to any credit card or
                        loan through our platform and both of you get ₹500
                        Amazon Vouchers upon approval.
                      </p>
                    </div>
                    <Button className="bg-primary-600 hover:bg-primary-700 text-white font-black rounded-xl px-10 h-14 whitespace-nowrap shadow-xl shadow-primary-500/20">
                      Invite Friend
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Floating WhatsApp CTA */}
        <div className="fixed bottom-10 right-10 z-30">
          <WhatsAppAlerts
            trigger={
              <button className="flex items-center gap-3 bg-success-600 hover:bg-success-700 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-success-500/20 transition-all hover:-translate-y-1">
                <MessageCircle size={24} />
                <div className="text-left">
                  <p className="text-[10px] font-bold opacity-80 leading-none">
                    WhatsApp Support
                  </p>
                  <p className="text-sm font-black">Expert Help</p>
                </div>
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
