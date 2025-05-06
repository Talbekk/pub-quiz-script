import { Request, Response } from 'express';
import prisma from '../../client';

export const getQuizzes = async (req: Request, res: Response) => {
    const quizzes = await prisma.quizzes.findMany();
    res.json({
        status: true,
        message: 'Quizzes Successfully fetched',
        data: quizzes,
    });
};

export const getQuiz = async (req: Request, res: Response) => {
    const { quizid } = req.params;
    const quiz = await prisma.quizzes.findFirst({
        where: {
            id: quizid,
        },
    });
    res.json({
        status: true,
        message: 'Quiz Successfully fetched',
        data: quiz,
    });
};

export const updateQuiz = async (req: Request, res: Response) => {
    const { quizid } = req.params;
    const updatedData = req.body;
    
    const quiz = await prisma.quizzes.update({
        where: { id: quizid },
        data: updatedData,
    });
    
    res.json({
        status: true,
        message: 'Quiz Successfully updated',
        data: quiz,
    });
}
