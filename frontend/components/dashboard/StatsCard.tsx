import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui';

export interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'primary' | 'secondary' | 'success' | 'warning';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color = 'primary' }) => {
    const colorMap = {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
    };

    return (
        <Card hover>
            <div className="flex items-center justify-between">
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                        {title}
                    </p>
                    <h3 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-2)' }}>
                        {value}
                    </h3>
                    {trend && (
                        <div className="flex items-center gap-1">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={trend.isPositive ? 'var(--color-success)' : 'var(--color-error)'}
                                style={{ transform: trend.isPositive ? 'rotate(0deg)' : 'rotate(180deg)' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span
                                style={{
                                    fontSize: 'var(--font-size-sm)',
                                    color: trend.isPositive ? 'var(--color-success)' : 'var(--color-error)',
                                    fontWeight: 'var(--font-weight-medium)',
                                }}
                            >
                                {trend.value}%
                            </span>
                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                <div
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: `${colorMap[color]}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colorMap[color],
                    }}
                >
                    {icon}
                </div>
            </div>
        </Card>
    );
};
