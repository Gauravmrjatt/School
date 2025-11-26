export interface PaginationArgs {
    page?: number;
    limit?: number;
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

/**
 * Calculate pagination offset
 */
export const getPaginationParams = (page = 1, limit = 10) => {
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    const skip = (validPage - 1) * validLimit;

    return {
        skip,
        take: validLimit,
        page: validPage,
        limit: validLimit,
    };
};

/**
 * Create pagination result
 */
export const createPaginationResult = <T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): PaginationResult<T> => {
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};
