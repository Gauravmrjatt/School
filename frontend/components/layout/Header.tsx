'use client';

import React from 'react';

export interface HeaderProps {
    userName: string;
    userRole: string;
    userAvatar?: string;
}

export const Header: React.FC<HeaderProps> = ({ userName, userRole, userAvatar }) => {
    return (
        <header
            style={{
                height: '70px',
                backgroundColor: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border-light)',
                padding: '0 var(--space-6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 'var(--z-sticky)',
            }}
        >
            {/* Search Bar */}
            <div style={{ flex: 1, maxWidth: '500px' }}>
                <div style={{ position: 'relative' }}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-text-tertiary)"
                        style={{
                            position: 'absolute',
                            left: 'var(--space-4)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Search..."
                        style={{
                            width: '100%',
                            padding: 'var(--space-3) var(--space-4) var(--space-3) calc(var(--space-4) * 2.5)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--font-size-sm)',
                            backgroundColor: 'var(--color-background)',
                            transition: 'all var(--transition-fast)',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-primary)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(var(--color-primary-rgb), 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--color-border)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button
                    style={{
                        position: 'relative',
                        padding: 'var(--space-2)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-md)',
                        transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-border-light)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label="Notifications"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span
                        style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '8px',
                            height: '8px',
                            backgroundColor: 'var(--color-error)',
                            borderRadius: '50%',
                            border: '2px solid var(--color-surface)',
                        }}
                    />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'var(--font-weight-semibold)',
                            fontSize: 'var(--font-size-sm)',
                        }}
                    >
                        {userAvatar || userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '2px', color: 'var(--color-text-primary)' }}>
                            {userName}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 0, textTransform: 'capitalize' }}>
                            {userRole}
                        </p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </header>
    );
};
