import { GraphQLContext } from '../context';
import { requireAuth } from '../../middlewares/authentication';
import { canAccessStudent } from '../../middlewares/authorization';
import pubsub from '../../redis/pubsub';
import { CHANNELS } from '../../kafka/topics';
import studentsService from '../../modules/students/students.service';

export const subscriptionResolvers = {
    Subscription: {
        attendanceRecorded: {
            subscribe: async (
                _: any,
                { classSectionId }: { classSectionId: string },
                context: GraphQLContext
            ) => {
                const user = requireAuth(context);
                // In production, you'd check if user has access to this class section

                const channel = CHANNELS.ATTENDANCE(classSectionId);
                return pubsub.asyncIterator(channel);
            },
            resolve: (payload: any) => {
                return payload.attendanceRecorded;
            },
        },

        examResultPublished: {
            subscribe: async (
                _: any,
                { studentId }: { studentId: string },
                context: GraphQLContext
            ) => {
                const user = requireAuth(context);

                // Check if user can access this student's data
                const student = await studentsService.getStudentById(studentId);
                canAccessStudent(user, student.userId);

                const channel = CHANNELS.EXAM_RESULTS(studentId);
                return pubsub.asyncIterator(channel);
            },
            resolve: (payload: any) => {
                return payload.examResultPublished;
            },
        },
    },
};
