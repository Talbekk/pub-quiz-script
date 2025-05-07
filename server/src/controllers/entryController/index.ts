import { Request, Response } from 'express';
import prisma from '../../client';

export const getEntries = async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const startIndex = (page - 1) * limit;

    const [entryCount, entries] = await prisma.$transaction([
        prisma.entries.count(),
        prisma.entries.findMany({
            skip: startIndex,
            take: limit,
        }),
    ]);

    res.json({
        status: true,
        message: 'Entries Successfully fetched',
        data: entries,
        ...(startIndex + limit < entryCount && {
            next: {
                page: page + 1,
                limit: limit,
            },
        }),
        ...(startIndex > 0 && {
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
