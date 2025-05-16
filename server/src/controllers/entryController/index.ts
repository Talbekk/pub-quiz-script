import { Request, Response } from 'express';
import { generatePaginatedResponse } from '../../services/generatePaginatedResponse';
import { getEntryByID, getPaginatedEntries } from '../../services/entryService';
import { ThrowError } from '../../middlewares/errorHandler';

export const getEntries = async (req: Request, res: Response) => {
    const { entryCount, entries } = await getPaginatedEntries(req.pagination!);
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
    try {
        const { entryid } = req.params;
        const entry = await getEntryByID(entryid);
        res.json({
            status: true,
            message: 'Entry Successfully fetched',
            data: entry,
        });
    } catch (error) {
        if (error instanceof ThrowError) {
            res.status(error.statusCode).json({
                status: false,
                message: error.message,
                data: error.data,
            });
        }
        res.status(500).json({
            status: false,
            message: 'Unknown error fetching entry',
        });
    }
};
