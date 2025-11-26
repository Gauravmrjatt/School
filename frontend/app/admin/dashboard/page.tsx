'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui';

export default function AdminDashboard() {
    const quickActions = [
        {
            label: 'Add Student',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
            onClick: () => console.log('Add Student'),
            color: 'primary' as const,
        },
        {
            label: 'Create Class',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
            onClick: () => console.log('Create Class'),
            color: 'secondary' as const,
        },
        {
            label: 'Create Exam',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            onClick: () => console.log('Create Exam'),
            color: 'success' as const,
        },
        {
            label: 'Announcement',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            ),
            onClick: () => console.log('Announcement'),
            color: 'primary' as const,
        },
    ];

    const upcomingExams = [
        { subject: 'Mathematics', class: 'Class 10-A', date: '2025-12-01', time: '09:00 AM' },
        { subject: 'Science', class: 'Class 9-B', date: '2025-12-03', time: '10:30 AM' },
        { subject: 'English', class: 'Class 8-A', date: '2025-12-05', time: '11:00 AM' },
    ];

    const recentAnnouncements = [
        { title: 'Winter Break Schedule', date: '2 hours ago', priority: 'high' },
        { title: 'Parent-Teacher Meeting', date: '5 hours ago', priority: 'medium' },
        { title: 'Sports Day Event', date: '1 day ago', priority: 'low' },
    ];

    return (
        <div className="flex">
            <Sidebar role="admin" />

            <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
                <Header userName="John Admin" userRole="Administrator" />

                <main style={{ padding: 'var(--space-8)' }}>
                    {/* Page Title */}
                    <div style={{ marginBottom: 'var(--space-8)' }}>
                        <h1 style={{ marginBottom: 'var(--space-2)' }}>Dashboard</h1>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                            Welcome back! Here's what's happening in your school today.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: 'var(--space-8)' }}>
                        <StatsCard
                            title="Total Students"
                            value="2,847"
                            icon={
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                                    <path d="M16 3.13a4 4 0 010 7.75" />
                                </svg>
                            }
                            trend={{ value: 12, isPositive: true }}
                            color="primary"
                        />
                        <StatsCard
                            title="Total Teachers"
                            value="187"
                            icon={
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                            }
                            trend={{ value: 5, isPositive: true }}
                            color="secondary"
                        />
                        <StatsCard
                            title="Total Classes"
                            value="42"
                            icon={
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            }
                            color="success"
                        />
                        <StatsCard
                            title="Total Revenue"
                            value="$284.7K"
                            icon={
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            trend={{ value: 8, isPositive: true }}
                            color="warning"
                        />
                    </div>

                    {/* Quick Actions */}
                    <div style={{ marginBottom: 'var(--space-8)' }}>
                        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-6)' }}>Quick Actions</h2>
                        <QuickActions actions={quickActions} />
                    </div>

                    {/* Data Visualization & Lists */}
                    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                        {/* Upcoming Exams */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Exams</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    {upcomingExams.map((exam, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: 'var(--space-4)',
                                                backgroundColor: 'var(--color-background)',
                                                borderRadius: 'var(--radius-md)',
                                                borderLeft: '4px solid var(--color-primary)',
                                            }}
                                        >
                                            <div className="flex justify-between items-start" style={{ marginBottom: 'var(--space-2)' }}>
                                                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 0 }}>
                                                    {exam.subject}
                                                </h4>
                                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                                    {exam.class}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                    📅 {exam.date}
                                                </span>
                                                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                    🕐 {exam.time}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Recent Announcements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Announcements</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    {recentAnnouncements.map((announcement, index) => {
                                        const priorityColors = {
                                            high: 'var(--color-error)',
                                            medium: 'var(--color-warning)',
                                            low: 'var(--color-info)',
                                        };
                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: 'var(--space-4)',
                                                    backgroundColor: 'var(--color-background)',
                                                    borderRadius: 'var(--radius-md)',
                                                    borderLeft: `4px solid ${priorityColors[announcement.priority as keyof typeof priorityColors]}`,
                                                }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-1)' }}>
                                                        {announcement.title}
                                                    </h4>
                                                </div>
                                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                                    {announcement.date}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
