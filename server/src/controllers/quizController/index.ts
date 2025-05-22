import { NextFunction, Request, Response } from 'express';
import { getPaginatedQuizzes, getQuizByID, updateQuizByID } from '../../services/quizService';
import { generatePaginatedResponse } from '../../services/generatePaginatedResponse';

export const getQuizzes = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { quizCount, quizzes } = await getPaginatedQuizzes(
            req.pagination!,
        );
        const response = generatePaginatedResponse({
            status: true,
            message: 'Quizzes Successfully fetched',
            data: quizzes,
            collectionCount: quizCount,
            requestPagination: req.pagination!,
        });
        res.json(response);
    } catch (error) {
        next(error);
    }
};

export const getQuiz = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { quizid } = req.params;
        const quiz = await getQuizByID(quizid);
        res.json({
            status: true,
            message: 'Quiz Successfully fetched',
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
};

export const updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quizid } = req.params;
        const updatedData = req.body;
    
        const quiz = await updateQuizByID(quizid, updatedData);
        res.json({
            status: true,
            message: 'Quiz Successfully updated',
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
};
