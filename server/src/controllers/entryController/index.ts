import { Request, Response } from 'express';
import { generatePaginatedResponse } from '../../services/generatePaginatedResponse';
import { getEntryByID, getPaginatedEntries } from '../../services/entryService';

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
    const { entryid } = req.params;
    const entry = await getEntryByID(entryid);
    res.json({
        status: true,
        message: 'Entry Successfully fetched',
        data: entry,
    });
};
