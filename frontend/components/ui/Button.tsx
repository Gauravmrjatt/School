import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading = false, icon, children, className = '', disabled, ...props }, ref) => {
        const baseClass = 'btn';
        const variantClass = `btn-${variant}`;
        const sizeClass = size !== 'md' ? `btn-${size}` : '';
        const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');

        return (
            <button
                ref={ref}
                className={classes}
                disabled={disabled || loading}
                aria-busy={loading}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {!loading && icon && <span aria-hidden="true">{icon}</span>}
                <span>{children}</span>
            </button>
        );
    }
);

Button.displayName = 'Button';
