"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
    value?: string
    onValueChange?: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue>({})

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: "single" | "multiple"
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    collapsible?: boolean
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
    ({ className, type = "single", value, defaultValue, onValueChange, collapsible = false, ...props }, ref) => {
        const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)
        const currentValue = value !== undefined ? value : internalValue

        const handleValueChange = (newValue: string) => {
            if (type === "single") {
                if (collapsible && currentValue === newValue) {
                    onValueChange?.("")
                    if (value === undefined) setInternalValue("")
                } else {
                    onValueChange?.(newValue)
                    if (value === undefined) setInternalValue(newValue)
                }
            }
        }

        return (
            <AccordionContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
                <div ref={ref} className={cn("", className)} {...props} />
            </AccordionContext.Provider>
        )
    }
)
Accordion.displayName = "Accordion"

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
    ({ className, value, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("", className)}
                {...props}
            />
        )
    }
)
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
    ({ className, children, ...props }, ref) => {
        const context = React.useContext(AccordionContext)
        const itemContext = React.useContext(AccordionItemContext)
        const isOpen = context.value === itemContext.value

        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                onClick={() => context.onValueChange?.(itemContext.value)}
                {...props}
                data-state={isOpen ? "open" : "closed"}
            >
                {children}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0 transition-transform duration-200"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
        )
    }
)
AccordionTrigger.displayName = "AccordionTrigger"

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
    ({ className, children, ...props }, ref) => {
        const context = React.useContext(AccordionContext)
        const itemContext = React.useContext(AccordionItemContext)
        const isOpen = context.value === itemContext.value

        if (!isOpen) return null

        return (
            <div
                ref={ref}
                className={cn(
                    "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                    className
                )}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
            </div>
        )
    }
)
AccordionContent.displayName = "AccordionContent"

interface AccordionItemContextValue {
    value: string
}

const AccordionItemContext = React.createContext<AccordionItemContextValue>({ value: "" })

// Update AccordionItem to provide context
const AccordionItemWithContext = React.forwardRef<HTMLDivElement, AccordionItemProps>(
    ({ className, value, children, ...props }, ref) => {
        return (
            <AccordionItemContext.Provider value={{ value }}>
                <div
                    ref={ref}
                    className={cn("border-b border-gray-200", className)}
                    {...props}
                >
                    {children}
                </div>
            </AccordionItemContext.Provider>
        )
    }
)
AccordionItemWithContext.displayName = "AccordionItem"

export { Accordion, AccordionTrigger, AccordionContent }
export { AccordionItemWithContext as AccordionItem }

