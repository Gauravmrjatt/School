import prisma from '../../config/database';
import cache from '../../redis/cache';
import kafkaProducer from '../../kafka/producer';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';

export interface CreateInvoiceData {
    studentId: string;
    amountDue: number;
    dueDate: Date;
    description?: string;
}

export interface PaymentData {
    amount: number;
    method: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'UPI' | 'CHEQUE';
    txRef?: string;
}

export class FeesService {
    private readonly CACHE_TTL = 1800; // 30 minutes

    /**
     * Create a new fee invoice
     */
    async createInvoice(data: CreateInvoiceData) {
        // Validate student exists
        const student = await prisma.student.findUnique({
            where: { id: data.studentId },
        });

        if (!student) {
            throw new NotFoundError('Student', data.studentId);
        }

        if (data.amountDue <= 0) {
            throw new ValidationError('Amount due must be greater than 0', 'amountDue');
        }

        const invoice = await prisma.feeInvoice.create({
            data: {
                studentId: data.studentId,
                amountDue: data.amountDue,
                dueDate: data.dueDate,
                description: data.description,
                status: 'PENDING',
            },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        logger.info('Invoice created', {
            invoiceId: invoice.id,
            studentId: invoice.studentId,
            amountDue: invoice.amountDue,
        });

        // Invalidate cache
        await cache.invalidatePattern('invoices:*');

        return invoice;
    }

    /**
     * Get invoice by ID
     */
    async getInvoiceById(id: string) {
        const cacheKey = `invoice:${id}`;

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached as Awaited<ReturnType<typeof this.fetchInvoiceFromDb>>;
        }

        return this.fetchInvoiceFromDb(id, cacheKey);
    }

    /**
     * Fetch invoice from database (helper for type inference)
     */
    private async fetchInvoiceFromDb(id: string, cacheKey: string) {
        const invoice = await prisma.feeInvoice.findUnique({
            where: { id },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
                payments: true,
            },
        });

        if (!invoice) {
            throw new NotFoundError('Invoice', id);
        }

        // Cache the result
        await cache.set(cacheKey, invoice, this.CACHE_TTL);

        return invoice;
    }

    /**
     * Get invoices
     */
    async getInvoices(
        studentId?: string,
        status?: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
    ) {
        const cacheKey = `invoices:student:${studentId}:status:${status}`;

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const invoices = await prisma.feeInvoice.findMany({
            where: {
                ...(studentId ? { studentId } : {}),
                ...(status ? { status } : {}),
            },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
                payments: true,
            },
            orderBy: {
                dueDate: 'desc',
            },
        });

        // Cache the result
        await cache.set(cacheKey, invoices, this.CACHE_TTL);

        return invoices;
    }

    /**
     * Pay an invoice
     */
    async payInvoice(invoiceId: string, paymentData: PaymentData) {
        // Get invoice
        const invoice = await prisma.feeInvoice.findUnique({
            where: { id: invoiceId },
            include: {
                payments: true,
                student: true,
            },
        });

        if (!invoice) {
            throw new NotFoundError('Invoice', invoiceId);
        }

        if (invoice.status === 'PAID') {
            throw new ValidationError('Invoice is already paid', 'status');
        }

        if (invoice.status === 'CANCELLED') {
            throw new ValidationError('Cannot pay a cancelled invoice', 'status');
        }

        if (paymentData.amount <= 0) {
            throw new ValidationError('Payment amount must be greater than 0', 'amount');
        }

        // Calculate total paid so far
        const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
        const remainingAmount = invoice.amountDue - totalPaid;

        if (paymentData.amount > remainingAmount) {
            throw new ValidationError(
                `Payment amount (${paymentData.amount}) exceeds remaining amount (${remainingAmount})`,
                'amount'
            );
        }

        // Create payment
        const payment = await prisma.payment.create({
            data: {
                invoiceId,
                amount: paymentData.amount,
                method: paymentData.method,
                txRef: paymentData.txRef,
            },
            include: {
                invoice: {
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

        // Update invoice status if fully paid
        const newTotalPaid = totalPaid + paymentData.amount;
        if (newTotalPaid >= invoice.amountDue) {
            await prisma.feeInvoice.update({
                where: { id: invoiceId },
                data: { status: 'PAID' },
            });
        }

        logger.info('Payment recorded', {
            paymentId: payment.id,
            invoiceId,
            amount: payment.amount,
        });

        // Publish Kafka event
        await kafkaProducer.publishPaymentCompleted({
            paymentId: payment.id,
            invoiceId: payment.invoiceId,
            studentId: invoice.studentId,
            amount: payment.amount,
            method: payment.method,
            txRef: payment.txRef || undefined,
        });

        // Invalidate cache
        await cache.invalidatePattern('invoices:*');
        await cache.del(`invoice:${invoiceId}`);

        return payment;
    }

    /**
     * Get payments for an invoice
     */
    async getPayments(invoiceId: string) {
        const payments = await prisma.payment.findMany({
            where: { invoiceId },
            include: {
                invoice: {
                    include: {
                        student: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                paidAt: 'desc',
            },
        });

        return payments;
    }

    /**
     * Update invoice status
     */
    async updateInvoiceStatus(
        id: string,
        status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
    ) {
        const invoice = await prisma.feeInvoice.update({
            where: { id },
            data: { status },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
                payments: true,
            },
        });

        logger.info('Invoice status updated', { invoiceId: id, status });

        // Invalidate cache
        await cache.invalidatePattern('invoices:*');
        await cache.del(`invoice:${id}`);

        return invoice;
    }

    /**
     * Delete invoice
     */
    async deleteInvoice(id: string) {
        await prisma.feeInvoice.delete({
            where: { id },
        });

        logger.info('Invoice deleted', { invoiceId: id });

        // Invalidate cache
        await cache.invalidatePattern('invoices:*');
        await cache.del(`invoice:${id}`);

        return true;
    }
}

export const feesService = new FeesService();
export default feesService;
