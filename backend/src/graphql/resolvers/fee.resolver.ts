import { GraphQLContext } from '../context';
import { requireAuth } from '../../middlewares/authentication';
import { requirePermission, canAccessStudent } from '../../middlewares/authorization';
import feesService from '../../modules/fees/fees.service';
import studentsService from '../../modules/students/students.service';

export const feeResolvers = {
    Query: {
        invoices: async (
            _: any,
            { studentId, status }: { studentId?: string; status?: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);

            // If querying for specific student, check access
            if (studentId) {
                const student = await studentsService.getStudentById(studentId);
                canAccessStudent(user, student.user.id);
            } else {
                requirePermission(user, 'VIEW_ALL_INVOICES');
            }

            return await feesService.getInvoices(studentId, status);
        },

        invoice: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
            const user = requireAuth(context);

            const invoice = await feesService.getInvoiceById(id);

            // Check if user can access this invoice
            const student = await studentsService.getStudentById(invoice.student.id);
            canAccessStudent(user, student.user.id);

            return invoice;
        },

        payments: async (
            _: any,
            { invoiceId }: { invoiceId: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);

            const invoice = await feesService.getInvoiceById(invoiceId);
            const student = await studentsService.getStudentById(invoice.student.id);
            canAccessStudent(user, student.user.id);

            return await feesService.getPayments(invoiceId);
        },
    },

    Mutation: {
        createInvoice: async (
            _: any,
            { input }: { input: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'CREATE_INVOICE');

            return await feesService.createInvoice({
                studentId: input.studentId,
                amountDue: input.amountDue,
                dueDate: new Date(input.dueDate),
                description: input.description,
            });
        },

        updateInvoice: async (
            _: any,
            { id, status }: { id: string; status: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'UPDATE_INVOICE');

            return await feesService.updateInvoiceStatus(id, status);
        },

        deleteInvoice: async (
            _: any,
            { id }: { id: string },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'DELETE_INVOICE');

            return await feesService.deleteInvoice(id);
        },

        payInvoice: async (
            _: any,
            { invoiceId, payment }: { invoiceId: string; payment: any },
            context: GraphQLContext
        ) => {
            const user = requireAuth(context);
            requirePermission(user, 'PAY_INVOICE');

            return await feesService.payInvoice(invoiceId, {
                amount: payment.amount,
                method: payment.method,
                txRef: payment.txRef,
            });
        },
    },
};
