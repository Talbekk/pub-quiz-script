import prisma from "../../client";

export const getParticipants = async () => {
    const [participantCount, participants] = await prisma.$transaction([
        prisma.participants.count(),
        prisma.participants.findMany(),
    ]);
    return { participantCount, participants };
};