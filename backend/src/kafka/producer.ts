import { Producer } from 'kafkajs';
import kafka from '../config/kafka';
import { logger } from '../utils/logger';
import {
    TOPICS,
    AttendanceRecordedEvent,
    ExamResultsPublishedEvent,
    PaymentCompletedEvent,
    UserCreatedEvent,
} from './topics';

class KafkaProducer {
    private producer: Producer;
    private isConnected: boolean = false;

    constructor() {
        this.producer = kafka.producer();
    }

    async connect(): Promise<void> {
        if (this.isConnected) return;

        try {
            await this.producer.connect();
            this.isConnected = true;
            logger.info('Kafka producer connected');
        } catch (error) {
            logger.error('Kafka producer connection error', { error });
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) return;

        try {
            await this.producer.disconnect();
            this.isConnected = false;
            logger.info('Kafka producer disconnected');
        } catch (error) {
            logger.error('Kafka producer disconnection error', { error });
        }
    }

    private async sendEvent(topic: string, event: any): Promise<void> {
        try {
            if (!this.isConnected) {
                await this.connect();
            }

            await this.producer.send({
                topic,
                messages: [
                    {
                        value: JSON.stringify(event),
                        timestamp: Date.now().toString(),
                    },
                ],
            });

            logger.info('Kafka event published', { topic, eventType: event.type });
        } catch (error) {
            logger.error('Kafka send error', { topic, error });
            throw error;
        }
    }

    async publishAttendanceRecorded(data: AttendanceRecordedEvent['payload']): Promise<void> {
        const event: AttendanceRecordedEvent = {
            type: 'ATTENDANCE_RECORDED',
            payload: data,
            timestamp: new Date().toISOString(),
        };
        await this.sendEvent(TOPICS.ATTENDANCE_RECORDED, event);
    }

    async publishExamResultsPublished(data: ExamResultsPublishedEvent['payload']): Promise<void> {
        const event: ExamResultsPublishedEvent = {
            type: 'EXAM_RESULTS_PUBLISHED',
            payload: data,
            timestamp: new Date().toISOString(),
        };
        await this.sendEvent(TOPICS.EXAM_RESULTS_PUBLISHED, event);
    }

    async publishPaymentCompleted(data: PaymentCompletedEvent['payload']): Promise<void> {
        const event: PaymentCompletedEvent = {
            type: 'PAYMENT_COMPLETED',
            payload: data,
            timestamp: new Date().toISOString(),
        };
        await this.sendEvent(TOPICS.PAYMENT_COMPLETED, event);
    }

    async publishUserCreated(data: UserCreatedEvent['payload']): Promise<void> {
        const event: UserCreatedEvent = {
            type: 'USER_CREATED',
            payload: data,
            timestamp: new Date().toISOString(),
        };
        await this.sendEvent(TOPICS.USER_CREATED, event);
    }
}

export const kafkaProducer = new KafkaProducer();
export default kafkaProducer;
