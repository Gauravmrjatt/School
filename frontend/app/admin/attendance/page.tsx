'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, Button } from '@/components/ui';

export default function AttendancePage() {
    return (
        <div className="flex">
            <Sidebar role="admin" />
            <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
                <Header userName="John Admin" userRole="Administrator" />
                <main style={{ padding: 'var(--space-8)' }}>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>Attendance Management</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>Track and manage student attendance</p>
                    <Card>
                        <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" style={{ margin: '0 auto var(--space-4)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <h3>Attendance Module</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>Coming soon...</p>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
}
