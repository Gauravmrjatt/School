'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardBody, Button } from '@/components/ui';

export default function ClassesPage() {
    const classes = [
        { name: 'Class 10-A', students: 45, teacher: 'Dr. Robert Smith', subjects: 8 },
        { name: 'Class 10-B', students: 42, teacher: 'Ms. Emily Johnson', subjects: 8 },
        { name: 'Class 9-A', students: 48, teacher: 'Mr. Michael Brown', subjects: 7 },
        { name: 'Class 9-B', students: 44, teacher: 'Ms. Sarah Davis', subjects: 7 },
    ];

    return (
        <div className="flex">
            <Sidebar role="admin" />
            <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
                <Header userName="John Admin" userRole="Administrator" />
                <main style={{ padding: 'var(--space-8)' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
                        <div>
                            <h1 style={{ marginBottom: 'var(--space-2)' }}>Classes & Sections</h1>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>Manage class sections and assignments</p>
                        </div>
                        <Button variant="primary">Create Class</Button>
                    </div>
                    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {classes.map((cls, index) => (
                            <Card key={index} hover>
                                <CardHeader>
                                    <CardTitle>{cls.name}</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                        <div className="flex justify-between">
                                            <span style={{ color: 'var(--color-text-secondary)' }}>Students:</span>
                                            <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{cls.students}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span style={{ color: 'var(--color-text-secondary)' }}>Class Teacher:</span>
                                            <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{cls.teacher}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span style={{ color: 'var(--color-text-secondary)' }}>Subjects:</span>
                                            <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{cls.subjects}</span>
                                        </div>
                                        <Button variant="outline" style={{ marginTop: 'var(--space-2)', width: '100%' }}>View Details</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
