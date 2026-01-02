import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg active:shadow-sm",
                gradient: "bg-gradient-to-r from-primary-600 to-emerald-600 text-white hover:from-primary-700 hover:to-emerald-700 shadow-lg hover:shadow-primary-lg",
                destructive: "bg-danger-500 text-white hover:bg-danger-700 shadow-md hover:shadow-lg",
                outline: "border-2 border-primary-600 bg-white text-primary-600 hover:bg-primary-50",
                secondary: "bg-accent-500 text-white hover:bg-accent-600 shadow-md hover:shadow-accent",
                ghost: "text-stone-700 hover:bg-stone-100",
                link: "text-primary-600 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2",      // 44px (minimum tap target)
                sm: "h-10 px-4 py-2",           // 40px (secondary actions)
                lg: "h-14 px-8 py-3",           // 56px (hero CTAs)
                icon: "h-11 w-11",              // 44px square (icons only)
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
