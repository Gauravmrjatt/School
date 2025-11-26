import prisma from '../../config/database';
import cache from '../../redis/cache';
import kafkaProducer from '../../kafka/producer';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';

export interface CreateExamData {
    name: string;
    subject: string;
    maxMarks: number;
    examDate: Date;
    classSectionId: string;
}

export interface ExamResultData {
    examId: string;
    studentId: string;
    obtainedMarks: number;
    remarks?: string;
}

export class ExamsService {
    private readonly CACHE_TTL = 3600; // 1 hour

    /**
     * Create a new exam
     */
    async createExam(data: CreateExamData) {
        // Validate class section exists
        const classSection = await prisma.classSection.findUnique({
            where: { id: data.classSectionId },
        });

        if (!classSection) {
            throw new NotFoundError('ClassSection', data.classSectionId);
        }

        const exam = await prisma.exam.create({
            data: {
                name: data.name,
                subject: data.subject,
                maxMarks: data.maxMarks,
                examDate: data.examDate,
                classSectionId: data.classSectionId,
            },
            include: {
                classSection: true,
            },
        });

        logger.info('Exam created', {
            examId: exam.id,
            name: exam.name,
            subject: exam.subject,
        });

        // Invalidate cache
        await cache.invalidatePattern('exams:*');

        return exam;
    }

    /**
     * Get exam by ID
     */
    async getExamById(id: string) {
        const cacheKey = `exam:${id}`;

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const exam = await prisma.exam.findUnique({
            where: { id },
            include: {
                classSection: true,
                results: {
                    include: {
                        student: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        if (!exam) {
            throw new NotFoundError('Exam', id);
        }

        // Cache the result
        await cache.set(cacheKey, exam, this.CACHE_TTL);

        return exam;
    }

    /**
     * Get exams for a class section
     */
    async getExams(classSectionId?: string) {
        const cacheKey = classSectionId
            ? `exams:class:${classSectionId}`
            : 'exams:all';

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const exams = await prisma.exam.findMany({
            where: classSectionId ? { classSectionId } : undefined,
            include: {
                classSection: true,
            },
            orderBy: {
                examDate: 'desc',
            },
        });

        // Cache the result
        await cache.set(cacheKey, exams, this.CACHE_TTL);

        return exams;
    }

    /**
     * Enter marks (bulk operation)
     */
    async enterMarks(results: ExamResultData[]) {
        // Validate exam and students exist
        const examIds = [...new Set(results.map((r) => r.examId))];
        const studentIds = [...new Set(results.map((r) => r.studentId))];

        const [exams, students] = await Promise.all([
            prisma.exam.findMany({
                where: { id: { in: examIds } },
            }),
            prisma.student.findMany({
                where: { id: { in: studentIds } },
            }),
        ]);

        if (exams.length !== examIds.length) {
            throw new NotFoundError('One or more exams not found');
        }

        if (students.length !== studentIds.length) {
            throw new NotFoundError('One or more students not found');
        }

        // Validate marks don't exceed max marks
        const examMap = new Map(exams.map((e) => [e.id, e]));
        for (const result of results) {
            const exam = examMap.get(result.examId);
            if (exam && result.obtainedMarks > exam.maxMarks) {
                throw new ValidationError(
                    `Obtained marks (${result.obtainedMarks}) cannot exceed max marks (${exam.maxMarks})`,
                    'obtainedMarks'
                );
            }
        }

        // Create exam results
        const examResults = await Promise.all(
            results.map(async (result) => {
                const examResult = await prisma.examResult.upsert({
                    where: {
                        examId_studentId: {
                            examId: result.examId,
                            studentId: result.studentId,
                        },
                    },
                    update: {
                        obtainedMarks: result.obtainedMarks,
                        remarks: result.remarks,
                    },
                    create: {
                        examId: result.examId,
                        studentId: result.studentId,
                        obtainedMarks: result.obtainedMarks,
                        remarks: result.remarks,
                    },
                    include: {
                        exam: true,
                        student: {
                            include: {
                                user: true,
                            },
                        },
                    },
                });

                // Publish Kafka event
                await kafkaProducer.publishExamResultsPublished({
                    examId: examResult.examId,
                    studentId: examResult.studentId,
                    resultId: examResult.id,
                    obtainedMarks: examResult.obtainedMarks,
                    maxMarks: examResult.exam.maxMarks,
                    subject: examResult.exam.subject,
                });

                return examResult;
            })
        );

        logger.info('Exam results entered', { count: examResults.length });

        // Invalidate cache
        await cache.invalidatePattern('examResults:*');
        await cache.invalidatePattern('exam:*');

        return examResults;
    }

    /**
     * Get exam results
     */
    async getExamResults(studentId?: string, examId?: string) {
        const cacheKey = `examResults:student:${studentId}:exam:${examId}`;

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const results = await prisma.examResult.findMany({
            where: {
                ...(studentId ? { studentId } : {}),
                ...(examId ? { examId } : {}),
            },
            include: {
                exam: {
                    include: {
                        classSection: true,
                    },
                },
                student: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Cache the result
        await cache.set(cacheKey, results, this.CACHE_TTL);

        return results;
    }

    /**
     * Update exam
     */
    async updateExam(id: string, data: Partial<CreateExamData>) {
        const exam = await prisma.exam.update({
            where: { id },
            data,
            include: {
                classSection: true,
            },
        });

        logger.info('Exam updated', { examId: id });

        // Invalidate cache
        await cache.invalidatePattern('exams:*');
        await cache.del(`exam:${id}`);

        return exam;
    }

    /**
     * Delete exam
     */
    async deleteExam(id: string) {
        await prisma.exam.delete({
            where: { id },
        });

        logger.info('Exam deleted', { examId: id });

        // Invalidate cache
        await cache.invalidatePattern('exams:*');
        await cache.del(`exam:${id}`);

        return true;
    }
}

export const examsService = new ExamsService();
export default examsService;
