import { GraphQLError } from 'graphql';
import { verifyToken, TokenPayload } from '../utils/auth';
import { AuthenticationError } from '../utils/errors';
import { logger } from '../utils/logger';

export interface AuthContext {
    user: TokenPayload | null;
    isAuthenticated: boolean;
}

/**
 * Extract and verify JWT token from request headers
 */
export const authenticate = (authHeader?: string): AuthContext => {
    if (!authHeader) {
        return { user: null, isAuthenticated: false };
    }

    try {
        // Extract token from "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return { user: null, isAuthenticated: false };
        }

        const token = parts[1];
        const user = verifyToken(token);

        return { user, isAuthenticated: true };
    } catch (error) {
        logger.warn('Authentication failed', { error });
        return { user: null, isAuthenticated: false };
    }
};

/**
 * Require authentication - throws error if not authenticated
 */
export const requireAuth = (context: AuthContext): TokenPayload => {
    if (!context.isAuthenticated || !context.user) {
        throw new AuthenticationError('You must be logged in to perform this action');
    }
    return context.user;
};
