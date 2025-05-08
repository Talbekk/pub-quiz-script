import prisma from "../../client";
import { RequestPagination } from "../../middlewares/pagination";

export const getPaginatedEntries = async (requestPagination: RequestPagination) => {
    const { skip, take } = requestPagination;
    const [entryCount, entries] = await prisma.$transaction([
        prisma.entries.count(),
        prisma.entries.findMany({
            skip,
            take,
        }),
    ]);
    return { entryCount, entries };
}