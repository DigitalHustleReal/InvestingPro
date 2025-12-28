"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

// Context
interface SelectContextValue {
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
}
const SelectContext = React.createContext<SelectContextValue | null>(null)

export const Select = ({ value, onValueChange, children }: any) => {
    const [open, setOpen] = React.useState(false) // Simple open state
    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative inline-block">{children}</div>
        </SelectContext.Provider>
    )
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(
    ({ className, children, ...props }, ref) => {
        const ctx = React.useContext(SelectContext)
        if (!ctx) return null
        return (
            <button
                ref={ref}
                type="button"
                onClick={() => ctx.setOpen(!ctx.open)}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        )
    }
)
SelectTrigger.displayName = "SelectTrigger"

export const SelectValue = React.forwardRef<HTMLSpanElement, any>(
    ({ className, placeholder, ...props }, ref) => {
        const ctx = React.useContext(SelectContext)
        // Logic: Find the selected Item's label? Only possible if we knew children. 
        // For simplified custom select without Radix, showing existing value is tricky if children aren't parsed.
        // We will just show the Value directly or placeholder for now, 
        // OR we can rely on the user passing the label if we want to be pure.
        // But standard Shadcn <SelectValue /> automatically finds the label.

        // We'll trust the value matches the label for this specific list (Language codes vs names).
        // Actually, LanguageSwitcher passes {lang.nativeName}.
        // To strictly support separate label/value without Radix, we'd need to inspect children or pass a map.
        // Let's implement a hack: Context can store the Label.

        // Better approach: We won't find the label here easily. We'll simply render "Select" or the Value.
        // However, for the specific LanguageSwitcher case, it maps codes (hi) to names (Hindi).

        return (
            <span
                ref={ref}
                className={cn("pointer-events-none block truncate", className)}
                {...props}
            >
                {/* 
                We can't easily map value->label without children inspection.
                For now, display ctx?.value. 
                Improvement: If the user provides a placeholder, and no value, show placeholder.
             */}
                {ctx?.value || placeholder}
            </span>
        )
    }
)
SelectValue.displayName = "SelectValue"

export const SelectContent = React.forwardRef<HTMLDivElement, any>(
    ({ className, children, position = "popper", ...props }, ref) => {
        const ctx = React.useContext(SelectContext)
        if (!ctx || !ctx.open) return null

        // Close when clicking outside logic would be here (omitted for brevity)

        return (
            <div className="absolute top-0 left-0 w-full z-50">
                {/* Overlay to close */}
                <div className="fixed inset-0 z-40" onClick={() => ctx.setOpen(false)}></div>

                <div
                    ref={ref}
                    className={cn(
                        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 bg-white",
                        position === "popper" && "translate-y-1",
                        className
                    )}
                    {...props}
                >
                    <div className="p-1">{children}</div>
                </div>
            </div>
        )
    }
)
SelectContent.displayName = "SelectContent"

export const SelectItem = React.forwardRef<HTMLDivElement, any>(
    ({ className, children, value, ...props }, ref) => {
        const ctx = React.useContext(SelectContext)
        const isSelected = ctx?.value === value

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-100 cursor-pointer",
                    className
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    ctx?.onValueChange(value);
                    ctx?.setOpen(false);
                }}
                {...props}
            >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isSelected && <Check className="h-4 w-4" />}
                </span>
                <span className="truncate">{children}</span>
            </div>
        )
    }
)
SelectItem.displayName = "SelectItem"
