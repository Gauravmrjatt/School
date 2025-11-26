'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardBody, Button } from '@/components/ui';

export default function SettingsPage() {
    return (
        <div className="flex">
            <Sidebar role="admin" />
            <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
                <Header userName="John Admin" userRole="Administrator" />
                <main style={{ padding: 'var(--space-8)' }}>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>Settings</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>Configure system preferences</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <Card>
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 style={{ marginBottom: 'var(--space-1)' }}>School Name</h4>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 0 }}>Update your school name</p>
                                        </div>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 style={{ marginBottom: 'var(--space-1)' }}>Academic Year</h4>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 0 }}>2024-2025</p>
                                        </div>
                                        <Button variant="outline" size="sm">Change</Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Theme Settings</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 style={{ marginBottom: 'var(--space-1)' }}>Dark Mode</h4>
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 0 }}>Toggle dark mode theme</p>
                                    </div>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                                        <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
                                        <span style={{
                                            position: 'absolute',
                                            cursor: 'pointer',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'var(--color-border)',
                                            borderRadius: 'var(--radius-full)',
                                            transition: 'var(--transition-base)',
                                        }} />
                                    </label>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
