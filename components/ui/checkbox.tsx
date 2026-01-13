"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        return (
            <label className={cn(
                "relative inline-flex items-center justify-center w-5 h-5 rounded border-2 border-slate-300 cursor-pointer transition-colors",
                checked && "bg-primary-600 border-primary-600",
                !checked && "bg-white dark:bg-slate-800 hover:border-primary-400",
                className
            )}>
                <input
                    type="checkbox"
                    ref={ref}
                    checked={checked}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    className="sr-only"
                    {...props}
                />
                {checked && (
                    <Check className="w-3 h-3 text-white" />
                )}
            </label>
        );
    }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };

