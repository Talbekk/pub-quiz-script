import prisma from '../../test_utils/__mocks__/prisma';
import { describe, expect, it, vi } from 'vitest';
import { getAllParticipants, getParticipantByID } from '.';
import { mockParticipant1, mockParticipants } from '../../test_utils/__mocks__/participants';

vi.mock('../../client', () => ({
    default: prisma,
}));

describe('participantService:', () => {

    describe('getAllParticipants', () => {

        it('getParticipants should return a list of participants', async () => {
            prisma.participants.findMany.mockResolvedValue(mockParticipants);
            const participants = await getAllParticipants();
            expect(participants).toBeInstanceOf(Array);
            expect(participants.length).toBe(2);
            expect(participants[0]).toHaveProperty('id', '1');
            expect(participants[0]).toHaveProperty('full_name', 'Bruce Wayne');
            expect(participants[1]).toHaveProperty('id', '2');
            expect(participants[1]).toHaveProperty('full_name', 'James Bond');
        });
    });

    describe('getParticipantByID', () => {

        it('getParticipantByID should return a participant by ID', async () => {
            prisma.participants.findFirst.mockResolvedValue(mockParticipant1);

            const participant = await getParticipantByID(mockParticipant1.id);
            expect(participant).toBeDefined();
            expect(participant).toHaveProperty('id', mockParticipant1.id);
            expect(participant).toHaveProperty('full_name', mockParticipant1.full_name);
        });

        it('getParticipantByID should throw an error if participant is not found', async () => {
            const userid = 'non-existent-id';
            prisma.participants.findFirst.mockResolvedValue(null);
            await expect(getParticipantByID(userid)).rejects.toThrow('Participant not found');
        });

    });

});