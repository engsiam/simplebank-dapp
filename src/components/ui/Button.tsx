import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', children, isLoading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          px-6 py-3 rounded-xl font-semibold transition-all duration-300
          bg-gradient-to-r from-purple-600 to-blue-600 text-white
          hover:from-purple-500 hover:to-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:from-purple-600 disabled:hover:to-blue-600
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';