import { Request, Response } from 'express';
import prisma from '../../client';
import { generatePaginatedResponse } from '../../services/generatePaginatedResponse';

export const getMessages = async (req: Request, res: Response) => {
    const { skip, take } = req.pagination!;
    const [messageCount, messages] = await prisma.$transaction([
        prisma.messages.count(),
        prisma.messages.findMany({
            skip,
            take,
        }),
    ]);
    const response = generatePaginatedResponse({
        status: true,
        message: 'Messages Successfully fetched',
        data: messages,
        collectionCount: messageCount,
        requestPagination: req.pagination!,
    });
    res.json(response);
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
