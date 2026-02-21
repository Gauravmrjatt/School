'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Phone, Calendar } from 'lucide-react';
import { GET_TEACHERS } from '@/graphql/queries';
import { isAuthenticated, hasRole } from '@/lib/auth';
import Card from '@/components/ui/Card';

export default function TeachersPage() {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated() || !hasRole(['ADMIN'])) {
            router.push('/login');
        }
    }, [router]);

    const { data, loading, error } = useQuery(GET_TEACHERS);

    const teachers = data?.teachers || [];

    return (
        <div className="container-mobile md:container-tablet lg:container-desktop py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Teachers
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage teacher profiles and assignments
                </p>
            </motion.div>

            {/* Teachers Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : error ? (
                <Card className="p-8 text-center">
                    <p className="text-red-600 dark:text-red-400">Error loading teachers: {error.message}</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher: any, index: number) => (
                        <motion.div
                            key={teacher.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card hover className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <GraduationCap className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                                            {teacher.user.name}
                                        </h3>
                                        {teacher.specialization && (
                                            <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">
                                                {teacher.specialization}
                                            </p>
                                        )}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Mail className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{teacher.user.email}</span>
                                            </div>
                                            {teacher.user.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                                    <span>{teacher.user.phone}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                                <span>Joined {new Date(teacher.hireDate).toLocaleDateString()}</span>
                                            </div>
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
