import { Kafka, logLevel } from 'kafkajs';
import { logger } from '../utils/logger';

const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'school-management-system';

const toWinstonLogLevel = (level: logLevel) => {
    switch (level) {
        case logLevel.ERROR:
        case logLevel.NOTHING:
            return 'error';
        case logLevel.WARN:
            return 'warn';
        case logLevel.INFO:
            return 'info';
        case logLevel.DEBUG:
            return 'debug';
    }
};

export const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: KAFKA_BROKERS,
    logLevel: logLevel.INFO,
    logCreator: () => {
        return ({ level, log }) => {
            const { message, ...extra } = log;
            logger.log({
                level: toWinstonLogLevel(level),
                message,
                ...extra,
            });
        };
    },
    retry: {
        initialRetryTime: 300,
        retries: 8,
    },
});

export default kafka;
