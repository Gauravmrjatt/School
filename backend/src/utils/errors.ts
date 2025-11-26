import { GraphQLError } from 'graphql';

export class AuthenticationError extends GraphQLError {
    constructor(message: string = 'Not authenticated') {
        super(message, {
            extensions: {
                code: 'UNAUTHENTICATED',
            },
        });
    }
}

export class AuthorizationError extends GraphQLError {
    constructor(message: string = 'Not authorized') {
        super(message, {
            extensions: {
                code: 'FORBIDDEN',
            },
        });
    }
}

export class ValidationError extends GraphQLError {
    constructor(message: string, field?: string) {
        super(message, {
            extensions: {
                code: 'BAD_USER_INPUT',
                field,
            },
        });
    }
}

export class NotFoundError extends GraphQLError {
    constructor(resource: string, id?: string) {
        const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
        super(message, {
            extensions: {
                code: 'NOT_FOUND',
                resource,
                id,
            },
        });
    }
}

export class ConflictError extends GraphQLError {
    constructor(message: string) {
        super(message, {
            extensions: {
                code: 'CONFLICT',
            },
        });
    }
}
