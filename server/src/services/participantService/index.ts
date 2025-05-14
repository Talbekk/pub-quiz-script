import prisma from "../../client";

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
        throw new Error('Participant not found');
    }
    return participant;
};