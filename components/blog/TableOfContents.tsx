'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, List, X } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export default function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Extract headings from article
    const article = document.querySelector('article')
    if (!article) return

    const headings = article.querySelectorAll('h2, h3')
    const items: TOCItem[] = []

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName[1])
      const text = heading.textContent || ''
      let id = heading.id

      if (!id) {
        id = `heading-${index}`
        heading.id = id
      }

      items.push({ id, text, level })
    })

    setToc(items)

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (toc.length === 0) return null

  return (
    <>
      {/* Desktop Floating TOC */}
      <div className={`hidden lg:block ${className}`}>
        <div className="sticky top-24 animate-fadeIn">
          {/* Glassmorphism Card */}
          <div className="relative group">
            {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-500 animate-gradient-x"></div>
            
            {/* Main Card */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-primary-100/50 shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-primary-50 to-white px-6 py-4 border-b border-primary-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500 rounded-lg shadow-lg shadow-primary-500/20 animate-pulse-slow">
                    <List className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Table of Contents</h3>
                </div>
              </div>

              {/* TOC Items */}
              <nav className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                <ul className="space-y-1">
                  {toc.map((item, index) => (
                    <li
                      key={item.id}
                      className={`transform transition-all duration-300 ${
                        activeId === item.id ? 'translate-x-2' : ''
                      }`}
                      style={{
                        paddingLeft: `${(item.level - 2) * 1}rem`,
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`group/item w-full text-left px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                          activeId === item.id
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20 scale-105'
                            : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700 hover:translate-x-1'
                        }`}
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-300 ${
                            activeId === item.id ? 'rotate-90' : 'group-hover/item:translate-x-1'
                          }`}
                        />
                        <span className={`text-sm ${item.level === 3 ? 'font-normal' : 'font-semibold'} line-clamp-2`}>
                          {item.text}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Progress indicator */}
              <div className="h-1 bg-gray-100">
                <div
                  className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-300"
                  style={{
                    width: `${((toc.findIndex(item => item.id === activeId) + 1) / toc.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        {!isVisible && (
          <button
            onClick={() => setIsVisible(true)}
            className="group relative p-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110 animate-bounce-slow"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300 animate-pulse"></div>
            <List className="w-6 h-6 relative z-10" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full"></span>
          </button>
        )}

        {/* Mobile Modal */}
        {isVisible && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slideUp max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <List className="w-6 h-6 text-white" />
                  <h3 className="font-bold text-white text-lg">Table of Contents</h3>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* TOC Items */}
              <nav className="p-4 overflow-y-auto max-h-[calc(80vh-80px)] custom-scrollbar">
                <ul className="space-y-2">
                  {toc.map((item) => (
                    <li
                      key={item.id}
                      style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
                    >
                      <button
                        onClick={() => {
                          scrollToSection(item.id)
                          setIsVisible(false)
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                          activeId === item.id
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-primary-50 active:scale-95'
                        }`}
                      >
                        <ChevronRight
                          className={`w-5 h-5 transition-transform ${
                            activeId === item.id ? 'rotate-90' : ''
                          }`}
                        />
                        <span className={`${item.level === 3 ? 'font-normal text-sm' : 'font-semibold'}`}>
                          {item.text}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #0d9488, #0f766e);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0f766e, #115e59);
        }
      `}</style>
    </>
  )
}
