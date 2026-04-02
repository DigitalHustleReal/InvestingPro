"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const SheetContext = React.createContext<{
    open?: boolean
    onOpenChange?: (open: boolean) => void
}>({})

const Sheet = ({
    children,
    open,
    onOpenChange,
}: {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) => {
    return (
        <SheetContext.Provider value={{ open, onOpenChange }}>
            {children}
        </SheetContext.Provider>
    )
}

const SheetTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, children, onClick, ...props }, ref) => {
    const { onOpenChange, open } = React.useContext(SheetContext)
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        onOpenChange?.(!open)
    }

    const Comp = asChild ? Slot : "button"
    
    return (
        <Comp ref={ref} onClick={handleClick} {...props}>
            {children}
        </Comp>
    )
})
SheetTrigger.displayName = "SheetTrigger"

const SheetContent = ({
    children,
    className,
    side = "right",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { side?: "left" | "right" | "top" | "bottom" }) => {
    const { open, onOpenChange } = React.useContext(SheetContext)
    const [mounted, setMounted] = React.useState(false)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const previousActiveElement = React.useRef<HTMLElement | null>(null)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Focus trap: Save previous focus and trap focus within sheet
    React.useEffect(() => {
        if (!open) return

        // Save current focus
        previousActiveElement.current = document.activeElement as HTMLElement

        // Focus first focusable element in sheet
        const focusableElements = contentRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements?.[0] as HTMLElement
        firstElement?.focus()

        // Handle Escape key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenChange?.(false)
            }
        }

        // Handle Tab key to trap focus
        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab' || !contentRef.current) return

            const focusableElements = Array.from(
                contentRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            ) as HTMLElement[]

            if (focusableElements.length === 0) return

            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement.focus()
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement.focus()
                }
            }
        }

        document.addEventListener('keydown', handleEscape)
        document.addEventListener('keydown', handleTab)

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.removeEventListener('keydown', handleTab)
            // Restore previous focus
            previousActiveElement.current?.focus()
        }
    }, [open, onOpenChange])

    if (!open || !mounted) return null

    const content = (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[100] bg-black/80"
                onClick={() => onOpenChange?.(false)}
            />
            {/* Content */}
            <div
                ref={contentRef}
                className={cn(
                    "fixed z-[101] bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out dark:border-l dark:border-gray-800",
                    side === "right" && "inset-y-0 right-0 h-full w-3/4 sm:w-96 border-l border-gray-200",
                    className
                )}
                style={{
                    transform: open ? 'translateX(0)' : 'translateX(100%)',
                }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                {...props}
            >
                <button
                    className="absolute right-4 top-4 z-10 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 p-2"
                    onClick={() => onOpenChange?.(false)}
                    aria-label="Close menu"
                >
                    <X className="h-5 w-5 text-gray-700" />
                </button>
                {children}
            </div>
        </>
    )

    if (typeof window !== 'undefined') {
        return createPortal(content, document.body)
    }

    return content
}

export { Sheet, SheetTrigger, SheetContent }
