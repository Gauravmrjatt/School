'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardBody, Button, Badge } from '@/components/ui';

export default function TeachersPage() {
    const teachers = [
        { id: 'TCH001', name: 'Dr. Robert Smith', subject: 'Mathematics', classes: '10-A, 10-B', experience: '15 years', status: 'Active' },
        { id: 'TCH002', name: 'Ms. Emily Johnson', subject: 'English', classes: '9-A, 9-B', experience: '8 years', status: 'Active' },
        { id: 'TCH003', name: 'Mr. Michael Brown', subject: 'Science', classes: '10-A, 9-A', experience: '12 years', status: 'Active' },
    ];

    return (
        <div className="flex">
            <Sidebar role="admin" />
            <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
                <Header userName="John Admin" userRole="Administrator" />
                <main style={{ padding: 'var(--space-8)' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
                        <div>
                            <h1 style={{ marginBottom: 'var(--space-2)' }}>Teachers</h1>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>Manage teaching staff</p>
                        </div>
                        <Button variant="primary">Add Teacher</Button>
                    </div>
                    <Card>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Teacher ID</th>
                                        <th>Name</th>
                                        <th>Subject</th>
                                        <th>Classes</th>
                                        <th>Experience</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teachers.map((teacher) => (
                                        <tr key={teacher.id}>
                                            <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{teacher.id}</td>
                                            <td>{teacher.name}</td>
                                            <td>{teacher.subject}</td>
                                            <td>{teacher.classes}</td>
                                            <td>{teacher.experience}</td>
                                            <td><Badge variant="success">{teacher.status}</Badge></td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button style={{ padding: 'var(--space-2)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </button>
                                                </div>
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
