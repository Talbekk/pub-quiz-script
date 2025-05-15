import prisma from '../../test_utils/__mocks__/prisma';
import { describe, expect, it, vi } from 'vitest';
import { getAllParticipants, getParticipantByID } from '.';

vi.mock('../../client', () => ({
    default: prisma,
}));

describe('participantService:', () => {
    
    it('getParticipants should return a list of participants', async () => {
        prisma.participants.findMany.mockResolvedValue([
            { id: '1', full_name: 'Alice' },
            { id: '2', full_name: 'Bob' },
        ]);

        const participants = await getAllParticipants();
        expect(participants).toBeInstanceOf(Array);
        expect(participants.length).toBe(2);
        expect(participants[0]).toHaveProperty('full_name', 'Alice');
    });

    it('getParticipantByID should return a participant by ID', async () => {
        const userid = 'some-unique-id';
        prisma.participants.findFirst.mockResolvedValue({ id: userid, full_name: 'John Doe' });

        const participant = await getParticipantByID(userid);
        expect(participant).toBeDefined();
        expect(participant).toHaveProperty('id', userid);
        expect(participant).toHaveProperty('full_name', 'John Doe');
    });

    it('getParticipantByID should throw an error if participant is not found', async () => {
        const userid = 'non-existent-id';
        prisma.participants.findFirst.mockResolvedValue(null);
        await expect(getParticipantByID(userid)).rejects.toThrow('Participant not found');
    });

});