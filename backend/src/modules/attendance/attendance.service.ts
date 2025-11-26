import prisma from '../../config/database';
import cache from '../../redis/cache';
import kafkaProducer from '../../kafka/producer';
import { NotFoundError } from '../../utils/errors';
import { logger } from '../../utils/logger';

export interface AttendanceRecordData {
    studentId: string;
    classSectionId: string;
    date: Date;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    remarks?: string;
}

export class AttendanceService {
    private readonly CACHE_TTL = 1800; // 30 minutes

    /**
     * Record attendance (bulk operation)
     */
    async recordAttendance(records: AttendanceRecordData[], recordedBy: string) {
        // Validate all students and class sections exist
        const studentIds = [...new Set(records.map((r) => r.studentId))];
        const classSectionIds = [...new Set(records.map((r) => r.classSectionId))];

        const [students, classSections] = await Promise.all([
            prisma.student.findMany({
                where: { id: { in: studentIds } },
            }),
            prisma.classSection.findMany({
                where: { id: { in: classSectionIds } },
            }),
        ]);

        if (students.length !== studentIds.length) {
            throw new NotFoundError('One or more students not found');
        }

        if (classSections.length !== classSectionIds.length) {
            throw new NotFoundError('One or more class sections not found');
        }

        // Create attendance records
        const attendanceRecords = await Promise.all(
            records.map(async (record) => {
                // Upsert to handle duplicate entries for same student/class/date
                const attendance = await prisma.attendance.upsert({
                    where: {
                        studentId_classSectionId_date: {
                            studentId: record.studentId,
                            classSectionId: record.classSectionId,
                            date: record.date,
                        },
                    },
                    update: {
                        status: record.status,
                        recordedBy,
                        remarks: record.remarks,
                    },
                    create: {
                        studentId: record.studentId,
                        classSectionId: record.classSectionId,
                        date: record.date,
                        status: record.status,
                        recordedBy,
                        remarks: record.remarks,
                    },
                    include: {
                        student: {
                            include: {
                                user: true,
                            },
                        },
                        classSection: true,
                        recorder: true,
                    },
                });

                // Publish Kafka event for each attendance record
                await kafkaProducer.publishAttendanceRecorded({
                    attendanceId: attendance.id,
                    studentId: attendance.studentId,
                    classSectionId: attendance.classSectionId,
                    date: attendance.date.toISOString(),
                    status: attendance.status,
                    recordedBy: attendance.recordedBy,
                });

                return attendance;
            })
        );

        logger.info('Attendance recorded', {
            count: attendanceRecords.length,
            recordedBy,
        });

        // Invalidate cache
        await cache.invalidatePattern('attendance:*');

        return attendanceRecords;
    }

    /**
     * Get attendance for a student
     */
    async getAttendanceForStudent(
        studentId: string,
        startDate?: Date,
        endDate?: Date
    ) {
        const cacheKey = `attendance:student:${studentId}:${startDate?.toISOString()}:${endDate?.toISOString()}`;

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            logger.debug('Attendance retrieved from cache', { studentId });
            return cached;
        }

        const attendance = await prisma.attendance.findMany({
            where: {
                studentId,
                ...(startDate || endDate
                    ? {
                        date: {
                            ...(startDate ? { gte: startDate } : {}),
                            ...(endDate ? { lte: endDate } : {}),
                        },
                    }
                    : {}),
            },
            include: {
                classSection: true,
                recorder: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });

        // Cache the result
        await cache.set(cacheKey, attendance, this.CACHE_TTL);

        return attendance;
    }

    /**
     * Get attendance for a class on a specific date
     */
    async getAttendanceForClass(classSectionId: string, date: Date) {
        const cacheKey = `attendance:class:${classSectionId}:${date.toISOString()}`;

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const attendance = await prisma.attendance.findMany({
            where: {
                classSectionId,
                date,
            },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
                recorder: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                student: {
                    user: {
                        name: 'asc',
                    },
                },
            },
        });

        // Cache the result
        await cache.set(cacheKey, attendance, this.CACHE_TTL);

        return attendance;
    }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
