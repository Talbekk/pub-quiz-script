import passport from 'passport';
import { Request } from 'express';
import { ThrowError } from '../../middlewares/errorHandler';

type User = {
    id: string;
    username: string;
};

type AuthInfo = {
    message?: string;
    [key: string]: any;
};

export function authenticateUser(req: Request): Promise<User> {
    return new Promise((resolve, reject) => {
        passport.authenticate(
            'local',
            (err: any, user: User | false, info: AuthInfo) => {
                if (err) {
                    return reject(
                        new ThrowError(
                            500,
                            'Authentication error',
                            { message: err.message, error: err.error },
                        )
                    );
                }
                if (!user) {
                    return reject(
                        new ThrowError(
                            401,
                            'Authentication failed',
                            { message: info?.message || 'Authentication failed' },
                        )
                    );
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return reject(
                            new ThrowError(
                                500,
                                'Login failed',
                                { message: 'Login failed', error: err },
                            )
                        );
                    }
                    resolve(user);
                });
            }
        )(req);
    });
}

export function logoutUser(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof req.logout === 'function') {
            req.logout((err) => {
                if (err) return reject(err);
                resolve();
            });
        } else {
            reject(new ThrowError(500, 'Logout not supported on this server'));
        }
    });
}
