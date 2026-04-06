"use client";

import { Button } from "@/components/ui/Button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface ExportButtonProps {
  targetId: string; // ID of the element to capture (e.g., 'comparison-table')
  fileName?: string;
}

export function ExportButton({
  targetId,
  fileName = "comparison-report",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    setIsExporting(true);

    try {
      // Dynamic import heavy libraries only when user clicks export
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // Add a class to hide interactive elements during capture if needed
      element.classList.add("printing-mode");

      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true, // Handle images from other domains
        logging: false,
        backgroundColor: "#ffffff",
      });

      element.classList.remove("printing-mode");

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {isExporting ? "Generating PDF..." : "Download PDF"}
    </Button>
  );
}
