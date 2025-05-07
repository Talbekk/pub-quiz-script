import { Request, Response } from 'express';
import prisma from '../../client';

export const getMessages = async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const startIndex = (page - 1) * limit;

    const [messageCount, messages] = await prisma.$transaction([
        prisma.messages.count(),
        prisma.messages.findMany({
            skip: startIndex,
            take: limit,
        }),
    ]);

    res.json({
        status: true,
        message: 'Messages Successfully fetched',
        data: messages,
        ...(startIndex + limit < messageCount && {
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

export const getMessage = async (req: Request, res: Response) => {
    const { messageid } = req.params;
    const message = await prisma.messages.findFirst({
        where: {
            id: messageid,
        },
    });
    res.json({
        status: true,
        message: 'Message Successfully fetched',
        data: message,
    });
};
