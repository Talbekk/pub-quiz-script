import { Request, Response } from 'express';
import { getAllParticipants, getParticipantByID } from '../../services/participantService';

export const getParticipants = async (_: Request, res: Response) => {
    const participants = await getAllParticipants();
    res.json({
        status: true,
        message: 'Participants Successfully fetched',
        data: participants,
    });
};

export const getParticipant = async (req: Request, res: Response) => {
    const { userid } = req.params;
    const participant = await getParticipantByID(userid);
    res.json({
        status: true,
        message: 'Participant Successfully fetched',
        data: participant,
    });
};
