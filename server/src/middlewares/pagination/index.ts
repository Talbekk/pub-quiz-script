import { Request, Response, NextFunction } from 'express';
import { ThrowError } from '../errorHandler';

export function pagination(defaultLimit = 10, maxLimit = 100) {
    return (req: Request, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(
            parseInt(req.query.limit as string) || defaultLimit,
            maxLimit,
        );

        if (page < 1 || limit < 1) {
            throw new ThrowError(400, 'Invalid pagination parameters', { page, limit });
        }

        req.pagination = {
            skip: (page - 1) * limit,
            take: limit,
            page,
            limit,
        };

        next();
    };
}

export interface RequestPagination {
    skip: number;
    take: number;
    page: number;
    limit: number;
}

// types/express/index.d.ts
declare global {
    namespace Express {
        interface Request {
            pagination?: RequestPagination;
        }
    }
}