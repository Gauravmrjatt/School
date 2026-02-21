'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { GET_INVOICES } from '@/graphql/queries';
import { isAuthenticated, hasRole, getUser } from '@/lib/auth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function FeesPage() {
    const router = useRouter();
    const user = getUser();

    useEffect(() => {
        if (!isAuthenticated() || !hasRole(['ADMIN', 'STUDENT', 'PARENT'])) {
            router.push('/login');
        }
    }, [router]);

    const { data, loading, error } = useQuery(GET_INVOICES, {
        variables: user?.student ? { studentId: user.student.id } : {},
    });

    const invoices = data?.invoices || [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PAID':
                return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'PENDING':
                return <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
            case 'OVERDUE':
                return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'PENDING':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
            case 'OVERDUE':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            case 'CANCELLED':
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400';
            default:
                return '';
        }
    };

    return (
        <div className="container-mobile md:container-tablet lg:container-desktop py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Fee Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    View and manage fee invoices and payments
                </p>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${invoices.filter((inv: any) => inv.status === 'PAID').reduce((sum: number, inv: any) => sum + inv.amountDue, 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${invoices.filter((inv: any) => inv.status === 'PENDING').reduce((sum: number, inv: any) => sum + inv.amountDue, 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${invoices.filter((inv: any) => inv.status === 'OVERDUE').reduce((sum: number, inv: any) => sum + inv.amountDue, 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Invoices List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : error ? (
                <Card className="p-8 text-center">
                    <p className="text-red-600 dark:text-red-400">Error loading invoices: {error.message}</p>
                </Card>
            ) : invoices.length === 0 ? (
                <Card className="p-12 text-center">
                    <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No invoices found</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {invoices.map((invoice: any, index: number) => (
                        <motion.div
                            key={invoice.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                        >
                            <Card hover className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <DollarSign className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                {invoice.description || 'Fee Invoice'}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                                </span>
                                                {invoice.student && (
                                                    <span>Student: {invoice.student.user.name}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ${invoice.amountDue.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(invoice.status)}
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </div>
                                        {invoice.status === 'PENDING' && (
                                            <Button size="sm">Pay Now</Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
