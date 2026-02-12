import React from 'react';
import { cn } from '@/lib/utils';

/**
 * FormInput Component
 * Accessible form input with proper label association, error states, and focus indicators
 * WCAG 2.1 AA Compliant
 */

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  autoComplete?: string; // Add autocomplete support for better accessibility
}

export function FormInput({
  label,
  error,
  helperText,
  required,
  className,
  id,
  autoComplete,
  ...props
}: FormInputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-slate-200"
      >
        {label}
        {required && <span className="text-rose-400 ml-1">*</span>}
      </label>
      
      <input
        id={inputId}
        className={cn(
          "w-full px-3 py-2 rounded-lg",
          "bg-white/5 border border-white/10",
          "text-slate-200 placeholder:text-slate-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "transition-all duration-200",
          error && "border-rose-500 focus:ring-rose-500",
          props.disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={cn(
          error && errorId,
          helperText && helperId
        )}
        required={required}
        autoComplete={autoComplete}
        {...props}
      />
      
      {error && (
        <p
          id={errorId}
          className="text-sm text-rose-400"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p
          id={helperId}
          className="text-sm text-slate-400"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export default FormInput;
