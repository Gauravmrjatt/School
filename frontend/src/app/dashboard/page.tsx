'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { ME_QUERY, GET_STUDENTS, GET_TEACHERS, GET_CLASS_SECTIONS } from '@/graphql/queries';
import { isAuthenticated, getUser } from '@/lib/auth';
import StatsCard from '@/components/dashboard/StatsCard';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        setUser(getUser());
    }, [router]);

    const { data: studentsData } = useQuery(GET_STUDENTS, {
        variables: { page: 1, limit: 10 },
        skip: !user || !['ADMIN', 'TEACHER'].includes(user?.role),
    });

    const { data: teachersData } = useQuery(GET_TEACHERS, {
        skip: !user || user?.role !== 'ADMIN',
    });

    const { data: classesData } = useQuery(GET_CLASS_SECTIONS, {
        skip: !user || !['ADMIN', 'TEACHER'].includes(user?.role),
    });

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const isAdmin = user.role === 'ADMIN';
    const isTeacher = user.role === 'TEACHER';

    return (
        <div className="container-mobile md:container-tablet lg:container-desktop py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user.name}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Here's what's happening with your school today.
                </p>
            </motion.div>

            {/* Stats Grid */}
            {(isAdmin || isTeacher) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <StatsCard
                            title="Total Students"
                            value={studentsData?.students?.pagination?.total || 0}
                            icon={Users}
                            color="primary"
                            trend={{ value: 12, isPositive: true }}
                        />
                    </motion.div>

                    {isAdmin && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <StatsCard
                                title="Total Teachers"
                                value={teachersData?.teachers?.length || 0}
                                icon={GraduationCap}
                                color="secondary"
                                trend={{ value: 5, isPositive: true }}
                            />
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <StatsCard
                            title="Active Classes"
                            value={classesData?.classSections?.length || 0}
                            icon={BookOpen}
                            color="success"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <StatsCard
                            title="Attendance Rate"
                            value="94.5%"
                            icon={TrendingUp}
                            color="warning"
                            trend={{ value: 2.3, isPositive: true }}
                        />
                    </motion.div>
                </div>
            )}

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Quick Actions
                        </h2>
                        <div className="space-y-3">
                            {isAdmin && (
                                <>
                                    <button
                                        onClick={() => router.push('/students')}
                                        className="w-full flex items-center gap-3 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-left"
                                    >
                                        <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Manage Students</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Add or edit student records</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => router.push('/teachers')}
                                        className="w-full flex items-center gap-3 p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors text-left"
                                    >
                                        <GraduationCap className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Manage Teachers</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">View and update teacher profiles</p>
                                        </div>
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => router.push('/attendance')}
                                className="w-full flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
                            >
                                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Mark Attendance</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Record today's attendance</p>
                                </div>
                            </button>
                            <button
                                onClick={() => router.push('/exams')}
                                className="w-full flex items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-left"
                            >
                                <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">View Exams</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Check exam schedules and results</p>
                                </div>
                            </button>
                        </div>
                    </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        New student enrolled
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Attendance marked for Grade 10-A
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">5 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Exam results published
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">1 day ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Fee payment received
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">2 days ago</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
