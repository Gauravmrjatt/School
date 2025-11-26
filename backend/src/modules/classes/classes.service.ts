import prisma from '../../config/database';
import cache from '../../redis/cache';
import { ValidationError, NotFoundError, ConflictError } from '../../utils/errors';
import { logger } from '../../utils/logger';

export interface CreateClassSectionData {
    className: string;
    sectionName: string;
    academicYear: string;
    capacity?: number;
}

export class ClassesService {
    private readonly CACHE_TTL = 3600; // 1 hour
    private readonly CACHE_PREFIX = 'class:';

    /**
     * Create a new class section
     */
    async createClassSection(data: CreateClassSectionData) {
        // Check if class section already exists
        const existing = await prisma.classSection.findUnique({
            where: {
                className_sectionName_academicYear: {
                    className: data.className,
                    sectionName: data.sectionName,
                    academicYear: data.academicYear,
                },
            },
        });

        if (existing) {
            throw new ConflictError('Class section already exists for this academic year');
        }

        const classSection = await prisma.classSection.create({
            data: {
                className: data.className,
                sectionName: data.sectionName,
                academicYear: data.academicYear,
                capacity: data.capacity || 40,
            },
        });

        logger.info('Class section created', {
            classSectionId: classSection.id,
            className: classSection.className,
            sectionName: classSection.sectionName,
        });

        // Invalidate cache
        await cache.invalidatePattern('classSections:*');

        return classSection;
    }

    /**
     * Get all class sections
     */
    async getClassSections(academicYear?: string) {
        const cacheKey = academicYear
            ? `classSections:year:${academicYear}`
            : 'classSections:all';

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            logger.debug('Class sections retrieved from cache');
            return cached;
        }

        const classSections = await prisma.classSection.findMany({
            where: academicYear ? { academicYear } : undefined,
            include: {
                enrollments: {
                    include: {
                        student: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ className: 'asc' }, { sectionName: 'asc' }],
        });

        // Cache the result
        await cache.set(cacheKey, classSections, this.CACHE_TTL);

        return classSections;
    }

    /**
     * Get class section by ID
     */
    async getClassSectionById(id: string) {
        const cacheKey = `${this.CACHE_PREFIX}${id}`;

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const classSection = await prisma.classSection.findUnique({
            where: { id },
            include: {
                enrollments: {
                    include: {
                        student: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                exams: true,
            },
        });

        if (!classSection) {
            throw new NotFoundError('ClassSection', id);
        }

        // Cache the result
        await cache.set(cacheKey, classSection, this.CACHE_TTL);

        return classSection;
    }

    /**
     * Enroll a student in a class section
     */
    async enrollStudent(studentId: string, classSectionId: string) {
        // Check if student exists
        const student = await prisma.student.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            throw new NotFoundError('Student', studentId);
        }

        // Check if class section exists
        const classSection = await prisma.classSection.findUnique({
            where: { id: classSectionId },
            include: {
                enrollments: true,
            },
        });

        if (!classSection) {
            throw new NotFoundError('ClassSection', classSectionId);
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_classSectionId: {
                    studentId,
                    classSectionId,
                },
            },
        });

        if (existingEnrollment) {
            throw new ConflictError('Student is already enrolled in this class section');
        }

        // Check capacity
        if (classSection.enrollments.length >= classSection.capacity) {
            throw new ValidationError('Class section is at full capacity', 'capacity');
        }

        // Create enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                studentId,
                classSectionId,
            },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
                classSection: true,
            },
        });

        logger.info('Student enrolled', { studentId, classSectionId });

        // Invalidate cache
        await cache.invalidatePattern('classSections:*');
        await cache.del(`${this.CACHE_PREFIX}${classSectionId}`);

        return enrollment;
    }

    /**
     * Update class section
     */
    async updateClassSection(id: string, data: Partial<CreateClassSectionData>) {
        const classSection = await prisma.classSection.update({
            where: { id },
            data,
        });

        logger.info('Class section updated', { classSectionId: id });

        // Invalidate cache
        await cache.invalidatePattern('classSections:*');
        await cache.del(`${this.CACHE_PREFIX}${id}`);

        return classSection;
    }

    /**
     * Delete class section
     */
    async deleteClassSection(id: string) {
        await prisma.classSection.delete({
            where: { id },
        });

        logger.info('Class section deleted', { classSectionId: id });

        // Invalidate cache
        await cache.invalidatePattern('classSections:*');
        await cache.del(`${this.CACHE_PREFIX}${id}`);

        return true;
    }
}

export const classesService = new ClassesService();
export default classesService;
