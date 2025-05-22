import request from 'supertest';
import * as authService from '../../services/authService';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import app from '../../app';

vi.mock('../../services/authService');

beforeEach(() => {
    vi.clearAllMocks();
});

describe('Auth Controller Integration', () => {
    it('POST /auth/login - success', async () => {
        (authService.authenticateUser as any).mockResolvedValue({
            id: '1',
            username: 'test',
        });
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'test', password: 'pass' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body).toHaveProperty('user');
    });

    it('POST /auth/login - invalid credentials', async () => {
        (authService.authenticateUser as any).mockRejectedValue({
            statusCode: 401,
            message: 'Authentication failed',
            data: { message: 'Invalid credentials' },
        });
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'bad', password: 'bad' });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty(
            'message',
            'Authentication failed',
        );
    });

    it('POST /auth/login - internal error', async () => {
        (authService.authenticateUser as any).mockRejectedValue({
            statusCode: 500,
            message: 'Authentication error',
            data: {},
        });
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'test', password: 'pass' });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Authentication error');
    });

    it('POST /auth/logout - success', async () => {
        (authService.logoutUser as any).mockResolvedValue(undefined);
        const response = await request(app).post('/auth/logout');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Logged out');
    });

    it('POST /auth/logout - error', async () => {
        (authService.logoutUser as any).mockRejectedValue({
            statusCode: 500,
            message: 'Logout failed',
            data: {},
        });
        const response = await request(app).post('/auth/logout');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Logout failed');
    });

    it('POST /auth/logout - not supported', async () => {
        (authService.logoutUser as any).mockRejectedValue({
            statusCode: 500,
            message: 'Logout not supported on this server',
            data: {},
        });
        const response = await request(app).post('/auth/logout');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty(
            'message',
            'Logout not supported on this server',
        );
    });
});
