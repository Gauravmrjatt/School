import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { logger } from './logger';

const JWT_ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
const JWT_REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
const JWT_ACCESS_EXPIRY: string | number = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY: string | number = process.env.JWT_REFRESH_EXPIRY || '7d';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export interface TokenPayload {
    userId: string;
    role: string;
    email: string;
}

/**
 * Generate JWT access token
 */
export const generateAccessToken = (userId: string, role: string, email: string): string => {
    const payload: TokenPayload = { userId, role, email };
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRY } as SignOptions);
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY } as SignOptions);
};

/**
 * Verify and decode JWT token
 */
export const verifyToken = (token: string, isRefreshToken = false): TokenPayload => {
    try {
        const secret = isRefreshToken ? JWT_REFRESH_SECRET : JWT_ACCESS_SECRET;
        const decoded = jwt.verify(token, secret) as TokenPayload;
        return decoded;
    } catch (error) {
        logger.error('Token verification failed', { error });
        throw new Error('Invalid or expired token');
    }
};

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
    try {
        const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        return hash;
    } catch (error) {
        logger.error('Password hashing failed', { error });
        throw new Error('Failed to hash password');
    }
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        logger.error('Password comparison failed', { error });
        throw new Error('Failed to compare password');
    }
};
