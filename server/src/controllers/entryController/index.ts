import { Request, Response } from 'express';
import prisma from '../../client';

export const getEntries = async (req: Request, res: Response) => {
    const {skip, take, page, limit} = req.pagination!;

    const [entryCount, entries] = await prisma.$transaction([
        prisma.entries.count(),
        prisma.entries.findMany({
            skip,
            take,
        }),
    ]);

    res.json({
        status: true,
        message: 'Entries Successfully fetched',
        data: entries,
        ...(skip + take < entryCount && {
            next: {
                page: page + 1,
                limit: limit,
            },
        }),
        ...(skip > 0 && {
            previous: {
                page: page - 1,
                limit: limit,
            },
        }),
    });
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
