import { Request, Response } from 'express';
import prisma from '../../client';
import { generatePaginatedResponse } from '../../services/generatePaginatedResponse';

export const getEntries = async (req: Request, res: Response) => {
    const { skip, take } = req.pagination!;
    const [entryCount, entries] = await prisma.$transaction([
        prisma.entries.count(),
        prisma.entries.findMany({
            skip,
            take,
        }),
    ]);
    const response = generatePaginatedResponse({
        status: true,
        message: 'Entries Successfully fetched',
        data: entries,
        collectionCount: entryCount,
        requestPagination: req.pagination!,
    });
    res.json(response);
};

export const getEntry = async (req: Request, res: Response) => {
    const { entryid } = req.params;
    const entry = await prisma.entries.findFirst({
        where: {
            id: entryid,
        },
    });
    res.json({
        status: true,
        message: 'Entry Successfully fetched',
        data: entry,
    });
};
