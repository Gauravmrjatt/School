'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, Button, Badge } from '@/components/ui';

export default function FeesPage() {
    const feeRecords = [
        { student: 'John Doe', class: '10-A', amount: '$500', dueDate: '2025-12-01', status: 'Paid' },
        { student: 'Jane Smith', class: '10-A', amount: '$500', dueDate: '2025-12-01', status: 'Pending' },
        { student: 'Mike Johnson', class: '9-B', amount: '$450', dueDate: '2025-12-05', status: 'Overdue' },
    ];

    return (
        <div className="flex">
            <Sidebar role="admin" />
            <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
                <Header userName="John Admin" userRole="Administrator" />
                <main style={{ padding: 'var(--space-8)' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
                        <div>
                            <h1 style={{ marginBottom: 'var(--space-2)' }}>Fees & Payments</h1>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>Manage fee collection and payments</p>
                        </div>
                        <Button variant="primary">Generate Invoice</Button>
                    </div>
                    <Card>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Class</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feeRecords.map((record, index) => (
                                        <tr key={index}>
                                            <td>{record.student}</td>
                                            <td>{record.class}</td>
                                            <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{record.amount}</td>
                                            <td>{record.dueDate}</td>
                                            <td>
                                                <Badge variant={record.status === 'Paid' ? 'success' : record.status === 'Pending' ? 'warning' : 'error'}>
                                                    {record.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button variant="ghost" size="sm">View Receipt</Button>
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
