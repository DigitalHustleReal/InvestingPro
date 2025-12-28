"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const NavigationMenu = ({ children }: { children: React.ReactNode }) => {
    return <div className="relative z-10 flex max-w-max flex-1 items-center justify-center">{children}</div>
}

const NavigationMenuList = ({ children }: { children: React.ReactNode }) => {
    return <div className="group flex flex-1 list-none items-center justify-center space-x-1">{children}</div>
}

const NavigationMenuItem = ({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => {
    return <div className={cn("relative group/item", className)} {...props}>{children}</div>
}

const NavigationMenuTrigger = ({ 
    children, 
    className,
    onClick,
    onMouseEnter,
    ...props 
}: { 
    children: React.ReactNode
    className?: string
    onClick?: () => void
    onMouseEnter?: () => void
    [key: string]: any
}) => {
    return (
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            className={cn(
                "relative inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded disabled:pointer-events-none disabled:opacity-50",
                "border-b-2 border-transparent hover:border-teal-600",
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}

const NavigationMenuContent = ({ 
    children, 
    isOpen,
    className,
    onMouseEnter,
    onMouseLeave,
    ...props
}: { 
    children: React.ReactNode
    isOpen?: boolean
    className?: string
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    [key: string]: any
}) => {
    return (
        <div 
            className={cn(
                "absolute top-full left-0 w-auto p-2 transition-all duration-200 transform origin-top-left -mt-1 pt-2",
                // Only show if explicitly open via state, not via group-hover (to prevent multiple dropdowns)
                isOpen 
                    ? "opacity-100 visible z-50" 
                    : "opacity-0 invisible pointer-events-none",
                className
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...props}
        >
            <div className="rounded-md border bg-popover text-popover-foreground shadow-md bg-white">
                {children}
            </div>
        </div>
    )
}

// Helper to keep the imports happy
const NavigationMenuLink = ({ className, ...props }: any) => (
    <a className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)} {...props} />
)

export {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
}
