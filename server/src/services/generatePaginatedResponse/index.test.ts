import { describe, it, expect } from 'vitest';
import { generatePaginatedResponse, PaginatedResponse } from '.';

describe('generatePaginatedResponse', () => {

    it('should generate a response with next and previous pagination info', () => {
        const result = generatePaginatedResponse({
            status: true,
            message: 'Data fetched successfully',
            data: [{ id: 1 }, { id: 2 }],
            collectionCount: 100,
            requestPagination: {
                skip: 20,
                take: 10,
                page: 3,
                limit: 10,
            },
        });

        expect(result).toEqual<PaginatedResponse<{ id: number }>>({
            status: true,
            message: 'Data fetched successfully',
            data: [{ id: 1 }, { id: 2 }],
            next: { page: 4, limit: 10 },
            previous: { page: 2, limit: 10 },
        });
    });

    it('should generate a response without next if on the last page', () => {
        const result = generatePaginatedResponse({
            status: true,
            message: 'Data fetched successfully',
            data: [{ id: 1 }, { id: 2 }],
            collectionCount: 22,
            requestPagination: {
                skip: 20,
                take: 10,
                page: 3,
                limit: 10,
            },
        });

        expect(result).toEqual<PaginatedResponse<{ id: number }>>({
            status: true,
            message: 'Data fetched successfully',
            data: [{ id: 1 }, { id: 2 }],
            previous: { page: 2, limit: 10 },
        });
    });

    it('should generate a response without previous if on the first page', () => {
        const result = generatePaginatedResponse({
            status: true,
            message: 'Data fetched successfully',
            data: [{ id: 1 }, { id: 2 }],
            collectionCount: 100,
            requestPagination: {
                skip: 0,
                take: 10,
                page: 1,
                limit: 10,
            },
        });

        expect(result).toEqual<PaginatedResponse<{ id: number }>>({
            status: true,
            message: 'Data fetched successfully',
            data: [{ id: 1 }, { id: 2 }],
            next: { page: 2, limit: 10 },
        });
    });

    it('should generate a response without next and previous if there is only one page', () => {
        const result = generatePaginatedResponse({
            status: true,
            message: 'Data fetched successfully',
            data: [{ id: 1 }, { id: 2 }],
            collectionCount: 2,
            requestPagination: {
                skip: 0,
                take: 10,
                page: 1,
                limit: 10,
            },
        });

        expect(result).toEqual<PaginatedResponse<{ id: number }>>({
            status: true,
            message: 'Data fetched successfully',
            data: [{ id: 1 }, { id: 2 }],
        });
    });
    
});
