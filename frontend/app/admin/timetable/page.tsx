'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui';

export default function TimetablePage() {
    return (
        <div className="flex">
            <Sidebar role="admin" />
            <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
                <Header userName="John Admin" userRole="Administrator" />
                <main style={{ padding: 'var(--space-8)' }}>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>Timetable Management</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>Create and manage class schedules</p>
                    <Card>
                        <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" style={{ margin: '0 auto var(--space-4)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3>Timetable Builder</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>Coming soon...</p>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
}
