import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, required, ...props }, ref) => {
    const inputId = props.id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="space-y-1.5">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-200"
          >
            {label}
            {required && (
              <span className="text-rose-400 ml-1" aria-label="required">*</span>
            )}
          </label>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            // Base styles
            "w-full px-3 py-2 rounded-lg",
            "text-sm font-inter",
            "text-slate-200",
            "bg-slate-900/50 backdrop-blur-sm",
            "border transition-all duration-200",
            
            // Normal state
            !error && [
              "border-white/10",
              "focus:border-blue-500/50",
              "focus:ring-2 focus:ring-blue-500/20",
              "focus:bg-slate-900/70",
            ],
            
            // Error state
            error && [
              "border-rose-500/50",
              "focus:border-rose-500",
              "focus:ring-2 focus:ring-rose-500/20",
              "bg-rose-500/5",
            ],
            
            // Disabled state
            props.disabled && [
              "bg-slate-800/50",
              "text-slate-600",
              "cursor-not-allowed",
              "opacity-60",
            ],
            
            // Placeholder
            "placeholder:text-slate-500",
            
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {/* Helper text or error */}
        {(helperText || error) && (
          <p 
            id={error ? `${inputId}-error` : `${inputId}-helper`}
            className={cn(
              "text-xs font-inter",
              error
                ? "text-rose-400"
                : "text-slate-600"
            )}
            role={error ? "alert" : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
