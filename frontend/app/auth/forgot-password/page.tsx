'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setErrors({ email: 'Email is required' });
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: 'Email is invalid' });
            return;
        }

        setLoading(true);
        setErrors({});

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep('otp');
        }, 1500);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setErrors({ otp: 'Please enter the complete OTP' });
            return;
        }

        setLoading(true);
        setErrors({});

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep('reset');
        }, 1500);
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Redirect to login
            window.location.href = '/auth/login';
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', padding: 'var(--space-4)' }}>
            <div style={{ maxWidth: '500px', width: '100%' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'var(--color-primary)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--space-4)',
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>
                        {step === 'email' && 'Forgot Password?'}
                        {step === 'otp' && 'Verify OTP'}
                        {step === 'reset' && 'Reset Password'}
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                        {step === 'email' && "No worries, we'll send you reset instructions"}
                        {step === 'otp' && `We've sent a 6-digit code to ${email}`}
                        {step === 'reset' && 'Create a new password for your account'}
                    </p>
                </div>

                <div className="card">
                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit}>
                            <Input
                                id="email"
                                type="email"
                                label="Email Address"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors.email}
                                required
                                icon={
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                }
                            />

                            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
                                Send Reset Code
                            </Button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 'otp' && (
                        <form onSubmit={handleOtpSubmit}>
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <label className="input-label" style={{ marginBottom: 'var(--space-4)', display: 'block' }}>
                                    Enter OTP
                                </label>
                                <div className="flex gap-3 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !digit && index > 0) {
                                                    const prevInput = document.getElementById(`otp-${index - 1}`);
                                                    prevInput?.focus();
                                                }
                                            }}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                textAlign: 'center',
                                                fontSize: 'var(--font-size-xl)',
                                                fontWeight: 'var(--font-weight-semibold)',
                                                border: '2px solid var(--color-border)',
                                                borderRadius: 'var(--radius-md)',
                                                transition: 'all var(--transition-fast)',
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'var(--color-primary)';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(var(--color-primary-rgb), 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'var(--color-border)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    ))}
                                </div>
                                {errors.otp && (
                                    <span className="input-error" role="alert" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--space-2)' }}>
                                        {errors.otp}
                                    </span>
                                )}
                            </div>

                            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginBottom: 'var(--space-4)' }}>
                                Verify OTP
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    color: 'var(--color-text-secondary)',
                                    fontSize: 'var(--font-size-sm)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Didn&apos;t receive code? <span style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)' }}>Resend</span>
                            </button>
                        </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 'reset' && (
                        <form onSubmit={handlePasswordReset}>
                            <Input
                                id="password"
                                type="password"
                                label="New Password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.password}
                                hint="Must be at least 8 characters"
                                required
                            />

                            <Input
                                id="confirmPassword"
                                type="password"
                                label="Confirm Password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={errors.confirmPassword}
                                required
                            />

                            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
                                Reset Password
                            </Button>
                        </form>
                    )}
                </div>

                <p
                    style={{
                        textAlign: 'center',
                        marginTop: 'var(--space-6)',
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)',
                    }}
                >
                    <Link
                        href="/auth/login"
                        style={{
                            color: 'var(--color-primary)',
                            fontWeight: 'var(--font-weight-semibold)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-2)',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
}
