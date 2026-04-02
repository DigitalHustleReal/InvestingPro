"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

import { Slot } from "@radix-ui/react-slot"

interface DialogContextValue {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

export function Dialog({
    children,
    open,
    onOpenChange,
}: {
    children: React.ReactNode
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            {children}
        </DialogContext.Provider>
    )
}

export function DialogTrigger({
    children,
    asChild,
}: {
    children: React.ReactNode
    asChild?: boolean
}) {
    const ctx = React.useContext(DialogContext)
    if (!ctx) return null

    const Comp = asChild ? Slot : "button"

    return (
        <Comp onClick={() => ctx.onOpenChange(true)}>
            {children}
        </Comp>
    )
}

export function DialogContent({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    const ctx = React.useContext(DialogContext)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!ctx || !ctx.open) return null

    const content = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                onClick={() => ctx.onOpenChange(false)}
            />
            <div
                className={cn(
                    "relative z-[101] w-full max-w-lg rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl dark:border dark:border-gray-800",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => ctx.onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </div>
    )

    if (typeof window !== 'undefined' && mounted) {
        return createPortal(content, document.body)
    }

    return content
}

export function DialogHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-col space-y-1.5 text-center sm:text-left",
                className
            )}
            {...props}
        />
    )
}

export function DialogFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
                className
            )}
            {...props}
        />
    )
}

export function DialogTitle({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn(
                "text-lg font-semibold leading-none tracking-tight",
                className
            )}
            {...props}
        />
    )
}

export function DialogDescription({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("text-sm text-gray-600", className)}
            {...props}
        />
    )
}
