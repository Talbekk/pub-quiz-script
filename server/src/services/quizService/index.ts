import prisma from '../../client';
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
    return { quizCount, quizzes };
};

export const getQuizByID = async (quizid: string) => {
    const quiz = await prisma.quizzes.findFirst({
        where: {
            id: quizid,
        },
    });
    if (!quiz) {
        throw new Error('Quiz not found');
    }
    return quiz;
};
