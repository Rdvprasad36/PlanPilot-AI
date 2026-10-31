import React from 'react';
import { clsx } from 'clsx';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    const descriptionId = `${inputId}-desc`;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label} {props.required && <span className="text-[#B3261E]" aria-hidden="true">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={clsx(hint && descriptionId, error && errorId)}
          className={clsx(
            'w-full rounded-xl border px-3 py-2 text-sm shadow-sm transition-colors min-h-[44px]',
            'focus:outline-none focus:ring-2 focus:ring-[#5B3FD9]',
            error ? 'border-[#B3261E] focus:ring-[#B3261E]' : 'border-gray-300',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p id={descriptionId} className="text-xs text-gray-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-[#B3261E] font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
