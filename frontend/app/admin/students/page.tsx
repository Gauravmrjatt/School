'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardBody, Button, Input, Badge, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui';

export default function StudentsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const students = [
        { id: 'STU001', name: 'John Doe', class: '10-A', roll: '15', gender: 'Male', status: 'Active', photo: '👨‍🎓' },
        { id: 'STU002', name: 'Jane Smith', class: '10-A', roll: '16', gender: 'Female', status: 'Active', photo: '👩‍🎓' },
        { id: 'STU003', name: 'Mike Johnson', class: '9-B', roll: '22', gender: 'Male', status: 'Active', photo: '👨‍🎓' },
        { id: 'STU004', name: 'Sarah Williams', class: '10-B', roll: '08', gender: 'Female', status: 'Active', photo: '👩‍🎓' },
        { id: 'STU005', name: 'David Brown', class: '9-A', roll: '12', gender: 'Male', status: 'Inactive', photo: '👨‍🎓' },
    ];

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
            <Sidebar role="admin" />

            <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
                <Header userName="John Admin" userRole="Administrator" />

                <main style={{ padding: 'var(--space-8)' }}>
                    {/* Page Header */}
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
                        <div>
                            <h1 style={{ marginBottom: 'var(--space-2)' }}>Students</h1>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                                Manage student records and information
                            </p>
                        </div>
                        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Student
                        </Button>
                    </div>

                    {/* Search and Filters */}
                    <Card style={{ marginBottom: 'var(--space-6)' }}>
                        <div className="flex gap-4" style={{ alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    }
                                />
                            </div>
                            <Button variant="outline">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filters
                            </Button>
                        </div>
                    </Card>

                    {/* Students Table */}
                    <Card>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Photo</th>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Class</th>
                                        <th>Roll No.</th>
                                        <th>Gender</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id}>
                                            <td>
                                                <div style={{ fontSize: 'var(--font-size-3xl)' }}>{student.photo}</div>
                                            </td>
                                            <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{student.id}</td>
                                            <td>{student.name}</td>
                                            <td>{student.class}</td>
                                            <td>{student.roll}</td>
                                            <td>{student.gender}</td>
                                            <td>
                                                <Badge variant={student.status === 'Active' ? 'success' : 'error'}>
                                                    {student.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        style={{
                                                            padding: 'var(--space-2)',
                                                            backgroundColor: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: 'var(--color-primary)',
                                                        }}
                                                        title="View Details"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        style={{
                                                            padding: 'var(--space-2)',
                                                            backgroundColor: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: 'var(--color-text-secondary)',
                                                        }}
                                                        title="Edit"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

                    {/* Add Student Modal */}
                    <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                        <ModalHeader onClose={() => setIsAddModalOpen(false)}>
                            <ModalTitle>Add New Student</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                id="studentName"
                                label="Full Name"
                                placeholder="Enter student name"
                                required
                            />
                            <Input
                                id="studentEmail"
                                type="email"
                                label="Email"
                                placeholder="Enter email address"
                                required
                            />
                            <Input
                                id="studentClass"
                                label="Class"
                                placeholder="e.g., 10-A"
                                required
                            />
                            <Input
                                id="studentRoll"
                                label="Roll Number"
                                placeholder="Enter roll number"
                                required
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={() => {
                                // Handle form submission
                                setIsAddModalOpen(false);
                            }}>
                                Add Student
                            </Button>
                        </ModalFooter>
                    </Modal>
                </main>
            </div>
        </div>
    );
}
