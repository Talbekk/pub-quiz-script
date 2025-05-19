import { NextFunction, Request, Response } from 'express';
import { generatePaginatedResponse } from '../../services/generatePaginatedResponse';
import {
    getMessageByID,
    getPaginatedMessages,
} from '../../services/messageService';

export const getMessages = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { messageCount, messages } = await getPaginatedMessages(
            req.pagination!,
        );
        const response = generatePaginatedResponse({
            status: true,
            message: 'Messages Successfully fetched',
            data: messages,
            collectionCount: messageCount,
            requestPagination: req.pagination!,
        });
        res.json(response);
    } catch (error) {
        next(error);
    }
};

export const getMessage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { messageid } = req.params;
        const message = await getMessageByID(messageid);
        res.json({
            status: true,
            message: 'Message Successfully fetched',
            data: message,
        });
    } catch (error) {
        next(error);
    }
};
