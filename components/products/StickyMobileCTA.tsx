"use client"

import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface StickyMobileCTAProps {
  productName: string
  providerName: string
  image?: string
  rating?: number
  applyLink?: string
}

export default function StickyMobileCTA({ 
  productName, 
  providerName, 
  image, 
  rating, 
  applyLink 
}: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero (approx 500px)
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden transition-transform duration-300",
      isVisible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="flex items-center gap-3">
        {/* Tiny Image */}
        <div className="w-12 h-8 rounded bg-slate-100 flex-shrink-0 overflow-hidden relative border border-slate-200 dark:border-slate-700">
           {image ? (
               <img src={image} alt={productName} className="w-full h-full object-cover" />
           ) : (
               <div className="w-full h-full bg-slate-800 text-[8px] text-white flex items-center justify-center">CARD</div>
           )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{providerName}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{productName}</p>
        </div>

        {/* CTA */}
        <a href={applyLink || "#"} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg whitespace-nowrap">
              Apply <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
        </a>
      </div>
    </div>
  )
}
