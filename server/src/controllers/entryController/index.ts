import { NextFunction, Request, Response } from 'express';
import { generatePaginatedResponse } from '../../services/generatePaginatedResponse';
import { getEntryByID, getPaginatedEntries } from '../../services/entryService';

export const getEntries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { entryCount, entries } = await getPaginatedEntries(req.pagination!);
        const response = generatePaginatedResponse({
            status: true,
            message: 'Entries Successfully fetched',
            data: entries,
            collectionCount: entryCount,
            requestPagination: req.pagination!,
        });
        res.json(response);
    } catch (error) {
        next(error);
    }
};

export const getEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { entryid } = req.params;
        const entry = await getEntryByID(entryid);
        res.json({
            status: true,
            message: 'Entry Successfully fetched',
            data: entry,
        });
    } catch (error) {
        next(error);
    }
};
