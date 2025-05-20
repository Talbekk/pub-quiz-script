import { describe, it, expect, vi } from 'vitest';
import passport from 'passport';
import { authenticateUser, logoutUser } from '.';
import { ThrowError } from '../../middlewares/errorHandler';

vi.mock('passport');

describe('Auth Service', () => {
    describe('authenticateUser', () => {
        it('resolves with user on successful authentication', async () => {
            const mockUser = { id: '1', username: 'test' };
            const req: any = {
                logIn: (user: any, cb: any) => cb(null),
            };

            (passport.authenticate as any).mockImplementation((_strategy: string, cb: any) => {
                return (reqArg: any) => cb(null, mockUser, {});
            });

            await expect(authenticateUser(req)).resolves.toEqual(mockUser);
        });

        it('rejects with ThrowError on authentication failure', async () => {
            const req: any = {
                logIn: vi.fn(),
            };

            (passport.authenticate as any).mockImplementation((_strategy: string, cb: any) => {
                return (reqArg: any) => cb(null, false, { message: 'Invalid credentials' });
            });

            await expect(authenticateUser(req)).rejects.toThrowError(ThrowError);
            await expect(authenticateUser(req)).rejects.toMatchObject({
                statusCode: 401,
                message: 'Authentication failed',
                data: { message: 'Invalid credentials' },
            });
        });

        it('rejects with ThrowError on passport error', async () => {
            const req: any = {
                logIn: vi.fn(),
            };

            (passport.authenticate as any).mockImplementation((_strategy: string, cb: any) => {
                return (reqArg: any) => cb({ message: 'Some error', error: 'details' }, null, {});
            });

            await expect(authenticateUser(req)).rejects.toThrowError(ThrowError);
            await expect(authenticateUser(req)).rejects.toMatchObject({
                statusCode: 500,
                message: 'Authentication error',
            });
        });

        it('rejects with ThrowError on logIn error', async () => {
            const mockUser = { id: '1', username: 'test' };
            const req: any = {
                logIn: (_user: any, cb: any) => cb(new Error('login failed')),
            };

            (passport.authenticate as any).mockImplementation((_strategy: string, cb: any) => {
                return (reqArg: any) => cb(null, mockUser, {});
            });

            await expect(authenticateUser(req)).rejects.toThrowError(ThrowError);
            await expect(authenticateUser(req)).rejects.toMatchObject({
                statusCode: 500,
                message: 'Login failed',
            });
        });
    });

    describe('logoutUser', () => {
        it('resolves when logout succeeds', async () => {
            const req: any = {
                logout: (cb: (err?: any) => void) => cb(),
            };
            await expect(logoutUser(req)).resolves.toBeUndefined();
        });
    
        it('rejects if logout returns an error', async () => {
            const req: any = {
                logout: (cb: (err?: any) => void) => cb(new Error('logout failed')),
            };
            await expect(logoutUser(req)).rejects.toThrow('logout failed');
        });
    
        it('rejects if req.logout is not a function', async () => {
            const req: any = {};
            await expect(logoutUser(req)).rejects.toThrowError(ThrowError);
            await expect(logoutUser(req)).rejects.toMatchObject({
                statusCode: 500,
                message: 'Logout not supported on this server',
            });
        });
    });

    
});
