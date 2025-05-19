import prisma from '../../client';

export const getAllQuizzes = async () => {
    const quizzes = await prisma.quizzes.findMany();
    return quizzes;
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
