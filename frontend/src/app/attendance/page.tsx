'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { isAuthenticated, hasRole } from '@/lib/auth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AttendancePage() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (!isAuthenticated() || !hasRole(['ADMIN', 'TEACHER'])) {
            router.push('/login');
        }
    }, [router]);

    // Mock data for demonstration
    const attendanceData = [
        { id: 1, name: 'John Doe', admissionNo: 'STU2024001', status: 'PRESENT' },
        { id: 2, name: 'Jane Smith', admissionNo: 'STU2024002', status: 'PRESENT' },
        { id: 3, name: 'Mike Johnson', admissionNo: 'STU2024003', status: 'ABSENT' },
        { id: 4, name: 'Sarah Williams', admissionNo: 'STU2024004', status: 'LATE' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'ABSENT':
                return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            case 'LATE':
                return <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'ABSENT':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            case 'LATE':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
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
                    Attendance
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Track and manage student attendance
                </p>
            </motion.div>

            {/* Date Selector */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
            >
                <Card className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Select Date:</span>
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <Button className="w-full sm:w-auto sm:ml-auto">
                            Mark Attendance
                        </Button>
                    </div>
                </Card>
            </motion.div>

            {/* Attendance List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Grade 10-A Attendance
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {attendanceData.map((student, index) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {student.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {student.name}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {student.admissionNo}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(student.status)}
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
                                            {student.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* Summary Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6"
            >
                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Late</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
