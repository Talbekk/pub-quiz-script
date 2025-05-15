import prisma from '../../test_utils/__mocks__/prisma';
import { describe, it, expect, vi } from 'vitest';
import { getMessageByID, getPaginatedMessages } from '.';
import { requestPagination } from '../../test_utils/__mocks__/pagination';
import { mockMessages, mockTextMessage } from '../../test_utils/__mocks__/messages';

vi.mock('../../client', () => ({
    default: prisma,
}));

describe('messageService', () => {

    describe('getPaginatedMessages', () => {

        it('should return paginated messages with the correct count', async () => {
            prisma.messages.count.mockResolvedValue(50);
            prisma.messages.findMany.mockResolvedValue(mockMessages);
            prisma.$transaction.mockResolvedValue([50, mockMessages]);
            const result = await getPaginatedMessages(requestPagination);

            expect(result.messageCount).toBe(50);
            expect(result.messages).toEqual(mockMessages);
            expect(prisma.messages.count).toHaveBeenCalled();
            expect(prisma.messages.findMany).toHaveBeenCalledWith({
                skip: 0,
                take: 10,
            });
        });

        it('should handle empty results gracefully', async () => {
            prisma.messages.count.mockResolvedValue(0);
            prisma.messages.findMany.mockResolvedValue([]);
            prisma.$transaction.mockResolvedValue([0, []]);
            const result = await getPaginatedMessages(requestPagination);

            expect(result.messageCount).toBe(0);
            expect(result.messages).toEqual([]);
        });
    });
    describe('getMessageByID', () => {

        it('getMessageByID should return a message by ID', async () => {
            const messageid = "1";
            prisma.messages.findFirst.mockResolvedValue(mockTextMessage);

            const message = await getMessageByID(messageid);
            expect(message).toBeDefined();
            expect(message).toHaveProperty('id', messageid);
            expect(message).toHaveProperty('participant_ref', mockTextMessage.participant_ref);
            expect(message).toHaveProperty('content', mockTextMessage.content);
        });

        it('getMessageByID should throw an error if message is not found', async () => {
            const messageid = "non-existent-id";
            prisma.messages.findFirst.mockResolvedValue(null);

            await expect(getMessageByID(messageid)).rejects.toThrow('Message not found');
        });

    });
    
});
