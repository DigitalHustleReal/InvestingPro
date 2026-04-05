"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileSpreadsheet,
  Download,
  Mail,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface LeadMagnetProps {
  title: string;
  description: string;
  downloadUrl: string;
  type: "excel" | "pdf" | "google-sheet";
}

export default function LeadMagnet({
  title,
  description,
  downloadUrl,
  type,
}: LeadMagnetProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      const supabase = createClient();

      // Insert lead into DB
      const { error } = await supabase.from("leads").insert([
        {
          email,
          resource_id: title.toLowerCase().replace(/\s+/g, "-"),
          resource_title: title,
          source_url: typeof window !== "undefined" ? window.location.href : "",
          user_metadata: { type },
        },
      ]);

      if (error) {
        // Handle duplicate (23505) gracefully
        if (error.code === "23505") {
          toast.info(
            "You've already requested this resource! Sending it again.",
          );
        } else {
          throw error;
        }
      }

      setIsSubmitted(true);
      toast.success("Check your email for the download link!");

      // Simulating auto-download for better UX
      if (downloadUrl && downloadUrl !== "#") {
        window.open(downloadUrl, "_blank");
      }
    } catch (err) {
      console.error("Lead Capture Error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const typeIcons = {
    excel: <FileSpreadsheet className="w-12 h-12 text-success-600" />,
    pdf: <Download className="w-12 h-12 text-danger-600" />,
    "google-sheet": <FileSpreadsheet className="w-12 h-12 text-primary-600" />,
  };

  return (
    <Card className="my-10 overflow-hidden border-2 border-primary-500/20 bg-gradient-to-br from-white to-gray-50 relative">
      <div className="absolute top-4 right-4 text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded uppercase tracking-widest">
        Free Download
      </div>

      <div className="flex flex-col md:flex-row items-center p-8 gap-8">
        <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0">
          {typeIcons[type]}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>

          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <Input
                  type="email"
                  placeholder="Enter your email to download"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 h-11 px-8 font-bold"
              >
                Get It Now
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-success-600 font-bold bg-success-50 p-3 rounded-lg border border-success-100">
              <CheckCircle2 className="w-5 h-5" />
              Success! Your download should start automatically.
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 text-[10px] text-gray-600">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Spam-free guaranteed
            </span>
            <span>•</span>
            <span>Free expert insights</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
