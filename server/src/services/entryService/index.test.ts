import prisma from '../../test_utils/__mocks__/prisma';
import { describe, it, expect, vi } from 'vitest';
import { getEntryByID, getPaginatedEntries } from '.';
import { mockEntries, mockEntry1 } from '../../test_utils/__mocks__/entries';
import { requestPagination } from '../../test_utils/__mocks__/pagination';

vi.mock('../../client', () => ({
    default: prisma,
}));

describe('entryService', () => {

    describe('getPaginatedEntries', () => {

        it('should return paginated entries with the correct count', async () => {
            prisma.entries.count.mockResolvedValue(50);
            prisma.entries.findMany.mockResolvedValue(mockEntries);
            prisma.$transaction.mockResolvedValue([50, mockEntries]);
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
            prisma.$transaction.mockResolvedValue([0, []]);
            const result = await getPaginatedEntries(requestPagination);

            expect(result.entryCount).toBe(0);
            expect(result.entries).toEqual([]);
        });
    });

    describe('getEntryByID', () => {

        it('getEntryByID should return an entry by ID', async () => {
            const entryid = "1";
            prisma.entries.findFirst.mockResolvedValue(mockEntry1);

            const entry = await getEntryByID(entryid);
            expect(entry).toBeDefined();
            expect(entry).toHaveProperty('id', entryid);
            expect(entry).toHaveProperty('player_ref', mockEntry1.player_ref);
            expect(entry).toHaveProperty('quiz_ref', mockEntry1.quiz_ref);
        });

        it('getEntryByID should throw an error if entry is not found', async () => {
            const entryid = "non-existent-id";
            prisma.entries.findFirst.mockResolvedValue(null);

            await expect(getEntryByID(entryid)).rejects.toThrow('Entry not found');
        });

    });
    
});
