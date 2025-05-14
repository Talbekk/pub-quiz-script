import prisma from '../../test_utils/__mocks__/prisma';
import { describe, expect, test, vi } from 'vitest';
import { getAllParticipants, getParticipantByID } from '.';

vi.mock('../../client', () => ({
    default: prisma,
}));

describe('participantService:', () => {
    test('getParticipants should return a list of participants', async () => {
        prisma.participants.findMany.mockResolvedValue([
            { id: '1', full_name: 'Alice' },
            { id: '2', full_name: 'Bob' },
        ]);

        const participants = await getAllParticipants();
        expect(participants).toBeInstanceOf(Array);
        expect(participants.length).toBe(2);
        expect(participants[0]).toHaveProperty('full_name', 'Alice');
    });

    test('getParticipantByID should return a participant by ID', async () => {
        const userid = 'some-unique-id';
        prisma.participants.findFirst.mockResolvedValue({ id: userid, full_name: 'John Doe' });

        const participant = await getParticipantByID(userid);
        expect(participant).toBeDefined();
        expect(participant).toHaveProperty('id', userid);
        expect(participant).toHaveProperty('full_name', 'John Doe');
    });
});