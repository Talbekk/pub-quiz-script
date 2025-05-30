import prisma from '../../client';
import { Quiz } from '../../commands/AddQuizzes';
import { ThrowError } from '../../middlewares/errorHandler';
import { RequestPagination } from '../../middlewares/pagination';

export const getPaginatedQuizzes = async (
    requestPagination: RequestPagination,
) => {
    const { skip, take } = requestPagination;
    const [quizCount, quizzes] = await prisma.$transaction([
        prisma.quizzes.count(),
        prisma.quizzes.findMany({
            skip,
            take,
        }),
    ]);
    const quizIds = quizzes.map((quiz) => quiz.id);
    const entries = await prisma.entries.findMany({
        where: {
            quiz_ref: {
                in: quizIds,
            },
        },
    });
    const updatedQuizzes = quizzes.map((quiz) => {
        const quizEntries = entries.filter(
            (entry) => entry.quiz_ref === quiz.id && entry.score !== null,
        );

        return {
            ...quiz,
            entries: quizEntries,
        };
    });
    return { quizCount, quizzes: updatedQuizzes };
};

export const getQuizByID = async (quizid: string) => {
    const quiz = await prisma.quizzes.findFirst({
        where: {
            id: quizid,
        },
    });
    if (!quiz) {
        throw new ThrowError(404, 'Quiz not found', {
            id: quizid,
        });
    }
    return quiz;
};

export const updateQuizByID = async (quizid: string, data: Partial<Quiz>) => {
    const quiz = await prisma.quizzes.findFirst({
        where: {
            id: quizid,
        },
    });
    if (!quiz) {
        throw new ThrowError(404, 'Quiz not found', {
            id: quizid,
        });
    }
    return prisma.quizzes.update({
        where: {
            id: quizid,
        },
        data,
    });
};
