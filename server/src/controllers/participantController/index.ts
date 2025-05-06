import { Request, Response } from 'express';
import prisma from '../../client';

export const getParticipants = async (req: Request, res: Response) => {
    const participants = await prisma.participants.findMany();
    res.json({
        status: true,
        message: 'Participants Successfully fetched',
        data: participants,
    });
};

export const getParticipant = async (req: Request, res: Response) => {
    const { userid } = req.params;
    const particpant = await prisma.participants.findFirst({
        where: {
            id: userid,
        },
    });
    res.json({
        status: true,
        message: 'Participant Successfully fetched',
        data: particpant,
    });
};
