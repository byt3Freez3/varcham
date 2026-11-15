import * as React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-[13px] font-medium mb-1.5 transition-colors',
              error ? 'text-sindoor' : 'text-walnut'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'flex h-12 w-full rounded-sm border bg-white px-3.5 text-base text-espresso placeholder:text-walnut/50 transition-colors duration-fast focus:outline-none disabled:cursor-not-allowed disabled:bg-parchment disabled:text-walnut/50',
              error
                ? 'border-sindoor bg-[#FFF8F6] focus:ring-2 focus:ring-sindoor/25'
                : success
                ? 'border-tulsi pr-10 focus:ring-2 focus:ring-tulsi/25'
                : 'border-hairline hover:border-walnut focus:border-tulsi focus:ring-2 focus:ring-tulsi/25',
              className
            )}
            {...props}
          />
          {success && !error && (
            <Check
              aria-hidden="true"
              className="w-4 h-4 text-tulsi absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-[13px] text-sindoor">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-xs text-walnut">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

