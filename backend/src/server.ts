import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { readFileSync } from 'fs';
import { join } from 'path';
import { logger } from './utils/logger';
import { createContext } from './graphql/context';
import resolvers from './graphql/resolvers';
import kafkaProducer from './kafka/producer';
import kafkaConsumer from './kafka/consumer';
import prisma from './config/database';
import redisClient from './config/redis';

const PORT = parseInt(process.env.PORT || '4000', 10);

async function startServer() {
    try {
        // Create Express app
        const app = express();
        const httpServer = http.createServer(app);

        // Load GraphQL schema
        const typeDefs = readFileSync(
            join(__dirname, 'graphql/schema/schema.graphql'),
            'utf-8'
        );

        // Create executable schema
        const schema = makeExecutableSchema({ typeDefs, resolvers });

        // Create WebSocket server for subscriptions
        const wsServer = new WebSocketServer({
            server: httpServer,
            path: '/graphql',
        });

        // Setup WebSocket server with GraphQL subscriptions
        const serverCleanup = useServer(
            {
                schema,
                context: async (ctx) => {
                    // Extract token from connection params
                    const token = ctx.connectionParams?.authorization as string;
                    return createContext({ req: { headers: { authorization: token } } });
                },
            },
            wsServer
        );

        // Create Apollo Server
        const server = new ApolloServer({
            schema,
            plugins: [
                // Proper shutdown for HTTP server
                ApolloServerPluginDrainHttpServer({ httpServer }),
                // Proper shutdown for WebSocket server
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                await serverCleanup.dispose();
                            },
                        };
                    },
                },
            ],
            formatError: (error) => {
                logger.error('GraphQL Error', {
                    message: error.message,
                    path: error.path,
                    extensions: error.extensions,
                });
                return error;
            },
        });

        // Start Apollo Server
        await server.start();

        // Middleware
        app.use(cors());
        app.use(express.json());

        // GraphQL endpoint
        app.use(
            '/graphql',
            expressMiddleware(server, {
                context: async ({ req }) => createContext({ req }),
            })
        );

        // Health check endpoint
        app.get('/health', (_req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                services: {
                    database: 'connected',
                    redis: 'connected',
                    kafka: 'connected',
                },
            });
        });

        // Start Kafka producer
        await kafkaProducer.connect();
        logger.info('Kafka producer connected');

        // Start Kafka consumer
        await kafkaConsumer.start();
        logger.info('Kafka consumer started');

        // Start HTTP server
        await new Promise<void>((resolve) => {
            httpServer.listen(PORT, () => {
                resolve();
            });
        });

        logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        logger.info(`🔌 Subscriptions ready at ws://localhost:${PORT}/graphql`);

        // Graceful shutdown
        const shutdown = async () => {
            logger.info('Shutting down gracefully...');

            // Close HTTP server
            httpServer.close(() => {
                logger.info('HTTP server closed');
            });

            // Disconnect Kafka
            await kafkaProducer.disconnect();
            await kafkaConsumer.disconnect();
            logger.info('Kafka disconnected');

            // Disconnect Prisma
            await prisma.$disconnect();
            logger.info('Prisma disconnected');

            // Disconnect Redis
            await redisClient.quit();
            logger.info('Redis disconnected');

            process.exit(0);
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    } catch (error) {
        logger.error('Failed to start server', { error });
        process.exit(1);
    }
}

startServer();
