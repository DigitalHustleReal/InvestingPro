"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ComparisonPDFButtonProps {
    targetId: string;
    productNames: string[];
}

export default function ComparisonPDFButton({ targetId, productNames }: ComparisonPDFButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async () => {
        setIsGenerating(true);
        const toastId = toast.loading("Preparing your comparison report...");

        try {
            // Dynamically import to keep bundle size small
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');

            const element = document.getElementById(targetId);
            if (!element) {
                toast.error("Could not find the comparison table");
                return;
            }

            // Capture the element
            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            
            const fileName = `Comparison-${productNames.join('-vs-')}.pdf`;
            pdf.save(fileName);

            toast.success("Comparison downloaded successfully!", { id: toastId });
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Failed to generate PDF. Please try again.", { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button 
            onClick={generatePDF} 
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2 border-teal-500 text-teal-600 hover:bg-teal-50"
        >
            {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <FileDown className="w-4 h-4" />
            )}
            {isGenerating ? "Generating..." : "Download Report (PDF)"}
        </Button>
    );
}
