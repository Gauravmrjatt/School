'use client';

import React from 'react';
import Link from 'next/link';

export interface SidebarProps {
    role: 'admin' | 'teacher' | 'student' | 'parent';
}

const menuItems = {
    admin: [
        { icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
        { icon: '👥', label: 'Students', href: '/admin/students' },
        { icon: '👨‍🏫', label: 'Teachers', href: '/admin/teachers' },
        { icon: '🏫', label: 'Classes', href: '/admin/classes' },
        { icon: '📅', label: 'Attendance', href: '/admin/attendance' },
        { icon: '📝', label: 'Exams', href: '/admin/exams' },
        { icon: '📚', label: 'Timetable', href: '/admin/timetable' },
        { icon: '💰', label: 'Fees', href: '/admin/fees' },
        { icon: '📢', label: 'Announcements', href: '/admin/announcements' },
        { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
    ],
    teacher: [
        { icon: '📊', label: 'Dashboard', href: '/teacher/dashboard' },
        { icon: '📅', label: 'My Schedule', href: '/teacher/schedule' },
        { icon: '✅', label: 'Attendance', href: '/teacher/attendance' },
        { icon: '📝', label: 'Exams', href: '/teacher/exams' },
        { icon: '👥', label: 'My Students', href: '/teacher/students' },
    ],
    student: [
        { icon: '📊', label: 'Dashboard', href: '/student/dashboard' },
        { icon: '📚', label: 'Timetable', href: '/student/timetable' },
        { icon: '📅', label: 'Attendance', href: '/student/attendance' },
        { icon: '📝', label: 'Exams', href: '/student/exams' },
        { icon: '💰', label: 'Fees', href: '/student/fees' },
        { icon: '🎓', label: 'Results', href: '/student/results' },
    ],
    parent: [
        { icon: '📊', label: 'Dashboard', href: '/parent/dashboard' },
        { icon: '📅', label: 'Attendance', href: '/parent/attendance' },
        { icon: '📝', label: 'Exams', href: '/parent/exams' },
        { icon: '💰', label: 'Fees', href: '/parent/fees' },
        { icon: '🎓', label: 'Results', href: '/parent/results' },
        { icon: '📢', label: 'Announcements', href: '/parent/announcements' },
    ],
};

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    const items = menuItems[role];

    return (
        <aside
            style={{
                width: '280px',
                height: '100vh',
                backgroundColor: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border-light)',
                padding: 'var(--space-6)',
                position: 'fixed',
                left: 0,
                top: 0,
                overflowY: 'auto',
            }}
        >
            {/* Logo */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 'var(--space-3)',
                    }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                </div>
                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginBottom: 0 }}>
                    School MS
                </h2>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 0, textTransform: 'capitalize' }}>
                    {role} Portal
                </p>
            </div>

            {/* Navigation */}
            <nav>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((item, index) => (
                        <li key={index} style={{ marginBottom: 'var(--space-2)' }}>
                            <Link
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3) var(--space-4)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text-secondary)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    transition: 'all var(--transition-fast)',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-border-light)';
                                    e.currentTarget.style.color = 'var(--color-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                                }}
                            >
                                <span style={{ fontSize: 'var(--font-size-xl)' }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
