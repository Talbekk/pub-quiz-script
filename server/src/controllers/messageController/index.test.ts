import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import {
    mockMessages,
    mockTextMessage,
} from '../../test_utils/__mocks__/messages';
import {
    getMessageByID,
    getPaginatedMessages,
} from '../../services/messageService';
import { generatePaginatedResponse } from '../../services/generatePaginatedResponse';
import { requestPagination as mockPagination } from '../../test_utils/__mocks__/pagination';
import request from 'supertest';
import app from '../../app';
import { ThrowError } from '../../middlewares/errorHandler';

describe('MessageController', () => {
    vi.mock('../../services/messageService', () => ({
        getPaginatedMessages: vi.fn(),
        getMessageByID: vi.fn(),
    }));

    vi.mock('../../services/generatePaginatedResponse', () => ({
        generatePaginatedResponse: vi.fn(),
    }));

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getMessages', () => {
        it('GET /messages should return a list of messages', async () => {
            const mockResponse = {
                status: true,
                message: 'Messages Successfully fetched',
                data: mockMessages,
                next: { page: 2, limit: 10 },
            };

            (getPaginatedMessages as Mock).mockResolvedValue({
                messageCount: 50,
                messages: mockMessages,
            });

            (generatePaginatedResponse as Mock).mockReturnValue(mockResponse);
            const response = await request(app).get('/messages');

            expect(getPaginatedMessages).toHaveBeenCalledWith(mockPagination);
            expect(generatePaginatedResponse).toHaveBeenCalledWith({
                status: true,
                message: 'Messages Successfully fetched',
                data: mockMessages,
                collectionCount: 50,
                requestPagination: mockPagination,
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it('GET /messages should handle empty results gracefully', async () => {
            const mockResponse = {
                status: true,
                message: 'Messages Successfully fetched',
                data: [],
            };

            (getPaginatedMessages as Mock).mockResolvedValue({
                messageCount: 0,
                messages: [],
            });
            (generatePaginatedResponse as Mock).mockReturnValue(mockResponse);

            const response = await request(app).get('/messages');

            expect(getPaginatedMessages).toHaveBeenCalledWith(mockPagination);
            expect(generatePaginatedResponse).toHaveBeenCalledWith({
                status: true,
                message: 'Messages Successfully fetched',
                data: [],
                collectionCount: 0,
                requestPagination: mockPagination,
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it('GET /messages should handle invalid pagination parameters', async () => {
            const response = await request(app).get(
                '/messages?page=-1&limit=0',
            );

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('status', false);
            expect(response.body).toHaveProperty(
                'message',
                'Invalid pagination parameters',
            );
        });
    });
    describe('getMessage', () => {
        it('GET /messages/:messageid should return a message by ID', async () => {
            (getMessageByID as Mock).mockResolvedValue(mockTextMessage);

            const response = await request(app).get('/messages/1');

            expect(getMessageByID).toHaveBeenCalledWith('1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                status: true,
                message: 'Message Successfully fetched',
                data: mockTextMessage,
            });
        });
        it('GET /messages/:messageid should handle not found error gracefully', async () => {
            (getMessageByID as Mock).mockImplementation(() => {
                throw new ThrowError(404, 'Message not found', {
                    id: 'non-existent-id',
                });
            });

            const response = await request(app).get(
                '/messages/non-existent-id',
            );

            expect(getMessageByID).toHaveBeenCalledWith('non-existent-id');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', false);
            expect(response.body).toHaveProperty(
                'message',
                'Message not found',
            );
            expect(response.body).toHaveProperty('data', {
                id: 'non-existent-id',
            });
        });
    });
});
