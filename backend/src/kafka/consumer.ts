import { Consumer, EachMessagePayload } from 'kafkajs';
import kafka from '../config/kafka';
import { logger } from '../utils/logger';
import pubsub from '../redis/pubsub';
import {
    TOPICS,
    CHANNELS,
    KafkaEvent,
    AttendanceRecordedEvent,
    ExamResultsPublishedEvent,
    PaymentCompletedEvent,
    UserCreatedEvent,
} from './topics';

const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID || 'school-management-group';

class KafkaConsumerService {
    private consumer: Consumer;
    private isConnected: boolean = false;

    constructor() {
        this.consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });
    }

    async connect(): Promise<void> {
        if (this.isConnected) return;

        try {
            await this.consumer.connect();
            this.isConnected = true;
            logger.info('Kafka consumer connected');
        } catch (error) {
            logger.error('Kafka consumer connection error', { error });
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) return;

        try {
            await this.consumer.disconnect();
            this.isConnected = false;
            logger.info('Kafka consumer disconnected');
        } catch (error) {
            logger.error('Kafka consumer disconnection error', { error });
        }
    }

    async subscribe(): Promise<void> {
        try {
            await this.consumer.subscribe({
                topics: Object.values(TOPICS),
                fromBeginning: false,
            });
            logger.info('Kafka consumer subscribed to topics', { topics: Object.values(TOPICS) });
        } catch (error) {
            logger.error('Kafka consumer subscription error', { error });
            throw error;
        }
    }

    private async handleAttendanceRecorded(event: AttendanceRecordedEvent): Promise<void> {
        const { classSectionId, studentId, date, status } = event.payload;

        // Publish to Redis Pub/Sub for GraphQL subscriptions
        const channel = CHANNELS.ATTENDANCE(classSectionId);
        await pubsub.publish(channel, {
            attendanceRecorded: event.payload,
        });

        logger.info('Attendance event processed', { classSectionId, studentId, date, status });
    }

    private async handleExamResultsPublished(event: ExamResultsPublishedEvent): Promise<void> {
        const { studentId, examId, obtainedMarks, maxMarks } = event.payload;

        // Publish to Redis Pub/Sub for GraphQL subscriptions
        const channel = CHANNELS.EXAM_RESULTS(studentId);
        await pubsub.publish(channel, {
            examResultPublished: event.payload,
        });

        logger.info('Exam result event processed', { studentId, examId, obtainedMarks, maxMarks });
    }

    private async handlePaymentCompleted(event: PaymentCompletedEvent): Promise<void> {
        const { paymentId, invoiceId, amount, studentId } = event.payload;

        // Could trigger notifications, receipts, etc.
        logger.info('Payment event processed', { paymentId, invoiceId, amount, studentId });
    }

    private async handleUserCreated(event: UserCreatedEvent): Promise<void> {
        const { userId, email, role } = event.payload;

        // Could trigger welcome emails, setup tasks, etc.
        logger.info('User created event processed', { userId, email, role });
    }

    private async processMessage(payload: EachMessagePayload): Promise<void> {
        const { topic, message } = payload;

        try {
            const event: KafkaEvent = JSON.parse(message.value?.toString() || '{}');

            switch (event.type) {
                case 'ATTENDANCE_RECORDED':
                    await this.handleAttendanceRecorded(event);
                    break;
                case 'EXAM_RESULTS_PUBLISHED':
                    await this.handleExamResultsPublished(event);
                    break;
                case 'PAYMENT_COMPLETED':
                    await this.handlePaymentCompleted(event);
                    break;
                case 'USER_CREATED':
                    await this.handleUserCreated(event);
                    break;
                default:
                    logger.warn('Unknown event type', { event });
            }
        } catch (error) {
            logger.error('Error processing Kafka message', { topic, error });
        }
    }

    async start(): Promise<void> {
        try {
            await this.connect();
            await this.subscribe();

            await this.consumer.run({
                eachMessage: async (payload) => {
                    await this.processMessage(payload);
                },
            });

            logger.info('Kafka consumer started');
        } catch (error) {
            logger.error('Kafka consumer start error', { error });
            throw error;
        }
    }
}

export const kafkaConsumer = new KafkaConsumerService();
export default kafkaConsumer;
