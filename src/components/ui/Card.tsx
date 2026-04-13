import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, title, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          relative overflow-hidden rounded-2xl
          bg-gray-900/60 backdrop-blur-xl
          border border-gray-800
          p-6
          transition-all duration-300
          hover:border-gray-700
          ${className}
        `}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold text-white mb-4">
            {title}
          </h3>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';