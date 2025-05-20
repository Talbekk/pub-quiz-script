import { Request, Response, NextFunction } from 'express';

export class ThrowError extends Error {
    statusCode: number;
    data: { [key: string]: any };

    constructor(
        statusCode: number,
        message: string,
        data: { [key: string]: any } = {},
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error(err);
    const status = err.statusCode || err.status || 500;
    res.status(status).json({
        status: false,
        message: err.message || 'Internal Server Error',
        data: err.data || {},
    });
};
