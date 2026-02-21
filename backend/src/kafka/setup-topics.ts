import kafka from '../config/kafka';
import { TOPICS } from './topics';
import { logger } from '../utils/logger';

async function setupTopics() {
    const admin = kafka.admin();

    try {
        await admin.connect();
        logger.info('Kafka admin connected');

        // Create topics
        const topics = Object.values(TOPICS);

        await admin.createTopics({
            topics: topics.map((topic) => ({
                topic,
                numPartitions: 3,
                replicationFactor: 1,
            })),
        });

        logger.info('Kafka topics created', { topics });

        await admin.disconnect();
    } catch (error: any) {
        if (error.type === 'TOPIC_ALREADY_EXISTS') {
            logger.info('Topics already exist');
        } else {
            logger.error('Failed to create topics', { error });
        }
        await admin.disconnect();
    }
}

setupTopics();
