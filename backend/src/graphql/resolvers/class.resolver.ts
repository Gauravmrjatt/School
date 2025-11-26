import { GraphQLContext } from '../context';
import { requireAuth } from '../../middlewares/authentication';
import { requirePermission } from '../../middlewares/authorization';
import classesService from '../../modules/classes/classes.service';

export const classResolvers = {
    Query: {
        classSections: async (
            _: any,
            { academicYear }: { academicYear?: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'VIEW_CLASSES');

            return await classesService.getClassSections(academicYear);
        },

        classSection: async (
            _: any,
            { id }: { id: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'VIEW_CLASSES');

            return await classesService.getClassSectionById(id);
        },
    },

    Mutation: {
        createClassSection: async (
            _: any,
            { input }: { input: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'CREATE_CLASS');

            return await classesService.createClassSection({
                className: input.className,
                sectionName: input.sectionName,
                academicYear: input.academicYear,
                capacity: input.capacity,
            });
        },

        updateClassSection: async (
            _: any,
            { id, input }: { id: string; input: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'UPDATE_CLASS');

            return await classesService.updateClassSection(id, {
                className: input.className,
                sectionName: input.sectionName,
                academicYear: input.academicYear,
                capacity: input.capacity,
            });
        },

        deleteClassSection: async (
            _: any,
            { id }: { id: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'DELETE_CLASS');

            return await classesService.deleteClassSection(id);
        },

        enrollStudent: async (
            _: any,
            { studentId, classSectionId }: { studentId: string; classSectionId: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'ENROLL_STUDENT');

            return await classesService.enrollStudent(studentId, classSectionId);
        },
    },
};
