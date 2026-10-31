import React from 'react';
import { clsx } from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, hint, id, className, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
    const descriptionId = `${selectId}-desc`;
    const errorId = `${selectId}-error`;

    return (
      <div className="space-y-1">
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label} {props.required && <span className="text-[#B3261E]" aria-hidden="true">*</span>}
        </label>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={clsx(hint && descriptionId, error && errorId)}
          className={clsx(
            'w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm transition-colors min-h-[44px]',
            'focus:outline-none focus:ring-2 focus:ring-[#5B3FD9]',
            error ? 'border-[#B3261E] focus:ring-[#B3261E]' : 'border-gray-300',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';
