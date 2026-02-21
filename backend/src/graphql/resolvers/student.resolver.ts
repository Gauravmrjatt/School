import { GraphQLContext } from '../context';
import { requireAuth } from '../../middlewares/authentication';
import { requirePermission, canAccessStudent } from '../../middlewares/authorization';
import studentsService from '../../modules/students/students.service';

export const studentResolvers = {
    Query: {
        students: async (
            _: any,
            { page, limit }: { page?: number; limit?: number },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'VIEW_ALL_STUDENTS');

            return await studentsService.getStudents(page, limit);
        },

        student: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
            const user = requireAuth(context);

            const student = await studentsService.getStudentById(id);
            canAccessStudent(user, student.user.id);

            return student;
        },
    },

    Mutation: {
        createStudent: async (
            _: any,
            { input }: { input: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'CREATE_STUDENT');

            return await studentsService.createStudent({
                userId: input.userId,
                admissionNo: input.admissionNo,
                dob: new Date(input.dob),
                gender: input.gender,
                address: input.address,
            });
        },

        updateStudent: async (
            _: any,
            { id, input }: { id: string; input: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'UPDATE_STUDENT');

            return await studentsService.updateStudent(id, {
                userId: input.userId,
                admissionNo: input.admissionNo,
                dob: input.dob ? new Date(input.dob) : undefined,
                gender: input.gender,
                address: input.address,
            });
        },

        deleteStudent: async (
            _: any,
            { id }: { id: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'DELETE_STUDENT');

            return await studentsService.deleteStudent(id);
        },
    },
};
