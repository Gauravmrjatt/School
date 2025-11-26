'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, Button, Badge, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Input } from '@/components/ui';

export default function AnnouncementsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const announcements = [
        { title: 'Winter Break Schedule', date: '2025-11-25', priority: 'High', audience: 'All' },
        { title: 'Parent-Teacher Meeting', date: '2025-11-24', priority: 'Medium', audience: 'Parents' },
        { title: 'Sports Day Event', date: '2025-11-20', priority: 'Low', audience: 'Students' },
    ];

    return (
        <div className="flex">
            <Sidebar role="admin" />
            <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
                <Header userName="John Admin" userRole="Administrator" />
                <main style={{ padding: 'var(--space-8)' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
                        <div>
                            <h1 style={{ marginBottom: 'var(--space-2)' }}>Announcements</h1>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>Broadcast important messages</p>
                        </div>
                        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Announcement
                        </Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {announcements.map((announcement, index) => (
                            <Card key={index}>
                                <div className="flex justify-between items-start">
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ marginBottom: 'var(--space-2)' }}>{announcement.title}</h3>
                                        <div className="flex gap-4" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            <span>📅 {announcement.date}</span>
                                            <span>👥 {announcement.audience}</span>
                                        </div>
                                    </div>
                                    <Badge variant={announcement.priority === 'High' ? 'error' : announcement.priority === 'Medium' ? 'warning' : 'info'}>
                                        {announcement.priority}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Create Announcement Modal */}
                    <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                        <ModalHeader onClose={() => setIsCreateModalOpen(false)}>
                            <ModalTitle>Create Announcement</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            <Input id="title" label="Title" placeholder="Enter announcement title" required />
                            <div className="input-group">
                                <label className="input-label required">Message</label>
                                <textarea
                                    className="input"
                                    rows={4}
                                    placeholder="Enter announcement message"
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={() => setIsCreateModalOpen(false)}>Publish</Button>
                        </ModalFooter>
                    </Modal>
                </main>
            </div>
        </div>
    );
}
