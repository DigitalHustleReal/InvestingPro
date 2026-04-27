"use client";

// PWAInstallButton — captures Chrome/Edge `beforeinstallprompt` event and
// renders an "Add to Home Screen" button when the site becomes installable.
//
// Renders three states honestly (no fake "Coming soon" messaging that lies):
//
//   1. Already installed (running in standalone display-mode):
//        ✓ Installed on this device
//
//   2. Installable (browser fired beforeinstallprompt):
//        [Add to Home Screen →] button — clicking triggers the native prompt
//
//   3. Not installable yet (manifest+SW criteria not met OR mobile Safari):
//        Add via your browser menu — small instructional text
//
// On install completion (`appinstalled` event), state flips to (1).

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PWAInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    // Detect if already running in standalone (PWA was installed).
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setInstalled(true);
      return;
    }

    const beforeInstall = (e: Event) => {
      // Prevent the default mini-infobar on Chrome mobile.
      e.preventDefault();
      setInstallPrompt(e as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };

  // Avoid hydration mismatch — render placeholder text on server.
  if (!hydrated) {
    return (
      <span className="font-mono text-[11px] uppercase tracking-wider text-canvas-70">
        Add via your browser menu
      </span>
    );
  }

  if (installed) {
    return (
      <span className="font-mono text-[11px] uppercase tracking-wider text-action-green">
        ✓ Installed on this device
      </span>
    );
  }

  if (!installPrompt) {
    // Browser hasn't fired beforeinstallprompt yet (or never will — iOS Safari).
    // Don't lie with "Coming soon" — explain how to install via browser UI.
    return (
      <span className="font-mono text-[11px] uppercase tracking-wider text-canvas-70 leading-relaxed">
        Add via your browser menu →{" "}
        <span className="text-canvas">Share → Add to Home Screen</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="inline-flex items-center gap-2 bg-indian-gold text-ink font-mono text-[11px] uppercase tracking-wider font-bold px-5 py-2.5 rounded-sm hover:bg-canvas transition-colors"
    >
      Add to home screen →
    </button>
  );
}
