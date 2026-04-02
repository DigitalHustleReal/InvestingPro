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
      "fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] md:hidden transition-all duration-500 ease-in-out",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
    )}>
      <div className="max-w-md mx-auto flex items-center gap-3">
        {/* Visual Anchor */}
        <div className="w-14 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden relative border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
           {image ? (
               <img src={image} alt={productName} className="w-full h-full object-cover" />
           ) : (
               <div className="w-full h-full bg-gray-900 text-[8px] text-white flex items-center justify-center font-bold">CARD</div>
           )}
        </div>

        {/* Info Stack */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider truncate mb-0.5">{providerName}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate font-heading leading-none">{productName}</p>
        </div>

        {/* Action button - High Contrast */}
        <a href={applyLink || "#"} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Button size="lg" className="h-11 bg-primary-700 hover:bg-primary-800 text-white shadow-lg shadow-primary-700/20 px-6 rounded-xl font-bold text-sm">
              Apply <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
        </a>
      </div>
    </div>
  )
}
