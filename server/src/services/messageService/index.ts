import prisma from '../../client';
import { ThrowError } from '../../middlewares/errorHandler';
import { RequestPagination } from '../../middlewares/pagination';

export const getPaginatedMessages = async (
    requestPagination: RequestPagination,
) => {
    const { skip, take } = requestPagination;
    const [messageCount, messages] = await prisma.$transaction([
        prisma.messages.count(),
        prisma.messages.findMany({
            skip,
            take,
        }),
    ]);
    return { messageCount, messages };
};

export const getMessageByID = async (messageid: string) => {
    const message = await prisma.messages.findFirst({
        where: {
            id: messageid,
        },
    });
    if (!message) {
        throw new ThrowError(404, 'Message not found', { id: messageid });
    }
    return message;
};
