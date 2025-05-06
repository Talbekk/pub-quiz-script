import { Request, Response } from 'express';
import prisma from '../../client';

// Get all participants

export const getQuizzes = async (req: Request, res: Response) => {
    const quizzes = await prisma.quizzes.findMany();
    res.json({
        status: true,
        message: 'Quizzes Successfully fetched',
        data: quizzes,
    });
};

// Get a single user
export const getQuiz = async (req: Request, res: Response) => {
    const { userid } = req.params;
    const quiz = await prisma.quizzes.findFirst({
        where: {
            id: userid,
        },
    });
    res.json({
        status: true,
        message: 'Quiz Successfully fetched',
        data: quiz,
    });
};