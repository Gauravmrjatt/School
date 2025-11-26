import { GraphQLContext } from '../context';
import { requireAuth } from '../../middlewares/authentication';
import { requirePermission, canAccessStudent } from '../../middlewares/authorization';
import attendanceService from '../../modules/attendance/attendance.service';
import studentsService from '../../modules/students/students.service';

export const attendanceResolvers = {
    Query: {
        attendanceForStudent: async (
            _: any,
            {
                studentId,
                startDate,
                endDate,
            }: { studentId: string; startDate?: string; endDate?: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);

            // Check if user can access this student's data
            const student = await studentsService.getStudentById(studentId);
            canAccessStudent(user, student.userId);

            return await attendanceService.getAttendanceForStudent(
                studentId,
                startDate ? new Date(startDate) : undefined,
                endDate ? new Date(endDate) : undefined
            );
        },

        attendanceForClass: async (
            _: any,
            { classSectionId, date }: { classSectionId: string; date: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'VIEW_ALL_ATTENDANCE');

            return await attendanceService.getAttendanceForClass(
                classSectionId,
                new Date(date)
            );
        },
    },

    Mutation: {
        recordAttendance: async (
            _: any,
            { records }: { records: any[] },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'RECORD_ATTENDANCE');

            const attendanceRecords = records.map((record) => ({
                studentId: record.studentId,
                classSectionId: record.classSectionId,
                date: new Date(record.date),
                status: record.status,
                remarks: record.remarks,
            }));

            return await attendanceService.recordAttendance(
                attendanceRecords,
                user.userId
            );
        },
    },
};
