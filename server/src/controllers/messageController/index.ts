import { Request, Response } from 'express';
import prisma from '../../client';

export const getMessages = async (req: Request, res: Response) => {
    const {skip, take, page, limit} = req.pagination!;

    const [messageCount, messages] = await prisma.$transaction([
        prisma.messages.count(),
        prisma.messages.findMany({
            skip,
            take,
        }),
    ]);
    res.json({
        status: true,
        message: 'Messages Successfully fetched',
        data: messages,
        ...(skip + take < messageCount && {
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
