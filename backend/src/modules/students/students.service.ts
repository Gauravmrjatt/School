import prisma from '../../config/database';
import cache from '../../redis/cache';
import { ValidationError, NotFoundError } from '../../utils/errors';
import { getPaginationParams, createPaginationResult } from '../../utils/pagination';
import { logger } from '../../utils/logger';

export interface CreateStudentData {
    userId: string;
    admissionNo: string;
    dob: Date;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
}

export class StudentsService {
    private readonly CACHE_TTL = 3600; // 1 hour
    private readonly CACHE_PREFIX = 'student:';

    /**
     * Create a new student
     */
    async createStudent(data: CreateStudentData) {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: data.userId },
        });

        if (!user) {
            throw new NotFoundError('User', data.userId);
        }

        // Check if admission number already exists
        const existingStudent = await prisma.student.findUnique({
            where: { admissionNo: data.admissionNo },
        });

        if (existingStudent) {
            throw new ValidationError('Admission number already exists', 'admissionNo');
        }

        // Create student
        const student = await prisma.student.create({
            data: {
                userId: data.userId,
                admissionNo: data.admissionNo,
                dob: data.dob,
                gender: data.gender,
                address: data.address,
            },
            include: {
                user: true,
            },
        });

        logger.info('Student created', { studentId: student.id, admissionNo: student.admissionNo });

        // Cache the student
        await cache.set(`${this.CACHE_PREFIX}${student.id}`, student, this.CACHE_TTL);

        return student;
    }

    /**
     * Get student by ID
     */
    async getStudentById(id: string) {
        // Try cache first
        const cached = await cache.get(`${this.CACHE_PREFIX}${id}`);
        if (cached) {
            logger.debug('Student retrieved from cache', { studentId: id });
            return cached as Awaited<ReturnType<typeof this.fetchStudentFromDb>>;
        }

        return this.fetchStudentFromDb(id);
    }

    /**
     * Fetch student from database (helper for type inference)
     */
    private async fetchStudentFromDb(id: string) {
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                user: true,
                enrollments: {
                    include: {
                        classSection: true,
                    },
                },
            },
        });

        if (!student) {
            throw new NotFoundError('Student', id);
        }

        // Cache the result
        await cache.set(`${this.CACHE_PREFIX}${id}`, student, this.CACHE_TTL);

        return student;
    }

    /**
     * Get students with pagination
     */
    async getStudents(page = 1, limit = 10) {
        const { skip, take } = getPaginationParams(page, limit);

        // Try cache for this page
        const cacheKey = `students:page:${page}:limit:${limit}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            logger.debug('Students list retrieved from cache', { page, limit });
            return cached;
        }

        const [students, total] = await Promise.all([
            prisma.student.findMany({
                skip,
                take,
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.student.count(),
        ]);

        const result = createPaginationResult(students, total, page, limit);

        // Cache the result
        await cache.set(cacheKey, result, this.CACHE_TTL);

        return result;
    }

    /**
     * Update student
     */
    async updateStudent(id: string, data: Partial<CreateStudentData>) {
        const student = await prisma.student.update({
            where: { id },
            data,
            include: {
                user: true,
            },
        });

        logger.info('Student updated', { studentId: student.id });

        // Invalidate cache
        await cache.del(`${this.CACHE_PREFIX}${id}`);
        await cache.invalidatePattern('students:page:*');

        return student;
    }

    /**
     * Delete student
     */
    async deleteStudent(id: string) {
        await prisma.student.delete({
            where: { id },
        });

        logger.info('Student deleted', { studentId: id });

        // Invalidate cache
        await cache.del(`${this.CACHE_PREFIX}${id}`);
        await cache.invalidatePattern('students:page:*');

        return true;
    }

    /**
     * Get student by user ID
     */
    async getStudentByUserId(userId: string) {
        const student = await prisma.student.findUnique({
            where: { userId },
            include: {
                user: true,
            },
        });

        return student;
    }
}

export const studentsService = new StudentsService();
export default studentsService;
