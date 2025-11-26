'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
    value: string;
    label: string;
}

export interface DropdownProps {
    options: DropdownOption[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    searchable?: boolean;
    disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    error,
    required,
    searchable = false,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = searchable
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="input-group" ref={dropdownRef}>
            {label && (
                <label className={`input-label ${required ? 'required' : ''}`}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                <button
                    type="button"
                    className={`input ${error ? 'error' : ''}`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left',
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span style={{ color: selectedOption ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform var(--transition-fast)',
                        }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + var(--space-2))',
                            left: 0,
                            right: 0,
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-lg)',
                            zIndex: 'var(--z-dropdown)',
                            maxHeight: '300px',
                            overflowY: 'auto',
                        }}
                        role="listbox"
                    >
                        {searchable && (
                            <div style={{ padding: 'var(--space-2)' }}>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ marginBottom: 0 }}
                                />
                            </div>
                        )}
                        <div>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        role="option"
                                        aria-selected={option.value === value}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-3) var(--space-4)',
                                            textAlign: 'left',
                                            backgroundColor: option.value === value ? 'var(--color-border-light)' : 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'background-color var(--transition-fast)',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (option.value !== value) {
                                                e.currentTarget.style.backgroundColor = 'var(--color-border-light)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (option.value !== value) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                ))
                            ) : (
                                <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
                                    No options found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <span className="input-error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};
