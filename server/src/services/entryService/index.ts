import prisma from '../../client';
import { RequestPagination } from '../../middlewares/pagination';
import { ThrowError } from '../../middlewares/errorHandler';

export const getPaginatedEntries = async (
    requestPagination: RequestPagination,
) => {
    const { skip, take } = requestPagination;
    const [entryCount, entries] = await prisma.$transaction([
        prisma.entries.count(),
        prisma.entries.findMany({
            skip,
            take,
        }),
    ]);
    return { entryCount, entries };
};

export const getEntryByID = async (entryid: string) => {
    const entry = await prisma.entries.findFirst({
        where: {
            id: entryid,
        },
    });
    if (!entry) {
        throw new ThrowError(404, 'Entry not found', { id: entryid });
    }
    return entry;
};
