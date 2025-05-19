import prisma from '../../client';
import { ThrowError } from '../../middlewares/errorHandler';

export const getAllParticipants = async () => {
    const participants = await prisma.participants.findMany();
    return participants;
};

export const getParticipantByID = async (userid: string) => {
    const participant = await prisma.participants.findFirst({
        where: {
            id: userid,
        },
    });
    if (!participant) {
        throw new ThrowError(404, 'Participant not found', { id: userid });
    }
    return participant;
};
