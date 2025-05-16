import { Request, Response, NextFunction } from 'express';

export class ThrowError extends Error {
    statusCode: number;
    data: { [key: string]: any };

    constructor(statusCode: number, message: string, data: { [key: string]: any } = {}) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}

export const errorHandler = (
    err: Error | ThrowError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error(err);
    if (err instanceof ThrowError) {
        res.status(err.statusCode).json({
            status: false,
            message: err.message,
            data: err.data,
        });
    }
    // Handle unexpected errors
    res.status(500).json({
        status: false,
        message: err?.message || 'Internal Server Error',
        data: {},
    });
};
