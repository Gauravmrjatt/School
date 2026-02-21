import Redis from 'ioredis';
import { logger } from '../utils/logger';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

// Separate Redis client for Pub/Sub (cannot be used for other operations)
export const redisPubClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
});

export const redisSubClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
});

redisPubClient.on('connect', () => {
    logger.info('Redis Pub client connected');
});

redisSubClient.on('connect', () => {
    logger.info('Redis Sub client connected');
});

export class RedisPubSub {
    /**
     * Publish message to a channel
     */
    async publish(channel: string, message: any): Promise<void> {
        try {
            const payload = JSON.stringify(message);
            await redisPubClient.publish(channel, payload);
            logger.debug('Published to Redis channel', { channel });
        } catch (error) {
            logger.error('Redis publish error', { channel, error });
        }
    }

    /**
     * Subscribe to a channel
     */
    async subscribe(channel: string, handler: (message: any) => void): Promise<void> {
        try {
            await redisSubClient.subscribe(channel);
            logger.info('Subscribed to Redis channel', { channel });

            redisSubClient.on('message', (ch, msg) => {
                if (ch === channel) {
                    try {
                        const parsed = JSON.parse(msg);
                        handler(parsed);
                    } catch (error) {
                        logger.error('Error parsing Redis message', { channel, error });
                    }
                }
            });
        } catch (error) {
            logger.error('Redis subscribe error', { channel, error });
        }
    }

    /**
     * Unsubscribe from a channel
     */
    async unsubscribe(channel: string): Promise<void> {
        try {
            await redisSubClient.unsubscribe(channel);
            logger.info('Unsubscribed from Redis channel', { channel });
        } catch (error) {
            logger.error('Redis unsubscribe error', { channel, error });
        }
    }

    /**
     * Get async iterator for GraphQL subscriptions
     */
    asyncIterator<T>(channels: string | string[]): AsyncIterableIterator<T> {
        const channelArray = Array.isArray(channels) ? channels : [channels];
        const pullQueue: Array<(value: IteratorResult<T>) => void> = [];
        const pushQueue: T[] = [];
        let listening = true;

        const pushValue = (message: T) => {
            if (pullQueue.length > 0) {
                const resolver = pullQueue.shift();
                resolver?.({ value: message, done: false });
            } else {
                pushQueue.push(message);
            }
        };

        const pullValue = (): Promise<IteratorResult<T>> => {
            return new Promise((resolve) => {
                if (pushQueue.length > 0) {
                    const message = pushQueue.shift();
                    resolve({ value: message!, done: false });
                } else {
                    pullQueue.push(resolve);
                }
            });
        };

        // Subscribe to all channels
        channelArray.forEach((channel) => {
            this.subscribe(channel, pushValue);
        });

        return {
            next: () => {
                return listening ? pullValue() : Promise.resolve({ value: undefined as any, done: true });
            },
            return: async () => {
                listening = false;
                // Unsubscribe from all channels
                for (const channel of channelArray) {
                    await this.unsubscribe(channel);
                }
                // Resolve all pending promises
                pullQueue.forEach((resolve) => resolve({ value: undefined as any, done: true }));
                pullQueue.length = 0;
                pushQueue.length = 0;
                return { value: undefined as any, done: true };
            },
            throw: async () => {
                listening = false;
                return { value: undefined as any, done: true };
            },
            [Symbol.asyncIterator]() {
                return this;
            },
        };
    }
}

export const pubsub = new RedisPubSub();
export default pubsub;
