import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import { mockQuizzes, mockQuiz1 } from '../../test_utils/__mocks__/quizzes';
import {
    getQuizByID,
    getPaginatedQuizzes,
    updateQuizByID,
} from '../../services/quizService';
import { generatePaginatedResponse } from '../../services/generatePaginatedResponse';
import { requestPagination as mockPagination } from '../../test_utils/__mocks__/pagination';
import { isAuthenticated } from '../../middlewares/auth';
import request from 'supertest';
import app from '../../app';
import { ThrowError } from '../../middlewares/errorHandler';

describe('QuizController', () => {
    vi.mock('../../services/quizService', () => ({
        getPaginatedQuizzes: vi.fn(),
        getQuizByID: vi.fn(),
        updateQuizByID: vi.fn(),
    }));

    vi.mock('../../services/generatePaginatedResponse', () => ({
        generatePaginatedResponse: vi.fn(),
    }));

    vi.mock('../../middlewares/auth', () => ({
        isAuthenticated: vi.fn((req, res, next) => next()),
    }));

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getQuizzes', () => {
        it('GET /quizzes should return a list of quizzes', async () => {
            const mockResponse = {
                status: true,
                message: 'Quizzes Successfully fetched',
                data: mockQuizzes,
                next: { page: 2, limit: 10 },
            };

            (getPaginatedQuizzes as Mock).mockResolvedValue({
                quizCount: 50,
                quizzes: mockQuizzes,
            });

            (generatePaginatedResponse as Mock).mockReturnValue(mockResponse);
            const response = await request(app).get('/quizzes');

            expect(getPaginatedQuizzes).toHaveBeenCalledWith(mockPagination);
            expect(generatePaginatedResponse).toHaveBeenCalledWith({
                status: true,
                message: 'Quizzes Successfully fetched',
                data: mockQuizzes,
                collectionCount: 50,
                requestPagination: mockPagination,
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it('GET /quizzes should handle empty results gracefully', async () => {
            const mockResponse = {
                status: true,
                message: 'Quizzes Successfully fetched',
                data: [],
            };

            (getPaginatedQuizzes as Mock).mockResolvedValue({
                quizCount: 0,
                quizzes: [],
            });
            (generatePaginatedResponse as Mock).mockReturnValue(mockResponse);

            const response = await request(app).get('/quizzes');

            expect(getPaginatedQuizzes).toHaveBeenCalledWith(mockPagination);
            expect(generatePaginatedResponse).toHaveBeenCalledWith({
                status: true,
                message: 'Quizzes Successfully fetched',
                data: [],
                collectionCount: 0,
                requestPagination: mockPagination,
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it('GET /quizzes should handle invalid pagination parameters', async () => {
            const response = await request(app).get('/quizzes?page=-1&limit=0');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('status', false);
            expect(response.body).toHaveProperty(
                'message',
                'Invalid pagination parameters',
            );
        });
    });

    describe('getQuiz', () => {
        it('GET /quizzes/:quizid should return a quiz by ID', async () => {
            (getQuizByID as Mock).mockResolvedValue(mockQuiz1);

            const response = await request(app).get('/quizzes/1');

            expect(getQuizByID).toHaveBeenCalledWith('1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                status: true,
                message: 'Quiz Successfully fetched',
                data: mockQuiz1,
            });
        });

        it('GET /quizzes/:quizid should handle not found error gracefully', async () => {
            (getQuizByID as Mock).mockImplementation(() => {
                throw new ThrowError(404, 'Quiz not found', {
                    id: 'non-existent-id',
                });
            });

            const response = await request(app).get('/quizzes/non-existent-id');

            expect(getQuizByID).toHaveBeenCalledWith('non-existent-id');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', false);
            expect(response.body).toHaveProperty('message', 'Quiz not found');
            expect(response.body).toHaveProperty('data', {
                id: 'non-existent-id',
            });
        });
    });

    describe('updateQuiz', () => {
        it('PATCH /quizzes/:quizid should update a quiz by ID when authenticated', async () => {
            (updateQuizByID as Mock).mockResolvedValue(mockQuiz1);

            const response = await request(app)
                .patch('/quizzes/1')
                .send(mockQuiz1);

            expect(updateQuizByID).toHaveBeenCalledWith('1', mockQuiz1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                status: true,
                message: 'Quiz Successfully updated',
                data: mockQuiz1,
            });
        });

        it('PATCH /quizzes/:quizid should handle not authorized error gracefully', async () => {
            (isAuthenticated as Mock).mockImplementation((req, res, next) => {
                throw new ThrowError(
                    401,
                    'You are not authorized to handle this request',
                );
            });

            const response = await request(app)
                .patch('/quizzes/1')
                .send(mockQuiz1);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('status', false);
            expect(response.body).toHaveProperty(
                'message',
                'You are not authorized to handle this request',
            );
            (isAuthenticated as Mock).mockReset();
        });

        it('PATCH /quizzes/:quizid should handle not found error gracefully', async () => {
            (updateQuizByID as Mock).mockImplementation(() => {
                throw new ThrowError(404, 'Quiz not found', {
                    id: 'non-existent-id',
                });
            });

            const response = await request(app)
                .patch('/quizzes/non-existent-id')
                .send(mockQuiz1);

            expect(updateQuizByID).toHaveBeenCalledWith(
                'non-existent-id',
                mockQuiz1,
            );
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', false);
            expect(response.body).toHaveProperty('message', 'Quiz not found');
            expect(response.body).toHaveProperty('data', {
                id: 'non-existent-id',
            });
        });
    });
});
