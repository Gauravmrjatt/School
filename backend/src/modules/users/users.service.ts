import prisma from '../../config/database';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../../utils/auth';
import { ValidationError, ConflictError, NotFoundError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import kafkaProducer from '../../kafka/producer';

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
    phone?: string;
}

export class UsersService {
    /**
     * Create a new user
     */
    async createUser(data: CreateUserData) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new ValidationError('Invalid email format', 'email');
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictError('User with this email already exists');
        }

        // Hash password
        const passwordHash = await hashPassword(data.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: data.role,
                phone: data.phone,
            },
        });

        logger.info('User created', { userId: user.id, email: user.email, role: user.role });

        // Publish user created event
        await kafkaProducer.publishUserCreated({
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        });

        return user;
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        return user;
    }

    /**
     * Find user by ID
     */
    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                student: true,
                teacher: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User', id);
        }

        return user;
    }

    /**
     * Validate user credentials and return tokens
     */
    async login(email: string, password: string) {
        const user = await this.findByEmail(email);

        if (!user) {
            throw new ValidationError('Invalid email or password');
        }

        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new ValidationError('Invalid email or password');
        }

        const accessToken = generateAccessToken(user.id, user.role, user.email);
        const refreshToken = generateRefreshToken(user.id);

        logger.info('User logged in', { userId: user.id, email: user.email });

        return {
            accessToken,
            refreshToken,
            user,
        };
    }

    /**
     * Get all users
     */
    async getAllUsers() {
        const users = await prisma.user.findMany({
            include: {
                student: true,
                teacher: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return users;
    }
}

export const usersService = new UsersService();
export default usersService;
