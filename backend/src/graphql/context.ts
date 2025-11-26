import { PrismaClient } from '@prisma/client';
import { authenticate, AuthContext } from '../middlewares/authentication';
import prisma from '../config/database';

export interface GraphQLContext extends AuthContext {
    prisma: PrismaClient;
}

/**
 * Create GraphQL context for each request
 */
export const createContext = ({ req }: any): GraphQLContext => {
    const authHeader = req?.headers?.authorization;
    const authContext = authenticate(authHeader);

    return {
        ...authContext,
        prisma,
    };
};
