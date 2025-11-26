import { GraphQLContext } from '../context';
import { requireAuth } from '../../middlewares/authentication';
import { requirePermission, canAccessStudent } from '../../middlewares/authorization';
import examsService from '../../modules/exams/exams.service';
import studentsService from '../../modules/students/students.service';

export const examResolvers = {
    Query: {
        exams: async (
            _: any,
            { classSectionId }: { classSectionId?: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'VIEW_ALL_RESULTS');

            return await examsService.getExams(classSectionId);
        },

        exam: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
            const user = requireAuth(context);
            requirePermission(user, 'VIEW_ALL_RESULTS');

            return await examsService.getExamById(id);
        },

        examResults: async (
            _: any,
            { studentId, examId }: { studentId?: string; examId?: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);

            // If querying for specific student, check access
            if (studentId) {
                const student = await studentsService.getStudentById(studentId);
                canAccessStudent(user, student.userId);
            } else {
                requirePermission(user, 'VIEW_ALL_RESULTS');
            }

            return await examsService.getExamResults(studentId, examId);
        },
    },

    Mutation: {
        createExam: async (
            _: any,
            { input }: { input: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'CREATE_EXAM');

            return await examsService.createExam({
                name: input.name,
                subject: input.subject,
                maxMarks: input.maxMarks,
                examDate: new Date(input.examDate),
                classSectionId: input.classSectionId,
            });
        },

        updateExam: async (
            _: any,
            { id, input }: { id: string; input: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'UPDATE_EXAM');

            return await examsService.updateExam(id, {
                name: input.name,
                subject: input.subject,
                maxMarks: input.maxMarks,
                examDate: input.examDate ? new Date(input.examDate) : undefined,
                classSectionId: input.classSectionId,
            });
        },

        deleteExam: async (
            _: any,
            { id }: { id: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'DELETE_EXAM');

            return await examsService.deleteExam(id);
        },

        enterMarks: async (
            _: any,
            { results }: { results: any[] },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'ENTER_MARKS');

            const examResults = results.map((result) => ({
                examId: result.examId,
                studentId: result.studentId,
                obtainedMarks: result.obtainedMarks,
                remarks: result.remarks,
            }));

            return await examsService.enterMarks(examResults);
        },
    },
};
