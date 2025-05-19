import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import { getPaginatedEntries, getEntryByID } from '../../services/entryService';
import { generatePaginatedResponse } from '../../services/generatePaginatedResponse';
import request from 'supertest';
import app from '../../app';
import { mockEntries, mockEntry1 } from '../../test_utils/__mocks__/entries';
import { requestPagination as mockPagination } from '../../test_utils/__mocks__/pagination';
import { ThrowError } from '../../middlewares/errorHandler';

vi.mock('../../services/entryService', () => ({
    getPaginatedEntries: vi.fn(),
    getEntryByID: vi.fn(),
}));

vi.mock('../../services/generatePaginatedResponse', () => ({
    generatePaginatedResponse: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe('entryController', () => {
    describe('getEntries', () => {
        it('GET /entries should return a list of entries', async () => {
            const mockResponse = {
                status: true,
                message: 'Entries Successfully fetched',
                data: mockEntries,
                next: { page: 2, limit: 10 },
            };

            (getPaginatedEntries as Mock).mockResolvedValue({
                entryCount: 50,
                entries: mockEntries,
            });
            (generatePaginatedResponse as Mock).mockReturnValue(mockResponse);
            const response = await request(app).get('/entries');

            expect(getPaginatedEntries).toHaveBeenCalledWith(mockPagination);
            expect(generatePaginatedResponse).toHaveBeenCalledWith({
                status: true,
                message: 'Entries Successfully fetched',
                data: mockEntries,
                collectionCount: 50,
                requestPagination: mockPagination,
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it('GET /entries should handle empty results gracefully', async () => {
            const mockResponse = {
                status: true,
                message: 'Entries Successfully fetched',
                data: [],
            };

            (getPaginatedEntries as Mock).mockResolvedValue({
                entryCount: 0,
                entries: [],
            });
            (generatePaginatedResponse as Mock).mockReturnValue(mockResponse);

            const response = await request(app).get('/entries');

            expect(getPaginatedEntries).toHaveBeenCalledWith(mockPagination);
            expect(generatePaginatedResponse).toHaveBeenCalledWith({
                status: true,
                message: 'Entries Successfully fetched',
                data: [],
                collectionCount: 0,
                requestPagination: mockPagination,
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
        });

        it('GET /entries should handle invalid pagination parameters', async () => {
            const response = await request(app).get('/entries?page=-1&limit=0');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('status', false);
            expect(response.body).toHaveProperty(
                'message',
                'Invalid pagination parameters',
            );
        });
    });

    describe('getEntry', () => {
        it('GET /entries/:entryid should return an entry by ID', async () => {
            (getEntryByID as Mock).mockResolvedValue(mockEntry1);

            const response = await request(app).get('/entries/1');

            expect(getEntryByID).toHaveBeenCalledWith('1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                status: true,
                message: 'Entry Successfully fetched',
                data: mockEntry1,
            });
        });

        it('GET /entries/:entryid should handle missing entry gracefully', async () => {
            (getEntryByID as Mock).mockImplementation(() => {
                throw new ThrowError(404, 'Entry not found', {
                    id: 'non-existent-id',
                });
            });

            const response = await request(app).get('/entries/non-existent-id');

            expect(getEntryByID).toHaveBeenCalledWith('non-existent-id');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', false);
            expect(response.body).toHaveProperty('message', 'Entry not found');
            expect(response.body).toHaveProperty('data', {
                id: 'non-existent-id',
            });
        });
    });
});
