import React, { useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, required, icon, className = '', type = 'text', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputType = type === 'password' && showPassword ? 'text' : type;
        const hasError = Boolean(error);

        return (
            <div className="input-group">
                {label && (
                    <label htmlFor={props.id} className={`input-label ${required ? 'required' : ''}`}>
                        {label}
                    </label>
                )}
                <div style={{ position: 'relative' }}>
                    {icon && (
                        <div
                            style={{
                                position: 'absolute',
                                left: 'var(--space-4)',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--color-text-tertiary)',
                                pointerEvents: 'none',
                            }}
                            aria-hidden="true"
                        >
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={inputType}
                        className={`input ${hasError ? 'error' : ''} ${icon ? 'pl-10' : ''} ${className}`}
                        style={icon ? { paddingLeft: 'calc(var(--space-4) * 2.5)' } : undefined}
                        aria-invalid={hasError}
                        aria-describedby={
                            error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined
                        }
                        {...props}
                    />
                    {type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: 'var(--space-4)',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-text-tertiary)',
                                padding: 'var(--space-2)',
                            }}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <span id={`${props.id}-error`} className="input-error" role="alert">
                        {error}
                    </span>
                )}
                {hint && !error && (
                    <span id={`${props.id}-hint`} className="input-hint">
                        {hint}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
