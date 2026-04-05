"use client";

import { useEffect } from "react";
import { initSentry } from "@/lib/monitoring/sentry";

export default function SentryInit() {
  useEffect(() => {
    initSentry();
  }, []);

  return null;
}
