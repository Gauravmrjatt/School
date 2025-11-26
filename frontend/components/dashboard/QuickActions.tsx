import React from 'react';
import { Button } from '@/components/ui';

export interface QuickAction {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: 'primary' | 'secondary' | 'success';
}

export interface QuickActionsProps {
    actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
    const colorMap = {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
    };

    return (
        <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={action.onClick}
                    style={{
                        padding: 'var(--space-6)',
                        backgroundColor: 'var(--color-surface)',
                        border: `2px solid ${colorMap[action.color || 'primary']}20`,
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        e.currentTarget.style.borderColor = colorMap[action.color || 'primary'];
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = `${colorMap[action.color || 'primary']}20`;
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: `${colorMap[action.color || 'primary']}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colorMap[action.color || 'primary'],
                        }}
                    >
                        {action.icon}
                    </div>
                    <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                        {action.label}
                    </span>
                </button>
            ))}
        </div>
    );
};
