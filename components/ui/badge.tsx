import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary-500 text-white hover:bg-primary-600",
                secondary:
                    "border-transparent bg-secondary-100 text-secondary-700 hover:bg-secondary-200",
                success:
                    "border-transparent bg-success-100 text-success-700 hover:bg-success-200",
                warning:
                    "border-transparent bg-accent-100 text-accent-700 hover:bg-accent-200",
                danger:
                    "border-transparent bg-danger-100 text-danger-700 hover:bg-danger-200",
                outline: 
                    "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

// Fix the export issue
export default Badge;

export { Badge, badgeVariants }
