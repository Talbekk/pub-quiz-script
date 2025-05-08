import { Request, Response } from 'express';
import prisma from '../../client';

export const getQuizzes = async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const startIndex = (page - 1) * limit;

    const [quizCount, quizzes] = await prisma.$transaction([
        prisma.quizzes.count(),
        prisma.quizzes.findMany({
            skip: startIndex,
            take: limit,
        }),
    ]);

    res.json({
        status: true,
        message: 'Quizzes Successfully fetched',
        data: quizzes,
        ...(startIndex + limit < quizCount && {
            next: {
                page: page + 1,
                limit: limit,
            },
        }),
        ...(startIndex > 0 && {
            previous: {
                page: page - 1,
                limit: limit,
            },
        }),
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
};
