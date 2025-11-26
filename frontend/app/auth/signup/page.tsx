'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Dropdown } from '@/components/ui';
import type { DropdownOption } from '@/components/ui';

const roleOptions: DropdownOption[] = [
    { value: 'student', label: 'Student' },
    { value: 'parent', label: 'Parent' },
    { value: 'teacher', label: 'Teacher' },
];

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
        studentId: '',
        termsAccepted: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.role) {
            newErrors.role = 'Please select your role';
        }

        if ((formData.role === 'student' || formData.role === 'parent') && !formData.studentId) {
            newErrors.studentId = 'Student ID is required for verification';
        }

        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep2()) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Signup data:', formData);
            setLoading(false);
            // Redirect to login or dashboard
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
                        </svg>
                    </div>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>Create Account</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                        Join our school management platform
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex gap-2" style={{ marginBottom: 'var(--space-8)' }}>
                    <div
                        style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: step >= 1 ? 'var(--color-primary)' : 'var(--color-border)',
                            transition: 'background-color var(--transition-base)',
                        }}
                    />
                    <div
                        style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: step >= 2 ? 'var(--color-primary)' : 'var(--color-border)',
                            transition: 'background-color var(--transition-base)',
                        }}
                    />
                </div>

                {/* Step 1: Personal Information */}
                {step === 1 && (
                    <div>
                        <h3 style={{ marginBottom: 'var(--space-6)' }}>Personal Information</h3>
                        <Input
                            id="fullName"
                            type="text"
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            error={errors.fullName}
                            required
                        />

                        <Input
                            id="email"
                            type="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={errors.email}
                            required
                        />

                        <Input
                            id="phone"
                            type="tel"
                            label="Phone Number"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            error={errors.phone}
                            required
                        />

                        <div className="flex gap-4" style={{ marginTop: 'var(--space-6)' }}>
                            <Button type="button" variant="outline" onClick={() => window.history.back()} style={{ flex: 1 }}>
                                Back
                            </Button>
                            <Button type="button" variant="primary" onClick={handleNext} style={{ flex: 1 }}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Account Setup */}
                {step === 2 && (
                    <form onSubmit={handleSubmit}>
                        <h3 style={{ marginBottom: 'var(--space-6)' }}>Account Setup</h3>

                        <Input
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={errors.password}
                            hint="Must be at least 8 characters"
                            required
                        />

                        <Input
                            id="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            error={errors.confirmPassword}
                            required
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

                        {(formData.role === 'student' || formData.role === 'parent') && (
                            <Input
                                id="studentId"
                                type="text"
                                label={formData.role === 'parent' ? "Child's Student ID" : 'Student ID'}
                                placeholder="Enter student ID for verification"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                error={errors.studentId}
                                required
                            />
                        )}

                        <div style={{ marginBottom: 'var(--space-6)' }}>
                            <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.termsAccepted}
                                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                    I accept the{' '}
                                    <Link href="/terms" style={{ color: 'var(--color-primary)' }}>
                                        Terms & Conditions
                                    </Link>
                                </span>
                            </label>
                            {errors.termsAccepted && (
                                <span className="input-error" role="alert">
                                    {errors.termsAccepted}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={() => setStep(1)} style={{ flex: 1 }}>
                                Back
                            </Button>
                            <Button type="submit" variant="primary" loading={loading} style={{ flex: 1 }}>
                                Create Account
                            </Button>
                        </div>
                    </form>
                )}

                <p
                    style={{
                        textAlign: 'center',
                        marginTop: 'var(--space-6)',
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)',
                    }}
                >
                    Already have an account?{' '}
                    <Link
                        href="/auth/login"
                        style={{
                            color: 'var(--color-primary)',
                            fontWeight: 'var(--font-weight-semibold)',
                        }}
                    >
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Right Side - Illustration */}
            <div
                style={{
                    flex: '1',
                    background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%)',
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
                <div style={{ textAlign: 'center', zIndex: 1, color: 'var(--color-text-primary)' }}>
                    <svg
                        width="300"
                        height="300"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        style={{ margin: '0 auto var(--space-8)' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-4)' }}>
                        Join Our Community
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-lg)', opacity: 0.9, maxWidth: '400px', margin: '0 auto' }}>
                        Get started with your personalized dashboard and access all the features tailored to your role
                    </p>
                </div>
            </div>
        </div>
    );
}
