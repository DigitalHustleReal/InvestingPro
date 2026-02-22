import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "bg-primary text-white hover:bg-primary-hover active:scale-95 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-out",
                secondary: "bg-secondary text-white hover:bg-secondary-hover active:scale-95 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-out",
                gradient: "bg-gradient-to-r from-primary-600 to-primary-800 text-white hover:from-primary-700 hover:to-primary-900 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ease-out",
                destructive: "bg-error text-white hover:bg-error-dark shadow-sm hover:shadow-md",
                outline: "border-2 border-primary bg-white dark:bg-background-secondary text-primary hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-300",
                success: "bg-success text-white hover:bg-success-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95",
                ghost: "text-text-secondary hover:bg-surface active:scale-95 transition-all duration-200",
                link: "text-secondary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-6 py-2",      // 40px (balanced)
                sm: "h-11 px-4 py-2",           // 44px (meets mobile tap target minimum)
                lg: "h-12 px-8 py-3",           // 48px (hero CTAs)
                icon: "h-10 w-10",              // 40px square
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
    loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
        if (asChild) {
            return (
                <Slot
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    disabled={loading || disabled}
                    {...props}
                >
                    {children}
                </Slot>
            )
        }

        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={loading || disabled}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
