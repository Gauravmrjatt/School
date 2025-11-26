import { authResolvers } from './auth.resolver';
import { studentResolvers } from './student.resolver';
import { classResolvers } from './class.resolver';
import { attendanceResolvers } from './attendance.resolver';
import { examResolvers } from './exam.resolver';
import { feeResolvers } from './fee.resolver';
import { subscriptionResolvers } from './subscription.resolver';
import usersService from '../../modules/users/users.service';
import { requireAuth } from '../../middlewares/authentication';
import { requirePermission } from '../../middlewares/authorization';
import { GraphQLContext } from '../context';

export const resolvers = {
    Query: {
        ...authResolvers.Query,
        ...studentResolvers.Query,
        ...classResolvers.Query,
        ...attendanceResolvers.Query,
        ...examResolvers.Query,
        ...feeResolvers.Query,

        // User queries
        users: async (_: any, __: any, context: GraphQLContext) => {
            const user = requireAuth(context);
            requirePermission(user, 'VIEW_ALL_USERS');
            return await usersService.getAllUsers();
        },

        user: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
            const user = requireAuth(context);
            requirePermission(user, 'VIEW_ALL_USERS');
            return await usersService.findById(id);
        },

        // Teacher queries (simplified - would need a teacher service)
        teachers: async (_: any, __: any, context: GraphQLContext) => {
            const user = requireAuth(context);
            requirePermission(user, 'VIEW_ALL_TEACHERS');

            const users = await context.prisma.user.findMany({
                where: { role: 'TEACHER' },
                include: { teacher: true },
            });

            return users.map(u => u.teacher).filter(Boolean);
        },

        teacher: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
            const user = requireAuth(context);
            requirePermission(user, 'VIEW_ALL_TEACHERS');

            return await context.prisma.teacher.findUnique({
                where: { id },
                include: { user: true },
            });
        },
    },

    Mutation: {
        ...authResolvers.Mutation,
        ...studentResolvers.Mutation,
        ...classResolvers.Mutation,
        ...attendanceResolvers.Mutation,
        ...examResolvers.Mutation,
        ...feeResolvers.Mutation,

        // Teacher mutations (simplified)
        createTeacher: async (
            _: any,
            { input }: { input: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'CREATE_TEACHER');

            return await context.prisma.teacher.create({
                data: {
                    userId: input.userId,
                    hireDate: new Date(input.hireDate),
                    specialization: input.specialization,
                },
                include: { user: true },
            });
        },

        updateTeacher: async (
            _: any,
            { id, input }: { id: string; input: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'UPDATE_TEACHER');

            return await context.prisma.teacher.update({
                where: { id },
                data: {
                    hireDate: input.hireDate ? new Date(input.hireDate) : undefined,
                    specialization: input.specialization,
                },
                include: { user: true },
            });
        },

        deleteTeacher: async (
            _: any,
            { id }: { id: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'DELETE_TEACHER');

            await context.prisma.teacher.delete({ where: { id } });
            return true;
        },
    },

    Subscription: {
        ...subscriptionResolvers.Subscription,
    },
};

export default resolvers;
