import { NextFunction, Request, Response } from 'express';
import { authenticateUser, logoutUser } from '../../services/authService';

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await authenticateUser(req);
        res.json({ message: 'Login successful', user });
    } catch (error) {
        next(error);
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await logoutUser(req);
        res.json({ message: 'Logged out' });
    } catch (err) {
        next(err);
    }
};
