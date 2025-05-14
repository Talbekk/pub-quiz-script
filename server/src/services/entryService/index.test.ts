import { describe, it, expect, vi } from 'vitest';
import { getPaginatedEntries } from '.';
import prisma from '../../test_utils/__mocks__/prisma';

vi.mock('../../client', () => ({
    default: prisma,
}));

describe('getPaginatedEntries', () => {
    it('should return paginated entries with the correct count', async () => {
        const mockEntries = [
            { id: '1', created_at: 1234567890, messages: [], player_ref: 'player1', possible_scores: [], quiz_ref: 'quiz1', score: null, validated: false },
            { id: '2', created_at: 1234567891, messages: [], player_ref: 'player2', possible_scores: [], quiz_ref: 'quiz2', score: null, validated: false },
        ];
        prisma.entries.count.mockResolvedValue(50);
        prisma.entries.findMany.mockResolvedValue(mockEntries);

        const requestPagination = {
            skip: 0,
            take: 10,
            page: 1,
            limit: 10,
        };

        const result = await getPaginatedEntries(requestPagination);

        expect(result.entryCount).toBe(50);
        expect(result.entries).toEqual(mockEntries);
        expect(prisma.entries.count).toHaveBeenCalled();
        expect(prisma.entries.findMany).toHaveBeenCalledWith({
            skip: 0,
            take: 10,
        });
    });

    it('should handle empty results gracefully', async () => {
        prisma.entries.count.mockResolvedValue(0);
        prisma.entries.findMany.mockResolvedValue([]);

        const requestPagination = {
            skip: 0,
            take: 10,
            page: 1,
            limit: 10,
        };

        const result = await getPaginatedEntries(requestPagination);

        expect(result.entryCount).toBe(0);
        expect(result.entries).toEqual([]);
    });
});
