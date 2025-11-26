'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Dropdown } from '@/components/ui';
import type { DropdownOption } from '@/components/ui';

const roleOptions: DropdownOption[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'student', label: 'Student' },
    { value: 'parent', label: 'Parent' },
];

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.role) {
            newErrors.role = 'Please select your role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Login data:', formData);
            setLoading(false);
            // Redirect based on role
            // router.push(`/${formData.role}/dashboard`);
        }, 1500);
    };

    return (
        <div className="flex" style={{ minHeight: '100vh' }}>
            {/* Left Side - Form */}
            <div
                className="flex flex-col justify-center"
                style={{
                    flex: '1',
                    padding: 'var(--space-8)',
                    maxWidth: '600px',
                    margin: '0 auto',
                }}
            >
                {/* Logo */}
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'var(--color-primary)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                    </div>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                        Sign in to access your school dashboard
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        error={errors.email}
                        required
                        icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        }
                    />

                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        error={errors.password}
                        required
                        icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        }
                    />

                    <Dropdown
                        label="Select Role"
                        options={roleOptions}
                        value={formData.role}
                        onChange={(value) => setFormData({ ...formData, role: value })}
                        placeholder="Choose your role"
                        error={errors.role}
                        required
                    />

                    <div
                        className="flex justify-between items-center"
                        style={{ marginBottom: 'var(--space-6)' }}
                    >
                        <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                            <input type="checkbox" style={{ cursor: 'pointer' }} />
                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                Remember me
                            </span>
                        </label>
                        <Link
                            href="/auth/forgot-password"
                            style={{
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--color-primary)',
                                fontWeight: 'var(--font-weight-medium)',
                            }}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
                        Sign In
                    </Button>

                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: 'var(--space-6)',
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-sm)',
                        }}
                    >
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/auth/signup"
                            style={{
                                color: 'var(--color-primary)',
                                fontWeight: 'var(--font-weight-semibold)',
                            }}
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>

            {/* Right Side - Illustration */}
            <div
                style={{
                    flex: '1',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--space-8)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                className="hidden lg:flex"
            >
                {/* Decorative circles */}
                <div
                    style={{
                        position: 'absolute',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        top: '-100px',
                        right: '-100px',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        bottom: '-50px',
                        left: '-50px',
                    }}
                />

                {/* Illustration content */}
                <div style={{ textAlign: 'center', zIndex: 1, color: 'white' }}>
                    <svg
                        width="300"
                        height="300"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        style={{ margin: '0 auto var(--space-8)' }}
                    >
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-4)', color: 'white' }}>
                        School Management System
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-lg)', opacity: 0.9, maxWidth: '400px', margin: '0 auto' }}>
                        Empowering education through seamless administration, teaching, and learning experiences
                    </p>
                </div>
            </div>
        </div>
    );
}
