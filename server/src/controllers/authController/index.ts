import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { ThrowError } from '../../middlewares/errorHandler';

type User = {
    id: string;
    username: string;
};

type AuthInfo = {
    message?: string;
    [key: string]: any;
};

export const login = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    passport.authenticate(
        'local',
        (err: any, user: User | false, info: AuthInfo) => {
            if (err) {
                return next(
                    new ThrowError(
                        500,
                        'Authentication error',
                        { message: err.message, error: err.error },
                    )
                );
            }
            if (!user) {
                return next(
                    new ThrowError(
                        401,
                        'Authentication failed',
                        { message: info?.message || 'Authentication failed' },
                    )
                );
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(
                        new ThrowError(
                            500,
                            'Login failed',
                            { message: 'Login failed', error: err },
                        )
                    );
                }
                res.json({ message: 'Login successful', user });
            });
        },
    )(req, res, next);
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ message: 'Logged out' });
    });
};
