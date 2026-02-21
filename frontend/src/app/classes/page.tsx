'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { BookOpen, Users as UsersIcon } from 'lucide-react';
import { GET_CLASS_SECTIONS } from '@/graphql/queries';
import { isAuthenticated, hasRole } from '@/lib/auth';
import Card from '@/components/ui/Card';

export default function ClassesPage() {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated() || !hasRole(['ADMIN', 'TEACHER'])) {
            router.push('/login');
        }
    }, [router]);

    const { data, loading, error } = useQuery(GET_CLASS_SECTIONS);

    const classes = data?.classSections || [];

    return (
        <div className="container-mobile md:container-tablet lg:container-desktop py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Classes
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage class sections and enrollments
                </p>
            </motion.div>

            {/* Classes Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : error ? (
                <Card className="p-8 text-center">
                    <p className="text-red-600 dark:text-red-400">Error loading classes: {error.message}</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((classSection: any, index: number) => (
                        <motion.div
                            key={classSection.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card hover className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
                                        {classSection.academicYear}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    {classSection.className} - {classSection.sectionName}
                                </h3>

                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <UsersIcon className="w-4 h-4" />
                                            <span>Students</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {classSection.enrollments?.length || 0} / {classSection.capacity}
                                        </span>
                                    </div>

                                    <div className="mt-3">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.min((classSection.enrollments?.length || 0) / classSection.capacity * 100, 100)}%`
                                                }}
                                            ></div>
                                        </div>
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
