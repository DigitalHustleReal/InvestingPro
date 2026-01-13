"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
  disabled?: boolean
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(checked ?? false)
    const isChecked = checked !== undefined ? checked : internalChecked

    const handleChange = () => {
      if (disabled) return
      const newChecked = !isChecked
      if (checked === undefined) {
        setInternalChecked(newChecked)
      }
      onCheckedChange?.(newChecked)
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleChange}
        disabled={disabled}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-primary-600" : "bg-slate-200",
          className
        )}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
            isChecked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }

