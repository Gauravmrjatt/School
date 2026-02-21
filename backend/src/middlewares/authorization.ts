import { AuthorizationError } from '../utils/errors';
import { TokenPayload } from '../utils/auth';
import { logger } from '../utils/logger';

export enum UserRole {
    ADMIN = 'ADMIN',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',
    PARENT = 'PARENT',
}

/**
 * Check if user has required role
 */
export const requireRole = (user: TokenPayload, allowedRoles: UserRole[]): void => {
    if (!allowedRoles.includes(user.role as UserRole)) {
        logger.warn('Authorization failed - insufficient permissions', {
            userId: user.userId,
            userRole: user.role,
            requiredRoles: allowedRoles,
        });
        throw new AuthorizationError('You do not have permission to perform this action');
    }
};

/**
 * Check if user is admin
 */
export const requireAdmin = (user: TokenPayload): void => {
    requireRole(user, [UserRole.ADMIN]);
};

/**
 * Check if user is teacher or admin
 */
export const requireTeacherOrAdmin = (user: TokenPayload): void => {
    requireRole(user, [UserRole.ADMIN, UserRole.TEACHER]);
};

/**
 * Check if user can access student data
 * - Admins: can access all students
 * - Teachers: can access all students
 * - Students: can only access their own data
 * - Parents: can only access their child's data (simplified - would need parent-child relationship)
 */
export const canAccessStudent = (
    user: TokenPayload,
    studentUserId: string
): void => {
    const role = user.role as UserRole;

    // Admins and teachers can access all students
    if (role === UserRole.ADMIN || role === UserRole.TEACHER) {
        return;
    }

    // Students can only access their own data
    if (role === UserRole.STUDENT && user.userId === studentUserId) {
        return;
    }

    // Parents can access their child's data (simplified check)
    // In production, you'd check a parent-child relationship table
    if (role === UserRole.PARENT) {
        // TODO: Implement parent-child relationship check
        logger.warn('Parent access check not fully implemented');
        return;
    }

    throw new AuthorizationError('You do not have permission to access this student data');
};

/**
 * RBAC Permission Matrix
 */
export const PERMISSIONS = {
    // User Management
    CREATE_USER: [UserRole.ADMIN],
    UPDATE_USER: [UserRole.ADMIN],
    DELETE_USER: [UserRole.ADMIN],
    VIEW_ALL_USERS: [UserRole.ADMIN],

    // Student Management
    CREATE_STUDENT: [UserRole.ADMIN],
    UPDATE_STUDENT: [UserRole.ADMIN],
    DELETE_STUDENT: [UserRole.ADMIN],
    VIEW_ALL_STUDENTS: [UserRole.ADMIN, UserRole.TEACHER],
    VIEW_OWN_STUDENT: [UserRole.STUDENT, UserRole.PARENT],

    // Teacher Management
    CREATE_TEACHER: [UserRole.ADMIN],
    UPDATE_TEACHER: [UserRole.ADMIN],
    DELETE_TEACHER: [UserRole.ADMIN],
    VIEW_ALL_TEACHERS: [UserRole.ADMIN],

    // Class Management
    CREATE_CLASS: [UserRole.ADMIN],
    UPDATE_CLASS: [UserRole.ADMIN],
    DELETE_CLASS: [UserRole.ADMIN],
    VIEW_CLASSES: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    ENROLL_STUDENT: [UserRole.ADMIN],

    // Attendance Management
    RECORD_ATTENDANCE: [UserRole.ADMIN, UserRole.TEACHER],
    VIEW_ALL_ATTENDANCE: [UserRole.ADMIN, UserRole.TEACHER],
    VIEW_OWN_ATTENDANCE: [UserRole.STUDENT, UserRole.PARENT],

    // Exam Management
    CREATE_EXAM: [UserRole.ADMIN, UserRole.TEACHER],
    UPDATE_EXAM: [UserRole.ADMIN, UserRole.TEACHER],
    DELETE_EXAM: [UserRole.ADMIN],
    ENTER_MARKS: [UserRole.ADMIN, UserRole.TEACHER],
    VIEW_ALL_RESULTS: [UserRole.ADMIN, UserRole.TEACHER],
    VIEW_OWN_RESULTS: [UserRole.STUDENT, UserRole.PARENT],

    // Fee Management
    CREATE_INVOICE: [UserRole.ADMIN],
    UPDATE_INVOICE: [UserRole.ADMIN],
    DELETE_INVOICE: [UserRole.ADMIN],
    PAY_INVOICE: [UserRole.ADMIN, UserRole.PARENT],
    VIEW_ALL_INVOICES: [UserRole.ADMIN],
    VIEW_OWN_INVOICES: [UserRole.STUDENT, UserRole.PARENT],
} as const;

/**
 * Check if user has specific permission
 */
export const hasPermission = (
    user: TokenPayload,
    permission: keyof typeof PERMISSIONS
): boolean => {
    const allowedRoles = PERMISSIONS[permission] as readonly UserRole[];
    return allowedRoles.includes(user.role as UserRole);
};

/**
 * Require specific permission
 */
export const requirePermission = (
    user: TokenPayload,
    permission: keyof typeof PERMISSIONS
): void => {
    if (!hasPermission(user, permission)) {
        logger.warn('Authorization failed - missing permission', {
            userId: user.userId,
            userRole: user.role,
            requiredPermission: permission,
        });
        throw new AuthorizationError(`You do not have permission: ${permission}`);
    }
};
