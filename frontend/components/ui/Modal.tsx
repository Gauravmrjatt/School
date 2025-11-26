'use client';

import React, { useEffect, useRef } from 'react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'md' }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            modalRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            previousActiveElement.current?.focus();
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeStyles = {
        sm: { maxWidth: '400px' },
        md: { maxWidth: '600px' },
        lg: { maxWidth: '800px' },
        xl: { maxWidth: '1000px' },
    };

    return (
        <div
            className="modal-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={modalRef}
                className="modal"
                style={sizeStyles[size]}
                tabIndex={-1}
            >
                {children}
            </div>
        </div>
    );
};

export interface ModalHeaderProps {
    children: React.ReactNode;
    onClose?: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, onClose }) => {
    return (
        <div className="modal-header">
            <div>{children}</div>
            {onClose && (
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 'var(--space-2)',
                        color: 'var(--color-text-tertiary)',
                        transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-tertiary)';
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export interface ModalTitleProps {
    children: React.ReactNode;
}

export const ModalTitle: React.FC<ModalTitleProps> = ({ children }) => {
    return <h2 className="modal-title">{children}</h2>;
};

export interface ModalBodyProps {
    children: React.ReactNode;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children }) => {
    return <div className="modal-body">{children}</div>;
};

export interface ModalFooterProps {
    children: React.ReactNode;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
    return <div className="modal-footer">{children}</div>;
};
