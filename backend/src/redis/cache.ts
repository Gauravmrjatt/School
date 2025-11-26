import redisClient from '../config/redis';
import { logger } from '../utils/logger';

export class RedisCache {
    /**
     * Get value from cache
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await redisClient.get(key);
            if (!value) return null;
            return JSON.parse(value) as T;
        } catch (error) {
            logger.error('Redis GET error', { key, error });
            return null;
        }
    }

    /**
     * Set value in cache with TTL (in seconds)
     */
    async set(key: string, value: any, ttl: number = 3600): Promise<void> {
        try {
            await redisClient.setex(key, ttl, JSON.stringify(value));
        } catch (error) {
            logger.error('Redis SET error', { key, error });
        }
    }

    /**
     * Delete key from cache
     */
    async del(key: string): Promise<void> {
        try {
            await redisClient.del(key);
        } catch (error) {
            logger.error('Redis DEL error', { key, error });
        }
    }

    /**
     * Delete multiple keys matching pattern
     */
    async invalidatePattern(pattern: string): Promise<void> {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(...keys);
                logger.info('Cache invalidated', { pattern, count: keys.length });
            }
        } catch (error) {
            logger.error('Redis pattern invalidation error', { pattern, error });
        }
    }

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        try {
            const result = await redisClient.exists(key);
            return result === 1;
        } catch (error) {
            logger.error('Redis EXISTS error', { key, error });
            return false;
        }
    }
}

export const cache = new RedisCache();
export default cache;
