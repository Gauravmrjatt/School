'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, Button, Badge } from '@/components/ui';

export default function ExamsPage() {
    const exams = [
        { name: 'Mid-Term Mathematics', class: 'Class 10-A', date: '2025-12-01', time: '09:00 AM', status: 'Scheduled' },
        { name: 'Final Science Exam', class: 'Class 9-B', date: '2025-12-15', time: '10:30 AM', status: 'Scheduled' },
        { name: 'English Literature', class: 'Class 10-B', date: '2025-12-20', time: '11:00 AM', status: 'Scheduled' },
    ];

    return (
        <div className="flex">
            <Sidebar role="admin" />
            <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
                <Header userName="John Admin" userRole="Administrator" />
                <main style={{ padding: 'var(--space-8)' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
                        <div>
                            <h1 style={{ marginBottom: 'var(--space-2)' }}>Exams & Results</h1>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>Manage examinations and results</p>
                        </div>
                        <Button variant="primary">Create Exam</Button>
                    </div>
                    <Card>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Exam Name</th>
                                        <th>Class</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map((exam, index) => (
                                        <tr key={index}>
                                            <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{exam.name}</td>
                                            <td>{exam.class}</td>
                                            <td>{exam.date}</td>
                                            <td>{exam.time}</td>
                                            <td><Badge variant="info">{exam.status}</Badge></td>
                                            <td>
                                                <Button variant="ghost" size="sm">View</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
}
